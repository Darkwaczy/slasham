import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, RefreshCw, ArrowLeft, ShieldCheck, Sparkles, Bell } from "lucide-react";
import { apiClient } from "../api/client";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  
  const [step, setStep] = useState<"auth" | "otp">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Clear error when switching between login and signup
  useEffect(() => {
    setError(null);
    setSuccess(false);
    setStep("auth");
  }, [isLoginPage]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    if (!isLoginPage && !name) {
      setError("Please enter your full name.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLoginPage) {
        const { user, token } = await apiClient("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        if (user.role === 'USER' && !user.is_verified) {
            setStep("otp");
            setIsLoading(false);
            return;
        }

        // Save session
        localStorage.setItem("slasham_user", JSON.stringify(user));
        if (token) localStorage.setItem("slasham_token", token);

        setSuccess(true);
        setTimeout(() => navigate(user.role === 'ADMIN' ? "/admin/dashboard" : "/user/dashboard"), 1500);
      } else {
        await apiClient("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, name, role: 'USER' }),
        });
        
        setStep("otp");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, token } = await apiClient("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code: otpCode }),
      });

      // Save session
      localStorage.setItem("slasham_user", JSON.stringify(user));
      if (token) localStorage.setItem("slasham_token", token);

      setSuccess(true);
      setTimeout(() => navigate("/user/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#FAFAFA] relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-all group z-50 uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100">
        
        {/* Left Visual Side */}
        <div className="hidden lg:block relative bg-emerald-500 p-16 overflow-hidden">
          <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mb-12">
                Slasham<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Join the elite <br />
                <span className="text-white/80 italic font-black">savers club.</span>
              </h2>
              <p className="text-white/80 text-xl leading-relaxed max-w-md">
                Experience the best of Lagos and Abuja for less. Premium deals, seamless redemption, zero friction.
              </p>
            </div>

            <div className="space-y-6">
              {[
                "Instant digital vouchers",
                "Verified premium venues",
                "Exclusive member-only flash sales"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-white/80">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  </div>
                  <p className="font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              {step === "auth" ? (
                <motion.div 
                  key="auth-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-10 text-left">
                    <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                      {isLoginPage ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="text-slate-500 font-medium">
                      {isLoginPage 
                        ? "Access your premium deals and exclusive savings." 
                        : "Join thousands of members saving on premium experiences."}
                    </p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-5 text-left">
                    {!isLoginPage && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                        {isLoginPage && (
                          <Link to="/forgot-password" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline underline-offset-4">
                            Forgot?
                          </Link>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                        <AlertCircle size={18} /> {error}
                      </motion.div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                    >
                      {isLoading ? <RefreshCw size={20} className="animate-spin" /> : (
                        <>
                          {isLoginPage ? "Sign in to Slasham" : "Create Member Account"}
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-10 text-center">
                    <p className="text-slate-500 font-medium">
                      {isLoginPage ? "New to Slasham?" : "Already a member?"}{" "}
                      <Link to={isLoginPage ? "/signup" : "/login"} className="text-emerald-600 font-black hover:underline underline-offset-4 transition-colors">
                        {isLoginPage ? "Sign up for free" : "Sign in here"}
                      </Link>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-10 text-left">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                       <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Verify Email</h1>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      We've sent a 6-digit verification code to <span className="text-emerald-600 font-bold">{email}</span>. Please enter it below to activate your account.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-6 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
                      <input 
                        type="text" 
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="0 0 0 0 0 0"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 text-center text-3xl font-black tracking-[0.5em] text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                        <AlertCircle size={18} /> {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                        <CheckCircle2 size={18} /> Verification successful! Redirecting...
                      </motion.div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isLoading || otpCode.length !== 6 || success}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? <RefreshCw size={20} className="animate-spin" /> : "Verify & Activate Account"}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setStep("auth")}
                      className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                      ← Use a different email
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-8 opacity-50 grayscale">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert("Recent activity: No new critical alerts.")}
                  className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl relative transition-all"
                >
                  <Bell size={20} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
