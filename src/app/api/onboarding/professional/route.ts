import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/resend";

const professionalOnboardingSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  profession: z.enum([
    "ARCHITECT", "CIVIL_ENGINEER", "STRUCTURAL_ENGINEER",
    "ELECTRICAL_ENGINEER", "MECHANICAL_ENGINEER", "CONTRACTOR",
    "INTERIOR_DESIGNER", "LANDSCAPE_ARCHITECT", "SURVEYOR",
    "QUANTITY_SURVEYOR", "PROJECT_MANAGER", "CONSTRUCTION_CONSULTANT",
    "BUILDING_INSPECTOR",
  ]),
  specialization: z.string().optional(),
  yearsExperience: z.number().int().min(0).max(60),
  province: z.string().min(1),
  city: z.string().min(1),
  serviceAreas: z.array(z.string()).default([]),
  aboutMe: z.string().max(2000).optional(),
  prcLicenseNumber: z.string().min(3).max(20),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = professionalOnboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { name: data.fullName, phone: data.phone, role: "PROFESSIONAL" },
      });

      await tx.professionalProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          profession: data.profession,
          specialization: data.specialization,
          yearsExperience: data.yearsExperience,
          province: data.province,
          city: data.city,
          serviceAreas: data.serviceAreas,
          aboutMe: data.aboutMe,
          prcLicenseNumber: data.prcLicenseNumber,
          verificationStatus: "PENDING",
          onboardingComplete: true,
          isPublic: false,
        },
        update: {
          profession: data.profession,
          specialization: data.specialization,
          yearsExperience: data.yearsExperience,
          province: data.province,
          city: data.city,
          serviceAreas: data.serviceAreas,
          aboutMe: data.aboutMe,
          prcLicenseNumber: data.prcLicenseNumber,
          onboardingComplete: true,
        },
      });
    });

    sendWelcomeEmail({
      to: session.user.email,
      name: data.fullName,
      role: "PROFESSIONAL",
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Professional onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
