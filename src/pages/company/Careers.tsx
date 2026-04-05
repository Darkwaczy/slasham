import { Briefcase, Zap, Heart, Globe, ArrowRight, Shield, TrendingUp, Star, Rocket, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Careers() {
  const roles = [
    { 
        title: "Senior Lead Engineer", 
        dept: "Infrastructure", 
        location: "Hybrid / Abuja", 
        tag: "Critical Hire",
        color: "bg-indigo-500"
    },
    { 
        title: "Growth Strategist", 
        dept: "Marketing", 
        location: "Remote (Nigeria)", 
        tag: "Hot Role",
        color: "bg-rose-500"
    },
    { 
        title: "Merchant Success Manager", 
        dept: "Operations", 
        location: "Lagos Office", 
        tag: "Expansion",
        color: "bg-emerald-500"
    },
    { 
        title: "Product Designer", 
        dept: "Experience", 
        location: "Hybrid / Lagos", 
        tag: "Strategic",
        color: "bg-amber-500"
    }
  ];

  const pillars = [
    { 
        title: "Innovation First", 
        desc: "We don't just follow trends; we create the blueprints for the African experience economy.", 
        icon: <Zap size={24} className="text-amber-500" />,
        stat: "14+ Product Pivots"
    },
    { 
        title: "Radical Growth", 
        desc: "Individual trajectory is tied to our platform's exponential scale. You grow as we win.", 
        icon: <TrendingUp size={24} className="text-emerald-500" />,
        stat: "10x Team Scale"
    },
    { 
        title: "Cultural Synergy", 
        desc: "A melting pot of Lagos energy and Abuja precision. We celebrate diverse operational styles.", 
        icon: <Heart size={24} className="text-rose-500" />,
        stat: "Zero Ego Policy"
    },
    { 
        title: "Global Mission", 
        desc: "Redefining how millions of Nigerians save and spend every single day.", 
        icon: <Globe size={24} className="text-indigo-500" />,
        stat: "Millions Impacted"
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* 1. VISIONARY HERO */}
      <section className="relative pt-32 lg:pt-48 px-6 lg:px-12 mb-32 max-w-[1800px] mx-auto text-left">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl flex-1 text-left"
            >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 border border-slate-200">Talent Acquisition</span>
                <h1 className="text-7xl lg:text-[11rem] font-black text-slate-900 leading-[0.8] tracking-tighter mb-10 uppercase italic">
                    Build the <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 via-indigo-600 to-rose-500 underline decoration-indigo-100 underline-offset-25">Future.</span>
                </h1>
                <p className="text-xl lg:text-3xl font-medium text-slate-500 max-w-2xl leading-tight">
                    Slasham is more than an app; it's a movement. Help us engineer the most efficient savings protocol in Africa.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="max-w-xl flex-1 hidden lg:flex justify-center relative py-20"
            >
                {/* Central Rocket Composition */}
                <div className="relative">
                    {/* Background Glow */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500 rounded-full blur-[100px] -z-10" 
                    />

                    {/* Main Rocket Icon */}
                    <motion.div
                        animate={{ 
                            y: [0, -30, 0],
                            rotate: [-1, 1, -1]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 p-12 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-2xl"
                    >
                        <div className="relative">
                            <Rocket size={120} className="text-slate-900 drop-shadow-[0_15px_15px_rgba(16,185,129,0.2)]" strokeWidth={1.5} />
                            
                            {/* Engine Pulse */}
                            <motion.div 
                                animate={{ opacity: [0, 1, 0], y: [0, 20, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-12 bg-linear-to-b from-orange-400 to-transparent blur-md rounded-full"
                            />
                        </div>
                    </motion.div>

                    {/* Orbital Elements */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 -m-20 pointer-events-none"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-0 right-0 p-4 bg-white shadow-xl rounded-2xl"
                        >
                            <Sparkles size={24} className="text-amber-500" />
                        </motion.div>
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-10 left-0 p-4 bg-white shadow-xl rounded-2xl"
                        >
                            <Shield size={24} className="text-emerald-500" />
                        </motion.div>
                    </motion.div>
                </div>
                
                <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full -z-20" />
            </motion.div>
        </div>
      </section>

      {/* 2. CULTURE MATRIX (Staggered Grid) */}
      <section className="px-6 lg:px-12 max-w-[1800px] mx-auto mb-40 text-left">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12 border-b border-slate-200 pb-4">Our Cultural Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="group bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all text-left relative overflow-hidden"
                >
                    <div className="absolute top-6 right-6 text-[10px] font-black text-slate-200 italic opacity-0 group-hover:opacity-100 transition-opacity">
                        {pillar.stat}
                    </div>
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        {pillar.icon}
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{pillar.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* 3. DYNAMIC ROLE BOARD */}
      <section className="px-6 lg:px-12 max-w-[1800px] mx-auto text-left">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
            <div className="w-full lg:w-1/3">
                <div className="sticky top-32 space-y-6">
                    <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-none tracking-tighter uppercase italic">
                        Open <br/>Deployments
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        We ignore traditional resume protocols. We care about your output, your obsession with performance, and your alignment with our mission.
                    </p>
                    <div className="pt-6 flex flex-wrap gap-3">
                        <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400">#HighPerformance</div>
                        <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400">#ZeroEgo</div>
                        <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400">#AbujaBase</div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-2/3 space-y-4">
                {roles.map((role, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ x: 10 }}
                        className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between group cursor-pointer hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                    >
                        <div className="flex gap-6 items-center w-full md:w-auto">
                            <div className={`w-3 h-12 ${role.color} rounded-full hidden md:block`} />
                            <div>
                                <h4 className="text-xl lg:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{role.title}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Briefcase size={12} /> {role.dept}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Globe size={12} /> {role.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mt-6 md:mt-0 w-full md:w-auto justify-between">
                            <span className={`px-4 py-1.5 ${role.color} bg-opacity-10 text-xs font-black rounded-full`} style={{ color: `var(--${role.color.split('-')[1]}-500)` }}>
                                {role.tag}
                            </span>
                            <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                <div className="mt-12 p-12 bg-slate-900 rounded-[4rem] text-center space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
                    <Star className="mx-auto text-amber-400 mb-2 animate-pulse" size={32} />
                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white italic tracking-tighter">No Specific Alignment Yet?</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium">
                            We are always looking for pioneers. Submit your profile into our Global Talent Cluster for future protocols.
                        </p>
                    </div>
                    <div>
                        <button className="px-10 py-5 bg-white text-slate-900 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all shadow-2xl shadow-indigo-500/20">
                            Apply to Talent Cluster
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 4. SPEED APPLY FOOTER */}
      <section className="pt-40 px-6">
        <div className="max-w-[1200px] mx-auto border-t border-slate-100 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4 text-slate-900 font-black italic text-2xl">
                <Shield size={24} className="text-emerald-500" /> Slasham Security Protocol Enabled
            </div>
            <div className="flex items-center gap-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted By Leads From</span>
                <div className="flex items-center gap-6 grayscale opacity-50">
                    <span className="text-sm font-black tracking-tighter">GOOGLE.</span>
                    <span className="text-sm font-black tracking-tighter">PAYSTACK.</span>
                    <span className="text-sm font-black tracking-tighter">FLUTTERWAVE.</span>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
