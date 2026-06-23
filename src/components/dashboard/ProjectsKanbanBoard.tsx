"use client";

import React from "react";
import Link from "next/link";
import { Project, ProjectStatus } from "@prisma/client";
import { ArrowRight, Clock, CheckCircle, FileText, Eye, Handshake } from "lucide-react";

type ProjectWithRequests = Project & {
  requests: { id: string; status: string }[];
};

const COLUMNS: { id: ProjectStatus; label: string; color: string; bg: string; icon: React.ReactNode }[] = [
  { id: "DRAFT", label: "Draft", color: "#94A3B8", bg: "rgba(100,116,139,0.12)", icon: <FileText size={14} /> },
  { id: "OPEN", label: "Open", color: "#60A5FA", bg: "rgba(37,99,235,0.12)", icon: <Eye size={14} /> },
  { id: "IN_REVIEW", label: "In Review", color: "#FCD34D", bg: "rgba(245,158,11,0.12)", icon: <Clock size={14} /> },
  { id: "MATCHED", label: "Matched", color: "#34D399", bg: "rgba(16,185,129,0.12)", icon: <Handshake size={14} /> },
  { id: "CLOSED", label: "Completed", color: "#64748B", bg: "rgba(100,116,139,0.08)", icon: <CheckCircle size={14} /> },
];

export default function ProjectsKanbanBoard({ projects }: { projects: ProjectWithRequests[] }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        overflowX: "auto",
        paddingBottom: 24,
        minHeight: "60vh",
      }}
    >
      {COLUMNS.map((column) => {
        const columnProjects = projects.filter((p) => p.status === column.id);

        return (
          <div
            key={column.id}
            style={{
              flex: "0 0 320px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: column.color, fontWeight: 700 }}>
                {column.icon}
                {column.label}
              </div>
              <div
                style={{
                  background: column.bg,
                  color: column.color,
                  padding: "2px 8px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {columnProjects.length}
              </div>
            </div>

            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, flex: 1, overflowY: "auto" }}>
              {columnProjects.map((project) => {
                const requestCount = project.requests.length;
                const pendingCount = project.requests.filter((r) => r.status === "PENDING").length;

                return (
                  <Link key={project.id} href={`/dashboard/projects/${project.id}`} style={{ textDecoration: "none" }}>
                    <div
                      className="kanban-card"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 12,
                        padding: 16,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <h4 style={{ color: "white", fontSize: 14, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 }}>
                        {project.title}
                      </h4>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 12,
                          margin: "0 0 12px",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {project.description}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{requestCount} requests</span>
                          {pendingCount > 0 && <span style={{ color: "#FCD34D", fontWeight: 600 }}>{pendingCount} pending</span>}
                        </div>
                        <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                      </div>
                    </div>
                  </Link>
                );
              })}

              {columnProjects.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)" }}>
                  <p style={{ fontSize: 13, margin: 0 }}>No projects</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        .kanban-card:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.15) !important;
          transform: translateY(-2px);
        }
        /* Custom scrollbar for Kanban board */
        ::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
