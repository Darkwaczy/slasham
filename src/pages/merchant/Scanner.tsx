import { useState, useEffect } from "react";
import { QrCode, ShieldCheck, History, Search, CheckCircle2, XCircle, Clock, MapPin, Tag, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { validateCoupon, getVerifiedCoupons, Coupon } from "../../utils/couponVerification";
import { getPersistentDeals } from "../../utils/mockPersistence";

export default function MerchantScanner() {
  const [couponHash, setCouponHash] = useState("");
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string; deal?: any } | null>(null);
  const [recentRedemptions, setRecentRedemptions] = useState<Coupon[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const all = getVerifiedCoupons();
    // Only show redeemed coupons for "History"
    const redeemed = all.filter(c => c.redeemed).sort((a, b) => 
      new Date(b.redeemedAt || 0).getTime() - new Date(a.redeemedAt || 0).getTime()
    );
    setRecentRedemptions(redeemed.slice(0, 5));
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponHash.trim()) return;

    setIsValidating(true);
    // Simulate network verification delay
    setTimeout(() => {
      const result = validateCoupon(couponHash.trim().toUpperCase());
      
      let dealInfo = null;
      if (result.success) {
        // Find the deal info to show the merchant what they are giving out
        const coupons = getVerifiedCoupons();
        const coupon = coupons.find(c => c.hash === couponHash.trim().toUpperCase());
        if (coupon) {
          const allDeals = getPersistentDeals();
          dealInfo = allDeals.find(d => String(d.id) === String(coupon.dealId));
        }
      }

      setValidationResult({ ...result, deal: dealInfo });
      setIsValidating(false);
      loadHistory();
      if (result.success) setCouponHash("");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Header Section */}
      <div className="text-center space-y-3">
         <div className="w-16 h-16 bg-emerald-600 rounded-4xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/20 mb-6">
            <QrCode className="text-white" size={32} />
         </div>
         <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Secure Asset Validator</h1>
         <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">Enter the 12-digit protocol hash from the customer's digital wallet to authorize service.</p>
      </div>

      {/* Main Scanner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <form onSubmit={handleValidate} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700" />
             
             <div className="relative space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block px-2">Verification Protocol</label>
                  <div className="relative">
                    <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isValidating ? 'text-emerald-500' : 'text-slate-300'}`} size={24} />
                    <input 
                      type="text"
                      value={couponHash}
                      onChange={(e) => setCouponHash(e.target.value)}
                      placeholder="SLSH-XXXX-XXXX"
                      className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-xl font-black tracking-widest text-slate-900 placeholder:text-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all uppercase"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isValidating || !couponHash.trim()}
                  className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                    isValidating 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'
                  }`}
                >
                  {isValidating ? (
                    <>
                      <Clock className="animate-spin" size={20} /> Querying Blockchain...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} /> Authorize Disposal
                    </>
                  )}
                </button>
             </div>
          </form>

          {/* Validation Feedback */}
          <AnimatePresence mode="wait">
            {validationResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`p-8 rounded-4xl border flex flex-col items-center text-center gap-4 ${
                  validationResult.success 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                    : 'bg-rose-50 border-rose-100 text-rose-900'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                  validationResult.success ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-rose-600 text-white shadow-rose-500/20'
                }`}>
                  {validationResult.success ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight">{validationResult.success ? "Clearance Authorized" : "Verification Failed"}</h3>
                  <p className="text-sm font-medium opacity-70 uppercase tracking-widest">{validationResult.message}</p>
                </div>

                {validationResult.deal && (
                  <div className="w-full mt-6 bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/20 flex flex-col md:flex-row items-center gap-6">
                    <img src={validationResult.deal.image} className="w-24 h-24 rounded-2xl object-cover shadow-lg" alt="" />
                    <div className="text-left space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Asset</p>
                       <h4 className="text-xl font-black leading-tight">{validationResult.deal.title}</h4>
                       <div className="flex gap-4">
                          <span className="flex items-center gap-1.5 text-xs font-bold"><Tag size={12} className="opacity-50" /> {validationResult.deal.price}</span>
                          <span className="flex items-center gap-1.5 text-xs font-bold"><MapPin size={12} className="opacity-50" /> {validationResult.deal.location}</span>
                       </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setValidationResult(null)}
                   className="mt-4 px-8 py-3 bg-white/20 hover:bg-white/40 transition-colors rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Clear Terminal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History / Recent Panel */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 px-2">
                 <div className="flex items-center gap-2">
                    <History size={18} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ledger History</span>
                 </div>
                 <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black tracking-widest">REALTIME</span>
              </div>

              <div className="space-y-4">
                {recentRedemptions.length === 0 ? (
                  <div className="py-20 text-center space-y-3 opacity-40">
                     <Clock size={32} className="mx-auto" />
                     <p className="text-xs font-black uppercase tracking-widest italic">Waiting for queries...</p>
                  </div>
                ) : (
                  recentRedemptions.map((red, i) => (
                    <motion.div 
                      key={red.hash}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 bg-slate-50 hover:bg-slate-100/50 rounded-3xl border border-slate-100 transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                           <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-widest">Protocol Clear</p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 ml-4 font-mono">{red.hash}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-900 opacity-30">{new Date(red.redeemedAt || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                         <ShieldCheck className="text-emerald-500 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" size={16} />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-slate-200 hover:text-slate-500 transition-all">
                Export Validation Audit
              </button>
           </div>

           <div className="p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 -mr-20 -mt-20 rounded-full" />
              <div className="relative space-y-4">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <User size={20} />
                 </div>
                 <h4 className="text-lg font-black uppercase tracking-widest leading-tight">Fraud Prevention Protocol</h4>
                 <p className="text-xs text-indigo-100 font-medium leading-relaxed">Each verification is logged and hashed against user biometric tokens. Report discrepancies immediately to platform security.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
