import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

const CREDITS_TO_ACCEPT = 10;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  const parsed = actionSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { action } = parsed.data;

  // Find the request
  const projectRequest = await prisma.projectRequest.findUnique({
    where: { id },
  });

  if (!projectRequest || projectRequest.professionalId !== profile.id) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (projectRequest.status !== "PENDING") {
    return NextResponse.json({ error: `Request is already ${projectRequest.status}` }, { status: 400 });
  }

  if (action === "decline") {
    await prisma.projectRequest.update({
      where: { id },
      data: { status: "DECLINED" },
    });
    return NextResponse.json({ success: true, status: "DECLINED" });
  }

  // Handle "accept"
  if (profile.verificationStatus !== "APPROVED") {
    return NextResponse.json({ error: "Your profile must be verified to accept requests" }, { status: 403 });
  }

  if (profile.creditBalance < CREDITS_TO_ACCEPT) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  try {
    // Perform transaction: deduct credits, record transaction, update request status, and check if project needs to be "MATCHED"
    await prisma.$transaction(async (tx) => {
      // Deduct credits
      await tx.professionalProfile.update({
        where: { id: profile.id },
        data: { creditBalance: { decrement: CREDITS_TO_ACCEPT } },
      });

      // Record transaction
      await tx.creditTransaction.create({
        data: {
          professionalId: profile.id,
          amount: -CREDITS_TO_ACCEPT,
          type: "DEDUCTION",
          description: "Accepted project request",
          balanceBefore: profile.creditBalance,
          balanceAfter: profile.creditBalance - CREDITS_TO_ACCEPT,
        },
      });

      // Update request status
      await tx.projectRequest.update({
        where: { id },
        data: { 
          status: "ACCEPTED",
          creditsDeducted: CREDITS_TO_ACCEPT,
        },
      });

      // If the project was OPEN, maybe move it to IN_REVIEW or leave it OPEN until client closes it.
      // Usually, if a pro accepts, the client still has to hire.
      // We'll leave the project status alone or move it to IN_REVIEW if not already.
      const project = await tx.project.findUnique({ where: { id: projectRequest.projectId } });
      if (project?.status === "OPEN") {
        await tx.project.update({
          where: { id: project.id },
          data: { status: "IN_REVIEW" },
        });
      }
    });

    return NextResponse.json({ success: true, status: "ACCEPTED" });
  } catch (error) {
    console.error("Error accepting request:", error);
    return NextResponse.json({ error: "Failed to process acceptance" }, { status: 500 });
  }
}
