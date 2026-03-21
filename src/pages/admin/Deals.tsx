import { Search, Plus, TrendingUp, Play, Pause, Square, Trash2, MoreHorizontal, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import AdminModal from "../../components/AdminModal";

const INITIAL_DEALS = [
  { id: "D-110", title: "50% Off Pizza Night", merchant: "Pizza Hut", category: "Dining", reached: "85%", status: "Active", expires: "2 days" },
  { id: "D-111", title: "Luxury Spa Weekend", merchant: "Oasis Spa", category: "Wellness", reached: "60%", status: "Active", expires: "5 days" },
  { id: "D-112", title: "Buy 1 Get 1 Free Grill", merchant: "Lagos Grill", category: "Food", reached: "100%", status: "Ended", expires: "Expired" },
  { id: "D-113", title: "Movie Marathon Pass", merchant: "Skyline", category: "Movies", reached: "15%", status: "Paused", expires: "12 days" },
  { id: "D-114", title: "Annual Gym Membership", merchant: "Urban Fit", category: "Health", reached: "45%", status: "Active", expires: "8 days" },
];

export default function AdminDeals() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDeals = deals.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    setIsActionModalOpen(false);
  };

  const handleDeleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    setIsActionModalOpen(false);
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newDeal = {
      id: `D-${Math.floor(200 + Math.random() * 100)}`,
      title: formData.get('title') as string,
      merchant: formData.get('merchant') as string,
      category: formData.get('category') as string,
      reached: "0%",
      status: "Active",
      expires: formData.get('expires') as string + " days",
    };
    setDeals([newDeal, ...deals]);
    setIsLaunchModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Campaigns</h1>
          <p className="text-slate-500 font-medium">Monitor deal performance and redemption rates</p>
        </div>
        <button 
          onClick={() => setIsLaunchModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/10 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Launch Campaign
        </button>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Deals", count: deals.filter(d => d.status === 'Active').length, color: "emerald", sub: "Currently Live" },
          { label: "Total Claims", count: "12,402", color: "blue", sub: "All time redemptions" },
          { label: "Avg Discount", count: "35%", color: "amber", sub: "Platform average" },
          { label: "Gross Value", count: "₦42.5M", color: "indigo", sub: "Locked liquidity" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform ${
               stat.color === 'emerald' ? 'bg-emerald-500' : 
               stat.color === 'blue' ? 'bg-blue-500' : 
               stat.color === 'amber' ? 'bg-amber-500' : 'bg-indigo-500'
            }`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mb-1">{stat.count}</p>
            <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter campaigns..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none hover:bg-slate-50"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Ended">Ended</option>
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
                {filteredDeals.map((deal, idx) => (
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
                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center font-bold">
                          {deal.merchant.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-0.5">{deal.title}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{deal.category} • ID: {deal.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-nowrap">
                      <div className="text-sm font-bold text-slate-700">{deal.merchant}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1.5 w-32">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                          <span>REACHED</span>
                          <span className="text-indigo-600">{deal.reached}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: deal.reached }}
                            className="h-full bg-indigo-500 rounded-full" 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         deal.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                         deal.status === 'Ended' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                       }`}>
                         {deal.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-1">
                      <button 
                         onClick={() => {
                           setSelectedDeal(deal);
                           setIsActionModalOpen(true);
                         }}
                        className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                      >
                        <TrendingUp size={18} />
                      </button>
                      <button 
                        onClick={() => {
                           setSelectedDeal(deal);
                           setIsActionModalOpen(true);
                         }}
                        className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Launch Campaign Modal */}
      <AdminModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        title="Launch New Campaign"
        description="Help a merchant go live with a new deal on the platform."
      >
        <form onSubmit={handleLaunchCampaign} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Deal Title</label>
              <input name="title" required placeholder="Summer Discount 40% Off" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Merchant Partner</label>
                <input name="merchant" required placeholder="Select Merchant Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
                <select name="category" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none">
                  <option value="Dining">Dining</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Food">Food & Drink</option>
                  <option value="Services">Services</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Duration (Days)</label>
              <input name="expires" type="number" required placeholder="30" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none" />
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <button type="button" onClick={() => setIsLaunchModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-600/10 transition-all">Start Campaign</button>
          </div>
        </form>
      </AdminModal>

      {/* Deal Settings/Actions Modal */}
      <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Campaign Controls"
        description={selectedDeal ? `Managing ${selectedDeal.title}` : ""}
      >
        <div className="space-y-6 pt-4">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-lg font-black text-slate-900">{selectedDeal?.title}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedDeal?.merchant} • {selectedDeal?.status}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              selectedDeal?.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <Play className={selectedDeal?.status === 'Active' ? 'animate-pulse' : ''} size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedDeal?.status === 'Active' ? (
              <button 
                onClick={() => handleUpdateStatus(selectedDeal.id, 'Paused')}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
              >
                <Pause size={18} /> Pause Campaign
              </button>
            ) : (
              <button 
                onClick={() => handleUpdateStatus(selectedDeal.id, 'Active')}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
              >
                <Play size={18} /> Resume Campaign
              </button>
            )}

            <button 
               onClick={() => handleUpdateStatus(selectedDeal.id, 'Ended')}
               className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
            >
              <Square size={18} /> Terminate Deal
            </button>
            
            <button className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all col-span-1 sm:col-span-2">
              <Eye size={18} /> View Storefront Page
            </button>

            <div className="col-span-1 sm:col-span-2 my-2 border-t border-slate-100"></div>

            <button 
              onClick={() => handleDeleteDeal(selectedDeal.id)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all col-span-1 sm:col-span-2"
            >
              <Trash2 size={18} /> Delete Campaign Artifacts
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
