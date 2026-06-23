import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function AdminFinancesPage() {
  const [payments, transactions] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        professional: {
          include: { user: true }
        },
        creditPackage: true,
      }
    }),
    prisma.creditTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        professional: {
          include: { user: true }
        }
      }
    })
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Financial Management</h1>
        <p className="text-slate-400 mt-2">Monitor payments, credit purchases, and system transactions.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Payments Table */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Payments</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {format(new Date(payment.createdAt), "MMM d, HH:mm")}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[150px]">
                        {payment.professional.user.name}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          payment.status === "PAID" ? "default" :
                            payment.status === "FAILED" ? "destructive" : "secondary"
                        }>
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Credit Transactions Table */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Credit Ledger</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {format(new Date(tx.createdAt), "MMM d, HH:mm")}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[150px]">
                        {tx.professional.user.name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={
                          tx.type === "PURCHASE" ? "border-emerald-500/30 text-emerald-400" :
                            tx.type === "DEDUCTION" ? "border-amber-500/30 text-amber-400" : ""
                        }>
                          {tx.type}
                        </Badge>
                      </td>
                      <td className={`px-4 py-3 font-medium text-right ${tx.amount > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
