import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrthoPoint - Premium Orthopaedic Instruments",
  description: "Professional orthopaedic instruments for hospitals, clinics, and healthcare professionals. Quality certified products with expert support.",
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
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
