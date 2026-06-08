import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Blog } from "@/types";

export const revalidate = 60;

const BASE_URL =
  process.env.NEXTAUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/blogs/${slug}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/api/blogs?limit=100`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (data.success) {
      return data.data.map((blog: Blog) => ({ slug: blog.slug }));
    }
  } catch {
    // static generation is best-effort
  }
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: "Blog Not Found | OrthoPoint" };
  }

  return {
    title: `${blog.title} | OrthoPoint Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage?.url ? [blog.coverImage.url] : [],
      type: "article",
      publishedTime: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString()
        : undefined,
    },
  };
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || blog.status !== "published") {
    notFound();
  }

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image */}
      {blog.coverImage?.url && (
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-gray-100">
          <Image
            src={blog.coverImage.url}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Category */}
        {blog.category && (
          <Link
            href={`/blog?category=${encodeURIComponent(blog.category)}`}
            className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-4 hover:bg-primary/20 transition-colors"
          >
            {blog.category}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {blog.author}
          </span>
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {blog.readTime} min read
          </span>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-primary prose-img:rounded-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-600 text-sm px-3 py-1.5 rounded-full transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>
        </div>
      </div>
    </div>
  );
}
