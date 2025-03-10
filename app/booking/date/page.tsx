"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RefreshCcw, X } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useApiContext } from "@/lib/api/ApiContext";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "@/components/ui/calendar";

type FrequencyOption = {
  id: string;
  title: string;
  description: string;
  discount?: {
    percentage: number;
    label: string;
  };
  isPopular?: boolean;
};

type AddressDataType = any[];
type cartDataType = any[];

export default function BookingDatePage() {
  const { selectedDate, setSelectedDate } = useApiContext();
  const { selectedTime, setSelectedTime } = useApiContext();
  const [frequency, setFrequency] = useState<string>("one-time");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addressData, setAddressData] = useState<AddressDataType>([]);
  const [hourData, setHourData] = useState<cartDataType>([]);
  const [grandTotal, setGrandTotal] = useState<cartDataType>([]);
  const [totalTax, setTotalTax] = useState<cartDataType>([]);
  const [professionalData, setProfessionalData] = useState<cartDataType>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedDates, setSelectedDates } = useApiContext();
  const { apiGrandTotal, setApiGrandTotal } = useApiContext();
  const { apiHoursData, setApiHoursData } = useApiContext();
  const { apiProfessionalData, setApiProfessionalData } = useApiContext();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { needMaterials } = useApiContext();
  const router = useRouter();

  setApiGrandTotal(grandTotal * professionalData);
  setApiHoursData(hourData);
  setApiProfessionalData(professionalData);

  const handleNextClick = () => {
    router.push("/booking/payment");
  };

  const frequencyOptions: FrequencyOption[] = [
    {
      id: "multiple",
      title: "Multiple Time Booking",
      description:
        "Elevate your space with our Monthly Cleaning Subscription. Pause or cancel anytime.",
      // discount: {
      //   percentage: 10,
      //   label: "10% Off",
      // },
      isPopular: true,
    },
    {
      id: "one-time",
      title: "One Time",
      description: "Perfect pick when your schedule is uncertain.",
    },
  ];
  const getNextNineDays = () => {
    const today = new Date();
    const dates = [];
  
    for (let i = 0; i < 9; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      dates.push({
        day: futureDate.getDate(), 
        fullDate: futureDate.toISOString().split('T')[0], // Unique full date string
      });
    }
  
    return dates;
  };
  
  const dates = getNextNineDays();
  const timeSlots = [
    "13:00-13:30",
    "13:30-14:00",
    "14:00-14:30",
    "14:30-15:00",
  ];

  const { getCustomerAddress } = useApiContext();

  const fetchData = async () => {
    try {
      const response = await getCustomerAddress.execute({
        limit: 100,
        offset: 1,
        guest_id: "f124d7e0-f815-11ef-b1a6-ad24eae42883",
      });
      if (response?.content?.data) {
        setAddressData(response.content.data);
      } else {
        console.warn("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { getCartData } = useApiContext();

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await getCartData.execute({
        limit: 100,
        offset: 1,
        guest_id: "f124d7e0-f815-11ef-b1a6-ad24eae42883",
      });

      console.log("card Data : ", response);

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

        setGrandTotal(hourTotalCost);

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

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  const formattedDates = selectedDates
    .map(
      (date) =>
        `${date.getDate()} ${date.toLocaleString("en-US", { month: "long" })}`
    )
    .join(", ");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div>
          <main className="flex-grow bg-gray-50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl">
              {/* Header */}
              <div className="mb-8">
                <Link
                  href="/booking"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Service Details
                </Link>
                <div className="mt-4 flex items-center gap-2">
                  <h1 className="text-xl font-semibold">Step 3 of 4</h1>
                  <div className="h-1 flex-1 rounded-full bg-gray-200">
                    <div className="h-1 w-3/4 rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Main Form */}
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Date & Time</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Frequency Selection */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <RefreshCcw className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">
                              {frequencyOptions.find(
                                (opt) => opt.id === frequency
                              )?.title || "One Time Service"}
                            </span>
                          </div>
                          <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button variant="link" className="text-blue-500">
                                Change
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px]">
                              <DialogHeader className="flex flex-row items-center justify-between">
                                <DialogTitle>Choose your frequency</DialogTitle>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-full"
                                  onClick={() => setIsDialogOpen(false)}
                                ></Button>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                {frequencyOptions.map((option) => (
                                  <div
                                    key={option.id}
                                    className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                                      frequency === option.id
                                        ? "bg-blue-50 border-blue-200"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() => {
                                      setFrequency(option.id);
                                      if (option.id === "multiple") {
                                        setIsCalendarOpen(true);
                                      } else {
                                        setIsCalendarOpen(false);
                                      }
                                    }}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h3 className="font-medium">
                                            {option.title}
                                          </h3>
                                          {option.isPopular && (
                                            <Badge
                                              variant="secondary"
                                              className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                                            >
                                              Most popular
                                            </Badge>
                                          )}
                                          {option.discount && (
                                            <Badge
                                              variant="secondary"
                                              className="bg-green-100 text-green-700 hover:bg-green-100"
                                            >
                                              {option.discount.label}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="mt-1 text-sm  text-gray-500">
                                          {option.description}
                                        </p>
                                        {option.id !== "one-time" && (
                                          <p className="mt-1 text-sm text-gray-500">
                                            Pause or cancel anytime.
                                          </p>
                                        )}
                                      </div>
                                      <div
                                        className={`h-5 w-5 rounded-full border-2 ${
                                          frequency === option.id
                                            ? "border-blue-500 bg-blue-500"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        {frequency === option.id && (
                                          <div className="h-full w-full rounded-full border-2 border-white" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {isCalendarOpen && (
                                <div className="w-full flex flex-col items-center">
                                  <Calendar
                                    className="w-full max-w-none"
                                    mode="multiple" // Enables multiple date selection
                                    selected={selectedDates} // Binds selected dates to state
                                    onSelect={(dates) =>
                                      setSelectedDates(dates || [])
                                    } // Updates state on selection
                                  />
                                </div>
                              )}

                              <Button
                                className="w-full bg-[#f8e147] hover:bg-[#f8e147]/90 text-black"
                                onClick={() => setIsDialogOpen(false)}
                              >
                                Select
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      {/* Date Selection */}
                      {frequency === "one-time" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            When would you like your service?
                          </h3>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                          {dates.map(({ day, fullDate }) => (
      <Button
        key={fullDate} // Using full date as unique key
        variant={selectedDate === fullDate ? "default" : "outline"}
        className="h-12 w-12 rounded-full flex-shrink-0"
        onClick={() => setSelectedDate(fullDate)}
      >
        {day}
      </Button>
    ))}
                            <Button
                              variant="outline"
                              className="h-12 w-12 rounded-full flex-shrink-0"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Time Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          What time would you like us to start?
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className="relative"
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                              
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Cancellation Policy */}
                      <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                        <div className="h-5 w-5 text-gray-400 cursor-pointer">ℹ️</div>
                        <div>
                          Enjoy free cancellation up to 6 hours before your
                          booking start time.
                          <Button
                            variant="link"
                            className="text-blue-500 p-0 h-auto font-normal"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Booking Summary */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Booking Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address</span>
                        <span className="text-right">
                          {addressData.length > 0
                            ? addressData[0].address
                            : "No address available"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency</span>
                        <span>
                          {frequencyOptions.find((opt) => opt.id === frequency)
                            ?.title || "One Time"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service</span>
                        <span>Home Cleaning</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span>{hourData}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Start Time</span>
                        <span>
                          {frequency === "one-time"
                            ? `${selectedDate} `
                            : formattedDates}{" "}
                          {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Number of Professionals
                        </span>
                        <span>{professionalData}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material</span>
                        <span>{needMaterials ? "Yes" : "No"}</span>
                      </div>
                      {needMaterials ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Material Cost</span>
                          <span>10 AED</span>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>{totalTax * professionalData} AED</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>
                            {grandTotal * professionalData +
                              (needMaterials ? 10 : 0)}{" "}
                            AED <span className="text-sm">(Tax Included)</span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    className="mt-4 w-full"
                    size="lg"
                    onClick={handleNextClick}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
}
