"use client";

import { useState, useEffect } from "react";
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
import { CheckCircle, XCircle } from "lucide-react";
import { Instrument } from "@/types";

interface InstrumentFormProps {
  instrument?: Instrument;
  isEdit?: boolean;
}

export default function InstrumentForm({
  instrument,
  isEdit = false,
}: InstrumentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [messageDialog, setMessageDialog] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
    nextRoute?: string | null;
  }>({ open: false, type: "success", message: "", nextRoute: null });

  const [formData, setFormData] = useState<Partial<Instrument>>({
    name: instrument?.name || "",
    category: instrument?.category || "",
    description: instrument?.description || "",
    specifications: instrument?.specifications || {
      brand: "",
      model: "",
      material: "",
      color: "",
      weight: "",
      dimensions: "",
    },
    price: instrument?.price || 0,
    currency: instrument?.currency || "INR",
    rates: instrument?.rates || (isEdit ? [] : [{ minQuantity: 1, maxQuantity: 10, price: 0 }]),
    greaterThanPrice: instrument?.greaterThanPrice || 0,
    images: instrument?.images || [],
    mainImage: instrument?.mainImage || "",
    available: instrument?.available ?? true,
    featured: instrument?.featured ?? false,
    mostSold: instrument?.mostSold ?? false,
    // whatsappNumber is intentionally omitted so server-side default (env WHATSAPP_PHONE_NUMBER) is used when creating
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.map((c: any) => c.name));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        alert(`File ${files[i].name} is too large. Maximum size is 5MB.`);
        return;
      }
    }

    setUploading(true);

    try {
      // Upload all files in parallel
      const uploadPromises = Array.from(files).map(async (file) => {
        const reader = new FileReader();

        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, folder: formData.category || "general" }),
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Upload failed");
        }
        return data.data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls],
        mainImage: prev.mainImage || uploadedUrls[0],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      setMessageDialog({ open: true, type: "error", message: "Failed to upload one or more images. Please try again.", nextRoute: null });
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit
        ? `/api/instruments/${instrument?._id}`
        : "/api/instruments";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...formData,
        mostSold: !!formData.mostSold,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessageDialog({ open: true, type: "success", message: isEdit ? "Instrument updated successfully" : "Instrument created successfully", nextRoute: "/admin/instruments" });
      } else {
        setMessageDialog({ open: true, type: "error", message: data.error || "Failed to save instrument", nextRoute: null });
      }
    } catch (error) {
      console.error("Error saving instrument:", error);
      setMessageDialog({ open: true, type: "error", message: "An error occurred", nextRoute: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit" : "Add"} Instrument</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quantity-Based Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.rates && formData.rates.length > 0 && (
                <div className="space-y-3">
                  {formData.rates.map((rate, index) => (
                    <div key={index} className="grid md:grid-cols-4 gap-4 items-end p-3 border rounded-md">
                      <div>
                        <label className="block text-sm font-medium mb-2">Min Quantity</label>
                        <Input
                          type="number"
                          min={index > 0 ? (formData.rates || [])[index - 1].maxQuantity + 1 : 1}
                          value={rate.minQuantity}
                          onChange={(e) => {
                            const newRates = [...(formData.rates || [])];
                            const newMinQty = Number(e.target.value);

                            // Calculate the minimum allowed value
                            const minAllowed = index > 0 ? newRates[index - 1].maxQuantity + 1 : 1;

                            // Only update if the new value is valid
                            if (newMinQty >= minAllowed) {
                              newRates[index].minQuantity = newMinQty;
                              // Ensure max quantity is at least equal to min quantity
                              if (newRates[index].maxQuantity < newMinQty) {
                                newRates[index].maxQuantity = newMinQty;
                              }
                              setFormData({ ...formData, rates: newRates });
                            }
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Quantity</label>
                        <Input
                          type="number"
                          min={rate.minQuantity}
                          value={rate.maxQuantity}
                          onChange={(e) => {
                            const newRates = [...(formData.rates || [])];
                            const newMaxQty = Number(e.target.value);
                            // Validate max quantity is not less than min quantity
                            if (newMaxQty >= rate.minQuantity) {
                              newRates[index].maxQuantity = newMaxQty;
                              setFormData({ ...formData, rates: newRates });
                            }
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Price</label>
                        <Input
                          type="number"
                          min="0"
                          value={rate.price}
                          onChange={(e) => {
                            const newRates = [...(formData.rates || [])];
                            newRates[index].price = Number(e.target.value);
                            setFormData({ ...formData, rates: newRates });
                          }}
                          required
                        />
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newRates = formData.rates?.filter((_, i) => i !== index) || [];
                            setFormData({ ...formData, rates: newRates });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Auto-generated "Greater than" rate */}
                  {formData.rates.length > 0 && (
                    <div className="grid md:grid-cols-4 gap-4 items-end p-3 border rounded-md bg-gray-50">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Min Quantity</label>
                        <Input
                          type="number"
                          value={formData.rates[formData.rates.length - 1].maxQuantity + 1}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">Max Quantity</label>
                        <Input
                          type="text"
                          value="∞ (Greater than)"
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Price</label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.greaterThanPrice || 0}
                          onChange={(e) => {
                            setFormData({ ...formData, greaterThanPrice: Number(e.target.value) });
                          }}
                          required
                        />
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 italic">Auto-generated</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentRates = formData.rates || [];
                  let newMinQty = 1;
                  let newMaxQty = 10;

                  // If there are existing rates, set new min to previous max + 1
                  if (currentRates.length > 0) {
                    const lastRate = currentRates[currentRates.length - 1];
                    newMinQty = lastRate.maxQuantity + 1;
                    newMaxQty = newMinQty + 9; // Default range of 10
                  }

                  const newRates = [...currentRates, { minQuantity: newMinQty, maxQuantity: newMaxQty, price: 0 }];
                  setFormData({ ...formData, rates: newRates });
                }}
              >
                Add Rate
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <Input
                  value={formData.specifications?.brand || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        brand: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <Input
                  value={formData.specifications?.model || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        model: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Material</label>
                <Input
                  value={formData.specifications?.material || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        material: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <Input
                  value={formData.specifications?.color || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        color: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight</label>
                <Input
                  value={formData.specifications?.weight || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        weight: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dimensions</label>
                <Input
                  value={formData.specifications?.dimensions || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        dimensions: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div>
            <label className="block text-sm font-medium mb-2">
              Images * {uploading && "(Uploading...)"}
            </label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Image ${idx + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          images: formData.images?.filter((_, i) => i !== idx),
                          mainImage:
                            formData.mainImage === img
                              ? formData.images?.[0] || ""
                              : formData.mainImage,
                        })
                      }
                    >
                      ×
                    </button>
                    {formData.mainImage === img && (
                      <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp number removed from form — server uses WHATSAPP_PHONE_NUMBER env by default */}

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.checked })
                }
              />
              <span className="text-sm">Available</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.mostSold}
                onChange={(e) =>
                  setFormData({ ...formData, mostSold: e.target.checked })
                }
              />
              <span className="text-sm">Most Sold</span>
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Create"} Instrument
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/instruments")}
            >
              Cancel
            </Button>
          </div>
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
        </CardContent>
      </Card>
    </form>
  );
}
