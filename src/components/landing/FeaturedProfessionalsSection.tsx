"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, MapPin, Shield, ArrowRight } from "lucide-react";

type Professional = {
  id: string;
  profession: string;
  city?: string | null;
  province?: string | null;
  totalRating: number;
  reviewCount: number;
  yearsExperience: number;
  completedProjects: number;
  user: { name: string | null; image: string | null };
};

const PROFESSION_LABELS: Record<string, string> = {
  ARCHITECT: "Architect",
  CIVIL_ENGINEER: "Civil Engineer",
  STRUCTURAL_ENGINEER: "Structural Engineer",
  ELECTRICAL_ENGINEER: "Electrical Engineer",
  MECHANICAL_ENGINEER: "Mechanical Engineer",
  CONTRACTOR: "Contractor",
  INTERIOR_DESIGNER: "Interior Designer",
};

// Demo professionals for empty DB
const DEMO_PROFESSIONALS: Professional[] = [
  { id: "demo-1", profession: "ARCHITECT", city: "Makati", province: "Metro Manila (NCR)", totalRating: 4.9, reviewCount: 47, yearsExperience: 12, completedProjects: 38, user: { name: "Maria Santos", image: null } },
  { id: "demo-2", profession: "CIVIL_ENGINEER", city: "Cebu City", province: "Cebu", totalRating: 4.8, reviewCount: 33, yearsExperience: 8, completedProjects: 25, user: { name: "Jose Reyes", image: null } },
  { id: "demo-3", profession: "INTERIOR_DESIGNER", city: "Quezon City", province: "Metro Manila (NCR)", totalRating: 5.0, reviewCount: 21, yearsExperience: 6, completedProjects: 19, user: { name: "Ana Cruz", image: null } },
  { id: "demo-4", profession: "CONTRACTOR", city: "Davao City", province: "Davao del Norte", totalRating: 4.7, reviewCount: 58, yearsExperience: 15, completedProjects: 61, user: { name: "Ramon Torres", image: null } },
  { id: "demo-5", profession: "STRUCTURAL_ENGINEER", city: "Taguig", province: "Metro Manila (NCR)", totalRating: 4.9, reviewCount: 29, yearsExperience: 10, completedProjects: 32, user: { name: "Liza Flores", image: null } },
  { id: "demo-6", profession: "ELECTRICAL_ENGINEER", city: "Iloilo City", province: "Iloilo", totalRating: 4.8, reviewCount: 17, yearsExperience: 7, completedProjects: 14, user: { name: "Marco Lim", image: null } },
];

const AVATAR_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#F97316"];

export default function FeaturedProfessionalsSection({
  professionals,
}: {
  professionals: Professional[];
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const display = professionals.length > 0 ? professionals : DEMO_PROFESSIONALS;

  return (
    <section ref={ref} style={{ background: "#0a1628", padding: "100px 0" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 48,
          }}
        >
          <div>
            <p style={{ color: "#60A5FA", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              Top Professionals
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
              Meet Our Best
            </h2>
          </div>
          <Link
            href="/browse"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(37,99,235,0.3)",
              color: "#60A5FA",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 150ms ease",
            }}
          >
            View All Professionals
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {display.slice(0, 6).map((pro, i) => {
            const rating = pro.reviewCount > 0 ? pro.totalRating / pro.reviewCount : 0;
            const displayRating = pro.totalRating > 0 ? (pro.totalRating / Math.max(pro.reviewCount, 1)).toFixed(1) : "5.0";
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

            return (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href={`/professionals/${pro.id}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 20,
                      padding: 24,
                      transition: "all 200ms ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.4)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Avatar + badge */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ position: "relative" }}>
                        {pro.user.image ? (
                          <Image
                            src={pro.user.image}
                            alt={pro.user.name || ""}
                            width={56}
                            height={56}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: "50%",
                              background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 22,
                              fontWeight: 800,
                              color: "white",
                            }}
                          >
                            {pro.user.name?.[0]?.toUpperCase() || "P"}
                          </div>
                        )}
                        {/* Verified indicator */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            width: 20,
                            height: 20,
                            background: "#10B981",
                            borderRadius: "50%",
                            border: "2px solid #0a1628",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Shield size={10} style={{ color: "white", fill: "white" }} />
                        </div>
                      </div>

                      {/* Rating */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 10px",
                          borderRadius: 8,
                          background: "rgba(245,158,11,0.1)",
                          border: "1px solid rgba(245,158,11,0.2)",
                        }}
                      >
                        <Star size={12} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                        <span style={{ color: "#FCD34D", fontSize: 13, fontWeight: 700 }}>
                          {displayRating}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                          ({pro.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Name + profession */}
                    <h3 style={{ color: "white", fontWeight: 700, fontSize: 17, margin: "0 0 4px" }}>
                      {pro.user.name}
                    </h3>
                    <p style={{ color: "#60A5FA", fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>
                      {PROFESSION_LABELS[pro.profession] || pro.profession}
                    </p>

                    {/* Location */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                      <MapPin size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
                        {pro.city || "Philippines"}
                      </span>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        paddingTop: 16,
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {[
                        { label: "Experience", value: `${pro.yearsExperience}yr${pro.yearsExperience !== 1 ? "s" : ""}` },
                        { label: "Projects", value: pro.completedProjects.toString() },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: "0 0 2px", fontWeight: 500 }}>
                            {stat.label}
                          </p>
                          <p style={{ color: "white", fontSize: 15, fontWeight: 700, margin: 0 }}>
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
