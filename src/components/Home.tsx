import { useState, useEffect, Suspense, lazy } from "react";
import { MapPin, Zap, ArrowRight, TrendingUp, Timer, ChevronDown, Utensils, Moon, Plane, ShoppingBag, Briefcase, Sparkles } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { SUPPORTED_LOCATIONS } from "../utils/locations";
import { apiClient } from "../api/client";

// Lazy load DealCard for better performance
const DealCard = lazy(() => import("./DealCard"));

export default function Home() {
  const { city, setCity } = useOutletContext<{ city: string; setCity: (c: string) => void }>();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [adBanners, setAdBanners] = useState<any[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient("/deals/home");
        const formattedDeals = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          price: d.discount_price.toString(),
          original: d.original_price.toString(),
          image: d.images?.[0] || "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
          category: d.category,
          location: d.merchants?.city || "Lagos",
          expiryDate: d.expiry_date,
          totalQuantity: d.total_quantity,
          soldQuantity: d.sold_quantity,
          dealExplanation: d.deal_explanation,
        }));
        setAllDeals(formattedDeals);

        // Generate dynamic banners from first 3 deals
        const banners = formattedDeals.slice(0, 3).map((d: any) => ({
          image: d.image,
          title: d.title,
          subtitle: d.dealExplanation || "Limited Time Offer",
          code: "SLASHAM",
          badge: d.category ? `🔥 ${d.category.toUpperCase()}` : "🔥 FEATURED DEAL"
        }));
        setAdBanners(banners.length > 0 ? banners : [
          {
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
            title: "DISCOVER PREMIUM DEALS",
            subtitle: "Exclusive Verified Offers",
            code: "WELCOME",
            badge: "✨ MARKETPLACE"
          }
        ]);
      } catch (error) {
        console.error("Home deals fetch failed:", error);
        // Set fallback data for instant loading
        setAllDeals([]);
        setAdBanners([
          {
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
            title: "DISCOVER PREMIUM DEALS",
            subtitle: "Exclusive Verified Offers",
            code: "WELCOME",
            badge: "✨ MARKETPLACE"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // Filtered Deals
  const filteredDeals = allDeals.filter(d => d.location.toLowerCase().includes(city.toLowerCase()));
  const trendingDeals = filteredDeals.slice(0, 36);

  useEffect(() => {
    const interval = setInterval(() => {
      if (adBanners.length > 0) {
        setCurrentAdIndex((prev) => (prev + 1) % adBanners.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [adBanners]);

  const formatPrice = (p: string) => {
    const digits = p.replace(/\D/g, '');
    return `₦${Number(digits).toLocaleString()}`;
  };

  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">
      
      {/* 1. PREMIUM AD BILLBOARD (Auto-rotating Hero) */}
      <section className="relative overflow-hidden h-[520px] md:h-[640px]" style={{ background: '#0d2e24' }}>
        <div className="absolute inset-0 opacity-[0.04] z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />

        <AnimatePresence mode="wait">
          {adBanners.length > 0 && (
            <motion.div
              key={currentAdIndex}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img src={adBanners[currentAdIndex].image} className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0d2e24 0%, #1a5c3a 30%, #3EB28F44 65%, transparent 100%)' }} />
              <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to bottom, #0d2e2488 0%, #0d2e24cc 100%)' }} />

              <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-12 z-20">
                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  className="inline-flex py-1.5 px-4 rounded-full border border-[#3EB28F]/40 text-[#3EB28F] text-[10px] font-black uppercase tracking-[0.2em] mb-4 w-max"
                  style={{ background: 'rgba(62,178,143,0.12)', backdropFilter: 'blur(8px)' }}
                >
                  {adBanners[currentAdIndex].badge}
                </motion.div>

                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-[#3EB28F] font-black text-xs uppercase tracking-[0.3em] mb-2">
                  🔥 {adBanners[currentAdIndex].subtitle}
                </motion.p>

                <motion.h2
                  initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl lg:text-7xl font-black text-white w-full max-w-3xl leading-none tracking-tight mb-6 drop-shadow-2xl uppercase"
                >
                  {adBanners[currentAdIndex].title}
                </motion.h2>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap items-center gap-4">
                  <div className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center gap-4">
                    Use Promo Code
                    <span className="text-white px-3 py-1.5 rounded-lg text-sm tracking-widest font-black" style={{ background: '#3EB28F' }}>
                      {adBanners[currentAdIndex].code}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
                    <span className="w-2 h-2 rounded-full bg-[#3EB28F] animate-pulse shadow-[0_0_8px_#3EB28F]" />
                    {Math.floor(Math.random() * (1500 - 400 + 1) + 400).toLocaleString()}+ people browsing now
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
           {adBanners.map((_, i) => (
             <button
               key={i}
               onClick={() => setCurrentAdIndex(i)}
               className={`h-1.5 rounded-full transition-all duration-500 ${i === currentAdIndex ? 'w-12' : 'w-4 opacity-30 hover:opacity-60'}`}
               style={{ background: i === currentAdIndex ? '#3EB28F' : '#ffffff' }}
             />
           ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 z-20" style={{ background: 'linear-gradient(to right, #3EB28F, #1a5c3a, #3EB28F)' }} />
      </section>

      {/* 2. TRENDING DEALS TICKER */}
      <section className="pt-6 pb-6 bg-slate-50 border-b border-slate-200/60 overflow-hidden relative shadow-inner">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600 font-black">
            <Timer size={14} className="animate-pulse" />
            <span className="uppercase tracking-[0.2em] text-[9px]">Flash Sales Wrapping Up</span>
          </div>
          <Link to="/deals" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-1 group">
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="w-full overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex animate-marquee-ltr gap-4 px-6 w-max">
            {filteredDeals.slice(0, 15).map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`flash-${deal.id}-${index}`} 
                className="w-[240px] bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-red-300 hover:shadow-xl transition-all group shrink-0 flex items-center p-2.5 gap-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="min-w-0 pr-2 pb-1">
                   <p className="text-[7px] font-black text-red-500 uppercase tracking-widest mb-1">{deal.category}</p>
                   <h3 className="text-[10px] font-black text-slate-900 truncate group-hover:text-red-600 transition-colors uppercase tracking-tight leading-tight">
                       {deal.title}
                   </h3>
                   <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-red-600 font-black text-xs">{formatPrice(deal.price)}</span>
                      <span className="text-[8px] text-slate-400 line-through font-bold">{formatPrice(deal.original)}</span>
                   </div>
                </div>
              </Link>
            ))}
            {/* Duplicate for marquee */}
            {filteredDeals.slice(0, 15).map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`flash-dup-${deal.id}-${index}`} 
                className="w-[240px] bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-red-300 hover:shadow-xl transition-all group shrink-0 flex items-center p-2.5 gap-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="min-w-0 pr-2 pb-1">
                   <p className="text-[7px] font-black text-red-500 uppercase tracking-widest mb-1">{deal.category}</p>
                   <h3 className="text-[10px] font-black text-slate-900 truncate group-hover:text-red-600 transition-colors uppercase tracking-tight leading-tight">
                       {deal.title}
                   </h3>
                   <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-red-600 font-black text-xs">{formatPrice(deal.price)}</span>
                      <span className="text-[8px] text-slate-400 line-through font-bold">{formatPrice(deal.original)}</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORY QUICK NAV */}
      <section className="py-12 px-6 bg-white overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 md:gap-8 justify-start md:justify-center">
            {[
              { name: "Food & Drink", icon: <Utensils size={24}/>, color: "bg-orange-50 text-orange-600", path: "/deals/food" },
              { name: "Beauty & Spas", icon: <Moon size={24}/>, color: "bg-indigo-50 text-indigo-600", path: "/deals/beauty" },
              { name: "Things To Do", icon: <Plane size={24}/>, color: "bg-teal-50 text-teal-600", path: "/deals/experiences" },
              { name: "Goods", icon: <ShoppingBag size={24}/>, color: "bg-amber-50 text-amber-600", path: "/deals/products" },
              { name: "Local Services", icon: <Briefcase size={24}/>, color: "bg-slate-50 text-slate-600", path: "/deals/services" },
            ].map((cat, i) => (
              <Link 
                key={i} 
                to={cat.path}
                className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-[40px] hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 transition-all group shrink-0 w-[140px] md:w-auto"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 shadow-sm transition-transform`}>{cat.icon}</div>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-tight text-center">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING DEALS GRID */}
      <section className="pt-2 pb-12 px-4 md:px-10 bg-white">
        <div className="max-w-[1550px] mx-auto bg-white rounded-2xl shadow-[0_10px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-12 md:p-16 border-b border-emerald-100/70 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #10B981 0%, #000000 100%)' }}>
                    <TrendingUp size={20} />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-none text-slate-900">Trending Deals</h2>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] pl-1" style={{ color: '#3EB28F' }}>Premium Verified Exclusives</p>
               </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)} className="flex items-center gap-3 bg-white/70 px-6 py-3.5 rounded-2xl border border-emerald-200/60 cursor-pointer hover:bg-white transition-colors z-20">
                  <MapPin size={18} className="text-teal-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">{city}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                <AnimatePresence>
                {isLocationDropdownOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30" onClick={() => setIsLocationDropdownOpen(false)}></motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute top-full right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-40">
                      {SUPPORTED_LOCATIONS.map((loc) => (
                        <button key={loc.id} onClick={() => { setCity(loc.name); setIsLocationDropdownOpen(false); }} className={`w-full text-left px-6 py-4 text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors ${city === loc.name ? "text-teal-600 bg-teal-50/50" : "text-slate-500"}`}>
                          {loc.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
                </AnimatePresence>
              </div>
              <Link to="/deals" className="text-[11px] font-black text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-2 uppercase tracking-[0.2em] group border-b-2 border-transparent hover:border-teal-600 pb-1">
                View all <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="p-12 md:p-16">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sourcing Exclusive Nodes...</p>
              </div>
            ) : (
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                 <Suspense fallback={<div className="w-full h-80 bg-slate-100 rounded-xl animate-pulse" />}>
                   {trendingDeals.map((deal, index) => (
                     <DealCard key={deal.id} id={deal.id} title={deal.title} price={deal.price} original={deal.original} image={deal.image} category={deal.category} location={deal.location} expiryDate={deal.expiryDate} totalQuantity={deal.totalQuantity} soldQuantity={deal.soldQuantity} dealExplanation={deal.dealExplanation} index={index} />
                   ))}
                 </Suspense>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 5. SIDEBAR CATEGORIES & FEED */}
      <section className="py-24 px-4 md:px-10 bg-white border-t border-slate-50">
        <div className="max-w-[1550px] mx-auto flex flex-col lg:flex-row gap-14">
            <aside className="w-full lg:w-[130px] shrink-0">
               <div className="sticky top-6">
                 <div className="bg-teal-50 px-3 py-2 rounded-xl border border-teal-100 text-[11px] font-black text-teal-600 uppercase tracking-widest mb-8 text-center shadow-sm">
                    Categories
                 </div>
                 <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-3">
                    {[
                        { name: "Food & Drink", icon: <Utensils size={18}/>, count: "120+", color: "text-rose-500", bg: "bg-rose-50/50", border: "border-rose-100", path: "/deals/food" },
                        { name: "Beauty & Spas", icon: <Sparkles size={18}/>, count: "85+", color: "text-indigo-500", bg: "bg-indigo-50/50", border: "border-indigo-100", path: "/deals/beauty" },
                        { name: "Things To Do", icon: <Zap size={18}/>, count: "60+", color: "text-sky-500", bg: "bg-sky-50/50", border: "border-sky-100", path: "/deals/experiences" },
                        { name: "Goods", icon: <ShoppingBag size={18}/>, count: "200+", color: "text-amber-500", bg: "bg-amber-50/50", border: "border-amber-100", path: "/deals/products" },
                        { name: "Local Services", icon: <Briefcase size={18}/>, count: "40+", color: "text-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-100", path: "/deals/services" },
                    ].map((cat, i) => (
                        <Link key={i} to={cat.path} className={`flex flex-col items-center justify-center p-2.5 lg:p-4 ${cat.bg} border ${cat.border} rounded-2xl lg:rounded-3xl hover:bg-white hover:shadow-lg transition-all group shadow-sm active:scale-95`}>
                           <div className={`w-8 h-8 lg:w-10 lg:h-10 bg-white ${cat.color} rounded-lg lg:rounded-xl flex items-center justify-center mb-1.5 lg:mb-2 group-hover:scale-110 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.04)]`}>{cat.icon}</div>
                           <span className="text-[9px] lg:text-[10px] font-black text-slate-800 uppercase tracking-tight">{cat.name}</span>
                           <span className="text-[7px] lg:text-[8px] font-bold text-slate-400 mt-0.5">{cat.count} Deals</span>
                        </Link>
                    ))}
                 </div>
               </div>
            </aside>

            <div className="flex-1">
               <div className="flex items-center gap-4 mb-12">
                  <div className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2.5 border border-rose-100 shadow-sm">
                     <Zap size={16} className="fill-rose-500" /> Slasham Top Choices
                  </div>
                  <div className="h-px grow bg-slate-100" />
                  <Link to="/deals" className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors flex items-center gap-2">Discover all <ArrowRight size={16}/></Link>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  <Suspense fallback={<div className="w-full h-80 bg-slate-100 rounded-xl animate-pulse" />}>
                    {filteredDeals.slice(0, 36).map((p, i) => (
                      <DealCard key={p.id} id={p.id} title={p.title} price={p.price} original={p.original} image={p.image} category={p.category} location={p.location} expiryDate={p.expiryDate} totalQuantity={p.totalQuantity} soldQuantity={p.soldQuantity} dealExplanation={p.dealExplanation} index={i} />
                    ))}
                  </Suspense>
               </div>
            </div>
        </div>
      </section>

      {/* 6. BUSINESS CTA */}
      <section className="mt-12 mb-0 py-0 w-full relative overflow-hidden bg-emerald-50/50 border-y border-emerald-100 flex flex-col lg:block">
        <div className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[50vw] min-h-[300px] sm:min-h-[400px] order-last lg:order-0">
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80" alt="Slasham Merchant Success" className="absolute inset-0 w-full h-full object-cover lg:object-left" />
          <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-emerald-50/50 via-emerald-50/20 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full flex relative z-10 order-first lg:order-0">
          <div className="w-full lg:w-1/2 py-16 md:py-24 lg:py-32 lg:pr-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-600 text-[10px] font-black mb-8 uppercase tracking-[0.2em] shadow-sm">Official Business Partners</div>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight mb-6 text-slate-900 leading-[1.05] uppercase">Grow Your <br className="hidden xl:block" />Business<span className="text-emerald-500">.</span></h2>
            <p className="text-slate-500 font-medium text-base md:text-lg mb-10 leading-relaxed max-w-md mx-auto lg:mx-0">Activate your business on Slasham and reach thousands of verified customers looking for great deals tonight.</p>
            <Link to="/business" className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group/btn">Join as Partner <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
