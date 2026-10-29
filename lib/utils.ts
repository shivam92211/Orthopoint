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

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || "918108419746";
}

export function generateGiftingWhatsAppLink(params: {
  phoneNumber?: string;
  organizationType?: "Medical College" | "Pharmaceutical Company" | "General";
  productName?: string;
  quantity?: string;
  customization?: string;
}): string {
  const phone = params.phoneNumber || getWhatsAppNumber();
  const org = params.organizationType || "General";

  let message: string;
  if (params.productName) {
    message =
      `Hello, I am interested in your gifting services.\n` +
      `Organization type: ${org}.\n` +
      `Product: ${params.productName}.\n` +
      `Quantity: ${params.quantity || "[Required Quantity]"}.\n` +
      `Customization requirements: ${params.customization || "[Requirements]"}.\n` +
      `Please share the available options and pricing.`;
  } else {
    message =
      `Hello, I am interested in your gifting services.\n` +
      `Organization type: ${org}.\n` +
      `Please share your gifting catalog, bulk-order options, and customization details.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateRefurbishmentWhatsAppLink(phoneNumber?: string): string {
  const phone = phoneNumber || getWhatsAppNumber();
  const message =
    `Hello, I would like to inquire about your instrument refurbishment service. ` +
    `Please share more details about the process and required information.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
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
