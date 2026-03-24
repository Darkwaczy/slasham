import { motion } from "motion/react";
import { Link, useOutletContext } from "react-router-dom";
import { Zap, MapPin, ArrowRight, Heart, Filter, Truck, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { deals as staticDeals } from "../data/mockData";
import { getPersistentDeals } from "../utils/mockPersistence";

export default function HotDeals() {
    const { city } = useOutletContext<{ city: string }>();
    const [allDeals, setAllDeals] = useState<any[]>([]);

    useEffect(() => {
        setAllDeals([...getPersistentDeals(), ...staticDeals]);
    }, []);

    const hotDeals = allDeals.filter(d => 
        (d.isHotCoupon || d.tag?.toLowerCase().includes('hot')) &&
        d.location.toLowerCase().includes(city.toLowerCase())
    );

    const formatPrice = (p: string) => {
        const digits = p.replace(/\D/g, '');
        return `₦${Number(digits).toLocaleString()}`;
    };

    return (
        <div className="bg-slate-900 min-h-screen pt-40 pb-20 px-6 font-sans overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-3xl -mr-[400px] -mt-[400px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl -ml-[300px] -mb-[300px] pointer-events-none" />

            <div className="max-w-7xl mx-auto mb-16 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
                    <div className="space-y-6 flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black uppercase text-[10px] tracking-[0.3em] shadow-xl">
                            <Zap size={14} className="fill-amber-500" /> Exclusive Access
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase">
                            HOT<br/>
                            COUPONS.
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                            Verified best-sellers with limited inventory. Access these exclusive prices before they expire.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 flex-1">
                        <div className="p-10 bg-white/5 backdrop-blur-md rounded-4xl border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all shadow-2xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 leading-none">Global Hub</p>
                            <h3 className="text-3xl font-black text-white tracking-tighter">{city}</h3>
                        </div>
                        <button className="h-20 px-8 bg-amber-500 text-slate-900 rounded-4xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20 active:scale-95 border border-amber-400">
                           <Filter size={18} /> Market Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
                {hotDeals.map((deal, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ y: -8 }}
                        className="group"
                    >
                        <Link to={`/deal/${deal.id}`} className="flex h-full border border-white/10 rounded-[2.5rem] overflow-hidden bg-slate-800 shadow-2xl flex-col relative group-hover:border-amber-500/30 transition-all">
                            <div className="aspect-square relative overflow-hidden bg-white p-1 flex items-center justify-center">
                                <img src={deal.image} alt={deal.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                                    <div className="bg-amber-500 text-slate-900 px-3 py-1 rounded-xl text-[9px] font-black flex items-center gap-1.5 uppercase tracking-widest shadow-2xl">
                                        <Zap size={12} className="fill-slate-900" /> HOT ITEM
                                    </div>
                                    {deal.shippingInfo?.enabled && (
                                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-[9px] font-black flex items-center gap-1.5 uppercase tracking-widest shadow-2xl">
                                            <Truck size={12} /> DELIVERY
                                        </div>
                                    )}
                                </div>
                                <button className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white/40 hover:text-amber-500 transition-all flex items-center justify-center shadow-lg">
                                    <Heart size={18} />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col grow bg-slate-800/50">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{deal.category}</span>
                                <div className="mb-4">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest truncate leading-none mb-1">{deal.companyName || "Exclusive Partner"}</p>
                                    <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                                        {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                                    </h3>
                                </div>
                                
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 py-2 px-3 bg-white/5 rounded-xl w-fit">
                                    <MapPin size={12} className="text-amber-500" /> {deal.redeemAddress || deal.location.split(',')[0]}
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Slasham Price</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-white tracking-tighter">{formatPrice(deal.price)}</span>
                                            <span className="text-[11px] font-black text-slate-600 line-through tracking-tighter">{formatPrice(deal.original)}</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-all shadow-xl active:scale-95">
                                        <ArrowRight size={24} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {hotDeals.length === 0 && (
                <div className="py-20 text-center relative z-10">
                    <p className="text-white text-2xl font-black uppercase tracking-[0.2em] opacity-40 mb-10">No hot coupons active in {city}.</p>
                    <Link to="/deals" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-black uppercase text-xs tracking-widest hover:bg-amber-500 transition-all shadow-2xl shadow-white/5">
                        <Ticket size={20} /> View All Market Deals
                    </Link>
                </div>
            )}
        </div>
    );
}
