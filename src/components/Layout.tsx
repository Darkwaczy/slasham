import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Twitter, Instagram, Facebook, Linkedin, Mail, Search, 
  User, Utensils, Sparkles, Heart, Package, Settings, ShoppingBag, 
  Store, Zap, MapPin, TrendingUp, Plus, Info,
  ChevronRight, LogOut, ArrowLeft, AlertTriangle, ShieldCheck
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import { getAdminSettings, AdminSettings } from "../utils/adminState";


export default function Layout() {
  const [city, setCity] = useState("Lagos");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(getAdminSettings());
  const location = useLocation();
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setAdminSettings(getAdminSettings());
    };
    window.addEventListener('adminSettingsUpdate', handleUpdate);
    return () => window.removeEventListener('adminSettingsUpdate', handleUpdate);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("slasham_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Fail-safe: close menu on route change
    setIsMenuOpen(false);
    setMobileExpandedSection(null);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("slasham_user");
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
        { label: "Food & Drinks", path: "/deals/food", icon: <Utensils size={18} className="text-orange-500" /> },
        { label: "Experiences", path: "/deals/experiences", icon: <Sparkles size={18} className="text-purple-500" /> },
        { label: "Beauty & Wellness", path: "/deals/beauty", icon: <Heart size={18} className="text-rose-500" /> },
        { label: "Products", path: "/deals/products", icon: <Package size={18} className="text-blue-500" /> },
        { label: "Services", path: "/deals/services", icon: <Settings size={18} className="text-slate-500" /> },
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
            className="bg-[#0f172a] text-white py-2.5 px-4 text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] z-60 relative overflow-hidden"
          >
            <span className="opacity-80">{adminSettings.promoBanner.text}</span>
            <span className="mx-4 text-white/20 hidden sm:inline">|</span>
            <Link to="/deals" className="underline underline-offset-4 hover:text-teal-400 transition-all">Shop Now</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Structured Header inspired by Groupon but uniquely Slasham */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-1 shrink-0">
            SLASHAM<span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
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
                 <Link to="/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
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
            <Link to="/deals" className="flex items-center gap-2 hover:text-teal-600 transition-colors decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0">
              <TrendingUp size={14} className="text-teal-500" /> TOP TRENDING
            </Link>
            <Link to="/deals/food" className="flex items-center gap-2 hover:text-teal-600 transition-colors decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0">
              <Utensils size={14} /> FOOD & DRINK
            </Link>
            <Link to="/deals/beauty" className="flex items-center gap-2 hover:text-teal-700 transition-colors decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0">
              <Heart size={14} /> BEAUTY & SPAS
            </Link>
            <Link to="/deals/experiences" className="flex items-center gap-2 hover:text-teal-600 transition-colors decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0">
              <Sparkles size={14} /> THINGS TO DO
            </Link>
            <Link to="/deals/products" className="flex items-center gap-2 hover:text-teal-600 transition-colors decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0">
              <Package size={14} /> GOODS
            </Link>
            <Link to="/deals/services" className="flex items-center gap-2 hover:text-teal-600 transition-colors decoration-2 hover:underline underline-offset-14 whitespace-nowrap shrink-0">
              <Settings size={14} /> LOCAL SERVICES
            </Link>
            <div className="h-4 w-px bg-slate-200 mx-2 shrink-0"></div>
            <Link to="/how-it-works" className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors whitespace-nowrap shrink-0">
              <Zap size={14} className="fill-rose-500" /> HOT COUPONS
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
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold flex items-center gap-2">
                    Slasham<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
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
                    className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                  >
                    <User size={18} /> Member Login
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className={`grow ${location.pathname === '/' ? '' : 'pt-24'}`}>
        <Outlet context={{ city, setCity }} />
      </main>

      {/* Premium Footer */}
      <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 mt-24 border-t border-slate-800 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[400px] -right-[200px] w-[800px] h-[800px] bg-teal-900/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[400px] -left-[200px] w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
            
            {/* Brand & Newsletter */}
            <div className="md:col-span-12 lg:col-span-5 pr-0 lg:pr-12">
              <Link to="/" className="text-3xl font-bold text-white tracking-tight mb-6 flex items-center gap-2">
                Slasham<span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              </Link>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
                Experience the best of your city for less. Curated premium deals for dining, wellness, and entertainment.
              </p>
              
              <div className="mb-8">
                <p className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Subscribe to our newsletter</p>
                <form className="flex gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative grow">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                      required
                    />
                  </div>
                  <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center shrink-0">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-4 lg:col-span-2">
              <h4 className="font-semibold text-sm mb-6 text-white uppercase tracking-wider">Explore</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/deals?category=dining" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> Dining</Link></li>
                <li><Link to="/deals?category=wellness" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> Wellness & Spa</Link></li>
                <li><Link to="/deals?category=events" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> Events & Tickets</Link></li>
                <li><Link to="/deals?category=getaways" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> Getaways</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4 lg:col-span-2">
              <h4 className="font-semibold text-sm mb-6 text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/about" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> About Us</Link></li>
                <li><Link to="/careers" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> Careers</Link></li>
                <li><Link to="/press" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> Press</Link></li>
                <li><Link to="/contact" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> Contact</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4 lg:col-span-3">
              <h4 className="font-semibold text-sm mb-6 text-white uppercase tracking-wider">For Business</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/merchant/dashboard" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> My Business</Link></li>
                <li><Link to="/business/campaign" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> Run a Campaign</Link></li>
                <li><Link to="/business/list" className="hover:text-teal-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-teal-400 transition-colors"></span> List Your Business</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-sm text-slate-500 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-slate-900 hover:border-teal-500 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-slate-900 hover:border-teal-500 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-slate-900 hover:border-teal-500 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-slate-900 hover:border-teal-500 transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center md:text-left text-sm text-slate-600">
            <p>© {new Date().getFullYear()} Slasham. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
