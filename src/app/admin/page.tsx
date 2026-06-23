import { prisma } from "@/lib/prisma";
import { Users, CheckSquare, Briefcase, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    pendingVerifications,
    activeProjects,
    paymentsAgg
  ] = await Promise.all([
    prisma.user.count(),
    prisma.professionalProfile.count({
      where: { verificationStatus: "PENDING" }
    }),
    prisma.project.count({
      where: { status: { in: ["OPEN", "IN_REVIEW", "MATCHED"] } }
    }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true }
    })
  ]);

  const totalRevenue = paymentsAgg._sum.amount || 0;

  const stats = [
    {
      name: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Pending Verifications",
      value: pendingVerifications.toLocaleString(),
      icon: CheckSquare,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      name: "Active Projects",
      value: activeProjects.toLocaleString(),
      icon: Briefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      name: "Total Revenue",
      value: `₱${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Welcome to the NEARA Admin Control Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholders for future charts or recent activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 h-96 flex items-center justify-center">
          <p className="text-slate-500">Revenue Chart (Coming Soon)</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-96 flex items-center justify-center">
          <p className="text-slate-500">Recent Activity (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}
