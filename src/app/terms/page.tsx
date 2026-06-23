import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060d1f" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "120px 24px 80px", color: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24 }}>Terms of Service</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>Last updated: {new Date().toLocaleDateString()}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            <p>This is a placeholder for the official Terms of Service. By using NEARA, you agree to these terms.</p>
            <h2 style={{ color: "white", fontSize: 24, marginTop: 16 }}>1. Acceptance of Terms</h2>
            <p>By accessing and using our platform, you accept and agree to be bound by the terms and provisions of this agreement.</p>
            <h2 style={{ color: "white", fontSize: 24, marginTop: 16 }}>2. Professional Verification</h2>
            <p>All professionals must undergo and pass our verification process. Falsifying information may result in a permanent ban.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
