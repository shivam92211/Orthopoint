"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Client } from "@/types";

export default function RegularClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (data.success) {
        // Filter only regular clients
        const regular = data.data.filter((c: Client) => c.regularClient);
        setClients(regular);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  if (clients.length === 0) return null;

  // Duplicate clients 4 times to ensure we have enough content to scroll seamlessly
  // even on wide screens with few clients.
  const displayClients = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
          Our Regular Clients
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>
      
      <div className="relative w-full overflow-hidden bg-gray-50/50 py-8">
        {/* Gradient overlays for smooth fade effect at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-16 items-center w-max px-8"
          animate={{ x: ["0%", "-25%"] }} 
          transition={{
            ease: "linear",
            duration: 30, // Slow continuous scroll
            repeat: Infinity,
          }}
        >
          {displayClients.map((client, index) => (
            <Link
              key={`${client._id}-${index}`}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center group"
            >
              <div className="relative w-48 h-48 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-hover:border-primary/30">
                 <img
                   src={client.logoUrl}
                   alt={client.name}
                   className="object-contain max-w-full max-h-full transition-all duration-300 group-hover:scale-110"
                 />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                {client.name}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
