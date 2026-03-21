import { ArrowRight, Target, BarChart3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function MyBusinessBenefits() {
  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold text-slate-900 mb-6 tracking-tight">Grow Your Business with <span className="text-emerald-500">Slasham</span></h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Partner with Slasham to unlock new revenue streams, reach high-intent customers, and build lasting loyalty for your premium brand.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { title: "Targeted Reach", desc: "Connect with thousands of savvy, high-intent customers actively seeking premium experiences.", icon: <Target className="text-emerald-500" size={32} /> },
            { title: "Data-Driven Growth", desc: "Gain actionable insights into customer behavior and campaign performance to optimize your revenue.", icon: <BarChart3 className="text-blue-500" size={32} /> },
            { title: "Seamless Loyalty", desc: "Turn one-time visitors into loyal regulars with our integrated rewards and retention tools.", icon: <ShieldCheck className="text-amber-500" size={32} /> }
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (i * 0.1) }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl inline-block">{benefit.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-[3rem] p-16 text-white text-center"
        >
          <h2 className="text-4xl font-bold mb-8">Ready to take your business to the next level?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join our network of premium partners today and start reaching your full potential with Slasham.</p>
          <div className="flex justify-center gap-4">
            <Link to="/business/list" className="px-8 py-4 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition-all flex items-center gap-2">
              List Your Business <ArrowRight size={20} />
            </Link>
            <Link to="/merchant-dashboard" className="px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all">
              Merchant Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
