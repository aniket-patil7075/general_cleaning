import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL for your website
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://baraketbayut.com"

  // Current date for lastModified
  const currentDate = new Date()

  // Define your routes
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking/location`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/booking/date`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/booking/payment`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  return routes
}

