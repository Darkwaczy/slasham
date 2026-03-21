import { useState } from "react";
import { 
  User, Shield, Bell, CreditCard, Star, 
  MapPin, Phone, Mail, Camera, 
  Zap, Crown, CheckCircle2, ArrowRight,
  Smartphone, Gift, Plus, ShieldCheck, 
  QrCode, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 w-full max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Account Settings</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage your identity, security and platform preferences.</p>
        </div>
        <div className="flex overflow-x-auto p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-sm no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                activeTab === tab.id 
                  ? "bg-white text-slate-900 shadow-md" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10"
              >
                <div className="flex items-center gap-8 pb-10 border-b border-slate-50">
                   <div className="relative group">
                      <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                        <img src="https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff&size=200" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:scale-110 transition-all">
                        <Camera size={16} />
                      </button>
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Profile Identity</h3>
                      <p className="text-sm text-slate-400 font-medium">This is how you'll appear on public reviews.</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   {[
                      { label: "Full Identity", val: "John Doe", icon: <User size={18} /> },
                      { label: "Official Email", val: "john.doe@example.com", icon: <Mail size={18} />, readOnly: true },
                      { label: "Primary Phone", val: "+234 800 123 4567", icon: <Phone size={18} /> },
                   ].map((field, i) => (
                      <div key={i} className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                         <div className={`relative group/input ${field.readOnly ? 'opacity-60' : ''}`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                               {field.icon}
                            </div>
                            <input type="text" readOnly={field.readOnly} defaultValue={field.val} className={`w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500/10 transition-all outline-none ${field.readOnly ? 'cursor-not-allowed' : ''}`} />
                         </div>
                      </div>
                   ))}
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default City</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <select className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-black text-slate-900 appearance-none focus:ring-2 focus:ring-emerald-500/20 outline-none">
                           <option>Lagos, Nigeria</option>
                           <option>Abuja, FCT</option>
                           <option>Port Harcourt</option>
                        </select>
                     </div>
                   </div>
                </div>

                <div className="flex justify-end pt-6">
                   <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
                      Save Profile Changes
                   </button>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Shield size={24} />
                   </div>
                   <h3 className="font-black text-xl text-slate-900 tracking-tight">Security & Authentication</h3>
                </div>

                <div className="space-y-6">
                   <div className="p-8 bg-slate-950 text-white rounded-[2rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                         <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${twoFactorEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-white'}`}>
                               {twoFactorEnabled ? <ShieldCheck size={28} /> : <Zap size={28} />}
                            </div>
                            <div>
                               <p className="text-lg font-black tracking-tight">Two-Factor Authentication (2FA)</p>
                               <p className="text-xs text-slate-400 font-medium max-w-sm">Secure your account with a secondary verification code via Slasham Auth or Google Authenticator.</p>
                            </div>
                         </div>
                         <button 
                          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                          className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${twoFactorEnabled ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-white text-slate-950 hover:bg-emerald-500'}`}
                         >
                            {twoFactorEnabled ? 'Disable 2FA' : 'Enable Now'}
                         </button>
                      </div>
                      
                      {twoFactorEnabled && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-8 items-start"
                        >
                           <div className="p-4 bg-white rounded-2xl">
                              <QrCode size={120} className="text-slate-950" />
                           </div>
                           <div className="space-y-4">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recovery Codes</p>
                              <div className="grid grid-cols-2 gap-2">
                                 {["XJ-90-LL", "AP-22-ZZ", "LO-98-MN", "RT-44-KW"].map((code, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono text-xs font-bold">{code}</span>
                                 ))}
                              </div>
                              <button className="text-[10px] font-black underline uppercase tracking-widest text-emerald-400 hover:text-white">Download Backup Codes</button>
                           </div>
                        </motion.div>
                      )}
                   </div>

                   <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-6">
                      <p className="text-sm font-black text-slate-900">Update Account Password</p>
                      <div className="grid md:grid-cols-2 gap-4">
                         <input type="password" placeholder="Current Password" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                         <div className="md:col-span-1 border-hidden" />
                         <input type="password" placeholder="New Password" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                         <input type="password" placeholder="Confirm New Password" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                      </div>
                      <div className="flex justify-end mt-4">
                         <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Update Credentials</button>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                      <Bell size={24} />
                   </div>
                   <h3 className="font-black text-xl text-slate-900 tracking-tight">Notification Preferences</h3>
                </div>

                <div className="space-y-4">
                   {[
                      { title: "New Deal Alerts", desc: "Get notified when a new offer is available in your city.", icon: <Star size={18} /> },
                      { title: "Voucher Expiry", desc: "Alerts when your coupons are about to expire (24h before).", icon: <Clock size={18} /> },
                      { title: "Reward Bonuses", desc: "Notifications for points earned and tier achievements.", icon: <Gift size={18} /> },
                      { title: "Account Activity", desc: "Security alerts for new logins and password changes.", icon: <Shield size={18} /> },
                   ].map((item, i) => (
                      <div key={i} className="p-6 bg-slate-50 flex items-center justify-between rounded-[1.5rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors shadow-sm">
                               {item.icon}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900">{item.title}</p>
                               <p className="text-xs text-slate-400 font-medium tracking-tight">{item.desc}</p>
                            </div>
                         </div>
                         <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                         </div>
                      </div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                         <CreditCard size={24} />
                      </div>
                      <h3 className="font-black text-xl text-slate-900 tracking-tight">Billing & Payments</h3>
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">
                      <Plus size={16} /> Add New Method
                   </button>
                </div>

                <div className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden flex flex-col justify-between h-48 group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
                         <div className="flex justify-between items-start">
                            <Smartphone size={28} className="text-white/40" />
                            <CheckCircle2 size={18} className="text-emerald-500" />
                         </div>
                         <div>
                            <p className="text-lg font-mono font-bold tracking-[0.2em]">•••• •••• •••• 4582</p>
                            <div className="flex justify-between items-end mt-4">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gold Mastercard</span>
                               <span className="text-[10px] font-bold">EXPIRES 12/28</span>
                            </div>
                         </div>
                      </div>
                      
                      <button className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-300 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group">
                         <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                         </div>
                         <p className="text-xs font-black uppercase tracking-widest">Connect New Card</p>
                      </button>
                   </div>

                   <div className="pt-8 border-t border-slate-50">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Subscription Status</p>
                      <div className="p-6 bg-slate-50 rounded-[1.5rem] flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                               <Crown size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900">Slasham Pro Monthly</p>
                               <p className="text-xs text-slate-400 font-medium">Next billing: Apr 21, 2026</p>
                            </div>
                         </div>
                         <div className="text-right px-4">
                            <p className="text-sm font-black text-slate-900">₦4,500/mo</p>
                            <button className="text-[10px] font-black uppercase text-rose-500 hover:underline tracking-widest">Cancel Plan</button>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Upgrade Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.8rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
                <Crown size={12} fill="currentColor" />
                Premium Experience
              </div>
              
              <h3 className="text-3xl font-black mb-4 tracking-tighter leading-none">Upgrade to Pro</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Maximize your savings and unlock Lagos VIP status everywhere.</p>

              <div className="space-y-6 mb-12">
                {[
                  "2x Points on every purchase",
                  "VIP Lounge & Airport Access",
                  "Exclusive Member-only Deals",
                  "24/7 Priority Support Line",
                  "Zero Transaction Fees"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-xs font-bold text-slate-100 tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all text-slate-950 flex items-center justify-center gap-2">
                Become a Pro Member <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Point Tracker */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points Milestone</h4>
                <Star size={18} fill="#fbbf24" className="text-amber-400" />
             </div>
             <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">2,450</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total pts</span>
             </div>
             <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-xs text-slate-500 font-medium mb-4">You're making great progress towards your next <span className="text-indigo-600 font-black">Diamond Rank</span>!</p>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "75%" }}
                     transition={{ duration: 1.5 }}
                     className="h-full bg-indigo-500 rounded-full"
                   />
                </div>
                <button className="w-full mt-6 py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">Details & History</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
