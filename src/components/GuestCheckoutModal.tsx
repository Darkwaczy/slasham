import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Mail, Phone, MapPin, CreditCard, Lock, Shield, RefreshCw, AlertCircle, ChevronRight } from "lucide-react";
import { apiClient } from "../api/client";
import { storage } from "../utils/storage";

interface GuestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentReady: (userEmail: string) => void;
  dealTitle: string;
  dealPrice: number;
  dealImage?: string;
  dealId: string;
}

export default function GuestCheckoutModal({
  isOpen,
  onClose,
  onPaymentReady,
  dealTitle,
  dealPrice,
  dealImage,
  dealId,
}: GuestCheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call guest checkout endpoint — creates account if needed
      const response = await apiClient("/auth/guest-checkout", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          city: form.city,
          state: form.state,
          address: form.address,
          deal_id: dealId,
        }),
      });

      // Save session so payment can proceed
      storage.setItem("slasham_user", JSON.stringify(response.user));
      storage.setItem("slasham_user_cached_at", Date.now().toString());

      // Proceed to Paystack
      onPaymentReady(form.email);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 my-auto"
          >
            {/* Header */}
            <div className="bg-emerald-500 p-8 text-white rounded-t-[2.5rem] relative overflow-hidden">
              {dealImage && (
                <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                   <img src={dealImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all z-20"
              >
                <X size={20} />
              </button>
              <div className="relative z-10 flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CreditCard size={22} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Secure Checkout</span>
              </div>
              <h3 className="text-xl font-black tracking-tight relative z-10">
                {dealTitle}
              </h3>
              <p className="text-emerald-100 font-black text-2xl mt-1 relative z-10">
                ₦{dealPrice.toLocaleString()}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Billing Information
              </p>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      placeholder="John"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="08012345678"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Lagos"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    State
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <select
                      value={form.state}
                      onChange={(e) => update("state", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                    >
                      <option value="">Select</option>
                      {["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Address (optional) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Address <span className="text-slate-300">(Optional)</span>
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="12 Example Street"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl flex items-start gap-3 text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Notice */}
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <Shield size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-emerald-700 leading-relaxed">
                  Your voucher will be emailed to you after payment. A Slasham account will be created automatically so you can manage your vouchers.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    Proceed to Payment
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
