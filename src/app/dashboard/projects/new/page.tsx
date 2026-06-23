"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PROVINCES, getCitiesForProvince } from "@/lib/ph-locations";
import { ArrowLeft, Loader2, Send, MapPin, DollarSign, Calendar, FileText } from "lucide-react";
import Link from "next/link";

const PROFESSIONS = [
  "Architect", "Civil Engineer", "Structural Engineer", "Electrical Engineer",
  "Mechanical Engineer", "Contractor", "Interior Designer", "Landscape Architect",
  "Surveyor", "Quantity Surveyor", "Project Manager", "Construction Consultant",
  "Building Inspector",
];

const TIMELINES = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "More than 6 months",
  "Flexible",
];

const BUDGET_RANGES = [
  { label: "Under ₱100,000", min: 0, max: 100000 },
  { label: "₱100,000 - ₱500,000", min: 100000, max: 500000 },
  { label: "₱500,000 - ₱1,000,000", min: 500000, max: 1000000 },
  { label: "₱1,000,000 - ₱5,000,000", min: 1000000, max: 5000000 },
  { label: "Above ₱5,000,000", min: 5000000, max: null },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    professionNeeded: "",
    budgetIndex: "",
    province: "",
    city: "",
    timeline: "",
  });

  const cities = form.province ? getCitiesForProvince(form.province) : [];

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const selectedBudget = form.budgetIndex ? BUDGET_RANGES[parseInt(form.budgetIndex)] : null;

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          budgetMin: selectedBudget?.min ?? null,
          budgetMax: selectedBudget?.max ?? null,
          province: form.province || null,
          city: form.city || null,
          timeline: form.timeline || null,
          professionNeeded: form.professionNeeded || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create project");
      }

      const data = await res.json();
      router.push(`/dashboard/projects/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  const isValid = form.title.trim().length >= 5 && form.description.trim().length >= 20;

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 720 }}>
      <Link
        href="/dashboard/projects"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "rgba(255,255,255,0.4)",
          textDecoration: "none",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 style={{ color: "white", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
          Post a New Project
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 32px" }}>
          Describe your project and professionals will send you proposals.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Title */}
            <div>
              <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={13} />
                Project Title *
              </label>
              <input
                id="project-title"
                className="input"
                type="text"
                placeholder="Example: Design and build a 2-story minimalist home in Taguig"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
                minLength={5}
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }}
              />
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 6 }}>
                Be specific to attract the right professionals.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="label">Project Description *</label>
              <textarea
                id="project-description"
                className="textarea"
                placeholder="Example: I am looking for an architect to design a modern 3-bedroom home on a 200sqm lot. Needs to include earthquake-resistant structural planning and a roof deck..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={6}
                required
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white", minHeight: 150 }}
              />
              <p style={{ color: form.description.length < 20 ? "#F87171" : "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 6 }}>
                {form.description.length < 20 ? `${20 - form.description.length} more characters needed` : `${form.description.length} characters`}
              </p>
            </div>

            {/* Profession needed */}
            <div>
              <label className="label">
                <span>Profession Needed (Optional)</span>
              </label>
              <select
                id="project-profession"
                className="select"
                value={form.professionNeeded}
                onChange={(e) => update("professionNeeded", e.target.value)}
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: form.professionNeeded ? "white" : "rgba(255,255,255,0.3)" }}
              >
                <option value="">Select profession...</option>
                {PROFESSIONS.map((p) => (
                  <option key={p} value={p} style={{ background: "#0f1b3d" }}>{p}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <DollarSign size={13} />
                Estimated Budget — Optional
              </label>
              <select
                id="project-budget"
                className="select"
                value={form.budgetIndex}
                onChange={(e) => update("budgetIndex", e.target.value)}
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: form.budgetIndex ? "white" : "rgba(255,255,255,0.3)" }}
              >
                <option value="">I'm not sure yet</option>
                {BUDGET_RANGES.map((b, idx) => (
                  <option key={idx} value={idx.toString()} style={{ background: "#0f1b3d", color: "white" }}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={13} />
                Project Location — Optional
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <select
                  id="project-province"
                  className="select"
                  value={form.province}
                  onChange={(e) => { update("province", e.target.value); update("city", ""); }}
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: form.province ? "white" : "rgba(255,255,255,0.3)" }}
                >
                  <option value="">Province...</option>
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code} style={{ background: "#0f1b3d" }}>{p.name}</option>
                  ))}
                </select>
                <select
                  id="project-city"
                  className="select"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  disabled={!form.province}
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: form.city ? "white" : "rgba(255,255,255,0.3)" }}
                >
                  <option value="">City...</option>
                  {cities.map((c) => (
                    <option key={c.code} value={c.name} style={{ background: "#0f1b3d" }}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={13} />
                Timeline — Optional
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TIMELINES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("timeline", t === form.timeline ? "" : t)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 20,
                      background: form.timeline === t ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.04)",
                      border: form.timeline === t ? "1px solid rgba(37,99,235,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      color: form.timeline === t ? "#60A5FA" : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 500,
                      transition: "all 150ms ease",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#F87171",
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <Link href="/dashboard/projects" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </Link>
              <button
                id="submit-project"
                type="submit"
                className="btn btn-primary"
                disabled={!isValid || submitting}
              >
                {submitting ? (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <Send size={16} />
                )}
                {submitting ? "Posting..." : "Post Project"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
