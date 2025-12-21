import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="OrthoPoint Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <div className="font-bold text-xl">OrthoPoint</div>
                <div className="text-xs text-primary-foreground/80">Orthopaedic Excellence</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              Your trusted partner for premium orthopaedic instruments with 15+ years of experience.
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
                  Bone Screws & Plates
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Joint Replacement
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Trauma Instruments
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Spinal Implants
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  Arthroscopy Tools
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
                  href="tel:+919324275387"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  +91 9324275387 / +91 9987514573
                </a>
              </li>
              <li>
                <a
                  href="mailto:orthopoint.in@gmail.com"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  orthopoint.in@gmail.com
                </a>
              </li>
            </ul>

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
