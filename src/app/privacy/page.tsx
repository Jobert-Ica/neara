import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060d1f" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "120px 24px 80px", color: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24 }}>Privacy Policy</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>Last updated: {new Date().toLocaleDateString()}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
            <p>This is a placeholder for the official Privacy Policy. We take your privacy seriously and are committed to protecting your personal data.</p>
            <h2 style={{ color: "white", fontSize: 24, marginTop: 16 }}>1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, update your profile, or use our services.</p>
            <h2 style={{ color: "white", fontSize: 24, marginTop: 16 }}>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
