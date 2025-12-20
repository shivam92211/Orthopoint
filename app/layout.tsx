import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrthoPoint - Premium Surgical Instruments & Medical Equipment",
  description: "Professional surgical instruments, medical equipment, and supplies for hospitals, clinics, and healthcare professionals. Quality certified products with expert support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
