import { motion } from "motion/react";
import { ShoppingBag, Store, Zap, ArrowRight, CheckCircle2, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      id: "buy",
      title: "Buy coupon",
      icon: <ShoppingBag size={32} />,
      color: "bg-emerald-50 text-emerald-600",
      description: "Browse our curated selection of premium deals in Lagos and Abuja. Once you find a deal you love, purchase the digital coupon securely on our platform.",
      details: [
        "Secure payment via Paystack/Flutterwave",
        "Instant delivery to your email and account",
        "Clear validity dates and terms",
        "100% money-back guarantee if not honored"
      ],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "visit",
      title: "Visit business",
      icon: <Store size={32} />,
      color: "bg-blue-50 text-blue-600",
      description: "Head over to the business location at your convenience within the validity period. No need to call ahead unless specified in the deal terms.",
      details: [
        "Verified business locations",
        "Real-time availability updates",
        "Premium service for Slasham members",
        "Easy navigation via integrated maps"
      ],
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "unlock",
      title: "Unlock more",
      icon: <Zap size={32} />,
      color: "bg-amber-50 text-amber-600",
      description: "Present your digital coupon code before requesting your bill. The discount is applied instantly, and you've just unlocked a premium experience for less!",
      details: [
        "Seamless redemption process",
        "No awkward conversations",
        "Earn loyalty points for every redemption",
        "Unlock exclusive 'Member-Only' flash deals"
      ],
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-8"
          >
            <Zap size={14} /> The Slasham Way
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[0.9]"
          >
            How it <span className="text-emerald-500">Works.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            We've simplified the way you discover and enjoy the best of your city. Follow these three simple steps to start saving today.
          </motion.p>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              id={step.id}
              className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                  {step.icon}
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">{step.title}</h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-4 mb-10">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/2 relative"
              >
                <div className="aspect-4/3 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-200/60">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                {/* Decorative element */}
                <div className={`absolute -bottom-6 -right-6 w-32 h-32 ${step.color} opacity-20 rounded-full blur-3xl -z-10`}></div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & FAQ Preview */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified Partners</h3>
              <p className="text-slate-400 text-sm">We personally visit and verify every business before listing them on Slasham.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Access</h3>
              <p className="text-slate-400 text-sm">No waiting. Your coupon is ready to use the moment your payment is confirmed.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure Payments</h3>
              <p className="text-slate-400 text-sm">Your transactions are protected by industry-leading encryption and security protocols.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8">Ready to start <span className="text-emerald-500">saving?</span></h2>
          <p className="text-xl text-slate-500 mb-12">Join 10,000+ Nigerians already enjoying the best of their city for less.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/deals" className="px-10 py-5 bg-emerald-500 text-white rounded-full font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group">
              Explore Deals <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/business" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
              Run a Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
