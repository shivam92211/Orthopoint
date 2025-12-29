import Link from "next/link";
import { Instrument } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "lucide-react";

interface InstrumentCardProps {
  instrument: Instrument;
}

export default function InstrumentCard({ instrument }: InstrumentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 group">
      {/* Mobile Horizontal Layout */}
      <div className="md:hidden flex gap-3 p-3">
        {/* Image - Left Side */}
        <Link href={`/instruments/${instrument._id}`} className="relative w-32 h-32 flex-shrink-0">
          <div className="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-muted to-white">
            <img
              src={instrument.mainImage}
              alt={instrument.name}
              className="w-full h-full object-contain"
            />
            {instrument.featured && (
              <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                ⭐
              </span>
            )}
            {!instrument.available && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Details - Right Side */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded inline-block mb-1">
              {instrument.category}
            </span>
            <Link href={`/instruments/${instrument._id}`}>
              <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-1">
                {instrument.name}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
              {instrument.description}
            </p>
            {instrument.specifications?.brand && (
              <div className="text-xs text-muted-foreground mb-2">
                Brand: <span className="font-semibold text-foreground">{instrument.specifications.brand}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-baseline gap-1 mb-2">
              <p className="text-lg font-bold text-primary">
                {formatPrice(
                  instrument.rates && instrument.rates.length > 0
                    ? instrument.rates[0].price
                    : instrument.price || 0,
                  instrument.currency
                )}
              </p>
            </div>

            <div className="flex gap-2">
              <Link href={`/instruments/${instrument._id}`} className="flex-1">
                <Button
                  className="w-full font-semibold text-xs h-8"
                  variant="default"
                  disabled={!instrument.available}
                >
                  {instrument.available ? "View Details" : "Notify Me"}
                </Button>
              </Link>
              {instrument.whatsappNumber && instrument.available && (
                <Button
                  variant="outline"
                  size="icon"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-white h-8 w-8"
                  asChild
                >
                  <a
                    href={`https://wa.me/${instrument.whatsappNumber}?text=Hi, I'm interested in ${instrument.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact on WhatsApp"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Vertical Layout */}
      <div className="hidden md:block">
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-muted to-white">
          <img
            src={instrument.mainImage}
            alt={instrument.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {instrument.featured && (
            <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              ⭐ Featured
            </span>
          )}
          {!instrument.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <div className="mb-3">
            <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded">
              {instrument.category}
            </span>
          </div>

          <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
            {instrument.name}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {instrument.description}
          </p>

          {instrument.specifications?.brand && (
            <div className="text-xs text-muted-foreground mb-3">
              Brand: <span className="font-semibold text-foreground">{instrument.specifications.brand}</span>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(
                instrument.rates && instrument.rates.length > 0
                  ? instrument.rates[0].price
                  : instrument.price || 0,
                instrument.currency
              )}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2">
          <Link href={`/instruments/${instrument._id}`} className="flex-1">
            <Button
              className="w-full font-semibold shadow-sm"
              variant="default"
              disabled={!instrument.available}
            >
              {instrument.available ? "View Details" : "Notify Me"}
            </Button>
          </Link>
          {instrument.whatsappNumber && instrument.available && (
            <Button
              variant="outline"
              size="icon"
              className="border-secondary text-secondary hover:bg-secondary hover:text-white"
              asChild
            >
              <a
                href={`https://wa.me/${instrument.whatsappNumber}?text=Hi, I'm interested in ${instrument.name}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on WhatsApp"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
