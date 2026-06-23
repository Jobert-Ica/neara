import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { Plus, FolderOpen, ArrowRight, Clock, CheckCircle, FileText, Eye, Handshake } from "lucide-react";

export const metadata: Metadata = { title: "My Projects" };

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  DRAFT: { label: "Draft", color: "#94A3B8", bg: "rgba(100,116,139,0.12)", icon: <FileText size={12} /> },
  OPEN: { label: "Open", color: "#60A5FA", bg: "rgba(37,99,235,0.12)", icon: <Eye size={12} /> },
  IN_REVIEW: { label: "In Review", color: "#FCD34D", bg: "rgba(245,158,11,0.12)", icon: <Clock size={12} /> },
  MATCHED: { label: "Matched", color: "#34D399", bg: "rgba(16,185,129,0.12)", icon: <Handshake size={12} /> },
  CLOSED: { label: "Completed", color: "#64748B", bg: "rgba(100,116,139,0.08)", icon: <CheckCircle size={12} /> },
};

export default async function ProjectsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const projects = await prisma.project.findMany({
    where: { client: { userId: session.user.id } },
    include: {
      requests: {
        select: { id: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "32px 32px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ color: "white", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
            My Projects
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/dashboard/projects/new" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary">
            <Plus size={16} />
            Post a Project
          </button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <FolderOpen size={48} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 20px", display: "block" }} />
          <h3 style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>
            No projects yet
          </h3>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: "0 0 24px", maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
            Post your first project and start receiving quotes from verified professionals.
          </p>
          <Link href="/dashboard/projects/new" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary btn-lg">
              <Plus size={18} />
              Post Your First Project
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {projects.map((project) => {
            const requestCount = project.requests.length;
            const pendingCount = project.requests.filter((r) => r.status === "PENDING").length;
            const acceptedCount = project.requests.filter((r) => r.status === "ACCEPTED").length;
            const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.DRAFT;

            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    height: "100%",
                  }}
                  className="project-card"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: statusConfig.bg,
                        color: statusConfig.color,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                    <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                  </div>

                  <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 }}>
                    {project.title}
                  </h3>
                  <p
                    className="line-clamp-2"
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}
                  >
                    {project.description}
                  </p>

                  <div
                    style={{
                      paddingTop: 12,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      gap: 16,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "white", fontSize: 18, fontWeight: 800 }}>{requestCount}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Requests</div>
                    </div>
                    {pendingCount > 0 && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#FCD34D", fontSize: 18, fontWeight: 800 }}>{pendingCount}</div>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Pending</div>
                      </div>
                    )}
                    {acceptedCount > 0 && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#34D399", fontSize: 18, fontWeight: 800 }}>{acceptedCount}</div>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Accepted</div>
                      </div>
                    )}
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                        {new Date(project.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        .project-card:hover {
          border-color: rgba(37,99,235,0.3) !important;
          box-shadow: 0 8px 32px rgba(37,99,235,0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
