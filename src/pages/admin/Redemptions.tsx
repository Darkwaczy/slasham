import { Search, CheckCircle, Clock, ShieldAlert, ArrowDownToLine, Trash2, ShieldCheck, Flag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { apiClient } from "../../api/client";
import { AdminSkeleton } from "../../components/AdminSkeleton";

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedR, setSelectedR] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // ✅ Fix - only count VERIFIED/REDEEMED
const totalVolume = redemptions
  .filter(r => r.status === 'VERIFIED' || r.status === 'REDEEMED')
  .reduce((acc, r) => acc + (r.deals?.discount_price || 0), 0);

  const handleExportAudit = () => {
    if (redemptions.length === 0) return alert("No data to export");
    
    const headers = ["ID", "User", "Merchant", "Deal", "Price", "Status", "Date"];
    const rows = redemptions.map(r => [
      r.id,
      r.users?.name || "Anonymous",
      r.deals?.merchants?.business_name || "N/A",
      r.deals?.title || "N/A",
      r.deals?.discount_price || 0,
      r.status,
      new Date(r.redeemed_at).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `slasham_redemptions_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient("/admin/redemptions");
      setRedemptions(data);
    } catch (error) {
      console.error("Failed to load redemptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRedemptions = redemptions.filter(r => {
    const matchesSearch = (r.users?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (r.deals?.merchants?.business_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (_id: string, _newStatus: string) => {
    setIsActionModalOpen(false);
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Redemption Logs</h1>
          <p className="text-slate-500 font-medium">Coordinate and verify all merchant-to-customer transactions</p>
        </div>
        <button 
          onClick={handleExportAudit}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
        >
           <ArrowDownToLine size={18} /> Export Full Audit
        </button>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { 
            label: "Today's Volume", count: `₦${totalVolume.toLocaleString()}`, trend: "Live Data",
            icon: CheckCircle,
            bgClass: "bg-emerald-50", borderClass: "border-emerald-100", 
            textClass: "text-emerald-700", labelClass: "text-emerald-500", subClass: "text-emerald-600/70",
            iconBg: "bg-white/60", iconColor: "text-emerald-600"
          },
          { 
            label: "Pending Verification", count: redemptions.filter(r => r.status === 'ACTIVE').length, trend: "High Attention",
            icon: Clock,
            bgClass: "bg-amber-50", borderClass: "border-amber-100", 
            textClass: "text-amber-700", labelClass: "text-amber-500", subClass: "text-amber-600/70",
            iconBg: "bg-white/60", iconColor: "text-amber-600"
          },
          { 
            label: "Flagged Transactions", count: redemptions.filter(r => r.status === 'Flagged').length, trend: "Review Required",
            icon: ShieldAlert,
            bgClass: "bg-rose-50", borderClass: "border-rose-100", 
            textClass: "text-rose-700", labelClass: "text-rose-500", subClass: "text-rose-600/70",
            iconBg: "bg-white/60", iconColor: "text-rose-600"
          },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-4xl border ${stat.bgClass} ${stat.borderClass} shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
            <div className="flex justify-between items-start mb-4">
              <p className={`text-[10px] font-black uppercase tracking-widest ${stat.labelClass}`}>{stat.label}</p>
              <div className={`w-10 h-10 rounded-2xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor} shadow-sm backdrop-blur-sm`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="flex items-end gap-2">
                <p className={`text-4xl font-black ${stat.textClass} tracking-tight mb-0`}>{stat.count}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${stat.subClass} mb-1.5`}>{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80 text-left">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by user or merchant..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all outline-none"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none hover:bg-slate-50 appearance-none min-w-[160px]"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Only</option>
            <option value="Flagged">Flagged Only</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant / Redemption</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Gross Value</th>
                <th className="px-8 py-5 text-[10px) font-black uppercase tracking-widest text-slate-400">Time</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ledger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-nowrap">
              <AnimatePresence mode="popLayout">
                {filteredRedemptions.map((r, idx) => (
                  <motion.tr 
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => {
                        setSelectedR(r);
                        setIsActionModalOpen(true);
                    }}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {(r.users?.name || "U").charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{r.users?.name || "Anonymous User"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700">{r.deals?.merchants?.business_name || "N/A"}</span>
                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.05em]">{r.deals?.title || "Campaign"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                        <span className="text-sm font-black text-slate-900">₦{r.deals?.discount_price?.toLocaleString() || "0"}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-400">{new Date(r.redeemed_at).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        r.status === 'REDEEMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 
                        r.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100/50' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {r.status === 'REDEEMED' && <CheckCircle size={10} />}
                        {r.status === 'PENDING' && <Clock size={10} />}
                        {r.status === 'FLAGGED' && <ShieldAlert size={10} />}
                        {r.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredRedemptions.length === 0 && (
            <div className="py-20 text-center">
               <ShieldAlert size={48} className="text-slate-100 mx-auto mb-4" />
               <p className="text-slate-500 font-bold">No redemptions found in current partition</p>
            </div>
          )}
        </div>
      </div>

       {/* Audit/Action Modal */}
       <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Redemption Evidence"
        description={selectedR ? `ID: ${selectedR.id} Ledger Entry` : ""}
      >
        <div className="space-y-6 pt-4">
             <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-2xl">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
                     <CheckCircle size={36} className={selectedR?.status === 'VERIFIED' ? 'animate-pulse' : ''} />
                 </div>
                 <h3 className="text-3xl font-black tracking-tighter mb-2">₦{selectedR?.deals?.discount_price?.toLocaleString() || '0'} • {selectedR?.status}</h3>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedR?.deals?.merchants?.business_name || 'N/A'} • {selectedR?.deals?.title || 'N/A'}
</p>
                 <div className="mt-8 grid grid-cols-2 gap-8 w-full border-t border-white/5 pt-8 text-left">
                     <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Customer</p>
                         <p className="text-sm font-bold">{selectedR?.users?.name || selectedR?.users?.email || 'Anonymous'}</p>
                     </div>
                     <div className="text-right">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Time Captured</p>
                         <p className="text-sm font-bold">{selectedR?.redeemed_at 
  ? new Date(selectedR.redeemed_at).toLocaleString() 
  : new Date(selectedR?.created_at).toLocaleString()}</p>
                     </div>
                 </div>
             </div>

             <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Verification Controls</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedR?.status !== 'VERIFIED' && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedR.id, 'VERIFIED')}
                            className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-500/20 transition-all"
                        >
                            <ShieldCheck size={20} /> Approve Transaction
                        </button>
                    )}
                    {selectedR?.status !== 'Flagged' && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedR.id, 'Flagged')}
                            className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all border border-rose-100"
                        >
                            <Flag size={20} /> Flag for Fraud Review
                        </button>
                    )}
                    <button className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all col-span-1 sm:col-span-2">
                        <Trash2 size={20} /> Force Delete Logs
                    </button>
                 </div>
             </div>
        </div>
      </AdminModal>
    </div>
  );
}
