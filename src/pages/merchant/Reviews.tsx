import { Star, Quote } from "lucide-react";
import { motion } from "motion/react";

const reviews = [
  { id: "REV-10", user: "John D.", rating: 5, comment: "Amazing experience, very fast service!", date: "1 hour ago", status: "New" },
  { id: "REV-11", user: "Sarah S.", rating: 4, comment: "It was good but a bit expensive.", date: "4 hours ago", status: "Replied" },
  { id: "REV-12", user: "Mike J.", rating: 2, comment: "Pizza was cold and delivery took too long.", date: "Yesterday", status: "Needs Attention" },
  { id: "REV-13", user: "Emily B.", rating: 5, comment: "Best steak in town!", date: "2 days ago", status: "Replied" },
];

export default function MerchantReviews() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Public Feedback</h1>
          <p className="text-slate-500 font-medium">Manage and respond to customer reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {reviews.map((r, idx) => (
           <motion.div 
             key={r.id}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: idx * 0.1 }}
             className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
           >
             <div className="absolute top-8 right-8 text-emerald-100 rotate-12 group-hover:rotate-0 transition-transform">
                <Quote size={40} />
             </div>
             
             <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                   {r.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                   <h4 className="font-black text-slate-900 leading-none">{r.user}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{r.date}</p>
                </div>
             </div>

             <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                   <Star key={i} size={14} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                ))}
             </div>

             <p className="text-sm text-slate-600 font-medium leading-relaxed mb-8 relative z-10 italic">"{r.comment}"</p>

             <div className="flex items-center justify-between relative z-10">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  r.status === 'New' ? 'bg-emerald-50 text-emerald-600 outline outline-1 outline-emerald-500/20 shadow-sm shadow-emerald-500/10' : 
                  r.status === 'Needs Attention' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
                }`}>
                   {r.status}
                </span>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 underline decoration-indigo-500/20 underline-offset-4">Respond</button>
             </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
