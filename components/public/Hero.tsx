import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-block bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-4 py-2 mb-6">
              <span className="text-secondary-foreground font-medium text-sm">
                ✓ Quality Orthopaedic Instruments
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Premium Orthopaedic Instruments for Healthcare Professionals
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Trusted by hospitals, clinics, and surgeons worldwide. Quality instruments delivered with precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg group"
              >
                Browse Catalog
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-lg">Premium</div>
                  <div className="text-sm text-white/80">Quality</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-lg">15+ Years</div>
                  <div className="text-sm text-white/80">Experience</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 p-2 rounded-lg">
                  <Truck className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-lg">Fast</div>
                  <div className="text-sm text-white/80">Delivery</div>
                </div>
              </div>
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
