import { useState, useEffect } from "react";
import { 
  ArrowRight, MapPin, TrendingUp, Zap,
  Truck, Timer, ChevronDown, Star, Heart
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { deals as staticDeals } from "../data/mockData";
import { getPersistentDeals } from "../utils/mockPersistence";
import { SUPPORTED_LOCATIONS } from "../utils/locations";

export default function Home() {
  const { city, setCity } = useOutletContext<{ city: string; setCity: (c: string) => void }>();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [allDeals, setAllDeals] = useState<any[]>([]);

  useEffect(() => {
    const pDeals = getPersistentDeals();
    setAllDeals([...pDeals, ...staticDeals]);

    const handleUpdate = () => {
        setAllDeals([...getPersistentDeals(), ...staticDeals]);
    };
    window.addEventListener('dealsUpdate', handleUpdate);
    return () => window.removeEventListener('dealsUpdate', handleUpdate);
  }, []);

  // Filtered Deals
  const filteredDeals = allDeals.filter(d => d.location.toLowerCase().includes(city.toLowerCase()));
  const hotDeals = filteredDeals.filter(d => d.isHotCoupon || d.tag?.toLowerCase().includes('hot'));
  const trendingDeals = filteredDeals.slice(0, 36);

  const formatPrice = (p: string) => {
    const digits = p.replace(/\D/g, '');
    return `₦${Number(digits).toLocaleString()}`;
  };

  return (
    <div className="bg-[#FAFAFA] text-slate-900 font-sans overflow-x-hidden">
      
      {/* 1. HOT COUPONS MARQUEE */}
      <section className="pt-8 pb-4 bg-slate-900 overflow-hidden relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500 font-black">
            <Zap size={16} className="fill-amber-500 animate-pulse" />
            <span className="uppercase tracking-[0.2em] text-[10px]">Hot Coupons</span>
          </div>
          <Link to="/deals/hot" className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">View All →</Link>
        </div>

        <div className="w-full overflow-hidden relative">
          <div className="flex animate-marquee-rtl gap-6 py-4">
            {(hotDeals.length > 0 ? hotDeals : filteredDeals).slice(0, 15).map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`hot-${deal.id}-${index}`} 
                className="w-[200px] bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all group shrink-0 flex flex-col relative"
              >
                <div className="aspect-square relative overflow-hidden bg-white flex items-center justify-center">
                  <div className="absolute top-2 left-2 z-10 bg-amber-500 text-slate-900 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-xl">
                    HOT
                  </div>
                  <img 
                    src={deal.image.replace('w=600&q=70', 'w=400&q=50')} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-1">
                    <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest truncate">{deal.companyName || "Exclusive Partner"}</p>
                    <h3 className="text-[11px] font-black text-white line-clamp-1 group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                        {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-amber-500 font-black text-sm">{formatPrice(deal.price)}</span>
                     <span className="text-[9px] text-slate-500 line-through font-bold">{formatPrice(deal.original)}</span>
                  </div>
                </div>
              </Link>
            ))}
            {/* Seamless loop duplication */}
            {(hotDeals.length > 0 ? hotDeals : filteredDeals).slice(0, 15).map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`hot-dup-${deal.id}-${index}`} 
                className="w-[200px] bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all group shrink-0 flex flex-col relative"
              >
                <div className="aspect-square relative overflow-hidden bg-white flex items-center justify-center">
                   <div className="absolute top-2 left-2 z-10 bg-amber-500 text-slate-900 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-xl">
                    HOT
                  </div>
                  <img 
                    src={deal.image.replace('w=600&q=70', 'w=400&q=50')} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-1">
                    <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest truncate">{deal.companyName || "Exclusive Partner"}</p>
                    <h3 className="text-[11px] font-black text-white line-clamp-1 group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                        {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-amber-500 font-black text-sm">{formatPrice(deal.price)}</span>
                     <span className="text-[9px] text-slate-500 line-through font-bold">{formatPrice(deal.original)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FLASH SALES */}
      <section className="pt-8 pb-4 bg-red-50/30 border-b border-red-100/50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="flex items-center gap-2 text-red-600 font-black">
            <Timer size={16} className="animate-pulse" />
            <span className="uppercase tracking-[0.2em] text-[10px]">Flash Sales</span>
          </div>
        </div>

        <div className="w-full overflow-hidden relative">
          <div className="flex animate-marquee-ltr gap-6 py-4">
            {filteredDeals.slice(0, 15).map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`flash-${deal.id}-${index}`} 
                className="w-[160px] sm:w-[190px] bg-white rounded-2xl overflow-hidden border border-red-100 hover:border-red-300 hover:shadow-xl transition-all group shrink-0 flex flex-col relative"
              >
                <div className="aspect-4/3 relative overflow-hidden bg-white flex items-center justify-center">
                  <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-sm">
                    LIMITED
                  </div>
                  <img 
                    src={deal.image.replace('w=600&q=70', 'w=400&q=50')} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                   <div className="mb-1 text-center">
                    <p className="text-[7px] font-black text-red-500/60 uppercase tracking-widest">{deal.category}</p>
                    <h3 className="text-[10px] font-black text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                        {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                     <span className="text-red-600 font-black text-sm">{formatPrice(deal.price)}</span>
                     <span className="text-[8px] text-slate-400 line-through font-bold">{formatPrice(deal.original)}</span>
                  </div>
                </div>
              </Link>
            ))}
            {/* Seamless loop duplication */}
            {filteredDeals.slice(0, 15).map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`flash-dup-${deal.id}-${index}`} 
                className="w-[160px] sm:w-[190px] bg-white rounded-2xl overflow-hidden border border-red-100 hover:border-red-300 hover:shadow-xl transition-all group shrink-0 flex flex-col relative"
              >
                <div className="aspect-4/3 relative overflow-hidden bg-white flex items-center justify-center">
                  <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-sm">
                    LIMITED
                  </div>
                  <img 
                    src={deal.image.replace('w=600&q=70', 'w=400&q=50')} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                   <div className="mb-1 text-center">
                    <p className="text-[7px] font-black text-red-500/60 uppercase tracking-widest">{deal.category}</p>
                    <h3 className="text-[10px] font-black text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                        {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                     <span className="text-red-600 font-black text-sm">{formatPrice(deal.price)}</span>
                     <span className="text-[8px] text-slate-400 line-through font-bold">{formatPrice(deal.original)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING DEALS (Expanded High Fidelity Container) */}
      <section className="pt-2 pb-12 px-4 md:px-10 bg-slate-50/50 -mt-2">
        <div className="max-w-[1550px] mx-auto bg-white rounded-[3.5rem] shadow-[0_10px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-12 md:p-16 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-3 text-slate-900 font-black mb-2">
                <TrendingUp size={24} className="text-emerald-500" />
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Trending Deals</h2>
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] pl-1">Over 60 fresh experiences added today</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div 
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="flex items-center gap-3 bg-slate-50 px-6 py-3.5 rounded-2xl border border-slate-200/60 cursor-pointer hover:bg-slate-100 transition-colors z-20"
                >
                  <MapPin size={18} className="text-teal-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">{city}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                
                <AnimatePresence>
                {isLocationDropdownOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30" onClick={() => setIsLocationDropdownOpen(false)}></motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-40 overflow-hidden"
                    >
                      {SUPPORTED_LOCATIONS.map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => {
                            setCity(loc.name);
                            setIsLocationDropdownOpen(false);
                          }}
                          className={`w-full text-left px-6 py-4 text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors ${city === loc.name ? "text-teal-600 bg-teal-50/50" : "text-slate-500"}`}
                        >
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
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-10 gap-y-16">
               {trendingDeals.map((deal, i) => (
                 <motion.div key={i} whileHover={{ y: -8 }} className="group">
                    <Link to={`/deal/${deal.id}`}>
                      <div className="aspect-4/3 rounded-4xl overflow-hidden relative mb-6 border border-slate-100 shadow-sm bg-white">
                         <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-[#4A7266]/90 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-xl">
                           {deal.tag || "DEAL"}
                         </div>
                         <div className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-slate-200/50">
                           <Heart size={18} />
                         </div>
                         <img src={deal.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                      </div>
                      <div className="space-y-3 px-1">
                         <h4 className="text-base font-black text-slate-900 leading-none uppercase tracking-tight truncate group-hover:text-teal-600 transition-colors">{deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}</h4>
                         <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">
                           <MapPin size={12} className="text-teal-500" /> {deal.location}
                         </div>
                         <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                            {[1,2,3,4,5].map(star => <Star key={star} size={12} className="fill-amber-400" />)}
                            <span className="text-[10px] font-black text-slate-400 ml-1.5">(421)</span>
                         </div>
                         <div className="flex items-baseline gap-2.5">
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{formatPrice(deal.price)}</span>
                            <span className="text-sm font-bold text-slate-300 line-through">{formatPrice(deal.original)}</span>
                         </div>
                         <div className="flex items-center gap-3 pt-1">
                            <span className="text-[#3EB28F] text-[11px] font-black uppercase tracking-widest">
                                {Math.round((1 - (parseInt(deal.price.replace(/\D/g,'')) / parseInt(deal.original.replace(/\D/g,'')))) * 100)}% OFF
                            </span>
                            <span className="text-slate-300 text-[11px] font-black uppercase tracking-widest">Limited Time</span>
                         </div>
                      </div>
                    </Link>
                 </motion.div>
               ))}
            </div>
          </div>
          
          <div className="p-8 md:p-12 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
             <Link to="/deals" className="px-12 py-4 bg-white border border-slate-200 rounded-full font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 uppercase tracking-widest text-[10px]">
               View All Deals
             </Link>
          </div>
        </div>
      </section>

      {/* RE-ENGINEERED: SUCCESS STORIES DUAL MARQUEE (6 Up, 6 Down) */}
      <section className="py-24 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm border border-teal-100">
             <TrendingUp size={12} /> Success Stories
           </div>
        </div>

        <div className="space-y-6">
           {/* ROW 1: GOES RIGHT */}
           <div className="flex animate-marquee-rtl gap-6 px-6">
              {[
                { name: "Tobi D.", text: "Great customer service. I had an issue with a voucher and they resolved it in minutes." },
                { name: "Aisha M.", text: "I've saved over ₦50,000 this month alone just by using Slasham for my weekend dinners." },
                { name: "Chidi O.", text: "The app is so seamless. I walked into the spa, showed my voucher, and got treated like royalty." },
                { name: "Sarah T.", text: "Finally, a discount platform that works in Nigeria. 10/10 highly recommend to everyone!" },
                { name: "Nneka L.", text: "Best deals for staycations. Slasham is my go-to for planning quality family time." },
                { name: "David S.", text: "My girlfriend loved the surprise dinner. Thanks Slasham for the plug! Highly recommended." }
              ].map((s, i) => (
                <div key={i} className="w-[300px] shrink-0 bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group hover:border-teal-500 transition-all">
                   <div className="flex gap-0.5 text-amber-400 mb-4">
                      {[1,2,3,4,5].map(star => <Star key={star} size={14} className="fill-amber-400" />)}
                   </div>
                   <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 italic min-h-[60px]">"{s.text}"</p>
                   <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-widest">{s.name}</h4>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
               {[
                { name: "Tobi D.", text: "Great customer service. I had an issue with a voucher and they resolved it in minutes." },
                { name: "Aisha M.", text: "I've saved over ₦50,000 this month alone just by using Slasham for my weekend dinners." },
                { name: "Chidi O.", text: "The app is so seamless. I walked into the spa, showed my voucher, and got treated like royalty." },
                { name: "Sarah T.", text: "Finally, a discount platform that works in Nigeria. 10/10 highly recommend to everyone!" },
                { name: "Nneka L.", text: "Best deals for staycations. Slasham is my go-to for planning quality family time." },
                { name: "David S.", text: "My girlfriend loved the surprise dinner. Thanks Slasham for the plug! Highly recommended." }
              ].map((s, i) => (
                <div key={`dup1-${i}`} className="w-[300px] shrink-0 bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group hover:border-teal-500 transition-all">
                   <div className="flex gap-0.5 text-amber-400 mb-4">
                      {[1,2,3,4,5].map(star => <Star key={star} size={14} className="fill-amber-400" />)}
                   </div>
                   <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 italic min-h-[60px]">"{s.text}"</p>
                   <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-widest">{s.name}</h4>
                </div>
              ))}
           </div>

           {/* ROW 2: GOES LEFT */}
           <div className="flex animate-marquee-ltr gap-6 px-6">
              {[
                { name: "Amaka U.", text: "I was skeptical at first, but the voucher was accepted immediately. Great service and verify fast." },
                { name: "Ibrahim Y.", text: "Nice spots for a quiet evening. The savings are actually real. Best discovery app so far." },
                { name: "Blessing O.", text: "Everything was perfect from start to finish. I've even started using this platform for work." },
                { name: "Chinelo K.", text: "The UI is beautiful and easy to navigate. Finding deals has never been this satisfying." },
                { name: "Ola W.", text: "A must-have for anyone living in Lagos. The variety of categories is impressive." },
                { name: "Kelechi E.", text: "Transparent pricing and verified venues. You always know exactly what you're getting." }
              ].map((s, i) => (
                <div key={i} className="w-[300px] shrink-0 bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group hover:border-teal-500 transition-all">
                   <div className="flex gap-0.5 text-amber-400 mb-4">
                      {[1,2,3,4,5].map(star => <Star key={star} size={14} className="fill-amber-400" />)}
                   </div>
                   <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 italic min-h-[60px]">"{s.text}"</p>
                   <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-widest">{s.name}</h4>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                { name: "Amaka U.", text: "I was skeptical at first, but the voucher was accepted immediately. Great service and verify fast." },
                { name: "Ibrahim Y.", text: "Nice spots for a quiet evening. The savings are actually real. Best discovery app so far." },
                { name: "Blessing O.", text: "Everything was perfect from start to finish. I've even started using this platform for work." },
                { name: "Chinelo K.", text: "The UI is beautiful and easy to navigate. Finding deals has never been this satisfying." },
                { name: "Ola W.", text: "A must-have for anyone living in Lagos. The variety of categories is impressive." },
                { name: "Kelechi E.", text: "Transparent pricing and verified venues. You always know exactly what you're getting." }
              ].map((s, i) => (
                <div key={`dup2-${i}`} className="w-[300px] shrink-0 bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group hover:border-teal-500 transition-all">
                   <div className="flex gap-0.5 text-amber-400 mb-4">
                      {[1,2,3,4,5].map(star => <Star key={star} size={14} className="fill-amber-400" />)}
                   </div>
                   <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 italic min-h-[60px]">"{s.text}"</p>
                   <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-widest">{s.name}</h4>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* NEW: 4. SLASHAM GIFT COUPONS (6x6 Expanded Categorized Grid) */}
      <section className="py-24 px-4 md:px-10 bg-white border-t border-slate-50">
        <div className="max-w-[1550px] mx-auto flex flex-col lg:flex-row gap-14">
            {/* CATEGORIES SIDEBAR */}
            <aside className="w-full lg:w-[130px] shrink-0">
               <div className="sticky top-6">
                 <div className="bg-teal-50 px-3 py-2 rounded-xl border border-teal-100 text-[11px] font-black text-teal-600 uppercase tracking-widest mb-8 text-center shadow-sm">
                    Categories
                 </div>
                 <div className="flex flex-col gap-3">
                    {[
                        { name: "Dining", icon: <TrendingUp size={20}/>, count: "120+" },
                        { name: "Nightlife", icon: <Zap size={20}/>, count: "45+" },
                        { name: "Travel", icon: <MapPin size={20}/>, count: "60+" },
                        { name: "Shopping", icon: <ArrowRight size={20}/>, count: "200+" },
                        { name: "Fitness", icon: <TrendingUp size={20}/>, count: "40+" },
                        { name: "Services", icon: <Truck size={20}/>, count: "25+" },
                    ].map((cat, i) => (
                        <button key={i} className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-slate-900 hover:text-white transition-all group shadow-sm">
                           <div className="w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center mb-2 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm">{cat.icon}</div>
                           <span className="text-[10px] font-black uppercase tracking-tight">{cat.name}</span>
                           <span className="text-[8px] font-bold text-slate-400 group-hover:text-teal-400 mt-0.5">{cat.count}</span>
                        </button>
                    ))}
                 </div>
               </div>
            </aside>

            {/* GIFT COUPONS GRID */}
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-12">
                  <div className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2.5 border border-rose-100 shadow-sm animate-pulse">
                     <Zap size={16} className="fill-rose-500" /> Slasham gift coupons
                  </div>
                  <div className="h-px grow bg-slate-100" />
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-2">Discover all <ArrowRight size={16}/></div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-8 gap-y-16">
                  {filteredDeals.slice(0, 36).map((p, i) => (
                    <motion.div key={i} whileHover={{ y: -8 }} className="group">
                       <Link to={`/deal/${p.id}`}>
                         <div className="aspect-4/3 rounded-4xl overflow-hidden relative mb-6 border border-slate-100 shadow-sm bg-white">
                            <div className="absolute top-4 left-4 z-10 bg-slate-900/95 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[11px] font-black shadow-2xl border border-white/20">
                               {formatPrice(p.price)}
                            </div>
                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={p.title} />
                         </div>
                         <div className="space-y-2 px-1">
                            <h4 className="text-base font-black text-slate-900 uppercase tracking-tighter mb-1 line-clamp-1 group-hover:text-rose-600 transition-colors">{p.title.includes(' - ') ? p.title.split(' - ')[1] : p.title}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.category}</p>
                         </div>
                       </Link>
                    </motion.div>
                  ))}
               </div>
            </div>
        </div>
      </section>

      {/* 5. BUSINESS CTA */}

      {/* 5. BUSINESS CTA */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative border border-white/5 shadow-2xl shadow-slate-900/40">
          <div className="grid lg:grid-cols-2 items-center relative z-10">
            <div className="p-12 md:p-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold mb-8 uppercase tracking-widest">
                Official Business Partners
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-white leading-tight uppercase">
                Register Your <br/>Business with Us.
              </h2>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-lg">
                Activate your business on Slasham and reach thousands of verified customers looking for great deals.
              </p>
              
              <Link to="/business" className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 rounded-full font-black uppercase text-xs tracking-widest hover:bg-teal-400 transition-all shadow-xl group">
                Join as Partner <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative h-full min-h-[400px] lg:min-h-[600px] hidden lg:block">
              <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200" alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
