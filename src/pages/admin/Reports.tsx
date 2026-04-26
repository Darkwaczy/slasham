import { 
  Search, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  RefreshCcw,
  RefreshCw,
  ChevronRight,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import AdminModal from "../../components/AdminModal";

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchReports = async () => {
    setIsRefreshing(true);
    try {
      const data = await apiClient("/admin/reports");
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsProcessing(true);
    try {
      await apiClient(`/admin/reports/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      await fetchReports();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.users?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.merchants?.business_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'IN_PROGRESS': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'DISMISSED': return 'bg-slate-50 text-slate-600 border-slate-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/20';
      case 'High': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Conflict Resolution</h1>
          <p className="text-slate-500 font-medium text-left">Mediate player-merchant disputes and maintain platform trust.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchReports}
            className={`p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-rose-500 transition-all ${isRefreshing ? 'animate-spin text-rose-500' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Open Cases</p>
            <p className="text-3xl font-black text-slate-900">{reports.filter(r => r.status === 'PENDING').length}</p>
         </div>
         <div className="bg-rose-50 p-6 rounded-4xl border border-rose-100 shadow-sm text-left">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Critical Escalations</p>
            <p className="text-3xl font-black text-rose-700">{reports.filter(r => r.priority === 'Critical').length}</p>
         </div>
         <div className="bg-emerald-50 p-6 rounded-4xl border border-emerald-100 shadow-sm text-left">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Resolved Tickets</p>
            <p className="text-3xl font-black text-emerald-700">{reports.filter(r => r.status === 'RESOLVED').length}</p>
         </div>
         <div className="bg-slate-900 p-6 rounded-4xl border border-slate-800 shadow-sm text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Platform Trust</p>
            <p className="text-3xl font-black text-white">98.4%</p>
         </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search cases, users, or merchants..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 md:flex-none px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 outline-none hover:bg-slate-100 transition-all cursor-pointer appearance-none"
             >
                <option value="All">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Case ID / Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Target</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Severity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Incident Buffer...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-medium italic">No disputes found matching your criteria.</td>
                </tr>
              ) : filteredReports.map((report) => (
                <tr 
                  key={report.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => { setSelectedReport(report); setIsModalOpen(true); }}
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors">#{report.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-[11px] font-bold text-indigo-500">{report.users?.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700">{report.merchants?.business_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner Portal</p>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    {new Date(report.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Dispute Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Conflict Resolution Terminal"
        size="lg"
      >
        <AnimatePresence mode="wait">
        {selectedReport && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-10 py-4 text-left"
          >
            {/* Modal Header */}
            <div className="p-10 bg-slate-900 rounded-4xl border border-slate-800 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                   <ShieldAlert size={140} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4 flex items-center gap-2">
                   <AlertTriangle size={14} /> Reported Incident
                </p>
                <p className="text-2xl font-black tracking-tight leading-relaxed mb-6 italic">
                    "{selectedReport.reason}"
                </p>
                <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Reporting User</p>
                        <p className="font-black text-sm text-emerald-400">{selectedReport.users?.name}</p>
                        <p className="text-[10px] text-slate-400">{selectedReport.users?.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Merchant Identity</p>
                        <p className="font-black text-sm">{selectedReport.merchants?.business_name}</p>
                    </div>
                </div>
            </div>

            {/* Incident Description */}
            <div className="grid md:grid-cols-1 gap-8">
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText size={14} className="text-rose-500" /> Case Narrative
                   </h4>
                   <div className="bg-slate-50 rounded-4xl p-8 border border-slate-100 min-h-[120px]">
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">{selectedReport.description || "No additional description provided by the user."}</p>
                   </div>
                </div>
            </div>

            {/* Resolution Directives */}
            <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Resolution Protocol</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button 
                    onClick={() => handleUpdateStatus(selectedReport.id, 'IN_PROGRESS')}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 py-4 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50"
                  >
                    <Clock size={16} /> Investigate
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} /> Mark Resolved
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedReport.id, 'DISMISSED')}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50"
                  >
                    <Ban size={16} /> Dismiss
                  </button>
                  <button className="flex items-center justify-center gap-2 py-4 border-2 border-rose-100 text-rose-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 transition-all">
                    <RefreshCcw size={16} /> Refund
                  </button>
               </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </AdminModal>
    </div>
  );
}
