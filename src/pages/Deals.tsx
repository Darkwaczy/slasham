import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { MapPin, Utensils, Store, Sparkles, Ticket, ShoppingBag, TrendingUp, Briefcase, Zap } from "lucide-react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import DealCard from "../components/DealCard";
import { deals as staticDeals } from "../data/mockData";
import { getPersistentDeals, getPersistentAds } from "../utils/mockPersistence";



export default function Deals() {
  const { city } = useOutletContext<{ city: string }>();
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState<any[]>([]);

  const loadAds = () => {
    setAds(getPersistentAds());
  };

  useEffect(() => {
    setAllDeals([...getPersistentDeals(), ...staticDeals]);
    loadAds();
    window.addEventListener('persistentAdsUpdate', loadAds);
    return () => window.removeEventListener('persistentAdsUpdate', loadAds);
  }, []);


  useEffect(() => {
    gsap.fromTo(
      ".deal-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.4 }
    );
  }, [allDeals]);

  const filteredDeals = allDeals.filter(d => d.location.toLowerCase().includes(city.toLowerCase()));



  return (
    <div className="bg-slate-50 min-h-screen pt-0">
      <section className="px-4 lg:px-6 mb-8 -mt-12 relative z-10">
        <div className="w-full relative rounded-4xl overflow-hidden bg-yellow-400 min-h-[200px] md:min-h-[260px] flex items-center border-4 border-white shadow-2xl">
          {/* Brand Yellow Fade Out to Dark */}
          <div className="absolute inset-0 bg-linear-to-r from-yellow-400 via-yellow-400 to-slate-950 opacity-95 lg:opacity-100" />
          
          {/* Patterns */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[15px_15px]" />

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentAdIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10 p-5 md:p-8 flex items-center justify-between w-full gap-8"
            >
                <div className="flex-1 text-center lg:text-left space-y-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-[7px] font-black uppercase tracking-[0.25em] text-yellow-400">
                       <Zap size={8} className="fill-yellow-400" /> Flash Promo
                    </span>
                    <h2 className="text-2xl lg:text-5xl font-black text-slate-950 tracking-tighter leading-[0.85] uppercase italic drop-shadow-sm">
                      {ads[currentAdIndex]?.title} <span className="text-white">{ads[currentAdIndex]?.subtitle}</span>
                    </h2>
                    <p className="text-slate-800 font-bold text-xs lg:text-base max-w-md leading-tight opacity-90">
                      {ads[currentAdIndex]?.desc}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-0.5">
                       <Link 
                         to="/deals" 
                         className="px-6 py-3 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-[8px] hover:scale-105 transition-all shadow-xl active:scale-95"
                       >
                         Unlock
                       </Link>
                       <div className="flex items-center gap-2.5 bg-white/30 backdrop-blur-md p-1 rounded-lg border border-white/40">
                          <span className="text-[7px] font-black text-slate-900 uppercase tracking-widest pl-2">PROMO</span>
                          <div className={`px-4 py-2 rounded-md text-white text-[9px] font-black uppercase tracking-widest shadow-lg ${ads[currentAdIndex]?.codeBg}`}>
                            {ads[currentAdIndex]?.code}
                          </div>
                       </div>
                    </div>
                </div>

                {/* COMPACT HUMAN ELEMENT */}
                <div className="relative hidden lg:flex justify-end items-center h-[200px] shrink-0 -translate-y-2">
                   <motion.div 
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="relative w-[320px] h-[200px]"
                   >
                      <img 
                        src="/assets/32923.jpg" 
                        className="w-full h-full object-cover rounded-3xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-2 border-white/20" 
                        alt="Shopping" 
                      />
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-xl shadow-xl border-2 border-white rotate-12 z-20">
                         <ShoppingBag size={16} />
                      </div>
                   </motion.div>
                </div>
            </motion.div>
          </AnimatePresence>

          {/* Modern Progress Indicators */}
          <div className="absolute bottom-5 left-1/2 lg:left-12 -translate-x-1/2 lg:translate-x-0 flex items-center gap-2 z-20">
             {ads.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrentAdIndex(i)} 
                 className={`h-1 rounded-full transition-all duration-500 ${i === currentAdIndex ? `w-10 bg-slate-950` : 'w-2 bg-slate-950/20 hover:bg-slate-950/40'}`} 
               />
             ))}
          </div>
        </div>
      </section>

      <main className="w-full px-4 lg:px-6 flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
        <aside className="w-full lg:w-[110px] shrink-0 sticky top-32">
          <div className="flex flex-col items-start px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Filters</div>
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-1 bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/40 w-full">
              {[
                { name: "Dining", icon: <Utensils size={18}/>, color: "bg-orange-50 text-orange-600" },
                { name: "Nightlife", icon: <Store size={18}/>, color: "bg-indigo-50 text-indigo-600" },
                { name: "Wellness", icon: <Sparkles size={18}/>, color: "bg-teal-50 text-teal-600" },
                { name: "Events", icon: <Ticket size={18}/>, color: "bg-rose-50 text-rose-600" },
                { name: "Travel", icon: <MapPin size={18}/>, color: "bg-blue-50 text-blue-600" },
                { name: "Shopping", icon: <ShoppingBag size={18}/>, color: "bg-amber-50 text-amber-600" },
                { name: "Fitness", icon: <TrendingUp size={18}/>, color: "bg-emerald-50 text-emerald-600" },
                { name: "Services", icon: <Briefcase size={18}/>, color: "bg-slate-50 text-slate-600" }
              ].map((cat, i) => (
                <button key={i} className="bg-white p-4 hover:bg-slate-50 transition-all group flex flex-col items-center text-center w-full min-h-[100px] border-b lg:border-r last:border-0 border-slate-100 relative shrink-0">
                  <div className={`w-8 h-8 ${cat.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 shadow-sm border border-slate-100`}>{cat.icon}</div>
                  <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-tight leading-none">{cat.name}</h3>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 px-8 lg:px-24 py-12 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Showing {filteredDeals.length} Active Deals</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
            {filteredDeals.map((deal, i) => (
              <DealCard 
                key={`${deal.id}-${i}`}
                id={deal.id}
                title={deal.title}
                price={deal.price}
                original={deal.original}
                image={deal.image}
                category={deal.category}
                location={deal.location}
                expiryDate={deal.expiryDate}
                totalQuantity={deal.totalQuantity}
                soldQuantity={deal.soldQuantity}
                dealExplanation={deal.dealExplanation}
                index={i}
              />
            ))}
          </div>

          <div className="mt-16 flex justify-center">
             <button className="px-10 py-4 bg-white border border-slate-200 rounded-full font-black text-slate-900 hover:bg-slate-50 transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em] text-[10px]">
                Load More Deals
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}
