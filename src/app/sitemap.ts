import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://neara.ph";

  // Public static routes
  const staticRoutes = [
    "",
    "/browse",
    "/professionals",
    "/sign-in",
    "/client-onboarding",
    "/professional-onboarding",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic professional profiles
  const professionals = await prisma.professionalProfile.findMany({
    where: {
      verificationStatus: "APPROVED",
      isPublic: true,
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const professionalRoutes = professionals.map((pro) => ({
    url: `${baseUrl}/professionals/${pro.id}`,
    lastModified: pro.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...professionalRoutes];
}
