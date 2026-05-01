import { Plus, Tag, Edit3, Image as ImageIcon, DollarSign, Calendar, Truck, Zap, Upload, Eye, CheckCircle2, XCircle, Clock, Building, MapPin, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { getLocationNames } from "../../utils/locations";
import { apiClient } from "../../api/client";

export default function MerchantCampaigns() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [isHotCoupon, setIsHotCoupon] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setMerchantProfile] = useState<any>(null);

  const fetchDeals = async () => {
    try {
      const [campaignsData, profileData] = await Promise.all([
        apiClient("/merchants/campaigns"), // ✅ fetch from campaign_requests
        apiClient("/merchants/my-profile")
      ]);

      setMerchantProfile(profileData);

      const mapped = campaignsData.map((d: any) => ({
        id: d.id,
        productName: d.title,
        productImage: d.image_url || "",
        originalPrice: `₦${Number(d.original_price).toLocaleString()}`,
        discountPrice: `₦${Number(d.discount_price).toLocaleString()}`,
        category: d.category,
        status: (d.status === 'APPROVED' && new Date(d.expiry_date) < new Date()) ? 'Expired'
               : d.status === 'PENDING' ? 'Pending'
               : d.status === 'APPROVED' ? 'Approved'
               : 'Rejected',
        location: profileData?.city || "Not set",
        totalQuantity: d.total_quantity,
        soldQuantity: d.sold_quantity || 0,
        description: d.description,
        dealExplanation: d.deal_explanation,
        expiryDate: d.expiry_date
      }));

      setRequests(mapped);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleToggleShipping = () => setShippingEnabled(!shippingEnabled);
  const handleToggleHot = () => setIsHotCoupon(!isHotCoupon);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setIsLoading(true);

    try {
      let imageUrl = previewImage;

      // 1. Upload image if selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("bucket", "deal-images");
        uploadData.append("image", selectedFile);
        const uploadRes = await apiClient("/upload/image", {
          method: "POST",
          body: uploadData,
          headers: {}, // Fetch will set multipart/form-data boundary
        });
        imageUrl = uploadRes.url;
      }

      // 2. Register campaign request for admin review
      await apiClient("/merchants/campaigns", {
        method: "POST",
        body: JSON.stringify({
          title: formData.get('productName') as string,
          description: formData.get('description') as string,
          deal_explanation: formData.get('dealExplanation') as string,
          category: formData.get('category') as string,
          original_price: parseFloat(
            (formData.get('originalPrice') as string).replace(/[^0-9.]/g, '')
          ),
          discount_price: parseFloat(formData.get('discountPrice') as string || "500"),
          total_quantity: parseInt(formData.get('totalQuantity') as string),
          expiry_date: formData.get('expiryDate') as string,
          is_hot: isHotCoupon,
          image_url: imageUrl || (formData.get('imageUrl') as string) || null,
        }),
      });

      setIsModalOpen(false);
      setPreviewImage(null);
      setSelectedFile(null);
      fetchDeals();
    } catch (error: any) {
      alert(`Failed to save deal: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">My Deals</h1>
          <p className="text-slate-500 font-medium">Manage your active products and register new offers for the marketplace.</p>
        </div>
        <button 
          onClick={() => {
            setEditingRequest(null);
            setPreviewImage(null);
            setShippingEnabled(false);
            setIsHotCoupon(false);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={18} /> Register New Deal
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              filter === f ? 'bg-emerald-500 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
            }`}
          >
            {f} Deals
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.filter(r => filter === "All" || r.status === filter).map((req) => (
          <div key={req.id} className="bg-white rounded-4xl border border-slate-100 p-8 shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-48 h-32 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 shrink-0 bg-slate-50 flex items-center justify-center">
                <img src={req.productImage} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt="" />
              </div>
              
              <div className="flex-1 space-y-2">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">{req.category}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{req.location}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code: {req.id}</span>
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {req.companyName ? `${req.companyName} - ${req.productName}` : req.productName}
                 </h2>
                 <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><DollarSign size={14}/> Market: {req.originalPrice}</span>
                    <span className="flex items-center gap-1.5 text-emerald-600"><DollarSign size={14}/> Slasham: {req.discountPrice}</span>
                    <span className="flex items-center gap-1.5 text-indigo-500"><Truck size={14}/> {req.shippingInfo?.enabled ? 'Delivery Offered' : 'Self-Pickup'}</span>
                    {req.isHotCoupon && <span className="flex items-center gap-1.5 text-yellow-600"><Zap size={14} className="fill-yellow-500"/> Hot Coupon</span>}
                 </div>
              </div>

              <div className="flex items-center gap-12 shrink-0 pr-4">
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                    <div className="flex items-center gap-2 justify-end">
                       {req.status === 'Approved' ? <CheckCircle2 className="text-emerald-500" size={18} /> : 
                        req.status === 'Rejected' ? <XCircle className="text-rose-500" size={18} /> : 
                        req.status === 'Expired' ? <Clock className="text-slate-400" size={18} /> :
                        <Clock className="text-yellow-500" size={18} />}
                       <span className={`text-[11px] font-black uppercase tracking-widest ${
                          req.status === 'Approved' ? 'text-emerald-600' : 
                          req.status === 'Rejected' ? 'text-rose-600' : 
                          req.status === 'Expired' ? 'text-slate-400' : 'text-yellow-600'
                       }`}>{req.status}</span>
                    </div>
                 </div>
                 
                 <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (req.status !== "Pending") return;
                        setEditingRequest(req);
                        setPreviewImage(req.productImage);
                        setShippingEnabled(req.shippingInfo?.enabled || false);
                        setIsHotCoupon(req.isHotCoupon || false);
                        setIsModalOpen(true);
                      }}
                      disabled={req.status !== "Pending"}
                      className={`p-4 rounded-2xl shadow-sm transition-all active:scale-95 ${
                        req.status === "Pending" 
                        ? "bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white cursor-pointer" 
                        : "bg-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                      }`}
                      title={req.status !== "Pending" ? "Approved deals cannot be edited" : "Edit Deal"}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => window.open(`/deals/${req.id}`, '_blank')}
                      className="p-4 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                      title="View Live Deal"
                    >
                      <Eye size={18} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRequest ? "Change Deal Details" : "Register New Deal"}
        description="Share your product with the Slasham community and grow your customer base."
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-6 mb-8 overflow-y-auto max-h-[70vh] px-2 text-sm">
          <div className="space-y-4">
             {/* Core Branding */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Holding/Company Name</label>
                   <div className="relative">
                      <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="companyName" defaultValue={editingRequest?.companyName} placeholder="e.g. Come Again Foods" className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Product Name</label>
                   <input name="productName" defaultValue={editingRequest?.productName} required placeholder="e.g. Tapiokies Biscuit" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">City Node (Storefront Hub)</label>
                   <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select name="location" defaultValue={editingRequest?.location || "Lagos"} required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer">
                         {getLocationNames().map(name => <option key={name} value={name}>{name}</option>)}
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Redemption Address</label>
                    <input name="redeemAddress" defaultValue={editingRequest?.redeemAddress || editingRequest?.address} required placeholder="Physical Store Address" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Deal Explanation (Yellow Text)</label>
                    <input name="dealExplanation" defaultValue={editingRequest?.dealExplanation} placeholder="e.g. You must buy two (2) cartons to activate" className="w-full px-5 py-4 bg-amber-50 border border-amber-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500 outline-none text-amber-700" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Market Category</label>
                    <div className="relative">
                        <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select name="category" defaultValue={editingRequest?.category} required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer">
                            <option value="Dining">Dining & Food</option>
                            <option value="Wellness">Beauty & Wellness</option>
                            <option value="Nightlife">Nightlife & Drinks</option>
                            <option value="Events">Events & Fun</option>
                            <option value="Goods">Goods & Shopping</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Slasham Discounted Price</label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input name="discountPrice" type="number" defaultValue={editingRequest?.discountPrice} required placeholder="e.g. 7000" className="w-full pl-12 pr-5 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-emerald-700" />
                    </div>
                </div>
             </div>

             {/* Media Gateway */}
             <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-1">Product Media (Full Display)</label>
                   {previewImage && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Preview Optimized</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <div className="relative">
                         <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input name="imageUrl" defaultValue={editingRequest?.productImage} placeholder="Image URL (Alternative)" className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                   </div>
                   <div className="relative">
                      <input type="file" id="merchantImageUpload" onChange={handleImageChange} className="hidden" accept="image/*" />
                      <label htmlFor="merchantImageUpload" className="w-full h-full flex items-center justify-center gap-3 px-5 py-4 bg-emerald-100 border-2 border-dashed border-emerald-300 text-emerald-700 rounded-2xl font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-emerald-200 transition-all">
                         <Upload size={18} /> {previewImage ? "Update Photo" : "Upload High-Res Photo"}
                      </label>
                   </div>
                </div>
                {previewImage && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-white flex items-center justify-center">
                        <img src={previewImage} className="w-full h-full object-contain" />
                    </div>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Regular Market Price</label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input name="originalPrice" defaultValue={editingRequest?.originalPrice} placeholder="₦25,000" required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Deal Expiry Date</label>
                    <div className="relative">
                       <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input type="date" name="expiryDate" defaultValue={editingRequest?.expiryDate} required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Total Quantity Available</label>
                    <div className="relative">
                       <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input type="number" name="totalQuantity" min="1" defaultValue={editingRequest?.totalQuantity || 100} required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                </div>
             </div>

             <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Zap size={20} className={isHotCoupon ? "text-yellow-500 fill-yellow-500" : "text-slate-300"} />
                      <div>
                         <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Hot Deal Status</p>
                         <p className="text-[10px] text-slate-400 font-medium">Request top placement for this offer</p>
                      </div>
                   </div>
                   <button 
                      type="button"
                      onClick={handleToggleHot}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isHotCoupon ? 'bg-yellow-400' : 'bg-slate-200'}`}
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
                            <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Logistics (Shipping)</p>
                            <p className="text-[10px] text-slate-400 font-medium">Charge for delivery if applicable</p>
                         </div>
                      </div>
                      <button 
                         type="button"
                         onClick={handleToggleShipping}
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
                              <label className="text-[8px] font-black uppercase text-indigo-600 px-1">Shipping Fee</label>
                              <input name="shippingFee" defaultValue={editingRequest?.shippingInfo?.fee || "2000"} placeholder="₦2,000" className="w-full px-4 py-3 bg-white border border-indigo-100 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-indigo-600 px-1">Shipping Terms</label>
                              <input name="shippingNote" defaultValue={editingRequest?.shippingInfo?.note || ""} placeholder="Terms for delivery..." className="w-full px-4 py-3 bg-white border border-indigo-100 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Deal Description</label>
                <textarea name="description" defaultValue={editingRequest?.description} required placeholder="Briefly describe what users get with this deal..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold min-h-[100px] outline-none focus:ring-2 focus:ring-emerald-500" />
             </div>
          </div>

          <div className="flex gap-4 pt-6 pb-4">
             <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancel</button>
             <button 
               type="submit" 
               disabled={isLoading}
               className={`flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70' : ''}`}
             >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} /> 
                    Processing...
                  </>
                ) : (
                  editingRequest ? "Update Deal" : "Register Deal"
                )}
             </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

