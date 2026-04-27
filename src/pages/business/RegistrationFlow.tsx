import { User, Store, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function RegistrationFlow() {
  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold text-slate-900 mb-6 tracking-tight">How do you want to <span className="text-emerald-500">register?</span></h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Choose your path to get started with Slasham.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/signup?type=business" className="group block bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
              <div className="p-6 bg-emerald-50 rounded-3xl inline-block mb-8 group-hover:scale-110 transition-transform">
                <Store className="text-emerald-500" size={64} />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900">Business Owner</h2>
              <p className="text-slate-600 mb-10 leading-relaxed">Register your business, create premium deals, and reach thousands of high-intent customers.</p>
              <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-lg group-hover:gap-4 transition-all">
                Register as Business <ArrowRight size={20} />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/signup?type=user" className="group block bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
              <div className="p-6 bg-blue-50 rounded-3xl inline-block mb-8 group-hover:scale-110 transition-transform">
                <User className="text-blue-500" size={64} />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900">User</h2>
              <p className="text-slate-600 mb-10 leading-relaxed">Register as a user to start saving on premium deals and enjoy exclusive experiences.</p>
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg group-hover:gap-4 transition-all">
                Register as User <ArrowRight size={20} />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
