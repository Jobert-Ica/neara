"use client";

import { useState } from "react";
import { createCreditPackage, toggleCreditPackageStatus } from "./actions";
import { toast } from "sonner";
import { Plus, Loader2, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function CreditPackageClient({ initialPackages }: { initialPackages: any[] }) {
  const [packages, setPackages] = useState(initialPackages);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    credits: "",
    pricePhp: "",
  });

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      setLoadingId(id);
      await toggleCreditPackageStatus(id, !currentStatus);
      setPackages(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
      toast.success("Package status updated");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.credits || !formData.pricePhp) return;

    try {
      setIsCreating(true);
      await createCreditPackage({
        name: formData.name,
        credits: parseInt(formData.credits),
        pricePhp: parseFloat(formData.pricePhp),
      });
      toast.success("Package created successfully. Please refresh to see changes.");
      setFormData({ name: "", credits: "", pricePhp: "" });
    } catch (error) {
      toast.error("Failed to create package");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Existing Packages */}
      <div className="space-y-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{pkg.name}</h3>
                <p className="text-sm text-slate-400">{pkg.credits} Credits — ₱{pkg.pricePhp.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {loadingId === pkg.id && <Loader2 size={16} className="animate-spin text-slate-500" />}
              <Switch 
                checked={pkg.isActive} 
                onCheckedChange={() => handleToggle(pkg.id, pkg.isActive)}
                disabled={loadingId === pkg.id}
              />
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <p className="text-sm text-slate-500 italic">No credit packages defined.</p>
        )}
      </div>

      {/* Add New Package */}
      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Add New Package</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Package Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" 
              placeholder="e.g. Starter Pack" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Credits Amount</label>
              <input 
                type="number" 
                required
                value={formData.credits}
                onChange={e => setFormData({ ...formData, credits: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" 
                placeholder="100" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Price (PHP)</label>
              <input 
                type="number" 
                required
                step="0.01"
                value={formData.pricePhp}
                onChange={e => setFormData({ ...formData, pricePhp: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" 
                placeholder="499.00" 
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isCreating}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Create Package
          </button>
        </form>
      </div>

    </div>
  );
}
