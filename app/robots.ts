import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/private/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || "https://baraketbayut.com"}/sitemap.xml`,
  }
}

