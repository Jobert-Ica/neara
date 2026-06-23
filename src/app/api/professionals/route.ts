import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/professionals?profession=&province=&city=&minRating=&verified=&page=&limit=
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const profession = searchParams.get("profession");
  const province = searchParams.get("province");
  const city = searchParams.get("city");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const verifiedOnly = searchParams.get("verified") === "true";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(24, parseInt(searchParams.get("limit") || "12"));
  const sortBy = searchParams.get("sortBy") || "rating"; // rating | experience | newest

  const where: Record<string, unknown> = {
    verificationStatus: "APPROVED",
    isPublic: true,
  };

  if (profession) {
    where.profession = profession.toUpperCase().replace(/-/g, "_");
  }
  if (province) where.province = province;
  if (city) where.city = { contains: city, mode: "insensitive" };

  let orderBy: Record<string, string> = {};
  if (sortBy === "rating") orderBy = { totalRating: "desc" };
  else if (sortBy === "experience") orderBy = { yearsExperience: "desc" };
  else if (sortBy === "newest") orderBy = { createdAt: "desc" };
  else if (sortBy === "projects") orderBy = { completedProjects: "desc" };

  const [professionals, total] = await Promise.all([
    prisma.professionalProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.professionalProfile.count({ where }),
  ]);

  return NextResponse.json({
    professionals,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
  });
}
