import React from "react";
import { Store, MapPin, Smartphone, CheckCircle2, QrCode, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function VisitBusiness() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <div className="order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px]"></div>
            <div className="relative bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-12">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <Store size={24} />
                </div>
                <div className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
                  Live Verification
                </div>
              </div>

              <div className="text-center mb-12">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Merchant Portal</p>
                <h3 className="text-white text-2xl font-bold mb-8">Redeem Voucher</h3>
                
                <div className="flex justify-center gap-3 mb-8">
                  {[8, 2, 9, 1, '•', '•'].map((char, i) => (
                    <div key={i} className="w-12 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-white">
                      {char}
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 inline-flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 size={20} />
                  <span className="font-bold">Voucher Valid: 30% Discount Applied</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Terminal ID: #ABJ-042</span>
                <span>12:45 PM</span>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Smartphone size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Phone</p>
                <p className="text-sm font-bold text-slate-900">Code: SL-8291</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-8"
          >
            <Store size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold mb-6 tracking-tight text-slate-900"
          >
            Step 2: Visit the <span className="text-blue-600">Business</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 leading-relaxed mb-10"
          >
            Experience the premium service you've been waiting for. Your Slasham coupon is your golden ticket to instant savings at our partner venues. We've hand-picked the best businesses in your city to ensure that every redemption is a memorable experience. From fine dining to relaxing spa treatments, your next great experience is just a few clicks away.
          </motion.p>

          <div className="space-y-8">
            {[
              { title: "Arrive at Venue", desc: "Visit the business during their operating hours. No need to print anything. Just show up and enjoy.", icon: <MapPin size={20} /> },
              { title: "Present Your Code", desc: "Show your 6-digit code to the staff before you request your bill. It's that simple.", icon: <QrCode size={20} /> },
              { title: "Instant Discount", desc: "The staff verifies the code and applies the discount to your final bill instantly. No hidden fees or complex processes.", icon: <CheckCircle2 size={20} /> }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex gap-5 items-start bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
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
      </div>

      <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-6 mb-12">
        <MapPin className="text-blue-600 shrink-0" size={32} />
        <p className="text-blue-900 font-medium">
          <strong>Pro Tip:</strong> Always mention you're using a Slasham deal when you arrive to ensure a smooth redemption process.
        </p>
      </div>

      <div className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
        <h2 className="text-3xl font-bold mb-8">What to Expect</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Warm Welcome", desc: "Our partner businesses are trained to recognize Slasham users and provide excellent service." },
            { title: "Seamless Redemption", desc: "The redemption process is designed to be quick and hassle-free." },
            { title: "Premium Experience", desc: "Enjoy the same high-quality service as any other customer, with the added benefit of your Slasham deal." }
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
