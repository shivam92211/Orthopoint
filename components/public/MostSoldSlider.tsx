"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Instrument } from "@/types";

export default function MostSoldSlider() {
  const [items, setItems] = useState<Instrument[]>([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/instruments")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.success) {
          const most = data.data.filter((i: Instrument) => i.mostSold);
          setItems(most);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!items || items.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4500);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  const current = items[index];
  const displayItems = items.slice(0, 5); // Take first 5 items for desktop

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold mb-4">Most Sold</h3>

        {/* Mobile View - Slider (single item) */}
        <div className="relative w-full overflow-hidden md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <Link href={`/instruments/${current._id}`} className="flex flex-col items-center">
                <div className="w-full aspect-square max-w-md mx-auto bg-gray-50 rounded-lg overflow-hidden p-8 flex items-center justify-center">
                  {current.mainImage ? (
                    <Image src={current.mainImage} alt={current.name} width={400} height={400} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h4 className="text-xl font-bold">{current.name}</h4>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop View - Grid (5 items) */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {displayItems.map((item) => (
            <Link
              key={item._id}
              href={`/instruments/${item._id}`}
              className="flex flex-col items-center group"
            >
              <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden p-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                {item.mainImage ? (
                  <Image
                    src={item.mainImage}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
