import { useState, useEffect, Suspense, lazy } from "react";
import { MapPin, Zap, ArrowRight, TrendingUp, Timer, ChevronDown, Utensils, Moon, Plane, ShoppingBag, Briefcase, Sparkles } from "lucide-react";
import { Star } from "lucide-react";
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
          image: d.images?.[0] || "",
          category: d.category,
          location: d.merchants?.city || "",
          expiryDate: d.expiry_date,
          totalQuantity: d.total_quantity,
          soldQuantity: d.sold_quantity,
          dealExplanation: d.deal_explanation,
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 200) + 50,
          imagePosition: "center 33%",
          merchantName: d.merchants?.name || ""
        }));
        setAllDeals(formattedDeals);

        // Inject ONLY the custom banners
        const finalBanners = [
          {
            image: "/assets/banner 1.jpg",
            title: ["Less Spend", "More Value."],
            subtitle: "Only Available For A Short Time",
            code: "SLASHAM",
            badge: " LIMITED OFFER",
            isGraphicStyle: true,
            mobilePosition: "object-[center_20%] scale-[1.3]"
          },
          {
            image: "/assets/banner 2.jpg",
            title: ["Pay Less", "Get More"],
            subtitle: "Unlock Exclusive Deals Today",
            code: "SLASHAM",
            badge: " LIMITED OFFER",
            isGraphicStyle: true,
            mobilePosition: "object-[75%_20%] scale-[1.3]",
            whiteMobileBadge: true,
            whiteMobileSubtitle: true
          },
          {
            image: "/assets/banner 3.jpg",
            title: ["Don't Pay", "Full Price"],
            subtitle: "Unlock Better Deals In Seconds",
            code: "SLASHAM",
            badge: " LIMITED OFFER",
            isGraphicStyle: true,
            mobilePosition: "object-[85%_top] scale-[1.2]",
            textColor: "text-white",
            whiteMobileBadge: true,
            whiteDesktopBadge: true
          }
        ];

        setAdBanners(finalBanners);
      } catch (error) {
        console.error("Home deals fetch failed:", error);
        setAdBanners([
          {
            image: "/assets/banner 1.jpg",
            title: ["Less Spend", "More Value."],
            subtitle: "Only Available For A Short Time",
            code: "SLASHAM",
            badge: " LIMITED OFFER",
            isGraphicStyle: true,
            mobilePosition: "object-[center_20%] scale-[1.3]"
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
              <img 
                src={adBanners[currentAdIndex].image} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  adBanners[currentAdIndex].isGraphicStyle 
                    ? `md:object-right md:scale-100 ${adBanners[currentAdIndex].mobilePosition || "object-[center_20%] scale-[1.3]"}` 
                    : "object-center scale-100"
                }`} 
                style={{ opacity: adBanners[currentAdIndex].isGraphicStyle ? 1 : 0.5 }} 
              />
              
              <div className={`absolute inset-0 flex flex-col ${adBanners[currentAdIndex].isGraphicStyle ? "justify-start pt-40 md:justify-center md:pt-0" : "justify-center"} max-w-7xl mx-auto px-6 md:px-16 lg:px-24 z-20`}>
                <div className={`${adBanners[currentAdIndex].isGraphicStyle ? "w-full md:w-1/2" : "w-full"} flex flex-col items-start`}>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="inline-flex py-1.5 px-4 rounded-full border mb-4 md:mb-8 w-max text-[10px] font-black uppercase tracking-[0.2em] text-white"
                    style={{ 
                      background: '#f97316', 
                      borderColor: '#f97316',
                      color: 'white',
                      backdropFilter: 'blur(8px)' 
                    }}
                  >
                    {adBanners[currentAdIndex].badge}
                  </motion.div>

                  <motion.h2
                    initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className={`text-5xl lg:text-[64px] w-full max-w-3xl leading-[1.1] tracking-tight mb-4 md:mb-6 ${
                      adBanners[currentAdIndex].textColor ? adBanners[currentAdIndex].textColor : adBanners[currentAdIndex].isGraphicStyle ? "text-[#00A650] normal-case font-bold" : "text-white uppercase drop-shadow-2xl font-bold"
                    }`}
                    style={{ fontFamily: adBanners[currentAdIndex].isGraphicStyle ? "'Vastago Grotesk', var(--font-sans)" : "inherit" }}
                  >
                    {(Array.isArray(adBanners[currentAdIndex].title) ? adBanners[currentAdIndex].title : [adBanners[currentAdIndex].title]).map((line: string, i: number) => (
                      <span key={i} className={adBanners[currentAdIndex].isGraphicStyle ? "block whitespace-nowrap" : ""} style={{ color: i === 1 ? (currentAdIndex === 2 ? "white" : "#f97316") : undefined }}>{line}</span>
                    ))}
                  </motion.h2>

                  <motion.p 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} 
                    className={`text-lg lg:text-[22px] font-medium tracking-wide mb-8 md:mb-10 ${
                      adBanners[currentAdIndex].textColor === "text-white" ? "text-white/90" : adBanners[currentAdIndex].whiteMobileSubtitle ? "text-white md:text-[#1A1A1A]" : adBanners[currentAdIndex].isGraphicStyle ? "text-[#1A1A1A]" : "text-[#3EB28F]"
                    }`}
                  >
                    {adBanners[currentAdIndex].subtitle}
                  </motion.p>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap items-center gap-4">
                    <div className="bg-white text-slate-900 px-5 py-3.5 md:px-6 md:py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-[11px] shadow-2xl flex items-center gap-3 md:gap-4 border border-slate-100">
                      Use Promo Code
                      <span className="text-white px-2.5 py-1.2 rounded-lg text-xs md:text-sm tracking-widest font-black" style={{ background: '#f97316' }}>
                        {adBanners[currentAdIndex].code}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                {adBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAdIndex(index)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${currentAdIndex === index ? "w-8 bg-[#00A650]" : "w-2 bg-white/40 hover:bg-white/60"}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                   <h3 className="text-[10px] font-black text-slate-900 truncate group-hover:text-red-600 transition-colors uppercase tracking-tight leading-tight">{deal.title}</h3>
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

      {/* 3. CATEGORY QUICK NAV (MOBILE ONLY REMOVED AS REQUESTED) */}
      <section className="hidden lg:block py-12 px-6 bg-white overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-8 justify-center">
            {[
              { name: "Food & Drink", icon: <Utensils size={24}/>, color: "bg-orange-50 text-orange-600", path: "/deals/food" },
              { name: "Beauty & Spas", icon: <Moon size={24}/>, color: "bg-indigo-50 text-indigo-600", path: "/deals/beauty" },
              { name: "Things To Do", icon: <Plane size={24}/>, color: "bg-teal-50 text-teal-600", path: "/deals/experiences" },
              { name: "Goods", icon: <ShoppingBag size={24}/>, color: "bg-amber-50 text-amber-600", path: "/deals/products" },
              { name: "Local Services", icon: <Briefcase size={24}/>, color: "bg-slate-50 text-slate-600", path: "/deals/services" },
            ].map((cat, i) => (
              <Link key={i} to={cat.path} className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-[40px] hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 transition-all group shrink-0">
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
            </div>
          </div>

          <div className="px-4 py-8 md:p-16">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sourcing Exclusive Nodes...</p>
              </div>
            ) : (
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                 <Suspense fallback={<div className="w-full h-80 bg-slate-100 rounded-xl animate-pulse" />}>
                   {allDeals.slice(0, 8).map((deal: any) => (
                    <DealCard key={deal.id} {...deal} />
                   ))}
                 </Suspense>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-24 bg-slate-50/50 overflow-hidden relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 border border-emerald-100">
               <Sparkles size={14} className="fill-emerald-600" /> Real Experiences
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">
              Hear from our <span className="text-emerald-500">Slashers</span>
            </h2>
            <p className="text-slate-500 font-bold text-sm lg:text-lg max-w-2xl mx-auto">
              Join thousands of smart shoppers in Lagos who are saving big every single day.
            </p>
        </div>

        <div className="space-y-10">
          <div className="w-full overflow-hidden relative">
            <div className="flex animate-marquee-ltr gap-8 px-4 w-max">
              {[
                { name: "Sarah O.", loc: "Lekki, Lagos", text: "Best deals in the city! I saved 50% on my spa day. The booking process was seamless and the service was 5-star.", rating: 5 },
                { name: "David K.", loc: "Abuja", text: "Super fast and reliable. The iPhone deal was incredible, I thought it was too good to be true until it arrived!", rating: 5 },
                { name: "Blessing A.", loc: "Ikeja", text: "Love the gourmet buffet options. Slasham is my go-to whenever I want to treat my family to something special.", rating: 5 },
                { name: "Emmanuel J.", loc: "Surulere", text: "Great customer service and even better prices. I've recommended Slasham to all my colleagues at work.", rating: 5 }
              ].concat([
                { name: "Sarah O.", loc: "Lekki, Lagos", text: "Best deals in the city! I saved 50% on my spa day. The booking process was seamless and the service was 5-star.", rating: 5 },
                { name: "David K.", loc: "Abuja", text: "Super fast and reliable. The iPhone deal was incredible, I thought it was too good to be true until it arrived!", rating: 5 },
                { name: "Blessing A.", loc: "Ikeja", text: "Love the gourmet buffet options. Slasham is my go-to whenever I want to treat my family to something special.", rating: 5 },
                { name: "Emmanuel J.", loc: "Surulere", text: "Great customer service and even better prices. I've recommended Slasham to all my colleagues at work.", rating: 5 }
              ]).map((t, i) => (
                <div key={`row1-${i}`} className="w-[380px] bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative group">
                   <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-amber-400" />)}
                   </div>
                   <p className="text-slate-700 font-medium leading-relaxed mb-6 italic text-sm">"{t.text}"</p>
                   <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">{t.name[0]}</div>
                      <div>
                         <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{t.name}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{t.loc}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full overflow-hidden relative">
            <div className="flex animate-marquee-rtl gap-8 px-4 w-max">
              {[
                { name: "Chinelo E.", loc: "Lekki Phase 1", text: "The app is so easy to use. Highly recommended for anyone who loves quality but hates paying full price!", rating: 5 },
                { name: "Tunde R.", loc: "Victoria Island", text: "Verified deals that actually work. No hidden fees, no stress. Just pure value every time I open the app.", rating: 5 },
                { name: "Amaka U.", loc: "Yaba, Lagos", text: "I've saved over ₦100k this month alone. Incredible platform for discovering new spots in the city.", rating: 5 },
                { name: "Kelechi P.", loc: "Port Harcourt", text: "Slasham has changed how I shop for luxury goods. The selection is premium and the prices are unbeatable.", rating: 5 }
              ].concat([
                { name: "Chinelo E.", loc: "Lekki Phase 1", text: "The app is so easy to use. Highly recommended for anyone who loves quality but hates paying full price!", rating: 5 },
                { name: "Tunde R.", loc: "Victoria Island", text: "Verified deals that actually work. No hidden fees, no stress. Just pure value every time I open the app.", rating: 5 },
                { name: "Amaka U.", loc: "Yaba, Lagos", text: "I've saved over ₦100k this month alone. Incredible platform for discovering new spots in the city.", rating: 5 },
                { name: "Kelechi P.", loc: "Port Harcourt", text: "Slasham has changed how I shop for luxury goods. The selection is premium and the prices are unbeatable.", rating: 5 }
              ]).map((t, i) => (
                <div key={`row2-${i}`} className="w-[380px] bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative group">
                   <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-amber-400" />)}
                   </div>
                   <p className="text-slate-700 font-medium leading-relaxed mb-6 italic text-sm">"{t.text}"</p>
                   <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">{t.name[0]}</div>
                      <div>
                         <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{t.name}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{t.loc}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SIDEBAR CATEGORIES & FEED */}
      <section className="py-24 px-4 md:px-10 bg-white border-t border-slate-50">
        <div className="max-w-[1550px] mx-auto flex flex-col lg:flex-row gap-14">
            <aside className="hidden lg:block lg:w-[130px] shrink-0">
               <div className="sticky top-6">
                 <div className="bg-teal-50 px-3 py-2 rounded-xl border border-teal-100 text-[11px] font-black text-teal-600 uppercase tracking-widest mb-8 text-center shadow-sm">Categories</div>
                 <div className="grid grid-cols-1 gap-3">
                    {[
                        { name: "Food & Drink", icon: <Utensils size={18}/>, count: "120+", color: "text-rose-500", bg: "bg-rose-50/50", border: "border-rose-100", path: "/deals/food" },
                        { name: "Beauty & Spas", icon: <Sparkles size={18}/>, count: "85+", color: "text-indigo-500", bg: "bg-indigo-50/50", border: "border-indigo-100", path: "/deals/beauty" },
                        { name: "Things To Do", icon: <Zap size={18}/>, count: "60+", color: "text-sky-500", bg: "bg-sky-50/50", border: "border-sky-100", path: "/deals/experiences" },
                        { name: "Goods", icon: <ShoppingBag size={18}/>, count: "200+", color: "text-amber-500", bg: "bg-amber-50/50", border: "border-amber-100", path: "/deals/products" },
                        { name: "Local Services", icon: <Briefcase size={18}/>, count: "40+", color: "text-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-100", path: "/deals/services" },
                    ].map((cat, i) => (
                        <Link key={i} to={cat.path} className={`flex flex-col items-center justify-center p-4 ${cat.bg} border ${cat.border} rounded-3xl hover:bg-white hover:shadow-lg transition-all group shadow-sm active:scale-95`}>
                           <div className={`w-10 h-10 bg-white ${cat.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.04)]`}>{cat.icon}</div>
                           <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{cat.name}</span>
                           <span className="text-[8px] font-bold text-slate-400 mt-0.5">{cat.count} Deals</span>
                        </Link>
                    ))}
                 </div>
               </div>
            </aside>

            <div className="flex-1 w-full">
               <div className="flex items-center gap-4 mb-12">
                  <div className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2.5 border border-rose-100 shadow-sm">
                     <Zap size={16} className="fill-rose-500" /> Slasham Top Choices
                  </div>
                  <div className="h-px grow bg-slate-100" />
                  <Link to="/deals" className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors flex items-center gap-2">Discover all <ArrowRight size={16}/></Link>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  <Suspense fallback={<div className="w-full h-80 bg-slate-100 rounded-xl animate-pulse" />}>
                   {filteredDeals.slice(0, 36).map((p) => (
                     <DealCard key={p.id} {...p} />
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
            <Link to="/business" className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group/btn">
              Join as Partner <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">Slasham</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Nigeria's #1 verified marketplace for premium local deals, gourmet experiences, and luxury lifestyle savings.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-emerald-500">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/deals" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Marketplace</Link></li>
              <li><Link to="/deals/hot" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Hot Coupons</Link></li>
              <li><Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">How It Works</Link></li>
              <li><Link to="/for-business" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Partner Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-emerald-500">Categories</h4>
            <ul className="space-y-4">
              <li><Link to="/deals/food" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Food & Drink</Link></li>
              <li><Link to="/deals/beauty" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Beauty & Spa</Link></li>
              <li><Link to="/deals/experiences" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Things To Do</Link></li>
              <li><Link to="/deals/products" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Retail Goods</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-emerald-500">Legal & Support</h4>
            <ul className="space-y-4">
              <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Help Center</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Slasham Marketplace Ltd. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8">
             <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Instagram</span>
             <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Twitter</span>
             <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Facebook</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

