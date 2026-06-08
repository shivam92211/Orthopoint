import { Metadata } from "next";
import BlogCard from "@/components/public/BlogCard";
import { Blog } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | OrthoPoint — Orthopaedic & Surgical Instruments",
  description:
    "Stay updated with the latest news, guides, and insights on orthopaedic and surgical instruments from OrthoPoint.",
};

async function getBlogs(
  page = 1,
  category?: string,
  tag?: string
): Promise<{ blogs: Blog[]; total: number; totalPages: number }> {
  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const params = new URLSearchParams({
      page: String(page),
      limit: "12",
    });
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);

    const res = await fetch(`${baseUrl}/api/blogs?${params}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();

    if (data.success) {
      return {
        blogs: data.data,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      };
    }
    return { blogs: [], total: 0, totalPages: 0 };
  } catch {
    return { blogs: [], total: 0, totalPages: 0 };
  }
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page, category, tag } = await searchParams;
  const currentPage = Number(page || "1");

  const { blogs, total, totalPages } = await getBlogs(
    currentPage,
    category,
    tag
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Insights, guides, and news on orthopaedic and surgical instruments.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Active filters */}
        {(category || tag) && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500">Filtering by:</span>
            {category && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                Category: {category}
                <a href="/blog" className="ml-1 hover:text-red-500">
                  ×
                </a>
              </span>
            )}
            {tag && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                Tag: {tag}
                <a href="/blog" className="ml-1 hover:text-red-500">
                  ×
                </a>
              </span>
            )}
            <span className="text-sm text-gray-400">({total} results)</span>
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">No blog posts yet.</p>
            <p className="text-sm mt-2">Check back soon for updates.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => {
                    const params = new URLSearchParams();
                    params.set("page", String(p));
                    if (category) params.set("category", category);
                    if (tag) params.set("tag", tag);

                    return (
                      <a
                        key={p}
                        href={`/blog?${params}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          p === currentPage
                            ? "bg-primary text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {p}
                      </a>
                    );
                  }
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
