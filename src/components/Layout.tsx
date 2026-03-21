import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Twitter, Instagram, Facebook, Linkedin, Mail, ArrowRight, Search, 
  ChevronDown, User, Utensils, Sparkles, Heart, Package, Settings, ShoppingBag, 
  Store, Zap, MapPin, TrendingUp, Plus, Info, Briefcase, Newspaper, CheckCircle2,
  ChevronRight, LogOut, ArrowLeft
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const ctaRef = useRef<HTMLAnchorElement>(null);

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
    if (isMenuOpen) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.setProperty('overflow', 'unset', 'important');
    }
  }, [isMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

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
      
      {/* Floating Pill Navbar */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-full px-6 py-2.5 flex items-center justify-between w-full max-w-6xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] pointer-events-auto transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Slasham<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center justify-center gap-6 text-sm font-semibold text-slate-600">
            {/* Desktop Nav Items */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('browse')} onMouseLeave={handleMouseLeave}>
              <button className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'browse' ? 'text-slate-900' : ''}`}>
                Deal <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'browse' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'browse' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/deals/food" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Utensils size={16} className="text-orange-500" /> Food & Drinks</Link>
                  <Link to="/deals/experiences" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Sparkles size={16} className="text-purple-500" /> Experiences</Link>
                  <Link to="/deals/beauty" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Heart size={16} className="text-rose-500" /> Beauty & Wellness</Link>
                  <Link to="/deals/products" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Package size={16} className="text-blue-500" /> Products</Link>
                  <Link to="/deals/services" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Settings size={16} className="text-slate-500" /> Services</Link>
                </div>
              )}
            </div>
            {/* Process */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('how')} onMouseLeave={handleMouseLeave}>
              <button className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'how' ? 'text-slate-900' : ''}`}>
                Process <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'how' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'how' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/how-it-works/buy" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><ShoppingBag size={16} className="text-emerald-500" /> Buy coupon</Link>
                  <Link to="/how-it-works/visit" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Store size={16} className="text-blue-500" /> Visit business</Link>
                  <Link to="/how-it-works/unlock" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Zap size={16} className="text-amber-500" /> Unlock more</Link>
                </div>
              )}
            </div>
            {/* Cities */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('cities')} onMouseLeave={handleMouseLeave}>
              <button className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'cities' ? 'text-slate-900' : ''}`}>
                Cities <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'cities' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'cities' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/cities/abuja" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"><MapPin size={16} className="text-slate-900" /> Abuja</Link>
                  <Link to="/cities/lagos" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"><MapPin size={16} className="text-slate-900" /> Lagos</Link>
                  <Link to="/cities/port-harcourt" className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600"><MapPin size={16} /> Port Harcourt</div>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Later</span>
                  </Link>
                </div>
              )}
            </div>
            {/* Business */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('business')} onMouseLeave={handleMouseLeave}>
              <button className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'business' ? 'text-slate-900' : ''}`}>
                Business <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'business' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'business' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/merchant/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors group">
                    <Store size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" /> 
                    <div className="flex flex-col">
                       <span className="font-bold text-slate-700">Merchant Console</span>
                       <span className="text-[10px] text-slate-400 font-medium">Manage your business</span>
                    </div>
                  </Link>
                  <Link to="/business/campaign" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><TrendingUp size={16} className="text-blue-500" /> Run a Campaign</Link>
                  <Link to="/business/list" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Plus size={16} className="text-amber-500" /> List Your Business</Link>
                </div>
              )}
            </div>
            {/* Company */}
            <div className="relative" onMouseEnter={() => handleMouseEnter('company')} onMouseLeave={handleMouseLeave}>
              <button className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'company' ? 'text-slate-900' : ''}`}>
                Company <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'company' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/about" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Info size={16} className="text-slate-500" /> About Us</Link>
                  <Link to="/careers" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Briefcase size={16} className="text-slate-500" /> Careers</Link>
                  <Link to="/press" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Newspaper size={16} className="text-slate-500" /> Press</Link>
                  <Link to="/contact" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Mail size={16} className="text-slate-500" /> Contact</Link>
                  <Link to="/user/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><User size={16} className="text-slate-500" /> User Dashboard</Link>
                  <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"><Settings size={16} className="text-slate-500" /> Admin Dashboard</Link>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-3 pointer-events-auto">
            <button className="hidden md:block p-2 text-slate-500 hover:text-slate-900 transition-colors">
              <Search size={20} />
            </button>

            {user ? (
              <div className="relative group/user">
                <button className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-emerald-500/20 transition-all">
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} alt="User" className="w-full h-full object-cover" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Account</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors text-sm font-medium text-slate-600">
                    <X size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2">
                Login
              </Link>
            )}

            <Link 
              ref={ctaRef}
              to="/deals" 
              className="bg-emerald-500 text-white px-5 py-2.5 rounded-full hover:bg-emerald-600 transition-colors font-bold text-sm shadow-[0_4px_14px_rgba(16,185,129,0.25)] flex items-center gap-2"
            >
              <span className="hidden xs:inline">Explore Deals</span>
              <ArrowRight size={14} className="md:hidden lg:inline" />
            </Link>

            <button 
              className="lg:hidden text-slate-900 p-2 hover:bg-slate-50 rounded-full transition-colors pointer-events-auto"
              onClick={() => { setIsMenuOpen(true); setMobileExpandedSection(null); }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay - MOVED OUTSIDE HEADER for better interaction */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
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
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl font-bold text-slate-700 transition-colors">
                          <User size={20} className="text-slate-400" /> Member Login
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

              {/* Footer User Info */}
              {user && (
                 <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Verified Member</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <LogOut size={20} aria-label="Logout" />
                      </button>
                   </div>
                 </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className={`flex-grow ${location.pathname === '/' ? '' : 'pt-32'}`}>
        <Outlet />
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
                  <div className="relative flex-grow">
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
