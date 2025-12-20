"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Instrument } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export default function InstrumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
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
        setSelectedImage(data.data.mainImage);
      }
    } catch (error) {
      console.error("Error fetching instrument:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!instrument) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Instrument not found</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back to Instruments
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 rounded-lg overflow-hidden bg-white">
              <img
                src={selectedImage}
                alt={instrument.name}
                className="w-full h-96 object-contain"
              />
            </div>
            {instrument.images && instrument.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {instrument.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedImage === img
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${instrument.name} ${idx + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-2">
              <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                {instrument.category}
              </span>
              {instrument.featured && (
                <span className="inline-block bg-secondary/10 text-secondary text-sm px-3 py-1 rounded-full ml-2">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{instrument.name}</h1>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(instrument.price, instrument.currency)}
              </span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  instrument.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {instrument.available ? "Available" : "Sold Out"}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {instrument.description}
              </p>
            </div>

            {/* Specifications */}
            {instrument.specifications &&
              Object.values(instrument.specifications).some((v) => v) && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full">
                      <tbody className="divide-y">
                        {instrument.specifications.brand && (
                          <tr>
                            <td className="py-2 font-medium">Brand</td>
                            <td className="py-2 text-right">
                              {instrument.specifications.brand}
                            </td>
                          </tr>
                        )}
                        {instrument.specifications.model && (
                          <tr>
                            <td className="py-2 font-medium">Model</td>
                            <td className="py-2 text-right">
                              {instrument.specifications.model}
                            </td>
                          </tr>
                        )}
                        {instrument.specifications.material && (
                          <tr>
                            <td className="py-2 font-medium">Material</td>
                            <td className="py-2 text-right">
                              {instrument.specifications.material}
                            </td>
                          </tr>
                        )}
                        {instrument.specifications.color && (
                          <tr>
                            <td className="py-2 font-medium">Color</td>
                            <td className="py-2 text-right">
                              {instrument.specifications.color}
                            </td>
                          </tr>
                        )}
                        {instrument.specifications.weight && (
                          <tr>
                            <td className="py-2 font-medium">Weight</td>
                            <td className="py-2 text-right">
                              {instrument.specifications.weight}
                            </td>
                          </tr>
                        )}
                        {instrument.specifications.dimensions && (
                          <tr>
                            <td className="py-2 font-medium">Dimensions</td>
                            <td className="py-2 text-right">
                              {instrument.specifications.dimensions}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}

            {/* WhatsApp Button */}
            {instrument.available && (
              <WhatsAppButton
                instrumentName={instrument.name}
                price={instrument.price}
                currency={instrument.currency}
                phoneNumber={instrument.whatsappNumber}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
