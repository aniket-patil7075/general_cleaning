import Script from "next/script"

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Baraket Bayut Cleaning Services",
    description: "Professional cleaning services for homes and offices in Dubai",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://baraketbayut.com",
    telephone: "+971 50 123 4567",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Financial Center Road",
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      addressCountry: "United Arab Emirates",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.2048,
      longitude: 55.2708,
    },
    image: [`${process.env.NEXT_PUBLIC_BASE_URL || "https://baraketbayut.com"}/barkat_main_logo.png`],
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: ["https://www.facebook.com/baraketbayut", "https://www.instagram.com/baraketbayut"],
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

