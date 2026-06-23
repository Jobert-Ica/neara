import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const professional = await prisma.professionalProfile.findUnique({
    where: { id, verificationStatus: "APPROVED", isPublic: true },
    include: {
      user: { select: { id: true, name: true, image: true, email: false } },
      portfolioItems: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          // Client user info — only name and image
        },
      },
      documents: false, // Never expose documents publicly
    },
  });

  if (!professional) {
    return NextResponse.json({ error: "Professional not found" }, { status: 404 });
  }

  // Calculate average rating
  const avgRating =
    professional.reviewCount > 0
      ? professional.totalRating / professional.reviewCount
      : 0;

  return NextResponse.json({ ...professional, avgRating });
}
