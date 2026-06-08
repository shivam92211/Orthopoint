"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, X } from "lucide-react";
import { Blog } from "@/types";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface BlogFormProps {
  blog?: Blog;
  isEdit?: boolean;
}

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: { url: string; publicId: string };
  tags: string[];
  category: string;
  author: string;
  status: "draft" | "published";
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogForm({ blog, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [messageDialog, setMessageDialog] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
    nextRoute?: string | null;
  }>({ open: false, type: "success", message: "", nextRoute: null });

  const [formData, setFormData] = useState<FormData>({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    coverImage: blog?.coverImage || { url: "", publicId: "" },
    tags: blog?.tags || [],
    category: blog?.category || "",
    author: blog?.author || "OrthoPoint Team",
    status: blog?.status || "draft",
  });

  // Auto-generate slug from title (only when creating new)
  useEffect(() => {
    if (!isEdit && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, isEdit]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessageDialog({
        open: true,
        type: "error",
        message: "File too large. Maximum size is 5MB.",
        nextRoute: null,
      });
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, folder: "blog" }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        coverImage: { url: data.data.url, publicId: data.data.publicId },
      }));
    } catch (error) {
      setMessageDialog({
        open: true,
        type: "error",
        message: "Failed to upload cover image. Please try again.",
        nextRoute: null,
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, statusOverride?: "draft" | "published") => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        status: statusOverride || formData.status,
      };

      const url = isEdit ? `/api/blogs/${blog?._id}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessageDialog({
          open: true,
          type: "success",
          message: isEdit ? "Blog updated successfully." : "Blog created successfully.",
          nextRoute: "/admin/blogs",
        });
      } else {
        setMessageDialog({
          open: true,
          type: "error",
          message: data.error || "Failed to save blog.",
          nextRoute: null,
        });
      }
    } catch (error) {
      setMessageDialog({
        open: true,
        type: "error",
        message: "An unexpected error occurred.",
        nextRoute: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Title & Slug */}
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Edit" : "New"} Blog Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter blog title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: generateSlug(e.target.value),
                  })
                }
                placeholder="url-friendly-slug"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /blog/{formData.slug || "your-slug"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt *</label>
              <textarea
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Short description shown in blog listing..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Cover Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cover Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-sm text-gray-500">Uploading...</p>
            )}
            {formData.coverImage.url && (
              <div className="relative inline-block">
                <img
                  src={formData.coverImage.url}
                  alt="Cover"
                  className="h-48 w-auto rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: { url: "", publicId: "" },
                    }))
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g. Orthopaedics, News"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Author name"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content *</CardTitle>
          </CardHeader>
          <CardContent>
            <div data-color-mode="light">
              <MDEditor
                value={formData.content}
                onChange={(val) =>
                  setFormData({ ...formData, content: val || "" })
                }
                height={500}
                preview="edit"
              />
            </div>
            {!formData.content && (
              <p className="text-xs text-red-500 mt-1">Content is required.</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            disabled={loading || uploading}
            onClick={(e) => handleSubmit(e as any, "draft")}
          >
            {loading ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            type="button"
            disabled={loading || uploading || !formData.content}
            onClick={(e) => handleSubmit(e as any, "published")}
          >
            {loading ? "Publishing..." : isEdit ? "Update & Publish" : "Publish"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blogs")}
          >
            Cancel
          </Button>
        </div>
      </div>

      <Dialog
        open={messageDialog.open}
        onOpenChange={(open) => setMessageDialog({ ...messageDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {messageDialog.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {messageDialog.type === "success" ? "Success" : "Error"}
            </DialogTitle>
            <DialogDescription>{messageDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                const next = messageDialog.nextRoute;
                setMessageDialog({ ...messageDialog, open: false });
                if (next) router.push(next);
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
