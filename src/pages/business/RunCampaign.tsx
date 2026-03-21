import React from "react";
import { TrendingUp, Target, Users, Zap, BarChart3, Rocket, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function RunCampaign() {
  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold text-slate-900 mb-6 tracking-tight">Run a <span className="text-emerald-500">Campaign</span></h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Boost your visibility and drive immediate action with targeted campaigns designed to reach your ideal customers.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="mb-8 p-4 bg-slate-50 rounded-2xl inline-block"><TrendingUp className="text-blue-500" size={40} /></div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Targeted Marketing</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">Create custom campaigns to reach specific demographics in your city. Whether you want to fill seats on a slow Tuesday or launch a new menu item, Slasham provides the tools to make it happen.</p>
            <ul className="space-y-5">
              {[
                { title: "Instant Visibility", icon: <Zap className="text-emerald-500" /> },
                { title: "High-Intent Audience", icon: <Target className="text-emerald-500" /> },
                { title: "Detailed Analytics", icon: <BarChart3 className="text-emerald-500" /> },
                { title: "Verified Results", icon: <ShieldCheck className="text-emerald-500" /> }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 font-medium text-slate-700">
                  <div className="p-1 bg-emerald-50 rounded-full">{item.icon}</div> {item.title}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 p-10 rounded-3xl text-white flex flex-col justify-center"
          >
            <Rocket className="text-emerald-400 mb-8" size={48} />
            <h2 className="text-4xl font-bold mb-6">Get Started</h2>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">Ready to boost your business? Our campaign manager makes it easy to set up, track, and optimize your deals for maximum impact.</p>
            <button className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
              Launch Campaign
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
