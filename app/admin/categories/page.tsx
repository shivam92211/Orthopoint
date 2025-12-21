"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Trash2, CheckCircle, XCircle } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });
  const [messageDialog, setMessageDialog] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (category: Category) => {
    setDeleteDialog({ open: true, category });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, category: null });
  };

  const handleDelete = async () => {
    if (!deleteDialog.category) return;

    try {
      const response = await fetch(`/api/categories/${deleteDialog.category._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      closeDeleteDialog();

      if (data.success) {
        setMessageDialog({
          open: true,
          type: "success",
          message: "Category deleted successfully!",
        });
        fetchCategories();
      } else {
        setMessageDialog({
          open: true,
          type: "error",
          message: data.error || "Failed to delete category",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessageDialog({
        open: true,
        type: "error",
        message: "An error occurred while deleting the category",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center h-[86px] border-b border-gray-300 -mt-6 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Link href="/admin/categories/add">
          <Button>Add New Category</Button>
        </Link>
      </div>

      <div className="mt-8">
      {loading ? (
        <div className="text-center py-12">Loading categories...</div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No categories found</p>
            <Link href="/admin/categories/add">
              <Button>Add Your First Category</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category._id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon || "📁"}</span>
                  <span className="text-lg">{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description || "No description"}
                </p>
                <div className="text-xs text-muted-foreground mb-4">
                  Slug: <code className="bg-muted px-2 py-1 rounded">{category.slug}</code>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteDialog(category)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>

      <Dialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category &quot;{deleteDialog.category?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ ...messageDialog, open })}>
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
            <Button onClick={() => setMessageDialog({ ...messageDialog, open: false })}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
