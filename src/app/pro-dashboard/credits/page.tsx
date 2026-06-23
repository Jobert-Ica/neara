import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { CreditCard, Coins, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import CreditsClient from "./CreditsClient";

export const metadata: Metadata = { title: "Credits & Billing" };

export default async function ProCreditsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      creditTransactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!profile) redirect("/professional-onboarding");

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "white", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
          Credits & Billing
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
          Manage your credit balance to accept project requests from clients.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(400px, 100%)", gap: 24 }} className="credits-grid">
        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Current Balance */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.05) 100%)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 16,
              padding: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ color: "rgba(245,158,11,0.7)", fontSize: 13, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Available Balance
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ color: "#FCD34D", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{profile.creditBalance}</span>
                <span style={{ color: "rgba(245,158,11,0.6)", fontSize: 18, fontWeight: 700 }}>credits</span>
              </div>
            </div>
            <div style={{ width: 80, height: 80, background: "rgba(245,158,11,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Coins size={40} style={{ color: "#F59E0B" }} />
            </div>
          </div>

          {/* Packages */}
          <div>
            <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Buy Credits</h2>
            <CreditsClient userEmail={session.user.email} />
          </div>

          {/* Transaction History */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
            <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Recent Transactions</h2>
            
            {profile.creditTransactions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: 0 }}>No transactions yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {profile.creditTransactions.map((tx, idx) => (
                  <div
                    key={tx.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: idx < profile.creditTransactions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <div>
                      <p style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>
                        {tx.description}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>
                        {new Date(tx.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div
                      style={{
                        color: tx.amount > 0 ? "#34D399" : "white",
                        fontSize: 16,
                        fontWeight: 700,
                        background: tx.amount > 0 ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)",
                        padding: "4px 12px",
                        borderRadius: 8,
                      }}
                    >
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, position: "sticky", top: 100 }}>
            <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>How Credits Work</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 32, height: 32, background: "rgba(37,99,235,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#60A5FA", fontWeight: 700 }}>1</span>
                </div>
                <div>
                  <h4 style={{ color: "white", fontSize: 14, margin: "0 0 4px" }}>Receive Requests Free</h4>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    You never pay to receive requests or view project descriptions.
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 32, height: 32, background: "rgba(16,185,129,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#34D399", fontWeight: 700 }}>2</span>
                </div>
                <div>
                  <h4 style={{ color: "white", fontSize: 14, margin: "0 0 4px" }}>Accept to Connect</h4>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    It costs <strong>10 credits</strong> to accept a request. This unlocks the client's details and enables direct messaging.
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 32, height: 32, background: "rgba(245,158,11,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#F59E0B", fontWeight: 700 }}>3</span>
                </div>
                <div>
                  <h4 style={{ color: "white", fontSize: 14, margin: "0 0 4px" }}>No Commission</h4>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    You keep 100% of what you earn on the project. We don't take any commission on the final contract.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
              <ShieldCheck size={14} />
              Secure payments powered by Xendit
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .credits-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
