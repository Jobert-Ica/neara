"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Briefcase,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
} from "lucide-react";
import { PROVINCES } from "@/lib/ph-locations";
import { motion, AnimatePresence } from "framer-motion";

const PROFESSIONS = [
  { value: "", label: "All Professions" },
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

const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "projects", label: "Most Projects" },
  { value: "newest", label: "Newest" },
];

interface Professional {
  id: string;
  profession: string;
  specialization?: string;
  yearsExperience: number;
  province?: string;
  city?: string;
  totalRating: number;
  reviewCount: number;
  completedProjects: number;
  verificationStatus: string;
  profilePhoto?: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

const professionLabel = (val: string) =>
  PROFESSIONS.find((p) => p.value === val)?.label || val.replace(/_/g, " ");

const professionIcon = (val: string) =>
  PROFESSIONS.find((p) => p.value === val)?.icon || "👤";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            style={{
              color: star <= Math.round(rating) ? "#F59E0B" : "rgba(255,255,255,0.15)",
              fill: star <= Math.round(rating) ? "#F59E0B" : "none",
            }}
          />
        ))}
      </div>
      <span style={{ color: "#F59E0B", fontSize: 13, fontWeight: 600 }}>
        {rating > 0 ? rating.toFixed(1) : "New"}
      </span>
      {count > 0 && (
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          ({count})
        </span>
      )}
    </div>
  );
}

function ProfessionalCard({ professional }: { professional: Professional }) {
  const avgRating = professional.reviewCount > 0
    ? professional.totalRating / professional.reviewCount
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        href={`/professionals/${professional.id}`}
        style={{ textDecoration: "none" }}
      >
        <div
          className="card card-hover"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 250ms ease",
          }}
        >
          {/* Top accent */}
          <div
            style={{
              height: 3,
              background: "linear-gradient(90deg, #2563EB, #60A5FA)",
              opacity: 0.7,
            }}
          />
          <div style={{ padding: 20 }}>
            {/* Header */}
            <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              {/* Avatar */}
              <div style={{ flexShrink: 0 }}>
                {professional.profilePhoto || professional.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={professional.profilePhoto || professional.user.image}
                    alt={professional.user.name}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      objectFit: "cover",
                      border: "2px solid rgba(255,255,255,0.08)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(96,165,250,0.2))",
                      border: "2px solid rgba(37,99,235,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    {professionIcon(professional.profession)}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <h3
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: 15,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {professional.user.name}
                  </h3>
                  {professional.verificationStatus === "APPROVED" && (
                    <CheckCircle size={14} style={{ color: "#34D399", flexShrink: 0 }} />
                  )}
                </div>
                <p style={{ color: "#60A5FA", fontSize: 13, fontWeight: 500, margin: "0 0 6px" }}>
                  {professionIcon(professional.profession)}{" "}
                  {professionLabel(professional.profession)}
                </p>
                <StarRating rating={avgRating} count={professional.reviewCount} />
              </div>
            </div>

            {/* Specialization */}
            {professional.specialization && (
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  marginBottom: 12,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {professional.specialization}
              </p>
            )}

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: 16,
                paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Briefcase size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  {professional.yearsExperience}y exp
                </span>
              </div>
              {professional.city && (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <span
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 12,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 100,
                    }}
                  >
                    {professional.city}
                  </span>
                </div>
              )}
              {professional.completedProjects > 0 && (
                <div style={{ marginLeft: "auto" }}>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                    {professional.completedProjects} projects
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BrowsePage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [profession, setProfession] = useState("");
  const [province, setProvince] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);

  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (profession) params.set("profession", profession);
      if (province) params.set("province", province);
      if (search) params.set("city", search);
      params.set("sortBy", sortBy);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/professionals?${params}`);
      const data = await res.json();
      setProfessionals(data.professionals || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch {
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  }, [profession, province, sortBy, page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchProfessionals, 300);
    return () => clearTimeout(timer);
  }, [fetchProfessionals]);

  const clearFilters = () => {
    setProfession("");
    setProvince("");
    setSearch("");
    setSortBy("rating");
    setPage(1);
  };

  const hasFilters = profession || province || search;

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          background: "#060d1f",
          paddingTop: 80,
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 70%)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "48px 0 32px",
          }}
        >
          <div className="container">
            <h1
              style={{
                color: "white",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 900,
                letterSpacing: "-1px",
                margin: "0 0 12px",
              }}
            >
              Find Professionals
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, margin: "0 0 28px" }}>
              Browse {total > 0 ? `${total}+` : ""} verified architects, engineers, contractors & designers
            </p>

            {/* Search bar */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "1 1 300px" }}>
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
                  id="browse-search"
                  type="text"
                  placeholder="Search by city or area..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{
                    width: "100%",
                    height: 48,
                    paddingLeft: 44,
                    paddingRight: 16,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 15,
                    color: "white",
                    outline: "none",
                  }}
                />
              </div>
              <button
                id="browse-filters-btn"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 20px",
                  height: 48,
                  borderRadius: 12,
                  background: showFilters ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.05)",
                  border: showFilters ? "1px solid rgba(37,99,235,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  color: showFilters ? "#60A5FA" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasFilters && (
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#2563EB",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {[profession, province].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Filters panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      marginTop: 16,
                      padding: 16,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 14,
                    }}
                  >
                    <select
                      id="browse-profession-filter"
                      className="select"
                      value={profession}
                      onChange={(e) => { setProfession(e.target.value); setPage(1); }}
                      style={{
                        flex: "1 1 200px",
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: profession ? "white" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {PROFESSIONS.map((p) => (
                        <option key={p.value} value={p.value} style={{ background: "#0f1b3d" }}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <select
                      id="browse-province-filter"
                      className="select"
                      value={province}
                      onChange={(e) => { setProvince(e.target.value); setPage(1); }}
                      style={{
                        flex: "1 1 200px",
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: province ? "white" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      <option value="">All Provinces</option>
                      {PROVINCES.map((p) => (
                        <option key={p.code} value={p.code} style={{ background: "#0f1b3d" }}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <select
                      id="browse-sort-filter"
                      className="select"
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                      style={{
                        flex: "1 1 180px",
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "white",
                      }}
                    >
                      {SORT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value} style={{ background: "#0f1b3d" }}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "0 16px",
                          height: 44,
                          borderRadius: 10,
                          background: "rgba(244,63,94,0.1)",
                          border: "1px solid rgba(244,63,94,0.2)",
                          color: "#F87171",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <X size={14} />
                        Clear
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Profession quick-filter chips */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "16px 0",
            overflowX: "auto",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", gap: 8, flexWrap: "nowrap", minWidth: "max-content" }}
          >
            {PROFESSIONS.map((p) => (
              <button
                key={p.value}
                id={`chip-${p.value || "all"}`}
                onClick={() => { setProfession(p.value); setPage(1); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 20,
                  background:
                    profession === p.value
                      ? "rgba(37,99,235,0.2)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    profession === p.value
                      ? "1px solid rgba(37,99,235,0.5)"
                      : "1px solid rgba(255,255,255,0.07)",
                  color:
                    profession === p.value
                      ? "#60A5FA"
                      : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: profession === p.value ? 700 : 500,
                  whiteSpace: "nowrap",
                  transition: "all 150ms ease",
                }}
              >
                {p.icon && <span>{p.icon}</span>}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="container" style={{ padding: "32px 24px" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <Loader2 size={32} style={{ color: "#2563EB", animation: "spin 1s linear infinite" }} />
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Finding professionals...</p>
            </div>
          ) : professionals.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: 32,
                }}
              >
                <User size={32} style={{ color: "rgba(255,255,255,0.2)" }} />
              </div>
              <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
                No professionals found
              </h3>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, margin: "0 0 20px" }}>
                Try adjusting your filters or search terms.
              </p>
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                  Showing {((page - 1) * 12) + 1}–{Math.min(page * 12, total)} of {total} professionals
                </p>
                <select
                  className="select"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  style={{
                    width: "auto",
                    height: 36,
                    padding: "0 32px 0 12px",
                    fontSize: 13,
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value} style={{ background: "#0f1b3d" }}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {professionals.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 40,
                  }}
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 16px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: page === pageNum ? "#2563EB" : "rgba(255,255,255,0.04)",
                          border: page === pageNum ? "none" : "1px solid rgba(255,255,255,0.08)",
                          color: page === pageNum ? "white" : "rgba(255,255,255,0.5)",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: page === pageNum ? 700 : 500,
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 16px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
