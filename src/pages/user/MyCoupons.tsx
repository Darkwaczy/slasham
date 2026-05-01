import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Copy, Ticket, Clock, ArrowUpRight, AlertTriangle, Send, X, ShieldAlert, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiClient } from "../../api/client";

export default function MyCoupons() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [userVouchers, setUserVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: "", description: "", priority: "Normal" });
  const [verifyingVoucher, setVerifyingVoucher] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");

  const fetchVouchers = async () => {
    try {
      const data = await apiClient("/vouchers/my-vouchers");
      // Map backend fields to frontend UI expectation
      const mapped = data.map((v: any) => ({
        id: v.id,
        title: v.deals?.title,
        companyName: v.deals?.merchants?.business_name,
        code: v.voucher_code,
        status: v.status.charAt(0).toUpperCase() + v.status.slice(1).toLowerCase(), // e.g., "Active"
        expiryDate: v.deals?.expiry_date,
        price: `₦${v.deals?.discount_price.toLocaleString()}`,
        category: v.deals?.category,
        merchant_id: v.deals?.merchant_id,
        verificationPin: v.verification_pin,
        rawStatus: v.status // Keep "REDEEMED", "ACTIVE", etc.
      }));
      setUserVouchers(mapped);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoucher || !reportForm.reason) return;

    setIsSubmitting(true);
    try {
      await apiClient.post("/user/report", {
        voucher_id: selectedVoucher.id,
        merchant_id: selectedVoucher.merchant_id, // We'll need to ensure this is in the data
        reason: reportForm.reason,
        description: reportForm.description,
        priority: reportForm.priority
      });
      setIsReporting(false);
      setReportForm({ reason: "", description: "", priority: "Normal" });
      // Show success feedback (Toast or Alert)
      alert("Report submitted successfully. Our team will review it shortly.");
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPin = async (voucherId: string) => {
    if (pinInput.length !== 4) return;
    setIsSubmitting(true);
    try {
      await apiClient.post("/vouchers/verify-transaction", {
        voucher_id: voucherId,
        pin: pinInput
      });
      setVerifyingVoucher(null);
      setPinInput("");
      fetchVouchers(); // Refresh list
      alert("Transaction verified! Bonus points awarded.");
    } catch (error: any) {
      alert(error.message || "Invalid PIN. Please check your verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCoupons = userVouchers.filter(c => statusFilter === "All" || c.status === statusFilter);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4">
             <Ticket size={12} fill="currentColor" />
             Managed Vouchers
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Your Coupons</h1>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {["All", "Active", "Redeemed", "Expired"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                statusFilter === filter ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Artifacts...</p>
          </div>
      ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                {filteredCoupons.map((coupon, i) => (
                    <motion.div
                    layout
                    key={coupon.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row relative ${coupon.status !== 'Active' ? 'opacity-70 contrast-75' : 'hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px] transition-all'}`}
                    >
                    <div className="p-8 md:p-10 flex-1 relative">
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`w-2 h-2 rounded-full ${coupon.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{coupon.category || coupon.type}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{coupon.title}</h3>
                        <p className="text-sm text-slate-500 font-medium mb-8 leading-none">{coupon.companyName || coupon.subtitle}</p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 w-fit">
                            <Clock size={14} className="animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-tight">Voucher Expires on: {coupon.expiry || (coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "Mar 25, 2026")}</span>
                            </div>
                            {coupon.status === 'Active' && (
                            <div className="flex items-center gap-2 pt-2">
                                <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs font-black text-slate-900 tracking-widest">
                                    {coupon.code}
                                </div>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(coupon.code);
                                        // Optional: toast or feedback
                                    }}
                                    className="p-2.5 bg-emerald-500 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg" title="Copy Code">
                                    <Copy size={14} />
                                </button>
                            </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col justify-between items-center py-4 relative">
                        <div className="w-8 h-8 bg-slate-50 rounded-full border border-slate-100 -mt-10" />
                        <div className="h-full border-l-2 border-dashed border-slate-100 mx-4 my-2" />
                        <div className="w-8 h-8 bg-slate-50 rounded-full border border-slate-100 -mb-10" />
                    </div>

                    <div className={`p-8 md:p-10 md:w-48 flex flex-col items-center justify-center text-center gap-4 ${
                        coupon.color === 'emerald' || !coupon.color ? 'bg-emerald-50 text-emerald-600' :
                        coupon.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                        coupon.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                        <span className="text-sm font-black uppercase tracking-widest">{coupon.status}</span>
                        <p className="text-2xl font-black tracking-tighter leading-none">{coupon.price || coupon.discount}</p>
                        
                        {coupon.status === 'Active' && (
                            <div className="mt-4 flex flex-col items-center gap-4">
                                <div className="bg-white p-2 rounded-2xl shadow-xl shadow-emerald-500/10">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(coupon.code)}`} 
                                        alt="Voucher QR"
                                        className="w-24 h-24"
                                    />
                                </div>
                                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all text-slate-900">
                                    <ArrowUpRight size={18} />
                                </button>
                                <button 
                                    onClick={() => {
                                        setSelectedVoucher(coupon);
                                        setIsReporting(true);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                                >
                                    <AlertTriangle size={10} /> Report Problem
                                </button>
                            </div>
                        )}

                        {coupon.status === 'Redeemed' && (
                            <div className="mt-4 flex flex-col items-center gap-3">
                                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Verification PIN</p>
                                    <p className="text-xl font-black text-slate-900 tracking-[0.2em]">{coupon.verificationPin || "8821"}</p>
                                </div>
                                
                                {verifyingVoucher === coupon.id ? (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <input 
                                            type="text" 
                                            maxLength={4}
                                            value={pinInput}
                                            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                                            placeholder="Enter PIN"
                                            className="w-24 py-2 bg-white border border-emerald-200 rounded-lg text-center text-sm font-black outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        />
                                        <div className="flex gap-1">
                                            <button onClick={() => handleVerifyPin(coupon.id)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all">
                                                <Send size={14} />
                                            </button>
                                            <button onClick={() => setVerifyingVoucher(null)} className="p-2 bg-slate-200 text-slate-500 rounded-lg">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setVerifyingVoucher(coupon.id)}
                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                                    >
                                        Confirm Completion
                                    </button>
                                )}
                            </div>
                        )}

                        {coupon.rawStatus === 'VERIFIED' && (
                            <div className="mt-4 flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Transaction Verified</span>
                            </div>
                        )}
                    </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>

            {/* Dispute/Report Modal */}
            <AnimatePresence>
                {isReporting && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setIsReporting(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3 text-rose-600">
                                    <ShieldAlert size={20} />
                                    <h3 className="text-sm font-black uppercase tracking-widest">Report a Problem</h3>
                                </div>
                                <button onClick={() => setIsReporting(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleReportSubmit} className="p-8 lg:p-10 space-y-6 text-left">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Voucher Context</p>
                                    <p className="text-sm font-black text-slate-900">{selectedVoucher?.title}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{selectedVoucher?.companyName}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Reason for Dispute</label>
                                    <select 
                                        required
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none"
                                        value={reportForm.reason}
                                        onChange={e => setReportForm({...reportForm, reason: e.target.value})}
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="Merchant Refused Voucher">Merchant Refused Voucher</option>
                                        <option value="Voucher Already Redeemed">Voucher Already Redeemed</option>
                                        <option value="Business Closed">Business Closed</option>
                                        <option value="Incorrect Charges">Incorrect Charges</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Description</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        placeholder="Tell us what happened in detail..."
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                                        value={reportForm.description}
                                        onChange={e => setReportForm({...reportForm, description: e.target.value})}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Transmitting..." : "Submit Report"}
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {filteredCoupons.length === 0 && (
                <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-20 flex flex-col items-center justify-center text-center space-y-4"
                >
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                    <Ticket size={40} />
                    </div>
                    <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">No {statusFilter.toLowerCase()} coupons</h3>
                    <p className="text-slate-500 font-medium">Try changing your filter or browse new deals.</p>
                    </div>
                    <Link to="/deals" className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Explore Deals</Link>
                </motion.div>
            )}
          </>
      )}
    </div>
  );
}
