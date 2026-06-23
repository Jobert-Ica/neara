import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ReportActionClient from "./ReportActionClient";

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: true,
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Reports & Analytics</h1>
        <p className="text-slate-400 mt-2">Manage user reports and platform issues.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Reporter</th>
                <th className="px-6 py-4 font-medium">Target</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(report.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 truncate max-w-[150px]">
                    {report.reporter.name}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{report.targetType}</Badge>
                    <span className="text-xs text-slate-500 block mt-1 truncate max-w-[100px]">{report.targetId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-300">{report.reason}</div>
                    {report.details && (
                      <div className="text-xs text-slate-500 truncate max-w-[200px] mt-1">{report.details}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      report.status === "OPEN" ? "destructive" :
                      report.status === "RESOLVED" ? "default" : "secondary"
                    }>
                      {report.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ReportActionClient report={report} />
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No reports found. Great job!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
