import { Search, Ticket, CheckCircle2, XCircle, Clock } from "lucide-react";
import { motion } from "motion/react";

const coupons = [
  { id: "C-9901", code: "SLASH50", user: "john@example.com", merchant: "Pizza Hut", status: "Active", value: "50% Off" },
  { id: "C-9902", code: "SPA2026", user: "sarah.s@gmail.com", merchant: "Oasis Spa", status: "Redeemed", value: "₦5,000" },
  { id: "C-9903", code: "GRILLFREE", user: "mike.j@outlook.com", merchant: "Lagos Grill", status: "Expired", value: "Free Drink" },
  { id: "C-9904", code: "MOVIEPASS", user: "emily.b@slasham.com", merchant: "Skyline", status: "Active", value: "Buy 1 Get 1" },
  { id: "C-9905", code: "GYMFIT", user: "alex.w@yahoo.com", merchant: "Urban Fit", status: "Redeemed", value: "1 Month Free" },
];

export default function AdminCoupons() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Voucher Ledger</h1>
          <p className="text-slate-500 font-medium">Track all issued and redeemed discount codes</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search voucher codes..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Voucher Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Value</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {coupons.map((c, idx) => (
                <motion.tr 
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Ticket size={18} className="text-indigo-400" />
                      <span className="font-black text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {c.code}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{c.user}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-700">{c.merchant}</td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">
                       {c.value}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                      c.status === 'Redeemed' ? 'text-emerald-500' : 
                      c.status === 'Active' ? 'text-indigo-500' : 'text-rose-500'
                    }`}>
                      {c.status === 'Redeemed' && <CheckCircle2 size={12} />}
                      {c.status === 'Active' && <Clock size={12} />}
                      {c.status === 'Expired' && <XCircle size={12} />}
                      {c.status}
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
