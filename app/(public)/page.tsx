"use client";

import { useEffect, useState } from "react";
import InstrumentCard from "@/components/public/InstrumentCard";
import FilterBar from "@/components/public/FilterBar";
import Hero from "@/components/public/Hero";
import Features from "@/components/public/Features";
import CategoryShowcase from "@/components/public/CategoryShowcase";
import { Instrument } from "@/types";

export default function HomePage() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [filteredInstruments, setFilteredInstruments] = useState<Instrument[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [instruments, search, category, minPrice, maxPrice, availableOnly]);

  useEffect(() => {
    // Handle URL parameters for category filtering
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
      // Scroll to products section
      setTimeout(() => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const fetchData = async () => {
    try {
      const [instrumentsRes, categoriesRes] = await Promise.all([
        fetch("/api/instruments"),
        fetch("/api/categories"),
      ]);

      const instrumentsData = await instrumentsRes.json();
      const categoriesData = await categoriesRes.json();

      if (instrumentsData.success) {
        setInstruments(instrumentsData.data);
        setFilteredInstruments(instrumentsData.data);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data.map((c: any) => c.name));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...instruments];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(searchLower) ||
          i.description.toLowerCase().includes(searchLower) ||
          i.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter((i) => i.category === category);
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter((i) => i.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((i) => i.price <= Number(maxPrice));
    }

    // Available filter
    if (availableOnly) {
      filtered = filtered.filter((i) => i.available);
    }

    setFilteredInstruments(filtered);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Products Section */}
      <section id="products" className="py-16 md:py-24 bg-muted scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-4">
              OUR PRODUCTS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Premium Surgical Instruments
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our extensive collection of quality-certified medical equipment
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-border p-6">
            <FilterBar
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              categories={categories}
              onReset={resetFilters}
            />
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filteredInstruments.length}</span> of{" "}
              <span className="font-bold text-foreground">{instruments.length}</span> products
            </div>
            {(search || category || minPrice || maxPrice || availableOnly) && (
              <button
                onClick={resetFilters}
                className="text-primary hover:text-primary-hover font-medium text-sm underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredInstruments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-border">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-foreground text-xl font-semibold mb-2">No products found</p>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              {(search || category || minPrice || maxPrice || availableOnly) && (
                <button
                  onClick={resetFilters}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredInstruments.map((instrument) => (
                <InstrumentCard key={instrument._id} instrument={instrument} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
