import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        data: params.data ?? null,
      },
    });
    
    // Supabase will automatically broadcast this to the client listening on the `notifications` table.
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }
}
