"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate sending an email or saving to DB
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060d1f" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "120px 24px 80px", color: "white" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>Contact Us</h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto" }}>
              Have questions, feedback, or need support? We'd love to hear from you. Reach out to our team below.
            </p>
          </div>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 48 }}>
            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Get in Touch</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA" }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>Email</p>
                      <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>support@neara.ph</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34D399" }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>Phone</p>
                      <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>+63 917 123 4567</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FBBF24" }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>Office</p>
                      <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>Makati City, Metro Manila</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.02)", padding: 40, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Send us a message</h3>
              
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#10B981" }}>
                    <CheckCircle size={32} />
                  </div>
                  <h4 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Message Sent!</h4>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>We'll get back to you as soon as possible.</p>
                  <button type="button" onClick={() => setStatus("idle")} style={{ marginTop: 24, padding: "10px 24px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 500, transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                    Send another message
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8, fontWeight: 500 }}>Your Name</label>
                      <input 
                        type="text" 
                        required 
                        className="input"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="e.g. Juan dela Cruz"
                        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8, fontWeight: 500 }}>Email Address</label>
                      <input 
                        type="email" 
                        required 
                        className="input"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        placeholder="juan@example.com"
                        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }} 
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8, fontWeight: 500 }}>Message</label>
                    <textarea 
                      required 
                      className="textarea"
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      placeholder="How can we help you?"
                      rows={6}
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }} 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === "loading"}
                    style={{ width: "100%", padding: "16px", background: "#2563EB", border: "none", borderRadius: 12, color: "white", fontSize: 15, fontWeight: 600, cursor: status === "loading" ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s", marginTop: 8 }}
                    onMouseOver={e => { if (status !== "loading") e.currentTarget.style.background = "#1D4ED8" }}
                    onMouseOut={e => { if (status !== "loading") e.currentTarget.style.background = "#2563EB" }}
                  >
                    {status === "loading" ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={18} />}
                    {status === "loading" ? "Sending message..." : "Send Message"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
