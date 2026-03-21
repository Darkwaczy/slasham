import { Star, ShieldAlert, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const reviews = [
  { id: "REV-10", user: "John D.", merchant: "Zaza Lounge", rating: 5, comment: "Amazing experience, very fast service!", date: "1 hour ago", status: "Published" },
  { id: "REV-11", user: "Sarah S.", merchant: "Oasis Spa", rating: 4, comment: "It was good but a bit expensive.", date: "4 hours ago", status: "Published" },
  { id: "REV-12", user: "Mike J.", merchant: "Pizza Hut", rating: 2, comment: "Pizza was cold and delivery took too long.", date: "Yesterday", status: "Flagged" },
  { id: "REV-13", user: "Emily B.", merchant: "Lagos Grill", rating: 5, comment: "Best steak in town!", date: "2 days ago", status: "Published" },
];

export default function AdminReviews() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review Moderation</h1>
          <p className="text-slate-500 font-medium">Monitor and manage customer feedback</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Reviewer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rating & Comment</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reviews.map((r, idx) => (
                <motion.tr 
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-5 text-sm font-bold text-slate-900">{r.user}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{r.merchant}</td>
                  <td className="px-8 py-5 py-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"} />
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 font-medium max-w-md leading-relaxed">"{r.comment}"</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{r.date}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      r.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {r.status === 'Published' ? <CheckCircle size={10} /> : <ShieldAlert size={10} />}
                      {r.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
