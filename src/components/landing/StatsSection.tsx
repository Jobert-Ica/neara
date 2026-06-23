"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Briefcase, MapPin, Star } from "lucide-react";

interface StatsSectionProps {
  stats: { professionals: number; projects: number; cities: number };
}

const STAT_ITEMS = (stats: StatsSectionProps["stats"]) => [
  {
    icon: <Users size={24} style={{ color: "#60A5FA" }} />,
    value: stats.professionals > 0 ? `${stats.professionals}+` : "500+",
    label: "Verified Professionals",
    description: "PRC-licensed and background checked",
  },
  {
    icon: <Briefcase size={24} style={{ color: "#34D399" }} />,
    value: stats.projects > 0 ? `${stats.projects}+` : "1,200+",
    label: "Projects Completed",
    description: "Across residential and commercial",
  },
  {
    icon: <MapPin size={24} style={{ color: "#F59E0B" }} />,
    value: stats.cities > 0 ? `${stats.cities}+` : "50+",
    label: "Cities Covered",
    description: "Nationwide professional network",
  },
  {
    icon: <Star size={24} style={{ color: "#F59E0B", fill: "#F59E0B" }} />,
    value: "4.9",
    label: "Average Rating",
    description: "Based on verified client reviews",
  },
];

export default function StatsSection({ stats }: StatsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#060d1f",
        padding: "80px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 1,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {STAT_ITEMS(stats).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: "#060d1f",
                padding: "40px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div>
                <p style={{ color: "white", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>
                  {item.label}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
