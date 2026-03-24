import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, Zap, Store, UserCircle, ArrowLeft, Settings, Building, MapPin } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  
  const [role, setRole] = useState<"user" | "business" | "admin" | null>("user");
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Clear error when switching between login and signup
  useEffect(() => {
    setError(null);
    setSuccess(false);
    setRole(null); // Reset role when switching pages
  }, [isLoginPage]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const bName = formData.get("businessName") as string;
    const loc = formData.get("location") as string;

    // Basic Validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!isLoginPage && role === 'business' && (!bName || !loc)) {
        setError("Please provide both business name and location.");
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

    // Simulate API Call
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("slasham_users") || "[]");

        if (isLoginPage) {
          // Login Logic
          if (email === "admin@gmail.com" && password === "admin123") {
            const adminUser = { id: "admin", name: "Admin User", email: "admin@gmail.com", password: "admin123", role: role || "admin" };
            localStorage.setItem("slasham_user", JSON.stringify(adminUser));
            setSuccess(true);
            let destination = "/user/dashboard";
            if (role === "business") destination = "/merchant/dashboard";
            if (role === "admin") destination = "/admin/dashboard";
            setTimeout(() => navigate(destination), 1500);
            return;
          }
          
          const user = users.find((u: any) => u.email === email && u.password === password && u.role === role);
          if (user) {
            localStorage.setItem("slasham_user", JSON.stringify(user));
            setSuccess(true);
            setTimeout(() => navigate(role === "business" ? "/merchant/dashboard" : "/user/dashboard"), 1500);
          } else {
            setError("Invalid email, password, or role.");
          }
        } else {
          // Signup Logic
          const userExists = users.some((u: any) => u.email === email);
          if (userExists) {
            setError("An account with this email already exists.");
          } else {
            const newUser = { id: Date.now().toString(), name, email, password, role, businessName: bName, location: loc };
            users.push(newUser);
            localStorage.setItem("slasham_users", JSON.stringify(users));
            localStorage.setItem("slasham_user", JSON.stringify(newUser));
            setSuccess(true);
            setTimeout(() => navigate(role === "business" ? "/merchant/dashboard" : "/user/dashboard"), 1500);
          }
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#FAFAFA] relative">
      {/* Absolute Back Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-all group z-50 uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100">
        
        {/* Left: Visual/Marketing Side */}
        <div className="hidden lg:block relative bg-slate-900 p-16 overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mb-12">
                Slasham<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Join the elite <br />
                <span className="text-emerald-400 italic">savers club.</span>
              </h2>
              <p className="text-slate-400 text-xl leading-relaxed max-w-md">
                Experience the best of Lagos and Abuja for less. Premium deals, seamless redemption, zero friction.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <p className="font-medium">Instant digital vouchers</p>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <p className="font-medium">Verified premium venues</p>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <p className="font-medium">Exclusive member-only flash sales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Side */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              {!role ? (
                <motion.div
                  key="role-selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome to Slasham</h1>
                  <p className="text-slate-500 mb-10">How would you like to sign in?</p>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => setRole("user")}
                      className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center gap-6 group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <UserCircle size={32} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-slate-900">I am a User</h3>
                        <p className="text-slate-500 text-sm">Find deals and save money</p>
                      </div>
                      <ArrowRight className="ml-auto text-slate-300 group-hover:text-emerald-500" />
                    </button>

                    <button 
                      onClick={() => setRole("business")}
                      className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-6 group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Store size={32} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-slate-900">I am a Business</h3>
                        <p className="text-slate-500 text-sm">Manage deals and grow sales</p>
                      </div>
                      <ArrowRight className="ml-auto text-slate-300 group-hover:text-blue-500" />
                    </button>

                    <button 
                      onClick={() => setRole("admin")}
                      className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-slate-800 hover:bg-slate-50 transition-all flex items-center gap-6 group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
                        <Settings size={32} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-slate-900">I am an Admin</h3>
                        <p className="text-slate-500 text-sm">Oversee platform operations</p>
                      </div>
                      <ArrowRight className="ml-auto text-slate-300 group-hover:text-slate-900" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auth-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-10">
                    <button onClick={() => setRole(null)} className="text-sm font-bold text-slate-400 hover:text-slate-900 mb-4 flex items-center gap-1">
                      ← Back to role selection
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">
                      {isLoginPage ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="text-slate-500">
                      {isLoginPage 
                        ? `Enter your ${role} details to access your premium deals.` 
                        : `Start saving as a ${role} on the best experiences.`}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <AnimatePresence mode="wait">
                      {!isLoginPage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                              <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                              />
                            </div>
                          </div>

                          {role === 'business' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Business Name</label>
                                    <div className="relative group">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            name="businessName"
                                            placeholder="e.g. Lagos Lounge"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Primary Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select 
                                            name="location"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                                        >
                                            <option value="Lagos">Lagos</option>
                                            <option value="Abuja">Abuja</option>
                                            <option value="Port Harcourt">Port Harcourt</option>
                                            <option value="Ibadan">Ibadan</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Password</label>
                        {isLoginPage && (
                          <Link to="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
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
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
                        className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium"
                      >
                        <AlertCircle size={18} />
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium"
                      >
                        <CheckCircle2 size={18} />
                        {isLoginPage ? "Login successful! Redirecting..." : "Account created! Redirecting..."}
                      </motion.div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isLoading || success}
                      className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          {isLoginPage ? "Login to Slasham" : "Create Account"}
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium">
                {isLoginPage ? "Don't have an account?" : "Already have an account?"}{" "}
                <Link 
                  to={isLoginPage ? "/signup" : "/login"} 
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                >
                  {isLoginPage ? "Sign up for free" : "Login here"}
                </Link>
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-8 opacity-50 grayscale">
              <div className="flex items-center gap-2">
                <Zap size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
