import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { Inbox, ArrowRight, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";

export const metadata: Metadata = { title: "Project Requests" };

const STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "#FCD34D", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)", icon: <Clock size={12} /> },
  ACCEPTED: { label: "Accepted", color: "#34D399", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.2)", icon: <CheckCircle size={12} /> },
  DECLINED: { label: "Declined", color: "#94A3B8", bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.2)", icon: <XCircle size={12} /> },
  EXPIRED: { label: "Expired", color: "#64748B", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.15)", icon: <Clock size={12} /> },
};

export default async function ProRequestsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profile) redirect("/professional-onboarding");

  const requests = await prisma.projectRequest.findMany({
    where: { professionalId: profile.id },
    include: {
      project: {
        select: {
          title: true,
          description: true,
          budgetMin: true,
          budgetMax: true,
          city: true,
          province: true,
          timeline: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div style={{ padding: "32px 32px 80px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "white", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
          Project Requests
          {pendingCount > 0 && (
            <span style={{ marginLeft: 10, padding: "3px 10px", borderRadius: 10, background: "rgba(37,99,235,0.15)", color: "#60A5FA", fontSize: 14, fontWeight: 700 }}>
              {pendingCount} new
            </span>
          )}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
          {requests.length} total request{requests.length !== 1 ? "s" : ""}
        </p>
      </div>

      {requests.length === 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <Inbox size={48} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 20px", display: "block" }} />
          <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>No requests yet</h3>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, margin: 0 }}>
            Project requests from clients will appear here once your profile is approved and visible.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map((req) => {
            const statusConfig = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
            return (
              <Link key={req.id} href={`/pro-dashboard/requests/${req.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                  className="req-card"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: statusConfig.bg,
                            border: `1px solid ${statusConfig.border}`,
                            color: statusConfig.color,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
                          {new Date(req.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>
                        {req.project.title}
                      </h3>
                      <p className="line-clamp-2" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.5 }}>
                        {req.project.description}
                      </p>

                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {req.project.city && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                            <MapPin size={11} />
                            {req.project.city}
                          </span>
                        )}
                        {(req.project.budgetMin || req.project.budgetMax) && (
                          <span style={{ color: "#34D399", fontSize: 12, fontWeight: 600 }}>
                            ₱{req.project.budgetMin?.toLocaleString()} – ₱{req.project.budgetMax?.toLocaleString()}
                          </span>
                        )}
                        {req.project.timeline && (
                          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                            🕐 {req.project.timeline}
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowRight size={16} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 4 }} />
                  </div>

                  {req.creditsDeducted > 0 && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
                        🪙 {req.creditsDeducted} credits used to unlock this request
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        .req-card:hover {
          border-color: rgba(37,99,235,0.3) !important;
          background: rgba(255,255,255,0.05) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
