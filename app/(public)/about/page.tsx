import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, Users, Globe, Clock, ShieldCheck } from "lucide-react";
import AboutImageSlider from "@/components/public/AboutImageSlider";

export const metadata: Metadata = {
  title: "About Us | OrthoPoint",
  description: "Learn about OrthoPoint's commitment to providing premium orthopaedic instruments and surgical solutions.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About OrthoPoint</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Your trusted partner in orthopaedic excellence. dedicated to providing high-quality surgical instruments that improve patient outcomes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image/Visual Side */}
            <AboutImageSlider />

            {/* Content Side */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Excellence in Every Instrument
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At OrthoPoint, we understand that precision is paramount in orthopaedic surgery. For over 15 years, we have been dedicated to supplying Dealers, Distributors, Stockist and medical facilities with premium-grade instruments that meet the highest standards of quality and reliability.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is simple: to empower healthcare professionals with the tools they need to restore mobility and improve lives. We bridge the gap between innovative manufacturing and the operating room, ensuring that every instrument we deliver contributes to a successful surgical outcome.
              </p>
              
              <div className="pt-4">
                <Button size="lg" variant="default" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose OrthoPoint?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We define ourselves not just by the products we sell, but by the values we uphold and the trust we build with our partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every instrument undergoes rigorous quality checks to ensure durability, precision, and compliance with medical standards.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">15+ Years Experience</h3>
              <p className="text-muted-foreground">
                With over a decade and a half in the industry, we have deep knowledge of orthopaedic needs and market trends.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trusted Reliability</h3>
              <p className="text-muted-foreground">
                We are committed to on-time delivery and consistent availability of essential surgical tools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Customer Focus</h3>
              <p className="text-muted-foreground">
                Our dedicated support team is always ready to assist with product selection, quotes, and after-sales service.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Wide Distribution</h3>
              <p className="text-muted-foreground">
                Serving Brands, dealers, and medical professionals across the region with efficient logistics.
              </p>
            </div>

             {/* Feature 6 */}
             {/* <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Certified Products</h3>
              <p className="text-muted-foreground">
                We deal only in certified instruments that meet international safety and performance benchmarks.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20  ">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Upgrade Your Surgical Inventory?</h2>
          <p className="text-xl mb-8">
            Explore our comprehensive catalog or contact our team for a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/catalog">View Catalog</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent hover:bg-primary hover:text-white" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}