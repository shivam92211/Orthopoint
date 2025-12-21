"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Grid3x3, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import InstrumentCard from "@/components/public/InstrumentCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

interface Instrument {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  specifications: Record<string, string>;
  available: boolean;
  featured: boolean;
}

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchInstruments();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchInstruments = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `/api/instruments?category=${encodeURIComponent(selectedCategory)}`
        : "/api/instruments";

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setInstruments(data.data);
      }
    } catch (error) {
      console.error("Error fetching instruments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstruments = instruments.filter((instrument) =>
    instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instrument.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Catalog</h1>
          <p className="text-lg text-white/90">
            Browse our comprehensive collection of premium orthopaedic instruments
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-foreground">Categories</h2>

              {/* All Products Option */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                All Products
              </button>

              {/* Category List */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className="text-2xl">{category.icon || "🏥"}</span>
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and View Toggle */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search instruments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing {filteredInstruments.length} product
                    {filteredInstruments.length !== 1 ? "s" : ""}
                    {selectedCategory && ` in ${selectedCategory}`}
                  </>
                )}
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-border text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
                  <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
                </div>
              </div>
            ) : filteredInstruments.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-border text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedCategory
                    ? `No products available in ${selectedCategory}`
                    : "No products match your search"}
                </p>
                {selectedCategory && (
                  <Button onClick={() => setSelectedCategory(null)}>
                    View All Products
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredInstruments.map((instrument) => (
                  <InstrumentCard
                    key={instrument._id}
                    instrument={instrument}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
