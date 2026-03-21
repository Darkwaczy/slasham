import { Search, CheckCircle, Clock } from "lucide-react";
import { motion } from "motion/react";

const disputes = [
  { id: "DIS-120", user: "John Doe", merchant: "Pizza Hut", reason: "Coupon Not Accepted", date: "2 hours ago", priority: "High", status: "Open" },
  { id: "DIS-121", user: "Sarah S.", merchant: "Oasis Spa", reason: "Double Charge", date: "5 hours ago", priority: "Critical", status: "In-Progress" },
  { id: "DIS-122", user: "Mike J.", merchant: "Lagos Grill", reason: "Misleading Deal", date: "Yesterday", priority: "Medium", status: "Resolved" },
  { id: "DIS-123", user: "Emily B.", merchant: "Skyline", reason: "Facility Closed", date: "Yesterday", priority: "High", status: "In-Progress" },
];

export default function AdminReports() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-right">Dispute Resolution</h1>
          <p className="text-slate-500 font-medium text-right">Administer and resolve customer conflicts</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-right">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-left" size={18} />
            <input 
              type="text" 
              placeholder="Search by case ID..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-left"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Case ID / User</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Partner</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Conflict / Issue</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Severity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {disputes.map((d, idx) => (
                <motion.tr 
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-rose-50/10 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{d.id}</span>
                      <span className="text-xs text-indigo-500 font-bold">{d.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{d.merchant}</td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">"{d.reason}"</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest outline outline-1 ${
                      d.priority === 'Critical' ? 'outline-rose-500/20 bg-rose-50 text-rose-600 shadow-sm shadow-rose-500/10' :
                      d.priority === 'High' ? 'outline-amber-500/20 bg-amber-50 text-amber-600' : 'outline-slate-200 bg-slate-50 text-slate-500'
                    }`}>
                      {d.priority}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className={`flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                      d.status === 'Resolved' ? 'text-emerald-500' : 'text-slate-400'
                    }`}>
                       {d.status === 'Resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                       {d.status}
                    </div>
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
