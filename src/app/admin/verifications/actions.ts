"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sendVerificationApprovedEmail, sendVerificationRejectedEmail } from "@/lib/resend";

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  
  return session.user;
}

export async function approveProfessional(professionalId: string) {
  const admin = await requireAdmin();

  const profile = await prisma.professionalProfile.findUnique({
    where: { id: professionalId },
    include: { user: true }
  });

  if (!profile) throw new Error("Professional not found");

  await prisma.professionalProfile.update({
    where: { id: professionalId },
    data: {
      verificationStatus: "APPROVED",
      verifiedAt: new Date(),
      verifiedBy: admin.id,
      rejectionReason: null,
    }
  });

  await prisma.professionalDocument.updateMany({
    where: { professionalId },
    data: {
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    }
  });

  // Send email
  try {
    await sendVerificationApprovedEmail({
      to: profile.user.email,
      name: profile.user.name,
      profession: profile.profession,
    });
  } catch (error) {
    console.error("Failed to send approval email:", error);
  }

  revalidatePath("/admin/verifications");
  return { success: true };
}

export async function rejectProfessional(professionalId: string, reason: string) {
  await requireAdmin();

  const profile = await prisma.professionalProfile.findUnique({
    where: { id: professionalId },
    include: { user: true }
  });

  if (!profile) throw new Error("Professional not found");

  await prisma.professionalProfile.update({
    where: { id: professionalId },
    data: {
      verificationStatus: "REJECTED",
      rejectionReason: reason,
    }
  });

  // Send email
  try {
    await sendVerificationRejectedEmail({
      to: profile.user.email,
      name: profile.user.name,
      reason: reason,
    });
  } catch (error) {
    console.error("Failed to send rejection email:", error);
  }

  revalidatePath("/admin/verifications");
  return { success: true };
}
