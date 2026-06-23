import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ProProfileFormClient from "./ProProfileFormClient";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      portfolioItems: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!profile) redirect("/professional-onboarding");

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "white", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px" }}>
          My Profile
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
          Manage your public presence, portfolio, and settings.
        </p>
      </div>

      <ProProfileFormClient profile={profile} user={session.user} />
    </div>
  );
}
