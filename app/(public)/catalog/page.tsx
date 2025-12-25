"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { Instrument, Category } from "@/types";
import InstrumentCard from "@/components/public/InstrumentCard";



function CatalogContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

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
        {/* Search and Filters Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-border mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar and Category Dropdown */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search instruments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full md:w-auto px-4 py-2 border border-border rounded-lg bg-white hover:bg-muted/50 transition-colors flex items-center justify-between gap-2 min-w-[200px]"
                >
                  <span className="flex items-center gap-2">
                    {selectedCategory ? (
                      <>
                        <span>{categories.find(c => c.name === selectedCategory)?.icon || "🏥"}</span>
                        <span className="text-sm font-medium">{selectedCategory}</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">All Products</span>
                    )}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full mt-2 w-full md:w-64 bg-white border border-border rounded-lg shadow-lg z-10 max-h-[300px] overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                        selectedCategory === null ? "bg-primary/10 font-semibold" : ""
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 ${
                          selectedCategory === category.name ? "bg-primary/10 font-semibold" : ""
                        }`}
                      >
                        <span className="text-xl">{category.icon || "🏥"}</span>
                        <span className="text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground border-t border-border pt-3">
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
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
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
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
