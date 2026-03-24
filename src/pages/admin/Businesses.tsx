import { Search, Filter, MoreHorizontal, Plus, Store, Star, MapPin, ExternalLink, ShieldCheck, ShieldAlert, Trash2, Ticket, DollarSign, Tag, Image as ImageIcon, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import AdminModal from "../../components/AdminModal";
import { getCampaignRequests, saveCampaignRequest, updateRequestStatus } from "../../utils/merchantPersistence";
import { addPersistentDeal } from "../../utils/mockPersistence";

const INITIAL_BUSINESSES = [
  { id: "B-882", name: "Zaza Lounge", owner: "Kunle A.", category: "Dining", rating: 4.8, status: "Verified", deals: 12, city: "Lagos", email: "ops@zaza.com", address: "14, Victoria Island, Lagos" },
  { id: "B-883", name: "Oasis Spa", owner: "Sarah O.", category: "Wellness", rating: 4.9, status: "Verified", deals: 5, city: "Abuja", email: "hello@oasis.com", address: "Plot 12, Wuse 2, Abuja" },
  { id: "B-884", name: "Lagos Grill", owner: "James K.", category: "Food", rating: 4.2, status: "Pending", deals: 0, city: "Lagos", email: "admin@lagosgrill.com", address: "55, Isaac John, Ikeja" },
  { id: "B-885", name: "Skyline Cinema", owner: "Rita W.", category: "Movies", rating: 4.5, status: "Verified", deals: 8, city: "Port Harcourt", email: "support@skyline.com", address: "Ph Mall, Port Harcourt" },
];

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<any[]>(() => {
    const staticBiz = INITIAL_BUSINESSES;
    const requests = getCampaignRequests();
    const requestBiz = requests.map(r => ({
      id: r.merchantId,
      name: r.businessName,
      owner: r.email.split('@')[0],
      category: r.category,
      rating: 4.5,
      status: r.status === 'Approved' ? 'Verified' : 'Pending',
      deals: 1,
      city: r.address.split(',').pop()?.trim() || "Lagos",
      email: r.email,
      address: r.address
    }));

    const combined = [...staticBiz];
    requestBiz.forEach((rb: any) => {
      if (!combined.some(b => b.name === rb.name)) {
        combined.push(rb);
      }
    });
    return combined;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isQuickDealModalOpen, setIsQuickDealModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleToggleVerify = (id: string) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, status: b.status === 'Verified' ? 'Pending' : 'Verified' };
      }
      return b;
    }));
    setIsActionModalOpen(false);
  };

  const handleDeleteBiz = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    setIsActionModalOpen(false);
  };

  const handleCreateDirectDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBiz) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const productName = formData.get('productName') as string;
    const slashamPrice = formData.get('slashamPrice') as string;
    const originalPrice = formData.get('originalPrice') as string;
    const image = formData.get('image') as string || `https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400`;

    // 1. Create a "Ghost" approved request for history/notifications
    const req = saveCampaignRequest({
      merchantId: selectedBiz.id,
      businessName: selectedBiz.name,
      productName,
      productImage: image,
      originalPrice,
      dealPrice: slashamPrice,
      category: selectedBiz.category,
      description: formData.get('description') as string,
      address: selectedBiz.address,
      email: selectedBiz.email,
      phone: "+234-DASH-GHOST",
      couponType: "Voucher",
    });

    // 2. Mark it as approved immediately
    updateRequestStatus(req.id, 'Approved', 'Administrative bypass: Direct deployment authorized by Platform Ops.', slashamPrice);

    // 3. Add to live inventory
    addPersistentDeal({
        title: `${selectedBiz.name}'s ${productName}`,
        location: selectedBiz.address,
        price: slashamPrice,
        original: originalPrice,
        image,
        category: selectedBiz.category,
        tag: "Verified",
        description: formData.get('description') as string,
        validity: "Valid for 30 days. No booking required."
    });

    setIsQuickDealModalOpen(false);
    setIsActionModalOpen(false);
    alert(`Live deployment finalized for ${selectedBiz.name}. Campaign is currently active!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Merchant Intelligence</h1>
          <p className="text-slate-500 font-medium">Manage partners and authorize direct deployments</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/10 hover:scale-105 transition-all"
        >
          <Plus size={18} /> New Partner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Partners", count: businesses.length, sub: `${businesses.filter(b => b.status ==='Pending').length} pending approval` },
          { label: "Active Nodes", count: businesses.filter(b => b.status === 'Verified').length, sub: "Trusted network status" },
          { label: "Avg Velocity", count: "4.2d", sub: "Clearance time" },
          { label: "Satisfaction", count: "98%", sub: "Partner sentiment" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mb-1">{stat.count}</p>
            <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Business Table */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/10">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter partners..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none"
            >
              <option value="All">All Sectors</option>
              <option value="Dining">Dining</option>
              <option value="Wellness">Wellness</option>
              <option value="Food">Food</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Node Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Gate Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredBusinesses.map((biz, idx) => (
                  <motion.tr 
                    key={biz.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                          {biz.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 mb-0.5">{biz.name}</p>
                          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{biz.city} • {biz.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        {biz.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          biz.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                          {biz.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedBiz(biz);
                          setIsActionModalOpen(true);
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Manage Node
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action/Manage Business Modal */}
      <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Artifact Deployment Protocol"
        description={`Execute platform-level overrides for ${selectedBiz?.name}`}
      >
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-4xl border border-slate-100 mb-6">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl">
                   {selectedBiz?.name.charAt(0)}
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{selectedBiz?.name}</h3>
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-60">Strategic Partner Identity</span>
                </div>
             </div>
             {selectedBiz?.status === 'Verified' && <ShieldCheck size={32} className="text-emerald-500 opacity-50" />}
          </div>

          <div className="grid grid-cols-1 gap-3 pb-8">
            <button 
               onClick={() => setIsQuickDealModalOpen(true)}
               className="w-full flex items-center justify-between px-6 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 group"
            >
               <span className="flex items-center gap-3"><Ticket size={18} /> Authorize Direct Campaign Deployment</span>
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => handleToggleVerify(selectedBiz.id)}
              className="w-full flex items-center gap-4 px-6 py-5 bg-white border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-600 hover:bg-slate-50 transition-all"
            >
              <ShieldAlert size={18} className="text-amber-500" /> Toggle Verification Gate
            </button>

            <button 
              onClick={() => handleDeleteBiz(selectedBiz.id)}
              className="w-full flex items-center gap-4 px-6 py-5 bg-white border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-rose-500 hover:bg-rose-50 transition-all"
            >
              <Trash2 size={18} /> Offboard Partner
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Direct Campaign Modal */}
      <AdminModal
        isOpen={isQuickDealModalOpen}
        onClose={() => setIsQuickDealModalOpen(false)}
        title="Direct Deployment Authorization"
        description="Skip the merchant review gate and deploy an active artifact directly to the global marketplace."
      >
        <form onSubmit={handleCreateDirectDeal} className="space-y-6 pt-6 mb-8">
          <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Product Title</label>
                   <input name="productName" required placeholder="Saturday Night BBQ" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Artifact Image (URL)</label>
                   <div className="relative">
                      <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="image" placeholder="https://..." className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 px-1">Live Slasham Price</label>
                   <div className="relative">
                      <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input name="slashamPrice" required placeholder="₦12,000" className="w-full pl-12 pr-5 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Market Price</label>
                   <input name="originalPrice" required placeholder="₦25,000" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Artifact Description</label>
                <textarea name="description" required placeholder="Deployment description for storefront..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500" />
             </div>
          </div>

          <div className="flex gap-4 pt-4">
             <button type="button" onClick={() => setIsQuickDealModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px]">Abandon Task</button>
             <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/10">Authorize Deployment</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
