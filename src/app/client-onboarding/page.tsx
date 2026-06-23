"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { MapPin, Phone, User, ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { PROVINCES, getCitiesForProvince } from "@/lib/ph-locations";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  fullName: string;
  phone: string;
  province: string;
  city: string;
}

export default function ClientOnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    fullName: session?.user?.name || "",
    phone: "",
    province: "",
    city: "",
  });

  const cities = form.province ? getCitiesForProvince(form.province) : [];

  const update = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save onboarding info");
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const steps = [
    { label: "Name", icon: <User size={16} /> },
    { label: "Contact", icon: <Phone size={16} /> },
    { label: "Location", icon: <MapPin size={16} /> },
    { label: "Done", icon: <CheckCircle size={16} /> },
  ];

  const canProceed = () => {
    if (step === 1) return form.fullName.trim().length >= 2;
    if (step === 2) return form.phone.length === 10 && form.phone.startsWith("9");
    if (step === 3) return form.province && form.city;
    return true;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 60%), #060d1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
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
          <h1 style={{ color: "white", fontWeight: 800, fontSize: 28, letterSpacing: "-0.5px", margin: "0 0 8px" }}>
            Welcome to NEARA
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
            Let&apos;s set up your client profile
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          {steps.map((s, i) => {
            const num = (i + 1) as Step;
            const isDone = step > num;
            const isActive = step === num;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDone ? "#10B981" : isActive ? "#2563EB" : "rgba(255,255,255,0.05)",
                    border: isDone ? "none" : isActive ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: isDone || isActive ? "white" : "rgba(255,255,255,0.3)",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: "all 250ms ease",
                  }}
                >
                  {isDone ? <CheckCircle size={16} /> : <span>{num}</span>}
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: isDone ? "#10B981" : "rgba(255,255,255,0.08)",
                      margin: "0 6px",
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
            padding: 40,
          }}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 22, margin: "0 0 8px" }}>
                  What&apos;s your name?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>
                  This will be displayed on your requests.
                </p>
                <label className="label">Full Name</label>
                <input
                  id="onboarding-fullname"
                  className="input"
                  type="text"
                  placeholder="e.g. Maria Santos"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "white" }}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 22, margin: "0 0 8px" }}>
                  Your phone number
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>
                  Used for identity verification and important notifications.
                </p>
                <label className="label">Phone Number</label>
                <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0 16px", overflow: "hidden" }}>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 15, borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: 12, marginRight: 12 }}>
                    +63
                  </span>
                  <input
                    id="onboarding-phone"
                    type="tel"
                    placeholder="9XX XXX XXXX"
                    value={form.phone}
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
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 style={{ color: "white", fontWeight: 700, fontSize: 22, margin: "0 0 8px" }}>
                  Where are you based?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>
                  Helps us show you relevant professionals nearby.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="label">Province / Region</label>
                    <select
                      id="onboarding-province"
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
                      id="onboarding-city"
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
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: "center", padding: "20px 0" }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(16,185,129,0.1)",
                    border: "2px solid #10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <CheckCircle size={36} style={{ color: "#10B981" }} />
                </div>
                <h2 style={{ color: "white", fontWeight: 800, fontSize: 24, margin: "0 0 12px" }}>
                  You&apos;re all set, {form.fullName.split(" ")[0]}!
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: "0 0 32px", lineHeight: 1.6 }}>
                  Your profile is ready. Start browsing verified professionals for your project.
                </p>

                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "16px 24px",
                    marginBottom: 28,
                    textAlign: "left",
                  }}
                >
                  {[
                    { label: "Name", value: form.fullName },
                    { label: "Phone", value: form.phone },
                    { label: "Location", value: `${form.city}, ${PROVINCES.find(p => p.code === form.province)?.name}` },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>{item.label}</span>
                      <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, padding: "12px 16px", marginTop: 16, color: "#F87171", fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {step > 1 && step < 4 && (
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

            {step < 3 && (
              <button
                id={`onboarding-next-${step}`}
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
                  background: canProceed() ? "#2563EB" : "rgba(37,99,235,0.3)",
                  border: "none",
                  color: "white",
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

            {step === 3 && (
              <button
                id="onboarding-review"
                onClick={() => setStep(4)}
                disabled={!canProceed()}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px 24px",
                  borderRadius: 12,
                  background: canProceed() ? "#2563EB" : "rgba(37,99,235,0.3)",
                  border: "none",
                  color: "white",
                  cursor: canProceed() ? "pointer" : "not-allowed",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Review
                <ArrowRight size={16} />
              </button>
            )}

            {step === 4 && (
              <button
                id="onboarding-complete"
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
                {submitting ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle size={18} />}
                {submitting ? "Setting up..." : "Complete Setup"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
