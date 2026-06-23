import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/xendit";
import { z } from "zod";

const PACKAGES = [
  { id: "basic", credits: 50, price: 1000 },
  { id: "pro", credits: 150, price: 2700 },
  { id: "elite", credits: 300, price: 4800 },
];

const checkoutSchema = z.object({
  packageId: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Professional profile not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
  }

  const pkg = PACKAGES.find((p) => p.id === parsed.data.packageId);
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  try {
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. Create a pending transaction record
    const transaction = await prisma.creditTransaction.create({
      data: {
        professionalId: profile.id,
        amount: pkg.credits,
        type: "PURCHASE",
        description: `Purchase ${pkg.credits} Credits (${pkg.id} pack)`,
        balanceBefore: profile.creditBalance,
        balanceAfter: profile.creditBalance + pkg.credits,
      },
    });

    // 2. Generate invoice via Xendit
    // Note: If Xendit key is not set, we'll mock the checkoutUrl for development.
    if (!process.env.XENDIT_SECRET_KEY) {
      console.warn("XENDIT_SECRET_KEY is missing. Mocking checkout response.");
      return NextResponse.json({ 
        invoiceUrl: `${origin}/api/credits/mock-success?txId=${transaction.id}`,
      });
    }

    const invoice = await createInvoice({
      externalId: transaction.id,
      amount: pkg.price,
      payerEmail: session.user.email,
      description: `NEARA Credits - ${pkg.credits} Pack`,
      successRedirectUrl: `${origin}/pro-dashboard/credits?success=true`,
      failureRedirectUrl: `${origin}/pro-dashboard/credits?error=payment_failed`,
    });

    return NextResponse.json({ invoiceUrl: invoice.checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
