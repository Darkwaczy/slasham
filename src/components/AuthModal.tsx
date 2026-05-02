import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, RefreshCw, AlertCircle, Phone, MapPin } from "lucide-react";
import { apiClient } from "../api/client";
import { storage } from "../utils/storage";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dealTitle: string;
}

export default function AuthModal({ isOpen, onClose, onSuccess, dealTitle }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<"auth" | "otp">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer for resend
  React.useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await apiClient("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        
        // Check if needs OTP verification
        if (response?.requiresVerification) {
          setStep("otp");
          return;
        }
        
        storage.setItem("slasham_user", JSON.stringify(response.user || response));
        storage.setItem("slasham_user_cached_at", Date.now().toString());
        onSuccess();
      } else {
        await apiClient("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, name, phone, city, role: 'USER' }),
        });
        // After signup, show OTP step
        setStep("otp");
        setResendTimer(60);
        setCanResend(false);
      }
    } catch (err: any) {
      // If login fails because email not verified, show OTP step
      if (err.message?.toLowerCase().includes("verify your email") ||
          err.message?.toLowerCase().includes("not verified")) {
        setStep("otp");
        return;
      }
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await apiClient("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code: otpCode }),
      });

      // OTP verified — now login automatically
      const response = await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      storage.setItem("slasham_user", JSON.stringify(response.user || response));
      storage.setItem("slasham_user_cached_at", Date.now().toString());
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError(null);
    try {
      await apiClient("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setResendTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="bg-emerald-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all z-20"
              >
                <X size={20} />
              </button>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Secure Your Deal</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight leading-tight relative z-10">
                Claim your voucher for <br />
                <span className="text-emerald-100 italic">"{dealTitle}"</span>
              </h3>
            </div>

            <div className="p-10">
              <AnimatePresence mode="wait">
                {step === "otp" ? (
                  // ✅ OTP STEP
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 mx-auto">
                        <ShieldCheck size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Verify Your Email</h3>
                      <p className="text-slate-500 text-sm font-medium">
                        We sent a 6-digit code to{" "}
                        <span className="text-emerald-600 font-bold">{email}</span>
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="000000"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-2xl font-black text-slate-900 tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </div>

                      {error && (
                        <div className="p-4 rounded-2xl flex items-start gap-3 text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                          <AlertCircle size={16} className="shrink-0 mt-0.5" />
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading || otpCode.length < 6}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isLoading ? <RefreshCw size={18} className="animate-spin" /> : (
                          <>
                            Verify & Claim Deal
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={!canResend || isLoading}
                          className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                        >
                          {canResend ? "Resend code" : `Resend in ${resendTimer}s`}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  // ✅ AUTH STEP (login/register)
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Tabs */}
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8">
                      <button
                        onClick={() => { setIsLogin(true); setError(null); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => { setIsLogin(false); setError(null); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Join Slasham
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {!isLogin && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                            <div className="relative group">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                      </div>

                      {error && (
                        <div className={`p-4 rounded-2xl flex items-start gap-3 text-xs font-bold leading-relaxed ${error.includes("created") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                          {error.includes("created") ? <Sparkles size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                          {error}
                        </div>
                      )}

                      <button type="submit" disabled={isLoading}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                        {isLoading ? <RefreshCw size={18} className="animate-spin" /> : (
                          <>{isLogin ? "Confirm & Secure Voucher" : "Join & Claim Deal"}<ArrowRight size={18} /></>
                        )}
                      </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure Bank-Level Encryption</p>
                      <div className="flex items-center justify-center gap-6 opacity-30 grayscale pointer-events-none">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
