import { Star, ShieldAlert, CheckCircle, Trash2, ShieldCheck, Flag, MoreHorizontal, User, Quote, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import AdminModal from "../../components/AdminModal";

const INITIAL_REVIEWS = [
  { id: "REV-10", user: "John D.", merchant: "Zaza Lounge", rating: 5, comment: "Amazing experience, very fast service!", date: "1 hour ago", status: "Published", sentiment: "Positive" },
  { id: "REV-11", user: "Sarah S.", merchant: "Oasis Spa", rating: 4, comment: "It was good but a bit expensive.", date: "4 hours ago", status: "Published", sentiment: "Neutral" },
  { id: "REV-12", user: "Mike J.", merchant: "Pizza Hut", rating: 2, comment: "Pizza was cold and delivery took too long.", date: "Yesterday", status: "Flagged", sentiment: "Negative" },
  { id: "REV-13", user: "Emily B.", merchant: "Lagos Grill", rating: 5, comment: "Best steak in town!", date: "2 days ago", status: "Published", sentiment: "Positive" },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setIsActionModalOpen(false);
  };

  const handleDeleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    setIsActionModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review Moderation</h1>
          <p className="text-slate-500 font-medium">Monitor and manage platform sentiment and feedback</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex -space-x-2 mr-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                        <User size={14} />
                    </div>
                ))}
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">+12 Pendings</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search comments or users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none hover:bg-slate-50 appearance-none"
             >
                <option value="All">All Feedbacks</option>
                <option value="Published">Published</option>
                <option value="Flagged">Flagged Only</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Reviewer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Merchant</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rating & Content</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredReviews.map((r, idx) => (
                  <motion.tr 
                    key={r.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => {
                        setSelectedReview(r);
                        setIsActionModalOpen(true);
                    }}
                  >
                    <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                                {r.user.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{r.user}</span>
                        </div>
                    </td>
                    <td className="px-8 py-5">
                        <span className="text-sm font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg italic">
                           {r.merchant}
                        </span>
                    </td>
                    <td className="px-8 py-5 py-6">
                      <div className="flex items-center justify-between gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"} />
                            ))}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                              r.sentiment === 'Positive' ? 'text-emerald-500 bg-emerald-50' : 
                              r.sentiment === 'Negative' ? 'text-rose-500 bg-rose-50' : 'text-slate-400 bg-slate-50'
                          }`}>
                            {r.sentiment} Sentiment
                          </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium max-w-md leading-relaxed line-clamp-2">"{r.comment}"</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{r.date}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        r.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                        {r.status === 'Published' ? <CheckCircle size={10} /> : <ShieldAlert size={10} />}
                        {r.status}
                        </span>
                        <div className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-300 group-hover:text-slate-600 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={16} />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredReviews.length === 0 && (
            <div className="py-20 text-center">
                <Quote size={48} className="text-slate-100 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No feedback artifacts matching search</p>
            </div>
          )}
        </div>
      </div>

       {/* Moderation Modal */}
       <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Moderation Console"
        description={selectedReview ? `Review Summary: ${selectedReview.id}` : ""}
      >
        <div className="space-y-6 pt-4">
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 italic relative text-slate-700 leading-relaxed text-lg font-medium">
                 <Quote className="absolute -top-4 -left-4 text-slate-200 fill-slate-200" size={48} />
                 "{selectedReview?.comment}"
                 <div className="mt-6 flex items-center justify-between">
                     <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < (selectedReview?.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"} />
                        ))}
                     </div>
                     <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{selectedReview?.user} • {selectedReview?.date}</span>
                 </div>
             </div>

             <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Moderation Directives</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedReview?.status !== 'Published' && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedReview.id, 'Published')}
                            className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-600/20 transition-all"
                        >
                            <ShieldCheck size={20} /> Approve Feedback
                        </button>
                    )}
                    {selectedReview?.status !== 'Flagged' && (
                        <button 
                            onClick={() => handleUpdateStatus(selectedReview.id, 'Flagged')}
                            className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl font-bold hover:bg-amber-100 transition-all"
                        >
                            <Flag size={20} /> Flag for Toxic Content
                        </button>
                    )}
                    <button className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                        <User size={20} /> Inspect Reviewer
                    </button>
                    <button 
                        onClick={() => handleDeleteReview(selectedReview.id)}
                        className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold hover:bg-rose-100 transition-all"
                    >
                        <Trash2 size={20} /> Force Deletion
                    </button>
                 </div>
             </div>
        </div>
      </AdminModal>
    </div>
  );
}
