import { Search, Ticket, CheckCircle2, XCircle, Clock, MoreHorizontal, RotateCcw, Ban } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import AdminModal from "../../components/AdminModal";

const INITIAL_COUPONS = [
  { id: "C-9901", code: "SLASH50", user: "john@example.com", merchant: "Pizza Hut", status: "Active", value: "50% Off", createdAt: "10 mins ago" },
  { id: "C-9902", code: "SPA2026", user: "sarah.s@gmail.com", merchant: "Oasis Spa", status: "Redeemed", value: "₦5,000", createdAt: "1 hour ago" },
  { id: "C-9903", code: "GRILLFREE", user: "mike.j@outlook.com", merchant: "Lagos Grill", status: "Expired", value: "Free Drink", createdAt: "2 days ago" },
  { id: "C-9904", code: "MOVIEPASS", user: "emily.b@slasham.com", merchant: "Skyline", status: "Active", value: "Buy 1 Get 1", createdAt: "3 hours ago" },
  { id: "C-9905", code: "GYMFIT", user: "alex.w@yahoo.com", merchant: "Urban Fit", status: "Redeemed", value: "1 Month Free", createdAt: "5 hours ago" },
];

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    setIsActionModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Voucher Ledger</h1>
          <p className="text-slate-500 font-medium">Track and audit every generated discount code</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:scale-105 transition-all">
                Audit History
            </button>
        </div>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Generated", count: "12,402", color: "indigo", pct: "100%" },
          { label: "Total Redeemed", count: "8,291", color: "emerald", pct: "66.8%" },
          { label: "Currently Active", count: "3,111", color: "blue", pct: "25.1%" },
          { label: "Expired/Revoked", count: "1,000", color: "rose", pct: "8.1%" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
                <p className="text-2xl font-black text-slate-900 mb-1">{stat.count}</p>
                <p className="text-xs font-bold text-slate-400 mb-2">{stat.pct}</p>
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
                            c.status === 'Active' ? 'bg-indigo-50 text-indigo-600' :
                            c.status === 'Redeemed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                            <Ticket size={16} />
                        </div>
                        <span className="font-black text-slate-900 font-mono tracking-tighter">
                          {c.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{c.user}</span>
                            <span className="text-[10px] text-slate-400 font-bold leading-none">{c.createdAt}</span>
                        </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-700">{c.merchant}</td>
                    <td className="px-8 py-5">
                      <span className="text-[10pt] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-tight">
                         {c.value}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 group/btn">
                        <span className={`flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                        c.status === 'Redeemed' ? 'text-emerald-500' : 
                        c.status === 'Active' ? 'text-indigo-500' : 'text-rose-500'
                        }`}>
                        {c.status === 'Redeemed' && <CheckCircle2 size={12} />}
                        {c.status === 'Active' && <Clock size={12} />}
                        {c.status === 'Expired' && <XCircle size={12} />}
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
             <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
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
    </div>
  );
}
