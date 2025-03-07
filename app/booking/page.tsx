"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useApiContext } from "@/lib/api/ApiContext";
import { Header } from "@/components/header";
type AddressDataType = any[];
interface Service {
  id: string;
  name: string;
  thumbnail: string;
  short_description: string;
}

export default function BookingPage() {
  const [hours, setHours] = useState(2);
  const [professionals, setProfessionals] = useState(1);
  const { needMaterials, setNeedMaterials } = useApiContext();
  // const [instructions, setInstructions] = useState("");
  const router = useRouter();
  const [addressData, setAddressData] = useState<AddressDataType>([]);
  const [loading, setLoading] = useState(false);
  // const [trendingServices, setTrendingServices] = useState<Service[]>([]);
  const [hoursPrice, setHoursPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { instructions, setInstructions } = useApiContext();
  const {trendingServices} = useApiContext();

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

  const handleSaveProfessionalsCartData = async () => {
    const postData = {
      service_id: "4b5fab69-c434-4a5e-9c8f-aadd3c3b92aa",
      category_id: "3af987e4-c3eb-444a-86ec-acb9ccd31caf",
      variant_key: "Professionals",
      quantity: String(professionals),
      sub_category_id: "eeb77aeb-c760-4356-b7a5-97f685e1a4e4",
      guest_id: "f124d7e0-f815-11ef-b1a6-ad24eae42883",
    };

    try {
      const response = await axios.post(
        "https://test.barakatbayut.com/api/v1/customer/cart/add",
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

    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveHoursCartData = async () => {
    const postData = {
      service_id: "4b5fab69-c434-4a5e-9c8f-aadd3c3b92aa",
      category_id: "3af987e4-c3eb-444a-86ec-acb9ccd31caf",
      variant_key: "Number-of-Hours",
      quantity: String(hours),
      sub_category_id: "eeb77aeb-c760-4356-b7a5-97f685e1a4e4",
      guest_id: "f124d7e0-f815-11ef-b1a6-ad24eae42883",
    };

    try {
      const response = await axios.post(
        "https://test.barakatbayut.com/api/v1/customer/cart/add",
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

    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        handleSaveProfessionalsCartData(),
        handleSaveHoursCartData(),
      ]);
      router.push("/booking/date");
    } catch (error) {
      console.error("Error saving cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const zoneId = "a1614dbe-4732-11ee-9702-dee6e8d77be4";

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!zoneId) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const [servicesResponse] = await Promise.all([
  //         fetch(
  //           `https://test.barakatbayut.com/api/v1/customer/service?offset=1&limit=10`,
  //           {
  //             method: "GET",
  //             headers: {
  //               "Content-Type": "application/json",
  //               zoneid: zoneId,
  //               "x-localization": "en",
  //             },
  //           }
  //         ),
  //       ]);

  //       if (!servicesResponse.ok) {
  //         throw new Error("Failed to fetch data");
  //       }

  //       const servicesData = await servicesResponse.json();

  //       console.log("SErvice Data : ", servicesData);

  //       if (servicesData.content && Array.isArray(servicesData.content.data)) {
  //         setTrendingServices(servicesData.content.data);

  //         let professionalPrice = null;
  //         let hoursPrice = null;

  //         servicesData.content.data.forEach((service) => {
  //           if (Array.isArray(service.variations)) {
  //             service.variations.forEach((variation) => {
  //               if (variation.variant_key === "Number-of-Hours") {
  //                 hoursPrice = variation.price;
  //               }
  //             });
  //           }
  //         });

  //         setHoursPrice(hoursPrice);
  //       } else {
  //         console.error(
  //           "Unexpected services API response structure:",
  //           servicesData
  //         );
  //         setTrendingServices([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);        
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [zoneId]);

  console.log("serivce dataa : ", trendingServices)

  useEffect(() => {
    let hoursPrice = null;
  
    trendingServices.forEach((service) => {
      if (service.variations) {
        service.variations.forEach((variation) => {
          if (variation.variant_key === "Number-of-Hours") {
            hoursPrice = variation.price;
          }
        });
      }
    });
  
    setHoursPrice(hoursPrice);
  }, [trendingServices]);

  useEffect(() => {
    setTotalPrice(
      hours * hoursPrice * professionals + (needMaterials ? 10 : 0)
    );
  }, [hours, hoursPrice, professionals, needMaterials]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Link
              href="/booking/location"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <div className="mt-4 flex items-center gap-2">
              <h1 className="text-xl font-semibold">Step 2 of 4</h1>
              <div className="h-1 flex-1 rounded-full bg-gray-200">
                <div className="h-1 w-2/4 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hours Selection */}
                  <div className="space-y-4">
                    <Label>
                      How many hours do you need your professional to stay?
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <Button
                          key={num}
                          variant={hours === num ? "default" : "outline"}
                          className="h-12 w-12 rounded-full"
                          onClick={() => setHours(num)}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Professionals Selection */}
                  <div className="space-y-4">
                    <Label>How many professionals do you need?</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <Button
                          key={num}
                          variant={
                            professionals === num ? "default" : "outline"
                          }
                          className="h-12 w-12 rounded-full"
                          onClick={() => setProfessionals(num)}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Materials Selection */}
                  <div className="space-y-4">
                    <Label>Need cleaning materials?</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={!needMaterials ? "default" : "outline"}
                        onClick={() => setNeedMaterials(false)}
                      >
                        No, I have them
                      </Button>
                      <Button
                        variant={needMaterials ? "default" : "outline"}
                        onClick={() => setNeedMaterials(true)}
                        className="relative px-7"
                      >
                        Yes, please
                        <span className="absolute -top-2 right-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full ">
                          AED 10 Extra
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-4">
                    <Label htmlFor="instructions">
                      Any instructions or special requirements?
                    </Label>
                    <Textarea
                      id="instructions"
                      placeholder="Example: Key under the mat, ironing, window cleaning, etc."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="text-right text-sm text-gray-500">
                      {instructions.length}/150
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
                    <span className="text-gray-600">Service</span>
                    <span>Home Cleaning</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span>{hours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Number of Professionals
                    </span>
                    <span>{professionals}</span>
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
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>AED {totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {loading ? (
                <div className="flex flex-col items-center mt-4">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
              ) : (
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={handleSaveData}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
