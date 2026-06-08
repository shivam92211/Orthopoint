import BlogForm from "@/components/admin/BlogForm";
import { Blog } from "@/types";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

async function getBlog(id: string): Promise<Blog | null> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/blogs/${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return (
      <div className="p-8 text-center text-gray-500">Blog post not found.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-500 text-sm mt-1">Update your blog post.</p>
      </div>
      <BlogForm blog={blog} isEdit />
    </div>
  );
}
