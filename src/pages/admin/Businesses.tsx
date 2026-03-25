import { Search, Plus, ShieldCheck, ShieldAlert, Trash2, Ticket, DollarSign, Image as ImageIcon, ChevronRight, Calendar, Tag, Truck, Zap, Upload, Building, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { getCampaignRequests, saveCampaignRequest, updateRequestStatus } from "../../utils/merchantPersistence";
import { addPersistentDeal } from "../../utils/mockPersistence";
import { getLocationNames } from "../../utils/locations";
import { getAdminBusinesses, saveAdminBusinesses } from "../../utils/adminPersistence";

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
        const staticBiz = getAdminBusinesses();
        const requests = getCampaignRequests();
        const requestBiz = requests.map(r => ({
          id: r.merchantId,
          name: r.businessName,
          owner: r.email?.split('@')[0] || "Owner",
          category: r.category,
          rating: 4.5,
          status: r.status === 'Approved' ? 'Verified' : 'Pending',
          deals: 1,
          city: r.location || r.address?.split(',').pop()?.trim() || "Lagos",
          email: r.email,
          address: r.address
        }));

        const combined = [...staticBiz];
        requestBiz.forEach((rb: any) => {
          if (!combined.some(b => b.name === rb.name)) {
            combined.push(rb);
          }
        });
        setBusinesses(combined);
        setIsLoading(false);
    };
    loadData();
    window.addEventListener('campaignRequestsUpdate', loadData);
    return () => window.removeEventListener('campaignRequestsUpdate', loadData);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isQuickDealModalOpen, setIsQuickDealModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [isHotCoupon, setIsHotCoupon] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = (b.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (b.owner || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleToggleVerify = (id: string) => {
    const updated = businesses.map(b => {
      if (b.id === id) {
        return { ...b, status: b.status === 'Verified' ? 'Pending' : 'Verified' };
      }
      return b;
    });
    setBusinesses(updated);
    
    // We only save to adminBusinesses, filtering out the dynamic mapped campaign requests to avoid bloat.
    const persistentBusinesses = updated.filter(b => b.id.startsWith('B-'));
    saveAdminBusinesses(persistentBusinesses);
    setIsActionModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteBiz = (id: string) => {
    const updated = businesses.filter(b => b.id !== id);
    setBusinesses(updated);
    
    const persistentBusinesses = updated.filter(b => b.id.startsWith('B-'));
    saveAdminBusinesses(persistentBusinesses);
    setIsActionModalOpen(false);
  };

  const handleCreateDirectDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBiz) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const productName = formData.get('productName') as string;
    const companyName = formData.get('companyName') as string;
    const slashamPrice = formData.get('slashamPrice') as string;
    const originalPrice = formData.get('originalPrice') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const redeemAddress = formData.get('redeemAddress') as string || selectedBiz.address;
    const unlockNote = formData.get('unlockNote') as string;
    const image = previewImage || formData.get('imageUrl') as string || `https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400`;

    // 1. Create a "Ghost" approved request for history
    const req = saveCampaignRequest({
      merchantId: selectedBiz.id,
      businessName: selectedBiz.name,
      companyName,
      productName,
      productImage: image,
      originalPrice,
      dealPrice: slashamPrice,
      category,
      description: formData.get('description') as string,
      address: redeemAddress,
      location,
      email: selectedBiz.email,
      phone: "+234-ADMIN-DIRECT",
      couponType: "Voucher",
      expiryDate: formData.get('expiryDate') as string,
      isHotCoupon,
      unlockNote,
      shippingInfo: {
          enabled: shippingEnabled,
          fee: formData.get('shippingFee') as string || "0",
          note: formData.get('shippingNote') as string || ""
      },
      redeemAddress
    });

    // 2. Mark it as approved immediately
    updateRequestStatus(req.id, 'Approved', 'Administrative bypass: Direct deployment authorized by Platform Ops.', slashamPrice);

    // 3. Add to live inventory
    addPersistentDeal({
        title: productName,
        companyName: companyName || selectedBiz.name,
        location: location,
        price: slashamPrice,
        original: originalPrice,
        image,
        category,
        tag: isHotCoupon ? "Hot Deal" : "Verified",
        description: formData.get('description') as string,
        validity: "Valid for 30 days. No booking required.",
        expiryDate: formData.get('expiryDate') as string,
        isHotCoupon,
        unlockNote,
        shippingInfo: {
            enabled: shippingEnabled,
            fee: formData.get('shippingFee') as string || "0",
            note: formData.get('shippingNote') as string || ""
        },
        redeemAddress
    });

    setIsQuickDealModalOpen(false);
    setIsActionModalOpen(false);
    setPreviewImage(null);
    setShippingEnabled(false);
    setIsHotCoupon(false);
    alert(`Success: Live deal launched for ${selectedBiz.name} in ${location}.`);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Business Partners</h1>
          <p className="text-slate-500 font-medium">Manage your verified marketplace partners and launch new deals.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/10 hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Partner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Partners", count: businesses.length, sub: `${businesses.filter(b => b.status ==='Pending').length} pending` },
          { label: "Active Partners", count: businesses.filter(b => b.status === 'Verified').length, sub: "Trusted network status" },
          { label: "Deal Velocity", count: "4.2d", sub: "Clearance time" },
          { label: "Success Rate", count: "98%", sub: "Order fulfillment" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mb-1">{stat.count}</p>
            <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Business Table */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/10">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search businesses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none"
            >
              <option value="All">All Categories</option>
              {Array.from(new Set(businesses.map(b => b.category))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Business Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredBusinesses.map((biz, idx) => (
                  <motion.tr 
                    key={biz.id || idx}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                          {(biz.name || "?").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 mb-0.5">{biz.name}</p>
                          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{biz.city} • {biz.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        {biz.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          biz.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                          {biz.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedBiz(biz);
                          setIsActionModalOpen(true);
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        Manage Business
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredBusinesses.length === 0 && (
              <div className="py-20 text-center text-slate-400">
                  <p className="text-sm font-bold uppercase tracking-widest">No matching partners found.</p>
              </div>
          )}
        </div>
      </div>

      {/* New Partner Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Partner"
        description="Initialize a new business identity in the Slasham network."
      >
        <div className="space-y-6 pt-6 mb-8 text-sm">
           <p className="text-slate-500 font-medium">Onboarding a new business requires manual verification of legal documents. Proceed with adding this business?</p>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsAddModalOpen(false)} className="py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancel</button>
              <button className="py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/10">Add Partner</button>
           </div>
        </div>
      </AdminModal>

      {/* Action/Manage Business Modal */}
      <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Manage Business Account"
        description={`Account controls for ${selectedBiz?.name}`}
      >
        <div className="space-y-4 pt-4 text-sm">
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-4xl border border-slate-100 mb-6">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl">
                   {selectedBiz?.name.charAt(0)}
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{selectedBiz?.name}</h3>
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-60">Verified Business Partner</span>
                </div>
             </div>
             {selectedBiz?.status === 'Verified' && <ShieldCheck size={32} className="text-emerald-500 opacity-50" />}
          </div>

          <div className="grid grid-cols-1 gap-3 pb-8">
            <button 
               onClick={() => setIsQuickDealModalOpen(true)}
               className="w-full flex items-center justify-between px-6 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 group"
            >
               <span className="flex items-center gap-3"><Ticket size={18} /> Launch New Live Deal</span>
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => handleToggleVerify(selectedBiz.id)}
              className="w-full flex items-center gap-4 px-6 py-5 bg-white border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ShieldAlert size={18} className="text-amber-500" /> Toggle Verification Status
            </button>

            <button 
              onClick={() => handleDeleteBiz(selectedBiz.id)}
              className="w-full flex items-center gap-4 px-6 py-5 bg-white border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
            >
              <Trash2 size={18} /> Remove Partner
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Launch Deal Modal */}
      <AdminModal
        isOpen={isQuickDealModalOpen}
        onClose={() => setIsQuickDealModalOpen(false)}
        title="Launch New Deal"
        description="Skip the manual approval gate and publish this deal directly to the global shop."
      >
        <form onSubmit={handleCreateDirectDeal} className="space-y-6 pt-6 mb-8 overflow-y-auto max-h-[70vh] px-2 text-sm">
          <div className="space-y-4">
             {/* Core Identity */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Holding Company Name</label>
                   <div className="relative">
                      <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="companyName" defaultValue={selectedBiz?.name} placeholder="e.g. Come Again Foods" className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Product Title</label>
                   <input name="productName" required placeholder="e.g. Tapiokies Cassava Biscuit" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Target City Node (Hub)</label>
                   <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select name="location" defaultValue={selectedBiz?.city || "Lagos"} required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                         {getLocationNames().map(name => <option key={name} value={name}>{name}</option>)}
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Redemption Address</label>
                   <input name="redeemAddress" defaultValue={selectedBiz?.address} required placeholder="Where will customers pick up this item?" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Market Category</label>
                    <div className="relative">
                        <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select name="category" required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                            <option value="Dining">Dining & Food</option>
                            <option value="Wellness">Beauty & Wellness</option>
                            <option value="Nightlife">Nightlife & Drinks</option>
                            <option value="Events">Events & Fun</option>
                            <option value="Goods">Goods & Shopping</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Unlock Note (Small text under %)</label>
                    <input name="unlockNote" placeholder="e.g. Pay small amount to unlock this 55% discount." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
             </div>

             {/* Images */}
             <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-1">Product Photo (Full View Rendering)</label>
                   {previewImage && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Photo Ready</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <div className="relative">
                         <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input name="imageUrl" placeholder="Image URL (Alternative)" className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                   </div>
                   <div className="relative">
                      <input type="file" id="imageUpload" onChange={handleImageChange} className="hidden" accept="image/*" />
                      <label htmlFor="imageUpload" className="w-full h-full flex items-center justify-center gap-3 px-5 py-4 bg-indigo-100 border-2 border-dashed border-indigo-300 text-indigo-700 rounded-2xl font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-indigo-200 transition-all">
                         <Upload size={18} /> {previewImage ? "Change Photo" : "Upload Full Photo"}
                      </label>
                   </div>
                </div>
                {previewImage && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-white flex items-center justify-center">
                        <img src={previewImage} className="w-full h-full object-contain" />
                    </div>
                )}
             </div>

             {/* Pricing & Scheduling */}
             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 px-1">Slasham Price</label>
                   <div className="relative">
                      <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input name="slashamPrice" required placeholder="4500" className="w-full pl-12 pr-5 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Market Price</label>
                   <input name="originalPrice" required placeholder="10000" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Expiry Date</label>
                   <div className="relative overflow-hidden">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input type="date" name="expiryDate" required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                </div>
             </div>

             {/* Hot Deals & Shipping */}
             <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Zap size={20} className={isHotCoupon ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
                      <div>
                         <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Recommended Deal</p>
                         <p className="text-[10px] text-slate-400 font-medium">Flag this as a best-seller in VIP zones</p>
                      </div>
                   </div>
                   <button 
                      type="button"
                      onClick={() => setIsHotCoupon(!isHotCoupon)}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isHotCoupon ? 'bg-amber-500' : 'bg-slate-200'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isHotCoupon ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>

                <div className="h-px bg-slate-200" />

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Truck size={20} className={shippingEnabled ? "text-indigo-600" : "text-slate-300"} />
                         <div>
                            <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Enable Shipping</p>
                            <p className="text-[10px] text-slate-400 font-medium">Add delivery logistics for this product</p>
                         </div>
                      </div>
                      <button 
                         type="button"
                         onClick={() => setShippingEnabled(!shippingEnabled)}
                         className={`w-12 h-6 rounded-full relative transition-all duration-300 ${shippingEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${shippingEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                   </div>

                   <AnimatePresence>
                      {shippingEnabled && (
                        <motion.div 
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           exit={{ opacity: 0, height: 0 }}
                           className="grid grid-cols-2 gap-4 pt-2"
                        >
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-indigo-600 px-1">Delivery Fee</label>
                              <input name="shippingFee" defaultValue="2000" placeholder="₦2,000" className="w-full px-4 py-3 bg-white border border-indigo-100 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-indigo-600 px-1">Shipping Terms</label>
                              <input name="shippingNote" placeholder="Free delivery in Lagos..." className="w-full px-4 py-3 bg-white border border-indigo-100 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Deal Details</label>
                <textarea name="description" required placeholder="Write a short pitch for this regular customer store..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500" />
             </div>
          </div>

          <div className="flex gap-4 pt-6 pb-4">
             <button type="button" onClick={() => setIsQuickDealModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">Cancel</button>
             <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Launch Deal</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
