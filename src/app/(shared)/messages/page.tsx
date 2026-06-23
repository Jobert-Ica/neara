import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import MessagesClient from "./MessagesClient";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>;
}) {
  const { request: requestId } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const role = session.user.role;

  // For professionals, we need their profile ID to match professionalId in conversations
  let professionalId: string | null = null;
  if (role === "PROFESSIONAL") {
    const profile = await prisma.professionalProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (profile) professionalId = profile.id;
  }

  // Handle auto-creating conversation if requestId is provided
  if (requestId) {
    const req = await prisma.projectRequest.findUnique({
      where: { id: requestId },
      include: {
        project: true,
        professional: { include: { user: true } },
      },
    });

    // Ensure user has access and request is ACCEPTED
    if (
      req &&
      req.status === "ACCEPTED" &&
      (req.clientUserId === userId || req.professional.userId === userId)
    ) {
      // Check if conversation exists
      let conv = await prisma.conversation.findUnique({
        where: { requestId },
      });

      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            requestId,
            clientUserId: req.clientUserId,
            professionalId: req.professionalId,
          },
        });
      }
    }
  }

  // Fetch all conversations for this user
  const conversationsRaw = await prisma.conversation.findMany({
    where: role === "PROFESSIONAL" && professionalId
      ? { professionalId }
      : { clientUserId: userId },
    include: {
      request: {
        include: {
          project: { select: { title: true } },
        },
      },
      // Get the other party's info
      professional: {
        include: { user: { select: { name: true, image: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  // Since prisma doesn't have an easy include for client info on Conversation (we only store clientUserId),
  // we need to manually fetch the client users if the current user is a PROFESSIONAL
  let clientUsers: Record<string, { name: string; image: string | null }> = {};
  if (role === "PROFESSIONAL") {
    const clientIds = conversationsRaw.map((c) => c.clientUserId);
    const users = await prisma.user.findMany({
      where: { id: { in: clientIds } },
      select: { id: true, name: true, image: true },
    });
    clientUsers = users.reduce((acc, user) => {
      acc[user.id] = { name: user.name, image: user.image };
      return acc;
    }, {} as Record<string, { name: string; image: string | null }>);
  }

  const conversations = conversationsRaw.map((c) => {
    const otherParty = role === "CLIENT"
      ? {
          name: c.professional.user.name,
          image: c.professional.user.image,
        }
      : {
          name: clientUsers[c.clientUserId]?.name || "Client",
          image: clientUsers[c.clientUserId]?.image || null,
        };

    return {
      id: c.id,
      requestId: c.requestId,
      projectTitle: c.request.project.title,
      otherParty,
      lastMessage: c.messages[0] ? {
        content: c.messages[0].content,
        createdAt: c.messages[0].createdAt,
        isMine: c.messages[0].senderId === userId,
      } : null,
    };
  });

  return (
    <div style={{ height: "calc(100vh - 56px)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h1 style={{ color: "white", fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>
          Messages
        </h1>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MessagesClient conversations={conversations} currentUserId={userId} />
      </div>
    </div>
  );
}
