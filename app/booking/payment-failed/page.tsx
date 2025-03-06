"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PaymentFailedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <CardTitle className="text-2xl">Payment Failed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 mb-4">
                We're sorry, but there was an issue processing your payment. Please try again or choose a different
                payment method.
              </p>
              <div className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/booking/payment">Retry Payment</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/booking">Modify Booking</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

