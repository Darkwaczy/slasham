import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Copy, Ticket, Clock, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getUserVouchers } from "../../utils/mockPersistence";

export default function MyCoupons() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [userVouchers, setUserVouchers] = useState<any[]>([]);

  useEffect(() => {
    const list = getUserVouchers();
    setUserVouchers(list);

    const handleUpdate = () => {
      setUserVouchers(getUserVouchers());
    };

    window.addEventListener('vouchersUpdate', handleUpdate);
    // Listen for storage changes from other tabs (e.g., Merchant Scanner)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'slasham_user_vouchers') {
        handleUpdate();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('vouchersUpdate', handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const staticCoupons = [
    { id: "S-8291", title: "RSVP Lagos Dinner", subtitle: "International Cuisine", code: "LGS-2026-X83", status: "Active", expiry: "Mar 25, 2026", color: "emerald", discount: "20% OFF", type: "Food" },
  ];

  const allCoupons = [...userVouchers, ...(userVouchers.length === 0 ? staticCoupons : [])];
  const filteredCoupons = allCoupons.filter(c => statusFilter === "All" || c.status === statusFilter);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4">
             <Ticket size={12} fill="currentColor" />
             Managed Vouchers
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Your Coupons</h1>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {["All", "Active", "Redeemed", "Expired"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                statusFilter === filter ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCoupons.map((coupon, i) => (
            <motion.div
              layout
              key={coupon.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className={`group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row relative ${coupon.status !== 'Active' ? 'opacity-70 contrast-75' : 'hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px] transition-all'}`}
            >
              <div className="p-8 md:p-10 flex-1 relative">
                 <div className="flex items-center gap-2 mb-4">
                    <span className={`w-2 h-2 rounded-full ${coupon.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{coupon.category || coupon.type}</span>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{coupon.title}</h3>
                 <p className="text-sm text-slate-500 font-medium mb-8 leading-none">{coupon.companyName || coupon.subtitle}</p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 w-fit">
                       <Clock size={14} className="animate-pulse" />
                       <span className="text-[11px] font-black uppercase tracking-tight">Voucher Expires on: {coupon.expiry || (coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "Mar 25, 2026")}</span>
                    </div>
                    {coupon.status === 'Active' && (
                       <div className="flex items-center gap-2 pt-2">
                          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs font-black text-slate-900 tracking-widest">
                             {coupon.code}
                          </div>
                          <button 
                            onClick={() => {
                                navigator.clipboard.writeText(coupon.code);
                                // Optional: toast or feedback
                            }}
                            className="p-2.5 bg-slate-900 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg" title="Copy Code">
                             <Copy size={14} />
                          </button>
                       </div>
                    )}
                 </div>
              </div>

              <div className="hidden md:flex flex-col justify-between items-center py-4 relative">
                 <div className="w-8 h-8 bg-slate-50 rounded-full border border-slate-100 -mt-10" />
                 <div className="h-full border-l-2 border-dashed border-slate-100 mx-4 my-2" />
                 <div className="w-8 h-8 bg-slate-50 rounded-full border border-slate-100 -mb-10" />
              </div>

              <div className={`p-8 md:p-10 md:w-48 flex flex-col items-center justify-center text-center gap-4 ${
                 coupon.color === 'emerald' || !coupon.color ? 'bg-emerald-50 text-emerald-600' :
                 coupon.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                 coupon.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
              }`}>
                 <span className="text-sm font-black uppercase tracking-widest">{coupon.status}</span>
                 <p className="text-2xl font-black tracking-tighter leading-none">{coupon.price || coupon.discount}</p>
                 
                 {coupon.status === 'Active' && (
                    <button className="mt-4 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                       <ArrowUpRight size={20} />
                    </button>
                 )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCoupons.length === 0 && (
         <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="py-20 flex flex-col items-center justify-center text-center space-y-4"
         >
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
               <Ticket size={40} />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">No {statusFilter.toLowerCase()} coupons</h3>
               <p className="text-slate-500 font-medium">Try changing your filter or browse new deals.</p>
            </div>
            <Link to="/deals" className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Explore Deals</Link>
         </motion.div>
      )}
    </div>
  );
}
