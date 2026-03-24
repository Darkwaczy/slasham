import { useState, useEffect } from "react";
import { 
  ArrowRight, MapPin, TrendingUp, Zap,
  Truck, Timer, ChevronDown, Star
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
  const trendingDeals = filteredDeals.slice(0, 24);

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
            {(hotDeals.length > 0 ? hotDeals : filteredDeals).map((deal, index) => (
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
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
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
            {(hotDeals.length > 0 ? hotDeals : filteredDeals).map((deal, index) => (
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
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
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
            {[...filteredDeals, ...filteredDeals].map((deal, index) => (
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
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </div>
                <div className="p-3 flex flex-col grow">
                  <span className="text-red-600 text-[8px] font-black uppercase tracking-widest mb-0.5">{deal.category}</span>
                  <div className="mb-1">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest truncate leading-none mb-0.5">{deal.companyName || "Partner"}</p>
                    <h3 className="text-[11px] font-black text-slate-900 line-clamp-1 uppercase tracking-tight leading-tight">
                        {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                    </h3>
                  </div>
                  <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-black text-slate-900">{formatPrice(deal.price)}</p>
                      <p className="text-[9px] font-bold text-slate-400 line-through">{formatPrice(deal.original)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING DEALS */}
      <section className="pt-2 pb-8 px-6 md:px-8 bg-slate-50/50 -mt-2">
        <div className="max-w-400 mx-auto bg-white rounded-[2.5rem] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-black mb-1">
                <TrendingUp size={16} className="text-teal-500" />
                <span className="uppercase tracking-[0.2em] text-[10px]">Top Trending Deals</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Inventory Synchronized Daily</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div 
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200/60 cursor-pointer hover:bg-slate-100 transition-colors z-20"
                >
                  <MapPin size={16} className="text-teal-600" />
                  <span className="text-sm font-bold text-slate-700">{city}</span>
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
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-40 overflow-hidden"
                    >
                      {SUPPORTED_LOCATIONS.map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => {
                            setCity(loc.name);
                            setIsLocationDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-sm font-bold hover:bg-slate-50 transition-colors ${city === loc.name ? "text-teal-600 bg-teal-50/50" : "text-slate-600"}`}
                        >
                          {loc.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
                </AnimatePresence>
              </div>
              <Link to="/deals" className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1 uppercase tracking-widest text-[10px]">
                Explore All <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 p-8 md:p-12">
            {/* Standardized Sidebar Category Navigator */}
            <aside className="w-full lg:w-[110px] shrink-0">
               <div className="sticky top-6">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-1">Discover</p>
                 <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-1 bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/40 w-full">
                    {[
                        { name: "Dining", icon: <TrendingUp size={18}/>, color: "text-orange-600 bg-orange-50" },
                        { name: "Spa", icon: <Zap size={18}/>, color: "text-teal-600 bg-teal-50" },
                        { name: "Fun", icon: <ArrowRight size={18}/>, color: "text-rose-600 bg-rose-50" },
                        { name: "Goods", icon: <Truck size={18}/>, color: "text-amber-600 bg-amber-50" },
                        { name: "Stay", icon: <MapPin size={18}/>, color: "text-blue-600 bg-blue-50" },
                    ].map((cat, i) => (
                        <button key={i} className="bg-white p-4 hover:bg-slate-900 hover:text-white transition-all group flex flex-col items-center text-center w-full min-h-[100px] border-b lg:border-b border-slate-100 relative shrink-0">
                           <div className={`w-8 h-8 ${cat.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm border border-slate-100`}>{cat.icon}</div>
                           <span className="text-[9px] font-black uppercase tracking-tight leading-none">{cat.name}</span>
                        </button>
                    ))}
                    <Link to="/deals" className="bg-teal-600 p-4 hover:bg-slate-900 text-white transition-all group flex flex-col items-center justify-center text-center w-full min-h-[100px] relative shrink-0">
                        <ArrowRight size={18} className="mb-2 group-hover:translate-x-1 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">All</span>
                    </Link>
                 </div>
               </div>
            </aside>

            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-10 lg:gap-x-8">
                {trendingDeals.map((deal, i) => (
                    <Link 
                      to={`/deal/${deal.id}`} 
                      key={i} 
                      className="group flex flex-col bg-white transition-all duration-300 relative"
                    >
                      <div className="aspect-4/3 relative overflow-hidden rounded-xl border border-slate-100 mb-4 bg-white flex items-center justify-center shadow-sm">
                        <div className={`absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-sm ${deal.isHotCoupon ? 'bg-amber-500 text-slate-900' : 'bg-teal-600 text-white'}`}>
                          {deal.isHotCoupon ? 'HOT' : (deal.tag || 'NEW')}
                        </div>
                        {deal.shippingInfo?.enabled && (
                            <div className="absolute top-3 right-3 z-10 bg-indigo-600 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                                <Truck size={10} /> {deal.shippingInfo.fee ? `₦${deal.shippingInfo.fee}` : 'FREE'}
                            </div>
                        )}
                        <img 
                          src={deal.image} 
                          alt={deal.title} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      </div>
                      
                      <div className="flex flex-col grow px-1">
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
                        
                        <div className="mt-auto flex flex-col gap-0.5 pt-3 border-t border-slate-50">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-slate-900 tracking-tighter">{formatPrice(deal.price)}</span>
                            <span className="text-[11px] font-bold text-slate-400 line-through">{formatPrice(deal.original)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                ))}
              </div>
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
                <div key={i} className="w-[300px] shrink-0 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group hover:border-teal-500 transition-all">
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
                <div key={`dup1-${i}`} className="w-[300px] shrink-0 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group hover:border-teal-500 transition-all">
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
                <div key={i} className="w-[300px] shrink-0 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group hover:border-teal-500 transition-all">
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
                <div key={`dup2-${i}`} className="w-[300px] shrink-0 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group hover:border-teal-500 transition-all">
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

      {/* 4. BUSINESS CTA */}
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
