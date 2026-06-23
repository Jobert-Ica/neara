import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import ProDashboardLayoutClient from "./ProDashboardLayoutClient";

export default async function ProDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/pro-dashboard");
  }

  // Check if professional onboarding is complete
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    select: { onboardingComplete: true, verificationStatus: true, creditBalance: true },
  });

  if (!profile?.onboardingComplete) {
    redirect("/professional-onboarding");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    creditBalance: profile.creditBalance,
    verificationStatus: profile.verificationStatus,
  };

  return <ProDashboardLayoutClient user={user}>{children}</ProDashboardLayoutClient>;
}
