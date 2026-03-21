import { 
  CreditCard, Calendar, Download, 
  Search, Filter, Receipt, Wallet, 
  ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { motion } from "motion/react";

export default function OrdersPayments() {
  const transactions = [
    { id: "TX-9021", date: "Mar 18, 2026", type: "Voucher Purchase", merchant: "Zaza Lounge", amount: "₦12,500", status: "Completed", method: "Mastercard •• 4582" },
    { id: "TX-9020", date: "Mar 15, 2026", type: "Points Redemption", merchant: "Slasham Rewards", amount: "-500 pts", status: "Completed", method: "Points Wallet" },
    { id: "TX-9019", date: "Mar 12, 2026", type: "Voucher Purchase", merchant: "Oasis Spa", amount: "₦15,000", status: "Completed", method: "Visa •• 9012" },
    { id: "TX-9018", date: "Mar 08, 2026", type: "Wallet Top-up", merchant: "Slasham Pay", amount: "₦25,000", status: "Completed", method: "Bank Transfer" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
             <CreditCard size={12} fill="currentColor" />
             Financial Ledger
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Orders & Payments</h1>
           <p className="text-slate-500 font-medium tracking-tight">Track every transaction and manage your platform wallet.</p>
        </div>

        {/* Quick Balance Card */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center gap-8 shadow-2xl shadow-slate-900/10 min-w-[320px] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
           <div className="relative z-10 w-12 h-12 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg">
              <Wallet size={24} />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Available Balance</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black tracking-tight">₦0.00</span>
                 <button className="text-emerald-400 p-1 group/btn hover:scale-110 transition-transform">
                    <ArrowUpRight size={18} />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Transaction Table Section */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/20">
           <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Find a transaction..." 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder:font-medium focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
              />
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                 <Filter size={16} /> Filter
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                 <Download size={16} /> Export
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Details</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Receipt</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {transactions.map((tx, i) => (
                    <motion.tr 
                      key={tx.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.3 }}
                      className="hover:bg-slate-50/50 transition-colors group cursor-default"
                    >
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                tx.type.includes('Redemption') ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                             }`}>
                                {tx.type.includes('Redemption') ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">{tx.type}</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                   <Calendar size={12} /> {tx.date} <span className="w-1 h-1 rounded-full bg-slate-200" /> #{tx.id}
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-sm font-black text-slate-700">{tx.merchant}</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col items-start gap-1">
                             <span className="text-base font-black text-slate-900 tracking-tight">{tx.amount}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{tx.method}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             {tx.status}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="Download Receipt">
                             <Receipt size={18} />
                          </button>
                       </td>
                    </motion.tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/10 text-center">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing all recent transactions from Mar 2026</p>
        </div>
      </div>
    </div>
  );
}
