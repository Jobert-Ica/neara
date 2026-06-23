import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { ShieldCheck, FileCheck, Award, Clock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Professional Verification Guide | NEARA",
  description: "Learn about NEARA's professional verification process, PRC license checks, and how to get verified.",
};

export default function VerificationGuidePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060d1f" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "120px 24px 80px", color: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#10B981" }}>
              <ShieldCheck size={32} />
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, background: "linear-gradient(to right, #ffffff, #9ca3af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px" }}>
              Trust & Safety at NEARA
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", maxWidth: 650, margin: "0 auto" }}>
              To maintain the highest quality standards for our clients, all professionals on NEARA must pass a strict verification process. We manually verify your Professional Regulation Commission (PRC) license before you can accept projects.
            </p>
          </div>

          {/* The Process */}
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>The Verification Process</h2>
          
          <div style={{ position: "relative", marginBottom: 80 }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 32, width: 2, background: "rgba(255,255,255,0.05)", zIndex: 0, display: "none" }} className="timeline-line"></div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                { 
                  title: "1. Create Your Profile", 
                  desc: "Sign up and fill out your professional profile, including your full name, profession, and service areas. Make sure your name exactly matches your official IDs.",
                  icon: <UserCheckIcon />
                },
                { 
                  title: "2. Submit PRC Details", 
                  desc: "During onboarding, you will be asked to provide your PRC License Number. Please double-check for typos to avoid delays.",
                  icon: <FileCheck />
                },
                { 
                  title: "3. Manual Review", 
                  desc: "Our verification team will manually check your license number against the official Philippine PRC Online Verification registry. This typically takes 1-3 business days.",
                  icon: <Clock />
                },
                { 
                  title: "4. Get Verified", 
                  desc: "Once confirmed, you will receive an email notification and a 'Verified' badge will appear on your profile. You can now accept leads and be featured on the homepage!",
                  icon: <Award />
                }
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#060d1f", border: "2px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", flexShrink: 0, boxShadow: "0 0 20px rgba(16,185,129,0.1)" }}>
                    {step.icon}
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: 32, borderRadius: 20, flex: 1 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                    <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Rules */}
          <div style={{ background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.15)", borderRadius: 24, padding: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, color: "#F87171" }}>
              <AlertTriangle size={24} /> Important Verification Rules
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#F87171" }}>•</span>
                <span style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}><strong>Name Matching:</strong> The name on your NEARA profile must exactly match the name registered with the PRC.</span>
              </li>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#F87171" }}>•</span>
                <span style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}><strong>Expired Licenses:</strong> If your PRC license is expired during the check, your application will be rejected until you renew it.</span>
              </li>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#F87171" }}>•</span>
                <span style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}><strong>Fraudulent Information:</strong> Providing a fake license number or someone else's license will result in a permanent ban from the platform.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        @media (min-width: 768px) {
          .timeline-line { display: block !important; }
        }
      `}</style>
    </div>
  );
}

// Simple fallback icon component
function UserCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <polyline points="16 11 18 13 22 9"></polyline>
    </svg>
  );
}
