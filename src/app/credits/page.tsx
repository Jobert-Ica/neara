import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { CreditCard, Target, UserCheck, ShieldCheck, Zap, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Credit System Guide | NEARA",
  description: "Learn how the NEARA credit system works. A fair, pay-per-lead model for construction professionals.",
};

export default function CreditsGuidePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060d1f" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "120px 24px 80px", color: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#60A5FA" }}>
              <CreditCard size={32} />
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, background: "linear-gradient(to right, #ffffff, #9ca3af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px" }}>
              The NEARA Credit System
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", maxWidth: 650, margin: "0 auto" }}>
              We believe in a fair marketplace. No expensive monthly subscriptions or hidden fees. Our Pay-Per-Lead model means you only spend money when you find a project you actually want to bid on.
            </p>
          </div>

          {/* How It Works */}
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, marginBottom: 80 }}>
            {[
              { title: "1. Top Up Your Account", desc: "Purchase credits easily using GCash, Maya, or your credit/debit card. Credits are added instantly.", icon: <Zap size={24} /> },
              { title: "2. Browse Live Requests", desc: "View detailed project requests from clients all over the Philippines, completely for free.", icon: <Target size={24} /> },
              { title: "3. Unlock Contact Details", desc: "Spend exactly 10 credits to 'Accept' a request. This immediately unlocks the client's direct contact information.", icon: <UserCheck size={24} /> }
            ].map((step, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, right: -10, fontSize: 120, fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 1 }}>{i + 1}</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "#60A5FA" }}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, position: "relative", zIndex: 1 }}>{step.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: 0, position: "relative", zIndex: 1 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Pricing Box */}
          <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(16,185,129,0.05))", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 24, padding: "48px 32px", textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Simple, Transparent Pricing</h2>
            <div style={{ display: "inline-block", background: "rgba(0,0,0,0.3)", padding: "16px 32px", borderRadius: 100, marginBottom: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#10B981" }}>10 Credits</span>
              <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", margin: "0 12px" }}>=</span>
              <span style={{ fontSize: 24, fontWeight: 800 }}>1 Project Lead</span>
            </div>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto" }}>
              Credits cost approximately <strong>₱50.00 each</strong> depending on the bundle you buy. That means a highly-qualified, direct client lead costs you around ₱500.00. No hidden commissions or cuts from your final project fee.
            </p>
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <HelpCircle size={28} color="#60A5FA" /> Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "Do credits expire?", a: "No, your purchased credits will never expire. You can keep them in your account until you find the perfect project." },
              { q: "Do you take a commission from the project?", a: "Absolutely not. NEARA only charges you the initial credits to unlock the lead. What you charge the client and how you get paid is 100% between you and them." },
              { q: "What if the client doesn't hire me?", a: "Paying credits unlocks the lead, but it does not guarantee you will get the job. It is up to you to communicate well, provide a competitive quote, and win the client's trust." },
              { q: "Can I get a refund for a bad lead?", a: "If a lead is proven to be a scam or fraudulent, our support team can investigate and issue a credit refund to your account." }
            ].map((faq, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#fff" }}>{faq.q}</h4>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
