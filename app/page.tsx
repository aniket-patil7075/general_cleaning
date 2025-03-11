"use client";
import { Button } from "@/components/ui/button";
import {
  Database,
  CreditCard,
  Atom,
  BarChart,
  Lock,
  Zap,
  Sparkles,
  Layers,
  Star,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useApiContext } from "@/lib/api/ApiContext";
import { useFacebookPixel } from "@/hooks/use-facebook-pixel"

declare global {
  interface Window {
    google: any;
  }
}

export default function Home() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trendingServices } = useApiContext();
  const { trackServiceView } = useFacebookPixel()

  useEffect(() => {
    if (trendingServices && trendingServices.length > 0) {
      // Track the first service view
      trackServiceView(trendingServices[0].name)
    }
  }, [trendingServices])

  useEffect(() => {
    if (!trendingServices) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [trendingServices]);

  return (
    <div className="flex flex-col min-h-screen">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setIsScriptLoaded(true)}
      />
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div>
          <main className="flex-grow">
            {/* Hero Section */}
            <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
              <div className="container">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                  <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                      Sparkling clean spaces <br />
                      <span className="text-orange-500">with expert care</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-[600px]">
                      Experience professional cleaning that leaves your space
                      spotless, fresh, and hygienic, ensuring a healthier,
                      cleaner, and more refreshing living or working environment
                    </p>
                    <Button className="rounded-full gap-2 group" size="lg">
                      Book your service
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Your phone number"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="message"
                            className="text-sm font-medium text-gray-700"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Your message"
                            required
                          ></textarea>
                        </div>
                        <Button type="submit" className="w-full">
                          Send Message
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3D Card Section */}

            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {trendingServices.map((service, index) => (
                    <HoverCard key={index}>
                      <HoverCardTrigger asChild>
                        <div className="w-full perspective">
                          <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative px-7 py-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex flex-col items-center justify-between space-y-6 hover:scale-105 transition-transform duration-300 ease-in-out">
                              <div className="space-y-4  text-center">
                                <div className="relative h-40 mb-2">
                                  <Image
                                    src={`https://test.barakatbayut.com/storage/app/public/service/${service.thumbnail}`}
                                    alt={service.name}
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                </div>
                                <h3 className="text-xl font-bold">
                                  {service.name}
                                </h3>
                                <p className="text-muted-foreground">
                                  {service.short_description.length > 70
                                    ? service.short_description.slice(0, 70) +
                                      "..."
                                    : service.short_description}
                                </p>
                              </div>
                              <Button
                                variant="default"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => router.push("/booking/location")}
                              >
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {service.name}
                            </h4>
                            <p className="text-sm">
                              {service.short_description}
                            </p>
                            <div className="flex items-center pt-2">
                              <span className="text-xs text-muted-foreground">
                                Explore this feature to enhance your SaaS
                                experience.
                              </span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonial Section */}
            <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
              <div className="container">
                <h2 className="text-3xl font-bold text-center mb-12">
                  What Our Customers Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      name: "Mike",
                      role: "Business Owner",
                      content:
                        "Thank you! That was very helpful! The servicemen were very professional and very cautious about safety.",
                      avatar: "/placeholder.svg",
                    },
                    {
                      name: "Lina Omar",
                      role: "Homeowner",
                      content:
                        "Their deep cleaning service transformed my home! Every corner was spotless, and the freshness lasted for weeks.",
                      avatar: "/placeholder.svg",
                    },
                    {
                      name: "Yusuf Patel",
                      role: "Restaurant Owner",
                      content:
                        "General cleaning services are outstanding! Our dining area stays spotless, ensuring a hygienic and welcoming atmosphere for customers.",
                      avatar: "/placeholder.svg",
                    },
                  ].map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={testimonial.avatar}
                                alt={testimonial.name}
                              />
                              <AvatarFallback>
                                {testimonial.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {testimonial.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                          <blockquote className="mt-4 text-muted-foreground">
                            "{testimonial.content}"
                          </blockquote>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="container py-12 md:py-24 lg:py-32">
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* General Cleaning */}
                <div className="space-y-4">
                  <div className="bg-orange-500 text-white p-3 rounded-lg w-fit">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">General Cleaning</h3>
                  <p className="text-muted-foreground">
                    Keep your home or office fresh and tidy with our reliable
                    general cleaning services.
                  </p>
                </div>

                {/* Deep Cleaning */}
                <div className="space-y-4">
                  <div className="bg-orange-500 text-white p-3 rounded-lg w-fit">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Deep Cleaning</h3>
                  <p className="text-muted-foreground">
                    Experience a thorough and detailed cleaning that removes
                    dirt, germs, and hidden grime.
                  </p>
                </div>

                {/* Golden Cleaning */}
                <div className="space-y-4">
                  <div className="bg-orange-500 text-white p-3 rounded-lg w-fit">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Golden Cleaning</h3>
                  <p className="text-muted-foreground">
                    Premium cleaning solutions with exceptional attention to
                    detail for a spotless space.
                  </p>
                </div>

                {/* VIP Cleaning */}
                <div className="space-y-4">
                  <div className="bg-orange-500 text-white p-3 rounded-lg w-fit">
                    <Crown className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">VIP Cleaning</h3>
                  <p className="text-muted-foreground">
                    Exclusive, high-end cleaning services ensuring the highest
                    standards of hygiene and luxury.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
              <div className="container">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                      Experience Premium Cleaning Services
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-[600px]">
                      From general cleaning to VIP treatment, we offer top-notch
                      services tailored to your needs. Enjoy a spotless space
                      effortlessly.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    {/* <Button
                      variant="outline"
                      className="rounded-full gap-2 group"
                      size="lg"
                    >
                      View the services
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Button> */}
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      )}
    </div>
  );
}
