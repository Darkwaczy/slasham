import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Star, MessageSquare, Loader2, Share2, Heart, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import gsap from "gsap";
import { getPersistentDeals } from "../utils/mockPersistence";

const REVIEWS = [
  { name: "Aisha M.", rating: 5, text: "Absolutely incredible experience! The food was top-notch and the discount made it even sweeter.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=64&q=80" },
  { name: "Chidi O.", rating: 4, text: "Great ambiance and very seamless redemption process. Will definitely be coming back.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&q=80" },
  { name: "Sarah J.", rating: 5, text: "The massage was divine. Best spa deal I've ever gotten in Lagos. Total value for money!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80" },
  { name: "Ngozi E.", rating: 5, text: "Loved the interior decor. The discount worked perfectly without any hassle at the counter.", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=64&q=80" },
  { name: "David S.", rating: 5, text: "My girlfriend loved the surprise dinner. Thanks Slasham for the plug! Highly recommended.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=64&q=80" },
  { name: "Tunde W.", rating: 4, text: "Solid deal. The food was great and the staff were very familiar with the Slasham protocol.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&q=80" }
];

export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBuying, setIsBuying] = useState(false);
  const [deal, setDeal] = useState<any>(null);

  useEffect(() => {
    // Scroll to top on id change as requested
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const allDeals = getPersistentDeals();
    const found = allDeals.find(d => String(d.id) === String(id));
    setDeal(found);
  }, [id]);

  useEffect(() => {
    if (deal) {
      gsap.fromTo(
        ".deal-content-animate > *",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [deal]);

  const calculateExpiry = (dateString?: string) => {
    if (!dateString) return "Deal ends in 2 days"; 
    const diff = new Date(dateString).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Offer expiring today";
    return `Deal ends in ${days} ${days === 1 ? 'day' : 'days'}`;
  };

  const handleBuy = () => {
    setIsBuying(true);
    setTimeout(() => {
      setIsBuying(false);
      navigate("/user/coupons");
    }, 1500);
  };

  if (!deal) {
    return (
      <div className="pt-40 pb-24 text-center">
        <Loader2 className="animate-spin mx-auto text-slate-300" size={40} />
      </div>
    );
  }

  const originalPriceNum = parseInt(deal.original.replace(/\D/g, '')) || 0;
  const dealPriceNum = parseInt(deal.price.replace(/\D/g, '')) || 0;
  const savings = originalPriceNum - dealPriceNum;
  const discountPercent = Math.round((savings / originalPriceNum) * 100);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto bg-[#FAFAFA] min-h-screen font-sans">
      <Link to="/deals" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-black uppercase text-[10px] tracking-widest group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Deals
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 deal-content-animate">
        {/* Left: Media & Details */}
        <div className="space-y-12">
          <div className="rounded-[2.5rem] overflow-hidden aspect-4/3 relative shadow-2xl shadow-slate-900/5 ring-1 ring-slate-200">
            <img 
              src={deal.image} 
              alt={deal.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] shadow-sm">
              {deal.category}
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">{deal.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                  <MapPin size={16} className="text-indigo-600" /> {deal.location}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                  <Star size={16} className="text-amber-400 fill-amber-400" /> 4.8 (120 reviews)
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 rounded-full hover:bg-white transition-all text-slate-300 hover:text-rose-500 shadow-sm"><Heart size={20} /></button>
                <button className="p-3 rounded-full hover:bg-white transition-all text-slate-300 hover:text-indigo-600 shadow-sm"><Share2 size={20} /></button>
              </div>
            </div>

            <div className="space-y-10 py-4">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">About this deal</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  {deal.description}
                </p>
              </div>

              {/* Redeem Sequence - Synchronized with Screenshot */}
              <div className="bg-emerald-50/50 p-10 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Clock size={160} /></div>
                <h3 className="text-xl font-black mb-8 text-emerald-900 flex items-center gap-3 relative z-10">
                  <Clock size={24} className="text-emerald-600" /> How to Redeem
                </h3>
                <div className="space-y-8 relative z-10">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-lg shadow-emerald-500/20">1</div>
                    <div>
                      <p className="text-slate-900 font-black mb-1 uppercase text-xs tracking-widest">Purchase the Deal</p>
                      <p className="text-slate-600 text-sm font-medium">Click the "Buy Now" button and complete your payment securely via Paystack.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-lg shadow-emerald-500/20">2</div>
                    <div>
                      <p className="text-slate-900 font-black mb-1 uppercase text-xs tracking-widest">Get Your Voucher</p>
                      <p className="text-slate-600 text-sm font-medium">Your unique Slasham voucher code will be sent to your email and will also be available in your dashboard.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-lg shadow-emerald-500/20">3</div>
                    <div>
                      <p className="text-slate-900 font-black mb-1 uppercase text-xs tracking-widest">Redeem at Venue</p>
                      <p className="text-slate-600 text-sm font-medium">Present your digital or printed voucher code to the business staff at the time of service or checkout.</p>
                    </div>
                  </div>
                  
                  <div className="mt-10 p-6 bg-white/80 rounded-3xl text-[10px] text-slate-400 italic border border-emerald-100 leading-relaxed font-bold">
                    <p className="font-black text-emerald-800 mb-2 not-italic uppercase tracking-widest text-[8px]">Important Instructions:</p>
                    • Please ensure you redeem your voucher before the validity period expires.<br/>
                    • Some businesses may require a prior reservation (at least 24 hours in advance).<br/>
                    • The voucher is valid for a one-time use only.
                  </div>
                </div>
              </div>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  `Valid for ${deal.category.toLowerCase()} only.`,
                  "Cannot be combined with other offers.",
                  deal.validity
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-emerald-200 transition-colors">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-black uppercase text-slate-600 tracking-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Pricing Artifact */}
        <div className="lg:pl-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 sticky top-32 shadow-[0_30px_60px_rgba(0,0,0,0.03)] space-y-8">
            <div className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-full inline-flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
              <Clock size={14} /> {calculateExpiry(deal.expiryDate)}
            </div>
            
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{discountPercent}% Off</h2>
              <p className="text-slate-400 text-xs font-bold tracking-tight uppercase">Authorized deployment. Pay small to unlock discount.</p>
            </div>
            
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-slate-100 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Original Price</span>
                <span className="text-xl font-bold text-slate-300 line-through">{deal.original}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Slasham Price</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{deal.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Estimated Savings</span>
                <span className="text-2xl font-black text-emerald-500 tracking-tighter">₦{savings.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleBuy}
              disabled={isBuying}
              className={`w-full py-6 rounded-3xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                isBuying ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'
              }`}
            >
              {isBuying ? <Loader2 size={24} className="animate-spin" /> : "Authorize Purchase"}
            </button>
            <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
              Verified Gateway • 100% Money Back if unredeemed
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews - Synchronized static grid as requested */}
      <div className="pt-24 border-t border-slate-200 space-y-16">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-20 group-hover:scale-125 transition-transform duration-1000" />
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-4">Customer Intelligence</h2>
              <p className="text-slate-400 font-medium mb-10 leading-relaxed max-w-sm">Aggregated sentiment analysis from verified artifact liquidations across the network.</p>
              
              <div className="flex items-end gap-6 mb-12">
                <span className="text-7xl font-black text-slate-900 tracking-tighter leading-none">4.8</span>
                <div className="pb-2">
                  <div className="flex text-amber-400 gap-1 mb-2">
                    <Star size={20} className="fill-current" />
                    <Star size={20} className="fill-current" />
                    <Star size={20} className="fill-current" />
                    <Star size={20} className="fill-current" />
                    <Star size={20} className="text-slate-100 fill-slate-100" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Based on 120 verified reviews</p>
                </div>
              </div>

              <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                <MessageSquare size={16} /> Leave a Review
              </button>
            </div>

            <div className="space-y-4">
              {[
                { s: 5, p: 85 },
                { s: 4, p: 10 },
                { s: 3, p: 3 },
                { s: 2, p: 1 },
                { s: 1, p: 1 },
              ].map((bar) => (
                <div key={bar.s} className="flex items-center gap-6">
                  <div className="w-12 text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase">
                    {bar.s} <Star size={12} className="fill-slate-300 text-slate-300" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.p}%` }} />
                  </div>
                  <div className="w-8 text-[10px] font-black text-slate-900 text-right">{bar.p}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {REVIEWS.map((review, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
               <div className="flex items-center gap-4 mb-8">
                  <img src={review.avatar} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50 shadow-lg group-hover:scale-110 transition-transform" alt="" />
                  <div>
                    <p className="text-sm font-black text-slate-900 tracking-tight">{review.name}</p>
                    <div className="flex text-amber-400 gap-0.5">
                       {[...Array(5)].map((_, j) => <Star key={j} size={10} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />)}
                    </div>
                  </div>
               </div>
               <p className="text-slate-600 font-medium leading-relaxed italic">"{review.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
