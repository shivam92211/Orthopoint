"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InstrumentForm from "@/components/admin/InstrumentForm";
import { Instrument } from "@/types";

export default function EditInstrument() {
  const params = useParams();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInstrument();
    }
  }, [params.id]);

  const fetchInstrument = async () => {
    try {
      const res = await fetch(`/api/instruments/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setInstrument(data.data);
      }
    } catch (error) {
      console.error("Error fetching instrument:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!instrument) {
    return <div className="text-center py-12">Instrument not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Instrument</h1>
      <InstrumentForm instrument={instrument} isEdit={true} />
    </div>
  );
}
