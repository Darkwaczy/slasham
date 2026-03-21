import { Search, Filter, MoreHorizontal, Plus, Store, Star, MapPin, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const businesses = [
  { id: "B-882", name: "Zaza Lounge", owner: "Kunle A.", category: "Dining", rating: 4.8, status: "Verified", deals: 12, city: "Lagos" },
  { id: "B-883", name: "Oasis Spa", owner: "Sarah O.", category: "Wellness", rating: 4.9, status: "Verified", deals: 5, city: "Abuja" },
  { id: "B-884", name: "Lagos Grill", owner: "James K.", category: "Food", rating: 4.2, status: "Pending", deals: 0, city: "Lagos" },
  { id: "B-885", name: "Skyline Cinema", owner: "Rita W.", category: "Movies", rating: 4.5, status: "Verified", deals: 8, city: "Port Harcourt" },
  { id: "B-886", name: "Urban Fitness", owner: "David M.", category: "Health", rating: 4.7, status: "Verified", deals: 3, city: "Abuja" },
];

export default function AdminBusinesses() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Merchant Partners</h1>
          <p className="text-slate-500 font-medium">Coordinate and approve business listings</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/10 hover:scale-105 transition-transform">
          <Plus size={18} /> Add Business
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Partners", count: "150", sub: "12 pending approval" },
          { label: "Total Deals", count: "450", sub: "Avg 3 per merchant" },
          { label: "Active Revenue", count: "₦12.5M", sub: "Last 30 days" },
          { label: "Avg Rating", count: "4.6", sub: "Based on 2k reviews" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mb-1">{stat.count}</p>
            <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Business Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search merchants..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-slate-900 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600">
               <Filter size={16} /> All Categories
            </button>
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
              {businesses.map((biz, idx) => (
                <motion.tr 
                  key={biz.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Store size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 mb-0.5">{biz.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">ID: {biz.id} • {biz.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg italic">
                      {biz.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 border-l border-slate-100 pl-4">
                       <Star size={14} className="fill-amber-400 text-amber-400" />
                       {biz.rating}
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
                    <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                      <ExternalLink size={18} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
