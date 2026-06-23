import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import DashboardLayoutClient from "@/app/dashboard/DashboardLayoutClient";
import ProDashboardLayoutClient from "@/app/pro-dashboard/ProDashboardLayoutClient";

export default async function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const role = session.user.role;

  if (role === "PROFESSIONAL") {
    const profile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
      select: { creditBalance: true, verificationStatus: true },
    });
    
    if (!profile) redirect("/professional-onboarding");

    const proUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      creditBalance: profile.creditBalance,
      verificationStatus: profile.verificationStatus,
    };

    return <ProDashboardLayoutClient user={proUser}>{children}</ProDashboardLayoutClient>;
  }

  if (role === "CLIENT") {
    const clientUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
    return <DashboardLayoutClient user={clientUser}>{children}</DashboardLayoutClient>;
  }

  // Fallback for Admin or unknown roles
  return <div style={{ minHeight: "100vh", background: "#060d1f" }}>{children}</div>;
}
