import { Link } from "react-router-dom";
import { Share2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import FavoriteButton from "./FavoriteButton";

const THEMES: Record<string, { bg: string, border: string, btn: string, text: string, accent: string }> = {
  'Food': { bg: 'bg-orange-100/60', border: 'border-orange-200', btn: 'bg-orange-500 hover:bg-orange-600', text: 'text-orange-950', accent: 'text-orange-600' },
  'Food & Drink': { bg: 'bg-orange-100/60', border: 'border-orange-200', btn: 'bg-orange-500 hover:bg-orange-600', text: 'text-orange-950', accent: 'text-orange-600' },
  'Spa': { bg: 'bg-rose-100/60', border: 'border-rose-200', btn: 'bg-rose-500 hover:bg-rose-600', text: 'text-rose-950', accent: 'text-rose-600' },
  'Beauty': { bg: 'bg-rose-100/60', border: 'border-rose-200', btn: 'bg-rose-500 hover:bg-rose-600', text: 'text-rose-950', accent: 'text-rose-600' },
  'Beauty & Spas': { bg: 'bg-rose-100/60', border: 'border-rose-200', btn: 'bg-rose-500 hover:bg-rose-600', text: 'text-rose-950', accent: 'text-rose-600' },
  'Grocery': { bg: 'bg-sky-100/60', border: 'border-sky-200', btn: 'bg-sky-600 hover:bg-sky-700', text: 'text-sky-950', accent: 'text-sky-600' },
  'Goods': { bg: 'bg-sky-100/60', border: 'border-sky-200', btn: 'bg-sky-600 hover:bg-sky-700', text: 'text-sky-950', accent: 'text-sky-600' },
  'Events': { bg: 'bg-purple-100/60', border: 'border-purple-200', btn: 'bg-purple-600 hover:bg-purple-700', text: 'text-purple-950', accent: 'text-purple-600' },
  'Things To Do': { bg: 'bg-purple-100/60', border: 'border-purple-200', btn: 'bg-purple-600 hover:bg-purple-700', text: 'text-purple-950', accent: 'text-purple-600' },
  'Service': { bg: 'bg-blue-100/60', border: 'border-blue-200', btn: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-950', accent: 'text-blue-600' },
  'Local Services': { bg: 'bg-blue-100/60', border: 'border-blue-200', btn: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-950', accent: 'text-blue-600' },
  'default': { bg: 'bg-slate-50', border: 'border-slate-100', btn: 'bg-slate-800 hover:bg-slate-900', text: 'text-slate-900', accent: 'text-slate-600' }
};

interface DealCardProps {
  id: number;
  title: string;
  price: string;
  original: string;
  image: string;
  category?: string;
  location?: string;
  totalQuantity?: number;
  soldQuantity?: number;
  expiryDate?: string;
  dealExplanation?: string;
}

function getExpiryLabel(expiryDate?: string): string | null {
  if (!expiryDate) return null;
  const diff = new Date(expiryDate).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}hr${hours !== 1 ? 's' : ''} left`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} left`;
}

export default function DealCard({ 
  id, title, price, original, image, category, location, 
  totalQuantity = 100, soldQuantity = 0, expiryDate, dealExplanation 
}: DealCardProps) {
  const expiryLabel = getExpiryLabel(expiryDate);
  const isUrgent = !!expiryLabel && (expiryLabel.includes('hr') || expiryLabel === 'Expired');

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({ title: title, url: window.location.origin + `/deal/${id}` });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/deal/${id}`);
      alert("Link copied to clipboard!");
    }
  };

  const discountPercent = Math.round((1 - (parseInt(price.replace(/\D/g,'')) / parseInt(original.replace(/\D/g,'')))) * 100);

  const theme = THEMES[category as keyof typeof THEMES] || 
                THEMES[Object.keys(THEMES).find(k => k.toLowerCase() === (category || '').toLowerCase()) as keyof typeof THEMES] || 
                THEMES.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link to={`/deal/${id}`} className={`group rounded-3xl overflow-hidden border transition-all relative flex flex-col h-full ${theme.bg} ${theme.border} shadow-sm hover:shadow-2xl`}>
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {expiryLabel && (
            <div className="bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-100">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isUrgent ? 'bg-rose-500' : 'bg-amber-400'}`} />
              <span className="text-[10px] font-black tracking-tight text-slate-900 uppercase">{expiryLabel}</span>
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <div className="bg-rose-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            {discountPercent}% OFF
          </div>
        </div>

        {/* Image Container */}
        <div className="aspect-4/3 overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out bg-slate-100"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=70" }}
          />
          {/* Image Overlays */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            {soldQuantity > 40 && (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-amber-400 text-slate-900 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg"
              >
                Selling Fast
              </motion.div>
            )}
            {id % 5 === 0 && (
              <div className="bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                New
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <FavoriteButton dealId={id} className="shadow-xl" />
             <button onClick={handleShare} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-xl hover:bg-slate-50 transition-colors">
                <Share2 size={14} />
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col grow gap-3">
          {/* Merchant Info */}
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <ShoppingBag size={12} className={theme.accent} />
             <span>{category || "Vendor"}</span>
             <span className="text-slate-200">|</span>
             <span>{location || "Lagos"}</span>
          </div>

          {/* Title */}
          <h3 className={`text-lg font-black ${theme.text} line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors`}>
            {title}
          </h3>

          {/* The 'Yellow Mark' Area - Deal Explanation */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
               {dealExplanation || `Valid for a limited time. Terms and conditions apply at redemption venue.`}
             </p>
          </div>

          {/* Price & Stats Row */}
          <div className="mt-auto pt-2">
             <div className="flex items-end justify-between mb-3">
                <div className="flex flex-col">
                   <span className="text-xs text-slate-300 line-through font-bold mb-0.5">{original}</span>
                   <span className={`text-2xl font-black ${theme.text} tracking-tighter leading-none`}>{price}</span>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      <span className="text-emerald-600">{soldQuantity}/{totalQuantity}</span> claimed
                   </p>
                   {/* Mini Progress Bar */}
                   <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (soldQuantity / totalQuantity) * 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className={`h-full rounded-full ${
                          (totalQuantity - soldQuantity) < 10 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'
                        }`}
                      />
                   </div>
                </div>
             </div>

             {/* Button */}
             <button className={`w-full py-4 ${theme.btn} text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 group-hover:shadow-xl`}>
                Get Coupon <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
