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

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold mb-4">Most Sold</h3>
        <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-lg shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col md:flex-row items-center"
            >
              <Link href={`/instruments/${current._id}`} className="flex w-full h-full flex-col md:flex-row">
                <div className="w-full md:w-1/3 flex items-center justify-center bg-gray-50 p-4">
                  {current.mainImage ? (
                    <Image src={current.mainImage} alt={current.name} width={240} height={240} className="object-contain" />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200" />
                  )}
                </div>
                <div className="w-full md:flex-1 p-6 flex flex-col justify-center">
                  <h4 className="text-xl md:text-2xl font-bold mb-2">{current.name}</h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{current.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">{current.currency === "INR" ? "₹" : "$"}{current.price.toLocaleString()}</span>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">Most Sold</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
