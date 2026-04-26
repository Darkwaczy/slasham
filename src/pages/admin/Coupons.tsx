import { Search, Ticket, CheckCircle2, XCircle, Clock, MoreHorizontal, RotateCcw, Ban } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { apiClient } from "../../api/client";
import AdminSkeleton from "../../components/AdminSkeleton";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient("/admin/vouchers");
      setCoupons(data);
    } catch (error) {
      console.error("Failed to load vouchers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = (c.voucher_code || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (c.users?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
        await apiClient(`/admin/vouchers/${id}/status`, {
            method: "POST",
            body: JSON.stringify({ status: newStatus })
        });
        loadData();
        setIsActionModalOpen(false);
    } catch (error: any) {
        alert("Status update failed: " + error.message);
    }
  };

  const handleOpenAudit = () => {
    // For demo, we'll map current vouchers into a "History" view
    const history = coupons.slice(0, 10).map(c => ({
       id: c.id,
       action: c.status === 'REDEEMED' ? 'Redemption Finalized' : 'Voucher Generated',
       user: c.users?.email || 'System Account',
       time: new Date(c.updated_at || c.created_at).toLocaleString(),
       type: c.status
    }));
    setAuditLogs(history);
    setIsAuditModalOpen(true);
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Voucher Ledger</h1>
          <p className="text-slate-500 font-medium">Track and audit every generated discount code</p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={handleOpenAudit}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/10 hover:scale-105 transition-all active:scale-95"
            >
                Audit History
            </button>
        </div>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Total Generated", 
            count: coupons.length.toLocaleString(), 
            pct: "100%",
            icon: Ticket,
            bgClass: "bg-indigo-50", borderClass: "border-indigo-100", 
            textClass: "text-indigo-700", labelClass: "text-indigo-500", subClass: "text-indigo-600/70",
            iconBg: "bg-white/60", iconColor: "text-indigo-600"
          },
          { 
            label: "Total Redeemed", 
            count: coupons.filter(c => c.status === 'REDEEMED').length.toLocaleString(), 
            pct: coupons.length > 0 ? `${((coupons.filter(c => c.status === 'REDEEMED').length / coupons.length) * 100).toFixed(1)}%` : "0%",
            icon: CheckCircle2,
            bgClass: "bg-emerald-50", borderClass: "border-emerald-100", 
            textClass: "text-emerald-700", labelClass: "text-emerald-500", subClass: "text-emerald-600/70",
            iconBg: "bg-white/60", iconColor: "text-emerald-600"
          },
          { 
            label: "Currently Active", 
            count: coupons.filter(c => c.status === 'ACTIVE').length.toLocaleString(), 
            pct: coupons.length > 0 ? `${((coupons.filter(c => c.status === 'ACTIVE').length / coupons.length) * 100).toFixed(1)}%` : "0%",
            icon: Clock,
            bgClass: "bg-amber-50", borderClass: "border-amber-100", 
            textClass: "text-amber-700", labelClass: "text-amber-500", subClass: "text-amber-600/70",
            iconBg: "bg-white/60", iconColor: "text-amber-600"
          },
          { 
            label: "Expired/Revoked", 
            count: coupons.filter(c => c.status === 'EXPIRED' || c.status === 'CANCELLED').length.toLocaleString(), 
            pct: coupons.length > 0 ? `${((coupons.filter(c => c.status === 'EXPIRED' || c.status === 'CANCELLED').length / coupons.length) * 100).toFixed(1)}%` : "0%",
            icon: Ban,
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
                <p className={`text-xs font-bold ${stat.subClass} mb-1.5`}>{stat.pct}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search code or user email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none hover:bg-slate-50"
             >
                <option value="All">All Vouchers</option>
                <option value="Active">Active Only</option>
                <option value="Redeemed">Redeemed Only</option>
                <option value="Expired">Expired Only</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Voucher Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Outlet</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Benefit</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ledger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredCoupons.map((c, idx) => (
                  <motion.tr 
                    key={c.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => {
                        setSelectedCoupon(c);
                        setIsActionModalOpen(true);
                    }}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            c.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600' :
                            c.status === 'REDEEMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                            <Ticket size={16} />
                        </div>
                        <span className="font-black text-slate-900 font-mono tracking-tighter">
                          {c.voucher_code}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{c.users?.email || 'N/A'}</span>
                            <span className="text-[10px] text-slate-400 font-bold leading-none">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-700">{c.deals?.merchants?.business_name || 'N/A'}</td>
                    <td className="px-8 py-5">
                      <span className="text-[10pt] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-tight">
                         {c.deals?.title || 'Coupon Benefit'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 group/btn">
                        <span className={`flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                        c.status === 'REDEEMED' ? 'text-emerald-500' : 
                        c.status === 'ACTIVE' ? 'text-indigo-500' : 'text-rose-500'
                        }`}>
                        {c.status === 'REDEEMED' && <CheckCircle2 size={12} />}
                        {c.status === 'ACTIVE' && <Clock size={12} />}
                        {c.status === 'EXPIRED' && <XCircle size={12} />}
                        {c.status}
                        </span>
                        <div className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 group-hover/btn:text-slate-600 transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={14} />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

       {/* Audit/Action Modal */}
       <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Voucher Details"
        description={selectedCoupon ? `Audit Trail for ${selectedCoupon.code}` : ""}
      >
        <div className="space-y-6 pt-4">
             <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                     <Ticket size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{selectedCoupon?.code}</h3>
                 <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">{selectedCoupon?.value} BENEFIT</p>
                 <div className="flex gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                     <span>ID: {selectedCoupon?.id}</span>
                     <span>•</span>
                     <span>Status: {selectedCoupon?.status}</span>
                 </div>
             </div>

             <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Administrative Actions</p>
                 <div className="grid grid-cols-1 gap-2">
                    {selectedCoupon?.status === 'Active' && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedCoupon.id, 'Redeemed')}
                            className="w-full flex items-center gap-4 px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-100 transition-all border border-emerald-100/50"
                        >
                            <CheckCircle2 size={20} /> Force Manual Redemption
                        </button>
                    )}
                    {selectedCoupon?.status !== 'Expired' && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedCoupon.id, 'Expired')}
                            className="w-full flex items-center gap-4 px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all border border-rose-100/50"
                        >
                            <Ban size={20} /> Revoke & Nullify Code
                        </button>
                    )}
                    <button className="w-full flex items-center gap-4 px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100/50">
                        <RotateCcw size={20} /> Reset Redemption Limit
                    </button>
                 </div>
             </div>
        </div>
      </AdminModal>

      {/* Global Audit Modal */}
      <AdminModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title="Voucher Audit Trail"
        description="Chronological log of all ledger activities and state changes."
      >
        <div className="space-y-6 pt-6 mb-8 max-h-[60vh] overflow-y-auto px-2">
            {auditLogs.map((log, i) => (
                <div key={i} className="flex gap-4 relative pb-6 last:pb-0">
                    {i !== auditLogs.length - 1 && <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100" />}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        log.type === 'REDEEMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                        <Ticket size={18} />
                    </div>
                    <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-black text-slate-900 leading-none">{log.action}</p>
                            <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">Action performed by <span className="text-indigo-600 font-bold">{log.user}</span></p>
                    </div>
                </div>
            ))}
        </div>
      </AdminModal>
    </div>
  );
}
