import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-primary p-2 rounded-lg">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM15 20H6c-.55 0-1-.45-1-1v-1h10v2zm4-1c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z"/>
                  <path d="M10 7h6v2h-6zm0 4h6v2h-6z"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-xl">OrthoPoint</div>
                <div className="text-xs text-primary-foreground/80">Surgical Excellence</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              Your trusted partner for premium surgical instruments and medical equipment.
              ISO 13485 certified with 20+ years of experience.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Surgical Instruments
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Orthopedic Equipment
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Dental Instruments
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Diagnostic Equipment
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Medical Supplies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  123 Medical Plaza, Suite 456<br />
                  Healthcare District, NY 10001
                </span>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@orthopoint.com"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  info@orthopoint.com
                </a>
              </li>
            </ul>

            {/* Certifications */}
            <div className="mt-6 space-y-2">
              <div className="bg-white/10 rounded-lg p-3 text-xs">
                <div className="font-bold mb-1">ISO 13485:2016</div>
                <div className="text-primary-foreground/70">Medical Devices Certified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>© 2024 OrthoPoint. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-secondary transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping" className="hover:text-secondary transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
