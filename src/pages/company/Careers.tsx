import React from "react";
import { motion } from "motion/react";
import { Briefcase, Zap, Heart, Globe } from "lucide-react";

export default function Careers() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-8 text-slate-900"
      >
        Join <span className="text-emerald-500">Slasham</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-slate-600 mb-12 leading-relaxed"
      >
        We are building the future of local commerce. Join our team and help us empower businesses and delight customers.
      </motion.p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {[
          { title: "Innovation", desc: "We push boundaries and challenge the status quo.", icon: <Zap className="text-amber-500" /> },
          { title: "Growth", desc: "We provide opportunities to learn and advance your career.", icon: <Briefcase className="text-blue-500" /> },
          { title: "Culture", desc: "We foster a supportive and inclusive environment.", icon: <Heart className="text-rose-500" /> },
          { title: "Global Impact", desc: "We are making a real difference in local communities.", icon: <Globe className="text-emerald-500" /> }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
        <p className="text-slate-500 mb-8">We don't have any open positions right now, but we are always looking for talented people.</p>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors">
          Send us your CV
        </button>
      </div>
    </div>
  );
}
