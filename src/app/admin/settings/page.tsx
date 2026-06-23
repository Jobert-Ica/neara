import { prisma } from "@/lib/prisma";
import CreditPackageClient from "./CreditPackageClient";

export default async function AdminSettingsPage() {
  const creditPackages = await prisma.creditPackage.findMany({
    orderBy: { sortOrder: "asc" }
  });

  const systemSettings = await prisma.systemSetting.findMany();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-slate-400 mt-2">Manage credit packages and global platform configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Credit Packages */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Credit Packages</h2>
          </div>
          
          <CreditPackageClient initialPackages={creditPackages} />
        </div>

        {/* Global Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Global Configurations</h2>
          
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-medium text-slate-300 mb-1">Maintenance Mode</h3>
              <p className="text-xs text-slate-500 mb-4">When enabled, the platform will be inaccessible to non-admin users.</p>
              <div className="flex items-center gap-3">
                <div className="relative inline-block w-12 h-6 rounded-full bg-slate-700 cursor-not-allowed">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
                </div>
                <span className="text-sm text-slate-400">(Coming soon)</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-medium text-slate-300 mb-1">Platform Commission Fee (%)</h3>
              <p className="text-xs text-slate-500 mb-4">Fee applied to transactions.</p>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  disabled 
                  defaultValue={0} 
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 w-24 cursor-not-allowed" 
                />
                <button disabled className="bg-blue-600/50 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
