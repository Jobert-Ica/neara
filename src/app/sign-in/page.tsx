"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const type = searchParams.get("type");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      setError("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.2) 0%, transparent 60%), #060d1f",
      }}
    >
      {/* Left side — branding */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
        className="sign-in-left"
      >
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 60 }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontWeight: 900, fontSize: 18 }}>N</span>
            </div>
            <span style={{ color: "white", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px" }}>NEARA</span>
          </Link>

          <h1
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Your next great project starts here
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, lineHeight: 1.7, maxWidth: 380, marginBottom: 48 }}>
            Connect with verified professionals or find your next client opportunity.
          </p>

          {/* Trust points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "PRC-verified professionals only",
              "Secure messaging & file sharing",
              "Pay only when you get results",
            ].map((point, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#34D399", fontSize: 13, fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{point}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side — sign in */}
      <div
        style={{
          width: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
        className="sign-in-right"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ width: "100%", maxWidth: 360 }}
        >
          {/* Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 40,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(37,99,235,0.1)",
                  border: "1px solid rgba(37,99,235,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Shield size={24} style={{ color: "#60A5FA" }} />
              </div>
              <h2 style={{ color: "white", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px", margin: "0 0 8px" }}>
                {type === "professional" ? "Join as Professional" : "Welcome back"}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
                Sign in with your Google account to continue
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  color: "#F87171",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <button
              id="google-sign-in-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "14px 20px",
                borderRadius: 12,
                background: "white",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 15,
                fontWeight: 700,
                color: "#1e293b",
                transition: "all 150ms ease",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>

            <div style={{ marginTop: 24, padding: "16px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                By continuing, you agree to our{" "}
                <Link href="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Privacy Policy</Link>
              </p>
            </div>
          </div>

          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 20 }}>
            New to NEARA?{" "}
            <Link href="/browse" style={{ color: "#60A5FA", textDecoration: "none", fontWeight: 600 }}>
              Browse professionals →
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .sign-in-left { display: none !important; }
          .sign-in-right { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
