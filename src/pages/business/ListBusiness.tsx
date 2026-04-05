import React from "react";
import { Store, ArrowRight, CheckCircle2, Zap, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function ListBusiness() {
  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold text-slate-900 mb-6 tracking-tight">List Your <span className="text-emerald-500">Business</span></h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join the Slasham network and start reaching thousands of high-intent customers today. It's fast, easy, and designed to grow your revenue.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {[
              { title: "Easy Setup", desc: "Get your business profile live in minutes with our intuitive, user-friendly dashboard.", icon: <Zap className="text-emerald-500" /> },
              { title: "Instant Exposure", desc: "Reach thousands of local users actively searching for premium deals and experiences.", icon: <Users className="text-emerald-500" /> },
              { title: "Real-time Analytics", desc: "Track your redemptions, revenue, and customer insights in real-time.", icon: <BarChart3 className="text-emerald-500" /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (i * 0.1) }}
                className="flex gap-6 items-start bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="p-3 bg-emerald-50 rounded-2xl">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl text-center"
          >
            <Store className="text-emerald-500 mx-auto mb-8" size={64} />
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Ready to list?</h2>
            <p className="text-slate-500 mb-10 text-lg">Start your journey with Slasham and unlock new opportunities for your business.</p>
            <Link to="/business/register" className="inline-flex items-center gap-2 px-10 py-5 bg-emerald-500 text-white rounded-full font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">
              Get Started <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
