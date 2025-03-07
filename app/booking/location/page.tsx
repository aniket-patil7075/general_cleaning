"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

import { useApiContext } from "@/lib/api/ApiContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Header } from "@/components/header";

declare global {
  interface Window {
    google: any;
  }
}

interface Location {
  address: string;
  lat: number;
  lng: number;
}

const loadGoogleMapsScript = (callback: () => void) => {
  if (typeof window !== "undefined" && !window.google) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  } else {
    callback();
  }
};

const BookingLocationPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showAddressAlert, setShowAddressAlert] = useState(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    isAvailable: boolean;
    message: string;
  } | null>(null);
  const apiContext = useApiContext();
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cleaners: 1,
    hours: 4,
    frequency: "once",
    materials: "no",
    instructions: "",
    fullName: "",
    email: "",
    phone: "",
    location: null as Location | null,
    addressType: "home",
    buildingName: "",
    // buildingNo: "",
    apartmentNo: "",
    city: "",
    streetNo: "",
    selectedDate: new Date(),
    selectedTime: "",
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps script not loaded yet");
        return;
      }

      setTimeout(() => {
        const defaultLocation = { lat: 25.2048, lng: 55.2708 }; // Dubai coordinates
        const mapElement = document.getElementById("map") as HTMLElement;
        const input = document.getElementById("pac-input") as HTMLInputElement;
        inputRef.current = input;

        if (!mapElement || !input) {
          console.error("Map or SearchBox input not found");
          return;
        }

        const map = new window.google.maps.Map(mapElement, {
          center: defaultLocation,
          zoom: 13,
          mapTypeControl: false,
        });

        const marker = new window.google.maps.Marker({
          map,
          draggable: true,
          position: defaultLocation,
        });

        const searchBox = new window.google.maps.places.SearchBox(input);

        map.addListener("bounds_changed", () => {
          searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
        });

        // Handle search box selection
        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces();
          if (!places || places.length === 0) return;

          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          // Update map, marker, and input field
          map.setCenter(place.geometry.location);
          marker.setPosition(place.geometry.location);
          input.value = place.formatted_address || "";

          setFormData((prev) => ({
            ...prev,
            location: {
              address: place.formatted_address || "",
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          }));
        });

        // Handle marker drag event
        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          if (!position) return;

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: position.lat(), lng: position.lng() } },
            (results, status) => {
              if (status === "OK" && results?.[0]) {
                input.value = results[0].formatted_address || ""; // Update input box
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    address: results[0].formatted_address || "",
                    lat: position.lat(),
                    lng: position.lng(),
                  },
                }));
              }
            }
          );
        });

        // Handle map click event
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;

          marker.setPosition(event.latLng);

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: event.latLng }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              input.value = results[0].formatted_address || ""; // Update input box
              setFormData((prev) => ({
                ...prev,
                location: {
                  address: results[0].formatted_address || "",
                  lat: event.latLng!.lat(),
                  lng: event.latLng!.lng(),
                },
              }));
            }
          });
        });

        // Store references
        mapRef.current = map;
        markerRef.current = marker;
        searchBoxRef.current = searchBox;
      }, 500);
    });
  }, []);

  useEffect(() => {
    if (isScriptLoaded && autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["geocode"], // Suggests geographical locations
          componentRestrictions: { country: "AE" }, // Restrict to UAE
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setFormData((prev) => ({
            ...prev,
            location: {
              address: place.formatted_address || "",
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          }));
        }
      });
    }
  }, [isScriptLoaded]);

  const checkAvailability = async () => {
    if (formData.location) {
      try {
        const zoneResponse = await apiContext.getZoneId.execute({
          lat: formData.location.lat.toString(),
          lng: formData.location.lng.toString(),
        });

        if (zoneResponse.response_code === "zone_404") {
          setAvailabilityStatus({
            isAvailable: false,
            message:
              zoneResponse.message || "No service available in this area.",
          });
          setShowAlert(true);
          return;
        }

        if (!zoneResponse || !zoneResponse.content) {
          throw new Error(
            "Invalid response from getZoneId: " + JSON.stringify(zoneResponse)
          );
        }

        const zoneId = "a1614dbe-4732-11ee-9702-dee6e8d77be4";

        setAvailabilityStatus({
          isAvailable: true,
          message: zoneResponse.message || "service available in this area.",
        });
        router.push("/booking");
      } catch (error) {
        console.error("Error checking availability:", error);
        setAvailabilityStatus({
          isAvailable: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while checking availability. Please try again.",
        });
        setShowAlert(true);
      }
    } else {
      console.error("No coordinates available for availability check");
      setAvailabilityStatus({
        isAvailable: false,
        message: "Please enter a valid address.",
      });
    }
  };

  const handleSubmit = async () => {
    // Ensure all required fields are filled
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.location ||
      !formData.buildingName ||
      !formData.apartmentNo ||
      !formData.city ||
      !formData.streetNo
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const apiUrl =
      "https://test.barakatbayut.com/api/v1/customer/address?guest_id=f124d7e0-f815-11ef-b1a6-ad24eae42883";

    const requestBody = {
      address: formData.location?.address || 0,
      address_label: formData.location?.address || 0,
      address_type: "service",
      city: formData.city, // Ensure it's a number
      country: formData.location?.address.split(" - ").pop() || "Dubai",
      street: formData.streetNo,
      house: formData.buildingName,
      floor: formData.apartmentNo || 1,
      zip_code: formData.zipCode || "", // If not provided, send empty string
      zone_id: formData.zoneId || "", // If not provided, send empty string
      lat: formData.location?.lat || 0,
      lon: formData.location?.lng || 0,
      contact_person_name: formData.fullName,
      contact_person_number: formData.phone,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSaveData = async () => {
    setLoading(true);
    try {
      await Promise.all([handleSubmit()]);
      await Promise.all([checkAvailability()]);
    } catch (error) {
      console.error("Error saving cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <div className="mt-4 flex items-center gap-2">
              <h1 className="text-xl font-semibold">Step 1 of 4</h1>
              <div className="h-1 flex-1 rounded-full bg-gray-200">
                <div className="h-1 w-1/4 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Form */}
            <div className="md:col-span-2">
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  Where do you need the service?
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Help our teams get to your place on time by locating it on the
                  map below
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Save your address details
                    </label>
                    <div className="flex gap-2">
                      <Button
                        className={`flex-1 px-4 py-2 border ${
                          formData.addressType === "home"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, addressType: "home" })
                        }
                      >
                        Home
                      </Button>
                      <Button
                        className={`flex-1 px-4 py-2 border ${
                          formData.addressType === "office"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, addressType: "office" })
                        }
                      >
                        Office
                      </Button>
                      <Button
                        className={`flex-1 px-4 py-2 border ${
                          formData.addressType === "other"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, addressType: "other" })
                        }
                      >
                        Other
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Full Name"
                        value={formData.fullName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className={!formData.fullName ? "border-red-300" : ""}
                      />
                      {!formData.fullName && (
                        <p className="text-sm text-red-500 mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        placeholder="Contact Person Number"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                        className={!formData.phone ? "border-red-300" : ""}
                      />
                      {!formData.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          This field is required
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Map Search */}
                  <div className="relative">
                    <Input
                      id="pac-input"
                      type="text"
                      placeholder="Start typing to find your area"
                      className="w-full pl-10"
                      value={formData.location?.address || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            address: e.target.value,
                            lat: prev.location?.lat ?? 0, // Ensure a default number value
                            lng: prev.location?.lng ?? 0, // Ensure a default number value
                          },
                        }))
                      }
                    />
                    <svg
                      className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <div
                    id="map"
                    className="w-full h-[400px] rounded-lg border"
                  ></div>

                  <div className=" md:grid md:grid-cols-2 md:gap-4">
                    <div>
                      <Input
                        placeholder="Building Name"
                        value={formData.buildingName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            buildingName: e.target.value,
                          })
                        }
                        className={
                          !formData.buildingName ? "border-red-300" : ""
                        }
                      />
                      {!formData.buildingName && (
                        <p className="text-sm text-red-500 mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        placeholder="Apartment/Villa No"
                        value={formData.apartmentNo || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apartmentNo: e.target.value,
                          })
                        }
                        className={
                          !formData.apartmentNo ? "border-red-300" : ""
                        }
                      />
                      {!formData.apartmentNo && (
                        <p className="text-sm text-red-500 mt-1">
                          This field is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className=" md:grid md:grid-cols-2 md:gap-4">
                    <div>
                      <Input
                        placeholder="City"
                        value={formData.city || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className={!formData.city ? "border-red-300" : ""}
                      />
                      {!formData.city && (
                        <p className="text-sm text-red-500 mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        placeholder="Street No"
                        value={formData.streetNo || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            streetNo: e.target.value,
                          })
                        }
                        className={!formData.streetNo ? "border-red-300" : ""}
                      />
                      {!formData.streetNo && (
                        <p className="text-sm text-red-500 mt-1">
                          This field is required
                        </p>
                      )}
                    </div>
                  </div>

                  {/* <div className="space-y-4">
                  <Button
                    className="mt-4 w-full"
                    size="lg"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </div> */}
                </div>
              </>
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
                      {formData.location?.address || "No address selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span>Home Cleaning</span>
                  </div>

                  {/* <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                  </div>
                </div> */}
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

              {/* {availabilityStatus && showAlert && (
              <Alert
                className={`mt-4 ${
                  availabilityStatus.isAvailable ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <AlertTitle>
                  {availabilityStatus.isAvailable
                    ? "Service Available"
                    : "Service Unavailable"}
                </AlertTitle>
                <AlertDescription>
                  {availabilityStatus.message}
                </AlertDescription>
              </Alert>
            )} */}
              {availabilityStatus &&
                showAlert &&
                !availabilityStatus.isAvailable && (
                  <Dialog open={showAlert} onOpenChange={setShowAlert}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-red-600">
                          Service Unavailable
                        </DialogTitle>
                        <DialogDescription>
                          {availabilityStatus.message}
                        </DialogDescription>
                      </DialogHeader>
                      {/* Close Button */}
                      <DialogClose asChild>
                        {/* <button className="absolute top-2 right-2 text-xl font-bold">
                        ✖
                      </button> */}
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                )}

              {showAddressAlert && (
                <Alert
                  className={`mt-4 ${
                    showAddressAlert.type === "success"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <AlertTitle>
                    {showAddressAlert.type === "success"
                      ? "Saved Successfully"
                      : "Failed to Save"}
                  </AlertTitle>
                  <AlertDescription>
                    {showAddressAlert.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingLocationPage;
