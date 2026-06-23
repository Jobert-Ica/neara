import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/resend";

const clientOnboardingSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  province: z.string().min(1),
  city: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = clientOnboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { fullName, phone, province, city } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      // Update user name
      await tx.user.update({
        where: { id: session.user.id },
        data: { name: fullName, phone, role: "CLIENT" },
      });

      // Upsert client profile
      await tx.clientProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          province,
          city,
          onboardingComplete: true,
        },
        update: {
          province,
          city,
          onboardingComplete: true,
        },
      });
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail({
      to: session.user.email,
      name: fullName,
      role: "CLIENT",
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Client onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
