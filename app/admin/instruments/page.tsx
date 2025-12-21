"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instrument } from "@/types";

export default function InstrumentsManagement() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    try {
      const res = await fetch("/api/instruments");
      const data = await res.json();

      if (data.success) {
        setInstruments(data.data);
      }
    } catch (error) {
      console.error("Error fetching instruments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this instrument?")) {
      return;
    }

    try {
      const res = await fetch(`/api/instruments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInstruments(instruments.filter((i) => i._id !== id));
        alert("Instrument deleted successfully");
      } else {
        alert("Failed to delete instrument");
      }
    } catch (error) {
      console.error("Error deleting instrument:", error);
      alert("An error occurred");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center h-[86px] border-b border-gray-300 -mt-6 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <h1 className="text-3xl font-bold">Manage Instruments</h1>
        <Link href="/admin/instruments/add">
          <Button>Add New Instrument</Button>
        </Link>
      </div>

      <div className="mt-8">
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : instruments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No instruments found</p>
            <Link href="/admin/instruments/add">
              <Button>Add Your First Instrument</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {instruments.map((instrument) => (
            <Card key={instrument._id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={instrument.mainImage}
                    alt={instrument.name}
                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold">{instrument.name}</h3>
                    <p className="text-sm text-gray-500">{instrument.category}</p>
                    <p className="text-sm font-medium mt-1">
                      {instrument.currency === "INR" ? "₹" : "$"}
                      {instrument.price.toLocaleString()}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          instrument.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {instrument.available ? "Available" : "Unavailable"}
                      </span>
                      {instrument.featured && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3 md:hidden">
                      <Link href={`/admin/instruments/edit/${instrument._id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(instrument._id!)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="hidden md:flex gap-2 flex-shrink-0">
                    <Link href={`/admin/instruments/edit/${instrument._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(instrument._id!)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
