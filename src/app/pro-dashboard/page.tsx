import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { Inbox, Star, CheckCircle, Clock, CreditCard, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";

export const metadata: Metadata = { title: "Pro Dashboard" };

export default async function ProDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      receivedRequests: {
        where: { status: "PENDING" },
        include: {
          project: { select: { title: true, description: true, budgetMin: true, budgetMax: true, city: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      creditTransactions: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!profile) redirect("/professional-onboarding");

  const firstName = session.user.name.split(" ")[0];
  const isVerified = profile.verificationStatus === "APPROVED";
  const avgRating = profile.reviewCount > 0 ? profile.totalRating / profile.reviewCount : 0;

  return (
    <div style={{ padding: "32px 32px 80px" }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "white", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
          Welcome back, {firstName} 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
          {isVerified ? "You're verified and receiving project requests." : "Your profile is under review."}
        </p>
      </div>

      {/* Verification banner if not yet verified */}
      {!isVerified && (
        <div
          style={{
            background: profile.verificationStatus === "PENDING" ? "rgba(245,158,11,0.08)" : "rgba(244,63,94,0.08)",
            border: `1px solid ${profile.verificationStatus === "PENDING" ? "rgba(245,158,11,0.2)" : "rgba(244,63,94,0.2)"}`,
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <AlertCircle size={18} style={{ color: profile.verificationStatus === "PENDING" ? "#F59E0B" : "#F87171", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ color: "white", fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>
              {profile.verificationStatus === "PENDING" ? "Verification in Progress" : "Profile Rejected"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              {profile.verificationStatus === "PENDING"
                ? "Our team is reviewing your PRC license. This takes 1–3 business days. You can still set up your profile."
                : `Your profile was rejected. Reason: ${profile.rejectionReason || "Please contact support."}`}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Credit Balance", value: profile.creditBalance, icon: <CreditCard size={18} />, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", href: "/pro-dashboard/credits" },
          { label: "Pending Requests", value: profile.receivedRequests.length, icon: <Inbox size={18} />, color: "#60A5FA", bg: "rgba(37,99,235,0.1)", href: "/pro-dashboard/requests" },
          { label: "Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", icon: <Star size={18} />, color: "#F59E0B", bg: "rgba(245,158,11,0.08)", href: null },
          { label: "Projects Done", value: profile.completedProjects, icon: <CheckCircle size={18} />, color: "#10B981", bg: "rgba(16,185,129,0.1)", href: null },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding: 18,
              cursor: stat.href ? "pointer" : "default",
            }}
            onClick={() => stat.href && (window.location.href = stat.href)}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, marginBottom: 10 }}>
              {stat.icon}
            </div>
            <div style={{ color: "white", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Low credit warning */}
      {profile.creditBalance < 5 && (
        <div
          style={{
            background: "rgba(244,63,94,0.08)",
            border: "1px solid rgba(244,63,94,0.2)",
            borderRadius: 14,
            padding: "14px 18px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <AlertCircle size={16} style={{ color: "#F87171" }} />
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>
              You have <strong style={{ color: "#F87171" }}>{profile.creditBalance} credits</strong> remaining. Buy more to accept project requests.
            </p>
          </div>
          <Link href="/pro-dashboard/credits" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary btn-sm" style={{ whiteSpace: "nowrap" }}>
              Buy Credits
            </button>
          </Link>
        </div>
      )}

      {/* Pending requests */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: 0 }}>
            Pending Requests
            {profile.receivedRequests.length > 0 && (
              <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 10, background: "rgba(37,99,235,0.15)", color: "#60A5FA", fontSize: 12 }}>
                {profile.receivedRequests.length}
              </span>
            )}
          </h2>
          <Link href="/pro-dashboard/requests" style={{ color: "#60A5FA", textDecoration: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {profile.receivedRequests.length === 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <Inbox size={36} style={{ color: "rgba(255,255,255,0.12)", margin: "0 auto 16px", display: "block" }} />
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: 0 }}>
              No pending requests right now. Make sure your profile is visible.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {profile.receivedRequests.map((req) => (
              <Link key={req.id} href={`/pro-dashboard/requests/${req.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14,
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                  className="request-row"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                      <h3 style={{ color: "white", fontSize: 14, fontWeight: 700, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {req.project.title}
                      </h3>
                      <p className="line-clamp-2" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 8px", lineHeight: 1.5 }}>
                        {req.project.description}
                      </p>
                      <div style={{ display: "flex", gap: 12 }}>
                        {req.project.city && (
                          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>📍 {req.project.city}</span>
                        )}
                        {(req.project.budgetMin || req.project.budgetMax) && (
                          <span style={{ color: "#34D399", fontSize: 12, fontWeight: 600 }}>
                            ₱{req.project.budgetMin?.toLocaleString()} – ₱{req.project.budgetMax?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <Clock size={11} style={{ color: "#F59E0B" }} />
                        <span style={{ color: "#FCD34D", fontSize: 11, fontWeight: 700 }}>PENDING</span>
                      </div>
                      <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Profile completeness nudge */}
      {!profile.isPublic && (
        <div style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 14, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <TrendingUp size={16} style={{ color: "#60A5FA" }} />
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0 }}>
              Make your profile public so clients can find you.
            </p>
          </div>
          <Link href="/pro-dashboard/profile" style={{ textDecoration: "none" }}>
            <button className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap" }}>
              Edit Profile
            </button>
          </Link>
        </div>
      )}

      <style>{`
        .request-row:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(37,99,235,0.3) !important;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
}
