import { useState, useEffect } from "react";
import { 
  ArrowRight, CheckCircle2, MapPin, Ticket, Utensils, Sparkles, 
  Store, ShieldCheck, Zap, Star, ChevronDown, 
  Clock, Shield, ThumbsUp, Heart, Timer, 
  Briefcase, TrendingUp, Users, ShoppingBag
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { deals } from "../data/mockData";

export default function Home() {
  // Flash Sale Timer
  const [timeLeft, setTimeLeft] = useState(3600 * 4 + 23 * 60 + 59);
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);
  const hours = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // City Tabs
  const [activeCity, setActiveCity] = useState<"Lagos" | "Abuja">("Lagos");

  // How It Works Active Step
  const [activeStep, setActiveStep] = useState(1);

  // Hero Background Theme Selector
  const [heroTheme] = useState<1 | 2 | 3 | 4 | 5>(2);

  // Hero Rotating Businesses
  const [activeHeroBusiness, setActiveHeroBusiness] = useState(0);
  const heroBusinesses = [
    {
      name: "The Orchid Bistro",
      category: "Dining",
      location: "Ikeja GRA, Lagos",
      discount: "-30%",
      price: "₦15,000",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=60"
    },
    {
      name: "Hard Rock Cafe",
      category: "Nightlife",
      location: "VI, Lagos",
      discount: "-25%",
      price: "₦25,000",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=60"
    },
    {
      name: "The Yellow Chilli",
      category: "Dining",
      location: "Ikoyi, Lagos",
      discount: "-20%",
      price: "₦12,000",
      image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=60"
    },
    {
      name: "Nike Art Gallery",
      category: "Experience",
      location: "Lekki, Lagos",
      discount: "-15%",
      price: "₦5,000",
      image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=60"
    },
    {
      name: "Zuma Rock Resort",
      category: "Travel",
      location: "Suleja, Abuja",
      discount: "-40%",
      price: "₦45,000",
      image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=60"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroBusiness(prev => (prev + 1) % heroBusinesses.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const cityData = {
    Lagos: [
      { name: "Victoria Island", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=60" },
      { name: "Lekki Phase 1", image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=400&q=60" },
      { name: "Ikeja GRA", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=60" },
      { name: "Ikoyi", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=60" }
    ],
    Abuja: [
      { name: "Wuse 2", image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=400&q=60" },
      { name: "Maitama", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=60" },
      { name: "Garki", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=60" },
      { name: "Asokoro", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=60" }
    ]
  };

  const faqs = [
    { q: "How do I redeem a deal?", a: "Simply purchase the deal on our platform, and present the digital voucher code at the venue before requesting your bill. The discount is applied instantly." },
    { q: "Are there any hidden fees?", a: "No. The price shown on Slasham is the final price for the coupon. You pay the remaining discounted balance directly to the venue." },
    { q: "Can I get a refund?", a: "Coupons are non-refundable unless the business fails to honor a valid, unexpired code. In that case, we offer a 100% money-back guarantee." },
    { q: "How long are coupons valid?", a: "Validity periods vary by deal. Please check the specific terms on the deal page before purchasing. Most are valid for 30-90 days." }
  ];

  return (
    <div className="bg-[#FAFAFA] text-slate-900 font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION: Full-Screen Impact */}
      <section className={`relative min-h-screen flex items-center px-6 overflow-hidden transition-all duration-1000 pb-20 lg:pb-0 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
        
        {/* THEME BACKGROUNDS */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Theme 1: Lagos Pulse (Cinematic Night) */}
          {heroTheme === 1 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img 
                src="https://images.unsplash.com/photo-1618844502456-6597a393ed91?auto=format&fit=crop&w=1200&q=60" 
                alt="Lagos Night" 
                className="w-full h-full object-cover opacity-40 scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-950"></div>
              <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
            </motion.div>
          )}

          {/* Theme 2: Abuja Serenity (Bright & Airy) */}
          {heroTheme === 2 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#F8FAFC]"
            >
              <img 
                src="https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=60" 
                alt="Abuja Day" 
                className="w-full h-full object-cover opacity-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05)_0%,transparent_50%)]"></div>
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </motion.div>
          )}

          {/* Theme 3: The Grid (Modern SaaS Mesh) */}
          {heroTheme === 3 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
              <motion.div 
                animate={{ 
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-[150px]"
              />
              <motion.div 
                animate={{ 
                  x: [0, -100, 0],
                  y: [0, 50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-teal-500/10 rounded-full blur-[150px]"
              />
            </motion.div>
          )}

          {/* Theme 4: Royal Gold (Cultural High-End) */}
          {heroTheme === 4 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050505]"
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] border border-white/5 rounded-[100px] rotate-12"></div>
            </motion.div>
          )}

          {/* Theme 5: The Spotlight (Minimalist) */}
          {heroTheme === 5 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[100px]"></div>
            </motion.div>
          )}
        </div>


        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center pt-40 lg:pt-32">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-xs mb-8 border transition-colors duration-500 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-white/10 border-white/20 text-emerald-400' : 'bg-teal-50 border-teal-100 text-teal-700'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-emerald-400' : 'bg-teal-500'}`}></span>
              Now live in Lagos & Abuja
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-6xl lg:text-8xl font-bold tracking-tight mb-8 text-balance leading-[0.95] transition-colors duration-500 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'text-white' : 'text-slate-900'}`}
            >
              Experience more. <br />
              <span className={heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'text-slate-500' : 'text-slate-400'}>Spend less.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-xl mb-12 max-w-lg leading-relaxed transition-colors duration-500 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'text-slate-400' : 'text-slate-500'}`}
            >
              Unlock premium dining, spa, and nightlife experiences at a fraction of the cost. Join thousands of smart spenders discovering the city's best kept secrets.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/deals" className={`px-10 py-5 rounded-full font-bold transition-all shadow-2xl flex items-center justify-center gap-2 group ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'}`}>
                Explore Deals <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className={`px-10 py-5 border rounded-full font-bold transition-colors flex items-center justify-center ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                How it works
              </a>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative lg:h-[700px] flex items-center justify-center"
          >
            <div className={`absolute inset-0 rounded-full blur-[120px] opacity-30 transition-colors duration-700 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-emerald-500' : 'bg-teal-200'}`}></div>
            
            {/* Main Hero Image/Mockup - Rotating Businesses */}
            <div className="relative w-full max-w-md">
              <motion.div 
                key={activeHeroBusiness}
                initial={{ opacity: 0, y: 40, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -40, rotate: 5 }}
                transition={{ duration: 0.8, type: "spring" }}
                className={`relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.25)] ring-1 z-10 group cursor-pointer ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-slate-900 ring-white/10' : 'bg-white ring-slate-900/5'}`}
              >
                <img 
                  src={heroBusinesses[activeHeroBusiness].image} 
                  alt={heroBusinesses[activeHeroBusiness].name} 
                  className="w-full h-[65%] object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className={`p-8 h-[35%] flex flex-col justify-center relative z-20 transition-colors duration-500 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-1.5">{heroBusinesses[activeHeroBusiness].category}</p>
                      <h3 className={`text-2xl font-bold transition-colors duration-500 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'text-white' : 'text-slate-900'}`}>{heroBusinesses[activeHeroBusiness].name}</h3>
                    </div>
                    <div className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-500/20">{heroBusinesses[activeHeroBusiness].discount}</div>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-6"><MapPin size={16} className="text-emerald-500"/> {heroBusinesses[activeHeroBusiness].location}</p>
                  <div className={`flex justify-between items-center pt-6 border-t transition-colors duration-500 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'border-white/10' : 'border-slate-100'}`}>
                    <p className={`text-3xl font-black transition-colors duration-500 ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'text-white' : 'text-slate-900'}`}>{heroBusinesses[activeHeroBusiness].price}</p>
                    <button className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-slate-900 text-white hover:bg-emerald-500'}`}>Claim Deal</button>
                  </div>
                </div>
              </motion.div>

              {/* Business Indicators */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {heroBusinesses.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveHeroBusiness(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${activeHeroBusiness === i ? "w-8 bg-emerald-500" : "w-2 bg-slate-400/30"}`}
                  />
                ))}
              </div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute -left-16 top-20 p-5 rounded-3xl shadow-2xl ring-1 z-20 hidden md:flex items-center gap-4 backdrop-blur-xl ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'bg-white/10 ring-white/20' : 'bg-white ring-slate-900/5'}`}
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Verified Venue</p>
                  <p className={`text-sm font-bold ${heroTheme === 1 || heroTheme === 3 || heroTheme === 4 ? 'text-white' : 'text-slate-900'}`}>100% Authentic</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUSTED BY LOGOS (Infinite Marquee RTL) */}
      <section className="py-24 mt-12 border-y border-slate-200/60 bg-white overflow-hidden relative flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee-rtl flex items-center gap-16 md:gap-24 opacity-60 hover:opacity-100 transition-all duration-500">
            {/* Array of partners repeated twice for seamless loop */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-16 md:gap-24 px-8">
                <img src="https://cdn.simpleicons.org/dominos/64748B" alt="Dominos" className="h-8 md:h-10 w-auto object-contain hover:brightness-0 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/uber/64748B" alt="Uber" className="h-8 md:h-10 w-auto object-contain hover:brightness-0 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/starbucks/64748B" alt="Starbucks" className="h-8 md:h-10 w-auto object-contain hover:brightness-0 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/nike/64748B" alt="Nike" className="h-8 md:h-10 w-auto object-contain hover:brightness-0 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/marriott/64748B" alt="Marriott" className="h-8 md:h-10 w-auto object-contain hover:brightness-0 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/spotify/64748B" alt="Spotify" className="h-8 md:h-10 w-auto object-contain hover:brightness-0 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/burgerking/64748B" alt="Burger King" className="h-8 md:h-10 w-auto object-contain hover:brightness-0 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/kfc/64748B" alt="KFC" className="h-8 md:h-10 w-auto object-contain hover:brightness-0 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLASH SALES (Dynamic Countdown & Infinite Scroll) */}
      <section className="py-16 bg-red-50 border-y border-red-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                <Timer size={20} className="animate-pulse" />
                <span className="uppercase tracking-wider text-sm">Flash Sales</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Ending Soon</h2>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-red-100">
              <div className="text-center"><span className="text-xl font-bold text-red-600">{hours}</span><p className="text-[10px] text-slate-500 uppercase">hrs</p></div>
              <span className="text-red-300 font-bold text-xl">:</span>
              <div className="text-center"><span className="text-xl font-bold text-red-600">{minutes}</span><p className="text-[10px] text-slate-500 uppercase">min</p></div>
              <span className="text-red-300 font-bold text-xl">:</span>
              <div className="text-center"><span className="text-xl font-bold text-red-600">{seconds}</span><p className="text-[10px] text-slate-500 uppercase">sec</p></div>
            </div>
          </div>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="w-full overflow-hidden relative">
          <div className="flex animate-marquee-rtl gap-6 py-4">
            {/* Repeat the deals multiple times to ensure a seamless loop */}
            {[...deals, ...deals, ...deals, ...deals].map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`${deal.id}-${index}`} 
                className="w-[280px] sm:w-[320px] bg-white rounded-2xl overflow-hidden ring-1 ring-red-100 hover:ring-red-300 hover:shadow-xl transition-all group flex-shrink-0 flex flex-col"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    -40% OFF
                  </div>
                  <img 
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    referrerPolicy="no-referrer" 
                    loading="lazy" 
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-1.5">{deal.category}</span>
                  <h3 className="text-base font-semibold mb-1 text-slate-900 line-clamp-1">{deal.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                    <MapPin size={12} /> <span className="line-clamp-1">{deal.location}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-bold text-slate-900">{deal.price}</p>
                      <p className="text-xs font-medium text-slate-400 line-through">{deal.original}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Gradient Overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-red-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-red-50 to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* 4. PREMIUM PARTNERS (New Section with 5 Businesses) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-4 border border-emerald-100"
            >
              <Sparkles size={12} /> Partner Spotlight
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Our Premium Partners</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">We collaborate with the most iconic venues in Lagos and Abuja to bring you exclusive experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { id: "rsvp-lagos", name: "RSVP Lagos", type: "Upscale Dining", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=60", location: "VI, Lagos" },
              { id: "hard-rock-cafe", name: "Hard Rock Cafe", type: "Entertainment", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=60", location: "VI, Lagos" },
              { id: "yellow-chilli", name: "The Yellow Chilli", type: "Gourmet Nigerian", img: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=400&q=60", location: "Ikoyi, Lagos" },
              { id: "nike-art-gallery", name: "Nike Art Gallery", type: "Cultural Hub", img: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=400&q=60", location: "Lekki, Lagos" },
              { id: "oasis-wellness", name: "Oasis Wellness", type: "Spa & Spa", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=60", location: "Abuja" }
            ].map((partner, i) => (
              <Link 
                to={`/business/${partner.id}`}
                key={i}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <img 
                    src={partner.img} 
                    alt={partner.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">{partner.type}</p>
                    <h3 className="text-white font-bold text-lg mb-1">{partner.name}</h3>
                    <p className="text-white/60 text-xs flex items-center gap-1"><MapPin size={10} /> {partner.location}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS (Modern Dynamic Section - Ultra Compact) */}
      <section id="how-it-works" className="py-12 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: Content & Interactive Steps */}
            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[9px] uppercase tracking-widest mb-4 border border-emerald-100"
              >
                <Zap size={10} className="fill-current" /> Experience
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900 leading-tight"
              >
                Smart spending, <br />
                <span className="text-emerald-500 italic">simplified.</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-base mb-8 max-w-sm leading-relaxed"
              >
                We've removed the friction from high-end living. Seamless savings at the places you love.
              </motion.p>

              <div className="space-y-3 relative">
                {/* Vertical Progress Line */}
                <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-100 hidden md:block">
                  <motion.div 
                    className="w-full bg-emerald-500 origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: (activeStep - 1) / 2 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {[
                  { 
                    id: 1, 
                    title: "Discover", 
                    desc: "Curated selection of premium venues.",
                    icon: <Store size={18} />,
                    color: "emerald"
                  },
                  { 
                    id: 2, 
                    title: "Secure", 
                    desc: "Instant digital voucher in your wallet.",
                    icon: <Ticket size={18} />,
                    color: "amber"
                  },
                  { 
                    id: 3, 
                    title: "Save", 
                    desc: "Discount applied instantly to your bill.",
                    icon: <Zap size={18} />,
                    color: "rose"
                  }
                ].map((step) => (
                  <div 
                    key={step.id}
                    onMouseEnter={() => setActiveStep(step.id)}
                    className={`group cursor-pointer p-4 rounded-xl transition-all duration-300 relative ${
                      activeStep === step.id 
                        ? "bg-slate-50 shadow-sm ring-1 ring-slate-200/60" 
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        activeStep === step.id 
                          ? `bg-${step.color}-500 text-white shadow-md shadow-${step.color}-500/20` 
                          : "bg-white text-slate-400 ring-1 ring-slate-200 group-hover:text-slate-600"
                      }`}>
                        {step.icon}
                      </div>
                      <div>
                        <h3 className={`text-base font-bold transition-colors duration-300 ${
                          activeStep === step.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-xs leading-relaxed transition-all duration-300 ${
                          activeStep === step.id ? "text-slate-600 opacity-100 mt-0.5" : "text-slate-400 opacity-0 h-0 overflow-hidden"
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Immersive Visual Representation */}
            <div className="relative h-[350px] lg:h-[450px] perspective-1000">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-[2rem] -rotate-1 scale-95"></div>
              
              <motion.div 
                key={activeStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-lg bg-slate-900"
              >
                <img 
                  src={[
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=60",
                    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=60",
                    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=60"
                  ][activeStep - 1]} 
                  alt="Slasham Experience" 
                  className="w-full h-full object-cover opacity-50"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Floating UI Elements */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  {activeStep === 1 && (
                    <motion.div 
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-full max-w-[240px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                          <Store size={16} />
                        </div>
                        <div>
                          <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">Featured</p>
                          <h4 className="text-sm font-bold text-white leading-none">The Orchid Bistro</h4>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-emerald-500"></div>
                        </div>
                        <div className="flex justify-between text-[8px]">
                          <span className="text-white/60">Popularity</span>
                          <span className="text-emerald-400 font-bold">High</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-[240px] bg-white rounded-2xl p-5 shadow-2xl"
                    >
                      <div className="text-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mx-auto mb-2">
                          <Ticket size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Secured</h4>
                        <p className="text-[10px] text-slate-500">In your wallet</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2.5 border border-dashed border-slate-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Code</span>
                          <span className="text-[10px] font-mono font-bold text-slate-900">SLSH-8829</span>
                        </div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 3 && (
                    <motion.div 
                      initial={{ y: -15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-full max-w-[240px] bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest mb-0.5">Bill</p>
                          <p className="text-xl font-bold text-white">₦45,000</p>
                        </div>
                        <div className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter">
                          -₦15,000
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-white/60 text-[10px]">
                          <span>Subtotal</span>
                          <span>₦45,000</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 text-[10px] font-bold">
                          <span>Discount</span>
                          <span>-₦15,000</span>
                        </div>
                      </div>
                      <button className="w-full bg-emerald-500 text-white py-2.5 rounded-lg text-xs font-bold">
                        Confirmed
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRENDING DEALS (High-End E-commerce Cards) */}
      <section className="py-24 px-6 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Trending Now</h2>
              <p className="text-slate-500">Highly sought-after experiences, available for a limited time.</p>
            </div>
            <Link to="/deals" className="hidden sm:flex text-sm font-medium text-slate-900 items-center gap-1 hover:gap-2 transition-all">
              View all deals <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <Link to={`/deal/${deal.id}`} key={deal.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200/60 hover:ring-teal-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                    {deal.tag}
                  </div>
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest mb-1.5">{deal.category}</span>
                  <h3 className="text-base font-semibold mb-1 text-slate-900 line-clamp-1">{deal.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                    <MapPin size={12} /> <span className="line-clamp-1">{deal.location}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-bold text-slate-900">{deal.price}</p>
                      <p className="text-xs font-medium text-slate-400 line-through">{deal.original}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/deals" className="mt-8 sm:hidden w-full py-3 border border-slate-200 rounded-xl text-center font-medium text-slate-900 flex items-center justify-center gap-2">
            View all deals <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 6. SUCCESS STORIES (Infinite Marquee) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 font-medium text-sm mb-6">
            <Heart size={16} /> Success Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">Loved by thousands.</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">See how people are upgrading their lifestyle and saving money with Slasham.</p>
        </div>

        <div className="relative overflow-hidden pb-12">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          
          {/* Top Row (LTR) */}
          <div className="flex overflow-hidden w-full mb-6">
            <div className="animate-marquee-ltr flex items-center gap-6">
              {[
                { name: "Aisha M.", rating: 5, text: "I've saved over ₦50,000 this month alone just by using Slasham for my weekend dinners." },
                { name: "Chidi O.", rating: 5, text: "The app is so seamless. I walked into the spa, showed my voucher, and got treated like royalty." },
                { name: "Sarah T.", rating: 4, text: "Finally, a discount platform that actually has places I want to go to. Highly recommend!" },
                { name: "Emmanuel K.", rating: 5, text: "I bought a deal for my anniversary dinner. The restaurant was amazing and the discount was real." },
                { name: "Zainab A.", rating: 5, text: "Slasham makes it so easy to discover new spots in Abuja without breaking the bank." },
                { name: "Tobi D.", rating: 4, text: "Great customer service. I had an issue with a voucher and they resolved it in minutes." }
              ].map((review, i) => (
                <div key={`top-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                </div>
              ))}
              {[
                { name: "Aisha M.", rating: 5, text: "I've saved over ₦50,000 this month alone just by using Slasham for my weekend dinners." },
                { name: "Chidi O.", rating: 5, text: "The app is so seamless. I walked into the spa, showed my voucher, and got treated like royalty." },
                { name: "Sarah T.", rating: 4, text: "Finally, a discount platform that actually has places I want to go to. Highly recommend!" },
                { name: "Emmanuel K.", rating: 5, text: "I bought a deal for my anniversary dinner. The restaurant was amazing and the discount was real." },
                { name: "Zainab A.", rating: 5, text: "Slasham makes it so easy to discover new spots in Abuja without breaking the bank." },
                { name: "Tobi D.", rating: 4, text: "Great customer service. I had an issue with a voucher and they resolved it in minutes." }
              ].map((review, i) => (
                <div key={`top-dup-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row (RTL) */}
          <div className="flex overflow-hidden w-full">
            <div className="animate-marquee-rtl flex items-center gap-6">
              {[
                { name: "Femi B.", rating: 5, text: "Best value for money in Lagos right now. The portions at the restaurants are massive." },
                { name: "Ngozi E.", rating: 4, text: "Loved the interior decor of the places listed. The discount worked perfectly without any hassle." },
                { name: "David S.", rating: 5, text: "My girlfriend loved the surprise dinner. Thanks Slasham for the plug!" },
                { name: "Amaka U.", rating: 5, text: "I was skeptical at first, but the voucher was accepted immediately. Great service." },
                { name: "Ibrahim Y.", rating: 4, text: "Nice spots for a quiet evening. The savings are actually real." },
                { name: "Blessing O.", rating: 5, text: "Everything was perfect from start to finish. Highly recommend using this platform." }
              ].map((review, i) => (
                <div key={`bottom-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                </div>
              ))}
              {[
                { name: "Femi B.", rating: 5, text: "Best value for money in Lagos right now. The portions at the restaurants are massive." },
                { name: "Ngozi E.", rating: 4, text: "Loved the interior decor of the places listed. The discount worked perfectly without any hassle." },
                { name: "David S.", rating: 5, text: "My girlfriend loved the surprise dinner. Thanks Slasham for the plug!" },
                { name: "Amaka U.", rating: 5, text: "I was skeptical at first, but the voucher was accepted immediately. Great service." },
                { name: "Ibrahim Y.", rating: 4, text: "Nice spots for a quiet evening. The savings are actually real." },
                { name: "Blessing O.", rating: 5, text: "Everything was perfect from start to finish. Highly recommend using this platform." }
              ].map((review, i) => (
                <div key={`bottom-dup-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CATEGORIES (Editorial Grid) */}
      <section className="py-32 px-6 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 text-xs font-bold mb-6 uppercase tracking-widest">
                <Sparkles size={14} /> Curated Collections
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.9] uppercase">
                Explore by <br />
                <span className="text-teal-600">Category</span>
              </h2>
            </div>
            <p className="text-slate-500 text-lg max-w-xs leading-relaxed">
              Discover exclusive offers across our most popular lifestyle categories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            {[
              { name: "Dining", icon: <Utensils size={24}/>, count: "120+ Deals", color: "bg-orange-50 text-orange-600", path: "/deals/food" },
              { name: "Nightlife", icon: <Store size={24}/>, count: "45+ Deals", color: "bg-indigo-50 text-indigo-600", path: "/deals/experiences" },
              { name: "Wellness", icon: <Sparkles size={24}/>, count: "80+ Deals", color: "bg-teal-50 text-teal-600", path: "/deals/beauty" },
              { name: "Events", icon: <Ticket size={24}/>, count: "30+ Deals", color: "bg-rose-50 text-rose-600", path: "/deals/experiences" },
              { name: "Travel", icon: <MapPin size={24}/>, count: "60+ Deals", color: "bg-blue-50 text-blue-600", path: "/deals/experiences" },
              { name: "Shopping", icon: <ShoppingBag size={24}/>, count: "200+ Deals", color: "bg-amber-50 text-amber-600", path: "/deals/products" },
              { name: "Fitness", icon: <TrendingUp size={24}/>, count: "40+ Deals", color: "bg-emerald-50 text-emerald-600", path: "/deals/services" },
              { name: "Services", icon: <Briefcase size={24}/>, count: "25+ Deals", color: "bg-slate-50 text-slate-600", path: "/deals/services" }
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link 
                  to={cat.path} 
                  className="bg-white p-10 hover:bg-slate-50 transition-all group flex flex-col h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-8xl font-black tracking-tighter leading-none select-none">0{i + 1}</span>
                  </div>
                  
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    {cat.icon}
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">{cat.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">{cat.count}</p>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FEATURED DEAL (Atmospheric & Immersive) */}
      <section className="relative py-32 lg:py-48 overflow-hidden bg-slate-950">
        {/* Background Image with Blur & Gradient */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30 blur-sm scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Column: Image with Artistic Mask */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative group"
            >
              <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80" 
                  alt="Oasis Wellness Resort" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                
                {/* Floating Discount Badge */}
                <div className="absolute top-8 right-8 w-24 h-24 bg-teal-500 rounded-full flex flex-col items-center justify-center text-slate-950 shadow-2xl transform -rotate-12 border-4 border-white/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Save</span>
                  <span className="text-3xl font-black">45%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Off</span>
                </div>
              </div>
              
              {/* Decorative Glows */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Right Column: Refined Typography & Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold mb-8 uppercase tracking-[0.3em]">
                <Clock size={14} /> Limited Offer
              </div>
              
              <h2 className="font-serif text-6xl md:text-8xl font-medium tracking-tight mb-8 leading-[0.9] text-white">
                Oasis <br />
                <span className="italic text-teal-400">Wellness</span> <br />
                Resort
              </h2>
              
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                Escape the city. Enjoy a 60-minute deep tissue massage, full access to thermal pools, and a complimentary 3-course lunch.
              </p>
              
              <div className="glass-panel rounded-3xl p-8 mb-10 bg-white/5 border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Exclusive Price</p>
                    <p className="text-4xl font-bold text-white tracking-tighter">₦25,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Regular</p>
                    <p className="text-xl font-medium text-slate-500 line-through tracking-tighter">₦45,000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&q=80" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&q=80" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&w=100&q=80" alt="User" />
                  </div>
                  <p className="text-xs text-slate-400">
                    <span className="text-white font-bold">120+ people</span> claimed this today
                  </p>
                </div>
              </div>

              <Link to="/deal/4" className="w-full inline-flex items-center justify-center px-10 py-5 bg-teal-500 text-slate-950 rounded-2xl font-bold hover:bg-teal-400 transition-all shadow-[0_20px_50px_rgba(20,184,166,0.2)] group">
                Claim Offer Now <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. NEIGHBORHOODS (Interactive Tabs) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Popular Neighborhoods</h2>
            <p className="text-slate-500">Discover the best experiences in your area.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveCity("Lagos")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeCity === "Lagos" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Lagos
            </button>
            <button 
              onClick={() => setActiveCity("Abuja")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeCity === "Abuja" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Abuja
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cityData[activeCity].map((loc, i) => (
            <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer ring-1 ring-slate-200/60">
              <img src={loc.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" referrerPolicy="no-referrer" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5">
                <h3 className="text-white font-semibold text-lg">{loc.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. TRUST & SECURITY (Clean Utility Style) */}
      <section className="py-32 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <h2 className="text-4xl font-bold tracking-tight mb-6 text-slate-900 leading-tight">Why trust <br/>Slasham?</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                We've built a platform based on transparency, security, and verified quality. Your experience is our priority.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {i === 4 ? "50k+" : <Users size={14} />}
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-slate-900">Trusted by 50,000+ users</p>
              </div>
            </div>
            
            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-8">
              {[
                { 
                  icon: <ShieldCheck className="text-teal-600" />, 
                  title: "100% Verified Venues", 
                  desc: "Every business on our platform undergoes a strict vetting process. No fake listings or outdated deals." 
                },
                { 
                  icon: <ThumbsUp className="text-amber-600" />, 
                  title: "Guaranteed Value", 
                  desc: "The price you see is the price you pay. No hidden fees or surprise charges at the venue, ever." 
                },
                { 
                  icon: <Shield className="text-blue-600" />, 
                  title: "Secure Payments", 
                  desc: "Bank-grade encryption ensures your payment details are always safe and protected by industry leaders." 
                },
                { 
                  icon: <TrendingUp className="text-rose-600" />, 
                  title: "Real-time Updates", 
                  desc: "Deals are updated in real-time, ensuring you always have access to the latest and best offers." 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ (Modern Split Layout) */}
      <section className="py-32 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 text-xs font-bold mb-6 uppercase tracking-widest">
                  <ShieldCheck size={14} /> Support Center
                </div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.9] uppercase mb-8">
                  Got <br />
                  <span className="text-teal-600">Questions?</span>
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-10">
                  Everything you need to know about Slasham. Can't find what you're looking for? Reach out to our support team.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-teal-600 transition-colors group">
                  Contact Support <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group rounded-[2rem] border transition-all duration-500 ${openFaq === i ? 'bg-white border-teal-200 shadow-2xl shadow-teal-100/50' : 'bg-white/50 border-slate-200 hover:border-slate-300'}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-8 md:p-10 flex justify-between items-start text-left gap-6"
                  >
                    <div className="flex gap-6">
                      <span className={`text-xl font-black tabular-nums transition-colors duration-500 ${openFaq === i ? 'text-teal-600' : 'text-slate-300'}`}>
                        0{i + 1}
                      </span>
                      <h4 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${openFaq === i ? 'text-slate-900' : 'text-slate-700'}`}>
                        {faq.q}
                      </h4>
                    </div>
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${openFaq === i ? 'bg-teal-600 border-teal-600 text-white rotate-180' : 'bg-white border-slate-200 text-slate-400'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-8 md:px-10 pb-10 ml-14">
                      <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 13. BUSINESS CTA (Split Layout Style) */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 items-center relative z-10">
            <div className="p-12 md:p-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold mb-8 uppercase tracking-widest">
                <Briefcase size={14} /> For Businesses
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white leading-tight">
                Grow your business <br/>with Slasham.
              </h2>
              <p className="text-slate-400 text-xl mb-12 leading-relaxed max-w-lg">
                Partner with us to reach thousands of high-intent customers. Fill empty seats, boost revenue, and build lasting brand loyalty.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Boost Revenue</h4>
                    <p className="text-slate-500 text-sm">Fill off-peak hours and increase your bottom line.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">New Customers</h4>
                    <p className="text-slate-500 text-sm">Access a curated audience of smart spenders.</p>
                  </div>
                </div>
              </div>

              <Link to="/business" className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 rounded-full font-bold hover:bg-teal-400 transition-all shadow-xl hover:shadow-teal-500/20 group">
                List Your Business Today <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative h-full min-h-[400px] lg:min-h-[600px] hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80" 
                alt="Business Owner" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent"></div>
              
              {/* Floating Stat Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl max-w-xs"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-slate-900">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-2xl">3.5x</p>
                    <p className="text-slate-400 text-xs uppercase tracking-widest">Avg. ROI</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  "Slasham has completely transformed our Tuesday nights. We're now consistently at 90% capacity."
                </p>
                <p className="text-white text-xs font-bold mt-4 uppercase tracking-widest">— Owner, The Orchid Bistro</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
