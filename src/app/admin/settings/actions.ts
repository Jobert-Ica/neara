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

export async function createCreditPackage(data: { name: string; credits: number; pricePhp: number; description?: string }) {
  await requireAdmin();

  await prisma.creditPackage.create({
    data: {
      name: data.name,
      credits: data.credits,
      pricePhp: data.pricePhp,
      description: data.description,
      isActive: true,
    }
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function toggleCreditPackageStatus(id: string, isActive: boolean) {
  await requireAdmin();

  await prisma.creditPackage.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateSystemSetting(key: string, value: any) {
  const admin = await requireAdmin();

  await prisma.systemSetting.upsert({
    where: { key },
    update: { value, updatedBy: admin.id },
    create: { key, value, updatedBy: admin.id },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
