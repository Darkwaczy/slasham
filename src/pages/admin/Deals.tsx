import { Search, Plus, Tag, Eye, TrendingUp, Calendar } from "lucide-react";
import { motion } from "motion/react";

const deals = [
  { id: "D-110", title: "50% Off Pizza Night", merchant: "Pizza Hut", category: "Dining", reached: "85%", status: "Active", expires: "2 days" },
  { id: "D-111", title: "Luxury Spa Weekend", merchant: "Oasis Spa", category: "Wellness", reached: "60%", status: "Active", expires: "5 days" },
  { id: "D-112", title: "Buy 1 Get 1 Free Grill", merchant: "Lagos Grill", category: "Food", reached: "100%", status: "Ended", expires: "Expired" },
  { id: "D-113", title: "Movie Marathon Pass", merchant: "Skyline", category: "Movies", reached: "15%", status: "Paused", expires: "12 days" },
  { id: "D-114", title: "Annual Gym Membership", merchant: "Urban Fit", category: "Health", reached: "45%", status: "Active", expires: "8 days" },
];

export default function AdminDeals() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Campaigns</h1>
          <p className="text-slate-500 font-medium">Monitor deal performance and redemption rates</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-600/10 hover:scale-105 transition-transform">
          <Plus size={18} /> Launch Campaign
        </button>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Deals", count: "450", color: "emerald", sub: "Currently Live" },
          { label: "Total Claims", count: "12,402", color: "blue", sub: "All time redemptions" },
          { label: "Avg Discount", count: "35%", color: "amber", sub: "Platform average" },
          { label: "Gross Value", count: "₦42.5M", color: "indigo", sub: "Locked liquidity" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
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
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter campaigns..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Deal Information</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Performance</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Time Left</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {deals.map((deal, idx) => (
                <motion.tr 
                  key={deal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center">
                        <Tag size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 mb-0.5">{deal.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{deal.category} • ID: {deal.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-700">{deal.merchant}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5 w-32">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                        <span>COUPONS</span>
                        <span className="text-indigo-600">{deal.reached}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: deal.reached }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 border-l border-slate-100 pl-4">
                       <Calendar size={14} />
                       {deal.expires}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                      <TrendingUp size={18} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                      <Eye size={18} />
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
