import { MapPin, Send, MessageSquare, Globe, ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "Support", message: "" });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  const stations = [
    { 
        id: 'support',
        icon: <MessageSquare size={20} />, 
        title: "Consumer Support", 
        desc: "Trouble with a voucher? Our protocol experts are standing by.",
        action: "Open Ticket",
        color: "bg-indigo-500",
        email: "support@slasham.com"
    },
    { 
        id: 'merchant',
        icon: <Globe size={20} />, 
        title: "Merchant Strategy", 
        desc: "Ready to list your business? Let's scale your impact.",
        action: "Partner with Us",
        color: "bg-emerald-500",
        email: "partners@slasham.com"
    },
    { 
        id: 'press',
        icon: <Send size={20} />, 
        title: "Press & Media", 
        desc: "Inquiries regarding platform growth and brand assets.",
        action: "Download Kit",
        color: "bg-amber-500",
        email: "press@slasham.com"
    }
  ];

  return (
    <div className="bg-white min-h-screen relative overflow-hidden pb-32">
      {/* Immersive Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-50/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* 1. STATION HERO */}
      <section className="relative pt-32 lg:pt-48 px-6 lg:px-12 mb-24 max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl flex-1"
            >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 border border-slate-200">Connect Protocol</span>
                <h1 className="text-7xl lg:text-[10rem] font-black text-slate-900 leading-[0.8] tracking-tighter mb-8 uppercase italic">
                    Let's <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-rose-500 to-amber-500 underline decoration-indigo-200 underline-offset-20">Talk.</span>
                </h1>
                <p className="text-xl lg:text-3xl font-medium text-slate-500 max-w-2xl leading-tight">
                    Have a question about a deal or want to join our network? We’re operational 24/7.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex-1 hidden lg:block relative"
            >
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10"
                >
                    <img 
                        src="/C:/Users/DELL/.gemini/antigravity/brain/54298c44-8217-4b17-a52b-3e80fce7f319/contact_hero_visual_1775385582457.png" 
                        alt="Contact Visual" 
                        className="w-full h-auto drop-shadow-[0_35px_35px_rgba(79,70,229,0.15)] rounded-[4rem]"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
            </motion.div>
        </div>
      </section>

      {/* 2. DUAL INTERFACE (Split Card) */}
      <section className="px-6 lg:px-12 max-w-[1800px] mx-auto relative z-10 text-left">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* LEFT: Deployment Stations */}
            <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 px-2">Operational Hubs</h3>
                <div className="grid grid-cols-1 gap-6">
                    {stations.map((station, i) => (
                        <motion.div 
                            key={station.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group flex items-center justify-between"
                        >
                            <div className="flex gap-6 items-center">
                                <div className={`w-14 h-14 ${station.color} text-white rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110`}>
                                    {station.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">{station.title}</h4>
                                    <p className="text-sm font-medium text-slate-400 max-w-xs">{station.desc}</p>
                                    <a href={`mailto:${station.email}`} className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-2 inline-block hover:underline">{station.email}</a>
                                </div>
                            </div>
                            <button className="hidden md:flex w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="pt-12 px-2 flex items-center gap-12">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Headquarters</p>
                        <div className="text-sm font-bold text-slate-900 space-y-1">
                            <p>Plot 123 Business Square</p>
                            <p>Central Area, Abuja</p>
                            <p>Nigeria</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Social Signal</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Instagram size={18}/></a>
                            <a href="#" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Twitter size={18}/></a>
                            <a href="#" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Linkedin size={18}/></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: High-Fidelity Inquiry Form */}
            <div className="w-full lg:w-1/2">
                <div className="bg-white p-1 lg:p-1 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                    
                    <form onSubmit={handleSubmit} className="relative bg-white p-10 lg:p-16 rounded-[3.1rem] border border-slate-50 space-y-10">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Your Name</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Enter full name"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    value={formState.name}
                                    onChange={e => setFormState({...formState, name: e.target.value})}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Electronic Mail</label>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="name@email.com"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    value={formState.email}
                                    onChange={e => setFormState({...formState, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Department</label>
                            <div className="flex flex-wrap gap-2">
                                {["Support", "Merchant", "Press", "Other"].map(dept => (
                                    <button
                                        key={dept}
                                        type="button"
                                        onClick={() => setFormState({...formState, subject: dept})}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            formState.subject === dept ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                        }`}
                                    >
                                        {dept}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Message Payload</label>
                            <textarea 
                                required
                                rows={5}
                                placeholder="Write your inquiry here..."
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                                value={formState.message}
                                onChange={e => setFormState({...formState, message: e.target.value})}
                            />
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <Globe size={14} className="animate-spin-slow" /> 
                                Verified Connect Protocol Enabled
                            </div>
                            <button 
                                type="submit"
                                disabled={isSent}
                                className={`px-12 py-5 rounded-4xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 ${
                                    isSent ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-indigo-600 text-white hover:bg-slate-900 shadow-xl shadow-indigo-100'
                                }`}
                            >
                                {isSent ? 'Signal Received' : 'Transmit Message'}
                                {isSent ? <MapPin size={16} /> : <ArrowRight size={16} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </section>

      {/* 3. LOCATIONS STRIP */}
      <section className="pt-32">
        <div className="border-y border-slate-100 py-12 flex flex-wrap justify-around gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all px-6">
            <div className="flex flex-col items-center gap-2">
                <p className="text-3xl font-black text-slate-900">ABUJA</p>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Headquarters</p>
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-3xl font-black text-slate-900">LAGOS</p>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Strategic Base</p>
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-3xl font-black text-slate-900">IBADAN</p>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Expansion Hub</p>
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-3xl font-black text-slate-900">LONDON</p>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Global Office</p>
            </div>
        </div>
      </section>
    </div>
  );
}
