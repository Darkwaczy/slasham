import { useState, useEffect } from "react";
import { 
  ArrowRight, MapPin, Ticket, Utensils, Sparkles, 
  Store, Star, Timer, Heart, ChevronDown,
  Briefcase, TrendingUp, Users, ShoppingBag, Zap
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import { deals } from "../data/mockData";

export default function Home() {
  const { city, setCity } = useOutletContext<{ city: string; setCity: (c: string) => void }>();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Flash Sale Timer
  const [timeLeft, setTimeLeft] = useState(3600 * 4 + 23 * 60 + 59);
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);
  const hours = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // Filtered Deals for both sections
  const filteredDeals = deals.filter(d => d.location.toLowerCase().includes(city.toLowerCase()));

  return (
    <div className="bg-[#FAFAFA] text-slate-900 font-sans overflow-x-hidden">
      

      {/* 
326:       <section className="py-24 mt-12 border-y border-slate-200/60 bg-white overflow-hidden relative flex items-center">
...
347:       </section>
      */}

      {/* 3. FLASH SALES (The New Hero Marquee) */}
      <section className="pt-8 pb-4 bg-red-50/30 border-b border-red-100/50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="flex items-center gap-2 text-red-600 font-black">
            <Timer size={16} className="animate-pulse" />
            <span className="uppercase tracking-[0.2em] text-[10px]">Active Flash Sales</span>
          </div>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="w-full overflow-hidden relative">
          <div className="flex animate-marquee-rtl gap-6 py-4">
            {/* Repeat the deals multiple times to ensure a seamless loop */}
            {[...filteredDeals, ...filteredDeals, ...filteredDeals, ...filteredDeals].map((deal, index) => (
              <Link 
                to={`/deal/${deal.id}`} 
                key={`${deal.id}-${index}`} 
                className="w-[160px] sm:w-[190px] bg-white rounded-2xl overflow-hidden border border-red-100 hover:border-red-300 hover:shadow-xl transition-all group shrink-0 flex flex-col relative"
              >
                <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                  <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-sm">
                    -40% OFF
                  </div>
                  {/* Timer on each card */}
                  <div className="absolute bottom-2 left-2 right-2 z-10 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Timer size={10} className="text-red-400" />
                    <span className="text-[9px] font-black tabular-nums">{hours}:{minutes}:{seconds}</span>
                  </div>
                  <img 
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    referrerPolicy="no-referrer" 
                    loading="lazy" 
                  />
                </div>
                <div className="p-3 flex flex-col grow">
                  <span className="text-red-600 text-[8px] font-bold uppercase tracking-widest mb-0.5">{deal.category}</span>
                  <h3 className="text-xs font-bold mb-1 text-slate-900 line-clamp-1">{deal.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-[9px] mb-2">
                    <MapPin size={8} /> <span className="line-clamp-1">{deal.location}</span>
                  </div>
                  {/* Always visible minimal timer for urgency */}
                  <div className="mb-2 flex items-center gap-1 text-[8px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md w-fit group-hover:hidden transition-all">
                    <Timer size={8} /> {hours}H : {minutes}M
                  </div>
                  <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <p className="text-sm font-black text-slate-900">{deal.price}</p>
                      <p className="text-[9px] font-bold text-slate-400 line-through">{deal.original}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-red-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-red-50 to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* 
416:       <section className="py-24 px-6 bg-slate-50">
...
468:       </section>
      */}

      {/* 
471:       <section id="how-it-works" className="py-12 px-6 bg-white overflow-hidden">
...
685:       </section>
      */}

      {/* 5. TRENDING DEALS (Groupon-Inspired Clean Layout) */}
      <section className="pt-2 pb-8 px-6 md:px-8 bg-slate-50/50 -mt-2">
        <div className="max-w-400 mx-auto bg-white rounded-[2.5rem] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-black mb-1">
                <TrendingUp size={16} className="text-teal-500" />
                <span className="uppercase tracking-[0.2em] text-[10px]">Trending Deals</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Over 60 fresh experiences added today</p>
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
                
                {isLocationDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsLocationDropdownOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-40 overflow-hidden">
                      {["Lagos", "Abuja"].map((name) => (
                        <button
                          key={name}
                          onClick={() => {
                            setCity(name);
                            setIsLocationDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-sm font-bold hover:bg-slate-50 transition-colors ${city === name ? "text-teal-600 bg-teal-50/50" : "text-slate-600"}`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <Link to="/deals" className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                View all <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-10 lg:gap-x-8">
            {Array.from({ length: 24 }).map((_, i) => {
              const deal = filteredDeals[i % filteredDeals.length];
              if (!deal) return null;
              return (
                <Link 
                  to={`/deal/${deal.id}`} 
                  key={i} 
                  className="group flex flex-col bg-white transition-all duration-300 relative"
                >
                  {/* Wishlist Heart */}
                  <button className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 transition-all active:scale-95">
                    <Heart size={16} />
                  </button>

                  <div className="aspect-4/3 relative overflow-hidden rounded-xl border border-slate-100 mb-4 bg-slate-50">
                    <div className="absolute top-3 left-3 z-10 bg-teal-600 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-sm">
                      {deal.tag || 'TRENDING'}
                    </div>
                    <img 
                      src={deal.image} 
                      alt={deal.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      referrerPolicy="no-referrer" 
                      loading="lazy" 
                    />
                  </div>
                  
                  <div className="flex flex-col grow">
                    <h3 className="text-sm font-bold mb-1 text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 min-h-10">
                      {deal.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-medium mb-1.5">
                      <MapPin size={10} className="text-slate-400" />
                      <span className="truncate">{deal.location}</span>
                    </div>

                    {/* Ratings - Groupon Style */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={10} className="fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">(421)</span>
                    </div>

                    <div className="mt-auto flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-slate-900">{deal.price}</span>
                        <span className="text-[11px] font-bold text-slate-400 line-through decoration-rose-500/30">{deal.original}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                          -70% OFF
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Limited Time</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="p-8 md:p-12 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
             <button className="px-12 py-4 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95">
               Load More Deals
             </button>
          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES (Infinite Marquee) */}
      <section className="pt-12 pb-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center text-teal-600 font-black">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 font-bold text-xs mb-6 uppercase tracking-widest border border-teal-100/50">
            <Heart size={14} className="fill-teal-600" /> Success Stories
          </div>
        </div>

        <div className="relative overflow-hidden pb-12">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          
          {/* Top Row (LTR) */}
          <div className="flex overflow-hidden w-full mb-6">
            <div className="animate-marquee-ltr flex items-center gap-6">
              {[
                { name: "Aisha M.", rating: 5, text: "I've saved over ₦50,000 this month alone just by using Slasham for my weekend dinners." },
                { name: "Chidi O.", rating: 5, text: "The app is so seamless. I walked into the spa, showed my voucher, and got treated like royalty." },
                { name: "Sarah T.", rating: 4, text: "Finally, a discount platform that actually has places I want to go to. Highly recommend!" },
                { name: "Emmanuel K.", rating: 5, text: "I bought a deal for my anniversary dinner. The restaurant was amazing and the discount was real." },
                { name: "Zainab A.", rating: 5, text: "Slasham makes it so easy to discover new spots in Abuja without breaking the bank." },
                { name: "Tobi D.", rating: 4, text: "Great customer service. I had an issue with a voucher and they resolved it in minutes." }
              ].map((review, i) => (
                <div key={`top-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                </div>
              ))}
              {[
                { name: "Aisha M.", rating: 5, text: "I've saved over ₦50,000 this month alone just by using Slasham for my weekend dinners." },
                { name: "Chidi O.", rating: 5, text: "The app is so seamless. I walked into the spa, showed my voucher, and got treated like royalty." },
                { name: "Sarah T.", rating: 4, text: "Finally, a discount platform that actually has places I want to go to. Highly recommend!" },
                { name: "Emmanuel K.", rating: 5, text: "I bought a deal for my anniversary dinner. The restaurant was amazing and the discount was real." },
                { name: "Zainab A.", rating: 5, text: "Slasham makes it so easy to discover new spots in Abuja without breaking the bank." },
                { name: "Tobi D.", rating: 4, text: "Great customer service. I had an issue with a voucher and they resolved it in minutes." }
              ].map((review, i) => (
                <div key={`top-dup-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row (RTL) */}
          <div className="flex overflow-hidden w-full">
            <div className="animate-marquee-rtl flex items-center gap-6">
              {[
                { name: "Femi B.", rating: 5, text: "Best value for money in Lagos right now. The portions at the restaurants are massive." },
                { name: "Ngozi E.", rating: 4, text: "Loved the interior decor of the places listed. The discount worked perfectly without any hassle." },
                { name: "David S.", rating: 5, text: "My girlfriend loved the surprise dinner. Thanks Slasham for the plug!" },
                { name: "Amaka U.", rating: 5, text: "I was skeptical at first, but the voucher was accepted immediately. Great service." },
                { name: "Ibrahim Y.", rating: 4, text: "Nice spots for a quiet evening. The savings are actually real." },
                { name: "Blessing O.", rating: 5, text: "Everything was perfect from start to finish. Highly recommend using this platform." }
              ].map((review, i) => (
                <div key={`bottom-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                </div>
              ))}
              {[
                { name: "Femi B.", rating: 5, text: "Best value for money in Lagos right now. The portions at the restaurants are massive." },
                { name: "Ngozi E.", rating: 4, text: "Loved the interior decor of the places listed. The discount worked perfectly without any hassle." },
                { name: "David S.", rating: 5, text: "My girlfriend loved the surprise dinner. Thanks Slasham for the plug!" },
                { name: "Amaka U.", rating: 5, text: "I was skeptical at first, but the voucher was accepted immediately. Great service." },
                { name: "Ibrahim Y.", rating: 4, text: "Nice spots for a quiet evening. The savings are actually real." },
                { name: "Blessing O.", rating: 5, text: "Everything was perfect from start to finish. Highly recommend using this platform." }
              ].map((review, i) => (
                <div key={`bottom-dup-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CATEGORIES (Editorial Grid) */}
      <section className="py-24 px-4 md:px-6 bg-slate-50 border-y border-slate-200/60">
        <div className="w-full flex flex-row items-start justify-start gap-4 md:gap-8 lg:gap-14 relative">
          
          {/* LEFT: Compact Category Sidebar (Flush Left) */}
          <div className="flex flex-col items-start px-0 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 text-[8px] font-black uppercase tracking-[0.2em] mb-4">
              <Sparkles size={10} /> Categories
            </div>
            
            <div className="grid grid-cols-1 bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/40 w-[80px] md:w-[110px]">
              {[
                { name: "Dining", icon: <Utensils size={16}/>, count: "120+", color: "bg-orange-50 text-orange-600", path: "/deals/food" },
                { name: "Nightlife", icon: <Store size={16}/>, count: "45+", color: "bg-indigo-50 text-indigo-600", path: "/deals/experiences" },
                { name: "Wellness", icon: <Sparkles size={16}/>, count: "80+", color: "bg-teal-50 text-teal-600", path: "/deals/beauty" },
                { name: "Events", icon: <Ticket size={16}/>, count: "30+", color: "bg-rose-50 text-rose-600", path: "/deals/experiences" },
                { name: "Travel", icon: <MapPin size={16}/>, count: "60+", color: "bg-blue-50 text-blue-600", path: "/deals/experiences" },
                { name: "Shopping", icon: <ShoppingBag size={16}/>, count: "200+", color: "bg-amber-50 text-amber-600", path: "/deals/products" },
                { name: "Fitness", icon: <TrendingUp size={16}/>, count: "40+", color: "bg-emerald-50 text-emerald-600", path: "/deals/services" },
                { name: "Services", icon: <Briefcase size={16}/>, count: "25+", color: "bg-slate-50 text-slate-600", path: "/deals/services" }
              ].map((cat, i) => (
                <Link 
                  to={cat.path} 
                  key={i}
                  className="bg-white p-3.5 hover:bg-slate-50 transition-all group flex flex-col items-center text-center w-full h-[100px] border-b last:border-b-0 border-slate-100 relative overflow-hidden"
                >
                  <div className={`w-8 h-8 ${cat.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500 shadow-sm shrink-0 font-bold`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-[10px] font-black text-slate-900 group-hover:text-teal-600 transition-colors uppercase tracking-tight leading-none mb-1">{cat.name}</h3>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{cat.count}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: High-Density 5x5 Gift Coupon Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] w-fit">
                 <Zap size={14} className="fill-rose-500"/> Slasham Gift Coupons
               </div>
               <Link to="/gift-cards" className="text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest transition-colors">
                 Discover All →
               </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { name: "Premium Weavon", type: "Hair & Beauty", price: "45,000", img: "1621332766320-1a22be14f9d1" },
                { name: "Designer Bag", type: "Fashion", price: "25,500", img: "1591561954557-26941169b49e" },
                { name: "Educational Toy", type: "Kids", price: "12,000", img: "1596461404969-9ae70fc4975b" },
                { name: "Leather Loafers", type: "Men Shoes", price: "32,000", img: "1533681905615-5c1c85023908" },
                { name: "Pro Laptop", type: "Electronics", price: "450,000", img: "1496181133227-18327a5d4449" },
                { name: "Latest Phone", type: "Tech", price: "185,000", img: "1511707171634-5f897ff02aa9" },
                { name: "Silk Hair Bundle", type: "Hair & Beauty", price: "55,000", img: "1620331311124-78377f0a911a" },
                { name: "Travel Backpack", type: "Fashion", price: "18,000", img: "1553062407-5903f759dbe0" },
                { name: "Action Figure", type: "Kids", price: "8,500", img: "1566580162203-f6674997096d" },
                { name: "Sport Sneakers", type: "Men Shoes", price: "24,000", img: "1542291026-7eec264c27ff" },
                { name: "Gaming PC", type: "Electronics", price: "850,000", img: "1587202372422-4320fa81ca9a" },
                { name: "Wireless Earbuds", type: "Tech", price: "15,000", img: "1505740420928-5e560c06d30e" },
                { name: "Handmade Tote", type: "Fashion", price: "14,500", img: "1590874103328-eac38a683ce7" },
                { name: "Building Blocks", type: "Kids", price: "10,000", img: "1587654711722-79015099f66a" },
                { name: "Formal Boots", type: "Men Shoes", price: "38,000", img: "1549497551-52598877bc89" },
                { name: "Slim Ultrabook", type: "Electronics", price: "280,000", img: "1496181133227-18327a5d4449" },
                { name: "Smart Watch", type: "Tech", price: "15,000", img: "1523275335684-37898b6baf30" },
                { name: "Brazilian Hair", type: "Hair & Beauty", price: "68,000", img: "1621332766320-1a22be14f9d1" },
                { name: "Clutch Bag", type: "Fashion", price: "9,000", img: "1584917469850-4752b9686131" },
                { name: "Remote Car", type: "Kids", price: "15,500", img: "1558060370-d644479cb4f3" },
                { name: "Running Shoes", type: "Men Shoes", price: "21,000", img: "1460353005624-8a55221787c2" },
                { name: "Tablet Pro", type: "Electronics", price: "125,000", img: "1511707171634-5f897ff02aa9" },
                { name: "Bluetooth Speaker", type: "Tech", price: "12,000", img: "1505740420928-5e560c06d30e" },
                { name: "Luxury Satchel", type: "Fashion", price: "42,000", img: "1590874103328-eac38a683ce7" },
                { name: "Plush Toy", type: "Kids", price: "5,500", img: "1515488493433-c1a1f3399ed6" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 5) * 0.05 }}
                  className="relative group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden bg-slate-100">
                      <img 
                        src={`https://images.unsplash.com/photo-${item.img}?w=400`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={item.name} 
                      />
                      <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider">
                         ₦{item.price}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-[10px] font-black text-slate-900 group-hover:text-teal-600 transition-colors uppercase tracking-tight line-clamp-1 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{item.type}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
897:       <section className="relative py-32 lg:py-48 overflow-hidden bg-slate-950">
...
991:       </section>
      */}

      {/* 
994:       <section className="py-24 px-6 max-w-7xl mx-auto">
...
1027:       </section>
      */}

      {/* 
1030:       <section className="py-32 bg-white border-y border-slate-100">
...
1091:       </section>
      */}

      {/* 
1094:       <section className="py-32 bg-slate-50 border-y border-slate-200/60">
...
1155:       </section>
      */}

      {/* 13. BUSINESS CTA (Split Layout Style) */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 items-center relative z-10">
            <div className="p-12 md:p-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold mb-8 uppercase tracking-widest">
                <Briefcase size={14} /> For Businesses
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white leading-tight">
                Grow your business <br/>with Slasham.
              </h2>
              <p className="text-slate-400 text-xl mb-12 leading-relaxed max-w-lg">
                Partner with us to reach thousands of high-intent customers. Fill empty seats, boost revenue, and build lasting brand loyalty.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Boost Revenue</h4>
                    <p className="text-slate-500 text-sm">Fill off-peak hours and increase your bottom line.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">New Customers</h4>
                    <p className="text-slate-500 text-sm">Access a curated audience of smart spenders.</p>
                  </div>
                </div>
              </div>

              <Link to="/business" className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 rounded-full font-bold hover:bg-teal-400 transition-all shadow-xl hover:shadow-teal-500/20 group">
                List Your Business Today <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative h-full min-h-[400px] lg:min-h-[600px] hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80" 
                alt="Business Owner" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-transparent to-transparent"></div>
              
              {/* Floating Stat Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl max-w-xs"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-slate-900">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-2xl">3.5x</p>
                    <p className="text-slate-400 text-xs uppercase tracking-widest">Avg. ROI</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  "Slasham has completely transformed our Tuesday nights. We're now consistently at 90% capacity."
                </p>
                <p className="text-white text-xs font-bold mt-4 uppercase tracking-widest">— Owner, The Orchid Bistro</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
