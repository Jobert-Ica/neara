import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import type { NotificationType } from "@prisma/client";

interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export async function createNotification(
  options: CreateNotificationOptions
): Promise<void> {
  const notification = await prisma.notification.create({
    data: {
      userId: options.userId,
      type: options.type,
      title: options.title,
      body: options.body,
      data: (options.data ?? {}) as any,
    },
  });

  // Broadcast to Supabase Realtime channel for the user
  await supabaseAdmin
    .channel(`notifications:${options.userId}`)
    .send({
      type: "broadcast",
      event: "new_notification",
      payload: notification,
    });
}

export async function markNotificationRead(
  notificationId: string,
  userId: string
): Promise<void> {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}
