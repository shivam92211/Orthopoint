"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Client } from "@/types";

export default function ManageClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    client: Client | null;
  }>({ open: false, client: null });
  const [messageDialog, setMessageDialog] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      const data = await response.json();

      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (client: Client) => {
    setDeleteDialog({ open: true, client });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, client: null });
  };

  const handleDelete = async () => {
    if (!deleteDialog.client) return;

    try {
      const response = await fetch(`/api/clients/${deleteDialog.client._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      closeDeleteDialog();

      if (data.success) {
        setMessageDialog({
          open: true,
          type: "success",
          message: "Client deleted successfully!",
        });
        fetchClients();
      } else {
        setMessageDialog({
          open: true,
          type: "error",
          message: data.error || "Failed to delete client",
        });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      setMessageDialog({
        open: true,
        type: "error",
        message: "An error occurred while deleting the client",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center h-[86px] border-b border-gray-300 -mt-6 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <h1 className="text-3xl font-bold">Manage Clients</h1>
        <Link href="/admin/clients/add">
          <Button>Add Client</Button>
        </Link>
      </div>

      <div className="mt-8">
      {loading ? (
        <div className="text-center py-12">Loading clients...</div>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No clients found</p>
            <Link href="/admin/clients/add">
              <Button>Add Your First Client</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clients.map((client) => (
            <Card key={client._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{client.name}</h3>
                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate"
                    >
                      {client.url}
                    </a>
                    {client.regularClient && (
                      <span className="text-xs inline-block mt-2 px-2 py-1 rounded bg-green-100 text-green-800">
                        Regular Client
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(client)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>

      <Dialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.client?.name}&quot;? This action cannot be undone.
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
