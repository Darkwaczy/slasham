import { 
  Gift, Users, Star, Copy, 
  TrendingUp, Award, Zap, History, ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { getUserPoints } from "../../utils/userPersistence";

export default function RewardsReferrals() {
  const [pointsData, setPointsData] = useState<any>(null);

  useEffect(() => {
    const load = () => setPointsData(getUserPoints());
    load();
    window.addEventListener('userDataUpdate', load);
    return () => window.removeEventListener('userDataUpdate', load);
  }, []);

  if (!pointsData) return null;
  const { total, history, referrals } = pointsData;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Hero: Points & Tier */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <Star size={12} fill="currentColor" />
                    Tier: Lagos Elite
                 </div>
                 <h2 className="text-4xl font-black tracking-tight leading-none">Your Reward Balance</h2>
                 <p className="text-slate-400 font-medium">Earn more points by sharing the love with your friends.</p>
              </div>
              <div className="text-center md:text-right">
                 <p className="text-6xl font-black text-emerald-500 tracking-tighter mb-1">{total.toLocaleString()}</p>
                 <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Total Points</p>
              </div>
           </div>
           
           <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                 { label: "Points Earned", val: "5,200", icon: <TrendingUp size={14} /> },
                 { label: "Vouchers Unlocked", val: "14", icon: <Award size={14} /> },
                 { label: "Referrals", val: "12", icon: <Users size={14} /> },
              ].map((stat, i) => (
                 <div key={i}>
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                       {stat.icon}
                       <span className="text-[10px] font-black uppercase tracking-widest leading-none">{stat.label}</span>
                    </div>
                    <p className="text-xl font-bold">{stat.val}</p>
                 </div>
              ))}
           </div>
        </div>

        <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-500/20 flex flex-col justify-between">
           <div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                 <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">Boost Points</h3>
              <p className="text-indigo-100/80 text-sm leading-relaxed font-medium">Upgrade to <span className="text-white font-black underline decoration-white/40 decoration-2 underline-offset-4">Pro</span> and get a 2x multiple on all points for life!</p>
           </div>
           <button className="w-full mt-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
              Upgrade Now
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
         {/* Referral Program */}
         <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Invite & Earn</h3>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Get 500 points per friend</p>
                  </div>
                  <Gift size={40} className="text-slate-100" />
               </div>

               <div className="p-8 bg-slate-50 rounded-4xl border border-dashed border-slate-200 text-center space-y-6">
                  <p className="text-sm font-bold text-slate-500">Your Unique Invite Code</p>
                  <div className="flex items-center justify-center gap-3">
                     <span className="text-3xl font-black text-slate-900 tracking-widest">SLASH-JD-2026</span>
                     <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <Copy size={20} />
                     </button>
                  </div>
               </div>

               <div className="mt-10 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2 pb-2 border-b border-slate-50">Recent Invites</h4>
                  {referrals.map((r: any) => (
                     <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-xs">
                              {r.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900">{r.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.date}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-[10px] font-black uppercase tracking-widest ${r.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{r.status}</p>
                           <p className="text-xs font-black text-slate-900">{r.reward}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Points History Sidebar */}
         <div className="lg:col-span-5">
            <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-full">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                        <History size={18} />
                     </div>
                     <h3 className="text-xl font-black text-slate-900 tracking-tight">Points Activity</h3>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                     <ChevronRight size={20} />
                  </button>
               </div>

               <div className="space-y-6">
                  {history.map((h: any, idx: number) => (
                     <motion.div 
                        key={h.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between group"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                           <div>
                              <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{h.activity}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h.date}</p>
                           </div>
                        </div>
                        <span className="text-sm font-black text-emerald-600 tracking-tight">{h.pts}</span>
                     </motion.div>
                  ))}
               </div>

              <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="relative z-10 text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Next Goal: Platinum</p>
                     <div className="h-2 bg-white rounded-full overflow-hidden mb-4">
                        <div className={`h-full bg-emerald-500`} style={{ width: `${Math.min((total / 5000) * 100, 100)}%` }} />
                     </div>
                     <p className="text-xs font-bold text-slate-600">{Math.max(5000 - total, 0).toLocaleString()} pts until next tier unlock</p>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
