"use client";

import { useState } from "react";
import { format } from "date-fns";
import { approveProfessional, rejectProfessional } from "./actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, FileText, ExternalLink } from "lucide-react";

export default function VerificationClient({ profile }: { profile: any }) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await approveProfessional(profile.id);
      toast.success("Professional approved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve professional");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    try {
      setIsRejecting(true);
      await rejectProfessional(profile.id, rejectReason);
      toast.success("Professional rejected.");
      setShowRejectInput(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to reject professional");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        
        {/* Profile Info */}
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden">
            {profile.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profilePhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                {profile.user.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{profile.user.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
              <Badge variant="outline">{profile.profession}</Badge>
              {profile.specialization && <span className="text-sm text-slate-400">• {profile.specialization}</span>}
            </div>
            <div className="text-sm text-slate-400 space-y-1">
              <p>Email: <span className="text-slate-300">{profile.user.email}</span></p>
              <p>Location: <span className="text-slate-300">{profile.city}, {profile.province}</span></p>
              <p>Experience: <span className="text-slate-300">{profile.yearsExperience} years</span></p>
              {profile.prcLicenseNumber && (
                <p>PRC License: <span className="text-slate-300 font-mono">{profile.prcLicenseNumber}</span></p>
              )}
              <p>Applied: <span className="text-slate-300">{format(new Date(profile.createdAt), "MMM d, yyyy")}</span></p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          {!showRejectInput ? (
            <>
              <button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isApproving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Approve
              </button>
              <button
                onClick={() => setShowRejectInput(true)}
                disabled={isApproving || isRejecting}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-red-400 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <X size={18} />
                Reject
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white min-h-[80px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRejecting ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      {profile.documents && profile.documents.length > 0 && (
        <div className="mt-6 border-t border-slate-800 pt-6">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Uploaded Documents</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.documents.map((doc: any) => (
              <a
                key={doc.id}
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-blue-500/50 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.type}</p>
                  <p className="text-xs text-slate-500 truncate">{doc.fileName || "View Document"}</p>
                </div>
                <ExternalLink size={16} className="text-slate-600 group-hover:text-blue-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
