import { 
  Ticket, AlertCircle, TrendingUp, 
  ChevronRight, Activity, Wallet, Star,
  Gift, Users, ArrowUpRight, CheckCircle2,
  Pizza, ShieldCheck, Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getUserVouchers } from "../../utils/mockPersistence";

export default function UserDashboardOverview() {
  const [vouchers, setVouchers] = useState<any[]>([]);

  useEffect(() => {
    setVouchers(getUserVouchers());
    const handleUpdate = () => setVouchers(getUserVouchers());
    window.addEventListener('vouchersUpdate', handleUpdate);
    return () => window.removeEventListener('vouchersUpdate', handleUpdate);
  }, []);

  const activeCount = vouchers.filter(v => v.status === "Active").length;
  const expiringSoon = vouchers.find(v => v.status === "Active"); 

  const recentActivity = vouchers.slice(0, 3).map(v => ({
    id: v.id,
    type: v.status === "Redeemed" ? "Redemption" : "Purchase",
    title: v.title,
    date: v.status === "Redeemed" ? "Just now" : "Today",
    amount: v.price || v.original || "₦4,500",
    status: v.status === "Redeemed" ? "Redeemed" : "Successful",
    icon: v.status === "Redeemed" ? <Pizza size={16} /> : <ShieldCheck size={16} />
  }));

  const stats = [
    { title: "Active Vouchers", value: activeCount.toString(), icon: <Ticket size={24} />, color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600" },
    { title: "Points Earned", value: "2,450", icon: <Star size={24} />, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" },
    { title: "Total Savings", value: "₦15,000", icon: <TrendingUp size={24} />, color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
    { title: "Wallet Balance", value: "₦0.00", icon: <Wallet size={24} />, color: "bg-slate-900", light: "bg-slate-50", text: "text-slate-900" },
  ];

  const recommendations = [
    { id: 1, title: "7th Heaven Spa", deal: "50% OFF Signature Massage", image: "https://images.unsplash.com/photo-1544161515-4ae6ce6ca606?w=400&h=250&fit=crop", rating: "4.9" },
    { id: 2, title: "The Yellow Chilli", deal: "Buy 1 Get 1 Free Jollof", image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400&h=250&fit=crop", rating: "4.7" },
  ];

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Welcome Hero */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-12 text-white border border-slate-800"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12 text-center lg:text-left">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              Tier: Gold Member
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-none">Bonjour, <span className="text-emerald-500">John!</span></h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              You've saved <span className="text-white font-black underline decoration-emerald-500/40 decoration-4 underline-offset-4">₦15,000</span> this month. You're in the top 5% of smart spenders in Lagos!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/deals" className="px-10 py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2">
              Find New Deals <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className={`w-14 h-14 ${stat.light} ${stat.text} rounded-[1.25rem] flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
              {stat.icon}
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.title}</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Column: Activity & Recommendations */}
        <div className="lg:col-span-8 space-y-10">
          {/* Recent Activity */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-950/10">
                  <Activity size={22} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Pulse</h2>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Your latest interactions</p>
                </div>
              </div>
              <button className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Full History <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.5 }}
                  className="flex items-center justify-between p-5 rounded-4xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 shadow-sm transition-all group-hover:scale-105">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 tracking-tight leading-none mb-1.5">{activity.title}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                         {activity.type} <span className="w-1 h-1 rounded-full bg-slate-200" /> {activity.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 tracking-tight mb-1">{activity.amount}</p>
                    <div className="flex items-center justify-end gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${activity.status === 'Successful' || activity.status === 'Redeemed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                       <p className={`text-[10px] font-black uppercase tracking-widest ${activity.status === 'Successful' || activity.status === 'Redeemed' ? 'text-emerald-500' : 'text-amber-500'}`}>{activity.status}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* New: Recommended Deals */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Handpicked for You</h3>
                <Link to="/deals" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">View All Deals</Link>
             </div>
             <div className="grid md:grid-cols-2 gap-8">
                {recommendations.map((rec, i) => (
                  <motion.div 
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.7 }}
                    className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all h-[320px]"
                  >
                    <img src={rec.image} alt={rec.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                    
                    {/* Like Button */}
                    <button className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-all group/like">
                       <Heart size={20} className="group-active/like:scale-125 transition-transform" />
                    </button>

                    <div className="absolute bottom-0 left-0 p-8 w-full group-hover:translate-y-[-10px] transition-transform">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500 text-black rounded text-[10px] font-black uppercase tracking-widest">
                            <Star size={10} fill="currentColor" /> {rec.rating}
                         </div>
                      </div>
                      <h4 className="text-xl font-black text-white tracking-tight mb-2 leading-tight">{rec.title}</h4>
                      <p className="text-emerald-400 font-bold text-sm tracking-tight">{rec.deal}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
          </section>
        </div>

        {/* Right Column: Premium & Growth */}
        <div className="lg:col-span-4 space-y-10">
          {expiringSoon && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-linear-to-br from-rose-500 to-rose-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-rose-500/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                   <AlertCircle size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-black mb-3 leading-tight tracking-tight">Expiring Soon!</h3>
                <p className="text-rose-100/80 text-sm mb-10 leading-relaxed font-medium">
                  Your <span className="text-white font-black underline decoration-white/40 decoration-2 underline-offset-4">{expiringSoon.title}</span> voucher expires on {new Date(expiringSoon.expiryDate || Date.now() + 86400000).toLocaleDateString()}. Don't let it go to waste!
                </p>
                <Link to="/user/coupons" className="block w-full py-5 bg-white text-rose-600 rounded-[3rem] font-black text-xs text-center uppercase tracking-[0.2em] hover:bg-rose-50 transition-all shadow-xl active:scale-95">
                  Redeem Now
                </Link>
              </div>
            </motion.div>
          )}

          {/* New: Refer & Earn card */}
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 text-indigo-500/30 group-hover:scale-125 transition-transform duration-1000">
               <Gift size={180} />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600">
                     <Users size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Growth Program</span>
               </div>
               <h3 className="text-2xl font-black mb-3 tracking-tight">Invite Friends</h3>
               <p className="text-indigo-100/60 text-sm mb-8 leading-relaxed font-medium">Earn <span className="text-white font-bold">500 pts</span> for every friend who makes their first purchase.</p>
               <button className="px-6 py-3 bg-indigo-500 text-white border border-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all">
                  Copy Invite Link
               </button>
            </div>
          </div>

          {/* Pro Promotion */}
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white border border-slate-800 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                 <Star size={24} fill="#fbbf24" className="text-amber-400 group-hover:rotate-12 transition-transform" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Premium Upgrade</span>
              </div>
              <p className="text-slate-100/60 text-xs mb-8 leading-relaxed font-medium">Gain access to VIP-only lounge deals and 2x point multipliers on all weekend purchases.</p>
              
              <div className="space-y-4 mb-10">
                 {["Exclusive Access", "No Fees", "Priority Support"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item}</span>
                    </div>
                 ))}
              </div>

              <Link to="/user/settings" className="w-full py-4 bg-slate-800 border border-slate-700 hover:bg-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
