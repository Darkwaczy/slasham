import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ArrowRight, Ticket } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const reference = params.get("reference");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/coupons");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/30"
      >
        <Check size={48} className="text-white" strokeWidth={3} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 max-w-md"
      >
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-2">Payment Successful!</h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          Your transaction was processed successfully. Your voucher is being generated and added to your dashboard.
        </p>
        
        <div className="py-8">
            <div className="inline-flex flex-col items-center gap-2 p-6 bg-slate-50 rounded-4xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Reference</span>
                <span className="text-sm font-black text-slate-900 font-mono tracking-wider">{reference}</span>
            </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-4">
            <button 
                onClick={() => navigate("/user/coupons")}
                className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95"
            >
                View My Coupons
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-2 text-slate-400">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">Redirecting in 5 seconds...</span>
            </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-20 opacity-10 -rotate-12 text-slate-300">
        <Ticket size={120} />
      </div>
      <div className="fixed bottom-20 right-20 opacity-10 rotate-12 text-slate-300">
        <Ticket size={120} />
      </div>
    </div>
  );
}
