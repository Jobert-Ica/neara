"use client";

import { useState } from "react";
import { Loader2, Zap, CheckCircle } from "lucide-react";

const PACKAGES = [
  { id: "basic", name: "Basic Pack", credits: 50, price: 1000, description: "Perfect for getting started" },
  { id: "pro", name: "Pro Pack", credits: 150, price: 2700, description: "Save 10%", popular: true },
  { id: "elite", name: "Elite Pack", credits: 300, price: 4800, description: "Save 20%" },
];

export default function CreditsClient({ userEmail }: { userEmail: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);

  const handleConfirmBuy = async () => {
    if (!selectedPackage) return;
    setLoading(selectedPackage.id);
    const pkg = selectedPackage;
    try {
      // Create invoice via our internal API
      const res = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await res.json();
      
      // Redirect to Xendit payment URL
      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        throw new Error("No invoice URL returned");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while initiating payment.");
      setLoading(null);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
      {PACKAGES.map((pkg) => (
        <div
          key={pkg.id}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${pkg.popular ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 16,
            padding: 24,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {pkg.popular && (
            <div style={{ position: "absolute", top: 0, right: 0, background: "#2563EB", color: "white", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderBottomLeftRadius: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Most Popular
            </div>
          )}
          
          <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{pkg.name}</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 16px" }}>{pkg.description}</p>
          
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
            <span style={{ color: "white", fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{pkg.credits}</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}>credits</span>
          </div>

          <div style={{ marginTop: "auto" }}>
            <button
              onClick={() => setSelectedPackage(pkg)}
              disabled={loading !== null}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                background: pkg.popular ? "#2563EB" : "rgba(255,255,255,0.05)",
                color: pkg.popular ? "white" : "white",
                border: pkg.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                if (!loading && !pkg.popular) {
                  (e.currentTarget).style.background = "rgba(255,255,255,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !pkg.popular) {
                  (e.currentTarget).style.background = "rgba(255,255,255,0.05)";
                }
              }}
            >
              {loading === pkg.id ? (
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Zap size={16} />
              )}
              {loading === pkg.id ? "Processing..." : `Buy for ₱${pkg.price.toLocaleString()}`}
            </button>
          </div>
        </div>
      ))}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
