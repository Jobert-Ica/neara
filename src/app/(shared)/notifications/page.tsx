import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Bell, CheckCircle, Mail, Briefcase, Info } from "lucide-react";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  // Fetch notifications
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Mark unread as read (in a background-like fire-and-forget manner or directly)
  const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
  if (unreadIds.length > 0) {
    await prisma.notification.updateMany({
      where: { id: { in: unreadIds } },
      data: { isRead: true },
    });
  }

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: "white", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
            Notifications
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
            Stay updated on your projects and account activity.
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 16, padding: "80px 24px", textAlign: "center" }}>
          <Bell size={48} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 20px", display: "block" }} />
          <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>All caught up!</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>You don't have any notifications right now.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                background: notif.isRead ? "rgba(255,255,255,0.02)" : "rgba(37,99,235,0.08)",
                border: `1px solid ${notif.isRead ? "rgba(255,255,255,0.06)" : "rgba(37,99,235,0.2)"}`,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                transition: "all 200ms ease",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: notif.isRead ? "rgba(255,255,255,0.05)" : "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: notif.isRead ? "rgba(255,255,255,0.3)" : "white",
                }}
              >
                {(notif.type as any) === "MESSAGE_RECEIVED" ? <Mail size={18} /> : (notif.type as any) === "PROJECT_UPDATE" ? <Briefcase size={18} /> : <Info size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>{notif.title}</h4>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: "0 0 8px", lineHeight: 1.5 }}>{notif.body}</p>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                  {new Date(notif.createdAt).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
