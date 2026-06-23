import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

const CREDIT_LOW_THRESHOLD = 3;

export async function getBalance(professionalId: string): Promise<number> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { id: professionalId },
    select: { creditBalance: true },
  });
  return profile?.creditBalance ?? 0;
}

export async function deductCredits(
  professionalId: string,
  amount: number,
  description: string,
  referenceId?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  return prisma.$transaction(async (tx) => {
    const profile = await tx.professionalProfile.findUnique({
      where: { id: professionalId },
      select: { creditBalance: true, userId: true },
    });

    if (!profile) {
      return { success: false, newBalance: 0, error: "Professional not found" };
    }

    if (profile.creditBalance < amount) {
      return {
        success: false,
        newBalance: profile.creditBalance,
        error: "Insufficient credits",
      };
    }

    const newBalance = profile.creditBalance - amount;

    await tx.professionalProfile.update({
      where: { id: professionalId },
      data: { creditBalance: newBalance },
    });

    await tx.creditTransaction.create({
      data: {
        professionalId,
        amount: -amount,
        type: "DEDUCTION",
        description,
        referenceId,
        balanceBefore: profile.creditBalance,
        balanceAfter: newBalance,
      },
    });

    // Notify if low on credits
    if (newBalance <= CREDIT_LOW_THRESHOLD) {
      await createNotification({
        userId: profile.userId,
        type: "CREDITS_LOW",
        title: "Low Credit Balance",
        body: `You only have ${newBalance} credit${newBalance !== 1 ? "s" : ""} remaining. Purchase more to keep accepting requests.`,
        data: { balance: newBalance },
      });
    }

    return { success: true, newBalance };
  });
}

export async function addCredits(
  professionalId: string,
  amount: number,
  type: "PURCHASE" | "REFUND" | "ADMIN_GRANT",
  description: string,
  referenceId?: string
): Promise<{ success: boolean; newBalance: number }> {
  return prisma.$transaction(async (tx) => {
    const profile = await tx.professionalProfile.findUnique({
      where: { id: professionalId },
      select: { creditBalance: true, userId: true },
    });

    if (!profile) {
      return { success: false, newBalance: 0 };
    }

    const newBalance = profile.creditBalance + amount;

    await tx.professionalProfile.update({
      where: { id: professionalId },
      data: { creditBalance: newBalance },
    });

    await tx.creditTransaction.create({
      data: {
        professionalId,
        amount,
        type,
        description,
        referenceId,
        balanceBefore: profile.creditBalance,
        balanceAfter: newBalance,
      },
    });

    if (type === "PURCHASE") {
      await createNotification({
        userId: profile.userId,
        type: "CREDITS_PURCHASED",
        title: "Credits Added",
        body: `${amount} credits have been added to your account. New balance: ${newBalance} credits.`,
        data: { amount, newBalance },
      });
    }

    return { success: true, newBalance };
  });
}

export async function getRequestCreditCost(
  _projectType?: string
): Promise<number> {
  // Look up configurable cost from system settings
  const setting = await prisma.systemSetting.findUnique({
    where: { key: "credit_cost_per_request" },
  });

  if (setting && typeof setting.value === "object" && setting.value !== null) {
    const val = (setting.value as Record<string, unknown>).value;
    if (typeof val === "number") return val;
  }

  return 1; // Default: 1 credit per request
}
