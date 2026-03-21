import React from "react";
import { Zap, Sparkles, Gift, Star, Users, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function UnlockMore() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-8"
          >
            <Zap size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold mb-6 tracking-tight text-slate-900"
          >
            Step 3: Unlock <span className="text-amber-500">More Value</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 leading-relaxed mb-10"
          >
            The Slasham experience goes beyond just a single deal. Join our loyalty ecosystem to earn points, unlock exclusive perks, and enjoy VIP access to the best experiences in your city. Our loyalty program is designed to reward your engagement and make every interaction with Slasham more rewarding. Whether you're a casual user or a frequent redeemer, there's always something new to unlock.
          </motion.p>
          
          <div className="space-y-8">
            {[
              { title: "Earn Loyalty Points", desc: "Every redemption earns you points. 100 points = ₦1,000 in coupon credits. It's our way of saying thank you for choosing Slasham.", icon: <Star size={20} /> },
              { title: "Refer & Earn", desc: "Invite friends and get 500 bonus points when they make their first purchase. Share the joy of saving with your network.", icon: <Users size={20} /> },
              { title: "VIP Tier Access", desc: "Reach 'Gold' status to unlock early access to high-demand deals and exclusive events. VIP members get priority support and personalized offers.", icon: <ArrowUpRight size={20} /> }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex gap-5 items-start bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visual Loyalty Representation */}
        <div className="relative">
          <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-[100px]"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative space-y-4"
          >
            {/* Points Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Sparkles size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Balance</p>
                  <p className="text-3xl font-black text-slate-900">2,450 <span className="text-amber-500 text-sm">pts</span></p>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-amber-500 rounded-full"
                ></motion.div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>Silver Tier</span>
                <span>550 pts to Gold</span>
              </div>
            </div>

            {/* Perks Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
                <Gift className="text-amber-400 mb-4" size={24} />
                <h4 className="font-bold mb-1">Free Coupon</h4>
                <p className="text-slate-400 text-xs">Redeem 1,500 pts for any ₦1,000 deal.</p>
              </div>
              <div className="bg-amber-500 p-6 rounded-[2rem] text-slate-900">
                <Star className="text-white mb-4" size={24} />
                <h4 className="font-bold mb-1">Early Access</h4>
                <p className="text-slate-900/60 text-xs">Get deals 2 hours before everyone else.</p>
              </div>
            </div>

            {/* Referral Badge */}
            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Referral Bonus Active</p>
                <p className="text-xs text-slate-500">Earn 500 pts for every friend you invite.</p>
              </div>
              <div className="ml-auto">
                <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Invite</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-6 mb-12">
        <Sparkles className="text-amber-600 shrink-0" size={32} />
        <p className="text-amber-900 font-medium">
          <strong>Pro Tip:</strong> Check your dashboard for personalized offers and bonus point opportunities. We love rewarding our most active members.
        </p>
      </div>

      <div className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
        <h2 className="text-3xl font-bold mb-8">How to Get the Most Out of Slasham</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: "Stay Active", desc: "The more you redeem, the faster you climb the loyalty tiers." },
            { title: "Follow Us", desc: "Follow us on social media for flash deals and bonus point codes." },
            { title: "Complete Your Profile", desc: "A complete profile helps us show you deals you'll actually love." },
            { title: "Spread the Word", desc: "Refer friends and family to build your points balance even faster." }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold mb-2">{item.title}</h4>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
