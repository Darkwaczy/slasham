import { Save, Shield, Percent, Globe, Database, Server, Check, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<null | 'success' | 'error'>(null);
  
  const [settings, setSettings] = useState({
    siteName: "Slasham Deals",
    supportEmail: "ops@slasham.com",
    maintenanceMode: false,
    commission: "15%",
    withdrawalFee: "₦500",
    taxRate: "7.5%",
    enforce2FA: true,
    rateLimit: "1,000 req/min",
    sessionTimeout: "24 Hours"
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1500);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateText = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    {
      title: "Platform Configuration",
      icon: <Globe size={20} className="text-blue-500" />,
      items: [
        { id: 'siteName', label: "Site Display Name", type: "text" },
        { id: 'supportEmail', label: "Support Dispatch Email", type: "text" },
        { id: 'maintenanceMode', label: "Global Maintenance Mode", type: "toggle" },
      ]
    },
    {
      title: "Revenue & Fees",
      icon: <Percent size={20} className="text-emerald-500" />,
      items: [
        { id: 'commission', label: "Standard Admin Commission", type: "text" },
        { id: 'withdrawalFee', label: "Merchant Withdrawal Fee", type: "text" },
        { id: 'taxRate', label: "Value Added Tax (VAT)", type: "text" },
      ]
    },
    {
      title: "Security & API",
      icon: <Shield size={20} className="text-rose-500" />,
      items: [
        { id: 'enforce2FA', label: "Global 2FA Enforcement", type: "toggle" },
        { id: 'rateLimit', label: "Backend API Rate Limit", type: "text" },
        { id: 'sessionTimeout', label: "Session Persistence", type: "text" },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Coordinate and scale platform core parameters</p>
        </div>
        <div className="flex items-center gap-4">
            <AnimatePresence>
                {saveStatus === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl"
                    >
                        <Check size={16} /> Changes Persistent
                    </motion.div>
                )}
            </AnimatePresence>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                {isSaving ? 'Compiling...' : 'Save Configuration'}
            </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-slate-50 rounded-2xl">
                {section.icon}
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tighter">{section.title}</h2>
            </div>

            <div className="space-y-6 flex-1">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                  <div>
                      <p className="text-sm font-black text-slate-900 mb-0.5">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Modified: Mar 21, 2026</p>
                  </div>
                  {item.type === 'toggle' ? (
                       <button 
                        onClick={() => toggleSetting(item.id as keyof typeof settings)}
                        className={`w-14 h-7 rounded-full transition-all duration-300 relative px-1 ${settings[item.id as keyof typeof settings] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                       >
                          <motion.div 
                            animate={{ x: settings[item.id as keyof typeof settings] ? 28 : 0 }}
                            className="w-5 h-5 bg-white rounded-full shadow-lg" 
                          />
                       </button>
                  ) : (
                    <input 
                      type="text" 
                      value={settings[item.id as keyof typeof settings] as string}
                      onChange={(e) => updateText(item.id as keyof typeof settings, e.target.value)}
                      className="bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-900 px-4 py-3 w-48 text-right focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-between overflow-hidden relative group shadow-2xl">
           <div className="relative z-10 flex-1">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 border border-white/10 group-hover:scale-110 transition-transform shadow-xl shadow-black/50">
                  <Server size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4">Core Infrastructure</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm">
                Region: <span className="text-white font-bold ml-1 uppercase tracking-widest">AWS-AF-1</span><br />
                All database clusters are operating at peak efficiency. Health score: <span className="text-emerald-400 font-black">99.9%</span>
              </p>
              
              <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Redis Cache Online</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">PostgreSQL Primary Read/Write</span>
                  </div>
              </div>
           </div>
           <button className="relative z-10 w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group/btn hover:border-indigo-500/50">
              <RefreshCw size={14} className="group-hover/btn:rotate-180 transition-transform duration-700" /> System Deep Scan
           </button>
           
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <Database size={240} />
           </div>
           
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
        </div>
      </div>

       <div className="mt-12 p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex items-start gap-4">
           <div className="p-3 bg-white rounded-2xl shadow-sm">
               <AlertCircle className="text-rose-600" size={24} />
           </div>
           <div>
               <h4 className="text-lg font-black text-slate-900 tracking-tight mb-2">Platform Danger Zone</h4>
               <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed max-w-2xl">
                   Modifying these parameters affects all live users and merchants instantly. Proceed with extreme caution when adjusting global commission rates or security protocols.
               </p>
               <div className="flex gap-4">
                   <button className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-rose-600/20 transition-all">Clear Server Cache</button>
                   <button className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-all">Download Debug Logs</button>
               </div>
           </div>
       </div>
    </div>
  );
}
