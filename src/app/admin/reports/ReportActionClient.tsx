"use client";

import { useState } from "react";
import { updateReportStatus } from "./actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ReportActionClient({ report }: { report: any }) {
  const [loading, setLoading] = useState(false);

  if (report.status === "RESOLVED" || report.status === "DISMISSED") {
    return null; // Don't show actions for closed reports
  }

  const handleUpdate = async (status: "REVIEWED" | "RESOLVED" | "DISMISSED") => {
    try {
      setLoading(true);
      await updateReportStatus(report.id, status);
      toast.success(`Report marked as ${status.toLowerCase()}`);
    } catch (error) {
      toast.error("Failed to update report status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader2 size={16} className="animate-spin text-slate-500 inline-block" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:bg-slate-800 rounded-lg transition-colors outline-none">
        <MoreHorizontal size={16} className="text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-slate-900 border-slate-800 text-slate-200">
        <DropdownMenuItem 
          onClick={() => handleUpdate("REVIEWED")}
          className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-blue-400"
        >
          <AlertCircle size={14} className="mr-2" />
          Mark Reviewed
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleUpdate("RESOLVED")}
          className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-emerald-400"
        >
          <CheckCircle2 size={14} className="mr-2" />
          Mark Resolved
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleUpdate("DISMISSED")}
          className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-slate-400"
        >
          <XCircle size={14} className="mr-2" />
          Dismiss
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
