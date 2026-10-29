"use client";

import Link from "next/link";
import { Instrument } from "@/types";
import { formatPrice, generateGiftingWhatsAppLink } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GiftCardProps {
  instrument: Instrument;
  organizationType: "Medical College" | "Pharmaceutical Company";
}

export default function GiftCard({ instrument, organizationType }: GiftCardProps) {
  const minPrice =
    instrument.greaterThanPrice ||
    (instrument.rates && instrument.rates.length > 0
      ? Math.min(...instrument.rates.map((r) => r.price).filter((p) => p > 0))
      : instrument.price || 0);

  const whatsappHref = generateGiftingWhatsAppLink({
    phoneNumber: instrument.whatsappNumber,
    organizationType,
    productName: instrument.name,
  });

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 group flex flex-col">
      <Link href={`/instruments/${instrument._id}`} className="relative h-48 overflow-hidden bg-gradient-to-br from-muted to-white block">
        <img
          src={instrument.mainImage}
          alt={instrument.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <CardContent className="p-4 flex-1">
        <div className="mb-2">
          <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded">
            {instrument.category}
          </span>
        </div>
        <h3 className="text-base font-bold mb-2 text-foreground group-hover:text-primary line-clamp-2 min-h-[2.5rem]">
          {instrument.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {instrument.description}
        </p>
        {minPrice > 0 && (
          <div className="flex items-baseline gap-1">
            <p className="text-lg font-bold text-primary">
              {formatPrice(minPrice, instrument.currency)}
            </p>
            <span className="text-xs text-muted-foreground">onwards</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button variant="default" className="w-full" asChild>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Inquire on WhatsApp
          </a>
        </Button>
        <Link href={`/instruments/${instrument._id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
