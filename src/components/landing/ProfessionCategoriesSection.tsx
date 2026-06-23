"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Zap, Settings, PenTool, HardHat, Home, Cpu } from "lucide-react";

const CATEGORIES = [
  {
    icon: <Building2 size={28} />,
    label: "Architects",
    count: null,
    href: "/browse?profession=architect",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    icon: <Zap size={28} />,
    label: "Civil Engineers",
    href: "/browse?profession=civil-engineer",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    icon: <Settings size={28} />,
    label: "Structural Engineers",
    href: "/browse?profession=structural-engineer",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    icon: <Cpu size={28} />,
    label: "Electrical Engineers",
    href: "/browse?profession=electrical-engineer",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    icon: <Zap size={28} />,
    label: "Mechanical Engineers",
    href: "/browse?profession=mechanical-engineer",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.2)",
  },
  {
    icon: <HardHat size={28} />,
    label: "Contractors",
    href: "/browse?profession=contractor",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.2)",
  },
  {
    icon: <PenTool size={28} />,
    label: "Interior Designers",
    href: "/browse?profession=interior-designer",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.08)",
    border: "rgba(20,184,166,0.2)",
  },
  {
    icon: <Home size={28} />,
    label: "View All",
    href: "/browse",
    color: "#60A5FA",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.2)",
    isViewAll: true,
  },
];

export default function ProfessionCategoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#0a1628",
        padding: "100px 0",
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p style={{ color: "#60A5FA", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Professionals
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1px",
              margin: "0 auto 16px",
              maxWidth: 560,
            }}
          >
            Every Professional You Need
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>
            From concept to completion — find the right expert for every stage of your project.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={cat.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  padding: "32px 20px",
                  borderRadius: 16,
                  background: cat.bg,
                  border: `1px solid ${cat.border}`,
                  textDecoration: "none",
                  transition: "all 200ms ease",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${cat.color}20`;
                  (e.currentTarget as HTMLElement).style.borderColor = cat.color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = cat.border;
                }}
              >
                <div style={{ color: cat.color }}>{cat.icon}</div>
                <span
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: 1.3,
                  }}
                >
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
