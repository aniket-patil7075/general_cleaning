"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useApiContext } from "@/lib/api/ApiContext";
import { useEffect, useState } from "react";

type cartDataType = any[];

export default function BookingConfirmationPage() {
  const { addressData } = useApiContext();
  const { selectedDates } = useApiContext();
  const { bookingId } = useApiContext();
  const { apiGrandTotal } = useApiContext();
  const { apiHoursData, apiProfessionalData } = useApiContext();
  const { selectedDate, selectedTime } = useApiContext();
  const { needMaterials } = useApiContext();
  const [hourData, setHourData] = useState<cartDataType>([]);
  const [grandTotal, setGrandTotal] = useState<cartDataType>([]);
  const [totalTax, setTotalTax] = useState<cartDataType>([]);
  const [professionalData, setProfessionalData] = useState<cartDataType>([]);

  const { flag, paymentMethod, attributeId, transactionReference } =
    useApiContext();

  const [loading, setLoading] = useState(true);

  const formattedDates = selectedDates
    ? selectedDates
        .map((date) => {
          const d = new Date(date);
          const day = d.getDate();
          const month = d.toLocaleString("en-US", { month: "long" });
          return `${day} ${month}`;
        })
        .join(", ") + " 2025"
    : "N/A";

  useEffect(() => {
    if (bookingId || attributeId) {
      setLoading(false);
    }
  }, [bookingId, attributeId]);

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  const bookingDetails = {
    // bookingId: bookingId || "BK12345",
    service: "Home Cleaning",
    // date: formattedDates || selectedDate || 0,
    // time: "13:00-15:00",
    // duration: "2 hours",
    // professionals: 1,
    // address: "73 Financial Center Rd - Downtown Dubai - Dubai - United Arab Emirates",
    // paymentMethod: "Cash after service",
    // total: "AED 83.00",
  };

  const { getCartData } = useApiContext();

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await getCartData.execute({
        limit: 100,
        offset: 1,
        guest_id: "f124d7e0-f815-11ef-b1a6-ad24eae42883",
      });


      if (response?.content?.cart?.data) {
        const cartItems = response.content.cart.data;

        const hourItem = cartItems.find(
          (item) => item.variant_key === "Number-of-Hours"
        );
        const professionalItem = cartItems.find(
          (item) => item.variant_key === "Professionals"
        );

        setHourData(hourItem ? hourItem.quantity : 0);
        setProfessionalData(professionalItem ? professionalItem.quantity : 0);

        const hourTotalCost = hourItem?.total_cost || 0;

        const hourTax = hourItem?.tax_amount || 0;
        const professionalTax = professionalItem?.tax_amount || 0;

        setGrandTotal(hourTotalCost + (needMaterials ? 10 : 0));

        setTotalTax(hourTax || 0);
      } else {
        console.warn("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    if (getCartData) {
      (async () => {
        await fetchCartData();
      })();
      fetchCartData();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {flag === "success" ? <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-2xl">Booking Confirmed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 mb-4">
                  Thank you for your booking. Your service is confirmed for:
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Booking ID:</span>
                    <span>{bookingId ?? attributeId ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Transaction ID:</span>
                    <span>{transactionReference ?? 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="space-y-4">
            <p className="text-center text-gray-700">
              We've sent a confirmation email with these details to your
              registered email address.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/bookings">View My Bookings</Link>
              </Button>
            </div>
          </div>
        </div>
      </main> : <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-2xl">Booking Confirmed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 mb-4">
                  Thank you for your booking. Your service is confirmed for:
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Booking ID:</span>
                    <span>{bookingId ?? attributeId ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Service:</span>
                    <span>{bookingDetails.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date & Time:</span>
                    <span>
                      {selectedDate && currentMonth && selectedTime
                        ? `${selectedDate} ${currentMonth}, ${selectedTime}`
                        : formattedDates && selectedTime
                        ? `${formattedDates}, ${selectedTime}`
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{apiHoursData ?? hourData ?? "0"} Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Professionals:</span>
                    <span>
                      {apiProfessionalData ?? professionalData ?? "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Address:</span>
                    <span className="text-right">
                      {addressData?.[0]?.address || "No address available"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Method:</span>
                    <span>{paymentMethod ?? "Cash after service"}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{apiGrandTotal ?? grandTotal ?? "0"} AED</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="space-y-4">
            <p className="text-center text-gray-700">
              We've sent a confirmation email with these details to your
              registered email address.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/bookings">View My Bookings</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>}


  

      
      <Footer />
    </div>
  );
}
