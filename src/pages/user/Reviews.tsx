import { 
  Star, MessageSquare, Image as ImageIcon, 
  Send, ShieldCheck, Quote 
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { getUserReviews, saveUserReviews } from "../../utils/userPersistence";

export default function UserReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState("0.0");

  useEffect(() => {
    const load = () => {
      const dbReviews = getUserReviews();
      setReviews(dbReviews);
      
      const published = dbReviews.filter((r: any) => r.status === 'Published');
      if (published.length > 0) {
        const sum = published.reduce((acc: number, r: any) => acc + r.rating, 0);
        setAvgRating((sum / published.length).toFixed(1));
      } else {
        setAvgRating("0.0");
      }
    };
    load();
    window.addEventListener('userDataUpdate', load);
    return () => window.removeEventListener('userDataUpdate', load);
  }, []);

  const handleAddNewReview = () => {
    const reviewText = window.prompt("Write your review:");
    if (!reviewText) return;
    
    const newRev = {
      id: Date.now(),
      title: "New Review Experience",
      merchant: "Verified Partner",
      rating: 5,
      status: "Published",
      text: reviewText,
      date: "Just now",
      response: null
    };
    
    const updated = [newRev, ...reviews];
    setReviews(updated);
    saveUserReviews(updated);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
             <MessageSquare size={12} fill="currentColor" />
             Personal Feedback
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Your Reviews</h1>
           <p className="text-slate-500 font-medium mt-2">Share your experiences and earn points for every feedback.</p>
        </div>
        
        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center font-black text-xl">
              {avgRating}
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg. Rating</p>
              <div className="flex gap-0.5">
                 {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} fill={s <= parseFloat(avgRating) ? "#fbbf24" : "none"} className={s <= parseFloat(avgRating) ? "text-amber-400" : "text-slate-200"} />
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid gap-8">
        {reviews.map((review, idx) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative group ${review.status === 'Flagged' ? 'bg-slate-50' : ''}`}
          >
            <div className="p-8 md:p-10 space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm group-hover:bg-amber-400 group-hover:text-amber-950 transition-all">
                        <Quote size={20} />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{review.title}</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">{review.merchant}</p>
                     </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-1.5">
                     <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                           <Star key={s} size={16} fill={s <= review.rating ? "#fbbf24" : "none"} className={s <= review.rating ? "text-amber-400" : "text-slate-200"} />
                        ))}
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{review.date}</p>
                  </div>
               </div>

               <p className="text-slate-700 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 py-1">"{review.text}"</p>

               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                     <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        review.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                     }`}>
                        {review.status}
                     </span>
                     <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Edit Feedback</button>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all" title="Add Photo">
                        <ImageIcon size={18} />
                     </button>
                     <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-xl transition-all" title="Share Experience">
                        <Send size={18} />
                     </button>
                  </div>
               </div>

               {/* Merchant Response */}
               {review.response && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 mt-4 relative"
                  >
                     <div className="absolute top-0 left-8 w-4 h-4 bg-emerald-50 rotate-45 -translate-y-2 border-l border-t border-emerald-100" />
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/10">
                           <ShieldCheck size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-1">Merchant Response</p>
                           <p className="text-sm font-bold text-emerald-700 leading-relaxed italic">{review.response}</p>
                        </div>
                     </div>
                  </motion.div>
               )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
               <h3 className="text-3xl font-black mb-2 tracking-tight">Write more, earn more!</h3>
               <p className="text-slate-400 font-medium">Earn <span className="text-emerald-400 font-black tracking-tight">20 pts</span> for every verified review you submit this week.</p>
            </div>
            <button 
              onClick={handleAddNewReview}
              className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
               Start A New Review
            </button>
         </div>
      </div>
    </div>
  );
}
