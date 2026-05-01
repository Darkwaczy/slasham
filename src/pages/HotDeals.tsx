import { useState, useEffect, Suspense, lazy } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Zap, Utensils, ShoppingBag, Briefcase, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiClient } from "../api/client";

// Lazy load DealCard for consistency and performance
const DealCard = lazy(() => import("../components/DealCard"));

export default function HotDeals() {
  const { city } = useOutletContext<{ city: string }>();
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAds = () => {
    setAds([
      {
        id: 1,
        title: "EXCLUSIVE",
        subtitle: "HOT DEALS",
        desc: "Save up to 80% on premium wellness and dining sessions tonight.",
        code: "HOTSLASH80",
        codeBg: "bg-emerald-600",
        image: "/assets/banner 1.jpg"
      },
      {
        id: 2,
        title: "LIMITED",
        subtitle: "COUPONS",
        desc: "Unlock verified high-value coupons for top-tier city experiences.",
        code: "COUPON50",
        codeBg: "bg-slate-900",
        image: "/assets/banner 2.jpg"
      }
    ]);
  };

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient("/deals");
      const formattedDeals = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        price: d.discount_price.toString(),
        original: d.original_price.toString(),
        couponPrice: d.coupon_price?.toString() || "100",
        image: d.images?.[0] || "",
        category: d.category,
        location: d.merchants?.city || "",
        merchantName: d.merchants?.name || "Verified Merchant",
        isHotCoupon: d.is_hot,
        expiryDate: d.expiry_date,
        totalQuantity: d.total_quantity,
        soldQuantity: d.sold_quantity,
        dealExplanation: d.deal_explanation,
        rating: 4.8 + Math.random() * 0.2,
        reviewCount: Math.floor(Math.random() * 500) + 100
      }));
      setAllDeals(formattedDeals);
    } catch (error) {
      console.error("Failed to fetch hot deals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
    loadAds();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ads.length > 0) {
        setCurrentAdIndex((prev: number) => (prev + 1) % ads.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [ads]);

  const filteredDeals = allDeals.filter((d: any) => 
    (d.isHotCoupon || d.category === "Dining" || d.category === "Beauty") && 
    d.location.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pt-0 font-sans">
      <section className="px-4 lg:px-6 mb-12 -mt-12 relative z-10">
        <div className="w-full relative rounded-3xl overflow-hidden bg-emerald-950 min-h-[320px] md:min-h-[400px] flex items-center border-4 border-white shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentAdIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
                <img src={ads[currentAdIndex]?.image} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-linear-to-r from-emerald-950 via-emerald-900/80 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 p-8 md:p-16 max-w-3xl">
              <motion.div 
                key={`content-${currentAdIndex}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-emerald-500/30">
                     <Zap size={14} className="fill-white" /> Trending Now
                  </span>
                  <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] uppercase italic">
                    {ads[currentAdIndex]?.title} <span className="text-emerald-400">{ads[currentAdIndex]?.subtitle}</span>
                  </h2>
                  <p className="text-emerald-50/80 font-medium text-lg max-w-lg leading-relaxed">
                    {ads[currentAdIndex]?.desc}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                     <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-2xl">
                        <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">PROMO</span>
                        <div className={`px-5 py-2 rounded-xl text-white text-sm font-black tracking-widest ${ads[currentAdIndex]?.codeBg}`}>
                          {ads[currentAdIndex]?.code}
                        </div>
                     </div>
                  </div>
              </motion.div>
          </div>

          <div className="absolute bottom-8 left-8 md:left-16 flex items-center gap-3 z-20">
             {ads.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrentAdIndex(i)} 
                 className={`h-1.5 rounded-full transition-all duration-500 ${i === currentAdIndex ? `w-12 bg-emerald-400` : 'w-4 bg-white/30 hover:bg-white/50'}`} 
               />
             ))}
          </div>
        </div>
      </section>

      <main className="w-full px-4 lg:px-10 flex flex-col lg:flex-row items-start gap-14 pb-24">
        <aside className="hidden lg:block lg:w-[130px] shrink-0 sticky top-32">
            <div className="bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-8 text-center shadow-sm">
                Hot Filter
            </div>
            <div className="grid grid-cols-1 gap-3">
                {[
                { name: "Food & Drink", icon: <Utensils size={18}/>, color: "text-rose-500", bg: "bg-rose-50/50", border: "border-rose-100", path: "/deals/food" },
                { name: "Beauty & Spas", icon: <Sparkles size={18}/>, color: "text-indigo-500", bg: "bg-indigo-50/50", border: "border-indigo-100", path: "/deals/beauty" },
                { name: "Things To Do", icon: <Zap size={18}/>, color: "text-sky-500", bg: "bg-sky-50/50", border: "border-sky-100", path: "/deals/experiences" },
                { name: "Goods", icon: <ShoppingBag size={18}/>, color: "text-amber-500", bg: "bg-amber-50/50", border: "border-amber-100", path: "/deals/products" },
                { name: "Local Services", icon: <Briefcase size={18}/>, color: "text-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-100", path: "/deals/services" }
                ].map((cat, i) => (
                <Link key={i} to={cat.path} className={`flex flex-col items-center justify-center p-4 ${cat.bg} border ${cat.border} rounded-3xl hover:bg-white hover:shadow-lg transition-all group shadow-sm active:scale-95`}>
                    <div className={`w-10 h-10 bg-white ${cat.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm`}>{cat.icon}</div>
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight text-center">{cat.name}</span>
                </Link>
                ))}
            </div>
        </aside>

        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-100">
            <div>
                <div className="flex items-center gap-3 mb-2">
                   <Zap size={24} className="text-emerald-500 fill-emerald-500" />
                   <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Verified Hot Market Coupons</h2>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] pl-9">Showing {filteredDeals.length} Best-Sellers in {city}</p>
            </div>
          </div>

          {isLoading ? (
              <div className="py-32 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifying Hot Nodes...</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                <Suspense fallback={<div className="w-full h-80 bg-slate-100 rounded-xl animate-pulse" />}>
                    {filteredDeals.map((deal, i) => (
                        <DealCard key={`${deal.id}-${i}`} {...deal} />
                    ))}
                </Suspense>
                
                {filteredDeals.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                        <Zap size={48} className="mx-auto text-slate-200 mb-8" />
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">No active hot coupons found</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-10 max-w-md mx-auto">Check back shortly for brand new verified deals in {city}.</p>
                        <Link to="/deals" className="inline-flex items-center gap-3 px-12 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
                            View All Market Deals
                        </Link>
                    </div>
                )}
              </div>
          )}
        </div>
      </main>
    </div>
  );
}

