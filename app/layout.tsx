import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrthoPoint - High quality Orthopaedic instruments at lowest price",
  description: "Orthopaedic instruments for medical professionals, orthopaedic dealers , distributors and stockist at lowest price for reselling. .",
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
