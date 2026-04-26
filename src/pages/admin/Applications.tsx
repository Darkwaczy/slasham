import { useEffect, useState } from "react";
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  MapPin, 
  FileText,
  ChevronRight,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Filter,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiClient } from "../../api/client";
import AdminModal from "../../components/AdminModal";

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchApplications = async () => {
    setIsRefreshing(true);
    try {
      const data = await apiClient("/admin/applications");
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Approve this merchant? This will create their account and generate onboarding credentials.")) return;
    setIsProcessing(true);
    try {
      const result = await apiClient(`/admin/applications/${id}/approve`, { method: "POST" });
      alert(`Approved! Temporary password: ${result.tempPassword}`);
      fetchApplications();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Reject this application?")) return;
    setIsProcessing(true);
    try {
      await apiClient(`/admin/applications/${id}/reject`, { method: "POST" });
      fetchApplications();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredApps = applications.filter(app => 
    app.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Partner Applications</h1>
          <p className="text-slate-500 font-medium">Verify and onboard potential merchant partners.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchApplications}
            className={`p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-emerald-500 transition-all ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Review</p>
            <p className="text-3xl font-black text-slate-900">{applications.filter(a => a.status === 'PENDING').length}</p>
         </div>
         <div className="bg-emerald-50 p-6 rounded-4xl border border-emerald-100 shadow-sm">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Approved Partners</p>
            <p className="text-3xl font-black text-emerald-700">{applications.filter(a => a.status === 'APPROVED').length}</p>
         </div>
         <div className="bg-slate-900 p-6 rounded-4xl border border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Inquiries</p>
            <p className="text-3xl font-black text-white">{applications.length}</p>
         </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                <Filter size={16} /> All Status
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Business</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Protocols...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-medium italic">No applications found matching your criteria.</td>
                </tr>
              ) : filteredApps.map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => { setSelectedApp(app); setIsModalOpen(true); }}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{app.business_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.business_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700">{app.contact_name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{app.email}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600 flex items-center gap-1.5 mt-2">
                    <MapPin size={14} className="text-slate-300" /> {app.city}
                  </td>
                  <td className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      app.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {app.status === 'PENDING' ? <Clock size={12}/> : 
                       app.status === 'APPROVED' ? <CheckCircle2 size={12}/> : 
                       <XCircle size={12}/>}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Application View Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Application Review"
        size="lg"
      >
        <AnimatePresence mode="wait">
        {selectedApp && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10 py-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Building2 size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedApp.business_name}</h2>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{selectedApp.business_type} • Joined {new Date(selectedApp.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                   selectedApp.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                   selectedApp.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                   'bg-rose-50 text-rose-600 border-rose-100'
                 }`}>
                   {selectedApp.status}
                 </span>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <User size={14} className="text-emerald-500" /> Contact Details
                    </h4>
                    <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">Name</span>
                          <span className="text-sm font-black text-slate-900">{selectedApp.contact_name}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">Email</span>
                          <span className="text-sm font-black text-emerald-600">{selectedApp.email}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">Phone</span>
                          <span className="text-sm font-black text-slate-900">{selectedApp.phone}</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <MapPin size={14} className="text-emerald-500" /> Presence
                    </h4>
                    <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">City</span>
                          <span className="text-sm font-black text-slate-900">{selectedApp.city}</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400">Full Address</p>
                          <p className="text-sm font-black text-slate-700 leading-tight">{selectedApp.address}</p>
                       </div>
                       <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-bold text-slate-400">Digital Hub</span>
                          <a href={selectedApp.website_social?.startsWith('http') ? selectedApp.website_social : `https://${selectedApp.website_social}`} target="_blank" rel="noreferrer" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                             Visit Website <ArrowUpRight size={12} />
                          </a>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <FileText size={14} className="text-emerald-500" /> Business Intro
                    </h4>
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 min-h-[200px]">
                       <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{selectedApp.description || "No description provided."}"</p>
                    </div>
                 </div>

                 <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verification Status</p>
                       <p className="text-xs font-bold text-slate-600">Background scan completed.</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedApp.status === 'PENDING' && (
              <div className="pt-10 flex gap-4 border-t border-slate-100">
                <button 
                  onClick={() => handleReject(selectedApp.id)}
                  disabled={isProcessing}
                  className="flex-1 py-5 rounded-2xl border-2 border-rose-100 text-rose-500 font-black uppercase text-xs tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <XCircle size={18} /> Reject Partner
                </button>
                <button 
                  onClick={() => handleApprove(selectedApp.id)}
                  disabled={isProcessing}
                  className="flex-2 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  Approve & Onboard Partner
                </button>
              </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </AdminModal>
    </div>
  );
}
