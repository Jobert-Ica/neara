"use client";

import Navbar from "@/components/layout/Navbar";
import { Settings as SettingsIcon, User, Bell, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060d1f" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "120px 24px 80px", color: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA" }}>
              <SettingsIcon size={24} />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800 }}>Account Settings</h1>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            {/* Sections placeholder */}
            {[
              { icon: <User size={20} />, title: "Personal Information", desc: "Update your name, email, and contact details." },
              { icon: <Bell size={20} />, title: "Notifications", desc: "Manage your email and push notification preferences." },
              { icon: <Shield size={20} />, title: "Privacy & Security", desc: "Change your password and manage active sessions." },
            ].map((section, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 24, display: "flex", gap: 20, cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}>
                <div style={{ color: "#60A5FA" }}>{section.icon}</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{section.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>{section.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Settings functionality coming soon.</p>
        </div>
      </main>
    </div>
  );
}
