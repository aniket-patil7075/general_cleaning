import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ApiProvider } from "@/lib/api/ApiContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ACME - Build Your SaaS Faster",
  description: "Launch your SaaS product in record time with our powerful, ready-to-use template.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ApiProvider>{children}</ApiProvider>
      </body>
    </html>
  )
}



import './globals.css'