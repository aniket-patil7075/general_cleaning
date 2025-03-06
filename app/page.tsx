"use client";
import { Button } from "@/components/ui/button";
import { Database, CreditCard, Atom, BarChart, Lock, Zap } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";
import Script from "next/script";

interface Service {
  id: string;
  name: string;
  thumbnail: string;
  short_description: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const zoneId = searchParams.get("zoneId");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendingServices, setTrendingServices] = useState<Service[]>([]);
  const zoneId = "a1614dbe-4732-11ee-9702-dee6e8d77be4";

  useEffect(() => {
    const fetchData = async () => {
      if (!zoneId) {
        setError("No zone ID provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [servicesResponse] = await Promise.all([
          fetch(
            `https://test.barakatbayut.com/api/v1/customer/service?offset=1&limit=10`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                zoneid: zoneId,
                "x-localization": "en",
              },
            }
          ),
        ]);

        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const servicesData = await servicesResponse.json();

        console.log("SErvice data : ", servicesData);

        if (servicesData.content && Array.isArray(servicesData.content.data)) {
          setTrendingServices(servicesData.content.data);
        } else {
          console.error(
            "Unexpected services API response structure:",
            servicesData
          );
          setTrendingServices([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [zoneId]);

  console.log("trending service : ", trendingServices);

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
                      Build Your SaaS <br />
                      <span className="text-orange-500">Faster Than Ever</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-[600px]">
                      Launch your SaaS product in record time with our powerful,
                      ready-to-use template. Packed with modern technologies and
                      essential integrations.
                    </p>
                    <Button className="rounded-full gap-2 group" size="lg">
                      Deploy your own
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
                      name: "Alex Johnson",
                      role: "CEO, TechStart",
                      content:
                        "This SaaS template has been a game-changer for our startup. We launched in half the time we expected!",
                      avatar: "/placeholder.svg",
                    },
                    {
                      name: "Sarah Lee",
                      role: "CTO, InnovateCo",
                      content:
                        "The integration capabilities are top-notch. It's like this template was custom-built for our needs.",
                      avatar: "/placeholder.svg",
                    },
                    {
                      name: "Mike Chen",
                      role: "Founder, DataDrive",
                      content:
                        "I'm impressed by the scalability. As our user base grew, the platform handled it with ease.",
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
              <div className="grid gap-8 md:grid-cols-3">
                {/* Feature 1 */}
                <div className="space-y-4">
                  <div className="bg-orange-500 text-white p-3 rounded-lg w-fit">
                    <Atom className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Next.js and React</h3>
                  <p className="text-muted-foreground">
                    Leverage the power of modern web technologies for optimal
                    performance and developer experience.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="space-y-4">
                  <div className="bg-orange-500 text-white p-3 rounded-lg w-fit">
                    <Database className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Postgres and Drizzle ORM
                  </h3>
                  <p className="text-muted-foreground">
                    Robust database solution with an intuitive ORM for efficient
                    data management and scalability.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="space-y-4">
                  <div className="bg-orange-500 text-white p-3 rounded-lg w-fit">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Stripe Integration</h3>
                  <p className="text-muted-foreground">
                    Seamless payment processing and subscription management with
                    industry-leading Stripe integration.
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
                      Ready to launch your SaaS?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-[600px]">
                      Our template provides everything you need to get your SaaS
                      up and running quickly. Don't waste time on boilerplate -
                      focus on what makes your product unique.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="rounded-full gap-2 group"
                      size="lg"
                    >
                      View the code
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
