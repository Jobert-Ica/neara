"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, MessageSquare, CheckCircle, Briefcase, CreditCard, Users } from "lucide-react";

const CLIENT_STEPS = [
  {
    number: "01",
    icon: <Search size={22} />,
    title: "Browse & Search",
    description:
      "Search verified professionals by profession, location, rating, and experience. View their portfolios and reviews.",
    color: "#3B82F6",
  },
  {
    number: "02",
    icon: <Briefcase size={22} />,
    title: "Post Your Project",
    description:
      "Describe your project with budget range and timeline. Send requests to up to 3 professionals.",
    color: "#F59E0B",
  },
  {
    number: "03",
    icon: <MessageSquare size={22} />,
    title: "Connect & Build",
    description:
      "Once a professional accepts, chat directly to discuss details and kickstart your project.",
    color: "#10B981",
  },
];

const PRO_STEPS = [
  {
    number: "01",
    icon: <Users size={22} />,
    title: "Create Your Profile",
    description:
      "Upload your PRC license, portfolio, and credentials. Get verified by our team.",
    color: "#8B5CF6",
  },
  {
    number: "02",
    icon: <CreditCard size={22} />,
    title: "Purchase Credits",
    description:
      "Buy credits via GCash, Maya, or online banking. No monthly fees — only pay when you accept requests.",
    color: "#EC4899",
  },
  {
    number: "03",
    icon: <CheckCircle size={22} />,
    title: "Accept & Grow",
    description:
      "Review incoming requests with full project details before accepting. Build your reputation with reviews.",
    color: "#F97316",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="how-it-works"
      style={{ background: "#060d1f", padding: "100px 0" }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <p style={{ color: "#60A5FA", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            How It Works
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1px",
              margin: "0 auto 16px",
            }}
          >
            Simple for Everyone
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>
            NEARA is designed to be effortless for both clients and professionals.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
          }}
          className="how-it-works-grid"
        >
          {/* For Clients */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 20,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                marginBottom: 32,
              }}
            >
              <span style={{ color: "#60A5FA", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                For Clients
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {CLIENT_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    display: "flex",
                    gap: 20,
                    padding: "24px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    transition: "all 200ms ease",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${step.color}15`,
                      border: `1px solid ${step.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: step.color,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ color: step.color, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em" }}>
                        {step.number}
                      </span>
                      <h3 style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>
                        {step.title}
                      </h3>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* For Professionals */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 20,
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                marginBottom: 32,
              }}
            >
              <span style={{ color: "#A78BFA", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                For Professionals
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {PRO_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.15 }}
                  style={{
                    display: "flex",
                    gap: 20,
                    padding: "24px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    transition: "all 200ms ease",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${step.color}15`,
                      border: `1px solid ${step.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: step.color,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ color: step.color, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em" }}>
                        {step.number}
                      </span>
                      <h3 style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>
                        {step.title}
                      </h3>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
