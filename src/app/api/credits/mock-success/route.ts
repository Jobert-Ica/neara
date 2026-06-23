import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const txId = searchParams.get("txId");

  if (!txId) {
    return NextResponse.json({ error: "Missing txId" }, { status: 400 });
  }

  try {
    // Fulfill the transaction
    const tx = await prisma.creditTransaction.findUnique({ where: { id: txId } });
    if (!tx || tx.type !== "PURCHASE") {
      return NextResponse.json({ error: "Invalid transaction" }, { status: 400 });
    }

    // Add credits to professional
    await prisma.professionalProfile.update({
      where: { id: tx.professionalId },
      data: { creditBalance: { increment: tx.amount } },
    });

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${origin}/pro-dashboard/credits?success=true`);
  } catch (error) {
    console.error("Mock success error:", error);
    return NextResponse.json({ error: "Failed to process mock payment" }, { status: 500 });
  }
}
