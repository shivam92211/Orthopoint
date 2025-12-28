"use client";

import { useEffect, useState } from "react";
import InstrumentCard from "@/components/public/InstrumentCard";
import FilterBar from "@/components/public/FilterBar";
import Hero from "@/components/public/Hero";
import MostSoldSlider from "@/components/public/MostSoldSlider";
import Features from "@/components/public/Features";
import CategoryShowcase from "@/components/public/CategoryShowcase";
import RegularClients from "@/components/public/RegularClients";
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

      {/* Most Sold Slider */}
      <MostSoldSlider />

      {/* Regular Clients */}
      <RegularClients />

      {/* Features Section */}
      <Features />

      {/* Category Showcase */}
      {/* <CategoryShowcase /> */}

      

      
      
    </div>
  );
}
