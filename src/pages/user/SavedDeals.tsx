import { useState } from "react";
import { 
  Heart, Clock, Trash2, ArrowRight, 
  LayoutGrid, List, Search, 
  ArrowUpDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function SavedDeals() {
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchQuery, setSearchQuery] = useState("");

  const deals = [
    { 
      id: 1, 
      title: "Luxury Hotel Stay", 
      merchant: "The Wheatbaker",
      price: "₦50,000", 
      discount: "30% OFF",
      rating: "4.9",
      expiryDays: 5, 
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
    },
    { 
      id: 2, 
      title: "Gourmet Dinner", 
      merchant: "RSVP Lagos",
      price: "₦8,000", 
      discount: "15% OFF",
      rating: "4.8",
      expiryDays: 2, 
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
    },
    { 
      id: 3, 
      title: "Spa Morning", 
      merchant: "Oasis Spa",
      price: "₦12,000", 
      discount: "20% OFF",
      rating: "4.7",
      expiryDays: 12, 
      image: "https://images.unsplash.com/photo-1544161515-4ae6ce6ca606?w=400&h=300&fit=crop"
    },
    { 
      id: 4, 
      title: "Gym Membership", 
      merchant: "Urban Fit",
      price: "₦25,000", 
      discount: "10% OFF",
      rating: "4.6",
      expiryDays: 1, 
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
    },
  ];

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.merchant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full text-rose-600 text-[10px] font-black uppercase tracking-widest">
             <Heart size={12} fill="currentColor" />
             {deals.length} Saved Offers
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Your Wishlist</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
           {/* Search Box */}
           <div className="relative flex-1 xl:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Find in wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
              />
           </div>

           {/* Controls */}
           <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
             <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <LayoutGrid size={18} />
             </button>
             <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <List size={18} />
             </button>
           </div>
           
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
              <ArrowUpDown size={20} />
           </button>
           <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
              Share All
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            {filteredDeals.map((deal, i) => (
              <motion.div 
                layout
                key={deal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                   <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 bg-white/90 backdrop-blur text-rose-500 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                         <Trash2 size={16} />
                      </button>
                   </div>
                   <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                      <div className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg font-black text-[8px] uppercase tracking-widest shadow-lg">
                         {deal.discount}
                      </div>
                      <div className={`px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${deal.expiryDays <= 2 ? 'text-rose-500' : 'text-slate-500'}`}>
                         <Clock size={10} /> {deal.expiryDays}d left
                      </div>
                   </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col">
                   <div>
                      <h4 className="font-black text-slate-900 tracking-tight truncate leading-none mb-1 group-hover:text-emerald-600 transition-colors">{deal.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{deal.merchant}</p>
                   </div>
                   
                   <div className="flex items-center justify-between mt-auto">
                      <p className="text-xl font-black text-slate-950 tracking-tight">{deal.price}</p>
                      <button className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all">
                         <ArrowRight size={18} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredDeals.map((deal, i) => (
              <motion.div 
                layout
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-6 group hover:translate-x-2 transition-all hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                   <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                   <h4 className="font-black text-lg text-slate-900 tracking-tight truncate">{deal.title}</h4>
                   <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      <span>{deal.merchant}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                      <span className="text-emerald-600">{deal.discount}</span>
                   </div>
                </div>

                <div className="text-right flex items-center gap-8 px-6">
                   <div className="hidden md:block">
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{deal.price}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${deal.expiryDays <= 2 ? 'text-rose-500' : 'text-slate-400'}`}>{deal.expiryDays}d left</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                         <Trash2 size={18} />
                      </button>
                      <Link to={`/deal/${deal.id}`} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                         View Details
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Placeholder */}
      <div className="flex justify-center pt-10 border-t border-slate-50">
         <div className="flex gap-2">
            {[1, 2, 3].map((p) => (
               <button key={p} className={`w-10 h-10 rounded-xl font-black text-xs ${p === 1 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                  {p}
               </button>
            ))}
            <button className="px-4 py-2 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest">Next</button>
         </div>
      </div>
    </div>
  );
}
