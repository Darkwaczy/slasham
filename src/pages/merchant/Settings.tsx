import { Save, Store, Clock, Shield, Bell, MapPin, Globe } from "lucide-react";

export default function MerchantSettings() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2 text-right">Business Profile</h1>
          <p className="text-slate-500 font-medium text-right">Configure how users see your brand</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all">
          <Save size={18} /> Update Business
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="flex items-center gap-4 mb-10 relative z-10">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Store size={24} />
                 </div>
                 <h3 className="font-black text-xl text-slate-900 tracking-tight">Public Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Identity</label>
                    <div className="relative group/input">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors" size={18} />
                       <input type="text" defaultValue="Orchid Bistro & Lounge" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Website</label>
                    <div className="relative group/input">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                       <input type="text" defaultValue="orchidbistro.com" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                    </div>
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Description</label>
                    <textarea rows={4} className="w-full p-6 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500/20 transition-all leading-relaxed">
                       A premium fusion restaurant and lounge offering the finest delicacies in the heart of Lagos.
                    </textarea>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Clock size={24} />
                 </div>
                 <h3 className="font-black text-xl text-slate-900 tracking-tight">Operating Hours</h3>
              </div>
              
              <div className="space-y-4">
                 {['Monday - Friday', 'Saturday', 'Sunday'].map((day, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                       <span className="text-sm font-bold text-slate-600 tracking-tight">{day}</span>
                       <div className="flex items-center gap-3">
                          <input type="text" defaultValue="09:00 AM" className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 text-center" />
                          <span className="text-slate-300 font-black">TO</span>
                          <input type="text" defaultValue="10:00 PM" className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 text-center" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all" />
              <Shield className="text-indigo-400 mb-6 relative z-10" size={32} />
              <h3 className="text-xl font-black mb-4 tracking-tight relative z-10">Security Center</h3>
              
              <div className="space-y-6 relative z-10">
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Enable 2FA</button>
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Rotate API Key</button>
                 <button className="w-full py-4 bg-rose-500/20 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/30 transition-all">Deactivate Account</button>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <Bell className="text-amber-500 mb-6" size={32} />
              <h3 className="text-xl font-black mb-4 tracking-tight leading-none">Notifications</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Manage how you receive alerts about new redemptions and reviews.</p>
              
              <div className="space-y-4">
                 {['Email Alerts', 'SMS Gateway', 'Push Notifications'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                       <span className="text-sm font-bold text-slate-500 tracking-tight">{item}</span>
                       <button className={`w-12 h-6 rounded-full transition-colors relative ${i < 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${i < 2 ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
