import { Search, Filter, MoreHorizontal, Plus, Store, Star, MapPin, ExternalLink, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import AdminModal from "../../components/AdminModal";

const INITIAL_BUSINESSES = [
  { id: "B-882", name: "Zaza Lounge", owner: "Kunle A.", category: "Dining", rating: 4.8, status: "Verified", deals: 12, city: "Lagos" },
  { id: "B-883", name: "Oasis Spa", owner: "Sarah O.", category: "Wellness", rating: 4.9, status: "Verified", deals: 5, city: "Abuja" },
  { id: "B-884", name: "Lagos Grill", owner: "James K.", category: "Food", rating: 4.2, status: "Pending", deals: 0, city: "Lagos" },
  { id: "B-885", name: "Skyline Cinema", owner: "Rita W.", category: "Movies", rating: 4.5, status: "Verified", deals: 8, city: "Port Harcourt" },
  { id: "B-886", name: "Urban Fitness", owner: "David M.", category: "Health", rating: 4.7, status: "Verified", deals: 3, city: "Abuja" },
];

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState(INITIAL_BUSINESSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(businesses.map(b => b.category))];

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

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newBiz = {
      id: `B-${Math.floor(800 + Math.random() * 200)}`,
      name: formData.get('name') as string,
      owner: formData.get('owner') as string,
      category: formData.get('category') as string,
      rating: 0.0,
      status: "Pending",
      deals: 0,
      city: formData.get('city') as string,
    };
    setBusinesses([newBiz, ...businesses]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Merchant Partners</h1>
          <p className="text-slate-500 font-medium">Coordinate and approve business listings</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/10 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Add Business
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Partners", count: businesses.length, sub: `${businesses.filter(b => b.status ==='Pending').length} pending approval` },
          { label: "Total Deals", count: businesses.reduce((acc, b) => acc + b.deals, 0), sub: "Across all merchants" },
          { label: "Active Revenue", count: "₦12.5M", sub: "Last 30 days" },
          { label: "Avg Rating", count: (businesses.reduce((acc, b) => acc + b.rating, 0) / businesses.length).toFixed(1), sub: "Global performance" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mb-1">{stat.count}</p>
            <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Business Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search merchants..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-2xl px-6 py-3 pr-12 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Business Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
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
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          {biz.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-0.5">{biz.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium">ID: {biz.id} • {biz.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                        {biz.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 border-l border-slate-100 pl-4">
                         <Star size={14} className="fill-amber-400 text-amber-400" />
                         {biz.rating || "New"}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                          biz.status === 'Verified' ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                          {biz.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <MapPin size={10} /> {biz.city}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                       <button 
                        onClick={() => {
                          setSelectedBiz(biz);
                          setIsActionModalOpen(true);
                        }}
                        className="p-2.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedBiz(biz);
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
          {filteredBusinesses.length === 0 && (
            <div className="py-20 text-center">
               <Store size={48} className="text-slate-200 mx-auto mb-4" />
               <p className="text-slate-500 font-bold">No merchants found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Business Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Merchant"
        description="Add a new business partner to the Slasham network."
      >
        <form onSubmit={handleAddBusiness} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Business Name</label>
              <input name="name" required placeholder="Creative Lounge" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Person</label>
              <input name="owner" required placeholder="John Obinna" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
              <select name="category" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none">
                <option value="Dining">Dining</option>
                <option value="Wellness">Wellness</option>
                <option value="Food">Food</option>
                <option value="Experiences">Experiences</option>
                <option value="Services">Services</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Operating City</label>
              <select name="city" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none">
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-600/20 transition-all">Register Partner</button>
          </div>
        </form>
      </AdminModal>

      {/* Action/Manage Business Modal */}
      <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Partner Controls"
        description={selectedBiz ? `Management for ${selectedBiz.name}` : ""}
      >
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4 p-5 bg-indigo-50 rounded-[2rem] border border-indigo-100">
             <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl">
               <Store size={28} />
             </div>
             <div>
               <p className="text-lg font-black text-slate-900">{selectedBiz?.name}</p>
               <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">{selectedBiz?.category} • {selectedBiz?.city}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => handleToggleVerify(selectedBiz.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                selectedBiz?.status === 'Verified' 
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              }`}
            >
              {selectedBiz?.status === 'Verified' ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
              {selectedBiz?.status === 'Verified' ? 'Revoke Verification' : 'Approve & Verify Business'}
            </button>
            
            <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Star size={20} /> View All Reviews
            </button>
            
            <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
               <ExternalLink size={20} /> View Public Listing
            </button>

            <div className="my-2 border-t border-slate-100"></div>
            
            <button 
              onClick={() => handleDeleteBiz(selectedBiz.id)}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
            >
              <Trash2 size={20} /> Offboard Partner
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
