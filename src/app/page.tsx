import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturedProfessionalsSection from "@/components/landing/FeaturedProfessionalsSection";
import ProfessionCategoriesSection from "@/components/landing/ProfessionCategoriesSection";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CtaSection from "@/components/landing/CtaSection";

export const metadata: Metadata = {
  title: "NEARA — Find Trusted Professionals in the Philippines",
  description:
    "Connect with verified architects, civil engineers, structural engineers, contractors, and interior designers. Find trusted professionals for your construction and design projects.",
};

async function getStats() {
  try {
    const [totalProfessionals, totalProjects, cities] = await Promise.all([
      prisma.professionalProfile.count({
        where: { verificationStatus: "APPROVED" },
      }),
      prisma.project.count({ where: { status: { not: "DRAFT" } } }),
      prisma.professionalProfile.findMany({
        where: { verificationStatus: "APPROVED", city: { not: null } },
        select: { city: true },
        distinct: ["city"],
      }),
    ]);
    return {
      professionals: totalProfessionals,
      projects: totalProjects,
      cities: cities.length,
    };
  } catch {
    return { professionals: 0, projects: 0, cities: 0 };
  }
}

async function getFeaturedProfessionals() {
  try {
    return prisma.professionalProfile.findMany({
      where: { verificationStatus: "APPROVED", isPublic: true },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { reviewCount: "desc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function LandingPage() {
  const [stats, featuredProfessionals] = await Promise.all([
    getStats(),
    getFeaturedProfessionals(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection stats={stats} />
        <StatsSection stats={stats} />
        <ProfessionCategoriesSection />
        <HowItWorksSection />
        <FeaturedProfessionalsSection professionals={featuredProfessionals} />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "NEARA",
            url: "https://neara.ph",
            description:
              "Professional marketplace connecting clients with verified architects, engineers, contractors, and designers in the Philippines.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://neara.ph/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
