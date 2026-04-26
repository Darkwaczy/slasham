import { apiClient } from "../api/client";
import { useEffect, useState } from "react";
import { 
  Heart, ShoppingBag, User, TrendingUp, Clock, ChevronRight, 
  Settings, Bell, CreditCard, Gift, ShieldCheck, Zap, 
  Plus, Star, Search, Grid, List as ListIcon,
  Crown, ArrowUpRight, Share2, CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userVouchers, setUserVouchers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>({ points: 0, total_savings: 0 });
  const [recommendedDeals, setRecommendedDeals] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [notifications] = useState<any[]>([]); // Cleared out mockups
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, vouchers, stats, deals, transactions] = await Promise.all([
          apiClient("/auth/me"),
          apiClient("/vouchers/my-vouchers"),
          apiClient("/user/stats"),
          apiClient("/deals"),
          apiClient("/user/transactions")
        ]);
        setUserData(profile);
        setUserVouchers(vouchers);
        setUserStats(stats);
        setRecommendedDeals(deals);
        setUserTransactions(transactions);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const user = { 
    name: userData?.name || "Member", 
    email: userData?.email || "", 
    plan: "Standard", 
    memberSince: "Jan 2026",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || "User")}&background=10b981&color=fff`,
    points: userStats?.points || 0,
    savings: `₦${(userStats?.total_savings || 0).toLocaleString()}`
  };

  const wishlist = recommendedDeals.map((deal: any) => {
    let discount = "HOT";
    if (deal.original_price && deal.original_price > deal.discount_price) {
        const pct = Math.round((1 - (deal.discount_price / deal.original_price)) * 100);
        discount = `${pct}%`;
    }
    
    return {
      id: deal.id,
      title: deal.title,
      merchant: deal.merchants?.business_name || "Merchant",
      price: `₦${deal.discount_price?.toLocaleString() || "0"}`,
      discount: discount,
      image: deal.images?.[0] || `https://picsum.photos/seed/${deal.id}/400/300`
    };
  });

  const vouchers = userVouchers.map(v => ({
    id: v.id,
    title: v.deals?.title,
    merchant: v.deals?.merchants?.business_name,
    code: v.voucher_code,
    expiry: v.expiry_date ? new Date(v.expiry_date).toLocaleDateString() : "No expiry",
    status: v.status === "ACTIVE" ? "Active" : "Redeemed"
  }));

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
      {isLoading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Profile...</p>
        </div>
      ) : (
        <div className="pt-24 pb-8 px-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Console</h1>
              <p className="text-slate-500 font-medium">Manage your deals, savings, and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-emerald-500 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20"
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
              <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
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
                                  <button className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-colors">
                                    <Plus size={18} />
                                  </button>
                               </div>
                            </div>
                          ))}
                       </div>
                     </div>
                   </motion.div>
                 )}

                 {activeTab === 'vouchers' && (
                   <motion.div 
                     key="vouchers"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-4"
                   >
                      {vouchers.map(v => (
                        <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                                 <ShoppingBag className="text-emerald-600" />
                              </div>
                              <div>
                                 <h5 className="font-black text-slate-900">{v.title}</h5>
                                 <p className="text-xs text-slate-500 font-medium">{v.merchant}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-8">
                              <div className="text-center">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Code</p>
                                 <p className="font-mono font-bold text-slate-900">{v.code}</p>
                              </div>
                              <div className="text-center">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${v.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{v.status}</span>
                              </div>
                              <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                 <ChevronRight size={20} />
                              </button>
                           </div>
                        </div>
                      ))}
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
                         </div>
                      </div>

                      <div className={viewMode === 'grid' ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                         {wishlist.map((item) => (
                           <div key={item.id} className={`bg-white rounded-4xl border border-slate-200/60 shadow-sm overflow-hidden group hover:shadow-xl transition-all ${viewMode === 'list' ? 'flex items-center p-4' : 'flex flex-col'}`}>
                              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-24 h-24 rounded-2xl shrink-0' : 'h-48'}`}>
                                 <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
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
                                 <button className="mt-4 w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg">Buy Now</button>
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
                        </div>
                      ))}
                   </motion.div>
                 )}

                 {activeTab === 'history' && (
                   <motion.div 
                     key="history"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-4"
                   >
                     {userTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                            <Clock size={40} />
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 mb-2">No History Yet</h4>
                          <p className="text-slate-500 max-w-xs text-center font-medium">You haven't made any purchases or redeemed any vouchers.</p>
                        </div>
                     ) : (
                        userTransactions.map((tx: any) => (
                           <div key={tx.id} className="p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                   <CreditCard className="text-indigo-500" size={20} />
                                </div>
                                <div>
                                   <h5 className="font-black text-slate-900">{tx.type}</h5>
                                   <p className="text-sm font-medium text-slate-500">{tx.merchant}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                 <p className="font-black text-slate-900 text-lg">{tx.amount}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.date}</p>
                              </div>
                           </div>
                        ))
                     )}
                   </motion.div>
                 )}

                 {activeTab === 'settings' && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100"
                   >
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                         <Settings size={40} />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2">Settings Coming Soon</h4>
                      <p className="text-slate-500 max-w-xs text-center font-medium">Profile management and preferences will be available here.</p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      )}

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
               <button onClick={() => setShowUpgradeModal(false)} className="absolute top-6 right-6 p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
                 <XIcon size={24} />
               </button>
               
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

function XIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
