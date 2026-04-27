import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, ShieldQuestion } from "lucide-react";
import { apiClient } from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await apiClient("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#FAFAFA] relative">
      <Link 
        to="/login" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-all group z-50 uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Login
      </Link>

      <div className="w-full max-w-lg bg-white rounded-4xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-16">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-8">
            <ShieldQuestion size={32} />
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Forgot Password?</h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Enter your email and we'll send you instructions to reset your password.
          </p>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit} 
                className="space-y-6 text-left"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                    />
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
                  className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw size={20} className="animate-spin" /> : "Send Reset Link"}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 p-8 rounded-4xl text-center space-y-4"
              >
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-black text-emerald-900">Check your email</h3>
                <p className="text-emerald-700/70 text-sm font-bold leading-relaxed">
                  We've sent password reset instructions to <br />
                  <span className="text-emerald-900">{email}</span>
                </p>
                <Link to="/login" className="block pt-4 text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:underline">
                  Back to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
