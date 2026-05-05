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
              className={`h-4 w-4 transition-all duration-500 ${isFilled
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
        {/* Rating Cards - Centered at Top */}
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Shield className="h-3.5 w-3.5 text-secondary" />
            <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
              UDYAM-MH-33-0182710
            </span>
          </div>
          <div className="flex flex-row gap-2 sm:gap-4">
            {/* IndiaMART Rating Card */}
            <a
              href="https://www.indiamart.com/ortho-point"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 border border-white/30 hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2 sm:gap-4 md:flex-row md:gap-6">
                {/* Indiamart Logo - Square */}
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-md flex-shrink-0">
                  <Image
                    src="/indiamart-logo-hd.png"
                    alt="Indiamart"
                    fill
                    className="object-contain p-1 sm:p-2"
                  />
                </div>

                {/* Divider - Only visible on desktop */}
                <div className="hidden md:block h-24 w-px bg-gray-300"></div>

                {/* Rating Section */}
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <AnimatedRating totalStars={5} rating={4.5} />
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">
                    4.5/5 Rating
                  </div>
                </div>
              </div>
            </a>

            {/* Google Rating Card */}
            <a
              href="https://www.google.com/maps/place/ORTHOPOINT,+Gandhi+industrial+estate,+Bhayandar,+Kharegaon,+Bhayandar+East,+Thane,+Mira+Bhayandar,+Maharashtra+401105/data=!4m2!3m1!1s0x3be7b18d5d54ce85:0xd2f640d9609247f1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI1LjMwLjQYACCIJypaLDk0MjY3NzI3LDk0Mjc1NDA3LDk0MjgwNTc2LDk0MjA3Mzk0LDk0MjA3NTA2LDk0MjA4NTA2LDk0MjE4NjUzLDk0MjI5ODM5LDk0Mjc1MTY4LDk0Mjc5NjE5QgJJTg%3D%3D&skid=ca0086bb-dc72-451e-ac18-985e4e7a6972&g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 border border-white/30 hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2 sm:gap-4 md:flex-row md:gap-6">
                {/* Google Logo */}
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-md flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>

                {/* Divider - Only visible on desktop */}
                <div className="hidden md:block h-24 w-px bg-gray-300"></div>

                {/* Rating Section */}
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <AnimatedRating totalStars={5} rating={5.0} />
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">
                    5.0/5 Rating
                  </div>
                </div>
              </div>
            </a>
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
