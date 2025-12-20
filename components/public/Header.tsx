"use client";

import Link from "next/link";
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
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">+1 (234) 567-890</span>
              </a>
              <a href="mailto:info@orthopoint.com" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">info@orthopoint.com</span>
              </a>
            </div>
            <div className="text-xs sm:text-sm">
              ✓ ISO 13485 Certified Medical Equipment
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:bg-primary/90 transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM15 20H6c-.55 0-1-.45-1-1v-1h10v2zm4-1c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z"/>
                <path d="M10 7h6v2h-6zm0 4h6v2h-6z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-xl text-primary">OrthoPoint</div>
              <div className="text-xs text-muted-foreground -mt-1">Surgical Excellence</div>
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
            <Button variant="outline" size="sm">
              Request Quote
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Phone className="h-4 w-4 mr-2" />
              Call Now
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
              <Button variant="outline" className="w-full">
                Request Quote
              </Button>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
