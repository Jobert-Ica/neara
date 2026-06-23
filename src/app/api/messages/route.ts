import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const messageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate Limiting: max 20 messages per minute
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { success, remaining, reset } = rateLimit(ip, "send_message", { limit: 20, windowMs: 60000 });
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." }, 
      { status: 429, headers: { "X-RateLimit-Remaining": remaining.toString(), "X-RateLimit-Reset": reset.toString() } }
    );
  }

  const userId = session.user.id;
  const body = await request.json();
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { conversationId, content } = parsed.data;

  // Validate conversation access
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { professional: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (conversation.clientUserId !== userId && conversation.professional.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },
    });

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Determine receiver for notification
    const receiverId = conversation.clientUserId === userId ? conversation.professional.userId : conversation.clientUserId;

    // Create notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "NEW_MESSAGE",
        title: `New message from ${session.user.name}`,
        body: content.length > 50 ? content.slice(0, 50) + "..." : content,
        data: { conversationId },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
  }

  // Validate access
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { professional: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (conversation.clientUserId !== session.user.id && conversation.professional.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}
