import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import VerificationClient from "./VerificationClient";

export default async function AdminVerificationsPage() {
  const pendingProfiles = await prisma.professionalProfile.findMany({
    where: { verificationStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: true,
      documents: true,
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Verifications</h1>
        <p className="text-slate-400 mt-2">Review and approve professional applications.</p>
      </div>

      {pendingProfiles.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h2 className="text-xl font-bold text-white mb-2">All Caught Up!</h2>
          <p className="text-slate-400">There are no pending verifications to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingProfiles.map((profile) => (
            <VerificationClient key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
