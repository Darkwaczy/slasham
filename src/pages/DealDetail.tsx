import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Star, MessageSquare, Loader2, ShieldCheck, CreditCard, X, ChevronRight, Building, Truck, ClipboardCheck, Info, BookOpen, Gavel, Check, ShoppingBag, Ticket, Store, HelpCircle, ChevronDown, Share2, Heart, Video, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { apiClient } from "../api/client";
import CouponAgreementModal from "../components/CouponAgreementModal";
import CelebrationModal from "../components/CelebrationModal";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [deal, setDeal] = useState<any>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMedia, setReviewMedia] = useState<any[]>([]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: deal.title,
          text: `Check out this deal on Slasham: ${deal.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchDeal = async () => {
      try {
        const d = await apiClient(`/deals/${id}`);
        // Map backend deal to frontend shape
        setDeal({
          id: d.id,
          title: d.title,
          price: d.discount_price.toString(),
          original: d.original_price.toString(),
          image: d.images?.[0] || "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
          category: d.category,
          location: d.merchants?.city || "Lagos",
          companyName: d.merchants?.business_name,
          description: d.description,
          expiryDate: d.expiry_date,
          totalQuantity: d.total_quantity,
          soldQuantity: d.sold_quantity,
          dealExplanation: d.deal_explanation,
          validity: d.terms_conditions,
          redeemAddress: d.merchants?.address
        });
      } catch (error) {
        console.error("Failed to fetch deal:", error);
      }
    };
    fetchDeal();
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

  // Live countdown ticker
  useEffect(() => {
    if (!deal?.expiryDate) return;
    const tick = () => {
      const diff = new Date(deal.expiryDate).getTime() - Date.now();
      if (diff <= 0) { setCountdown("Expired"); return; }
      const totalSecs = Math.floor(diff / 1000);
      const days  = Math.floor(totalSecs / 86400);
      const hrs   = Math.floor((totalSecs % 86400) / 3600);
      const mins  = Math.floor((totalSecs % 3600) / 60);
      const secs  = totalSecs % 60;
      if (days > 0) {
        setCountdown(`${days}d ${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`);
      } else {
        setCountdown(`${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deal]);

  const formatPrice = (p: string) => {
    const digits = p.replace(/\D/g, '');
    return `₦${Number(digits).toLocaleString()}`;
  };

  const handleBuyInitiate = () => {
    setShowAgreementModal(true);
  };

  const handleAgreementConfirmed = () => {
    setShowAgreementModal(false);
    setShowCelebration(true);  // show 5-second celebration first
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    setIsBuying(true);
    setShowPaymentModal(false);
    
    try {
      await apiClient("/vouchers/claim", {
        method: "POST",
        body: JSON.stringify({ deal_id: id }),
      });

      setIsBuying(false);
      navigate("/user/coupons");
    } catch (error: any) {
      setIsBuying(false);
      alert(`Claim failed: ${error.message}`);
    }
  };

  const handleReviewSubmit = () => {
    setIsSubmittingReview(true);
    setTimeout(() => {
      setIsSubmittingReview(false);
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewMedia([]);
      alert("Review submitted successfully!");
    }, 2000);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMedia = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image',
        name: file.name
      }));
      setReviewMedia([...reviewMedia, ...newMedia]);
    }
  };

  const removeMedia = (index: number) => {
    setReviewMedia(reviewMedia.filter((_, i) => i !== index));
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
  const actualValidity = deal.validity || "Valid for 30 days. No booking required.";

  return (
    <div className="pt-2 pb-24 px-6 max-w-7xl mx-auto bg-[#FAFAFA] min-h-screen font-sans">
      <Link to="/deals" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 font-black uppercase tracking-widest group text-[11px]">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Deals
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16 deal-content-animate">
        {/* Left: Media & Details */}
        <div className="space-y-12">
          <div className="rounded-[2.5rem] overflow-hidden aspect-4/3 relative shadow-2xl shadow-emerald-500/5 ring-1 ring-slate-200 bg-white flex items-center justify-center">
            <img 
              src={deal.image} 
              alt={deal.title} 
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" }}
            />
            <div className="absolute top-6 left-6 flex flex-col items-start gap-2 max-w-[80%]">
                <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                   {deal.category}
                </div>
                {deal.shippingInfo?.enabled && (
                    <div className="flex flex-col items-start gap-2">
                        <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-1.5">
                            <Truck size={12} className="text-white" /> Free local delivery
                        </div>
                        {deal.shippingInfo.fee && (
                            <div className="bg-emerald-600/95 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                                <MapPin size={12} className="text-white" /> Outside Lagos: ₦{deal.shippingInfo.fee}
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-1">
                <p className="text-indigo-600 font-bold uppercase tracking-[0.4em] text-xs leading-none mb-2">{deal.companyName || "Exclusive Partner"}</p>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                    {deal.title.includes(' - ') ? deal.title.split(' - ')[1] : deal.title}
                </h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-slate-100 mt-8 gap-6 w-full">
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                    <MapPin size={18} /> {deal.location || "Lekki Phase 1, Lagos"}
                 </div>
                 <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
                    <Star size={18} className="fill-amber-400" /> 4.8 <span className="text-slate-400">(120 Reviews)</span>
                 </div>
               </div>
               <div className="flex items-center gap-3 shrink-0">
                 <button onClick={handleSave} className={`p-3 rounded-full bg-white border border-slate-100 hover:border-rose-100 transition-all shadow-sm ${isSaved ? 'text-rose-500' : 'text-slate-300 hover:text-rose-500'}`}>
                   <Heart size={20} className={isSaved ? "fill-current" : ""} />
                 </button>
                 <button onClick={handleShare} className="p-3 rounded-full bg-white border border-slate-100 hover:border-indigo-100 transition-all text-slate-300 hover:text-indigo-600 shadow-sm">
                   <Share2 size={20} />
                 </button>
               </div>
            </div>

            <div className="flex items-center py-4 gap-x-4 lg:gap-x-6 w-full">
                {[
                  { name: "About", id: "about" },
                  { name: "Need To Know", id: "need-to-know" },
                  { name: "FAQs", id: "faqs" },
                  { name: "Where To Redeem", id: "redeem" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="text-[10px] sm:text-[11px] font-black text-slate-900 hover:text-emerald-500 uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
            </div>

            <div className="space-y-10 py-4">
              <div id="about" className="scroll-mt-32">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">About this deal</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  {deal.description}
                </p>
                {(deal.redeemAddress || deal.location) && (
                    <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                        <MapPin size={18} className="text-indigo-600" />
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Redeem at:</p>
                            <p className="text-sm font-bold text-slate-900">{deal.redeemAddress || deal.location}</p>
                        </div>
                    </div>
                )}
              </div>

              <div id="what-you-get" className="space-y-6 scroll-mt-32">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">What You Get</h3>
                <div className="space-y-4">
                  {(deal.whatYouGet || (() => {
                    const categoryDefaults: Record<string, any[]> = {
                      Food: [
                        { title: "Complimentary Side or Drink", description: "Enjoy an extra treat with your main meal." },
                        { title: "Priority Seating", description: "Voucher holders get preferred table allocation." },
                        { title: "Authentic Experience", description: "Freshly prepared dishes using premium ingredients." }
                      ],
                      Spa: [
                        { title: "Expert Therapists", description: "Treatment by certified wellness professionals." },
                        { title: "Aromatherapy Atmosphere", description: "Calming environment designed for total relaxation." },
                        { title: "Premium Skincare", description: "Only high-quality, skin-safe products used." }
                      ],
                      Travel: [
                        { title: "Guided Experience", description: "Led by knowledgeable local experts." },
                        { title: "All Gear Included", description: "No hidden costs for equipment or safety kits." },
                        { title: "Photo Opportunities", description: "Curated stops at the most scenic locations." }
                      ],
                      Events: [
                        { title: "Guaranteed Entry", description: "Secure your spot even at high-demand events." },
                        { title: "Bonus Perks", description: "Includes complimentary snacks or workshop materials." },
                        { title: "VIP Support", description: "Dedicated help for Slasham ticket holders." }
                      ]
                    };
                    return categoryDefaults[deal.category] || [
                      { title: "Exclusive Slasham Discount", description: "Save big on this premium experience." },
                      { title: "Instant Digital Delivery", description: "Get your voucher code immediately after purchase." },
                      { title: "Verified Partner", description: "Redeem with confidence at our trusted business locations." }
                    ];
                  })()).map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Check size={12} />
                      </div>
                      <div>
                        <p className="text-slate-900 font-black text-sm uppercase tracking-tight">{item.title}</p>
                        {item.description && (
                          <p className="text-slate-500 text-base font-medium leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="need-to-know" className="scroll-mt-32 p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-10">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight pb-4 border-b border-slate-50">Need To Know Info</h3>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-900">
                      <ClipboardCheck size={20} className="text-indigo-600" />
                      <span className="font-black text-sm uppercase tracking-widest">Inclusions & Limitations</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium pl-8">Not valid toward taxes, gratuity or delivery fees.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-900">
                      <Info size={20} className="text-indigo-600" />
                      <span className="font-black text-sm uppercase tracking-widest">Additional Info</span>
                    </div>
                    <p className="text-slate-500 text-base font-medium leading-relaxed pl-8">
                      Cannot be combined with any other offers, discounts, promotions or specials; Please tip generously on the full voucher value/amount; 
                      Campaign run-length is 90 days; Voucher is valid 24 hours after purchase; Merchant does not require reservations but can be reached at (773) 498-8210
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-900">
                      <BookOpen size={20} className="text-indigo-600" />
                      <span className="font-black text-sm uppercase tracking-widest">Terms & Conditions</span>
                    </div>
                    <div className="pl-8 space-y-2 text-slate-500 text-sm font-medium">
                      <p>• Limit 3 per person.</p>
                      <p>• May be repurchased every 30 days.</p>
                      <p>• Limit 1 per visit.</p>
                      <p>• Limit 1 per table.</p>
                      <p>• Entire voucher value must be used in one purchase.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-900">
                      <Gavel size={20} className="text-indigo-600" />
                      <span className="font-black text-sm uppercase tracking-widest">Legal Disclosures</span>
                    </div>
                    <div className="pl-8 space-y-2 text-slate-500 text-sm font-medium">
                      <p>Promotional value expires 120 days after purchase. Amount paid never expires.</p>
                      <p>Merchant is solely responsible to purchasers for the care and quality of the advertised goods and services.</p>
                      <p className="pt-2">
                        <a href="#" className="text-indigo-600 hover:underline">Learn about Strike-Through Pricing and Savings</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div id="redeem" className="space-y-10 scroll-mt-32">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tight">How to Redeem</h3>
                    <div className="hidden md:flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Process</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-slate-100 z-0" />

                  <div className="relative z-10 bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Step 01</p>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Purchase Coupon</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Securely buy your voucher using Paystack or Bank Transfer.</p>
                    </div>
                  </div>

                  <div className="relative z-10 bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <Ticket size={28} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Step 02</p>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Get Your Code</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Instant delivery to your dashboard and email inbox.</p>
                    </div>
                  </div>

                  <div className="relative z-10 bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Store size={28} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-amber-600 uppercase tracking-widest">Step 03</p>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Show & Save</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">Present your unique code at the venue to redeem your offer.</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-4xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><ShieldCheck size={120} /></div>
                  <div className="relative z-10 space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">Important Redemption Policy</h4>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <p className="text-slate-300 text-base font-medium flex items-start gap-3">
                             <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                             Must be redeemed before the validity period expires.
                          </p>
                          <p className="text-slate-300 text-base font-medium flex items-start gap-3">
                             <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                             {actualValidity}
                          </p>
                       </div>
                       <div className="space-y-3">
                          <p className="text-slate-300 text-base font-medium flex items-start gap-3">
                             <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                             The voucher is valid for a one-time use only.
                          </p>
                          <p className="text-slate-300 text-base font-medium flex items-start gap-3">
                             <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                             Present valid ID if requested by the merchant.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pricing Sidebar */}
        <div className="lg:pl-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-10 sticky top-32 shadow-[0_40px_80px_rgba(0,0,0,0.04)] space-y-8">
            {/* Live countdown badge */}
            {countdown ? (
              <div className={`flex items-center gap-2.5 font-bold text-xs uppercase tracking-widest w-fit px-4 py-2 rounded-full ${
                countdown === 'Expired'
                  ? 'bg-slate-100 text-slate-400'
                  : countdown.includes('d ')
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-rose-50 text-rose-600 animate-pulse'
              }`}>
                <Clock size={14} />
                {countdown === 'Expired' ? 'Offer Expired' : `Expires in ${countdown}`}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-rose-500 font-bold text-xs uppercase tracking-widest bg-rose-50/50 w-fit px-4 py-2 rounded-full">
                <Clock size={14} /> Offer Expiring Today
              </div>
            )}
            
            <div className="space-y-6">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{discountPercent}% Off</h2>
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
                <p className="text-amber-600 text-sm font-black tracking-widest uppercase leading-tight">
                  {deal.dealExplanation}
                </p>
              </div>
            </div>
            
            {deal.totalQuantity && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="text-emerald-600">{deal.soldQuantity || 0} Bought</span>
                  <span className="text-rose-500">{Math.max(0, deal.totalQuantity - (deal.soldQuantity || 0))} Remaining</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      (deal.totalQuantity - (deal.soldQuantity || 0)) < 10 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, ((deal.soldQuantity || 0) / deal.totalQuantity) * 100)}%` }}
                  />
                </div>
                {(deal.totalQuantity - (deal.soldQuantity || 0)) < 10 && (
                  <p className="text-rose-500 text-[10px] font-black tracking-widest uppercase mt-3 text-center animate-pulse">Hurry! Almost sold out.</p>
                )}
              </div>
            )}

            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center text-slate-400 group">
                <span className="font-bold uppercase text-[10px] tracking-[0.2em]">Market Price</span>
                <span className="text-lg font-medium line-through opacity-50">{formatPrice(deal.original)}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Slasham Price</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{formatPrice(deal.price)}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Your Savings</span>
                <span className="text-2xl font-black text-emerald-500 tracking-tighter">₦{savings.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleBuyInitiate}
                disabled={isBuying}
                className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                  isBuying ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                }`}
              >
                {isBuying ? <Loader2 size={24} className="animate-spin" /> : "Buy Coupon"}
              </button>
              <p className="text-center text-[8px] text-slate-300 font-black uppercase tracking-[0.3em] mt-6">
                Verified Gateway • 100% Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Agreement Modal — shown before payment */}
      {showAgreementModal && (
        <CouponAgreementModal
          deal={deal}
          onAgree={handleAgreementConfirmed}
          onCancel={() => setShowAgreementModal(false)}
        />
      )}

      {/* 5-Second Celebration before payment */}
      {showCelebration && (
        <CelebrationModal
          deal={deal}
          onComplete={handleCelebrationComplete}
        />
      )}

      {/* Payment Modal Mockup */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setShowPaymentModal(false)}
               className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">S</div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Slasham Pay</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Secure Payment Processing</p>
                        </div>
                    </div>
                    <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
                </div>

                <div className="p-10 space-y-8">
                   <div className="text-center space-y-2">
                       <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Amount Payable</p>
                       <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{formatPrice(deal.price)}</h2>
                   </div>

                   <div className="space-y-4">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <CreditCard size={20} className="text-indigo-600" />
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase">Pay with Card</p>
                               <p className="text-[9px] text-slate-400 font-bold">Visa, Mastercard, Verve</p>
                            </div>
                         </div>
                         <ChevronRight size={18} className="text-slate-300" />
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Building size={20} className="text-indigo-600" />
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase">Bank Transfer</p>
                               <p className="text-[9px] text-slate-400 font-bold">Dynamic Nigerian Bank Account</p>
                            </div>
                         </div>
                         <ChevronRight size={18} className="text-slate-300" />
                      </div>
                   </div>

                   <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                      <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                      <p className="text-xs font-bold text-emerald-800 leading-relaxed italic">
                        By clicking "Complete Payment", you agree to Slasham's terms of service and the {deal.companyName || "Vendor"}'s specific redemption protocols.
                      </p>
                   </div>

                   <button 
                     onClick={handlePaymentComplete}
                     className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     {isBuying ? <Loader2 size={18} className="animate-spin" /> : <><ShieldCheck size={18} /> Complete Payment</>}
                   </button>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6">
                    <img src="https://static-00.iconduck.com/assets.00/visa-icon-512x163-j0s6c9er.png" className="h-4 object-contain opacity-40 grayscale" alt="" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 object-contain opacity-40 grayscale" alt="" />
                    <img src="https://paystack.com/assets/img/v3/logo-black.svg" className="h-4 object-contain opacity-40 grayscale" alt="" />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setShowReviewModal(false)}
               className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Write a Review</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Share your experience with others</p>
                        </div>
                    </div>
                    <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                   <div className="text-center space-y-4">
                       <p className="text-xs font-black uppercase tracking-widest text-slate-400">Rate your experience</p>
                       <div className="flex items-center justify-center gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                             <button 
                               key={star}
                               onMouseEnter={() => setReviewHoverRating(star)}
                               onMouseLeave={() => setReviewHoverRating(0)}
                               onClick={() => setReviewRating(star)}
                               className="transition-transform active:scale-90"
                             >
                                <Star 
                                  size={40} 
                                  className={`${(reviewHoverRating || reviewRating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} transition-colors`} 
                                />
                             </button>
                          ))}
                       </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Tell us more</p>
                      <textarea 
                        className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-600 placeholder:text-slate-300 resize-none"
                        placeholder="What did you like about this deal? How was the service?"
                      />
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <p className="text-xs font-black uppercase tracking-widest text-slate-400">Photos & Videos</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">{reviewMedia.length} files added</p>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                         {reviewMedia.map((media, idx) => (
                            <div key={idx} className="aspect-square rounded-xl bg-slate-100 relative group overflow-hidden border border-slate-200">
                               {media.type === 'video' ? (
                                  <video src={media.url} className="w-full h-full object-cover" />
                               ) : (
                                  <img src={media.url} className="w-full h-full object-cover" alt="" />
                               )}
                               <button 
                                 onClick={() => removeMedia(idx)}
                                 className="absolute top-1 right-1 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                               >
                                  <Trash2 size={12} />
                               </button>
                               {media.type === 'video' && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                     <Video size={20} className="text-white drop-shadow-md" />
                                  </div>
                               )}
                            </div>
                         ))}
                         
                         <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all text-slate-400 hover:text-emerald-600">
                            <Plus size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Add Media</span>
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*,video/*" 
                              className="hidden" 
                              onChange={handleMediaUpload}
                            />
                         </label>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                   <button 
                     onClick={() => setShowReviewModal(false)}
                     className="flex-1 py-4 border border-slate-200 text-slate-400 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-slate-900 transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleReviewSubmit}
                     disabled={isSubmittingReview || reviewRating === 0}
                     className={`flex-1 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${
                        isSubmittingReview || reviewRating === 0 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'
                     }`}
                   >
                     {isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : 'Post Review'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAQs */}
      <div id="faqs" className="pt-24 border-t border-slate-200 space-y-16 scroll-mt-32">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">Frequently Asked Questions</h2>
            <p className="text-slate-400 font-medium text-base">Got questions? We've got answers to everything you need to know about your Slasham experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "How do I use my voucher?", a: "After purchasing, you'll receive a code via email and in your dashboard. Present this code at the business location." },
            { q: "What is your refund policy?", a: "We have a strict no-refund policy once a voucher has been purchased." },
            { q: "Can I roll over my voucher?", a: "Vouchers cannot be rolled over or transferred to other deals or promotions." },
            { q: "What if my voucher expires?", a: "In most cases, we can consider a rollover with a penalty of 5% of the purchase price after expiration, subject to merchant approval." },
            { q: "Can I buy a deal as a gift?", a: "Absolutely! Just purchase the coupon and share the unique voucher code with your lucky recipient. They can redeem it just like any other customer." },
            { q: "Do I need to book in advance?", a: "Booking requirements vary by merchant. We recommend calling the business at the number provided in the 'Need to Know' section to confirm availability." }
          ].map((faq, i) => (
            <div 
              key={i} 
              onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              className={`p-8 bg-white border transition-all cursor-pointer group flex flex-col gap-4 overflow-hidden ${openFaqIndex === i ? 'rounded-4xl border-indigo-200 shadow-xl shadow-indigo-500/5' : 'rounded-3xl border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md'}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${openFaqIndex === i ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                    <HelpCircle size={24} />
                  </div>
                  <p className={`text-sm font-black uppercase tracking-tight transition-colors ${openFaqIndex === i ? 'text-indigo-600' : 'text-slate-900'}`}>{faq.q}</p>
                </div>
                <motion.div
                  animate={{ rotate: openFaqIndex === i ? 180 : 0 }}
                  className={openFaqIndex === i ? 'text-indigo-600' : 'text-slate-300'}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>

              <AnimatePresence>
                {openFaqIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="pl-[72px] pr-8 pb-2 border-t border-slate-50 pt-6">
                      <p className="text-slate-500 text-base font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <div id="reviews" className="pt-24 border-t border-slate-200 space-y-16 scroll-mt-32">
        <div className="bg-white rounded-3xl p-10 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-20 group-hover:scale-125 transition-transform duration-1000" />
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">Verified Reviews</h2>
              <p className="text-slate-400 font-medium mb-10 leading-relaxed max-w-sm">Authentic feedback from real users who redeemed this offer at {deal.companyName || deal.title.split("'")[0]}.</p>
              
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
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Based on 120 verified reviews</p>
                </div>
              </div>

              <button 
                onClick={() => setShowReviewModal(true)}
                className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
              >
                <MessageSquare size={16} /> Write a Review
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
                  <div className="w-12 text-xs font-black text-slate-400 flex items-center gap-1.5 uppercase">
                    {bar.s} <Star size={12} className="fill-slate-300 text-slate-300" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.p}%` }} />
                  </div>
                  <div className="w-8 text-xs font-black text-slate-900 text-right">{bar.p}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {REVIEWS.map((review, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-10 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
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
