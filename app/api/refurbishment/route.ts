import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import RefurbishmentRequestModel from "@/models/RefurbishmentRequest";
import { uploadImage } from "@/lib/cloudinary";

const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const CUSTOMER_CATEGORIES = [
  "surgeon",
  "hospital",
  "dealer",
  "distributor",
  "other",
] as const;

function estimateBase64Bytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const padding = (b64.match(/=+$/) || [""])[0].length;
  return Math.floor((b64.length * 3) / 4) - padding;
}

// Public POST — create a new refurbishment request
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const {
      customerName,
      organizationName,
      email,
      phone,
      customerCategory,
      instrumentName,
      instrumentCategory,
      quantity,
      condition,
      reportedIssue,
      notes,
      images, // array of base64 data URLs
    } = body;

    // Validation
    const errors: string[] = [];
    if (!customerName || typeof customerName !== "string") errors.push("customerName");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
    if (!phone || typeof phone !== "string" || phone.replace(/\D/g, "").length < 7) errors.push("phone");
    if (!CUSTOMER_CATEGORIES.includes(customerCategory)) errors.push("customerCategory");
    if (!instrumentName || typeof instrumentName !== "string") errors.push("instrumentName");
    if (!quantity || Number(quantity) < 1) errors.push("quantity");
    if (!condition || typeof condition !== "string") errors.push("condition");

    if (errors.length) {
      return NextResponse.json(
        { success: false, error: `Invalid or missing fields: ${errors.join(", ")}` },
        { status: 400 }
      );
    }

    // Images
    const uploadedUrls: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      if (images.length > MAX_IMAGES) {
        return NextResponse.json(
          { success: false, error: `A maximum of ${MAX_IMAGES} images is allowed.` },
          { status: 400 }
        );
      }
      for (const img of images) {
        if (typeof img !== "string" || !img.startsWith("data:image/")) {
          return NextResponse.json(
            { success: false, error: "Only image uploads are supported." },
            { status: 400 }
          );
        }
        if (estimateBase64Bytes(img) > MAX_IMAGE_BYTES) {
          return NextResponse.json(
            { success: false, error: "Each image must be 5 MB or smaller." },
            { status: 400 }
          );
        }
      }
      for (const img of images) {
        const result = await uploadImage(img, "refurbishment");
        uploadedUrls.push(result.url);
      }
    }

    const created = await RefurbishmentRequestModel.create({
      customerName: String(customerName).trim(),
      organizationName: organizationName ? String(organizationName).trim() : undefined,
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      customerCategory,
      instrumentName: String(instrumentName).trim(),
      instrumentCategory: instrumentCategory ? String(instrumentCategory).trim() : undefined,
      quantity: Number(quantity),
      condition: String(condition).trim(),
      reportedIssue: reportedIssue ? String(reportedIssue).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      images: uploadedUrls,
      status: "new",
    });

    return NextResponse.json(
      { success: true, data: { _id: created._id, status: created.status } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Refurbishment POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// Protected GET — list all requests (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const status = request.nextUrl.searchParams.get("status");
    const query: any = {};
    if (status) query.status = status;

    const requests = await RefurbishmentRequestModel.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
