import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Twitter, Instagram, Facebook, Linkedin, Mail, Search, 
  User, Utensils, Sparkles, Heart, Package, Settings, ShoppingBag, 
  Store, Zap, MapPin, TrendingUp, Plus, Info,
  ChevronRight, ChevronDown, LogOut, ArrowLeft, AlertTriangle, ShieldCheck
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import { storage } from "../utils/storage";
import { Logo } from "./Logo";


export default function Layout() {
  const [city, setCity] = useState("Lagos");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [footerExpandedSection, setFooterExpandedSection] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [adminSettings, setAdminSettings] = useState<any>(null);
  const location = useLocation();
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { apiClient } = await import("../api/client");
        const data = await apiClient("/admin/settings");
        setAdminSettings(data);
      } catch (error) {
        console.error("Failed to sync settings:", error);
      }
    };
    fetchSettings();
  }, [location.pathname]); // Re-sync on navigation to keep it fresh

  useEffect(() => {
    const storedUser = storage.getItem("slasham_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Fail-safe: close menu on route change
    setIsMenuOpen(false);
    setMobileExpandedSection(null);
  }, [location.pathname]);

  const handleLogout = () => {
    storage.removeItem("slasham_user");
    setUser(null);
  };

  useEffect(() => {
    if (ctaRef.current) {
      gsap.to(ctaRef.current, {
        scale: 1.05,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen || adminSettings.maintenanceMode) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.setProperty('overflow', 'unset', 'important');
    }
  }, [isMenuOpen, adminSettings.maintenanceMode]);

  const menuSections = [
    {
      id: "deals",
      title: "Deals",
      icon: <Utensils size={20} className="text-orange-500" />,
      items: [
        { label: "Food & Drink", path: "/deals/food", icon: <Utensils size={18} className="text-orange-500" /> },
        { label: "Beauty & Spas", path: "/deals/beauty", icon: <Sparkles size={18} className="text-purple-500" /> },
        { label: "Things To Do", path: "/deals/experiences", icon: <Sparkles size={18} className="text-rose-500" /> },
        { label: "Goods", path: "/deals/products", icon: <Package size={18} className="text-blue-500" /> },
        { label: "Local Services", path: "/deals/services", icon: <Settings size={18} className="text-slate-500" /> },
      ]
    },
    {
      id: "process",
      title: "Process",
      icon: <Zap size={20} className="text-emerald-500" />,
      items: [
        { label: "Buy coupon", path: "/how-it-works/buy", icon: <ShoppingBag size={18} className="text-emerald-500" /> },
        { label: "Visit business", path: "/how-it-works/visit", icon: <Store size={18} className="text-blue-500" /> },
        { label: "Unlock more", path: "/how-it-works/unlock", icon: <Zap size={18} className="text-amber-500" /> },
      ]
    },
    {
      id: "business",
      title: "Business",
      icon: <Store size={20} className="text-blue-500" />,
      items: [
        { label: "Merchant Dashboard", path: "/merchant/dashboard", icon: <Store size={18} className="text-emerald-500" /> },
        { label: "Run a Campaign", path: "/business/campaign", icon: <TrendingUp size={18} className="text-blue-500" /> },
        { label: "List Business", path: "/business/list", icon: <Plus size={18} className="text-amber-500" /> },
      ]
    },
    {
      id: "cities",
      title: "Regions",
      icon: <MapPin size={20} className="text-rose-500" />,
      items: [
        { label: "Abuja", path: "/cities/abuja", icon: <MapPin size={18} className="text-slate-900" /> },
        { label: "Lagos", path: "/cities/lagos", icon: <MapPin size={18} className="text-slate-900" /> },
      ]
    }
  ];

  if (!adminSettings) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      
      {/* Maintenance Mode Overlay */}
      <AnimatePresence>
        {adminSettings.maintenanceMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-1000 bg-slate-950 flex items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full">
              <div className="w-24 h-24 bg-white/5 rounded-4xl flex items-center justify-center text-amber-500 mb-8 mx-auto border border-white/10 shadow-2xl">
                <AlertTriangle size={48} className="animate-pulse" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">System Upgrade</h1>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                We're currently scaling our platform logic to provide you with better deals. We'll be back online in a few minutes.
              </p>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 mb-8 flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                   <p className="text-white font-bold text-sm">Security & Integrity</p>
                   <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Master Admin Controlled</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <Link to="/contact" className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Support Desk</Link>
                 <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Check Status</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Notification Bar (inspired by Groupon top bar) */}
      <AnimatePresence>
        {adminSettings.promoBanner.enabled && !adminSettings.maintenanceMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-950 text-emerald-50 py-2.5 px-4 text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] z-60 relative overflow-hidden"
          >
            <span className="opacity-80">{adminSettings.promoBanner.text}</span>
            <span className="mx-4 text-white/20 hidden sm:inline">|</span>
            <Link to="/deals" className="underline underline-offset-4 hover:text-emerald-400 transition-all">Shop Now</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Structured Header inspired by Groupon but uniquely Slasham */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity shrink-0">
            <Logo size="md" />
          </Link>

          {/* Search Bar - Groupon Focused */}
          <div className="hidden md:flex flex-1 max-w-2xl relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search deals, categories, or locations..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white focus:border-teal-500 transition-all"
            />
            <button className="absolute right-1 top-1 bottom-1 px-5 bg-teal-600 text-white rounded-full text-xs font-bold hover:bg-teal-700 transition-all shadow-md active:scale-95">
              SEARCH
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-6 mr-4 border-r border-slate-100 pr-6">
               <Link to="/how-it-works" className="text-[11px] font-bold text-slate-500 hover:text-teal-600 uppercase tracking-wider transition-all">How it works</Link>
               <Link to="/business" className="text-[11px] font-bold text-slate-500 hover:text-teal-600 uppercase tracking-wider transition-all">For Business</Link>
             </div>
             
             <div className="flex items-center gap-2">
               <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
                 <Heart size={20} />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full border border-white"></span>
               </button>
               
               {user ? (
                 <div className="relative group/user px-2">
                   <button className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden ring-2 ring-transparent hover:ring-teal-500/20 transition-all">
                     <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} alt="User" className="w-full h-full object-cover" />
                   </button>
                   <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 translate-y-1 group-hover/user:translate-y-0">
                     <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">{user.name}</p>
                     <Link to="/user/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
                       <User size={16} /> My Account
                     </Link>
                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 text-sm font-medium transition-colors">
                       <LogOut size={16} /> Sign Out
                     </button>
                   </div>
                 </div>
               ) : (
                 <Link to="/login" className="px-6 py-2.5 bg-emerald-500 text-white rounded-full text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                   SIGN IN
                 </Link>
               )}
             </div>

             <button 
              className="lg:hidden text-slate-900 p-2 hover:bg-slate-50 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Category Navigation - Strip Bar below Search */}
        <div className="border-t border-slate-100 bg-white hidden lg:block overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between lg:justify-center gap-6 md:gap-8 overflow-x-auto scrollbar-hide text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link to="/deals" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-all decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0 group font-black">
              <TrendingUp size={14} className="text-emerald-600 transition-colors" /> TOP TRENDING
            </Link>
            <Link to="/deals/food" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-all decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0 group font-black">
              <Utensils size={14} className="text-orange-500 transition-colors" /> FOOD & DRINK
            </Link>
            <Link to="/deals/beauty" className="flex items-center gap-2 text-slate-900 hover:text-orange-500 transition-all decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0 group font-black">
              <Heart size={14} className="text-slate-900 transition-colors" /> BEAUTY & SPAS
            </Link>
            <Link to="/deals/experiences" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-all decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0 group font-black">
              <Sparkles size={14} className="text-emerald-600 transition-colors" /> THINGS TO DO
            </Link>
            <Link to="/deals/products" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-all decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0 group font-black">
              <ShoppingBag size={14} className="text-orange-500 transition-colors" /> GOODS
            </Link>
            <Link to="/deals/services" className="flex items-center gap-2 text-slate-900 hover:text-emerald-600 transition-all decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0 group font-black">
              <Settings size={14} className="text-slate-900 transition-colors" /> LOCAL SERVICES
            </Link>
            <div className="h-4 w-px bg-slate-200 mx-2 shrink-0"></div>
            <Link to="/deals/hot" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-all decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0 group font-black">
              <Zap size={14} className="fill-orange-600 group-hover:scale-110 transition-transform" /> HOT COUPONS
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay - MOVED OUTSIDE HEADER for better interaction */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-9999 lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md cursor-pointer"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-[400px] bg-white shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                {mobileExpandedSection ? (
                  <button 
                    onClick={() => setMobileExpandedSection(null)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                ) : (
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                    <Logo size="sm" />
                  </Link>
                )}
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all active:scale-95"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drill-down Content */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <AnimatePresence mode="wait">
                  {!mobileExpandedSection ? (
                    <motion.div 
                      key="main"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-2"
                    >
                      {menuSections.map((section) => (
                         <button 
                          key={section.id}
                          onClick={() => setMobileExpandedSection(section.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group"
                         >
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                               {section.icon}
                             </div>
                             <span className="font-bold text-slate-700">{section.title}</span>
                           </div>
                           <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                         </button>
                      ))}
                      
                      {/* Standalone Pages */}
                      <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl font-bold text-slate-700 transition-colors">
                          <Info size={20} className="text-slate-400" /> About Slasham
                        </Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl font-bold text-slate-700 transition-colors">
                          <Mail size={20} className="text-slate-400" /> Support
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="sub"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-2"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4 px-2">
                        {menuSections.find(s => s.id === mobileExpandedSection)?.title}
                      </p>
                      {menuSections.find(s => s.id === mobileExpandedSection)?.items.map((item, iIdx) => (
                        <Link 
                          key={iIdx} 
                          to={item.path} 
                          onClick={() => { 
                            setIsMenuOpen(false); 
                            setMobileExpandedSection(null);
                          }}
                          className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-emerald-50 rounded-2xl transition-all group border border-transparent hover:border-emerald-100"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              {item.icon}
                            </div>
                            <span className="font-bold text-slate-700">{item.label}</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-white mt-auto sticky bottom-0">
                {user ? (
                   <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Verified Member</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="p-2.5 text-rose-500 hover:bg-rose-100/50 rounded-xl transition-colors"
                        aria-label="Logout"
                      >
                        <LogOut size={20} />
                      </button>
                   </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                  >
                    <User size={18} /> Member Login
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className={`grow ${location.pathname === '/' ? '' : 'pt-16'}`}>
        <Outlet context={{ city, setCity }} />
      </main>

      {/* Floating VIP Newsletter Card */}
      <div className="max-w-5xl mx-auto px-6 relative z-20 -mb-24 translate-y-12">
        <div className="bg-white rounded-4xl p-8 md:p-12 shadow-2xl shadow-emerald-900/10 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="text-center md:text-left relative z-10 w-full md:w-auto">
             <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Join the VIP list</h3>
             <p className="text-slate-500 font-medium">Get exclusive deals and local experiences sent straight to your inbox.</p>
           </div>
           <form className="flex w-full md:w-auto gap-3 flex-col sm:flex-row relative z-10" onSubmit={(e) => e.preventDefault()}>
             <div className="relative grow sm:w-[320px]">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                 required
               />
             </div>
             <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0">
               Subscribe
             </button>
           </form>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="bg-[#0d2e24] text-white pt-36 pb-12 mt-24 border-t border-emerald-900/50 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[400px] -right-[200px] w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[400px] -left-[200px] w-[800px] h-[800px] bg-white/8 rounded-full blur-[120px]"></div>
          {/* Top white accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-white/60 via-white/30 to-white/60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20">
            
            {/* Brand Area */}
            <div className="lg:w-1/3">
              <Link to="/" className="hover:opacity-80 transition-opacity mb-8 inline-block">
                <Logo size="md" variant="light" />
              </Link>
              <p className="text-white/70 text-lg leading-relaxed max-w-sm">
                Experience the best of your city for less. Curated premium deals for dining, wellness, and entertainment.
              </p>
            </div>

            {/* Accordion Links Columns */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-12">
              <div className="border-b border-white/20 md:border-none pb-4 md:pb-0 mb-4 md:mb-0">
                <h4 
                  className="font-black text-sm mb-0 md:mb-6 text-white uppercase tracking-[0.2em] flex justify-between items-center cursor-pointer md:cursor-auto"
                  onClick={() => setFooterExpandedSection(prev => prev === 'explore' ? null : 'explore')}
                >
                  Explore
                  <ChevronDown size={18} className={`md:hidden text-white/70 transition-transform duration-300 ${footerExpandedSection === 'explore' ? '-rotate-180' : ''}`} />
                </h4>
                <div className={`overflow-hidden transition-all duration-300 ${footerExpandedSection === 'explore' ? 'max-h-[300px] mt-6' : 'max-h-0 md:max-h-[300px] md:mt-0'}`}>
                <ul className="space-y-4 text-white/70 font-medium font-sans">
                    <li><Link to="/deals/food" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Food & Drink</Link></li>
                    <li><Link to="/deals/beauty" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Beauty & Spas</Link></li>
                    <li><Link to="/deals/experiences" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Things To Do</Link></li>
                    <li><Link to="/deals/products" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Goods</Link></li>
                  </ul>
                </div>
              </div>

              <div className="border-b border-emerald-900/50 md:border-none pb-4 md:pb-0 mb-4 md:mb-0">
                <h4 
                  className="font-black text-sm mb-0 md:mb-6 text-white uppercase tracking-[0.2em] flex justify-between items-center cursor-pointer md:cursor-auto"
                  onClick={() => setFooterExpandedSection(prev => prev === 'company' ? null : 'company')}
                >
                  Company
                  <ChevronDown size={18} className={`md:hidden text-emerald-500 transition-transform duration-300 ${footerExpandedSection === 'company' ? '-rotate-180' : ''}`} />
                </h4>
                <div className={`overflow-hidden transition-all duration-300 ${footerExpandedSection === 'company' ? 'max-h-[300px] mt-6' : 'max-h-0 md:max-h-[300px] md:mt-0'}`}>
                  <ul className="space-y-4 text-white/70 font-medium font-sans">
                    <li><Link to="/about" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> About Us</Link></li>
                    <li><Link to="/careers" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Careers</Link></li>
                    <li><Link to="/press" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Press</Link></li>
                    <li><Link to="/contact" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Contact</Link></li>
                  </ul>
                </div>
              </div>

              <div className="border-b border-emerald-900/50 md:border-none pb-4 md:pb-0">
                <h4 
                  className="font-black text-sm mb-0 md:mb-6 text-white uppercase tracking-[0.2em] flex justify-between items-center cursor-pointer md:cursor-auto"
                  onClick={() => setFooterExpandedSection(prev => prev === 'business' ? null : 'business')}
                >
                  For Business
                  <ChevronDown size={18} className={`md:hidden text-emerald-500 transition-transform duration-300 ${footerExpandedSection === 'business' ? '-rotate-180' : ''}`} />
                </h4>
                <div className={`overflow-hidden transition-all duration-300 ${footerExpandedSection === 'business' ? 'max-h-[300px] mt-6' : 'max-h-0 md:max-h-[300px] md:mt-0'}`}>
                  <ul className="space-y-4 text-white/70 font-medium font-sans">
                    <li><Link to="/merchant/dashboard" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> My Business</Link></li>
                    <li><Link to="/business/campaign" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> Run a Campaign</Link></li>
                    <li><Link to="/business/list" className="hover:text-white transition-colors flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> List Your Business</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-sm text-white/60 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center md:text-left text-sm text-white/50">
            <p>© {new Date().getFullYear()} Slasham. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
