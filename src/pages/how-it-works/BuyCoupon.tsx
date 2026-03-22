import { ShoppingBag, CheckCircle2, Ticket, ShieldCheck, Zap, Search } from "lucide-react";
import { motion } from "motion/react";

export default function BuyCoupon() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-8"
          >
            <ShoppingBag size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold mb-6 tracking-tight text-slate-900"
          >
            How to Buy Your <span className="text-emerald-500">Premium Coupon</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 leading-relaxed mb-10"
          >
            Unlock exclusive discounts at your favorite local spots with Slasham. Our premium coupons are designed to give you the best value for every experience, from dining to wellness.
          </motion.p>
          
          <div className="space-y-8">
            {[
              { title: "Browse Premium Deals", desc: "Explore our hand-picked selection of premium experiences and local favorites.", icon: <Search size={20} /> },
              { title: "Secure Your Coupon", desc: "Click 'Buy Now' and complete your purchase securely using your preferred payment method.", icon: <ShoppingBag size={20} /> },
              { title: "Instant Access", desc: "Receive your unique 6-digit coupon code instantly via SMS and email.", icon: <Zap size={20} /> }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex gap-5 items-start bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visual Coupon Representation */}
        <div className="relative">
          <div className="absolute -inset-10 bg-emerald-500/10 rounded-full blur-[100px]"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Coupon Top */}
            <div className="bg-emerald-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="text-2xl font-black tracking-tighter">Slasham</div>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">Verified Deal</div>
              </div>
              <div className="relative z-10">
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Exclusive Offer</p>
                <h2 className="text-4xl font-bold mb-1">30% OFF TOTAL BILL</h2>
                <p className="text-emerald-100 text-sm font-medium">The Orchid Bistro • Ikeja GRA</p>
              </div>
            </div>

            {/* Coupon Divider */}
            <div className="relative h-8 bg-white flex items-center px-4">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-50 rounded-r-full border-y border-r border-slate-100"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-50 rounded-l-full border-y border-l border-slate-100"></div>
              <div className="w-full border-t-2 border-dashed border-slate-100"></div>
            </div>

            {/* Coupon Bottom */}
            <div className="p-8 bg-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Coupon Code</p>
                  <p className="text-3xl font-black text-slate-900 tracking-[0.2em]">SL-8291</p>
                </div>
                <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                  <Ticket size={32} className="text-slate-300" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Purchase Date</span>
                  <span className="text-slate-900 font-bold">21 Mar 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Valid Until</span>
                  <span className="text-rose-500 font-bold">20 Apr 2026</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3 text-emerald-600">
                  <ShieldCheck size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Secured by Slasham</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-6">
        <CheckCircle2 className="text-emerald-600 shrink-0" size={32} />
        <p className="text-emerald-900 font-medium">
          <strong>Pro Tip:</strong> Your coupon is valid for 30 days unless stated otherwise. Check the deal details for specific validity periods.
        </p>
      </div>
    </div>
  );
}
