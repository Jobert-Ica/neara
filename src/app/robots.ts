import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://neara.ph";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og/*"],
      disallow: ["/admin/", "/dashboard/", "/pro-dashboard/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
