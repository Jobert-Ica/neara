"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  CheckCircle,
  Briefcase,
  Award,
  Clock,
  MessageSquare,
  ChevronLeft,
  ExternalLink,
  Images,
} from "lucide-react";

const PROFESSION_LABELS: Record<string, string> = {
  ARCHITECT: "Architect",
  CIVIL_ENGINEER: "Civil Engineer",
  STRUCTURAL_ENGINEER: "Structural Engineer",
  ELECTRICAL_ENGINEER: "Electrical Engineer",
  MECHANICAL_ENGINEER: "Mechanical Engineer",
  CONTRACTOR: "Contractor",
  INTERIOR_DESIGNER: "Interior Designer",
  LANDSCAPE_ARCHITECT: "Landscape Architect",
  SURVEYOR: "Surveyor",
  QUANTITY_SURVEYOR: "Quantity Surveyor",
  PROJECT_MANAGER: "Project Manager",
  CONSTRUCTION_CONSULTANT: "Construction Consultant",
  BUILDING_INSPECTOR: "Building Inspector",
};

const PROFESSION_ICONS: Record<string, string> = {
  ARCHITECT: "🏛️",
  CIVIL_ENGINEER: "🏗️",
  STRUCTURAL_ENGINEER: "🔩",
  ELECTRICAL_ENGINEER: "⚡",
  MECHANICAL_ENGINEER: "⚙️",
  CONTRACTOR: "🔨",
  INTERIOR_DESIGNER: "🛋️",
  LANDSCAPE_ARCHITECT: "🌿",
  SURVEYOR: "📐",
  QUANTITY_SURVEYOR: "📊",
  PROJECT_MANAGER: "📋",
  CONSTRUCTION_CONSULTANT: "🏢",
  BUILDING_INSPECTOR: "🔍",
};

interface PortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  coverImage?: string | null;
  galleryImages: string[];
  projectLocation?: string | null;
  completionDate?: Date | null;
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  clientUserId: string;
}

interface Professional {
  id: string;
  profession: string;
  specialization?: string | null;
  yearsExperience: number;
  province?: string | null;
  city?: string | null;
  serviceAreas: string[];
  aboutMe?: string | null;
  profilePhoto?: string | null;
  coverBanner?: string | null;
  verificationStatus: string;
  totalRating: number;
  reviewCount: number;
  completedProjects: number;
  responseRate: number;
  avgRating: number;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
  portfolioItems: PortfolioItem[];
  reviews: Review[];
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          style={{
            color: star <= Math.round(rating) ? "#F59E0B" : "rgba(255,255,255,0.15)",
            fill: star <= Math.round(rating) ? "#F59E0B" : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function ProfessionalProfileClient({ professional }: { professional: Professional }) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews">("about");

  const professionLabel = PROFESSION_LABELS[professional.profession] || professional.profession.replace(/_/g, " ");
  const professionIcon = PROFESSION_ICONS[professional.profession] || "👤";

  return (
    <main style={{ minHeight: "100vh", background: "#060d1f", paddingTop: 80 }}>
      {/* Back nav */}
      <div className="container" style={{ padding: "20px 24px 0" }}>
        <Link
          href="/browse"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            transition: "color 150ms ease",
          }}
        >
          <ChevronLeft size={16} />
          Back to Browse
        </Link>
      </div>

      {/* Cover banner */}
      <div
        style={{
          height: 200,
          background: professional.coverBanner
            ? `url(${professional.coverBanner}) center/cover no-repeat`
            : "linear-gradient(135deg, rgba(37,99,235,0.3) 0%, rgba(96,165,250,0.1) 50%, rgba(245,158,11,0.1) 100%)",
          position: "relative",
          marginTop: 16,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, rgba(6,13,31,0.9) 100%)",
          }}
        />
      </div>

      {/* Profile header */}
      <div className="container" style={{ padding: "0 24px" }}>
        <div style={{ position: "relative", marginTop: -60, marginBottom: 32 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                alignItems: "flex-end",
              }}
            >
              {/* Avatar */}
              <div style={{ flexShrink: 0 }}>
                {professional.profilePhoto || professional.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={professional.profilePhoto || professional.user.image!}
                    alt={professional.user.name}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 20,
                      objectFit: "cover",
                      border: "3px solid rgba(255,255,255,0.1)",
                      background: "#0f1b3d",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 20,
                      background: "linear-gradient(135deg, rgba(37,99,235,0.4), rgba(96,165,250,0.3))",
                      border: "3px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                    }}
                  >
                    {professionIcon}
                  </div>
                )}
              </div>

              {/* Name & info */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <h1 style={{ color: "white", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>
                    {professional.user.name}
                  </h1>
                  {professional.verificationStatus === "APPROVED" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        borderRadius: 20,
                        padding: "3px 10px",
                      }}
                    >
                      <CheckCircle size={12} style={{ color: "#34D399" }} />
                      <span style={{ color: "#34D399", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>
                        PRC VERIFIED
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>{professionIcon}</span>
                  <span style={{ color: "#60A5FA", fontSize: 16, fontWeight: 600 }}>{professionLabel}</span>
                  {professional.specialization && (
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
                      · {professional.specialization}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
                  {professional.reviewCount > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <StarRating rating={professional.avgRating} size={14} />
                      <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: 14 }}>
                        {professional.avgRating.toFixed(1)}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                        ({professional.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                  {professional.city && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <MapPin size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                        {professional.city}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div>
                <Link
                  href={`/dashboard/hire/${professional.id}`}
                  id="hire-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "13px 28px",
                    borderRadius: 12,
                    background: "#2563EB",
                    color: "white",
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 700,
                    transition: "all 150ms ease",
                  }}
                >
                  <MessageSquare size={16} />
                  Hire Me
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {[
            { label: "Experience", value: `${professional.yearsExperience}y`, icon: <Briefcase size={16} /> },
            { label: "Projects", value: professional.completedProjects.toString(), icon: <Award size={16} /> },
            { label: "Reviews", value: professional.reviewCount.toString(), icon: <Star size={16} /> },
            { label: "Response", value: professional.responseRate > 0 ? `${Math.round(professional.responseRate)}%` : "—", icon: <Clock size={16} /> },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "16px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: 6, display: "flex", justifyContent: "center" }}>
                {stat.icon}
              </div>
              <div style={{ color: "white", fontSize: 22, fontWeight: 800 }}>{stat.value}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
          {(["about", "portfolio", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                background: activeTab === tab ? "rgba(37,99,235,0.15)" : "transparent",
                border: activeTab === tab ? "1px solid rgba(37,99,235,0.35)" : "1px solid transparent",
                color: activeTab === tab ? "#60A5FA" : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: activeTab === tab ? 700 : 500,
                textTransform: "capitalize",
                transition: "all 150ms ease",
              }}
            >
              {tab}
              {tab === "portfolio" && professional.portfolioItems.length > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: "rgba(37,99,235,0.3)",
                    color: "#93C5FD",
                    borderRadius: 10,
                    padding: "1px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {professional.portfolioItems.length}
                </span>
              )}
              {tab === "reviews" && professional.reviewCount > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: "rgba(37,99,235,0.3)",
                    color: "#93C5FD",
                    borderRadius: 10,
                    padding: "1px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {professional.reviewCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ paddingBottom: 80 }}>
          {/* About */}
          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr min(300px, 100%)",
                  gap: 24,
                  alignItems: "start",
                }}
                className="profile-grid"
              >
                <div>
                  <h2 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
                    About
                  </h2>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 16,
                      padding: 24,
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        fontSize: 15,
                        lineHeight: 1.8,
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {professional.aboutMe || "This professional hasn't written a bio yet."}
                    </p>
                  </div>
                </div>

                <div>
                  {/* Service Areas */}
                  {professional.serviceAreas.length > 0 && (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 16,
                      }}
                    >
                      <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 14px" }}>
                        Service Areas
                      </h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {professional.serviceAreas.map((area) => (
                          <span
                            key={area}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 20,
                              background: "rgba(37,99,235,0.1)",
                              border: "1px solid rgba(37,99,235,0.2)",
                              color: "#93C5FD",
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            <MapPin size={10} style={{ marginRight: 4 }} />
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 16,
                      overflow: "hidden",
                    }}
                  >
                    {[
                      { label: "Location", value: professional.city && professional.province ? `${professional.city}` : "—" },
                      { label: "Experience", value: `${professional.yearsExperience} year${professional.yearsExperience !== 1 ? "s" : ""}` },
                      { label: "Specialization", value: professional.specialization || "—" },
                    ].map((item, i) => (
                      <div
                        key={item.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "13px 20px",
                          borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        }}
                      >
                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>{item.label}</span>
                        <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <style>{`
                @media (max-width: 700px) {
                  .profile-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>
            </motion.div>
          )}

          {/* Portfolio */}
          {activeTab === "portfolio" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {professional.portfolioItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 24px" }}>
                  <Images size={40} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 16px", display: "block" }} />
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>No portfolio items yet.</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 16,
                  }}
                >
                  {professional.portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 16,
                        overflow: "hidden",
                      }}
                    >
                      {item.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          style={{ width: "100%", height: 180, objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            height: 180,
                            background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(96,165,250,0.08))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Images size={36} style={{ color: "rgba(255,255,255,0.15)" }} />
                        </div>
                      )}
                      <div style={{ padding: "16px 18px" }}>
                        <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>
                          {item.title}
                        </h3>
                        {item.description && (
                          <p
                            className="line-clamp-2"
                            style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.5 }}
                          >
                            {item.description}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: 12 }}>
                          {item.category && (
                            <span style={{ color: "#93C5FD", fontSize: 12, fontWeight: 500 }}>
                              {item.category}
                            </span>
                          )}
                          {item.projectLocation && (
                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                              <MapPin size={10} />
                              {item.projectLocation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {professional.reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 24px" }}>
                  <Star size={40} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 16px", display: "block" }} />
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>No reviews yet.</p>
                </div>
              ) : (
                <>
                  {/* Rating summary */}
                  {professional.reviewCount > 0 && (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 20,
                        display: "flex",
                        gap: 24,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "white", fontSize: 52, fontWeight: 900, lineHeight: 1 }}>
                          {professional.avgRating.toFixed(1)}
                        </div>
                        <StarRating rating={professional.avgRating} />
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "6px 0 0" }}>
                          {professional.reviewCount} review{professional.reviewCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reviews list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {professional.reviews.map((review) => (
                      <div
                        key={review.id}
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 14,
                          padding: "18px 20px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: "rgba(37,99,235,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                            }}
                          >
                            👤
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <StarRating rating={review.rating} size={13} />
                              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
                                {new Date(review.createdAt).toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
