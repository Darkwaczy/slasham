import { Newspaper, Download, Share2, Globe, TrendingUp, FileText, ImageIcon } from "lucide-react";
import { motion } from "motion/react";

export default function Press() {
  const news = [
    { 
        title: "Slasham Secures $2M in Seed Funding", 
        date: "March 15, 2026", 
        tag: "Financing",
        desc: "We are thrilled to announce our latest funding round to accelerate our expansion across Africa. This investment will allow us to scale our operations, enhance our technology platform, and bring the Slasham experience to even more cities." 
    },
    { 
        title: "Strategic Alliance: Abuja's Top 50 Merchants Join Slasham", 
        date: "February 20, 2026", 
        tag: "Partnerships",
        desc: "Our partnership program continues to grow, with 50 of Abuja's most popular businesses now offering exclusive deals through Slasham, redefining local commerce." 
    },
    { 
        title: "Evolution of Loyalty: The New Slasham Ecosystem", 
        date: "January 10, 2026", 
        tag: "Product",
        desc: "We've introduced a comprehensive loyalty program that rewards users for every redemption, making it easier than ever to earn points and unlock premium perks." 
    }
  ];

  const assets = [
    { title: "Primary Logo", type: "SVG / PNG", icon: <ImageIcon className="text-emerald-500" /> },
    { title: "Brand Guidelines", type: "PDF", icon: <FileText className="text-indigo-500" /> },
    { title: "Press Kit 2026", type: "ZIP", icon: <Download className="text-rose-500" /> }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* 1. EDITORIAL HERO */}
      <section className="relative pt-32 lg:pt-48 px-6 lg:px-12 mb-24 max-w-[1800px] mx-auto text-left">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl flex-1"
            >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 border border-slate-200">Media Relations</span>
                <h1 className="text-7xl lg:text-[10rem] font-black text-slate-900 leading-[0.8] tracking-tighter mb-8 uppercase italic">
                    News<br/>
                    <span className="text-indigo-600 drop-shadow-sm">Room.</span>
                </h1>
                <p className="text-xl lg:text-3xl font-medium text-slate-500 max-w-2xl leading-tight">
                    Insights, announcements, and high-fidelity resources for the global media community.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="max-w-xl flex-1 hidden lg:flex justify-center relative py-20"
            >
                {/* Central Newsroom Composition */}
                <div className="relative">
                    {/* Background Glow */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.25, 0.1]
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500 rounded-full blur-[100px] -z-10" 
                    />

                    {/* Main Icon Composition */}
                    <motion.div
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [-1, 1, -1]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 p-14 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-2xl"
                    >
                        <div className="relative">
                            <Newspaper size={100} className="text-slate-900 drop-shadow-[0_15px_15px_rgba(16,185,129,0.2)]" strokeWidth={1.5} />
                            
                            {/* Alert Indicator */}
                            <motion.div 
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
                            />
                        </div>
                    </motion.div>

                    {/* Orbital Elements */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 -m-20 pointer-events-none"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-0 right-0 p-4 bg-white shadow-xl rounded-2xl"
                        >
                            <Share2 size={24} className="text-indigo-600" />
                        </motion.div>
                        <motion.div 
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-10 left-0 p-4 bg-white shadow-xl rounded-2xl"
                        >
                            <TrendingUp size={24} className="text-emerald-500" />
                        </motion.div>
                    </motion.div>
                </div>
                
                <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full -z-20" />
            </motion.div>
        </div>
      </section>

      <div className="px-6 lg:px-12 max-w-[1800px] mx-auto grid lg:grid-cols-3 gap-16">
        
        {/* LEFT: THE FEED (2 Coulumns) */}
        <div className="lg:col-span-2 space-y-10 text-left">
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Latest Dispatches</h3>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                    <TrendingUp size={14} /> Global Expansion Trend
                </div>
            </div>

            <div className="space-y-4">
                {news.map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="group bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all flex flex-col md:flex-row gap-10 items-start cursor-pointer"
                    >
                        <div className="w-full md:w-48 h-48 bg-slate-50 rounded-[2.5rem] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative">
                             <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                             <Newspaper size={40} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">{item.tag}</span>
                                <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">
                                {item.desc}
                            </p>
                            <div className="flex items-center gap-4">
                                <button className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 group-hover:gap-4 transition-all">
                                    Read Analysis <Share2 size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* RIGHT: THE VAULT */}
        <div className="space-y-12">
            <div className="text-left">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 border-b border-slate-200 pb-4">Digital Asset Vault</h3>
                <div className="grid grid-cols-1 gap-4">
                    {assets.map((asset, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-slate-900 group-hover:text-white">
                                    {asset.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{asset.title}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{asset.type}</p>
                                </div>
                            </div>
                            <button className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                                <Download size={20} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* IMPACT STATISTICS */}
            <div className="p-8 bg-indigo-600 rounded-[3rem] text-white space-y-8 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                <h4 className="text-2xl font-black italic tracking-tighter leading-none">Impact Pulse</h4>
                <div className="space-y-6 relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Network Reach</p>
                        <p className="text-4xl font-black tracking-tighter italic">250K+</p>
                        <p className="text-xs font-medium text-indigo-100/60">Verified Platform Users</p>
                    </div>
                    <div className="space-y-1 border-t border-white/10 pt-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Merchant Hubs</p>
                        <p className="text-4xl font-black tracking-tighter italic">1,200+</p>
                        <p className="text-xs font-medium text-indigo-100/60">Across Lagos & Abuja</p>
                    </div>
                    <div className="space-y-1 border-t border-white/10 pt-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Savings Generated</p>
                        <p className="text-4xl font-black tracking-tighter italic">₦500M+</p>
                        <p className="text-xs font-medium text-indigo-100/60">Back into Local Economy</p>
                    </div>
                </div>
                <div className="pt-4">
                    <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-indigo-900/20">
                        Inquire for Partnerships
                    </button>
                </div>
            </div>

            {/* MEDIA CONTACT */}
            <div className="px-4 text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">Media Inquiry</h4>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 text-left">
                        <Globe size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">press@slasham.com</p>
                        <p className="text-[10px] font-medium text-slate-400">Lagos HQ • Available 24/7</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
