import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import mongoose from "mongoose";
import { deleteImage } from "@/lib/cloudinary";

function calcReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// GET — public: fetch by slug (or _id for admin editing convenience)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    // Support lookup by MongoDB _id for admin edit prefill
    const isObjectId = mongoose.Types.ObjectId.isValid(slug);
    const blog = isObjectId
      ? await BlogModel.findById(slug).lean()
      : await BlogModel.findOne({ slug }).lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT — admin only: update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { slug } = await params;

    const body = await request.json();
    const updateData: any = { ...body };

    // Recalculate read time if content changed
    if (body.content) {
      updateData.readTime = calcReadTime(body.content);
    }

    // Set publishedAt when first publishing
    if (body.status === "published" && !body.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (body.status === "draft") {
      updateData.publishedAt = null;
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(slug);
    const blog = isObjectId
      ? await BlogModel.findByIdAndUpdate(slug, updateData, {
          new: true,
          runValidators: true,
        })
      : await BlogModel.findOneAndUpdate({ slug }, updateData, {
          new: true,
          runValidators: true,
        });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE — admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { slug } = await params;

    const isObjectId = mongoose.Types.ObjectId.isValid(slug);
    const blog = isObjectId
      ? await BlogModel.findByIdAndDelete(slug)
      : await BlogModel.findOneAndDelete({ slug });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Delete cover image from Cloudinary if it exists
    if (blog.coverImage?.publicId) {
      try {
        await deleteImage(blog.coverImage.publicId);
      } catch (err) {
        // Log but don't fail the request — the DB record is already gone
        console.error("Cloudinary delete failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
