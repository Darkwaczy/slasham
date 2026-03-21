import { Save, Shield, Percent, Globe, Database, Server } from "lucide-react";
import { motion } from "motion/react";

export default function AdminSettings() {
  const sections = [
    {
      title: "Platform Configuration",
      icon: <Globe size={20} className="text-blue-500" />,
      settings: [
        { label: "Site Name", value: "Slasham Deals", type: "text" },
        { label: "Support Email", value: "ops@slasham.com", type: "text" },
        { label: "Maintenance Mode", value: false, type: "toggle" },
      ]
    },
    {
      title: "Revenue & Fees",
      icon: <Percent size={20} className="text-emerald-500" />,
      settings: [
        { label: "Standard Commission", value: "15%", type: "text" },
        { label: "Withdrawal Fee", value: "₦500", type: "text" },
        { label: "Tax Rate (VAT)", value: "7.5%", type: "text" },
      ]
    },
    {
      title: "Security & API",
      icon: <Shield size={20} className="text-rose-500" />,
      settings: [
        { label: "2FA Enforcement", value: true, type: "toggle" },
        { label: "API Rate Limit", value: "1000 req/min", type: "text" },
        { label: "Session Timeout", value: "24 Hours", type: "text" },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Settings</h1>
          <p className="text-slate-500 font-medium">Fine-tune platform parameters and security</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 transition-transform">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-slate-50 rounded-2xl">
                {section.icon}
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{section.title}</h2>
            </div>

            <div className="space-y-6">
              {section.settings.map((setting, sIdx) => (
                <div key={sIdx} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                  <span className="text-sm font-bold text-slate-500">{setting.label}</span>
                  {setting.type === 'toggle' ? (
                       <button className={`w-12 h-6 rounded-full transition-colors relative ${setting.value ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${setting.value ? 'right-1' : 'left-1'}`} />
                       </button>
                  ) : (
                    <input 
                      type="text" 
                      defaultValue={setting.value as string}
                      className="bg-slate-50 border-none rounded-xl text-sm font-black text-slate-900 px-4 py-2 w-48 text-right focus:ring-indigo-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between overflow-hidden relative group">
           <div className="relative z-10">
              <Server className="text-indigo-400 mb-6" size={32} />
              <h3 className="text-xl font-black mb-2">System Infrastructure</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">Connected to region: <span className="text-white font-bold">AWS-AF-SOUTH-1</span>. All database nodes are currently synchronized.</p>
           </div>
           <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <Database size={14} /> Database Health Check
           </button>
           
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
}
