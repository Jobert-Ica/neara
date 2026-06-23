import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { Plus, FolderOpen } from "lucide-react";
import ProjectsKanbanBoard from "@/components/dashboard/ProjectsKanbanBoard";

export const metadata: Metadata = { title: "My Projects" };



export default async function ProjectsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const projects = await prisma.project.findMany({
    where: { client: { userId: session.user.id } },
    include: {
      requests: {
        select: { id: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "32px 32px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ color: "white", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
            My Projects
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/dashboard/projects/new" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary">
            <Plus size={16} />
            Post a Project
          </button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <FolderOpen size={48} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 20px", display: "block" }} />
          <h3 style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>
            No projects yet
          </h3>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: "0 0 24px", maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
            Post your first project and start receiving quotes from verified professionals.
          </p>
          <Link href="/dashboard/projects/new" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary btn-lg">
              <Plus size={18} />
              Post Your First Project
            </button>
          </Link>
        </div>
      ) : (
        <ProjectsKanbanBoard projects={projects as any} />
      )}
    </div>
  );
}
