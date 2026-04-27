import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Heart, Search, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { storage } from "../../utils/storage";

export default function SavedDeals() {
  const [savedDeals, setSavedDeals] = useState<any[]>(() => {
    return JSON.parse(storage.getItem("slasham_saved_deals") || "[]");
  });

  const removeDeal = (id: string) => {
    const updated = savedDeals.filter(deal => deal.id !== id);
    setSavedDeals(updated);
    storage.setItem("slasham_saved_deals", JSON.stringify(updated));
    window.dispatchEvent(new Event('savedDealsUpdated'));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Saved Deals</h1>
          <p className="text-slate-500 font-medium">Your personal wishlist of premium offers</p>
        </div>
        
        {savedDeals.length > 0 && (
          <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <Heart size={18} className="text-emerald-500 fill-emerald-500" />
            <span className="text-sm font-bold text-emerald-900">{savedDeals.length} deals saved</span>
          </div>
        )}
      </div>

      {savedDeals.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-16 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Your wishlist is empty</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            When you find a deal you love, click the heart icon to save it here for later.
          </p>
          <Link 
            to="/deals" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            <Search size={16} /> Explore Deals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {savedDeals.map((deal, idx) => (
              <motion.div
                key={deal.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="relative h-56 bg-slate-100 overflow-hidden shrink-0">
                  <img 
                    src={deal.images?.[0] || 'https://images.unsplash.com/photo-1544148103-0773bf10d330'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={deal.title} 
                  />
                  
                  {/* Remove Button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); removeDeal(deal.id); }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-lg transition-all z-10 active:scale-90"
                    aria-label="Remove from saved"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="absolute top-4 left-4 flex gap-2">
                    {deal.is_hot && (
                      <span className="px-3 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg backdrop-blur-md">Hot</span>
                    )}
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                      {deal.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col grow">
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 line-clamp-1">
                      {deal.merchants?.business_name || "Premium Partner"}
                    </p>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight line-clamp-2">
                      {deal.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mb-6 mt-auto">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Slasham Price</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-emerald-600 leading-none">
                          ₦{deal.discount_price?.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400 line-through mb-0.5">
                          ₦{deal.original_price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/deals/${deal.id}`}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] group-hover:bg-emerald-500 group-hover:text-white transition-all active:scale-95"
                  >
                    <ShoppingBag size={16} /> View Deal
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
