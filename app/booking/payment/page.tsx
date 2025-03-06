"use client";

import type React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import axios from "axios";
import { useApiContext } from "@/lib/api/ApiContext";

export default function PaymentMethodPage() {
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const [paymentFailed, setPaymentFailed] = useState(false);
  const { addressData } = useApiContext();
  const { selectedDates } = useApiContext();
  const { bookingId, setBookingId } = useApiContext();

  console.log("paymentMethod Id payment: ", paymentMethod);

  if (!addressData || addressData.length === 0) {
    console.error("No address data available.");
    return;
  }
  const plan = selectedDates.length > 0 ? "month" : "one";
  const firstAddress = addressData[0];
  const firstAddressString = JSON.stringify(firstAddress);
  const zoneId = "a1614dbe-4732-11ee-9702-dee6e8d77be4";

  const formattedDates = selectedDates
    .map((date) => new Date(date).toISOString().split("T")[0] + " 00:00:00.000")
    .join(", ");

  const now = new Date();
  const formattedDateTime =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  // const guest_id: "f124d7e0-f815-11ef-b1a6-ad24eae42883"
  let guest_id_base64 = Buffer.from(
    "f124d7e0-f815-11ef-b1a6-ad24eae42883",
    "utf-8"
  ).toString("base64");
  let firstAddress_base64 = Buffer.from(firstAddressString, "utf-8").toString(
    "base64"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      const stripeUrl = `https://test.barakatbayut.com/payment?payment_method=stripe&access_token=${guest_id_base64}&zone_id=${zoneId}&service_schedule=${formattedDateTime}&service_address_id=${firstAddress.id}&callback=http://localhost:3000/booking/payment/cardpayment&service_address=${firstAddress_base64}&is_partial=0&payment_platform=web&matrial=2&note=dsfg&refid=dsfg&plan=${plan}&multidate=${formattedDates}`;

      window.location.href = stripeUrl;
    } else if (paymentMethod === "cash") {
      const paymentSuccessful = Math.random() < 5;
      if (paymentSuccessful) {
        console.log("Payment successful");
        handleSaveHoursCartData();
      }
    } else {
      console.log("Payment failed");
      setPaymentFailed(true);
      router.push("/booking/payment-failed");
    }
  };

  const handleSaveHoursCartData = async () => {
    const postData = {
      multidate: formattedDates || " ",
      payment_method: "cash_after_service",
      zone_id: zoneId,
      service_schedule: formattedDateTime,
      service_address_id: firstAddress.id || 0,
      guest_id: "f124d7e0-f815-11ef-b1a6-ad24eae42883",
      service_address: firstAddress || "N/A",
      is_partial: 0,
      offline_payment_id: "",
      customer_information: "",
      matrial: "1",
      plan: plan || "one",
      note: "",
      refi: "",
    };

    try {
      const response = await axios.post(
        "https://test.barakatbayut.com/api/v1/customer/booking/request/send",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            zoneid: "a1614dbe-4732-11ee-9702-dee6e8d77be4",
            "x-localization": "en",
          },
        }
      );

      console.log("API Response in payment:", response.data);

      if (response.data?.response_code === "booking_place_success_200") {
        const id = response.data.content?.readable_id;
        setBookingId(id);
        console.log("Booking ID set:", id);
        setShowAlert(true);
        router.push("/booking/confirmation");
      } else {
        router.push("/booking/payment-failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/booking/date"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Date Selection
            </Link>
            <div className="mt-4 flex items-center gap-2">
              <h1 className="text-xl font-semibold">Step 4 of 4</h1>
              <div className="h-1 flex-1 rounded-full bg-gray-200">
                <div className="h-1 w-full rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Cash after service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Card payment</Label>
                  </div>
                </RadioGroup>
                <Button
                  type="submit"
                  className="w-full"
                  // onClick={handleSaveHoursCartData}
                >
                  {paymentFailed ? "Retry Payment" : "Confirm Booking"}
                </Button>
                {showAlert && (
                  <Alert className="mt-4 bg-green-100">
                    <AlertTitle>Booking Confirmed</AlertTitle>
                    <AlertDescription>
                      Your booking is confirmed. Please check the details in
                      your account.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
