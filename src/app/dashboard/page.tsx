import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { Search, Plus, FolderOpen, Clock, CheckCircle, BarChart2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function ClientDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const [projects, notifications, clientProfile] = await Promise.all([
    prisma.project.findMany({
      where: { client: { userId: session.user.id } },
      include: { requests: { select: { id: true, status: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.notification.findMany({
      where: { userId: session.user.id, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
      select: { _count: { select: { projects: true } } },
    }),
  ]);

  const firstName = session.user.name.split(" ")[0];
  const totalProjects = clientProfile?._count.projects ?? 0;
  const activeProjects = projects.filter((p) => ["OPEN", "IN_REVIEW", "MATCHED"].includes(p.status)).length;
  const completedProjects = projects.filter((p) => p.status === "CLOSED").length;
  const unreadNotifications = notifications.length;

  const STATUS_LABEL: Record<string, string> = {
    DRAFT: "Draft",
    OPEN: "Open",
    IN_REVIEW: "In Review",
    MATCHED: "Matched",
    CLOSED: "Completed",
  };

  const STATUS_COLOR: Record<string, string> = {
    DRAFT: "rgba(100,116,139,0.2)",
    OPEN: "rgba(37,99,235,0.15)",
    IN_REVIEW: "rgba(245,158,11,0.15)",
    MATCHED: "rgba(16,185,129,0.15)",
    CLOSED: "rgba(100,116,139,0.1)",
  };

  const STATUS_TEXT: Record<string, string> = {
    DRAFT: "#94A3B8",
    OPEN: "#60A5FA",
    IN_REVIEW: "#FCD34D",
    MATCHED: "#34D399",
    CLOSED: "#64748B",
  };

  return (
    <div style={{ padding: "32px 32px 80px" }}>
      {/* Welcome header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: "white", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
          Welcome back, {firstName} 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
          Here&apos;s an overview of your projects and activity.
        </p>
      </div>

      {/* Stats cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          { label: "Total Projects", value: totalProjects, icon: <FolderOpen size={20} />, color: "#2563EB", bg: "rgba(37,99,235,0.1)" },
          { label: "Active", value: activeProjects, icon: <Clock size={20} />, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
          { label: "Completed", value: completedProjects, icon: <CheckCircle size={20} />, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
          { label: "Unread", value: unreadNotifications, icon: <BarChart2 size={20} />, color: "#F43F5E", bg: "rgba(244,63,94,0.1)" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "20px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: stat.color,
                marginBottom: 12,
              }}
            >
              {stat.icon}
            </div>
            <div style={{ color: "white", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/dashboard/projects/new" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 12,
                background: "#2563EB",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              <Plus size={16} />
              Post a Project
            </div>
          </Link>
          <Link href="/browse" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Search size={16} />
              Browse Professionals
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: 0 }}>Recent Projects</h2>
          <Link
            href="/dashboard/projects"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#60A5FA",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <FolderOpen size={36} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 16px", display: "block" }} />
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, margin: "0 0 16px" }}>
              No projects yet. Post your first project to find professionals.
            </p>
            <Link href="/dashboard/projects/new">
              <button className="btn btn-primary">
                <Plus size={16} /> Post a Project
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projects.map((project) => {
              const requestCount = project.requests.length;
              const pendingCount = project.requests.filter((r) => r.status === "PENDING").length;
              return (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 14,
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                    className="project-row"
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ color: "white", fontSize: 14, fontWeight: 700, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {project.title}
                      </h3>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>
                        {requestCount} request{requestCount !== 1 ? "s" : ""}
                        {pendingCount > 0 && (
                          <span style={{ color: "#FCD34D", marginLeft: 8 }}>· {pendingCount} pending</span>
                        )}
                        <span style={{ marginLeft: 8 }}>
                          · {new Date(project.updatedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                        </span>
                      </p>
                    </div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        background: STATUS_COLOR[project.status] || "rgba(100,116,139,0.1)",
                        color: STATUS_TEXT[project.status] || "#94A3B8",
                        flexShrink: 0,
                      }}
                    >
                      {STATUS_LABEL[project.status] || project.status}
                    </span>
                    <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: 0 }}>
              Notifications
              <span
                style={{
                  marginLeft: 8,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: "rgba(244,63,94,0.15)",
                  color: "#F87171",
                  fontSize: 12,
                }}
              >
                {unreadNotifications} new
              </span>
            </h2>
            <Link href="/notifications" style={{ color: "#60A5FA", textDecoration: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#2563EB",
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <div>
                  <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: "0 0 3px" }}>{notif.title}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>{notif.body}</p>
                </div>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, flexShrink: 0, marginLeft: "auto" }}>
                  {new Date(notif.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .project-row:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(37,99,235,0.3) !important;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
}
