import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ShieldCheck, Star, MessageSquare } from "lucide-react";
import gsap from "gsap";
import { deals } from "../data/mockData";
import { FavoriteButton, ShareButton } from "../components/DealActions";

const REVIEWS_TOP = [
  { name: "Aisha M.", rating: 5, text: "Absolutely incredible experience! The food was top-notch and the discount made it even sweeter.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=48&q=40" },
  { name: "Chidi O.", rating: 4, text: "Great ambiance and very seamless redemption process. Will definitely be coming back.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=48&q=40" },
  { name: "Sarah T.", rating: 5, text: "I saved so much money using Slasham for this. Highly recommended for weekend hangouts!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=48&q=40" },
  { name: "Emmanuel K.", rating: 5, text: "The staff were very welcoming and didn't treat us differently because we used a discount code.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=48&q=40" },
  { name: "Zainab A.", rating: 4, text: "Good food, nice music. The 30% off really helped keep us within budget.", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=48&q=40" },
  { name: "Tobi D.", rating: 5, text: "10/10 experience. The reservation was ready and the food came out fast.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=48&q=40" }
];

const REVIEWS_BOTTOM = [
  { name: "Femi B.", rating: 5, text: "Best value for money in Abuja right now. The portions were massive.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=48&q=40" },
  { name: "Ngozi E.", rating: 4, text: "Loved the interior decor. The discount worked perfectly without any hassle.", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=48&q=40" },
  { name: "David S.", rating: 5, text: "My girlfriend loved the surprise dinner. Thanks Slasham for the plug!", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=48&q=40" },
  { name: "Amaka U.", rating: 5, text: "I was skeptical at first, but the voucher was accepted immediately. Great service.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=48&q=40" },
  { name: "Ibrahim Y.", rating: 4, text: "Nice spot for a quiet evening. The savings are actually real.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=48&q=40" },
  { name: "Blessing O.", rating: 5, text: "Everything was perfect from start to finish. Highly recommend this deal.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=48&q=40" }
];


export default function DealDetail() {
  const { id } = useParams();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const deal = deals.find(d => d.id === Number(id));

  useEffect(() => {
    if (deal) {
      gsap.fromTo(
        ".deal-content > *",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [deal]);

  if (!deal) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Deal Not Found</h1>
        <p className="text-slate-500 mb-8">The deal you are looking for does not exist or has expired.</p>
        <Link to="/deals" className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors">
          Browse All Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen deal-content bg-[#FAFAFA] text-slate-900 font-sans">
      <Link to="/deals" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors mb-8 font-medium">
        <ArrowLeft size={20} /> Back to Deals
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Left: Image & Info */}
        <div>
          <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 relative group ring-1 ring-slate-200/60 shadow-sm">
            <img 
              src={deal.image} 
              alt={deal.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 uppercase tracking-wider shadow-sm">
              {deal.category}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">{deal.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-200/60">
            <div className="flex flex-wrap items-center gap-6 text-slate-500">
              <div className="flex items-center gap-2 font-medium">
                <MapPin size={18} className="text-teal-600" /> {deal.location}
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Star size={18} className="text-amber-400 fill-amber-400" /> 4.8 (120 reviews)
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FavoriteButton dealId={deal.id} />
              <ShareButton dealId={deal.id} title={deal.title} />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">About this deal</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {deal.description}
              </p>
            </div>

            {/* How to Redeem Section */}
            <div className="bg-teal-50/50 p-8 rounded-3xl border border-teal-100/50">
              <h3 className="text-xl font-bold mb-6 text-teal-900 flex items-center gap-2">
                <Clock size={22} className="text-teal-600" /> How to Redeem
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">1</div>
                  <div>
                    <p className="text-slate-800 font-bold mb-1">Purchase the Deal</p>
                    <p className="text-slate-600 text-sm">Click the "Buy Now" button and complete your payment securely via Paystack.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">2</div>
                  <div>
                    <p className="text-slate-800 font-bold mb-1">Get Your Voucher</p>
                    <p className="text-slate-600 text-sm">Your unique Slasham voucher code will be sent to your email and will also be available in your dashboard.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">3</div>
                  <div>
                    <p className="text-slate-800 font-bold mb-1">Redeem at Venue</p>
                    <p className="text-slate-600 text-sm">Present your digital or printed voucher code to the business staff at the time of service or checkout.</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white/80 rounded-2xl text-xs text-slate-500 italic border border-teal-100/30 leading-relaxed">
                  <p className="font-bold text-teal-800 mb-1 not-italic">Important Instructions:</p>
                  • Please ensure you redeem your voucher before the validity period expires.<br/>
                  • Some businesses may require a prior reservation (at least 24 hours in advance).<br/>
                  • The voucher is valid for a one-time use only.
                </div>
              </div>
            </div>
            
            <ul className="space-y-4 text-slate-600 bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm">
              <li className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-teal-600 shrink-0 mt-0.5" />
                <span className="font-medium">Valid for {deal.category.toLowerCase()} only.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-teal-600 shrink-0 mt-0.5" />
                <span className="font-medium">Cannot be combined with other offers.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-teal-600 shrink-0 mt-0.5" />
                <span className="font-medium">{deal.validity}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Purchase Card */}
        <div className="lg:pl-12">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-8 sticky top-32 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full inline-flex items-center gap-2 font-bold text-sm mb-6">
              <Clock size={16} /> Deal ends in 2 days
            </div>
            
            <h2 className="text-3xl font-bold mb-2 text-slate-900">{deal.tag || "Special Offer"}</h2>
            <p className="text-slate-500 mb-8 font-medium">Pay small now to unlock your discount.</p>
            
            <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-slate-100 mb-8">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Original Price</span>
                <span className="text-xl font-bold text-slate-400 line-through">{deal.original}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Current Price</span>
                <span className="text-2xl font-bold text-slate-900">{deal.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Estimated Savings</span>
                <span className="text-xl font-bold text-teal-600">
                  {/* Simple calculation mock, assuming format like ₦5,000 */}
                  ₦{(parseInt(deal.original.replace(/\D/g, '')) - parseInt(deal.price.replace(/\D/g, ''))).toLocaleString()}
                </span>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-colors mb-4 shadow-sm">
              Buy Now
            </button>
            <p className="text-center text-xs text-slate-400 font-medium">
              Secure payment via Paystack • 100% Money Back Guarantee if unredeemed
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-16 border-t border-slate-200/60">
        
        {/* Rating Overview */}
        <div className="bg-white rounded-3xl p-8 md:p-12 ring-1 ring-slate-200/60 shadow-sm mb-16">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Customer Reviews</h2>
              <p className="text-slate-500 mb-6">See what others are saying about this experience.</p>
              <div className="flex items-end justify-center md:justify-start gap-4 mb-2">
                <span className="text-6xl font-bold text-slate-900 tracking-tighter">4.8</span>
                <div className="pb-2">
                  <div className="flex text-amber-400 mb-1">
                    <Star size={20} className="fill-current" />
                    <Star size={20} className="fill-current" />
                    <Star size={20} className="fill-current" />
                    <Star size={20} className="fill-current" />
                    <Star size={20} className="fill-current text-slate-200" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Based on 120 reviews</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              {[
                { stars: 5, percent: 85 },
                { stars: 4, percent: 10 },
                { stars: 3, percent: 3 },
                { stars: 2, percent: 1 },
                { stars: 1, percent: 1 },
              ].map((bar) => (
                <div key={bar.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12 shrink-0 text-sm font-medium text-slate-600">
                    {bar.stars} <Star size={12} className="fill-slate-400 text-slate-400" />
                  </div>
                  <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${bar.percent}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-sm font-medium text-slate-500 shrink-0">
                    {bar.percent}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-12">
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <MessageSquare size={18} />
            Leave a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="mb-12 bg-white p-8 rounded-3xl ring-1 ring-slate-200/60 shadow-sm max-w-2xl">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Write a Review</h3>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="text-slate-300 hover:text-amber-400 transition-colors">
                  <Star size={24} className="fill-current" />
                </button>
              ))}
            </div>
            <textarea 
              className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
              rows={4}
              placeholder="Share your experience with this deal..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                Submit Review
              </button>
            </div>
          </div>
        )}

        {/* Infinite Scrolling Reviews */}
        <div className="relative overflow-hidden -mx-6 px-6 pb-12">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>
          
          {/* Top Row (LTR) */}
          <div className="flex overflow-hidden w-full mb-6">
            <div className="animate-marquee-ltr flex items-center gap-6">
              {[...REVIEWS_TOP, ...REVIEWS_TOP].map((review, i) => (
                <div key={`top-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={review.avatar} 
                      alt={review.name} 
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-100"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={10} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row (RTL) */}
          <div className="flex overflow-hidden w-full">
            <div className="animate-marquee-rtl flex items-center gap-6">
              {[...REVIEWS_BOTTOM, ...REVIEWS_BOTTOM].map((review, i) => (
                <div key={`bottom-${i}`} className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl ring-1 ring-slate-200/60 shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={review.avatar} 
                      alt={review.name} 
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-100"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={10} className={j < review.rating ? "fill-amber-400" : "text-slate-200 fill-slate-200"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
