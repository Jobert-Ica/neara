"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

// Redirects /profile to the correct dashboard based on role
export default function ProfileRedirect() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/sign-in");
      } else if ((session.user as any)?.role === "PROFESSIONAL") {
        router.replace("/pro-dashboard/profile");
      } else if ((session.user as any)?.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard/profile"); // Client profile
      }
    }
  }, [session, isPending, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060d1f", color: "white" }}>
      <p>Redirecting to your profile...</p>
    </div>
  );
}
