"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, UserCircle, Briefcase, FileText, Image as ImageIcon, MapPin, CheckCircle, Plus, Eye, ExternalLink } from "lucide-react";
import { PROVINCES, getCitiesForProvince } from "@/lib/ph-locations";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  title: string;
  category?: string | null;
  coverImage?: string | null;
}

interface ProfileData {
  id: string;
  profession: string;
  specialization?: string | null;
  yearsExperience: number;
  province?: string | null;
  city?: string | null;
  serviceAreas: string[];
  aboutMe?: string | null;
  profilePhoto?: string | null;
  coverBanner?: string | null;
  isPublic: boolean;
  verificationStatus: string;
  portfolioItems: PortfolioItem[];
}

export default function ProProfileFormClient({ profile, user }: { profile: ProfileData; user: any }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "portfolio">("general");

  const [form, setForm] = useState({
    aboutMe: profile.aboutMe || "",
    specialization: profile.specialization || "",
    yearsExperience: profile.yearsExperience || 0,
    province: profile.province || "",
    city: profile.city || "",
    serviceAreas: profile.serviceAreas.join(", "),
    isPublic: profile.isPublic,
  });

  const cities = form.province ? getCitiesForProvince(form.province) : [];

  const update = (key: keyof typeof form, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/onboarding/professional", {
        method: "POST", // We can use the same endpoint, it does an upsert
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          profession: profile.profession,
          serviceAreas: form.serviceAreas.split(",").map((s) => s.trim()).filter(Boolean),
          step: "COMPLETE", // trick to skip validation steps
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16 }}>
        <button
          onClick={() => setActiveTab("general")}
          style={{
            padding: "8px 16px",
            background: activeTab === "general" ? "rgba(37,99,235,0.15)" : "transparent",
            color: activeTab === "general" ? "#60A5FA" : "rgba(255,255,255,0.5)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
        >
          General Information
        </button>
        <button
          onClick={() => setActiveTab("portfolio")}
          style={{
            padding: "8px 16px",
            background: activeTab === "portfolio" ? "rgba(37,99,235,0.15)" : "transparent",
            color: activeTab === "portfolio" ? "#60A5FA" : "rgba(255,255,255,0.5)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
        >
          Portfolio ({profile.portfolioItems.length})
        </button>
      </div>

      {activeTab === "general" && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Status block */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
            <div>
              <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Profile Visibility</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
                {form.isPublic ? "Your profile is visible to clients in the Browse directory." : "Your profile is hidden from public directories."}
              </p>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <span style={{ color: form.isPublic ? "#34D399" : "rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 600 }}>
                {form.isPublic ? "Public" : "Hidden"}
              </span>
              <div
                style={{
                  width: 44,
                  height: 24,
                  background: form.isPublic ? "#2563EB" : "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  position: "relative",
                  transition: "background 200ms ease",
                }}
                onClick={() => update("isPublic", !form.isPublic)}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    background: "white",
                    borderRadius: "50%",
                    position: "absolute",
                    top: 2,
                    left: form.isPublic ? 22 : 2,
                    transition: "left 200ms ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </label>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <UserCircle size={18} /> Basic Details
              </h2>
              <Link href={`/professionals/${profile.id}`} target="_blank" style={{ display: "flex", alignItems: "center", gap: 4, color: "#60A5FA", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                <Eye size={14} /> View Public Profile
              </Link>
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "center", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {profile.profilePhoto || user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.profilePhoto || user.image} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ImageIcon size={32} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              )}
              <div>
                <button type="button" className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.5 }}>Change Photo (Coming Soon)</button>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, margin: "8px 0 0" }}>Update your photo via Google Account for now.</p>
              </div>
            </div>

            <div>
              <label className="label">Profession</label>
              <input type="text" className="input" value={profile.profession.replace(/_/g, " ")} disabled style={{ opacity: 0.5 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="label">Specialization</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Modern Residential"
                  value={form.specialization}
                  onChange={(e) => update("specialization", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Years of Experience</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={form.yearsExperience}
                  onChange={(e) => update("yearsExperience", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <label className="label">About Me (Bio)</label>
              <textarea
                className="textarea"
                rows={5}
                placeholder="Tell clients about your background, approach, and expertise..."
                value={form.aboutMe}
                onChange={(e) => update("aboutMe", e.target.value)}
              />
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ color: "white", fontSize: 16, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={18} /> Location & Services
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="label">Province</label>
                <select
                  className="select"
                  value={form.province}
                  onChange={(e) => { update("province", e.target.value); update("city", ""); }}
                >
                  <option value="">Select Province...</option>
                  {PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">City / Municipality</label>
                <select
                  className="select"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  disabled={!form.province}
                >
                  <option value="">Select City...</option>
                  {cities.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Service Areas (Comma-separated)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Metro Manila, Cavite, Laguna"
                value={form.serviceAreas}
                onChange={(e) => update("serviceAreas", e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            {success && <span style={{ color: "#34D399", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}><CheckCircle size={16} /> Saved</span>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === "portfolio" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>
              Showcase your best work to attract clients.
            </p>
            <button className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Item
            </button>
          </div>

          {profile.portfolioItems.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 16, padding: "60px 24px", textAlign: "center" }}>
              <Briefcase size={36} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />
              <h3 style={{ color: "white", fontSize: 16, margin: "0 0 8px" }}>Empty Portfolio</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 20px" }}>Add past projects to build trust with potential clients.</p>
              <button className="btn btn-secondary">Add Portfolio Item</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {profile.portfolioItems.map((item) => (
                <div key={item.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ height: 160, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.coverImage} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <ImageIcon size={32} style={{ color: "rgba(255,255,255,0.2)" }} />
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h4 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{item.title}</h4>
                    <span style={{ color: "#60A5FA", fontSize: 12 }}>{item.category || "Uncategorized"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
