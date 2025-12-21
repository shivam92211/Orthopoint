"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone, Mail, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+919324275387" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">+91 9324275387 / +91 9987514573</span>
              </a>
              <a href="mailto:orthopoint.in@gmail.com" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">orthopoint.in@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
              <Image
                src="/logo.jpg"
                alt="OrthoPoint Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-bold text-xl text-primary">OrthoPoint</div>
              <div className="text-xs text-muted-foreground -mt-1">Orthopaedic Excellence</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link href="/#products" className="text-foreground hover:text-primary font-medium transition-colors">
              Products
            </Link>
            <Link href="/#categories" className="text-foreground hover:text-primary font-medium transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary font-medium transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="https://wa.me/918108419746?text=Hi,%20I%20would%20like%20to%20request%20a%20quote%20for%20orthopaedic%20instruments." target="_blank" rel="noopener noreferrer">
                Request Quote
              </a>
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <a href="tel:+919987514573">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-foreground hover:text-primary font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="block py-2 text-foreground hover:text-primary font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/#categories"
              className="block py-2 text-foreground hover:text-primary font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block py-2 text-foreground hover:text-primary font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-foreground hover:text-primary font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <a href="https://wa.me/918108419746?text=Hi,%20I%20would%20like%20to%20request%20a%20quote%20for%20orthopaedic%20instruments." target="_blank" rel="noopener noreferrer">
                  Request Quote
                </a>
              </Button>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <a href="tel:+919987514573">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
