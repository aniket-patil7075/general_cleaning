import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApiProvider } from "@/lib/api/ApiContext";
import baraket_favicon from "../public/baraket_favicon.png"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baraket Bayut",
  description:
    "Offering General, Deep, Golden, and VIP Cleaning Services to ensure spotless, fresh, and hygienic spaces with top-tier professionalism.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/baraket_favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <ApiProvider>{children}</ApiProvider>
      </body>
    </html>
  );
}

import "./globals.css";
