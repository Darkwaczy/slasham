import { Search, Clock, ShieldAlert, MessageCircle, AlertTriangle, CheckCircle2, MoreHorizontal, Ban, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { getAdminDisputes, saveAdminDisputes } from "../../utils/adminPersistence";

export default function AdminReports() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setDisputes(getAdminDisputes());
    const handleUpdate = () => setDisputes(getAdminDisputes());
    window.addEventListener('adminDataUpdate', handleUpdate);
    return () => window.removeEventListener('adminDataUpdate', handleUpdate);
  }, []);

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updated = disputes.map(d => d.id === id ? { ...d, status: newStatus } : d);
    setDisputes(updated);
    saveAdminDisputes(updated);
    setIsActionModalOpen(false);
  };

  const handleAdvancedAction = (actionName: string) => {
    alert(`Deploying automated protocol: ${actionName} \n\nCommand accepted and pushed to queue sequence.`);
    setIsActionModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Conflict Resolution</h1>
          <p className="text-slate-500 font-medium text-left">Administer and mediate player-merchant disputes</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-rose-600/10 hover:scale-105 transition-all">
                Critical Queue Only
            </button>
        </div>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Tickets", count: disputes.filter(d => d.status !== 'Resolved').length, color: "amber" },
          { label: "Critical Escalations", count: disputes.filter(d => d.priority === 'Critical').length, color: "rose" },
          { label: "Avg Resolution Time", count: "4.2 hrs", color: "indigo" },
          { label: "Platform Trust", count: "98.4%", color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mb-1">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by case ID or user..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none hover:bg-slate-50 appearance-none min-w-[150px]"
             >
                <option value="All">All Tickets</option>
                <option value="Open">Open Cases</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Resolved">Resolved</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Conflict / Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Target</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Severity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredDisputes.map((d, idx) => (
                  <motion.tr 
                    key={d.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-rose-50/10 transition-colors group cursor-pointer"
                    onClick={() => {
                        setSelectedDispute(d);
                        setIsActionModalOpen(true);
                    }}
                  >
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-black text-slate-900">{d.id}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded leading-none">{d.date}</span>
                        </div>
                        <span className="text-xs text-indigo-500 font-bold">{d.user}</span>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-1 italic">"{d.reason}"</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                         <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-600">{d.merchant}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner ID: #MID_{Math.floor(Math.random()*100)}</span>
                         </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border transition-all ${
                        d.priority === 'Critical' ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/20' :
                        d.priority === 'High' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {d.priority}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 group/btn">
                        <span className={`flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                        d.status === 'Resolved' ? 'text-emerald-500' : 
                        d.status === 'Open' ? 'text-amber-500' : 'text-indigo-500'
                        }`}>
                        {d.status === 'Resolved' && <CheckCircle2 size={12} />}
                        {d.status === 'Open' && <AlertTriangle size={12} />}
                        {d.status === 'In-Progress' && <Clock size={12} />}
                        {d.status}
                        </span>
                        <div className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 transition-all">
                            <MoreHorizontal size={14} />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredDisputes.length === 0 && (
            <div className="py-20 text-center">
                <ShieldAlert size={48} className="text-slate-100 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No active disputes in current buffer</p>
            </div>
          )}
        </div>
      </div>

       {/* Dispute Control Modal */}
       <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Dispute Resolution Terminal"
        description={selectedDispute ? `Case Detail: ${selectedDispute.id} | User: ${selectedDispute.user}` : ""}
      >
        <div className="space-y-6 pt-4">
             <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldAlert size={120} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4 flex items-center gap-2">
                    <AlertTriangle size={14} /> Reported Incident
                 </p>
                 <p className="text-2xl font-black tracking-tight leading-relaxed mb-6 italic">
                     "{selectedDispute?.reason}"
                 </p>
                 <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                     <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Merchant Identity</p>
                         <p className="font-bold text-sm">{selectedDispute?.merchant}</p>
                     </div>
                     <div className="text-right">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Dispute Severity</p>
                         <p className={`font-black text-sm uppercase tracking-widest ${
                             selectedDispute?.priority === 'Critical' ? 'text-rose-500' : 'text-amber-500'
                         }`}>{selectedDispute?.priority}</p>
                     </div>
                 </div>
             </div>

             <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Resolution Directives</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDispute?.status !== 'Resolved' && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedDispute.id, 'Resolved')}
                            className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-600/20 transition-all"
                        >
                            <CheckCircle2 size={20} /> Close & Mark Resolved
                        </button>
                    )}
                    <button onClick={() => handleAdvancedAction('Initialize Encrypted Chat Protocol')} className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl font-bold hover:bg-indigo-100 transition-all">
                        <MessageCircle size={20} /> Open Mediator Chat
                    </button>
                    <button onClick={() => handleAdvancedAction('Trigger Financial Reversal Pipeline')} className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold hover:bg-rose-100 transition-all">
                        <RefreshCcw size={20} /> Processing Refund
                    </button>
                    <button onClick={() => handleAdvancedAction('Dispatch Trust & Safety Audit')} className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                        <Ban size={20} /> Penalize Merchant
                    </button>
                 </div>
             </div>
        </div>
      </AdminModal>
    </div>
  );
}
