import { 
  Ticket, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  Calendar,
  DollarSign,
  Search
} from "lucide-react";
import { motion } from "motion/react";

export default function MerchantDashboard() {
  const stats = [
    { label: "Total Revenue", value: "₦1,240,000", change: "+12.5%", icon: <DollarSign size={20} />, color: "emerald" },
    { label: "Active Deals", value: "8", change: "0", icon: <Ticket size={20} />, color: "blue" },
    { label: "New Customers", value: "142", change: "+18%", icon: <Users size={20} />, color: "purple" },
    { label: "Conversion Rate", value: "24.8%", change: "+2.4%", icon: <TrendingUp size={20} />, color: "amber" },
  ];

  const recentRedemptions = [
    { id: "SL-8291", customer: "Adebayo Tunde", deal: "30% Off Lunch Buffet", time: "2 mins ago", status: "Verified" },
    { id: "SL-8290", customer: "Sarah Johnson", deal: "Spa Day Package", time: "15 mins ago", status: "Verified" },
    { id: "SL-8289", customer: "Chidi Okafor", deal: "Buy 1 Get 1 Cocktail", time: "1 hour ago", status: "Verified" },
    { id: "SL-8288", customer: "Fatima Yusuf", deal: "30% Off Lunch Buffet", time: "3 hours ago", status: "Verified" },
    { id: "SL-8287", customer: "John Bull", deal: "Large BBQ Chicken", time: "5 hours ago", status: "Verified" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back, Orchid Bistro</h1>
            <p className="text-slate-500 font-medium">Your business performance is looking strong today.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
                Download Reports
             </button>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Redemptions */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div>
               <h3 className="font-black text-xl text-slate-900 tracking-tight">Recent Claims</h3>
               <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Real-time validation log</p>
            </div>
            <button className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700">View History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentRedemptions.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5 font-mono text-xs font-black text-slate-400 group-hover:text-emerald-600 transition-colors truncate max-w-[100px]">{r.id}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-700">{r.customer}</td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col min-w-[200px]">
                          <span className="text-sm font-black text-slate-900 leading-none mb-1">{r.deal}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.time}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Validation Tool */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 tracking-tight leading-none">Instant Validation</h3>
              <p className="text-slate-400 text-sm mb-10 font-medium leading-relaxed">Enter the customer's 6-digit verification code to process the redemption.</p>
              
              <div className="space-y-6">
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity" />
                   <input 
                    type="text" 
                    placeholder="0 0 0 0 0 0" 
                    className="relative w-full bg-slate-800/50 border border-white/10 rounded-2xl py-6 px-4 text-white placeholder:text-slate-700 focus:outline-none focus:bg-slate-800 focus:border-emerald-500/50 transition-all text-center text-3xl font-black tracking-[0.6em]"
                   />
                </div>
                <button className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 active:scale-95 transition-all shadow-xl shadow-emerald-500/20">
                  Verify & Process
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h3 className="font-black text-xl text-slate-900 tracking-tight mb-8">Quick Support</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] hover:bg-emerald-50 transition-all group border border-transparent hover:border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-sm group-hover:text-emerald-600 transition-colors">
                    <Calendar size={18} />
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight">Booking Policy</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500 transition-all" />
              </a>
              <a href="#" className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] hover:bg-emerald-50 transition-all group border border-transparent hover:border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-sm group-hover:text-emerald-600 transition-colors">
                    <Search size={18} />
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight">Merchant Guide</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
