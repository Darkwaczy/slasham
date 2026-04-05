import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Smartphone,
  MessageSquare,
  Award,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Globe,
  Rocket
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";


gsap.registerPlugin(ScrollTrigger);

export default function Business() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(
      ".business-hero-content > *",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
    );

    // Section animations
    gsap.utils.toArray(".reveal-section").forEach((section: any) => {
      gsap.fromTo(
        section,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  const benefits = [
    {
      icon: <ShieldCheck className="text-emerald-600" size={32} />,
      title: "Zero Risk Marketing",
      description: "Stop wasting money on ads that don't convert. You only pay a small commission when a customer actually visits and spends at your business.",
      color: "bg-emerald-50"
    },
    {
      icon: <Users className="text-blue-600" size={32} />,
      title: "New Customer Acquisition",
      description: "Reach thousands of active spenders in Lagos and Abuja who are looking for their next favorite spot. 85% of Slasham users visit a new business for the first time.",
      color: "bg-blue-50"
    },
    {
      icon: <BarChart3 className="text-purple-600" size={32} />,
      title: "Real-time Analytics",
      description: "Track your campaign performance, see redemption rates, and understand your customer demographics through our intuitive merchant dashboard.",
      color: "bg-purple-50"
    },
    {
      icon: <Zap className="text-amber-600" size={32} />,
      title: "Instant Brand Awareness",
      description: "Get featured on our homepage and social media channels, putting your brand in front of a highly engaged audience of over 50,000 members.",
      color: "bg-amber-50"
    },
    {
      icon: <Smartphone className="text-rose-600" size={32} />,
      title: "Seamless Redemption",
      description: "Our simple digital voucher system makes it easy for your staff to verify and redeem deals in seconds using any smartphone or tablet.",
      color: "bg-rose-50"
    },
    {
      icon: <Award className="text-teal-600" size={32} />,
      title: "Loyalty Building",
      description: "Turn first-time visitors into regulars. Slasham is the perfect 'foot-in-the-door' strategy for long-term growth and customer retention.",
      color: "bg-teal-50"
    }
  ];

  const successStories = [
    {
      name: "Mrs. Adebayo",
      role: "Owner",
      business: "The Gourmet Kitchen, VI",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
      quote: "Slasham helped us fill our tables during weekday lunch hours. We've seen a 40% increase in new customers since joining. The quality of customers is excellent.",
      stats: "1,200+ Vouchers Redeemed",
      revenue: "₦4.2M+ in Sales"
    },
    {
      name: "Tunde Williams",
      role: "Manager",
      business: "FitLife Gym, Abuja",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      quote: "The analytics dashboard is a game-changer. I can see exactly who my customers are and when they prefer to visit. It's helped us optimize our staffing.",
      stats: "25% Higher Retention",
      revenue: "300+ New Members"
    },
    {
      name: "Sarah Johnson",
      role: "Founder",
      business: "Glow Up Spa, Lekki",
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
      quote: "Redemption is so easy. My staff learned it in 5 minutes. No more messy paperwork or complex discount codes. It's the most professional platform in Nigeria.",
      stats: "₦2.5M+ Revenue",
      revenue: "98% Positive Rating"
    }
  ];

  const faqs = [
    {
      q: "How much does it cost to join?",
      a: "Joining Slasham is completely free. There are no setup fees or monthly subscriptions. We only earn a small commission on every successfully redeemed voucher."
    },
    {
      q: "How do I get paid?",
      a: "Customers pay you the discounted balance directly at your venue. Slasham collects the voucher fee from the customer upfront. We settle commissions with you on a bi-weekly basis."
    },
    {
      q: "Can I control when my deals are available?",
      a: "Yes! You have full control over your campaign. You can set blackout dates, limit the number of vouchers available per day, or restrict deals to specific hours (e.g., lunch only)."
    },
    {
      q: "How do my staff redeem vouchers?",
      a: "Redemption is simple. Your staff just needs to enter the customer's 6-digit voucher code into our merchant web portal or scan the QR code using any smartphone."
    }
  ];

  return (
    <div className="bg-white text-slate-900 font-sans overflow-hidden">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 -z-10"></div>
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=1200&q=80" 
            alt="Business Owner Success" 
            className="w-full h-full object-cover bg-slate-100"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80" }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-50 via-slate-50/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 items-center business-hero-content relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm mb-8 border border-emerald-100">
              <TrendingUp size={16} /> Partner with Slasham
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-slate-900">
              Grow your business. <br />
              <span className="text-emerald-600">Pay for results.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              The most cost-effective way to acquire high-value customers in Lagos and Abuja. No upfront fees, no risk—just growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#campaign" className="px-10 py-5 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-200 flex items-center justify-center">
                Start Growing Today
              </a>
              <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <PlayCircle size={20} /> Watch How it Works
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Partner" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Trusted by 500+ premium venues</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Our Network Includes</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
            <span className="text-2xl font-black tracking-tighter">THE GRILL HOUSE</span>
            <span className="text-2xl font-black tracking-tighter italic">OASIS SPA</span>
            <span className="text-2xl font-black tracking-tighter">SKYLINE</span>
            <span className="text-2xl font-black tracking-tighter">GLOW UP</span>
            <span className="text-2xl font-black tracking-tighter italic">FITLIFE</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-50 reveal-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">50k+</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">₦500M+</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Partner Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">85%</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">New Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">4.8/5</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Partner Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Colorful Cards */}
      <section className="py-32 px-6 max-w-7xl mx-auto reveal-section">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-6">
            <Rocket size={14} /> Why Partner With Us
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Everything you need to <span className="text-emerald-600">scale.</span></h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            We've built a platform that aligns our success with yours. We only win when you get real customers and real revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${benefit.color} rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-50`}></div>
              <div className={`w-16 h-16 rounded-2xl ${benefit.color} flex items-center justify-center mb-8 relative z-10`}>
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">{benefit.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium relative z-10">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Merchant Dashboard Preview */}
      <section className="py-32 bg-slate-950 text-white reveal-section overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-widest mb-6">
                <BarChart3 size={14} /> Merchant Portal
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Data-driven <br /><span className="text-emerald-400">growth.</span></h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                Get full visibility into your campaign performance. Track every redemption, monitor revenue in real-time, and understand your customer behavior like never before.
              </p>
              
              <ul className="space-y-6">
                {[
                  "Real-time redemption tracking",
                  "Detailed customer demographics",
                  "Revenue and ROI calculators",
                  "Staff performance monitoring",
                  "Campaign scheduling and control"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-10 bg-emerald-500/20 rounded-full blur-[100px]"></div>
              <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-4 shadow-2xl">
                <div className="bg-slate-800 rounded-xl p-6 mb-4">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold">Campaign Performance</h4>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 bg-slate-700 rounded-lg w-full"></div>
                    <div className="h-8 bg-slate-700 rounded-lg w-3/4"></div>
                    <div className="h-8 bg-slate-700 rounded-lg w-5/6"></div>
                    <div className="h-8 bg-slate-700 rounded-lg w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-xl p-6">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">₦1.2M</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Redemptions</p>
                    <p className="text-2xl font-bold text-blue-400">452</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories - Enhanced */}
      <section className="py-32 bg-white reveal-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-6">
              <Globe size={14} /> Partner Success
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Trusted by <span className="text-blue-600 italic">visionary</span> owners.</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              Join the ranks of Nigeria's most successful lifestyle businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-slate-50 border border-slate-100 rounded-[40px] overflow-hidden group shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-4/5 relative overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 bg-slate-100"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80" }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                        {story.stats}
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-white">{story.name}</h4>
                    <p className="text-white/80 text-sm font-medium">{story.role}, {story.business}</p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-lg text-slate-600 italic leading-relaxed mb-6">"{story.quote}"</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <DollarSign size={18} />
                      <span>{story.revenue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Award size={18} />
                      <span className="font-bold">Top Partner</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section for Businesses */}
      <section className="py-32 bg-slate-50 reveal-section">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-medium">Everything you need to know about partnering with Slasham.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-slate-600 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Vibrant & Bold */}
      <section id="campaign" className="py-24 px-6 reveal-section">
        <div className="max-w-7xl mx-auto bg-emerald-600 rounded-[60px] p-12 md:p-24 text-white text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 border-8 border-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 border-8 border-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter">
              Ready to fill your <br />
              <span className="italic text-emerald-200">empty tables?</span>
            </h2>
            <p className="text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto opacity-90">
              Join 500+ successful businesses in Lagos and Abuja. Start your first campaign in less than 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-12 py-6 bg-white text-emerald-700 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl">
                Partner with Slasham
              </button>
              <button className="px-12 py-6 bg-emerald-700 text-white border-2 border-emerald-500 rounded-full font-bold text-xl hover:bg-emerald-800 transition-all">
                Talk to an Expert
              </button>
            </div>
            <p className="mt-12 text-sm font-bold uppercase tracking-widest opacity-60 flex items-center justify-center gap-2">
              <Zap size={16} /> No setup fees • No monthly costs • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest">Still have questions?</p>
        <div className="flex flex-wrap justify-center gap-12">
          <a href="mailto:partners@slasham.com" className="flex items-center gap-3 text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors">
            <MessageSquare className="text-emerald-600" /> partners@slasham.com
          </a>
          <div className="flex items-center gap-3 text-xl font-bold text-slate-900">
            <Smartphone className="text-emerald-600" /> +234 800 SLASHAM
          </div>
        </div>
      </section>
    </div>
  );
}
