"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Briefcase } from "lucide-react";

export default function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#0a1628", padding: "100px 0" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.35) 0%, transparent 60%), rgba(255,255,255,0.02)",
            border: "1px solid rgba(37,99,235,0.2)",
            borderRadius: 28,
            padding: "80px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              borderRadius: 28,
              opacity: 0.5,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-1.5px",
                margin: "0 auto 20px",
                maxWidth: 560,
              }}
            >
              Ready to Build Something{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #60A5FA, #2563EB)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Great?
              </span>
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 18,
                maxWidth: 440,
                margin: "0 auto 40px",
                lineHeight: 1.6,
              }}
            >
              Join thousands of clients and professionals already transforming the construction and design industry in the Philippines.
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/browse"
                id="cta-find-professional"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: "#2563EB",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "none",
                  transition: "all 150ms ease",
                  border: "1px solid #2563EB",
                }}
              >
                Find a Professional
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/sign-in?type=professional"
                id="cta-join-professional"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "none",
                  transition: "all 150ms ease",
                }}
              >
                <Briefcase size={16} />
                Join as Professional
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
