"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import {
  MapPin,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Briefcase,
  FileText,
  Award,
} from "lucide-react";
import { PROVINCES, getCitiesForProvince } from "@/lib/ph-locations";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const PROFESSIONS = [
  { value: "ARCHITECT", label: "Architect", icon: "🏛️" },
  { value: "CIVIL_ENGINEER", label: "Civil Engineer", icon: "🏗️" },
  { value: "STRUCTURAL_ENGINEER", label: "Structural Engineer", icon: "🔩" },
  { value: "ELECTRICAL_ENGINEER", label: "Electrical Engineer", icon: "⚡" },
  { value: "MECHANICAL_ENGINEER", label: "Mechanical Engineer", icon: "⚙️" },
  { value: "CONTRACTOR", label: "Contractor", icon: "🔨" },
  { value: "INTERIOR_DESIGNER", label: "Interior Designer", icon: "🛋️" },
  { value: "LANDSCAPE_ARCHITECT", label: "Landscape Architect", icon: "🌿" },
  { value: "SURVEYOR", label: "Surveyor", icon: "📐" },
  { value: "QUANTITY_SURVEYOR", label: "Quantity Surveyor", icon: "📊" },
  { value: "PROJECT_MANAGER", label: "Project Manager", icon: "📋" },
  { value: "CONSTRUCTION_CONSULTANT", label: "Construction Consultant", icon: "🏢" },
  { value: "BUILDING_INSPECTOR", label: "Building Inspector", icon: "🔍" },
];

const METRO_CITIES = [
  "Metro Manila", "Cebu City", "Davao City", "Quezon City", "Makati",
  "Taguig", "Pasig", "Mandaluyong", "Marikina", "Caloocan",
];

interface FormData {
  fullName: string;
  phone: string;
  profession: string;
  specialization: string;
  yearsExperience: number;
  province: string;
  city: string;
  serviceAreas: string[];
  aboutMe: string;
  prcLicenseNumber: string;
}

export default function ProfessionalOnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    fullName: session?.user?.name || "",
    phone: "",
    profession: "",
    specialization: "",
    yearsExperience: 0,
    province: "",
    city: "",
    serviceAreas: [],
    aboutMe: "",
    prcLicenseNumber: "",
  });

  const cities = form.province ? getCitiesForProvince(form.province) : [];

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleServiceArea = (area: string) => {
    setForm((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter((a) => a !== area)
        : [...prev.serviceAreas, area],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearsExperience: Number(form.yearsExperience),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save onboarding info");
      }
      router.push("/pro-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const steps = [
    { label: "Identity", icon: <User size={14} /> },
    { label: "Profession", icon: <Briefcase size={14} /> },
    { label: "License", icon: <Award size={14} /> },
    { label: "Location", icon: <MapPin size={14} /> },
    { label: "About", icon: <FileText size={14} /> },
    { label: "Review", icon: <CheckCircle size={14} /> },
  ];

  const canProceed = () => {
    if (step === 1) return form.fullName.trim().length >= 2 && form.phone.length === 10 && form.phone.startsWith("9");
    if (step === 2) return form.profession !== "" && form.yearsExperience >= 0;
    if (step === 3) return form.prcLicenseNumber.trim().length >= 3;
    if (step === 4) return form.province && form.city;
    if (step === 5) return form.aboutMe.trim().length >= 30;
    return true;
  };

  const selectedProfession = PROFESSIONS.find((p) => p.value === form.profession);
  const selectedProvinceName = PROVINCES.find((p) => p.code === form.province)?.name;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(37,99,235,0.18) 0%, transparent 60%), #060d1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 600 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <span style={{ color: "white", fontWeight: 900, fontSize: 22 }}>N</span>
          </div>
          <h1 style={{ color: "white", fontWeight: 800, fontSize: 28, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
            Join as a Professional
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
            Set up your professional profile to start receiving project requests
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 36, gap: 4 }}>
          {steps.map((s, i) => {
            const num = (i + 1) as Step;
            const isDone = step > num;
            const isActive = step === num;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    flex: "0 0 auto",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isDone ? "#10B981" : isActive ? "#2563EB" : "rgba(255,255,255,0.05)",
                      border: isDone ? "none" : isActive ? "2px solid rgba(96,165,250,0.4)" : "1px solid rgba(255,255,255,0.1)",
                      color: isDone || isActive ? "white" : "rgba(255,255,255,0.3)",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      transition: "all 250ms ease",
                    }}
                  >
                    {isDone ? <CheckCircle size={14} /> : <span>{num}</span>}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: isActive ? "#60A5FA" : isDone ? "#34D399" : "rgba(255,255,255,0.25)",
                      fontWeight: isActive ? 700 : 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: isDone ? "#10B981" : "rgba(255,255,255,0.06)",
                      margin: "0 4px",
                      marginBottom: 16,
                      transition: "background 250ms ease",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 24,
            padding: "40px",
          }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Identity */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 22, margin: "0 0 6px" }}>
                  Your identity
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>
                  This will appear on your public profile.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      id="pro-fullname"
                      className="input"
                      type="text"
                      placeholder="e.g. Juan dela Cruz"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }}
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0 16px", overflow: "hidden" }}>
                      <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 15, borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: 12, marginRight: 12 }}>
                        +63
                      </span>
                      <input
                        id="pro-phone"
                        type="tel"
                        placeholder="9XX XXX XXXX"
                        value={form.phone.replace(/(\d{3})(\d{0,3})(\d{0,4})/, (m, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join(" "))}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) update("phone", val);
                        }}
                        style={{ flex: 1, background: "transparent", border: "none", color: "white", padding: "14px 0", outline: "none", fontSize: 15 }}
                      />
                    </div>
                    {form.phone && form.phone.length > 0 && !form.phone.startsWith("9") && (
                      <p style={{ color: "#F87171", fontSize: 13, marginTop: 8 }}>Number must start with 9</p>
                    )}
                    {form.phone && form.phone.startsWith("9") && form.phone.length < 10 && (
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 8 }}>{10 - form.phone.length} more digits needed</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Profession */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 22, margin: "0 0 6px" }}>
                  Your profession
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24 }}>
                  Select your primary profession.
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginBottom: 24,
                    maxHeight: 280,
                    overflowY: "auto",
                    paddingRight: 4,
                  }}
                >
                  {PROFESSIONS.map((p) => (
                    <button
                      key={p.value}
                      id={`profession-${p.value.toLowerCase()}`}
                      onClick={() => update("profession", p.value)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 14px",
                        borderRadius: 12,
                        background:
                          form.profession === p.value
                            ? "rgba(37,99,235,0.15)"
                            : "rgba(255,255,255,0.03)",
                        border:
                          form.profession === p.value
                            ? "1px solid rgba(37,99,235,0.5)"
                            : "1px solid rgba(255,255,255,0.07)",
                        color: form.profession === p.value ? "#60A5FA" : "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        textAlign: "left",
                        transition: "all 150ms ease",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{p.icon}</span>
                      <span style={{ lineHeight: 1.3 }}>{p.label}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="label">Specialization (Optional)</label>
                    <input
                      id="pro-specialization"
                      className="input"
                      type="text"
                      placeholder="e.g. Residential Design, Seismic Analysis"
                      value={form.specialization}
                      onChange={(e) => update("specialization", e.target.value)}
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }}
                    />
                  </div>
                  <div>
                    <label className="label">Years of Experience</label>
                    <input
                      id="pro-years-exp"
                      className="input"
                      type="number"
                      min={0}
                      max={60}
                      placeholder="0"
                      value={form.yearsExperience || ""}
                      onChange={(e) => update("yearsExperience", parseInt(e.target.value) || 0)}
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: PRC License */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 22, margin: "0 0 6px" }}>
                  PRC License
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>
                  Your Professional Regulation Commission license number is required for verification.
                </p>
                <div
                  style={{
                    background: "rgba(245,158,11,0.06)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    marginBottom: 24,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 20 }}>📋</span>
                  <div>
                    <p style={{ color: "#FCD34D", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>
                      Verification required
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                      Your license number will be verified by our team within 1-3 business days. 
                      You can start setting up your profile now.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="label">PRC License Number</label>
                  <input
                    id="pro-prc-license"
                    className="input"
                    type="text"
                    placeholder="e.g. 0012345"
                    value={form.prcLicenseNumber}
                    onChange={(e) => update("prcLicenseNumber", e.target.value)}
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }}
                  />
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 8 }}>
                    Enter your license number exactly as it appears on your PRC ID.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Location & Service Areas */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 22, margin: "0 0 6px" }}>
                  Location & service areas
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24 }}>
                  Where are you based and where can you work?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="label">Province / Region</label>
                    <select
                      id="pro-province"
                      className="select"
                      value={form.province}
                      onChange={(e) => { update("province", e.target.value); update("city", ""); }}
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: form.province ? "white" : "rgba(255,255,255,0.3)" }}
                    >
                      <option value="">Select province...</option>
                      {PROVINCES.map((p) => (
                        <option key={p.code} value={p.code} style={{ background: "#0f1b3d" }}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">City / Municipality</label>
                    <select
                      id="pro-city"
                      className="select"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      disabled={!form.province}
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: form.city ? "white" : "rgba(255,255,255,0.3)" }}
                    >
                      <option value="">Select city...</option>
                      {cities.length > 0
                        ? cities.map((c) => (
                            <option key={c.code} value={c.name} style={{ background: "#0f1b3d" }}>
                              {c.name}
                            </option>
                          ))
                        : <option value={form.province ? "Other" : ""}>Other</option>}
                    </select>
                  </div>
                  <div>
                    <label className="label">Service Areas (select all that apply)</label>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginBottom: 10 }}>
                      These are the areas where you can take on projects.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {METRO_CITIES.map((city) => (
                        <button
                          key={city}
                          onClick={() => toggleServiceArea(city)}
                          style={{
                            padding: "7px 14px",
                            borderRadius: 20,
                            background: form.serviceAreas.includes(city)
                              ? "rgba(37,99,235,0.2)"
                              : "rgba(255,255,255,0.04)",
                            border: form.serviceAreas.includes(city)
                              ? "1px solid rgba(37,99,235,0.5)"
                              : "1px solid rgba(255,255,255,0.08)",
                            color: form.serviceAreas.includes(city)
                              ? "#60A5FA"
                              : "rgba(255,255,255,0.5)",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 500,
                            transition: "all 150ms ease",
                          }}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: About */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 22, margin: "0 0 6px" }}>
                  About you
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24 }}>
                  Tell clients about your background, expertise, and what makes you stand out.
                </p>
                <div>
                  <label className="label">Professional Bio</label>
                  <textarea
                    id="pro-about"
                    className="textarea"
                    placeholder="Describe your background, notable projects, professional philosophy, and what clients can expect when working with you..."
                    value={form.aboutMe}
                    onChange={(e) => update("aboutMe", e.target.value)}
                    rows={7}
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white", minHeight: 180 }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <p style={{ color: form.aboutMe.length < 30 ? "#F87171" : "rgba(255,255,255,0.3)", fontSize: 12 }}>
                      {form.aboutMe.length < 30 ? `${30 - form.aboutMe.length} more characters needed` : "✓ Looks good"}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                      {form.aboutMe.length}/2000
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}
              >
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(16,185,129,0.1)",
                      border: "2px solid #10B981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <CheckCircle size={30} style={{ color: "#10B981" }} />
                  </div>
                  <h2 style={{ color: "white", fontWeight: 800, fontSize: 22, margin: "0 0 8px" }}>
                    Review your profile
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
                    Everything look correct? You can update these anytime.
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    overflow: "hidden",
                  }}
                >
                  {[
                    { label: "Name", value: form.fullName },
                    { label: "Phone", value: form.phone },
                    { label: "Profession", value: `${selectedProfession?.icon} ${selectedProfession?.label}` || form.profession },
                    { label: "Experience", value: `${form.yearsExperience} year${form.yearsExperience !== 1 ? "s" : ""}` },
                    { label: "PRC License", value: form.prcLicenseNumber },
                    { label: "Location", value: `${form.city}, ${selectedProvinceName}` },
                    { label: "Service Areas", value: form.serviceAreas.length > 0 ? form.serviceAreas.join(", ") : "Not specified" },
                  ].map((item, idx) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "13px 20px",
                        borderBottom: idx < 6 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        gap: 16,
                      }}
                    >
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, flexShrink: 0, minWidth: 90 }}>{item.label}</span>
                      <span style={{ color: "white", fontSize: 13, fontWeight: 500, textAlign: "right" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: "rgba(37,99,235,0.06)",
                    border: "1px solid rgba(37,99,235,0.15)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    marginTop: 16,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 16 }}>ℹ️</span>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                    After submission, your profile will be under review. You&apos;ll receive an email once verified. 
                    You can still set up your portfolio and profile photo while waiting.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div
              style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.2)",
                borderRadius: 10,
                padding: "12px 16px",
                marginTop: 16,
                color: "#F87171",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {step > 1 && step < 6 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as Step)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 20px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}

            {step < 5 && (
              <button
                id={`pro-next-${step}`}
                onClick={() => setStep((prev) => (prev + 1) as Step)}
                disabled={!canProceed()}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px 24px",
                  borderRadius: 12,
                  background: canProceed() ? "#2563EB" : "rgba(37,99,235,0.25)",
                  border: "none",
                  color: canProceed() ? "white" : "rgba(255,255,255,0.3)",
                  cursor: canProceed() ? "pointer" : "not-allowed",
                  fontSize: 15,
                  fontWeight: 700,
                  transition: "all 150ms ease",
                }}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            )}

            {step === 5 && (
              <button
                id="pro-review"
                onClick={() => setStep(6)}
                disabled={!canProceed()}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px 24px",
                  borderRadius: 12,
                  background: canProceed() ? "#2563EB" : "rgba(37,99,235,0.25)",
                  border: "none",
                  color: canProceed() ? "white" : "rgba(255,255,255,0.3)",
                  cursor: canProceed() ? "pointer" : "not-allowed",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Review
                <ArrowRight size={16} />
              </button>
            )}

            {step === 6 && (
              <>
                <button
                  onClick={() => setStep(5)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 20px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <ArrowLeft size={16} />
                  Edit
                </button>
                <button
                  id="pro-submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "13px 24px",
                    borderRadius: 12,
                    background: "#10B981",
                    border: "none",
                    color: "white",
                    cursor: submitting ? "wait" : "pointer",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  {submitting ? (
                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  {submitting ? "Submitting..." : "Submit Profile"}
                </button>
              </>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 20 }}>
          By submitting, you agree to our{" "}
          <a href="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Privacy Policy</a>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
