import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Utensils, Sparkles, ShoppingBag, TrendingUp, Briefcase, Zap } from "lucide-react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import DealCard from "../components/DealCard";
import { apiClient } from "../api/client";

export default function Deals() {
  const { city } = useOutletContext<{ city: string }>();
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadAds = () => {
    // Verified Ads / Promos
    setAds([
      {
        id: 1,
        title: "FLASHSALE",
        subtitle: "70% OFF",
        desc: "Limited time offer on premium dining experiences in your city.",
        code: "FLASH70",
        codeBg: "bg-rose-600",
        pattern: "radial-gradient(#fff 1px, transparent 1px)"
      },
      {
        id: 2,
        title: "WEEKEND",
        subtitle: "GETAWAY",
        desc: "Book your luxury retreat today with exclusive member benefits.",
        code: "ESCAPE20",
        codeBg: "bg-indigo-600",
        pattern: "linear-gradient(45deg, #fff 25%, transparent 25%)"
      }
    ]);
  };

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const url = selectedCategory === "All" ? "/deals" : `/deals?category=${selectedCategory}`;
        const data = await apiClient(url);
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
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
    loadAds();
  }, [selectedCategory]);


  useEffect(() => {
    if (allDeals.length > 0) {
      gsap.fromTo(
        ".deal-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.4 }
      );
    }
  }, [allDeals]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ads.length > 0) {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [ads]);

  const filteredDeals = allDeals.filter(d => 
    d.location.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-0">
      <section className="px-4 lg:px-6 mb-8 -mt-12 relative z-10">
        <div className="w-full relative rounded-2xl overflow-hidden bg-yellow-400 min-h-[200px] md:min-h-[260px] flex items-center border-4 border-white shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-r from-yellow-400 via-yellow-400 to-slate-950 opacity-95 lg:opacity-100" />
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

                <div className="relative hidden lg:flex justify-end items-center h-[200px] shrink-0 -translate-y-2">
                   <motion.div 
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="relative w-[320px] h-[200px]"
                   >
                      <img 
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e" 
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

      <main className="w-full px-4 lg:px-6 flex flex-col lg:flex-row items-start gap-10 lg:gap-14 pb-20">
        <aside className="w-full lg:w-[110px] shrink-0 sticky top-32">
          <div className="flex flex-col items-start px-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Filters</div>
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-1 bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/40 w-full">
              {[
                { name: "All", icon: <TrendingUp size={18}/>, color: "bg-slate-50 text-slate-900" },
                { name: "Dining", icon: <Utensils size={18}/>, color: "bg-orange-50 text-orange-600" },
                { name: "Beauty & Spas", icon: <Sparkles size={18}/>, color: "bg-indigo-50 text-indigo-600" },
                { name: "Things To Do", icon: <Sparkles size={18}/>, color: "bg-teal-50 text-teal-600" },
                { name: "Goods", icon: <ShoppingBag size={18}/>, color: "bg-amber-50 text-amber-600" },
                { name: "Local Services", icon: <Briefcase size={18}/>, color: "bg-slate-50 text-slate-600" }
              ].map((cat, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-4 transition-all group flex flex-col items-center text-center w-full min-h-[100px] border-b lg:border-r last:border-0 border-slate-100 relative shrink-0 ${selectedCategory === cat.name ? 'bg-teal-50/50' : 'bg-white hover:bg-slate-50'}`}
                >
                  {selectedCategory === cat.name && (
                    <div className="absolute left-0 top-0 bottom-0 lg:bottom-auto lg:right-0 lg:h-1 w-1 lg:w-auto bg-teal-500" />
                  )}
                  <div className={`w-8 h-8 ${cat.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 shadow-sm border border-slate-100 ${selectedCategory === cat.name ? 'ring-2 ring-teal-500/20' : ''}`}>{cat.icon}</div>
                  <h3 className={`text-[9px] font-black uppercase tracking-tight leading-none ${selectedCategory === cat.name ? 'text-teal-600' : 'text-slate-900'}`}>{cat.name}</h3>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Showing {filteredDeals.length} Active Deals in {city}</h2>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Marketplace...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              {filteredDeals.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-4xl border border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active deals found in {city}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
