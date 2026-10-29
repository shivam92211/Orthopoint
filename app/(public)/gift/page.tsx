"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Building2, Gift, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instrument } from "@/types";
import GiftCard from "@/components/public/GiftCard";
import { generateGiftingWhatsAppLink } from "@/lib/utils";

type Audience = "medical-college" | "pharma";

const AUDIENCE_META: Record<
  Audience,
  { label: string; orgType: "Medical College" | "Pharmaceutical Company"; icon: typeof GraduationCap }
> = {
  "medical-college": {
    label: "Medical Colleges",
    orgType: "Medical College",
    icon: GraduationCap,
  },
  pharma: {
    label: "Pharmaceutical Companies",
    orgType: "Pharmaceutical Company",
    icon: Building2,
  },
};

function AudienceSection({
  audience,
  headline,
  intro,
  bullets,
  cta,
  anchorId,
  instruments,
  loading,
}: {
  audience: Audience;
  headline: string;
  intro: string;
  bullets: string[];
  cta: string;
  anchorId: string;
  instruments: Instrument[];
  loading: boolean;
}) {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(8);
  const meta = AUDIENCE_META[audience];
  const Icon = meta.icon;

  const filtered = search
    ? instruments.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.description.toLowerCase().includes(search.toLowerCase()) ||
          i.category.toLowerCase().includes(search.toLowerCase())
      )
    : instruments;

  const whatsappHref = generateGiftingWhatsAppLink({ organizationType: meta.orgType });

  return (
    <section id={anchorId} className="scroll-mt-24 py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {meta.label}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {headline}
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mb-6">{intro}</p>

        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 max-w-3xl mb-8">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-foreground">
              <span className="text-secondary font-bold">•</span>
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3 mb-10">
          <Button size="lg" asChild>
            <a href="#catalog">
              <span className="inline-flex items-center gap-2">
                {cta}
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Inquire on WhatsApp
            </a>
          </Button>
        </div>

        <div id="catalog" className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-foreground">
            {meta.label} — Gifting Catalog
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search gifting products..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisible(8);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
            <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-1">
              No gifting products available yet
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Our team can still help you plan a custom gifting campaign — reach out on WhatsApp.
            </p>
            <Button asChild>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Inquire on WhatsApp
              </a>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.slice(0, visible).map((item) => (
                <GiftCard
                  key={item._id}
                  instrument={item}
                  organizationType={meta.orgType}
                />
              ))}
            </div>
            {filtered.length > visible && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={() => setVisible((v) => v + 8)}>
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default function GiftPage() {
  const [products, setProducts] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/instruments?catalogType=gifting");
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const collegeProducts = products.filter(
    (p) => p.giftingAudience === "medical-college" && p.available !== false
  );
  const pharmaProducts = products.filter(
    (p) => p.giftingAudience === "pharma" && p.available !== false
  );

  const generalWhatsapp = generateGiftingWhatsAppLink({ organizationType: "General" });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-light/90 to-primary/95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Gift className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold">Gifting Services</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Make Your Brand Memorable in Every Surgery.
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Give surgeons something they will actually use. Transform practical medical instruments into meaningful gifts that keep your institution or brand memorable throughout their professional journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg" asChild>
              <a href="#medical-colleges">
                <span className="inline-flex items-center gap-2">
                  Explore Gift Catalog
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20" asChild>
              <a href={generalWhatsapp} target="_blank" rel="noopener noreferrer">
                Enquire on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Subcategory nav */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid md:grid-cols-2 gap-4">
          <Link
            href="#medical-colleges"
            className="group flex items-center gap-4 bg-white border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="bg-primary/10 p-3 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-foreground">Medical Colleges</div>
              <div className="text-sm text-muted-foreground">Convocations, residents, faculty & alumni gifting</div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            href="#pharmaceutical-companies"
            className="group flex items-center gap-4 bg-white border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="bg-primary/10 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-foreground">Pharmaceutical Companies</div>
              <div className="text-sm text-muted-foreground">Surgeon gifting, conferences & corporate campaigns</div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </section>

      <AudienceSection
        audience="medical-college"
        anchorId="medical-colleges"
        headline="Celebrate Every Milestone in a Surgeon's Journey."
        intro="A medical college convocation is one of the most memorable milestones in a future surgeon's life. A thoughtfully chosen medical instrument can serve as a lasting reminder of the institution where their journey began. Help your institution create meaningful connections with students, graduates, residents, faculty, and senior surgeons."
        bullets={[
          "Convocation and graduation ceremonies",
          "Gifts for graduating medical students and surgical residents",
          "Faculty and senior surgeon appreciation",
          "Institutional events and alumni gifting",
        ]}
        cta="Explore College Gifts"
        instruments={collegeProducts}
        loading={loading}
      />

      <AudienceSection
        audience="pharma"
        anchorId="pharmaceutical-companies"
        headline="Keep Your Brand Remembered in Every Surgery."
        intro="Traditional promotional gifts often fail to create lasting brand recall. Practical medical instruments provide ongoing value to surgeons while creating opportunities for brand visibility through appropriate customization — thoughtful gifts for conferences, campaigns, and professional events."
        bullets={[
          "Surgeon and healthcare professional gifting",
          "Pharmaceutical brand promotion",
          "Medical conferences and professional events",
          "Corporate gifting campaigns",
          "Customized medical instrument gifting, subject to feasibility",
        ]}
        cta="Explore Pharma Gifts"
        instruments={pharmaProducts}
        loading={loading}
      />

      {/* Bulk / custom CTA */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Planning a bulk order or custom gifting campaign?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share your organization type, product shortlist, quantities, and any customization requirements with us on WhatsApp. We will respond with the available options and pricing.
          </p>
          <Button size="lg" asChild>
            <a href={generalWhatsapp} target="_blank" rel="noopener noreferrer">
              Start the Conversation on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
