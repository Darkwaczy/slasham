import { ShoppingBag, ShieldCheck, Zap, Search, ArrowRight, Sparkles, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Coupon } from "../../utils/couponVerification";

export default function BuyCoupon() {
  const [purchasedCoupon] = useState<Coupon | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 pb-40">
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <div className="space-y-10">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-16 h-16 rounded-4xl bg-emerald-600 flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-600/20"
            >
              <ShoppingBag size={32} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-black mb-6 tracking-tighter text-slate-900 leading-none"
            >
              Acquire Your <br/><span className="text-emerald-500">Premium Asset</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 font-medium leading-relaxed"
            >
              Unlock exclusive liquidity at your favorite local spots. Our premium coupons are securely hashed tokens of value.
            </motion.p>
          </div>
          
          <div className="space-y-4">
            {[
              { title: "Browse Intelligence", desc: "Explore hand-picked selection of verified premium experiences.", icon: <Search size={20} /> },
              { title: "Secure Liquidation", desc: "Execute purchase securely via our merchant-trust protocol.", icon: <ShieldCheck size={20} /> },
              { title: "Instant Protocol", desc: "Receive your unique 12-digit protocol hash instantly.", icon: <Zap size={20} /> }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex gap-5 items-start bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-500 font-medium text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4">
             <button 
                onClick={() => window.location.href = "/deals"}
                className="group relative px-10 py-5 bg-emerald-500 text-white rounded-4xl font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-black shadow-2xl flex items-center gap-4"
             >
                <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                Browse Live Deals
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
             </button>
             <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Start your premium experience now</p>
          </div>
        </div>

        {/* Visual Coupon Representation */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!purchasedCoupon ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
              >
                {/* Coupon Top (Empty/Placeholder) */}
                <div className="bg-slate-100 p-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-slate-200">
                     <ShoppingBag size={40} />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Waiting for purchase initiation...</p>
                </div>
                <div className="p-12 space-y-6">
                   <div className="h-4 bg-slate-50 rounded-full w-3/4" />
                   <div className="h-4 bg-slate-50 rounded-full w-1/2" />
                   <div className="h-20 bg-slate-50 rounded-3xl" />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="coupon"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="relative bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
                
                {/* Coupon Top */}
                <div className="bg-emerald-600 p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16"></div>
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="text-2xl font-black tracking-tighter">Slasham</div>
                    <div className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <Sparkles size={12} /> Live Asset
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Premium Deployment</p>
                    <h2 className="text-4xl font-black mb-1 leading-none">VVIP EXPERIENCE</h2>
                    <p className="text-emerald-100 text-sm font-bold opacity-80 uppercase tracking-widest">The Orchid Bistro • Ikeja</p>
                  </div>
                </div>

                {/* Coupon Divider */}
                <div className="relative h-10 bg-white flex items-center px-4">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-10 bg-slate-50 rounded-r-full border-y border-r border-slate-100"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-10 bg-slate-50 rounded-l-full border-y border-l border-slate-100"></div>
                  <div className="w-full border-t-2 border-dashed border-slate-100"></div>
                </div>

                {/* Coupon Bottom */}
                <div className="p-10 bg-white">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Protocol Hash</p>
                      <p className="text-3xl font-black text-slate-900 font-mono tracking-tight">{purchasedCoupon.hash}</p>
                    </div>
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center text-slate-400">
                      <QrCode size={32} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-10 border-t border-slate-50 pt-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Generated</p>
                      <p className="text-sm text-slate-900 font-black">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                      <p className="text-sm text-emerald-600 font-black uppercase tracking-widest">Active Asset</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center gap-3">
                     <ShieldCheck className="text-emerald-500 shadow-sm" size={18} />
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Authorized Protocol</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-10 bg-white rounded-4xl border border-slate-100 shadow-xl shadow-emerald-500/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 bg-emerald-600 text-white rounded-bl-3xl font-black text-[9px] uppercase tracking-widest">Merchant Alert</div>
        <div className="w-20 h-20 bg-emerald-50 rounded-4xl flex items-center justify-center text-emerald-600 shrink-0">
           <Zap size={40} className="animate-pulse" />
        </div>
        <div className="space-y-2">
           <p className="text-lg font-black text-slate-900 leading-tight">Verification Success Protocol</p>
           <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
             Every acquired coupon represents a unique ledger entry. Merchants use the <strong>Secure Asset Validator</strong> to liquidate this hash. Once validated, the protocol prevents double-redemption via real-time blockchain simulation.
           </p>
        </div>
      </div>
    </div>
  );
}
