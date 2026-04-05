import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { MapPin, Zap, Utensils, Store, Sparkles, Ticket, ShoppingBag, TrendingUp, Briefcase, ArrowRight, Star, Truck } from "lucide-react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import FavoriteButton from "../components/FavoriteButton";
import { deals as staticDeals } from "../data/mockData";
import { getPersistentDeals } from "../utils/mockPersistence";

export default function Deals() {
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
      bg: "bg-sky-200/50",
      pattern: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=1200&q=80",
      title: "Best Offers.",
      subtitle: "Lowest Prices.",
      desc: "Save on dining, beauty, services, and more.",
      code: "SLASHAM",
      codeBg: "bg-rose-600 shadow-rose-600/20",
      img1: "https://images.unsplash.com/photo-1492106087820-71f110052c51?auto=format&fit=crop&w=400&q=80",
      img2: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80"
    },
    {
      bg: "bg-emerald-100",
      pattern: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      title: "Weekend",
      subtitle: "Pamper Special.",
      desc: "Up to 50% off top rated Spas in Lagos.",
      code: "RELAX50",
      codeBg: "bg-emerald-600 shadow-emerald-600/20",
      img1: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
      img2: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80"
    },
    {
      bg: "bg-indigo-100",
      pattern: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      title: "2-For-1",
      subtitle: "Fine Dining.",
      desc: "Exclusive dinner reservations at half price.",
      code: "GOURMET",
      codeBg: "bg-indigo-600 shadow-indigo-600/20",
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

  const filteredDeals = allDeals.filter(d => d.location.toLowerCase().includes(city.toLowerCase()));

  const formatPrice = (p: string) => {
    const digits = p.replace(/\D/g, '');
    return `₦${Number(digits).toLocaleString()}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-0">
      <section className="px-4 lg:px-6 mb-6 -mt-12 relative z-10">
        <div className="w-full relative rounded-3xl overflow-hidden bg-slate-100 min-h-[220px] lg:min-h-[200px] flex items-center border border-slate-200 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAdIndex}
              initial={{ opacity: 0, filter: "blur(5px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 w-full h-full ${AD_BANNERS[currentAdIndex].bg} flex items-center`}
            >
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url(${AD_BANNERS[currentAdIndex].pattern})` }}></div>
              <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between w-full gap-8">
                <div className="flex-1 text-center lg:text-left">
                   <h2 className="text-3xl lg:text-5xl border-slate-900 font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-2">
                     {AD_BANNERS[currentAdIndex].title}<br/>
                     {AD_BANNERS[currentAdIndex].subtitle}
                   </h2>
                   <p className="text-slate-600 text-sm lg:text-lg font-bold mb-6 max-w-sm leading-tight mx-auto lg:mx-0">
                     {AD_BANNERS[currentAdIndex].desc}
                   </p>
                   <div className="flex items-center gap-4 justify-center lg:justify-start">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code:</span>
                      <div className={`px-8 py-2.5 ${AD_BANNERS[currentAdIndex].codeBg} text-white rounded-full font-black text-sm shadow-xl active:scale-95 cursor-pointer uppercase tracking-widest transition-colors`}>
                        {AD_BANNERS[currentAdIndex].code}
                      </div>
                   </div>
                </div>
                <div className="flex-1 flex justify-center lg:justify-end gap-6 relative h-[140px] items-center">
                   <div className="w-32 lg:w-40 aspect-square bg-white p-1.5 shadow-xl transform -rotate-6 z-0 border border-slate-100 flex items-center justify-center overflow-hidden rounded-md">
                      <img src={AD_BANNERS[currentAdIndex].img1} className="w-full h-full object-cover rounded-sm" alt="" />
                   </div>
                   <div className="w-32 lg:w-40 aspect-square bg-white p-1.5 shadow-xl transform rotate-3 z-10 border border-slate-100 -ml-16 lg:-ml-20 flex items-center justify-center overflow-hidden rounded-md">
                      <img src={AD_BANNERS[currentAdIndex].img2} className="w-full h-full object-cover rounded-sm" alt="" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                   </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Modern Progress Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
             {AD_BANNERS.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrentAdIndex(i)} 
                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentAdIndex ? `w-8 bg-slate-900` : 'w-2 bg-slate-400/30'}`} 
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

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Showing {filteredDeals.length} Active Deals</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredDeals.map((deal, i) => (
              <motion.div key={`${deal.id}-${i}`} whileHover={{ y: -4 }} className="deal-card group">
                <Link to={`/deal/${deal.id}`} className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="aspect-4/3 overflow-hidden relative bg-white flex items-center justify-center">
                    <FavoriteButton dealId={deal.id} deal={deal} className="absolute top-3 right-3 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100" />
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-full text-[8px] font-black text-teal-600 border border-white shadow-xl flex items-center gap-1 uppercase tracking-widest">
                          <Zap size={10} className="fill-amber-500 text-amber-500" /> {deal.tag || "Hot"}
                        </div>
                        {deal.shippingInfo?.enabled && (
                            <div className="bg-indigo-600 text-white px-2 py-1 rounded-full text-[8px] font-black shadow-xl flex items-center gap-1 uppercase tracking-widest">
                                <Truck size={10} /> Delivery
                            </div>
                        )}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col grow">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[8px] font-black text-teal-600/60 uppercase tracking-[0.2em]">{deal.category || "Deals"}</p>
                       <div className="flex items-center gap-0.5 text-amber-400">
                          <Star size={10} className="fill-amber-400" />
                          <span className="text-[8px] font-black text-slate-900">4.9</span>
                       </div>
                    </div>
                    
                    <div className="mb-2">
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest truncate mb-0.5">{deal.companyName || "Exclusive Partner"}</p>
                        <h3 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                            {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                        </h3>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-slate-50">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black mb-1">Coupon Price</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-slate-900 tracking-tighter">{formatPrice(deal.price)}</span>
                            <span className="text-[10px] text-slate-400 line-through font-bold">{formatPrice(deal.original)}</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-all shadow-xl active:scale-95">
                           <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
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
