"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  
  return session.user;
}

export async function updateReportStatus(reportId: string, status: "REVIEWED" | "RESOLVED" | "DISMISSED", note?: string) {
  const admin = await requireAdmin();

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      reviewedBy: admin.id,
      reviewNote: note || null,
    }
  });

  revalidatePath("/admin/reports");
  return { success: true };
}
