"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Instrument } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export default function InstrumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

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
        setSelectedImageIndex(0);
      }
    } catch (error) {
      console.error("Error fetching instrument:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!instrument?.images || instrument.images.length <= 1) return;

    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedImageIndex < instrument.images.length - 1) {
      const newIndex = selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(instrument.images[newIndex]);
    }

    if (isRightSwipe && selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(instrument.images[newIndex]);
    }
  };

  const calculateTotalPrice = (qty: number) => {
    if (!instrument?.rates || instrument.rates.length === 0) {
      return (instrument?.price || 0) * qty;
    }

    // Find the appropriate rate based on quantity
    let pricePerUnit = 0;
    const rate = instrument.rates.find(
      (r) => qty >= r.minQuantity && qty <= r.maxQuantity
    );

    if (rate) {
      pricePerUnit = rate.price;
    } else if (qty > instrument.rates[instrument.rates.length - 1].maxQuantity) {
      // Use greaterThanPrice if quantity exceeds all rates
      pricePerUnit = instrument.greaterThanPrice || instrument.rates[instrument.rates.length - 1].price;
    } else {
      // Default to first rate price
      pricePerUnit = instrument.rates[0].price;
    }

    return pricePerUnit * qty;
  };

  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value) || 0;
    setQuantity(qty);
    if (qty > 0) {
      setTotalPrice(calculateTotalPrice(qty));
    } else {
      setTotalPrice(0);
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
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div
              className="mb-4 rounded-lg overflow-hidden bg-white aspect-square relative group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={selectedImage}
                alt={instrument.name}
                className="w-full h-full object-contain select-none"
                draggable="false"
              />

              {/* Navigation Arrows (Mobile Only) */}
              {instrument.images && instrument.images.length > 1 && (
                <>
                  {/* Previous Button */}
                  {selectedImageIndex > 0 && (
                    <button
                      onClick={() => {
                        const newIndex = selectedImageIndex - 1;
                        setSelectedImageIndex(newIndex);
                        setSelectedImage(instrument.images![newIndex]);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg md:hidden"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                  )}

                  {/* Next Button */}
                  {selectedImageIndex < instrument.images.length - 1 && (
                    <button
                      onClick={() => {
                        const newIndex = selectedImageIndex + 1;
                        setSelectedImageIndex(newIndex);
                        setSelectedImage(instrument.images![newIndex]);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg md:hidden"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  )}
                </>
              )}

              {/* Dots Indicator (Mobile Only) */}
              {instrument.images && instrument.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
                  {instrument.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(instrument.images![idx]);
                        setSelectedImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImageIndex === idx
                          ? "bg-primary w-6"
                          : "bg-white/60"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Grid (All Devices) */}
            {instrument.images && instrument.images.length > 1 && (
              <div className="w-full">
                <div className="flex flex-wrap gap-2">
                  {instrument.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(img);
                        setSelectedImageIndex(idx);
                      }}
                      className={`rounded-lg overflow-hidden border-2 aspect-square w-16 h-16 md:w-20 md:h-20 ${
                        selectedImageIndex === idx
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${instrument.name} ${idx + 1}`}
                        className="w-full h-full object-contain bg-white"
                      />
                    </button>
                  ))}
                </div>
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
                {formatPrice(
                  instrument.rates && instrument.rates.length > 0
                    ? instrument.rates[0].price
                    : instrument.price || 0,
                  instrument.currency
                )}
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

            {/* Quantity-Based Pricing Table */}
            {instrument.rates && instrument.rates.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quantity-Based Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 text-left font-semibold text-sm">Quantity Range</th>
                          <th className="py-2 px-3 text-right font-semibold text-sm">Price per Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {instrument.rates.map((rate, index) => (
                          <tr key={index}>
                            <td className="py-2 px-3">
                              {rate.minQuantity} - {rate.maxQuantity} units
                            </td>
                            <td className="py-2 px-3 text-right font-medium">
                              {formatPrice(rate.price, instrument.currency)}
                            </td>
                          </tr>
                        ))}
                        {instrument.greaterThanPrice !== undefined && instrument.greaterThanPrice > 0 && (
                          <tr className="bg-gray-50">
                            <td className="py-2 px-3">
                              {instrument.rates[instrument.rates.length - 1].maxQuantity + 1}+ units
                            </td>
                            <td className="py-2 px-3 text-right font-medium">
                              {formatPrice(instrument.greaterThanPrice, instrument.currency)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Price Calculator */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-md font-semibold mb-4">Price Calculator</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Enter Quantity</label>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          placeholder="Enter quantity"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Total Price</label>
                        <div className="h-10 px-3 py-2 bg-primary/10 text-primary rounded-md font-bold text-lg flex items-center">
                          {quantity > 0 ? formatPrice(totalPrice, instrument.currency) : formatPrice(0, instrument.currency)}
                        </div>
                      </div>
                    </div>
                    {quantity > 0 && (
                      <p className="text-sm text-muted-foreground mt-3">
                        Price per unit: {formatPrice(totalPrice / quantity, instrument.currency)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
                price={
                  instrument.rates && instrument.rates.length > 0
                    ? instrument.rates[0].price
                    : instrument.price || 0
                }
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
