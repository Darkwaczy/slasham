import { Ticket, Plus, Search, Target, Eye } from "lucide-react";
import { motion } from "motion/react";

const campaigns = [
  { id: "C-101", name: "Lunch Buffet Special", type: "Discount", status: "Active", reach: "2.4k", redeemed: "142", expiry: "12 Days left" },
  { id: "C-102", name: "Spa Relaxation", type: "Voucher", status: "Active", reach: "1.1k", redeemed: "56", expiry: "5 Days left" },
  { id: "C-103", name: "Weekend Getaway", type: "Stay", status: "Scheduled", reach: "0", redeemed: "0", expiry: "Starts in 2 Days" },
];

export default function MerchantCampaigns() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Management</h1>
          <p className="text-slate-500 font-medium">Create and track your business offers</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/10 hover:scale-105 active:scale-95 transition-all">
          <Plus size={18} /> Launch New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                 <Target size={20} />
              </div>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Trials</span>
           </div>
           <p className="text-3xl font-black text-slate-900">42</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                 <Eye size={20} />
              </div>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Reach</span>
           </div>
           <p className="text-3xl font-black text-slate-900">12.5k</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                 <Ticket size={20} />
              </div>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Redemption Rate</span>
           </div>
           <p className="text-3xl font-black text-slate-900">24%</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
           <h3 className="font-black text-lg">Your Offers</h3>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search campaigns..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Reach</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Redeemed</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {campaigns.map((c, idx) => (
                <motion.tr 
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 leading-none mb-1">{c.name}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{c.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-slate-600">{c.reach}</td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-slate-600">{c.redeemed}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {c.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">{c.expiry}</p>
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
