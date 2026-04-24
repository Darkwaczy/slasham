import { useState, useEffect } from "react";
import { MapPin, Zap, ArrowRight, TrendingUp, Timer, ChevronDown, Star, Utensils, Moon, Plane, ShoppingBag, Dumbbell, Briefcase } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { deals as staticDeals } from "../data/mockData";
import { getPersistentDeals } from "../utils/mockPersistence";
import { SUPPORTED_LOCATIONS } from "../utils/locations";
import FavoriteButton from "./FavoriteButton";
import DealCard from "./DealCard";


export default function Home() {
  const { city, setCity } = useOutletContext<{ city: string; setCity: (c: string) => void }>();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

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
  const trendingDeals = filteredDeals.slice(0, 36);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const AD_BANNERS = [
    {
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
      title: "50% OFF OASIS WELLNESS SPA",
      subtitle: "Weekend Pamper Special",
      code: "RELAX50",
      badge: "💆 Spa & Wellness",
    },
    {
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80",
      title: "2-FOR-1 FINE DINING",
      subtitle: "At Ikeja's Top Restaurants",
      code: "GOURMETLAGOS",
      badge: "🍽️ Dining & Food",
    },
    {
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80",
      title: "LUXURY GETAWAY FLASH SALE",
      subtitle: "Private Cabanas at Tarkwa Bay",
      code: "ESCAPE20",
      badge: "🏖️ Travel & Escape",
    }
  ];

  const formatPrice = (p: string) => {
    const digits = p.replace(/\D/g, '');
    return `₦${Number(digits).toLocaleString()}`;
  };

  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">
      
      {/* 1. PREMIUM AD BILLBOARD (Auto-rotating Hero) */}
      <section className="relative overflow-hidden h-[480px] md:h-[560px]" style={{ background: '#0d2e24' }}>
        {/* Grain texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.04] z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentAdIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Photo — full bleed, slightly dimmed */}
            <img src={AD_BANNERS[currentAdIndex].image} className="absolute inset-0 w-full h-full object-cover opacity-50" />

            {/* Brand-green fadeout — left to transparent, using #3EB28F as reference */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0d2e24 0%, #1a5c3a 30%, #3EB28F44 65%, transparent 100%)' }} />
            {/* Mobile: full dark overlay */}
            <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to bottom, #0d2e2488 0%, #0d2e24cc 100%)' }} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-12 z-20">
              {/* Category badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="inline-flex py-1.5 px-4 rounded-full border border-[#3EB28F]/40 text-[#3EB28F] text-[10px] font-black uppercase tracking-[0.2em] mb-4 w-max"
                style={{ background: 'rgba(62,178,143,0.12)', backdropFilter: 'blur(8px)' }}
              >
                {AD_BANNERS[currentAdIndex].badge}
              </motion.div>

              {/* Subtitle */}
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-[#3EB28F] font-black text-xs uppercase tracking-[0.3em] mb-3">
                🔥 {AD_BANNERS[currentAdIndex].subtitle}
              </motion.p>

              {/* Title */}
              <motion.h2
                initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-7xl font-black text-white w-full max-w-3xl leading-none tracking-tight mb-8 drop-shadow-2xl"
              >
                {AD_BANNERS[currentAdIndex].title}
              </motion.h2>

              {/* CTA row */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap items-center gap-4">
                <div className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center gap-4">
                  Use Promo Code
                  <span className="text-white px-3 py-1.5 rounded-lg text-sm tracking-widest font-black" style={{ background: '#3EB28F' }}>
                    {AD_BANNERS[currentAdIndex].code}
                  </span>
                </div>
                {/* Live urgency stat */}
                <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
                  <span className="w-2 h-2 rounded-full bg-[#3EB28F] animate-pulse shadow-[0_0_8px_#3EB28F]" />
                  1,240+ people browsing now
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
           {AD_BANNERS.map((_, i) => (
             <button
               key={i}
               onClick={() => setCurrentAdIndex(i)}
               className={`h-1.5 rounded-full transition-all duration-500 ${i === currentAdIndex ? 'w-12' : 'w-4 opacity-30 hover:opacity-60'}`}
               style={{ background: i === currentAdIndex ? '#3EB28F' : '#ffffff' }}
             />
           ))}
        </div>

        {/* Bottom brand-green glow edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1 z-20" style={{ background: 'linear-gradient(to right, #3EB28F, #1a5c3a, #3EB28F)' }} />
      </section>

      {/* 2. TRENDING DEALS TICKER (Compact Horizontal Cards) */}
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
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex animate-marquee-ltr gap-4 px-6 w-max">
            {filteredDeals.slice(0, 15).map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`flash-${deal.id}-${index}`} 
                className="w-[240px] bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-red-300 hover:shadow-xl transition-all group shrink-0 flex items-center p-2.5 gap-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                  <img 
                    src={deal.image.replace('w=600&q=70', 'w=200&q=50')} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                   onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=200&q=50"; e.currentTarget.className += " bg-slate-200" }} />
                </div>
                <div className="min-w-0 pr-2 pb-1">
                   <p className="text-[7px] font-black text-red-500 uppercase tracking-widest mb-1">{deal.category}</p>
                   <h3 className="text-[10px] font-black text-slate-900 truncate group-hover:text-red-600 transition-colors uppercase tracking-tight leading-tight">
                       {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                   </h3>
                   <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-red-600 font-black text-xs">{formatPrice(deal.price)}</span>
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
                className="w-[240px] bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-red-300 hover:shadow-xl transition-all group shrink-0 flex items-center p-2.5 gap-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                  <img 
                    src={deal.image.replace('w=600&q=70', 'w=200&q=50')} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                   onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=200&q=50"; e.currentTarget.className += " bg-slate-200" }} />
                </div>
                <div className="min-w-0 pr-2 pb-1">
                   <p className="text-[7px] font-black text-red-500 uppercase tracking-widest mb-1">{deal.category}</p>
                   <h3 className="text-[10px] font-black text-slate-900 truncate group-hover:text-red-600 transition-colors uppercase tracking-tight leading-tight">
                       {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
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

      {/* 3. TRENDING DEALS (Expanded High Fidelity Container) */}
      <section className="pt-2 pb-12 px-4 md:px-10 bg-white -mt-2">
        <div className="max-w-[1550px] mx-auto bg-white rounded-[3.5rem] shadow-[0_10px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-12 md:p-16 border-b border-emerald-100/70 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #D946EF 0%, #7C3AED 100%)' }}>
                    <TrendingUp size={20} />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-none text-slate-900">Trending Deals</h2>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] pl-1" style={{ color: '#3EB28F' }}>Over 60 fresh experiences added today</p>
               </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div 
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="flex items-center gap-3 bg-white/70 px-6 py-3.5 rounded-2xl border border-emerald-200/60 cursor-pointer hover:bg-white transition-colors z-20"
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
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            >
               {trendingDeals.map((deal) => (
                 <DealCard 
                   key={deal.id}
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
                 />
               ))}
            </motion.div>
          </div>
          
          <div className="p-8 md:p-12 bg-emerald-100/20 border-t border-emerald-100/50 flex items-center justify-center">
             <Link to="/deals" className="px-12 py-4 bg-white border border-emerald-200/60 rounded-full font-black text-emerald-700 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95 uppercase tracking-widest text-[10px]">
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
                 <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-3">
                    {[
                        { name: "Dining", icon: <Utensils size={18}/>, count: "120+", color: "text-rose-500", bg: "bg-rose-50/50", border: "border-rose-100" },
                        { name: "Nightlife", icon: <Moon size={18}/>, count: "45+", color: "text-indigo-500", bg: "bg-indigo-50/50", border: "border-indigo-100" },
                        { name: "Travel", icon: <Plane size={18}/>, count: "60+", color: "text-sky-500", bg: "bg-sky-50/50", border: "border-sky-100" },
                        { name: "Shopping", icon: <ShoppingBag size={18}/>, count: "200+", color: "text-amber-500", bg: "bg-amber-50/50", border: "border-amber-100" },
                        { name: "Fitness", icon: <Dumbbell size={18}/>, count: "40+", color: "text-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-100" },
                        { name: "Services", icon: <Briefcase size={18}/>, count: "25+", color: "text-purple-500", bg: "bg-purple-50/50", border: "border-purple-100" },
                    ].map((cat, i) => (
                        <button key={i} className={`flex flex-col items-center justify-center p-2.5 lg:p-4 ${cat.bg} border ${cat.border} rounded-2xl lg:rounded-3xl hover:bg-white hover:shadow-lg transition-all group shadow-sm active:scale-95`}>
                           <div className={`w-8 h-8 lg:w-10 lg:h-10 bg-white ${cat.color} rounded-lg lg:rounded-xl flex items-center justify-center mb-1.5 lg:mb-2 group-hover:scale-110 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.04)]`}>{cat.icon}</div>
                           <span className="text-[9px] lg:text-[10px] font-black text-slate-800 uppercase tracking-tight">{cat.name}</span>
                           <span className="text-[7px] lg:text-[8px] font-bold text-slate-400 mt-0.5">{cat.count} Deals</span>
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
                            <FavoriteButton dealId={p.id} deal={p} className="absolute top-4 right-4 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100" />
                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={p.title}  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=70"; e.currentTarget.className += " bg-slate-100" }} />
                         </div>
                         <div className="space-y-2 px-1">
                            <h4 className="text-base font-black text-slate-900 uppercase tracking-tighter mb-1 line-clamp-1 group-hover:text-rose-600 transition-colors">{p.title.includes(' - ') ? p.title.split(' - ')[1] : p.title}</h4>
                            <div className="flex items-center justify-between">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.category}</p>
                            </div>
                            {p.totalQuantity && (
                               <div className="pt-1">
                                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest mb-1.5">
                                     <span className="text-emerald-600">{p.soldQuantity || 0} Bought</span>
                                     <span className="text-rose-500">{Math.max(0, p.totalQuantity - (p.soldQuantity || 0))} Left</span>
                                  </div>
                                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                           (p.totalQuantity - (p.soldQuantity || 0)) < 10 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${Math.min(100, ((p.soldQuantity || 0) / p.totalQuantity) * 100)}%` }}
                                     />
                                  </div>
                               </div>
                            )}
                         </div>
                       </Link>
                    </motion.div>
                  ))}
               </div>
            </div>
        </div>
      </section>

      {/* 5. BUSINESS CTA */}

      <section className="mt-12 mb-0 py-0 w-full relative overflow-hidden bg-emerald-50/50 border-y border-emerald-100 flex flex-col lg:block">
        
        {/* Absolute Image for Desktop Full Bleed (Right Half) */}
        <div className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[50vw] min-h-[300px] sm:min-h-[400px] order-last lg:order-0">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80" 
            alt="Slasham Merchant Success" 
            className="absolute inset-0 w-full h-full object-cover lg:object-left"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80" }}
          />
          {/* Grand gradient overlay to blend into the text area smoothly */}
          <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-emerald-50/50 via-emerald-50/20 to-transparent"></div>
        </div>

        {/* Constrained Text Content Aligned to the Global Layout Grid */}
        <div className="max-w-7xl mx-auto px-6 w-full flex relative z-10 order-first lg:order-0">
          <div className="w-full lg:w-1/2 py-16 md:py-24 lg:py-32 lg:pr-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-600 text-[10px] font-black mb-8 uppercase tracking-[0.2em] shadow-sm">
              Official Business Partners
            </div>
            
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight mb-6 text-slate-900 leading-[1.05] uppercase">
              Grow Your <br className="hidden xl:block" />Business<span className="text-emerald-500">.</span>
            </h2>
            
            <p className="text-slate-500 font-medium text-base md:text-lg mb-10 leading-relaxed max-w-md mx-auto lg:mx-0">
              Activate your business on Slasham and reach thousands of verified customers looking for great deals tonight.
            </p>
            
            <Link to="/business" className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group/btn">
              Join as Partner <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
