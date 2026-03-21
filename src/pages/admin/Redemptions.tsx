import { Search, CheckCircle, Clock, User } from "lucide-react";
import { motion } from "motion/react";

const redemptions = [
  { id: "R-5521", user: "John Doe", merchant: "Zaza Lounge", deal: "RSVP Lagos Dinner", time: "2 hours ago", status: "Verified" },
  { id: "R-5522", user: "Sarah Smith", merchant: "Oasis Spa", deal: "Full Body Massage", time: "5 hours ago", status: "Verified" },
  { id: "R-5523", user: "Mike J.", merchant: "Pizza Hut", deal: "Large BBQ Chicken", time: "6 hours ago", status: "Pending" },
  { id: "R-5524", user: "Emily Brown", merchant: "Lagos Grill", deal: "Family Platter", time: "Yesterday", status: "Verified" },
  { id: "R-5525", user: "Alex Wilson", merchant: "Urban Fit", deal: "Day Pass", time: "Yesterday", status: "Flagged" },
];

export default function AdminRedemptions() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Redemption History</h1>
          <p className="text-slate-500 font-medium">Verify and audit merchant transaction logs</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-right">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-left" size={18} />
            <input 
              type="text" 
              placeholder="Search redemptions..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-left"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant / Deal</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {redemptions.map((r, idx) => (
                <motion.tr 
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{r.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-700">{r.merchant}</span>
                          <span className="text-xs text-slate-400 font-bold">{r.deal}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-400">{r.time}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      r.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 
                      r.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {r.status === 'Verified' && <CheckCircle size={10} />}
                      {r.status === 'Pending' && <Clock size={10} />}
                      {r.status}
                    </span>
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
