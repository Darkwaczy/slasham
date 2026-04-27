import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import { Target, Users, Award, Zap, Globe, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await apiClient("/merchants/public");
        setPartners(data.map((p: any) => ({
          name: p.business_name,
          city: p.city,
          image: p.logo_url || p.banner_url || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80"
        })));
      } catch (error) {
        console.error("Failed to fetch partners", error);
      }
    };
    fetchPartners();
  }, []);

  const IMPACT_STATS = [
    { label: "Active Users", value: "50K+", sub: "Verified Savvy Shoppers", desc: "A growing community of 'Slashers' saving daily.", icon: <Users size={20} /> },
    { label: "Merchant Partners", value: "1.2K+", sub: "Local Business Growth", desc: "Helping local shops reach their ideal audience.", icon: <Globe size={20} /> },
    { label: "Verified Cities", value: "12+", sub: "Expanding Footprint", desc: "Bringing exclusive deals to every major hub.", icon: <Globe size={20} /> },
    { label: "Value Saved", value: "₦100M+", sub: "Community Savings", desc: "Real economic impact for our loyal users.", icon: <Zap size={20} /> },
  ];

  const PILLARS = [
    { 
      title: "Our Mission", 
      desc: "To empower local businesses with digital tools while providing consumers with unbeatable deals. We aim to digitize the local economy.", 
      icon: <Target className="text-emerald-500" />,
      tag: "The Goal"
    },
    { 
      title: "Our Vision", 
      desc: "To become the leading platform for premium local experiences across Africa, fostering a future where every business thrives.", 
      icon: <Award className="text-amber-500" />,
      tag: "The Future"
    },
    { 
      title: "Our Values", 
      desc: "Integrity, innovation, and community. We believe that these core values are the bedrock of our success and every decision we make.", 
      icon: <Sparkles className="text-blue-500" />,
      tag: "The Core"
    }
  ];

  return (
    <div className="bg-[#FAFAFA] font-sans overflow-hidden">
      {/* 1. REFINED EDITORIAL HERO */}
      <section className="relative min-h-[80vh] flex items-center px-6 pt-20 pb-40">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
             <motion.div style={{ y: y1 }} className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-emerald-400 rounded-full blur-[120px]" />
             <motion.div style={{ y: y2 }} className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-rose-400 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-end gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black uppercase text-[10px] tracking-[0.3em] mb-8 shadow-sm"
              >
                <Sparkles size={14} className="fill-emerald-500" /> The Slasham Story
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-12"
              >
                WE BRIDGE<br/>
                <span className="text-emerald-500 font-black">THE GAP.</span>
              </motion.h1>
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl lg:text-2xl text-slate-400 font-medium max-w-2xl leading-snug tracking-tight"
                  >
                    Slasham is dedicated to connecting premium local businesses with savvy consumers through <span className="text-slate-900 border-b-4 border-emerald-100/50">data-driven value</span> and high-fidelity discovery.
                  </motion.p>
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="hidden lg:block pt-4">
                       <div className="w-16 h-16 rounded-full border-2 border-slate-200 border-dashed animate-spin-slow flex items-center justify-center">
                            <Heart size={24} className="text-rose-500 fill-rose-500" />
                       </div>
                  </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PLATFORM (CONTEXT SECTION) */}
      <section className="py-40 bg-white border-y border-slate-100 relative z-10">
          <div className="max-w-4xl mx-auto px-6 text-center lg:text-left">
               <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-10">The Platform</h2>
               <div className="space-y-12">
                    <p className="text-xl lg:text-3xl text-slate-900 font-black leading-tight tracking-tight uppercase">
                         Slasham isn't just a deals site; it's a <span className="text-emerald-500 underline decoration-emerald-200 underline-offset-8 decoration-4">high-fidelity bridge</span> between the city's best merchants and the consumers who appreciate them most.
                    </p>
                    <div className="grid md:grid-cols-2 gap-12 text-slate-500 font-medium leading-relaxed text-lg">
                        <p>
                            We recognized that local businesses have immense value but often struggle to reach the right audience effectively. Simultaneously, consumers were looking for verified, premium experiences that didn't break the bank.
                        </p>
                        <p>
                            By leveraging limited-time exclusive inventory and verified merchant partnerships, we created a marketplace where every 'Slash' is a win for both the business and the shopper. Today, we are the go-to hub for discovery in over 12 cities.
                        </p>
                    </div>
               </div>
          </div>
      </section>

      {/* 3. IMPACT STRIP (ANIMATED) */}
      <section className="bg-slate-900 py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
            {IMPACT_STATS.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center lg:text-left"
              >
                <div className="flex items-center gap-3 text-emerald-500 font-black mb-3 justify-center lg:justify-start">
                    {stat.icon}
                    <span className="text-[10px] uppercase tracking-widest leading-none">{stat.label}</span>
                </div>
                <h3 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-4">{stat.value}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed max-w-[180px] mx-auto lg:mx-0 font-medium">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] -mr-[300px] -mt-[300px]" />
      </section>

      {/* 4. THE PILLARS (GLASS) */}
      <section className="py-40 px-6 relative">
          <div className="max-w-7xl mx-auto">
                <div className="text-center mb-32">
                     <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 pl-1">Our Core Commitment</h2>
                     <p className="text-4xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter">The Foundations of Value.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {PILLARS.map((pillar, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ y: -10, rotateX: 2, rotateY: 2 }}
                          className="bg-white p-12 rounded-4xl border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                <span className="text-[10rem] font-black leading-none uppercase tracking-tighter">{pillar.tag.charAt(0)}</span>
                            </div>
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 shadow-inner">
                                {pillar.icon}
                            </div>
                            <span className="text-[10px] font-black text-emerald-600/50 uppercase tracking-[0.3em] mb-4 block leading-none">{pillar.tag}</span>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8 leading-none">{pillar.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
                        </motion.div>
                    ))}
                </div>
          </div>
      </section>

      {/* 5. OUR NETWORK OF PARTNERS (5x3 GRID) */}
      <section className="py-40 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-24 text-center lg:text-left">
               <h2 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-none">Our Network of<br/><span className="text-emerald-500 font-black">PARTNERS.</span></h2>
               <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Powering the local economy across Lagos and Abuja.</p>
          </div>


          <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
                    {partners.length > 0 ? partners.map((partner, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="relative aspect-4/5 bg-slate-100 rounded-4xl overflow-hidden group shadow-xl shadow-slate-200/50"
                        >
                            <img src={partner.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={partner.name} />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/10 backdrop-blur-md border-t border-white/20 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                <h4 className="text-[12px] font-black text-white uppercase tracking-tight mb-1">{partner.name}</h4>
                                <div className="flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                     <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">{partner.city}</p>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                      <div className="col-span-full py-20 text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Our network is growing every day.</p>
                      </div>
                    )}
                </div>
          </div>

      </section>

      {/* 6. JOIN THE MOVEMENT (CTA) */}
      <section className="py-48 px-6 bg-emerald-500 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-10">
                <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-16">
                     Ready to<br/>
                     <span className="text-emerald-900/40 font-black">Slash?</span>
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                     <Link to="/auth" className="px-16 py-7 bg-white text-emerald-600 rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-slate-50 transition-all active:scale-95">
                          Create Free Account
                     </Link>
                     <Link to="/business" className="px-16 py-7 bg-emerald-900/10 text-white border-2 border-emerald-400 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-emerald-900/20 transition-all active:scale-95">
                          Register as Merchant
                     </Link>
                </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
               <span className="text-[20rem] font-black text-white/5 uppercase leading-none select-none">SLASHAM</span>
          </div>
      </section>
    </div>
  );
}


