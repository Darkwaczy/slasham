import { useState } from "react";
import { 
  Heart, ShoppingBag, User, TrendingUp, Clock, ChevronRight, 
  Settings, Bell, CreditCard, Gift, ShieldCheck, Zap, 
  Plus, Star, Filter, Search, Grid, List as ListIcon,
  Crown, ArrowUpRight, Share2, Trash2, CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Flash sale!', message: 'Pizza Hut 50% off ends in 2 hours.', time: '10m ago', read: false },
    { id: 2, title: 'Voucher used', message: 'Your spa session voucher has been redeemed.', time: '2h ago', read: true },
  ]);

  const user = { 
    name: "John Doe", 
    email: "john.doe@example.com", 
    plan: "Standard", 
    memberSince: "Jan 2026",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff",
    points: 1250,
    savings: "₦24,500"
  };

  const wishlist = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    title: ["Gourmet Burger Express", "Ocean View Spa", "Elite Cinema Pass", "Adventure Park"][i % 4],
    merchant: ["Burger King", "Azure Wellness", "Silverbird", "Zuma Rock"][i % 4],
    price: ["₦4,500", "₦12,000", "₦3,000", "₦15,000"][i % 4],
    discount: ["40%", "25%", "50%", "15%"][i % 4],
    image: `https://picsum.photos/seed/${i + 50}/400/300`
  }));

  const vouchers = [
    { id: 1, title: "Half-Pound Burger Deal", merchant: "Burger King", code: "SLSH-BUR-101", expiry: "2026-04-12", status: "Active" },
    { id: 2, title: "Full Body Massage", merchant: "Azure Wellness", code: "SLSH-SPA-882", expiry: "2026-03-30", status: "Active" },
    { id: 3, title: "Cinema Weekend Pass", merchant: "Silverbird", code: "SLSH-MOV-441", expiry: "2026-03-25", status: "Expired" },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={18} /> },
    { id: 'vouchers', label: 'My Vouchers', icon: <ShoppingBag size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
    { id: 'history', label: 'Activity', icon: <Clock size={18} /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell size={18} />, count: notifications.filter(n => !n.read).length },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Space */}
      <div className="pt-24 pb-8 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Console</h1>
            <p className="text-slate-500 font-medium">Manage your deals, savings, and preferences</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setShowUpgradeModal(true)}
               className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20"
             >
               <Crown size={18} className="text-amber-400" /> 
               Upgrade to Plus
             </button>
             <button className="bg-white border border-slate-200 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
               <Share2 size={18} className="text-slate-600" />
             </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-hide mb-8 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative shrink-0 ${
                activeTab === tab.id ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count && tab.count > 0 && (
                <span className="w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-4xlrder border-slate-200/60 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <ShieldCheck size={120} />
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-md" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle2 size={14} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{user.name}</h3>
                <p className="text-sm text-slate-500 mb-6">{user.email}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Points</p>
                    <p className="text-lg font-black text-slate-900">{user.points}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] uppercase tracking-widest font-black text-emerald-600/60 mb-1">Saved</p>
                    <p className="text-lg font-black text-emerald-600">{user.savings}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600 p-6 rounded-4xl text-white relative overflow-hidden group">
               <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <Zap className="text-amber-300 mb-4" size={32} />
               <h4 className="text-lg font-black mb-2 leading-tight text-balance">Slasham Plus+ is now better.</h4>
               <p className="text-sm text-emerald-100 mb-4 font-medium">Get 10% extra cashback on every voucher purchase.</p>
               <button className="w-full py-3 bg-white text-emerald-600 rounded-xl font-black text-sm hover:bg-emerald-50 transition-colors shadow-lg">
                 Learn Benefits
               </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
               {activeTab === 'overview' && (
                 <motion.div 
                   key="overview"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-8"
                 >
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-8 rounded-4xl border border-slate-200/60 shadow-sm">
                         <div className="flex items-center justify-between mb-6">
                           <h4 className="font-black text-lg">Active Vouchers</h4>
                           <ShoppingBag className="text-blue-500" />
                         </div>
                         <div className="space-y-4">
                            {vouchers.slice(0, 2).map(v => (
                              <div key={v.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <TrendingUp size={18} className="text-emerald-500" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{v.title}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">EXP: {v.expiry}</p>
                                  </div>
                                </div>
                                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
                              </div>
                            ))}
                            <button onClick={() => setActiveTab('vouchers')} className="w-full py-3 text-center text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                              View all vouchers
                            </button>
                         </div>
                      </div>

                      <div className="bg-white p-8 rounded-4xl border border-slate-200/60 shadow-sm">
                         <div className="flex items-center justify-between mb-6">
                           <h4 className="font-black text-lg">Quick Access</h4>
                           <Zap className="text-amber-500" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: 'Referrals', icon: <Share2 />, color: 'bg-indigo-50 text-indigo-600' },
                              { label: 'Redeem', icon: <ShieldCheck />, color: 'bg-emerald-50 text-emerald-600' },
                              { label: 'Gift Cards', icon: <Gift />, color: 'bg-rose-50 text-rose-600' },
                              { label: 'Payment', icon: <CreditCard />, color: 'bg-amber-50 text-amber-600' },
                            ].map((item, i) => (
                              <button key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 group">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${item.color}`}>
                                  {item.icon}
                                </div>
                                <span className="text-sm font-bold text-slate-700">{item.label}</span>
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Recommended Horizontal Scroll */}
                   <div>
                     <div className="flex items-center justify-between mb-6">
                        <h4 className="font-black text-xl">Deals for you</h4>
                        <Link to="/deals" className="text-emerald-600 font-bold text-sm flex items-center gap-1 group">
                          Explore More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                     <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-2 px-2">
                        {wishlist.slice(0, 4).map((item) => (
                          <div key={item.id} className="min-w-[280px] bg-white rounded-4xl border border-slate-200/60 shadow-sm p-4 group cursor-pointer hover:shadow-xl transition-all">
                             <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-emerald-600 shadow-sm uppercase tracking-widest">
                                  {item.discount} OFF
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{item.merchant}</p>
                             <h5 className="font-black text-slate-900 mb-2 truncate">{item.title}</h5>
                             <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-slate-900">{item.price}</span>
                                <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-colors">
                                  <Plus size={18} />
                                </button>
                             </div>
                          </div>
                        ))}
                     </div>
                   </div>
                 </motion.div>
               )}

               {activeTab === 'wishlist' && (
                 <motion.div 
                   key="wishlist"
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="space-y-6"
                 >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                       <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex-1 max-w-md">
                          <Search size={18} className="text-slate-400" />
                          <input type="text" placeholder="Search your wishlist..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="flex items-center p-1 bg-slate-50 rounded-xl border border-slate-100">
                             <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}><Grid size={18} /></button>
                             <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}><ListIcon size={18} /></button>
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-slate-500/20">
                             <Filter size={16} /> Filter
                          </button>
                       </div>
                    </div>

                    <div className={viewMode === 'grid' ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                       {wishlist.map((item) => (
                         <div key={item.id} className={`bg-white rounded-4xlrder border-slate-200/60 shadow-sm overflow-hidden group hover:shadow-xl transition-all ${viewMode === 'list' ? 'flex items-center p-4' : 'flex flex-col'}`}>
                            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-24 h-24 rounded-2xl shrink-0' : 'h-48'}`}>
                               <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                               {viewMode === 'grid' && (
                                 <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-md">
                                    <Trash2 size={18} />
                                 </button>
                               )}
                            </div>
                            <div className={viewMode === 'list' ? "ml-6 flex-1 flex items-center justify-between" : "p-6"}>
                               <div>
                                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{item.merchant}</p>
                                  <h5 className="font-black text-slate-900 mb-2">{item.title}</h5>
                                  <div className="flex items-center gap-4">
                                     <span className="text-xl font-black text-slate-900">{item.price}</span>
                                     <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{item.discount} OFF</span>
                                  </div>
                               </div>
                               {viewMode === 'list' ? (
                                 <div className="flex items-center gap-3">
                                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"><Trash2 size={20} /></button>
                                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 transition-colors shadow-lg">Buy Now</button>
                                 </div>
                               ) : (
                                 <div className="grid grid-cols-1 gap-2 mt-6">
                                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20">
                                      Unlock Coupon
                                    </button>
                                 </div>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'notifications' && (
                 <motion.div 
                   key="notifications"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="space-y-4"
                 >
                    {notifications.map(n => (
                      <div key={n.id} className={`p-6 rounded-4xl border transition-all flex items-start justify-between group ${n.read ? 'bg-white border-slate-100 opacity-60' : 'bg-emerald-50 border-emerald-100'}`}>
                         <div className="flex gap-4">
                            <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${n.read ? 'bg-white text-slate-400' : 'bg-white text-emerald-500'}`}>
                               <Bell size={20} />
                            </div>
                            <div>
                               <h5 className="font-black text-slate-900 mb-1">{n.title}</h5>
                               <p className="text-sm font-medium text-slate-500 mb-2">{n.message}</p>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.time}</span>
                            </div>
                         </div>
                         <div className="flex flex-col gap-2">
                            {!n.read && <button className="p-2 bg-white rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm"><CheckCircle2 size={16} /></button>}
                            <button className="p-2 opacity-0 group-hover:opacity-100 bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-all shadow-sm"><Trash2 size={16} /></button>
                         </div>
                      </div>
                    ))}
                 </motion.div>
               )}

               {['settings', 'history', 'vouchers'].includes(activeTab) && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100"
                 >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                       <Clock size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2">Syncing Data...</h4>
                    <p className="text-slate-500 max-w-xs text-center font-medium">We're retrieving your {activeTab} information. Your connection is secure.</p>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Upgrade Modal Simulation */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-100"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white z-101 rounded-[3rem] shadow-2xl overflow-hidden p-8"
            >
               <button onClick={() => setShowUpgradeModal(false)} className="absolute top-6 right-6 p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors"><X size={24} /></button>
               
               <div className="text-center mt-4">
                  <div className="w-20 h-20 bg-amber-50 rounded-4xl flex items-center justify-center text-amber-500 mx-auto mb-6">
                    <Crown size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Level Up to Slasham Plus</h3>
                  <p className="text-slate-500 mb-8 font-medium">Join 50,000+ elite members saving bigger daily.</p>
               </div>

               <div className="space-y-4 mb-8">
                  {[
                    { title: "Priority Support", desc: "Instant help from our concierge team", icon: <ShieldCheck className="text-emerald-500" /> },
                    { title: "Exclusive Plus Deals", desc: "Up to 80% off on premium venues", icon: <Star className="text-amber-500" /> },
                    { title: "Zero Purchase Fees", desc: "Pay only for the discount, nothing more", icon: <Zap className="text-indigo-500" /> },
                    { title: "Cashback Boost", desc: "Earn 15% back in Slasham points", icon: <TrendingUp className="text-emerald-500" /> }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all cursor-default">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                         {benefit.icon}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 leading-none mb-1">{benefit.title}</p>
                          <p className="text-xs text-slate-500 font-medium">{benefit.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <button className="w-full py-5 bg-emerald-600 text-white rounded-4xl font-black text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]">
                 Unlock Plus for ₦2,500/mo
               </button>
               <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6">Cancel anytime • Secure checkout</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
