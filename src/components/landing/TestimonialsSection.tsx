"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Patricia Lim",
    role: "Homeowner, Quezon City",
    rating: 5,
    text: "Found our architect in less than an hour. The verification process gives you real peace of mind — I knew I was hiring someone with a legitimate PRC license. Our home renovation turned out beautifully.",
    project: "Home Renovation",
  },
  {
    name: "Engr. Carlos Ramos",
    role: "Civil Engineer, Cebu City",
    rating: 5,
    text: "As a professional, NEARA has completely changed how I find clients. The credit system is fair — I only spend when I find a project worth pursuing. My project count has doubled in 6 months.",
    project: "Commercial Building",
  },
  {
    name: "Sandra Uy",
    role: "Property Developer, Taguig",
    rating: 5,
    text: "I've used NEARA for multiple commercial projects. The ability to see portfolios and reviews before reaching out saves so much time. Every professional I've hired has been exceptional.",
    project: "Mixed-Use Development",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#060d1f", padding: "100px 0" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p style={{ color: "#60A5FA", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Testimonials
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            Trusted by Thousands
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20,
                padding: 28,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <Quote size={20} style={{ color: "rgba(37,99,235,0.4)" }} />
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  margin: "0 0 24px",
                  fontStyle: "italic",
                }}
              >
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 700, fontSize: 14, margin: 0 }}>{t.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "2px 0 0" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
