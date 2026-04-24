import { 
  Ticket, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  Calendar,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateCoupon } from "../utils/couponVerification";

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const [validationCode, setValidationCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null);

  const stats = [
    { label: "Total Revenue", value: "₦1,240,000", change: "+12.5%", icon: <DollarSign size={20} />, color: "emerald" },
    { label: "Active Deals", value: "8", change: "0", icon: <Ticket size={20} />, color: "indigo" },
    { label: "New Customers", value: "142", change: "+18%", icon: <Users size={20} />, color: "rose" },
    { label: "Conversion Rate", value: "24.8%", change: "+2.4%", icon: <TrendingUp size={20} />, color: "amber" },
  ];

  const [redemptions, setRedemptions] = useState([
    { id: "SL-8291", customer: "Adebayo Tunde", deal: "30% Off Lunch Buffet", time: "2 mins ago", status: "Verified" },
    { id: "SL-8290", customer: "Sarah Johnson", deal: "Spa Day Package", time: "15 mins ago", status: "Verified" },
    { id: "SL-8289", customer: "Chidi Okafor", deal: "Buy 1 Get 1 Cocktail", time: "1 hour ago", status: "Verified" },
    { id: "SL-8288", customer: "Fatima Yusuf", deal: "30% Off Lunch Buffet", time: "3 hours ago", status: "Verified" },
    { id: "SL-8287", customer: "John Bull", deal: "Large BBQ Chicken", time: "5 hours ago", status: "Verified" },
  ]);

  const formatCode = (val: string) => {
    // Remove all non-alphanumeric and limit raw characters to 12
    const raw = val.replace(/[^A-Za-z0-9]/g, "").slice(0, 12).toUpperCase();
    
    // Auto-inject hyphens: XXXX-XXXX-XXXX
    let formatted = "";
    for (let i = 0; i < raw.length; i++) {
        if (i === 4 || i === 8) {
            formatted += "-";
        }
        formatted += raw[i];
    }
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationCode(formatCode(e.target.value));
  };

  const handleValidation = async () => {
    if (!validationCode.trim()) return;
    
    setIsValidating(true);
    setValidationResult(null);

    // Simulate verification protocol
    setTimeout(() => {
      const result = validateCoupon(validationCode.trim().toUpperCase());
      setValidationResult(result);
      setIsValidating(false);
      
      if (result.success) {
        setValidationCode("");
        // Add to the local list for immediate visual feedback
        setRedemptions(prev => [{
           id: validationCode.toUpperCase(),
           customer: "Verified Customer",
           deal: "Active Campaign Redemption",
           time: "Just now",
           status: "Verified"
        }, ...prev.slice(0, 4)]);
      }
    }, 1200);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Welcome back, Orchid Bistro</h1>
            <p className="text-slate-500 font-medium">Your business performance is looking strong today.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => alert("Report generation started. Security token: SLSH-DASH-REPORTS")}
               className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:scale-105 active:scale-95 transition-all"
             >
                Download Reports
             </button>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-7 rounded-[2.5rem] border shadow-sm transition-all group relative overflow-hidden hover:-translate-y-1 duration-300 ${
                stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100' :
                stat.color === 'indigo' ? 'bg-indigo-50 border-indigo-100' :
                stat.color === 'rose' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 backdrop-blur-sm shadow-sm ${
                  stat.color === 'emerald' ? 'bg-white/60 text-emerald-600' :
                  stat.color === 'indigo' ? 'bg-white/60 text-indigo-600' :
                  stat.color === 'rose' ? 'bg-white/60 text-rose-600' : 'bg-white/60 text-amber-600'
              }`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                  stat.change.startsWith('+') ? 
                  (stat.color === 'emerald' ? 'text-emerald-700 bg-emerald-100/50' : 'text-emerald-600 bg-emerald-50') : 
                  'text-slate-500 bg-slate-50'
              }`}>
                {stat.change} <ArrowUpRight size={12} className="inline-block" />
              </span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
                stat.color === 'emerald' ? 'text-emerald-500' :
                stat.color === 'indigo' ? 'text-indigo-500' :
                stat.color === 'rose' ? 'text-rose-500' : 'text-amber-500'
            }`}>{stat.label}</p>
            <p className={`text-4xl font-black tracking-tighter ${
                stat.color === 'emerald' ? 'text-emerald-700' :
                stat.color === 'indigo' ? 'text-indigo-700' :
                stat.color === 'rose' ? 'text-rose-700' : 'text-amber-700'
            }`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Redemptions */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div>
               <h3 className="font-black text-xl text-slate-900 tracking-tight leading-none mb-1">Clearance Log</h3>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Real-time liquidation ledger</p>
            </div>
            <button 
              onClick={() => navigate("/merchant/qr-scanner")}
              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 transition-all"
            >
              Terminal Console
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Artifact Unit</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {redemptions.map((r, i) => (
                    <motion.tr 
                      key={r.id + i} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      <td className="px-8 py-5 font-mono text-[10px] font-black text-slate-400 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">{r.id}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-700">{r.customer}</td>
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-none mb-1">{r.deal}</span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{r.time}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-100">
                          <CheckCircle2 size={12} />
                          {r.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Validation Tool */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-emerald-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-2xl font-black mb-3 tracking-tight leading-none">Instant Validation</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed opacity-70 italic">Input 12-digit protocol hash from customer wallet.</p>
              </div>
              
              <div className="space-y-6">
                <div className="relative group">
                   <div className={`absolute -inset-0.5 rounded-2xl opacity-20 blur transition-all duration-500 ${isValidating ? 'bg-emerald-500 opacity-60 animate-pulse' : 'bg-white opacity-10 group-focus-within:opacity-30'}`} />
                   <input 
                    type="text" 
                    value={validationCode}
                    onChange={handleInputChange}
                    placeholder="SLSH-XXXX-XXXX" 
                    className="relative w-full bg-slate-800/80 border border-white/10 rounded-2xl py-6 px-4 text-white placeholder:text-slate-700 focus:outline-none focus:bg-slate-800 focus:border-emerald-500/50 transition-all text-center text-xl font-black tracking-widest uppercase"
                   />
                </div>

                <AnimatePresence>
                  {validationResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border ${
                        validationResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {validationResult.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {validationResult.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={handleValidation}
                  disabled={isValidating || !validationCode.trim()}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                    isValidating 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20'
                  }`}
                >
                  {isValidating ? (
                   <>
                     <Clock className="animate-spin" size={18} /> Validating...
                   </>
                  ) : (
                    <>
                      <ShieldCheck size={18} /> Execute Clearance
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Users size={80} />
            </div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight mb-8">Business Support</h3>
            <div className="space-y-4 relative z-10">
              <a href="#" className="flex items-center justify-between p-5 bg-slate-50 rounded-4xl hover:bg-emerald-50 transition-all group border border-transparent hover:border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-sm group-hover:text-emerald-600 transition-colors">
                    <Calendar size={18} />
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight">Booking Policy</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500 transition-all" />
              </a>
              <a href="#" className="flex items-center justify-between p-5 bg-slate-50 rounded-4xl hover:bg-emerald-50 transition-all group border border-transparent hover:border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-sm group-hover:text-emerald-600 transition-colors">
                    <Search size={18} />
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight">System Guide</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
