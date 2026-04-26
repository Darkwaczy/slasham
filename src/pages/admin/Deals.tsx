import { Search, Clock, CheckCircle2, FileText, ChevronRight, Tag, Trash2, RefreshCw, TrendingUp, Image as ImageIcon, Edit3, Save, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { apiClient } from "../../api/client";
import AdminSkeleton from "../../components/AdminSkeleton";

export default function AdminDeals() {
  const [deals, setDeals] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [activeTab, setActiveTab ] = useState<'inventory' | 'requests' | 'ads'>('inventory');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Placement States for Approval
  const [slashamPrice, setSlashamPrice] = useState("");
  const [targetCity, setTargetCity] = useState<'Lagos' | 'Abuja' | 'All'>('Lagos');
  const [selectedCategory, setSelectedCategory] = useState("Dining");
  const [isHotDeal, setIsHotDeal] = useState(false);

  // Ad Editing States
  const [editingAd, setEditingAd] = useState<any | null>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [dealsList, requestsList, billboardsList] = await Promise.all([
        apiClient("/deals"),
        apiClient("/admin/requests"),
        apiClient("/admin/billboards")
      ]);
      
      setDeals(dealsList.map((d: any) => ({
        ...d,
        merchant: d.merchants?.business_name || "Merchant Partner",
        status: "Active"
      })));
      setRequests(requestsList);
      setAds(billboardsList);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isRefreshing && deals.length === 0) return <AdminSkeleton />;

  const handleApprove = async (req: any) => {
    if (!slashamPrice.trim()) {
      alert("Please determine the Slasham Discounted Price before authorizing launch.");
      return;
    }

    try {
        const numericPrice = parseFloat(slashamPrice.replace(/[^0-9.]/g, ''));
        
        // 1. Update request status
        await apiClient(`/admin/requests/${req.id}/status`, {
            method: "POST",
            body: JSON.stringify({ status: "APPROVED", admin_notes: "Authorized via Marketplace Console" })
        });

        // 2. Create the real deal
        await apiClient("/deals", {
            method: "POST",
            body: JSON.stringify({
                merchant_id: req.merchant_id,
                title: req.product_name,
                description: req.description,
                category: selectedCategory,
                original_price: req.original_price,
                discount_price: numericPrice,
                total_quantity: req.total_quantity || 100,
                validity_days: 30,
                expiry_date: req.expiry_date || new Date(Date.now() + 30 * 86400000).toISOString(),
                is_hot: isHotDeal,
                images: [req.product_image],
                deal_explanation: "Limited time verified offer"
            })
        });

        setIsRequestModalOpen(false);
        setSlashamPrice("");
        loadData();
    } catch (error: any) {
        alert("Launch failed: " + error.message);
    }
  };

  const handleUpdateAd = async () => {
      if (editingAd) {
          try {
            await apiClient("/admin/billboards", {
                method: "POST",
                body: JSON.stringify(editingAd)
            });
            setEditingAd(null);
            loadData();
          } catch (error: any) {
            alert("Ad update failed: " + error.message);
          }
      }
  };

  const handleDeleteDeal = async (deal: any) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    try {
        await apiClient(`/deals/${deal.id}`, { method: "DELETE" });
        loadData();
    } catch (error: any) {
        alert("Delete failed: " + error.message);
    }
  };

  const filteredDeals = (deals || []).filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (d.merchant && d.merchant.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 text-nowrap">Platform Marketplace</h1>
          <p className="text-slate-500 font-medium">Verify merchant pricing and launch campaigns</p>
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
            <button 
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'ads' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Ads
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: "Active Deals", count: deals.length, sub: "Live on Storefront",
                icon: Tag,
                bgClass: "bg-indigo-50", borderClass: "border-indigo-100", 
                textClass: "text-indigo-700", labelClass: "text-indigo-500", subClass: "text-indigo-600/70",
                iconBg: "bg-white/60", iconColor: "text-indigo-600"
              },
              { 
                label: "Pending Review", count: pendingRequests.length, sub: "Merchant Inquiries",
                icon: Clock,
                bgClass: "bg-amber-50", borderClass: "border-amber-100", 
                textClass: "text-amber-700", labelClass: "text-amber-500", subClass: "text-amber-600/70",
                iconBg: "bg-white/60", iconColor: "text-amber-600"
              },
              { 
                label: "Trending Now", count: deals.filter(d => d.is_trending).length, sub: "Platform Velocity",
                icon: TrendingUp,
                bgClass: "bg-emerald-50", borderClass: "border-emerald-100", 
                textClass: "text-emerald-700", labelClass: "text-emerald-500", subClass: "text-emerald-600/70",
                iconBg: "bg-white/60", iconColor: "text-emerald-600"
              },
              { 
                label: "Hot Coupons", count: deals.filter(d => d.is_hot).length, sub: "High Value Claims",
                icon: Zap,
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
                <p className={`text-4xl font-black ${stat.textClass} tracking-tight mb-2`}>{stat.count}</p>
                <p className={`text-[11px] font-bold ${stat.subClass}`}>{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden text-left">
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
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredDeals.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 italic">No deals found matching your criteria.</td>
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
                        <td className="px-8 py-5 text-left">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shadow-sm">
                              <img src={deal.images?.[0] || ""} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 mb-0.5">{deal.title}</p>
                              <p className="text-[11px] text-slate-500 font-medium">{deal.category} • ₦{deal.discount_price?.toLocaleString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-nowrap text-sm font-bold text-slate-700 text-left">{deal.merchant}</td>
                        <td className="px-8 py-5 text-right space-x-1">
                          <button 
                            onClick={() => handleDeleteDeal(deal)}
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
      ) : activeTab === 'requests' ? (
        <div className="space-y-12">
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
                    className="bg-white rounded-4xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden text-left"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-3xl overflow-hidden shadow-lg shadow-emerald-500/5">
                          <img src={req.product_image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">{req.product_name}</h3>
                          <p className="text-sm font-bold text-indigo-600">{req.merchants?.business_name}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl animate-pulse">
                        <Clock size={20} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 text-left">Market Price</p>
                        <p className="text-lg font-black text-slate-900 leading-none text-left">₦{req.original_price?.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 text-left">Coupon Type</p>
                        <p className="text-lg font-black text-slate-900 leading-none text-left">{req.coupon_type || "Standard"}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setSelectedRequest(req); setIsRequestModalOpen(true); }}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                    >
                      Review & Determine Placement <ChevronRight size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
             <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Active Billboard Banners</h3>
                {ads.map((ad, i) => (
                    <motion.div 
                        key={ad.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 rounded-[2.5rem] border ${editingAd?.id === ad.id ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100'} bg-white group transition-all`}
                    >
                        <div className="flex gap-6">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                                <img src={ad.image_url} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white mb-2 inline-block ${ad.bg_class?.split(' ')[0] || 'bg-slate-900'}`}>Slot #{ad.id}</span>
                                <h4 className="text-lg font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{ad.title} {ad.subtitle}</h4>
                                <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-1">{ad.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code: <span className="text-slate-900">{ad.promo_code}</span></span>
                                    <button 
                                        onClick={() => setEditingAd(ad)}
                                        className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
             </div>

             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-fit sticky top-24">
                {editingAd ? (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                <ImageIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tighter">Edit Billboard</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Slot #{editingAd.id}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title Part 1</label>
                                    <input 
                                        type="text" 
                                        value={editingAd.title}
                                        onChange={(e) => setEditingAd({...editingAd, title: e.target.value})}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title Part 2</label>
                                    <input 
                                        type="text" 
                                        value={editingAd.subtitle}
                                        onChange={(e) => setEditingAd({...editingAd, subtitle: e.target.value})}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Description</label>
                                <textarea 
                                    value={editingAd.description}
                                    onChange={(e) => setEditingAd({...editingAd, description: e.target.value})}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Promo Code</label>
                                    <input 
                                        type="text" 
                                        value={editingAd.promo_code}
                                        onChange={(e) => setEditingAd({...editingAd, promo_code: e.target.value})}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Background Color Class</label>
                                    <input 
                                        type="text" 
                                        value={editingAd.bg_class}
                                        onChange={(e) => setEditingAd({...editingAd, bg_class: e.target.value})}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Banner Image URL</label>
                                <input 
                                    type="text" 
                                    value={editingAd.image_url}
                                    onChange={(e) => setEditingAd({...editingAd, image_url: e.target.value})}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-mono outline-none focus:ring-2 focus:ring-indigo-500 text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setEditingAd(null)}
                                className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdateAd}
                                className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={16} /> Deploy Update
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-20 opacity-30 select-none">
                         <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <Edit3 size={32} />
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-2">Editor Inactive</h3>
                         <p className="text-xs font-medium text-slate-500 max-w-xs">Select a billboard slot from the left to begin real-time modifications.</p>
                    </div>
                )}
             </div>
        </div>
      )}

      <AdminModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Deployment Verification & Placement"
        description="Verify merchant parameters and determine the final 'Slasham Price' and platform placement."
      >
        <div className="space-y-8 pt-6 text-left">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-100 rounded-4xl overflow-hidden shadow-xl shadow-emerald-500/10">
              <img src={selectedRequest?.product_image} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{selectedRequest?.merchants?.business_name}</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{selectedRequest?.product_name}</h2>
              <p className="text-slate-400 font-medium mt-2 max-w-sm leading-relaxed line-clamp-2 text-sm">{selectedRequest?.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">PLATFORM PLACEMENT</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-2">
                        <span className="text-xs font-bold text-slate-700">Add to 'Hot Deals'</span>
                        <button 
                            onClick={() => setIsHotDeal(!isHotDeal)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isHotDeal ? 'bg-rose-500' : 'bg-slate-200'}`}
                        >
                            <motion.div animate={{ x: isHotDeal ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                    </div>
                </div>
             </div>

             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">TARGET MARKET</p>
                <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Operation City</label>
                        <select 
                            value={targetCity}
                            onChange={(e: any) => setTargetCity(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-700 outline-none"
                        >
                            <option value="Lagos">Lagos State</option>
                            <option value="Abuja">Abuja (FCT)</option>
                            <option value="All">All Cities (Global)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Inventory Category</label>
                        <select 
                            value={selectedCategory}
                            onChange={(e: any) => setSelectedCategory(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-700 outline-none"
                        >
                            <option value="Dining">Dining & Food</option>
                            <option value="Spa">Spa & Wellness</option>
                            <option value="Beauty">Beauty & Salon</option>
                            <option value="Events">Events & Tickets</option>
                            <option value="Fitness">Fitness & Gym</option>
                            <option value="Hotels">Hotels & Stays</option>
                            <option value="Services">Professional Services</option>
                        </select>
                    </div>
                </div>
             </div>
          </div>

          <div className="space-y-4 p-8 bg-emerald-50 rounded-4xl border border-emerald-100 shadow-inner">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Set Slasham Discount Price</label>
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg text-emerald-600 text-[10px] font-bold">
                   <Tag size={12} /> Market Price: ₦{selectedRequest?.original_price?.toLocaleString()}
                </div>
             </div>
             <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">₦</div>
                <input 
                  type="text"
                  value={slashamPrice}
                  onChange={(e) => setSlashamPrice(e.target.value)}
                  placeholder="00,000"
                  className="w-full bg-white border-2 border-emerald-100 rounded-3xl py-6 pl-14 pr-8 text-2xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono"
                />
              </div>
          </div>

          <div className="flex gap-4 pb-8">
            <button 
              onClick={() => setIsRequestModalOpen(false)}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
            >
              Cancel Review
            </button>
            <button 
              onClick={() => handleApprove(selectedRequest!)}
              className="flex-2 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> Authorize Launch
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
