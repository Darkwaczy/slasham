import { Search, Clock } from "lucide-react";
import { motion } from "motion/react";

const customers = [
  { id: "CUST-001", name: "Adebayo Tunde", email: "tunde@example.com", visits: "12", spent: "₦42k", lastVisit: "2 hours ago", status: "Gold Member" },
  { id: "CUST-002", name: "Sarah J.", email: "sarah@example.com", visits: "5", spent: "₦18k", lastVisit: "Yesterday", status: "Member" },
  { id: "CUST-003", name: "Mike J.", email: "mike@example.com", visits: "2", spent: "₦6.5k", lastVisit: "3 Days ago", status: "Member" },
  { id: "CUST-004", name: "Emily B.", email: "emily@example.com", visits: "24", spent: "₦85k", lastVisit: "Just now", status: "Platinum" },
];

export default function MerchantCustomers() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer CRM</h1>
          <p className="text-slate-500 font-medium">Build loyalty and track your best customers</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-8 text-right">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
           <h3 className="font-black text-lg text-slate-800 tracking-tight">Active Client List</h3>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-left" size={16} />
              <input type="text" placeholder="Search customers..." className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 w-64 text-left" />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Visits</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Revenue</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((c, idx) => (
                <motion.tr 
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs">
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 leading-none mb-1">{c.name}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{c.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-slate-600 underline decoration-emerald-500/30 decoration-2 underline-offset-4">{c.visits}</td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-slate-600 underline decoration-indigo-500/30 decoration-2 underline-offset-4">{c.spent}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      c.status.includes('Platinum') ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 
                      c.status.includes('Gold') ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' : 'bg-slate-50 text-slate-500 border border-slate-100'
                    }`}>
                      {c.status}
                    </span>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-2 font-bold opacity-60">
                        <Clock size={10} />
                        {c.lastVisit}
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
