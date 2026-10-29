"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Upload, X } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const CUSTOMER_CATEGORIES = [
  { value: "surgeon", label: "Surgeon / Individual professional" },
  { value: "hospital", label: "Hospital / Healthcare facility" },
  { value: "dealer", label: "Medical instrument dealer" },
  { value: "distributor", label: "Medical instrument distributor" },
  { value: "other", label: "Other healthcare organization" },
];

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function RefurbishmentForm() {
  const [form, setForm] = useState({
    customerName: "",
    organizationName: "",
    email: "",
    phone: "",
    customerCategory: "surgeon",
    instrumentName: "",
    instrumentCategory: "",
    quantity: 1,
    condition: "",
    reportedIssue: "",
    notes: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      setMessage(`Max ${MAX_IMAGES} images allowed.`);
      setStatus("error");
      return;
    }

    const next: string[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) {
        setMessage("Only image files are allowed.");
        setStatus("error");
        return;
      }
      if (f.size > MAX_IMAGE_BYTES) {
        setMessage(`${f.name} is larger than 5 MB.`);
        setStatus("error");
        return;
      }
      next.push(await toBase64(f));
    }
    setImages((prev) => [...prev, ...next]);
    e.target.value = "";
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/refurbishment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request");
      }
      setStatus("success");
      setMessage(
        "Your refurbishment request was submitted. Our team will review it and get back to you. Note: submission does not guarantee acceptance, repairability, or a confirmed price."
      );
      setForm({
        customerName: "",
        organizationName: "",
        email: "",
        phone: "",
        customerCategory: "surgeon",
        instrumentName: "",
        instrumentCategory: "",
        quantity: 1,
        condition: "",
        reportedIssue: "",
        notes: "",
      });
      setImages([]);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-xl p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground">Refurbishment Request</h2>
      <p className="text-sm text-muted-foreground">
        Fields marked * are required. Submission does not guarantee acceptance, repairability, or a confirmed price.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full name *</label>
          <Input value={form.customerName} onChange={(e) => update("customerName", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Organization name</label>
          <Input value={form.organizationName} onChange={(e) => update("organizationName", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone *</label>
          <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Customer category *</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.customerCategory}
            onChange={(e) => update("customerCategory", e.target.value)}
            required
          >
            {CUSTOMER_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Instrument name *</label>
          <Input value={form.instrumentName} onChange={(e) => update("instrumentName", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Instrument category</label>
          <Input placeholder="e.g. Bone Awl, Retractor" value={form.instrumentCategory} onChange={(e) => update("instrumentCategory", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Quantity *</label>
          <Input type="number" min={1} value={form.quantity} onChange={(e) => update("quantity", Number(e.target.value))} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Current condition *</label>
          <Input placeholder="e.g. Worn tips, bent, rusted" value={form.condition} onChange={(e) => update("condition", e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Reported issue</label>
        <textarea
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={form.reportedIssue}
          onChange={(e) => update("reportedIssue", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Additional notes</label>
        <textarea
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Instrument images (max {MAX_IMAGES}, 5 MB each)</label>
        <Input type="file" accept="image/*" multiple onChange={handleFiles} />
        {images.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-20 object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {status === "error" && message && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
      {status === "success" && message && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          <span className="inline-flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {status === "submitting" ? "Submitting..." : "Submit Request"}
          </span>
        </Button>
      </div>
    </form>
  );
}
