import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, FileText, Eye, Handshake, MapPin, DollarSign, Calendar, Star, MessageSquare, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Project Details" };

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  DRAFT: { label: "Draft", color: "#94A3B8", bg: "rgba(100,116,139,0.12)", icon: <FileText size={14} /> },
  OPEN: { label: "Open", color: "#60A5FA", bg: "rgba(37,99,235,0.12)", icon: <Eye size={14} /> },
  IN_REVIEW: { label: "In Review", color: "#FCD34D", bg: "rgba(245,158,11,0.12)", icon: <Clock size={14} /> },
  MATCHED: { label: "Matched", color: "#34D399", bg: "rgba(16,185,129,0.12)", icon: <Handshake size={14} /> },
  CLOSED: { label: "Completed", color: "#64748B", bg: "rgba(100,116,139,0.08)", icon: <CheckCircle size={14} /> },
};

const REQUEST_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "#FCD34D", bg: "rgba(245,158,11,0.12)" },
  ACCEPTED: { label: "Accepted", color: "#34D399", bg: "rgba(16,185,129,0.12)" },
  DECLINED: { label: "Declined", color: "#F87171", bg: "rgba(244,63,94,0.12)" },
  EXPIRED: { label: "Expired", color: "#94A3B8", bg: "rgba(100,116,139,0.12)" },
};

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { userId: true } },
      requests: {
        include: {
          professional: {
            include: {
              user: { select: { name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project || project.client.userId !== session.user.id) {
    notFound();
  }

  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.DRAFT;

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <Link
        href="/dashboard/projects"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "rgba(255,255,255,0.4)",
          textDecoration: "none",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 20,
                background: statusConfig.bg,
                color: statusConfig.color,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              Posted on {new Date(project.createdAt).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 style={{ color: "white", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 16px", lineHeight: 1.2 }}>
            {project.title}
          </h1>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {project.city && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                <MapPin size={16} style={{ color: "#60A5FA" }} />
                {project.city}{project.province ? `, ${project.province}` : ""}
              </div>
            )}
            {(project.budgetMin || project.budgetMax) && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                <DollarSign size={16} style={{ color: "#34D399" }} />
                ₱{project.budgetMin?.toLocaleString()} – ₱{project.budgetMax?.toLocaleString()}
              </div>
            )}
            {project.timeline && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                <Calendar size={16} style={{ color: "#F59E0B" }} />
                {project.timeline}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(360px, 100%)", gap: 24 }} className="project-detail-grid">
        {/* Main Content */}
        <div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Description</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
              {project.description}
            </p>
          </div>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            Professional Requests
            <span style={{ padding: "2px 8px", background: "rgba(37,99,235,0.1)", color: "#60A5FA", borderRadius: 10, fontSize: 13 }}>
              {project.requests.length}
            </span>
          </h2>

          {project.requests.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <FileText size={36} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 16px", display: "block" }} />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
                No professionals have sent a request for this project yet.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {project.requests.map((request) => {
                const reqStatus = REQUEST_STATUS[request.status] || REQUEST_STATUS.PENDING;
                const professional = request.professional;
                const avgRating = professional.reviewCount > 0 ? professional.totalRating / professional.reviewCount : 0;
                
                return (
                  <div
                    key={request.id}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 16,
                      padding: 20,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {professional.user.image || professional.profilePhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={professional.profilePhoto || professional.user.image!}
                            alt={professional.user.name}
                            style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }}
                          />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                            👤
                          </div>
                        )}
                        <div>
                          <Link href={`/professionals/${professional.id}`} style={{ textDecoration: "none" }}>
                            <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
                              {professional.user.name}
                            </h3>
                          </Link>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#60A5FA", fontSize: 13, fontWeight: 500 }}>
                              {professional.profession.replace(/_/g, " ")}
                            </span>
                            {professional.reviewCount > 0 && (
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <Star size={12} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                                <span style={{ color: "#FCD34D", fontSize: 12, fontWeight: 600 }}>{avgRating.toFixed(1)}</span>
                                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>({professional.reviewCount})</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          background: reqStatus.bg,
                          color: reqStatus.color,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {reqStatus.label}
                      </span>
                    </div>

                    {request.message && (
                      <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, fontStyle: "italic", lineHeight: 1.6 }}>
                          "{request.message}"
                        </p>
                      </div>
                    )}

                    {request.status === "PENDING" && (
                      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <button style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(244,63,94,0.1)", color: "#F87171", border: "1px solid rgba(244,63,94,0.2)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          Decline
                        </button>
                        <button style={{ padding: "8px 16px", borderRadius: 8, background: "#10B981", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                          <CheckCircle size={14} /> Accept Request
                        </button>
                      </div>
                    )}
                    
                    {request.status === "ACCEPTED" && (
                      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <Link href={`/messages?request=${request.id}`} style={{ textDecoration: "none" }}>
                          <button style={{ padding: "8px 16px", borderRadius: 8, background: "#2563EB", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <MessageSquare size={14} /> Send Message
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: 24,
              position: "sticky",
              top: 100,
            }}
          >
            <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Project Summary</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Status</span>
                <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{statusConfig.label}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Requests</span>
                <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{project.requests.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Posted</span>
                <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                  {new Date(project.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            {project.status === "OPEN" && (
              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 20,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Edit Project
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .project-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
