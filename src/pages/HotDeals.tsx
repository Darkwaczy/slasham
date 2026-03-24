import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Zap, MapPin, ArrowRight, Heart, Filter, Truck, Ticket, Building } from "lucide-react";
import gsap from "gsap";
import { motion } from "motion/react";
import { deals as staticDeals } from "../data/mockData";
import { getPersistentDeals } from "../utils/mockPersistence";

export default function HotDeals() {
  const { city } = useOutletContext<{ city: string }>();
  const [allHotDeals, setAllHotDeals] = useState<any[]>([]);

  useEffect(() => {
    const pDeals = getPersistentDeals();
    const combined = [...pDeals, ...staticDeals];
    const hotOnly = combined.filter((d: any) => 
        (d.isHotCoupon || d.tag?.toLowerCase().includes('hot')) &&
        d.location.toLowerCase().includes(city.toLowerCase())
    );
    setAllHotDeals(hotOnly);

    gsap.fromTo(
      ".hot-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
  }, [city]);

  return (
    <div className="bg-slate-900 min-h-screen pt-12 pb-24">
      {/* 1. VIP HEADER */}
      <section className="px-6 lg:px-12 mb-12 relative">
         <div className="max-w-7xl mx-auto py-16 px-8 rounded-[3rem] bg-linear-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all duration-1000"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Zap size={14} className="fill-slate-900 animate-pulse" /> VIP DEALS ZONE
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter uppercase mb-4">
                     Hot <span className="text-amber-500">Deals.</span><br/>
                     Cold Cash.
                  </h1>
                  <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
                     Exclusive real-time offers with maximum savings potential. Limited availability for 48 hours only. 
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center">
                     <p className="text-3xl font-black text-white mb-1">90%</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Max Discount</p>
                  </div>
                  <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center">
                     <p className="text-3xl font-black text-amber-500 mb-1">2.4m</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Savings</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2. HOT GRID */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
           <div className="flex items-center gap-4">
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Active High-Value Deals</h2>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-lg text-[10px] font-black">{allHotDeals.length} LIVE</span>
           </div>
           <button className="flex items-center gap-2 px-6 py-2 bg-white/5 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
              <Filter size={14} /> Sort: Price High to Low
           </button>
        </div>

        {allHotDeals.length === 0 ? (
            <div className="py-32 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                <Ticket size={48} className="mx-auto text-slate-700 mb-6" />
                <h3 className="text-xl font-black text-white mb-2 uppercase">No High-Value Deals Found</h3>
                <p className="text-slate-500 font-medium">Please select a different city or location.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {allHotDeals.map((deal) => (
                    <motion.div
                        key={deal.id}
                        whileHover={{ y: -8 }}
                        className="hot-card group"
                    >
                        <Link to={`/deal/${deal.id}`} className="flex flex-col relative bg-slate-800 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500 h-full">
                            <div className="aspect-square overflow-hidden relative bg-white flex items-center justify-center">
                                <img 
                                    src={deal.image} 
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000" 
                                    alt={deal.title}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent"></div>
                                
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <div className="bg-amber-500 text-slate-900 px-3 py-1 rounded-xl text-[9px] font-black flex items-center gap-1.5 uppercase tracking-widest shadow-2xl">
                                        <Zap size={12} className="fill-slate-900" /> HOT ITEM
                                    </div>
                                    {deal.shippingInfo?.enabled && (
                                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-[9px] font-black flex items-center gap-1.5 uppercase tracking-widest shadow-2xl">
                                            <Truck size={12} /> DELIVERY
                                        </div>
                                    )}
                                </div>
                                <button className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white/40 hover:text-amber-500 transition-all flex items-center justify-center">
                                    <Heart size={18} />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col grow bg-slate-800/50">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{deal.category}</span>
                                <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight mb-4 group-hover:text-amber-500 transition-colors">
                                    {deal.companyName ? `${deal.companyName} - ${deal.title.split(' - ')[1] || deal.title}` : deal.title}
                                </h3>
                                
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 py-2 px-3 bg-white/5 rounded-xl w-fit">
                                    <MapPin size={12} className="text-amber-500" /> {deal.redeemAddress || deal.location.split(',')[0]}
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Slasham Price</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-white tracking-tighter">{deal.price}</span>
                                            <span className="text-[11px] font-black text-slate-600 line-through tracking-tighter">{deal.original}</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-all duration-300 shadow-xl shadow-white/5 active:scale-95">
                                        <ArrowRight size={24} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        )}

        <div className="mt-20 flex justify-center">
           <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-full font-black text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95 uppercase tracking-[0.2em] text-[10px]">
              Load More Deals
           </button>
        </div>
      </main>
    </div>
  );
}
