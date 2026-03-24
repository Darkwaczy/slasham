import { Ticket, Plus, Search, Target, Eye, Store, Tag, MapPin, Info, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { saveCampaignRequest, getCampaignRequests, CampaignRequest } from "../../utils/merchantPersistence";

export default function MerchantCampaigns() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const merchantId = "M-99"; // Mock current merchant

  useEffect(() => {
    const loadRequests = () => {
      setRequests(getCampaignRequests().filter(r => r.merchantId === merchantId));
    };
    loadRequests();
    window.addEventListener('campaignRequestsUpdate', loadRequests);
    return () => window.removeEventListener('campaignRequestsUpdate', loadRequests);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    saveCampaignRequest({
      merchantId,
      businessName: formData.get('businessName') as string,
      productName: formData.get('productName') as string,
      productImage: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1540555700478-4be289fbecef' : '1604329760661-e71dc83f8f26'}?w=400`,
      originalPrice: formData.get('originalPrice') as string,
      dealPrice: formData.get('dealPrice') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      couponType: formData.get('couponType') as any,
    });

    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved': return <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100"><CheckCircle2 size={12}/> Approved</span>;
      case 'Rejected': return <span className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100"><XCircle size={12}/> Rejected</span>;
      default: return <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100"><Clock size={12}/> Admin Review</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Campaign Management</h1>
          <p className="text-slate-500 font-medium">Create and track your business offers across the network</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={18} /> Launch New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-emerald-600/5">
                 <Target size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Trials</span>
           </div>
           <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{requests.filter(r => r.status === 'Approved').length}</p>
           <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-100 rounded-full blur-3xl opacity-20" />
        </div>
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/5">
                 <Eye size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reach</span>
           </div>
           <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">0</p>
           <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-20" />
        </div>
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-purple-600/5">
                 <Ticket size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Submissions</span>
           </div>
           <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{requests.filter(r => r.status === 'Pending').length}</p>
           <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-100 rounded-full blur-3xl opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mt-8">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Campaign History</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Lifecycle of your business offers</p>
           </div>
           <div className="relative w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Filter submissions..." className="w-full sm:w-64 pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
           </div>
        </div>
        
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Offer Overview</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Submission Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Admin Note</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                      No campaigns submitted yet. Click "Launch New Campaign" to start.
                    </td>
                  </tr>
                ) : (
                  requests.map((r, idx) => (
                    <motion.tr 
                      key={r.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden shadow-sm shrink-0">
                              <img src={r.productImage} alt={r.productName} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900 leading-tight mb-1">{r.productName}</span>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.couponType} • {r.dealPrice}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <p className="text-sm font-bold text-slate-600">{new Date(r.submittedAt).toLocaleDateString()}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{r.id}</p>
                      </td>
                      <td className="px-8 py-6 text-center font-medium text-slate-500 max-w-[200px] truncate">
                        {r.adminNote || <span className="text-slate-300 italic">No notes from admin yet</span>}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(r.status)}
                          {r.status === 'Pending' && <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Wait: 2-3 Business Hours</p>}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* New Campaign Request Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Artifact Submission"
        description="Fill all mandatory parameters to submit your deal for global verification."
      >
        <form onSubmit={handleSubmit} className="space-y-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Business Info */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Store size={12} /> Merchant Profile
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Business Identity</label>
                  <input name="businessName" placeholder="Orchid Bistro" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Location / Store Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input name="address" placeholder="12, Mobolaji Bank Anthony Way, Ikeja" required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Official Email</label>
                      <input name="email" type="email" placeholder="ops@orchid.com" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Phone Protocol</label>
                      <input name="phone" placeholder="+234-XXX-XXX" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                   </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Tag size={12} /> Campaign Metadata
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Product Designation</label>
                  <input name="productName" placeholder="Sunday Brunch & Mocktails" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Normal Price</label>
                      <input name="originalPrice" placeholder="₦25,000" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Slasham Price</label>
                      <input name="dealPrice" placeholder="₦12,500" required className="w-full px-5 py-4 bg-white/50 border-2 border-dashed border-emerald-200 rounded-2xl text-sm font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Category</label>
                      <select name="category" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none">
                         <option>Dining</option>
                         <option>Wellness</option>
                         <option>Events</option>
                         <option>Products</option>
                         <option>Services</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Coupon Structure</label>
                      <select name="couponType" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none">
                         <option>Discount</option>
                         <option>Voucher</option>
                         <option>BOGO</option>
                         <option>Stay</option>
                      </select>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Marketing Brief / About Product</label>
             <textarea name="description" placeholder="A brief but compelling description of what shoppers get..." required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[120px]" />
          </div>

          <div className="p-6 bg-amber-50 rounded-4xl border border-amber-100 flex items-start gap-4">
             <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500 shrink-0">
                <Info size={20} />
             </div>
             <div>
                <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Administrative Note</p>
                <p className="text-xs text-slate-500 font-medium">Upon submission, your campaign will enter our internal verification block. Admin will review the pricing and imagery logic before launching it to the storefront. You will be notified via the Intelligence Console.</p>
             </div>
          </div>

          <div className="flex gap-4 pt-4 pb-8">
             <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]">Cancel Submission</button>
             <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-900/10 uppercase tracking-[0.2em] text-[10px]">Execute Deployment</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
