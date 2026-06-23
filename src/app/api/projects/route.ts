import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  budgetMin: z.number().positive().optional().nullable(),
  budgetMax: z.number().positive().optional().nullable(),
  province: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  professionNeeded: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Must be a client
  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!clientProfile) {
    return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { title, description, budgetMin, budgetMax, province, city, timeline } = parsed.data;

  try {
    const project = await prisma.project.create({
      data: {
        clientId: clientProfile.id,
        title,
        description,
        budgetMin: budgetMin ?? null,
        budgetMax: budgetMax ?? null,
        province: province ?? null,
        city: city ?? null,
        timeline: timeline ?? null,
        status: "OPEN",
      },
    });

    return NextResponse.json({ id: project.id, success: true }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!clientProfile) {
    return NextResponse.json({ projects: [] });
  }

  const where: Record<string, unknown> = { clientId: clientProfile.id };
  if (status) where.status = status;

  const projects = await prisma.project.findMany({
    where,
    include: {
      requests: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}
