import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Store, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, RefreshCw, Sparkles } from "lucide-react";
import { apiClient } from "../../api/client";

export default function MerchantLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, token } = await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (user.role !== "MERCHANT" && user.role !== "ADMIN") {
        throw new Error("Access denied. Merchant credentials required.");
      }

      localStorage.setItem("slasham_user", JSON.stringify(user));
      if (token) localStorage.setItem("slasham_token", token);

      // ✅ Full reload ensures cookie is sent on next request
      window.location.href = "/merchant/dashboard";
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6 py-12 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100"
      >
        {/* Left Side: Merchant Brand */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative">
           <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay"></div>
           <div>
              <div className="flex items-center gap-3 mb-12">
                 <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Store size={20} className="text-white" />
                 </div>
                 <span className="text-xl font-black tracking-tight">Slasham Partner</span>
              </div>
              <h2 className="text-5xl font-black leading-[1.1] mb-6 tracking-tight">
                 Empower your <br />
                 <span className="text-emerald-500">business growth.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                 Access your partner console to manage campaigns, track redemptions, and engage with your community.
              </p>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                 <Sparkles size={18} className="text-emerald-500" /> Premium Brand Visibility
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                 <ArrowRight size={18} className="text-emerald-500" /> Real-time Analytics
              </div>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 md:p-20 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Partner Login</h1>
              <p className="text-slate-500 font-medium">Welcome back to your business portal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@business.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
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
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {isLoading ? <RefreshCw size={20} className="animate-spin" /> : (
                  <>
                    Access Partner Dashboard
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center lg:text-left pt-8 border-t border-slate-50">
               <p className="text-slate-400 text-xs font-medium">
                  Interested in partnering?{" "}
                  <Link to="/merchant/apply" className="text-emerald-600 font-black hover:underline underline-offset-4">Join Slasham Network</Link>
               </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8">
        <Link to="/" className="text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-colors">
          ← Return to Public Home
        </Link>
      </div>
    </div>
  );
}
