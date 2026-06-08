import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import BlogModel from "@/models/Blog";

// Helper: estimate read time from markdown content (avg 200 wpm)
function calcReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Helper: generate unique slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET — public, returns published blogs (paginated)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(50, Number(searchParams.get("limit") || "12"));
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const all = searchParams.get("all"); // admin: include drafts

    const session = await getServerSession(authOptions);
    const isAdmin = !!session;

    const query: any = {};

    // Non-admin callers only see published posts
    if (!isAdmin || all !== "true") {
      query.status = "published";
    }

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      BlogModel.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogModel.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST — admin only, create a new blog
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();

    // Auto-generate slug from title if not provided
    let slug = body.slug?.trim()
      ? generateSlug(body.slug)
      : generateSlug(body.title || "");

    // Ensure slug uniqueness
    const existing = await BlogModel.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const readTime = calcReadTime(body.content || "");
    const publishedAt =
      body.status === "published" ? body.publishedAt || new Date() : null;

    const blog = await BlogModel.create({
      ...body,
      slug,
      readTime,
      publishedAt,
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
