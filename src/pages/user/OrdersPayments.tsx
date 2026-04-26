import { 
  CreditCard, Calendar, Download, 
  Search, Filter, Receipt, Wallet, 
  ArrowUpRight, ArrowDownRight, Loader2, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";

export default function OrdersPayments() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const loadTransactions = async () => {
    try {
      const data = await apiClient("/user/transactions");
      setTransactions(data);
      const stats = await apiClient("/user/stats");
      setBalance(stats.wallet_balance || 0);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filtered = transactions.filter(tx => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || tx.type?.toLowerCase().includes(q) || tx.merchant?.toLowerCase().includes(q) || String(tx.id)?.includes(q);
    const matchStatus = statusFilter === "All" || tx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ["ID", "Type", "Merchant", "Amount", "Method", "Status", "Date"];
    const rows = filtered.map(tx => [tx.id, tx.type, tx.merchant, tx.amount, tx.method, tx.status, tx.date]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "slasham-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-slate-300" size={40} />
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                <CreditCard size={12} fill="currentColor" />
                Financial Ledger
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Orders &amp; Payments</h1>
              <p className="text-slate-500 font-medium tracking-tight">Track every transaction and manage your platform wallet.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center gap-8 shadow-2xl shadow-emerald-500/10 min-w-[320px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 w-12 h-12 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet size={24} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Available Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tight">₦{balance.toLocaleString()}</span>
                  <button className="text-emerald-400 p-1 hover:scale-110 transition-transform">
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/20">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a transaction..."
                  className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder:font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className={`flex items-center justify-center gap-2 px-6 py-3.5 border rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter !== "All" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Filter size={16} /> Filter{statusFilter !== "All" ? ` · ${statusFilter}` : ""}
                  </button>
                  {showFilterMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl p-2 z-50 min-w-[160px]">
                      {["All", "Successful", "Pending", "Failed"].map(s => (
                        <button
                          key={s}
                          onClick={() => { setStatusFilter(s); setShowFilterMenu(false); }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${statusFilter === s ? "bg-emerald-50 text-emerald-600" : "hover:bg-slate-50 text-slate-600"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExport}
                  disabled={filtered.length === 0}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download size={16} /> Export CSV
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
                  <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <Search size={40} className="text-slate-200 mx-auto mb-4" />
                          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No transactions found</p>
                        </td>
                      </tr>
                    ) : filtered.map((tx, i) => (
                      <motion.tr
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group cursor-default"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type?.includes("Redemption") ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
                              {tx.type?.includes("Redemption") ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
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
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/10 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {filtered.length} of {transactions.length} transactions
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
