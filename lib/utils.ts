import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "INR"): string {
  if (currency === "INR") {
    return `₹${price.toLocaleString("en-IN")}`;
  }
  return `$${price.toLocaleString("en-US")}`;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  instrumentName: string,
  price: number,
  currency: string,
  url: string
): string {
  const message = `Hi, I'm interested in buying ${instrumentName}.\nPrice: ${formatPrice(
    price,
    currency
  )}\nLink: ${url}`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
