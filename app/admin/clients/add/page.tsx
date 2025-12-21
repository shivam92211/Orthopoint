"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingLogo, setFetchingLogo] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    logoUrl: "",
    regularClient: false,
  });
  const [messageDialog, setMessageDialog] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchLogo = async () => {
    if (!formData.url) {
      setMessageDialog({
        open: true,
        type: "error",
        message: "Please enter a URL first",
      });
      return;
    }

    setFetchingLogo(true);

    try {
      // Normalize URL
      let url = formData.url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      const domain = new URL(url).hostname;

      // Try multiple logo services
      const logoServices = [
        `https://logo.clearbit.com/${domain}`,
        `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
        `https://api.faviconkit.com/${domain}/256`,
      ];

      // Try the first service (Clearbit - usually best quality)
      const logoUrl = logoServices[0];

      // Test if the logo loads
      const img = new Image();
      img.onload = () => {
        setFormData({
          ...formData,
          logoUrl: logoUrl,
          url: url,
        });
        setFetchingLogo(false);
      };
      img.onerror = () => {
        // If Clearbit fails, try Google favicons
        const fallbackUrl = logoServices[1];
        setFormData({
          ...formData,
          logoUrl: fallbackUrl,
          url: url,
        });
        setFetchingLogo(false);
      };
      img.src = logoUrl;
    } catch (error) {
      console.error("Error fetching logo:", error);
      setMessageDialog({
        open: true,
        type: "error",
        message: "Invalid URL or unable to fetch logo",
      });
      setFetchingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.logoUrl) {
      setMessageDialog({
        open: true,
        type: "error",
        message: "Please fetch the logo first",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessageDialog({
          open: true,
          type: "success",
          message: "Client created successfully!",
        });
      } else {
        setMessageDialog({
          open: true,
          type: "error",
          message: data.error || "Failed to create client",
        });
      }
    } catch (error) {
      console.error("Error creating client:", error);
      setMessageDialog({
        open: true,
        type: "error",
        message: "An error occurred while creating the client",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setMessageDialog({ ...messageDialog, open: false });
    if (messageDialog.type === "success") {
      router.push("/admin/clients");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center h-[86px] border-b border-gray-300 -mt-6 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <h1 className="text-3xl font-bold">Add New Client</h1>
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Google Inc."
                required
              />
            </div>

            {/* Client URL */}
            <div className="space-y-2">
              <Label htmlFor="url">
                Client URL <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  name="url"
                  type="text"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="e.g., google.com or https://google.com"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={fetchLogo}
                  disabled={fetchingLogo || !formData.url}
                  variant="outline"
                >
                  {fetchingLogo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    "Fetch Logo"
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Enter the website URL and click &quot;Fetch Logo&quot; to automatically retrieve the logo
              </p>
            </div>

            {/* Logo Preview */}
            {formData.logoUrl && (
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center p-4 border-2 border-gray-200">
                  <img
                    src={formData.logoUrl}
                    alt="Client logo preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Manual Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL (Manual Override)</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                type="text"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-sm text-gray-500">
                You can manually enter a logo URL if automatic fetching doesn&apos;t work
              </p>
            </div>

            {/* Regular Client Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="regularClient"
                checked={formData.regularClient}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, regularClient: checked as boolean })
                }
              />
              <Label
                htmlFor="regularClient"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Regular Client
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 justify-center">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Client"}
              </Button>
              <Link href="/admin/clients">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

      {/* Success/Error Message Dialog */}
      <Dialog open={messageDialog.open} onOpenChange={handleDialogClose}>
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
            <Button onClick={handleDialogClose}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
