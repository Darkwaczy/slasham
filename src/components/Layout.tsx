import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Twitter, Instagram, Facebook, Linkedin, Mail, ArrowRight, Search, 
  ChevronDown, User, Utensils, Sparkles, Heart, Package, Settings, ShoppingBag, 
  Store, Zap, MapPin, TrendingUp, Plus, Info, Briefcase, Newspaper, CheckCircle2 
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("slasham_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      
      {/* Floating Pill Navbar */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-full px-6 py-2.5 grid grid-cols-3 items-center w-full max-w-6xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] pointer-events-auto transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Slasham<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center justify-center gap-6 text-sm font-semibold text-slate-600">
            {/* Browse Deals Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('browse')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'browse' ? 'text-slate-900' : ''}`}
              >
                Deal <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'browse' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'browse' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/deals/food" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Utensils size={16} className="text-orange-500" /> Food & Drinks
                  </Link>
                  <Link to="/deals/experiences" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Sparkles size={16} className="text-purple-500" /> Experiences
                  </Link>
                  <Link to="/deals/beauty" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Heart size={16} className="text-rose-500" /> Beauty & Wellness
                  </Link>
                  <Link to="/deals/products" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Package size={16} className="text-blue-500" /> Products
                  </Link>
                  <Link to="/deals/services" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Settings size={16} className="text-slate-500" /> Services
                  </Link>
                </div>
              )}
            </div>

            {/* How It Works Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('how')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'how' ? 'text-slate-900' : ''}`}
              >
                Process <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'how' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'how' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/how-it-works/buy" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <ShoppingBag size={16} className="text-emerald-500" /> Buy coupon
                  </Link>
                  <Link to="/how-it-works/visit" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Store size={16} className="text-blue-500" /> Visit business
                  </Link>
                  <Link to="/how-it-works/unlock" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Zap size={16} className="text-amber-500" /> Unlock more
                  </Link>
                </div>
              )}
            </div>

            {/* Cities Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('cities')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'cities' ? 'text-slate-900' : ''}`}
              >
                Cities <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'cities' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'cities' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/cities/abuja" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left">
                    <MapPin size={16} className="text-slate-900" /> Abuja
                  </Link>
                  <Link to="/cities/lagos" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left">
                    <MapPin size={16} className="text-slate-900" /> Lagos
                  </Link>
                  <Link to="/cities/port-harcourt" className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600">
                      <MapPin size={16} /> Port Harcourt
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Later</span>
                  </Link>
                </div>
              )}
            </div>

            {/* For Businesses Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('business')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'business' ? 'text-slate-900' : ''}`}
              >
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
                  <Link to="/business/campaign" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <TrendingUp size={16} className="text-blue-500" /> Run a Campaign
                  </Link>
                  <Link to="/business/list" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Plus size={16} className="text-amber-500" /> List Your Business
                  </Link>
                </div>
              )}
            </div>

            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('company')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${activeDropdown === 'company' ? 'text-slate-900' : ''}`}
              >
                Company <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'company' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/about" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Info size={16} className="text-slate-500" /> About Us
                  </Link>
                  <Link to="/careers" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Briefcase size={16} className="text-slate-500" /> Careers
                  </Link>
                  <Link to="/press" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Newspaper size={16} className="text-slate-500" /> Press
                  </Link>
                  <Link to="/contact" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Mail size={16} className="text-slate-500" /> Contact
                  </Link>
                  <Link to="/user/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <User size={16} className="text-slate-500" /> User Dashboard
                  </Link>
                  <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Settings size={16} className="text-slate-500" /> Admin Dashboard
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
              <Search size={20} />
            </button>

            {user ? (
              <div className="relative group/user">
                <button className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-emerald-500/20 transition-all">
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} alt="User" className="w-full h-full object-cover" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors text-sm font-medium text-slate-600"
                  >
                    <X size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2">
                Login
              </Link>
            )}

            <Link 
              ref={ctaRef}
              to="/deals" 
              className="bg-emerald-500 text-white px-5 py-2.5 rounded-full hover:bg-emerald-600 transition-colors font-bold text-sm shadow-[0_4px_14px_rgba(16,185,129,0.25)] flex items-center gap-2"
            >
              Explore Deals
            </Link>

            <button 
              className="lg:hidden text-slate-900 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-4 right-4 bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col gap-4 shadow-xl pointer-events-auto max-h-[80vh] overflow-y-auto">
            <div className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">Deal</div>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/deals/food" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Food & Drinks</Link>
              <Link to="/deals/experiences" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Experiences</Link>
              <Link to="/deals/beauty" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Beauty & Wellness</Link>
              <Link to="/deals/products" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link to="/deals/services" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Services</Link>
            </div>
            
            <hr className="border-slate-100" />
            
            <div className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">Process</div>
            <div className="flex flex-col gap-2">
              <Link to="/how-it-works/buy" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Buy coupon</Link>
              <Link to="/how-it-works/visit" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Visit business</Link>
              <Link to="/how-it-works/unlock" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Unlock more</Link>
            </div>

            <hr className="border-slate-100" />

            <div className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">Cities</div>
            <div className="flex flex-col gap-2">
              <Link to="/cities/abuja" className="text-sm font-medium text-slate-900 p-3 bg-emerald-50 rounded-xl flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                <span>Abuja</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700">Active</span>
              </Link>
              <Link to="/cities/lagos" className="text-sm font-medium text-slate-400 p-3 bg-slate-50 rounded-xl flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                <span>Lagos</span>
                <span className="text-[10px] font-bold uppercase bg-slate-200 px-1.5 py-0.5 rounded text-slate-500">Soon</span>
              </Link>
              <Link to="/cities/port-harcourt" className="text-sm font-medium text-slate-400 p-3 bg-slate-50 rounded-xl flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                <span>Port Harcourt</span>
                <span className="text-[10px] font-bold uppercase bg-slate-200 px-1.5 py-0.5 rounded text-slate-500">Later</span>
              </Link>
            </div>

            <hr className="border-slate-100" />

            <div className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">For Business</div>
            <div className="flex flex-col gap-2">
              <Link to="/business/benefits" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>My Business</Link>
              <Link to="/business/campaign" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Run a Campaign</Link>
              <Link to="/business/list" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>List Your Business</Link>
            </div>

            <hr className="border-slate-100" />

            <div className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">Company</div>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              <Link to="/careers" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Careers</Link>
              <Link to="/press" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Press</Link>
              <Link to="/contact" className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} alt="User" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left p-3 text-rose-600 font-bold bg-rose-50 rounded-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-base font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
            <Link to="/deals" className="bg-emerald-500 text-white px-5 py-4 rounded-xl text-center font-bold mt-2 shadow-sm" onClick={() => setIsMenuOpen(false)}>
              Explore Deals
            </Link>
          </div>
        )}
      </header>

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
