"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface RequestActionsClientProps {
  requestId: string;
  creditBalance: number;
  isVerified: boolean;
}

export default function RequestActionsClient({ requestId, creditBalance, isVerified }: RequestActionsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [optimisticState, setOptimisticState] = useState<"accepted" | "declined" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const CREDITS_TO_ACCEPT = 10;
  const hasEnoughCredits = creditBalance >= CREDITS_TO_ACCEPT;

  const handleAction = async (action: "accept" | "decline") => {
    if (action === "accept" && (!isVerified || !hasEnoughCredits)) return;
    
    setLoading(action);
    setError(null);
    setOptimisticState(action === "accept" ? "accepted" : "declined");

    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action} request`);
      }

      router.refresh();
    } catch (err) {
      setOptimisticState(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  if (optimisticState === "accepted") {
    return (
      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 24, textAlign: "center" }}>
        <CheckCircle size={32} style={{ color: "#10B981", margin: "0 auto 12px", display: "block" }} />
        <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Request Accepted!</h3>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>Unlocking client details...</p>
      </div>
    );
  }

  if (optimisticState === "declined") {
    return (
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 24, textAlign: "center" }}>
        <XCircle size={32} style={{ color: "rgba(255,255,255,0.2)", margin: "0 auto 12px", display: "block" }} />
        <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Request Declined</h3>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>You have declined this project.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
      <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Take Action</h2>
      
      {!isVerified && (
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
          <AlertCircle size={16} style={{ color: "#F59E0B", flexShrink: 0 }} />
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>
            You cannot accept requests until your PRC verification is approved.
          </p>
        </div>
      )}

      {isVerified && !hasEnoughCredits && (
        <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
          <AlertCircle size={16} style={{ color: "#F87171", flexShrink: 0 }} />
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>
            You need <strong style={{ color: "white" }}>{CREDITS_TO_ACCEPT} credits</strong> to accept this request. You currently have {creditBalance}.
          </p>
          <Link href="/pro-dashboard/credits" style={{ marginLeft: "auto", textDecoration: "none" }}>
            <button className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap" }}>Buy Credits</button>
          </Link>
        </div>
      )}

      {isVerified && hasEnoughCredits && (
        <div style={{ background: "rgba(37,99,235,0.08)", border: "1px dashed rgba(37,99,235,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
          <p style={{ color: "#93C5FD", fontSize: 13, margin: 0, textAlign: "center" }}>
            Accepting this request will deduct <strong>{CREDITS_TO_ACCEPT} credits</strong> from your balance.
          </p>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        {!showConfirm ? (
          <>
            <button
              onClick={() => handleAction("decline")}
              disabled={loading !== null}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget).style.background = "rgba(244,63,94,0.1)";
                  (e.currentTarget).style.borderColor = "rgba(244,63,94,0.3)";
                  (e.currentTarget).style.color = "#F87171";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  (e.currentTarget).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget).style.color = "rgba(255,255,255,0.8)";
                }
              }}
            >
              {loading === "decline" ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <XCircle size={16} />}
              Decline
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading !== null || !isVerified || !hasEnoughCredits}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: 12,
                background: isVerified && hasEnoughCredits ? "#10B981" : "rgba(255,255,255,0.1)",
                color: isVerified && hasEnoughCredits ? "white" : "rgba(255,255,255,0.3)",
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: (loading !== null || !isVerified || !hasEnoughCredits) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 150ms ease",
              }}
            >
              <CheckCircle size={18} />
              Accept Request
            </button>
          </>
        ) : (
          <div style={{ width: "100%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 16 }}>
            <p style={{ color: "white", fontSize: 14, margin: "0 0 16px", textAlign: "center", fontWeight: 600 }}>
              Are you sure? This will deduct {CREDITS_TO_ACCEPT} credits.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "white", border: "none", cursor: "pointer", fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction("accept")}
                disabled={loading !== null}
                style={{
                  flex: 1, padding: "10px", borderRadius: 8, background: "#10B981", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, display: "flex", justifyContent: "center", gap: 8
                }}
              >
                {loading === "accept" ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle size={16} />}
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
