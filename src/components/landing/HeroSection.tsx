"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Shield, Star, MapPin } from "lucide-react";

interface HeroSectionProps {
  stats: { professionals: number; projects: number; cities: number };
}

const PROFESSION_TAGS = [
  "Architect",
  "Civil Engineer",
  "Structural Engineer",
  "Contractor",
  "Interior Designer",
  "Electrical Engineer",
  "Mechanical Engineer",
];

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 68,
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.28) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(245,158,11,0.07) 0%, transparent 50%), #060d1f",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%)",
        }}
      />

      {/* Glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 400,
          height: 400,
          background: "rgba(37,99,235,0.08)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 300,
          height: 300,
          background: "rgba(245,158,11,0.06)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 20,
                background: "rgba(37,99,235,0.1)",
                border: "1px solid rgba(37,99,235,0.25)",
              }}
            >
              <Shield size={13} style={{ color: "#60A5FA" }} />
              <span style={{ color: "#60A5FA", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
                VERIFIED PROFESSIONALS ONLY
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              color: "white",
              margin: "0 0 24px",
            }}
          >
            Find Trusted{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #93C5FD 0%, #2563EB 50%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Professionals
            </span>{" "}
            for Your Project
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 19,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.65,
              marginBottom: 40,
              maxWidth: 560,
              margin: "0 auto 40px",
            }}
          >
            Connect with verified architects, engineers, contractors, and designers across the Philippines — backed by credentials, protected by trust.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: "flex",
              gap: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: 6,
              marginBottom: 32,
              backdropFilter: "blur(16px)",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.3)",
                  pointerEvents: "none",
                }}
              />
              <input
                id="hero-search"
                type="text"
                placeholder="Search by profession, city..."
                style={{
                  width: "100%",
                  height: 48,
                  paddingLeft: 44,
                  paddingRight: 16,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: 15,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const query = (e.target as HTMLInputElement).value;
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }
                }}
              />
            </div>
            <Link
              href="/browse"
              id="hero-browse-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 24px",
                background: "#2563EB",
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 12,
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
              }}
            >
              Browse
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Profession tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginBottom: 64,
            }}
          >
            {PROFESSION_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/browse?profession=${tag.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "all 150ms ease",
                  fontWeight: 500,
                }}
              >
                {tag}
              </Link>
            ))}
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                icon: <Shield size={16} style={{ color: "#34D399" }} />,
                text: "PRC Verified",
              },
              {
                icon: <Star size={16} style={{ color: "#F59E0B", fill: "#F59E0B" }} />,
                text: "4.9 Avg Rating",
              },
              {
                icon: <MapPin size={16} style={{ color: "#60A5FA" }} />,
                text: `${stats.cities > 0 ? stats.cities : "50"}+ Cities`,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background:
            "linear-gradient(to bottom, transparent, #060d1f)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
