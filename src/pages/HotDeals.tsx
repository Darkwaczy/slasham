import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { MapPin, Zap, Utensils, Store, Sparkles, Ticket, ShoppingBag, TrendingUp, Briefcase, ArrowRight, Star, Truck, Filter } from "lucide-react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import FavoriteButton from "../components/FavoriteButton";
import { deals as staticDeals } from "../data/mockData";
import { getPersistentDeals } from "../utils/mockPersistence";

export default function HotDeals() {
  const { city } = useOutletContext<{ city: string }>();
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    setAllDeals([...getPersistentDeals(), ...staticDeals]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const AD_BANNERS = [
    {
      bg: "bg-rose-50",
      pattern: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=1200&q=80",
      title: "Hot Coupons.",
      subtitle: "Verified Deals.",
      desc: "Fast-selling, deep discounts on exclusive experiences.",
      code: "HOTSLASH",
      codeBg: "bg-rose-600 shadow-rose-600/20",
      img1: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
      img2: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80"
    },
    {
       bg: "bg-amber-50",
       pattern: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
       title: "Exclusive",
       subtitle: "Partnership.",
       desc: "Limited-time offers from our top verified merchants.",
       code: "PARTNER10",
       codeBg: "bg-amber-600 shadow-amber-600/20",
       img1: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
       img2: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80"
     },
     {
       bg: "bg-sky-50",
       pattern: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
       title: "Weekend",
       subtitle: "Flash Sales.",
       desc: "Catch them before they expire this Sunday night.",
       code: "WKDDEAL",
       codeBg: "bg-sky-600 shadow-sky-600/20",
       img1: "https://images.unsplash.com/photo-1414235077428-33898bd1e150?auto=format&fit=crop&w=400&q=80",
       img2: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
     }
  ];

  useEffect(() => {
    gsap.fromTo(
      ".deal-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.4 }
    );
  }, [allDeals]);

  const filteredDeals = allDeals.filter(d => 
    (d.isHotCoupon || d.tag?.toLowerCase().includes('hot')) &&
    d.location.toLowerCase().includes(city.toLowerCase())
  );

  const formatPrice = (p: string) => {
    const digits = p.replace(/\D/g, '');
    return `₦${Number(digits).toLocaleString()}`;
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-0 font-sans">
      {/* 1. AUTO-ROTATING BANNER (EXPANDED) */}
      <section className="px-4 lg:px-6 mb-8 -mt-12 relative z-10">
        <div className="w-full relative rounded-4xl overflow-hidden bg-white min-h-[220px] lg:min-h-[260px] flex items-center border border-slate-200 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAdIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 w-full h-full ${AD_BANNERS[currentAdIndex].bg} flex items-center`}
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url(${AD_BANNERS[currentAdIndex].pattern})` }}></div>
              <div className="relative z-10 p-8 lg:p-14 flex flex-col lg:flex-row items-center justify-between w-full gap-8">
                <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center gap-2 text-rose-600 font-black mb-4 justify-center lg:justify-start">
                        <Zap size={14} className="fill-rose-600" />
                        <span className="uppercase tracking-[0.2em] text-[10px]">Exclusive Verified Hot Offer</span>
                    </div>
                   <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-4">
                     {AD_BANNERS[currentAdIndex].title}<br/>
                     {AD_BANNERS[currentAdIndex].subtitle}
                   </h2>
                   <p className="text-slate-500 text-sm lg:text-lg font-bold mb-8 max-w-sm leading-tight mx-auto lg:mx-0">
                     {AD_BANNERS[currentAdIndex].desc}
                   </p>
                   <div className="flex items-center gap-4 justify-center lg:justify-start">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Use Code:</span>
                      <div className={`px-10 py-3 ${AD_BANNERS[currentAdIndex].codeBg} text-white rounded-2xl font-black text-sm shadow-2xl active:scale-95 cursor-pointer uppercase tracking-widest transition-all hover:brightness-105`}>
                        {AD_BANNERS[currentAdIndex].code}
                      </div>
                   </div>
                </div>
                <div className="hidden lg:flex flex-1 justify-end gap-6 relative h-[200px] items-center">
                   <div className="w-40 lg:w-48 aspect-square bg-white p-2 shadow-2xl transform -rotate-6 z-0 border border-slate-100 flex items-center justify-center overflow-hidden rounded-2xl">
                      <img src={AD_BANNERS[currentAdIndex].img1} className="w-full h-full object-cover rounded-xl" alt="" />
                   </div>
                   <div className="w-40 lg:w-48 aspect-square bg-white p-2 shadow-2xl transform rotate-3 z-10 border border-slate-100 -ml-20 lg:-ml-24 flex items-center justify-center overflow-hidden rounded-2xl">
                      <img src={AD_BANNERS[currentAdIndex].img2} className="w-full h-full object-cover rounded-xl" alt="" />
                   </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
             {AD_BANNERS.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrentAdIndex(i)} 
                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentAdIndex ? `w-12 bg-slate-900` : 'w-3 bg-slate-400/30 hover:bg-slate-400/50'}`} 
               />
             ))}
          </div>
        </div>
      </section>

      {/* 2. MAIN LAYOUT WITH SIDEBAR */}
      <main className="w-full px-4 lg:px-6 flex flex-col lg:flex-row items-start gap-10 lg:gap-14 pb-24">
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-[124px] shrink-0 sticky top-32">
          <div className="flex flex-col items-start px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em] mb-6">Market Filters</div>
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-1 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/40 w-full">
              {[
                { name: "Dining", icon: <Utensils size={18}/>, color: "text-orange-600", bg: "bg-orange-50" },
                { name: "Nightlife", icon: <Store size={18}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
                { name: "Wellness", icon: <Sparkles size={18}/>, color: "text-teal-600", bg: "bg-teal-50" },
                { name: "Events", icon: <Ticket size={18}/>, color: "text-rose-600", bg: "bg-rose-50" },
                { name: "Travel", icon: <MapPin size={18}/>, color: "text-blue-600", bg: "bg-blue-50" },
                { name: "Shopping", icon: <ShoppingBag size={18}/>, color: "text-amber-600", bg: "bg-amber-50" },
                { name: "Fitness", icon: <TrendingUp size={18}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
                { name: "Services", icon: <Briefcase size={18}/>, color: "text-slate-600", bg: "bg-slate-50" }
              ].map((cat, i) => (
                <button key={i} className="bg-white p-5 lg:p-6 hover:bg-slate-50 transition-all group flex flex-col items-center text-center w-full border-b lg:border-r-0 border-slate-100 last:border-0 relative">
                  <div className={`w-9 h-9 ${cat.bg} ${cat.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 shadow-sm transition-transform`}>{cat.icon}</div>
                  <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-tight leading-none">{cat.name}</h3>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* GRID CONTENT */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
            <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Hot Market Coupons</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-0.5">Showing {filteredDeals.length} Verified Best-Sellers in {city}</p>
            </div>
            <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest">
                    <Filter size={14} /> Sort: Popularity
                 </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
            {filteredDeals.map((deal, i) => (
              <motion.div key={`${deal.id}-${i}`} whileHover={{ y: -6 }} className="deal-card group">
                <Link to={`/deal/${deal.id}`} className="relative bg-white border border-slate-200 rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rose-100/50 transition-all h-full flex flex-col group-hover:border-rose-200">
                  <div className="aspect-4/3 overflow-hidden relative bg-white flex items-center justify-center border-b border-slate-50">
                    <FavoriteButton dealId={deal.id} deal={deal} className="absolute top-4 right-4 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100" />
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        <div className="bg-rose-500 text-white px-2.5 py-1.5 rounded-full text-[8.5px] font-black shadow-xl flex items-center gap-1.5 uppercase tracking-widest border border-white/20">
                          <Zap size={10} className="fill-white" /> HOT ITEM
                        </div>
                        {deal.shippingInfo?.enabled && (
                            <div className="bg-indigo-600 text-white px-2.5 py-1.5 rounded-full text-[8.5px] font-black shadow-xl flex items-center gap-1.5 uppercase tracking-widest border border-white/20">
                                <Truck size={10} /> DELIVERY
                            </div>
                        )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <div className="flex items-center justify-between mb-3">
                       <p className="text-[8.5px] font-black text-rose-500 uppercase tracking-[0.2em]">{deal.category || "Hot"}</p>
                       <div className="flex items-center gap-0.5 text-amber-400">
                          <Star size={10} className="fill-amber-400" />
                          <span className="text-[9px] font-black text-slate-900">4.9</span>
                       </div>
                    </div>
                    
                    <div className="mb-4">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate mb-1">{deal.companyName || "Verified Partner"}</p>
                        <h3 className="text-sm font-black text-slate-900 leading-snug uppercase tracking-tight group-hover:text-rose-600 transition-colors line-clamp-2 min-h-[40px]">
                            {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                        </h3>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-50">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black mb-1.5 leading-none">Best Price</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{formatPrice(deal.price)}</span>
                            <span className="text-[11px] text-slate-400 line-through font-bold tracking-tighter">{formatPrice(deal.original)}</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center group-hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-95">
                           <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredDeals.length === 0 && (
             <div className="py-32 text-center max-w-md mx-auto">
                <Zap size={48} className="mx-auto text-slate-200 mb-8" />
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">No active hot coupons found</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">We're constantly updating our marketplace. Check back shortly for brand new verified deals in {city}.</p>
                <Link to="/deals" className="inline-flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                    View All Market Deals
                </Link>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

