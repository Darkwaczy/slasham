import { Star, Quote, RefreshCw, Send, MessageCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";

export default function MerchantReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    setIsRefreshing(true);
    try {
      const data = await apiClient("/merchants/my-reviews");
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient(`/merchants/reviews/${reviewId}/reply`, {
        method: "PATCH",
        body: JSON.stringify({ reply: replyText })
      });
      setReplyText("");
      setReplyingTo(null);
      await fetchReviews();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Public Feedback</h1>
          <p className="text-slate-500 font-medium">Manage and respond to customer reviews for your business.</p>
        </div>
        <button 
          onClick={fetchReviews}
          className={`p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-emerald-500 transition-all ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`}
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating Feedback Buffer...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100">
            <MessageCircle size={48} className="text-slate-100 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No reviews received yet. Your customers' voices will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {reviews.map((r, idx) => (
             <motion.div 
               key={r.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.05 }}
               className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl hover:shadow-emerald-500/5 transition-all flex flex-col"
             >
               <div className="absolute top-10 right-10 text-emerald-100 rotate-12 group-hover:rotate-0 transition-transform">
                  <Quote size={48} />
               </div>
               
               <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-500/20">
                     {r.users?.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                     <h4 className="font-black text-slate-900 leading-none text-base">{r.users?.name}</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        {new Date(r.created_at).toLocaleDateString()} • {r.deals?.title}
                     </p>
                  </div>
               </div>

               <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, i) => (
                     <Star key={i} size={16} className={i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"} />
                  ))}
               </div>

               <p className="text-sm text-slate-600 font-medium leading-relaxed mb-8 relative z-10 italic flex-1">"{r.comment || "No comment provided."}"</p>

               {r.reply ? (
                 <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <CheckCircle2 size={12} /> Your Response
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">"{r.reply}"</p>
                 </div>
               ) : (
                 <div className="mt-4">
                    {replyingTo === r.id ? (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                         <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your response..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all outline-none min-h-[100px]"
                         />
                         <div className="flex gap-2">
                            <button 
                               onClick={() => { setReplyingTo(null); setReplyText(""); }}
                               className="flex-1 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
                            >
                               Cancel
                            </button>
                            <button 
                               onClick={() => handleReply(r.id)}
                               disabled={isSubmitting}
                               className="flex-2 py-3 bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                            >
                               {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                               Post Reply
                            </button>
                         </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setReplyingTo(r.id)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                      >
                         <MessageCircle size={16} /> Respond to Customer
                      </button>
                    )}
                 </div>
               )}
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
}

