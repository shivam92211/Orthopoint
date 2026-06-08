import BlogForm from "@/components/admin/BlogForm";

export default function AddBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create and publish a new blog post.
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
