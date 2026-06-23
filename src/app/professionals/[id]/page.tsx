import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfessionalProfileClient from "./ProfessionalProfileClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProfessional(id: string) {
  try {
    const professional = await prisma.professionalProfile.findUnique({
      where: { id, verificationStatus: "APPROVED", isPublic: true },
      include: {
        user: { select: { id: true, name: true, image: true } },
        portfolioItems: {
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    return professional;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const professional = await getProfessional(id);
  if (!professional) return {};

  const profession = professional.profession.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${professional.user.name} — ${profession}`,
    description: professional.aboutMe?.slice(0, 160) || `${profession} based in ${professional.city}, Philippines.`,
  };
}

export default async function ProfessionalProfilePage({ params }: Props) {
  const { id } = await params;
  const professional = await getProfessional(id);

  if (!professional) notFound();

  const avgRating =
    professional.reviewCount > 0
      ? professional.totalRating / professional.reviewCount
      : 0;

  return (
    <>
      <Navbar />
      <ProfessionalProfileClient
        professional={{ ...professional, avgRating }}
      />
      <Footer />
    </>
  );
}
