import { Search, MoreHorizontal, Clock, CheckCircle2, XCircle, FileText, ChevronRight, MapPin, Tag, Mail, Phone, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { getPersistentDeals, addPersistentDeal, deletePersistentDeal } from "../../utils/mockPersistence";
import { getCampaignRequests, updateRequestStatus, CampaignRequest } from "../../utils/merchantPersistence";

export default function AdminDeals() {
  const [deals, setDeals] = useState<any[]>([]);
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [activeTab, setActiveTab ] = useState<'inventory' | 'requests'>('inventory');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<CampaignRequest | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [rejectNote, setRejectNote] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);
    const publicDeals = getPersistentDeals();
    setDeals(publicDeals.map(d => ({
        ...d,
        merchant: d.title.split("'")[0] || "Merchant Partner",
        reached: d.tag === 'Verified' ? "85%" : "0%",
        status: "Active",
        expires: "30 days",
    })));
    setRequests(getCampaignRequests());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campaignRequestsUpdate', loadData);
    return () => window.removeEventListener('campaignRequestsUpdate', loadData);
  }, []);

  const handleApprove = (req: CampaignRequest) => {
    updateRequestStatus(req.id, 'Approved', 'Platform verification successful. This deal is now LIVE.');
    addPersistentDeal({
        title: `${req.businessName}'s ${req.productName}`, // Link merchant name to title for storefront visibility
        location: req.address,
        price: req.dealPrice,
        original: req.originalPrice,
        image: req.productImage,
        category: req.category,
        tag: "Verified",
        description: req.description,
        validity: `Valid for 30 days after purchase.`
    });
    setIsRequestModalOpen(false);
  };

  const handleReject = (id: string) => {
    updateRequestStatus(id, 'Rejected', rejectNote || "Does not meet platform guidelines.");
    setRejectNote("");
    setIsRequestModalOpen(false);
  };

  const handleDeleteDeal = (id: number | string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    deletePersistentDeal(Number(id));
  };

  const filteredDeals = (deals || []).filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (d.merchant && d.merchant.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const otherRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Platform Marketplace</h1>
          <p className="text-slate-500 font-medium">Coordinate inventory and handle merchant submissions</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={loadData}
            className={`p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === 'requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Requests
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Deals", count: deals.length, color: "emerald", sub: "Live on Storefront" },
              { label: "Pending Review", count: pendingRequests.length, color: "rose", sub: "Merchant Submissions" },
              { label: "Avg Discount", count: "42%", color: "amber", sub: "Platform Strength" },
              { label: "Claims (24h)", count: "842", color: "indigo", sub: "Mock Velocity" },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mb-1">{stat.count}</p>
                <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/10">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter inventory..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Deal Information</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Performance</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredDeals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">No deals found matching your criteria.</td>
                      </tr>
                    ) : filteredDeals.map((deal: any, idx: number) => (
                      <motion.tr 
                        key={deal.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shadow-sm">
                              <img src={deal.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 mb-0.5">{deal.title}</p>
                              <p className="text-[11px] text-slate-500 font-medium">{deal.category} • {deal.price}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-nowrap text-sm font-bold text-slate-700">{deal.merchant}</td>
                        <td className="px-8 py-5">
                          <div className="space-y-1.5 w-32">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                              <span>REACHED</span>
                              <span className="text-indigo-600">{deal.reached}</span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: deal.reached }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             deal.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                           }`}>
                             {deal.status}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right space-x-1">
                          <button 
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="p-2.5 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-12">
          {/* Main Pending Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {pendingRequests.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-4xl border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FileText size={40} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 italic">No Pending Merchant Inquiries</h3>
                  <p className="text-slate-400 font-medium mt-1">Platform queue is currently synchronized.</p>
                </div>
              ) : (
                pendingRequests.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-4xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-3xl overflow-hidden shadow-lg shadow-slate-900/5">
                          <img src={req.productImage} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">{req.productName}</h3>
                          <p className="text-sm font-bold text-indigo-600">{req.businessName}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl animate-pulse">
                        <Clock size={20} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Slasham Price</p>
                        <p className="text-lg font-black text-emerald-600 leading-none">{req.dealPrice}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Coupon Type</p>
                        <p className="text-lg font-black text-slate-900 leading-none">{req.couponType}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setSelectedRequest(req); setIsRequestModalOpen(true); }}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      Review Artifact <ChevronRight size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* History / Other Section */}
          {otherRequests.length > 0 && (
            <div className="pt-8 border-t border-slate-100">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-2">Decision History</h3>
               <div className="overflow-x-auto bg-white rounded-4xl border border-slate-50">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Business</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Outcome</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {otherRequests.map((r) => (
                         <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-4 font-bold text-slate-700 text-sm whitespace-nowrap">{r.businessName}</td>
                            <td className="px-8 py-4 font-medium text-slate-500 text-sm">{r.productName}</td>
                            <td className="px-8 py-4 text-center">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 r.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                               }`}>
                                 {r.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Request Review Modal */}
      <AdminModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Artifact Verification"
        description="Verify merchant parameters before authorizing storefront deployment."
      >
        <div className="space-y-8 pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-100 rounded-4xl overflow-hidden shadow-xl shadow-slate-900/10">
              <img src={selectedRequest?.productImage} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{selectedRequest?.businessName}</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{selectedRequest?.productName}</h2>
              <p className="text-slate-400 font-medium mt-2 max-w-sm leading-relaxed">{selectedRequest?.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                   <Tag className="text-slate-400" size={18} />
                   <p className="text-sm font-black text-slate-900">Pricing Logic: <span className="text-emerald-600">{selectedRequest?.dealPrice}</span> <span className="text-slate-400 line-through text-xs ml-2">{selectedRequest?.originalPrice}</span></p>
                </div>
                <div className="flex items-center gap-3">
                   <MapPin className="text-slate-400" size={18} />
                   <p className="text-sm font-bold text-slate-600 truncate">{selectedRequest?.address}</p>
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                   <Mail className="text-slate-400" size={18} />
                   <p className="text-sm font-bold text-slate-600">{selectedRequest?.email}</p>
                </div>
                <div className="flex items-center gap-3">
                   <Phone className="text-slate-400" size={18} />
                   <p className="text-sm font-bold text-slate-600">{selectedRequest?.phone}</p>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Internal Note / Response</label>
            <textarea 
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="e.g. Imagery needs optimization or Pricing approved for launch..." 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" 
            />
          </div>

          <div className="flex gap-4 pb-8">
            <button 
              onClick={() => handleReject(selectedRequest?.id || '')}
              className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
            >
              <XCircle size={18} /> Deny Request
            </button>
            <button 
              onClick={() => handleApprove(selectedRequest!)}
              className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> Authorize Launch
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
