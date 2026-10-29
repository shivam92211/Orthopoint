"use client";

import Link from "next/link";
import { ArrowRight, Wrench, ClipboardList, Camera, Search, CheckCircle2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import RefurbishmentForm from "@/components/public/RefurbishmentForm";
import { generateRefurbishmentWhatsAppLink } from "@/lib/utils";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Submit Your Request",
    body: "Select or describe the instrument requiring refurbishment.",
  },
  {
    icon: Camera,
    title: "Share Instrument Details",
    body: "Provide relevant specifications, quantity, condition, and images.",
  },
  {
    icon: Search,
    title: "Assessment and Quotation",
    body: "Our team reviews the request and shares feasibility, estimated costs, and turnaround time.",
  },
  {
    icon: Wrench,
    title: "Refurbishment",
    body: "Accepted instruments proceed through the agreed refurbishment process.",
  },
  {
    icon: Truck,
    title: "Completion and Delivery",
    body: "The instruments are returned to you according to the agreed terms.",
  },
];

const AUDIENCES = [
  "Surgeons and individual medical professionals",
  "Hospitals and healthcare facilities",
  "Medical instrument dealers",
  "Medical instrument distributors",
  "Other eligible healthcare organizations",
];

export default function RefurbishmentPage() {
  const whatsappHref = generateRefurbishmentWhatsAppLink();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-light/90 to-primary/95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Wrench className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold">Instrument Refurbishment</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Give Your Instruments a Second Life.
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Restore the value of your unused, worn, or damaged instruments through a streamlined refurbishment service. Submit your request and let our team assess whether your instruments can be restored to suitable working condition.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg" asChild>
              <Link href="#request">
                <span className="inline-flex items-center gap-2">
                  Request Refurbishment
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20" asChild>
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="py-14 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Who We Serve
          </h2>
          <p className="text-muted-foreground max-w-3xl mb-6">
            This service is designed for surgeons, hospitals, medical instrument dealers, distributors, and other healthcare professionals with unused, damaged, worn, or underperforming instruments that may be suitable for refurbishment.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AUDIENCES.map((a) => (
              <li key={a} className="flex items-start gap-2 bg-white border rounded-lg p-4">
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-3xl mb-10">
            A clear, straightforward process from submission to delivery. Final feasibility and suitability are determined through the assessment process — not every damaged instrument can be restored.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative bg-white border rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="absolute -top-3 -left-3 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow">
                    {idx + 1}
                  </div>
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-1 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="request" className="py-16 bg-gray-50 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RefurbishmentForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Prefer to talk first?
            </p>
            <Button variant="outline" asChild>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Enquire on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
