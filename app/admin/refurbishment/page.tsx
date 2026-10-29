"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wrench, Trash2, Eye } from "lucide-react";
import { RefurbishmentRequest, RefurbishmentStatus } from "@/types";

const STATUS_OPTIONS: { value: RefurbishmentStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "under_review", label: "Under Review" },
  { value: "assessment_required", label: "Assessment Required" },
  { value: "quotation_sent", label: "Quotation Sent" },
  { value: "approved", label: "Approved" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_COLORS: Record<RefurbishmentStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  assessment_required: "bg-orange-100 text-orange-800",
  quotation_sent: "bg-indigo-100 text-indigo-800",
  approved: "bg-green-100 text-green-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

function labelFor(status: RefurbishmentStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
}

export default function AdminRefurbishmentPage() {
  const [requests, setRequests] = useState<RefurbishmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RefurbishmentRequest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/refurbishment");
      const data = await res.json();
      if (data.success) setRequests(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openDetail = (req: RefurbishmentRequest) => {
    setSelected(req);
    setNotesDraft(req.adminNotes || "");
  };

  const updateStatus = async (id: string, status: RefurbishmentStatus) => {
    const res = await fetch(`/api/refurbishment/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
      if (selected?._id === id) setSelected({ ...selected, status });
    }
  };

  const saveNotes = async () => {
    if (!selected?._id) return;
    const res = await fetch(`/api/refurbishment/${selected._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes: notesDraft }),
    });
    const data = await res.json();
    if (data.success) {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === selected._id ? { ...r, adminNotes: notesDraft } : r
        )
      );
      setSelected({ ...selected, adminNotes: notesDraft });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/refurbishment/${deleteId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setRequests((prev) => prev.filter((r) => r._id !== deleteId));
      if (selected?._id === deleteId) setSelected(null);
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            Refurbishment Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming instrument refurbishment submissions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No refurbishment requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {requests.map((r) => (
            <Card key={r._id} className="hover:shadow transition-shadow">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {r.instrumentName}{" "}
                      <span className="text-sm text-muted-foreground font-normal">
                        × {r.quantity}
                      </span>
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${STATUS_COLORS[r.status]}`}
                    >
                      {labelFor(r.status)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {r.customerName}
                    {r.organizationName ? ` · ${r.organizationName}` : ""} ·{" "}
                    {r.email} · {r.phone}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Submitted{" "}
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateStatus(r._id!, e.target.value as RefurbishmentStatus)
                    }
                    className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <Button variant="outline" size="sm" onClick={() => openDetail(r)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(r._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.instrumentName}</DialogTitle>
                <DialogDescription>
                  Submitted{" "}
                  {selected.createdAt
                    ? new Date(selected.createdAt).toLocaleString()
                    : ""}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Info label="Customer" value={selected.customerName} />
                  <Info label="Organization" value={selected.organizationName || "—"} />
                  <Info label="Email" value={selected.email} />
                  <Info label="Phone" value={selected.phone} />
                  <Info label="Category" value={selected.customerCategory} />
                  <Info label="Quantity" value={String(selected.quantity)} />
                  <Info label="Instrument category" value={selected.instrumentCategory || "—"} />
                  <Info label="Condition" value={selected.condition} />
                </div>

                {selected.reportedIssue && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Reported issue
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">
                      {selected.reportedIssue}
                    </p>
                  </div>
                )}

                {selected.notes && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Customer notes
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">
                      {selected.notes}
                    </p>
                  </div>
                )}

                {selected.images.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">
                      Images
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {selected.images.map((src, idx) => (
                        <a
                          key={idx}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={src}
                            alt={`Submission ${idx + 1}`}
                            className="w-full h-24 object-cover rounded border hover:opacity-90"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Internal admin notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" onClick={saveNotes}>
                      Save notes
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete refurbishment request?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The request record will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="text-foreground break-words">{value}</div>
    </div>
  );
}
