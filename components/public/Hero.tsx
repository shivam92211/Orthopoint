"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Animated Rating Component
function AnimatedRating({ totalStars = 5, rating = 4.5 }: { totalStars?: number; rating?: number }) {
  const [filledStars, setFilledStars] = useState(0);

  useEffect(() => {
    // Animate stars one by one
    let currentStar = 0;
    const interval = setInterval(() => {
      currentStar += 1;
      setFilledStars(currentStar);
      if (currentStar >= Math.ceil(rating)) {
        clearInterval(interval);
      }
    }, 300); // Each star fills after 300ms

    return () => clearInterval(interval);
  }, [rating]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalStars }).map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= filledStars;
        const isPartial = starNumber === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <div key={index} className="relative">
            <Star
              className={`h-4 w-4 transition-all duration-500 ${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400 scale-100'
                  : 'fill-none text-gray-300 scale-75'
              }`}
            />
            {isPartial && isFilled && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(rating % 1) * 100}%` }}
              >
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-primary via-primary-light to-primary overflow-hidden">
      {/* Background Images with Overlay */}
      <div className="absolute inset-0">
        {/* Single Image Background */}
        <div className="absolute inset-0 opacity-70">
          <Image
            src="/ortho1.jpg"
            alt="Orthopaedic Instruments"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-light/85 to-primary/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-16 md:pb-24 relative z-10">
        {/* Indiamart Logo and Rating - Centered at Top */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/30">
            {/* Mobile: Column | Desktop: Row */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Indiamart Logo - Square */}
              <div className="relative w-32 h-32 bg-white rounded-xl p-4 shadow-md flex-shrink-0">
                <Image
                  src="/indiamart-logo-hd.png"
                  alt="Indiamart"
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Divider - Only visible on desktop */}
              <div className="hidden md:block h-24 w-px bg-gray-300"></div>

              {/* Rating Section */}
              <div className="flex flex-col items-center gap-2">
                <AnimatedRating totalStars={5} rating={4.5} />
                <div className="text-sm text-gray-700 font-semibold">
                  4.5/5 Rating
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-block bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-4 py-2 mb-6">
              <span className="text-secondary-foreground font-medium text-sm">
                ✓ Quality Orthopaedic Instruments
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              B2B High Quality Orthopaedic Instrument Manufacturing Company.
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Trusted by Dealears, Wholesalers, Stockists, Distributors and Branded Manufacturer all over india. 
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg group"
                asChild
              >
                <Link href="/catalog">
                  <span className="inline-flex items-center justify-center gap-3">
                    <span>Browse Catalogue</span>
                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                asChild
              >
                <a href="https://wa.me/918108419746?text=Hi,%20I%20would%20like%20to%20request%20a%20quote%20for%20orthopaedic%20instruments." target="_blank" rel="noopener noreferrer">
                  Request Quote
                </a>
              </Button>
            </div>
          </div>

          {/* Right Image/Visual */}
          <div className="relative hidden md:block">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              {/* Logo Display */}
              <div className="aspect-square bg-white rounded-2xl flex items-center justify-center p-8 shadow-xl">
                <div className="relative w-full h-full">
                  <Image
                    src="/logo.jpg"
                    alt="OrthoPoint - Professional Orthopaedic Instruments"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-4 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">Quality Assured</div>
                    <div className="text-xs text-muted-foreground">100% Authentic</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-accent rounded-xl shadow-2xl p-4">
                <div className="text-center">
                  <div className="font-bold text-2xl text-accent-foreground">100+</div>
                  <div className="text-xs text-accent-foreground/80">Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
