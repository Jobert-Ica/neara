import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, MapPin, DollarSign, Calendar, XCircle, FileText, UserCircle, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import RequestActionsClient from "./RequestActionsClient";

export const metadata: Metadata = { title: "Request Details" };

const REQUEST_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "#FCD34D", bg: "rgba(245,158,11,0.12)" },
  ACCEPTED: { label: "Accepted", color: "#34D399", bg: "rgba(16,185,129,0.12)" },
  DECLINED: { label: "Declined", color: "#F87171", bg: "rgba(244,63,94,0.12)" },
  EXPIRED: { label: "Expired", color: "#94A3B8", bg: "rgba(100,116,139,0.12)" },
};

export default async function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, creditBalance: true, verificationStatus: true },
  });

  if (!profile) redirect("/professional-onboarding");

  const request = await prisma.projectRequest.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          client: {
            include: {
              user: { select: { name: true, image: true, email: true } },
            },
          },
        },
      },
    },
  });

  if (!request || request.professionalId !== profile.id) {
    notFound();
  }

  const statusConfig = REQUEST_STATUS[request.status] || REQUEST_STATUS.PENDING;
  const project = request.project;
  const client = project.client;

  // The professional can only see the client's full details (like email) if the request is ACCEPTED
  const showClientDetails = request.status === "ACCEPTED";
  // For pending requests, we anonymize the client name somewhat or just show their first name
  const clientName = showClientDetails ? client.user.name : client.user.name.split(" ")[0] + " (Client)";

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <Link
        href="/pro-dashboard/requests"
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
        Back to Requests
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
              {request.status === "PENDING" && <Clock size={14} />}
              {request.status === "ACCEPTED" && <CheckCircle size={14} />}
              {request.status === "DECLINED" && <XCircle size={14} />}
              {statusConfig.label}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              Requested on {new Date(request.createdAt).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(360px, 100%)", gap: 24 }} className="request-detail-grid">
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
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
              Project Description
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
              {project.description}
            </p>
          </div>

          {request.message && (
            <div
              style={{
                background: "rgba(37,99,235,0.05)",
                border: "1px solid rgba(37,99,235,0.15)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
              }}
            >
              <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare size={18} style={{ color: "#60A5FA" }} />
                Message to Client
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                "{request.message}"
              </p>
            </div>
          )}

          {request.status === "PENDING" && (
            <RequestActionsClient 
              requestId={request.id} 
              creditBalance={profile.creditBalance} 
              isVerified={profile.verificationStatus === "APPROVED"}
            />
          )}

          {request.status === "ACCEPTED" && (
            <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 24, textAlign: "center" }}>
              <CheckCircle size={32} style={{ color: "#34D399", margin: "0 auto 12px", display: "block" }} />
              <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>You accepted this request</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: "0 0 20px" }}>
                You can now message the client directly to discuss the project details.
              </p>
              <Link href={`/messages?request=${request.id}`} style={{ textDecoration: "none" }}>
                <button className="btn btn-primary" style={{ background: "#10B981", border: "none" }}>
                  <MessageSquare size={16} /> Send Message to Client
                </button>
              </Link>
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
            <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>About the Client</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              {showClientDetails && client.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={client.user.image}
                  alt={clientName}
                  style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  <UserCircle size={24} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              )}
              <div>
                <div style={{ color: "white", fontSize: 16, fontWeight: 700 }}>{clientName}</div>
                {showClientDetails && (
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{client.user.email}</div>
                )}
                {!showClientDetails && (
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 2 }}>Accept request to view details</div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Projects Posted</span>
                <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{(client as any).completedProjects || 1}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Client Since</span>
                <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                  {new Date(client.createdAt).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .request-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
