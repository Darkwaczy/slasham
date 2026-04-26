import React, { useState } from "react";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Store,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Clock,
  Briefcase,
  Users,
  Target
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { apiClient } from "../../api/client";

export default function MerchantApply() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "Restaurant",
    rc_number: "",
    years_in_operation: "1-3 years",
    contact_name: "",
    contact_role: "Owner",
    email: "",
    phone: "",
    city: "Lagos",
    address: "",
    website_social: "",
    instagram_handle: "",
    monthly_customers: "0-500",
    avg_transaction_value: "",
    primary_goal: "Increase Foot Traffic",
    operating_hours: "",
    description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient("/merchants/apply", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center space-y-8"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Application Received!</h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto">
              Thank you for your detailed interest in Slasham. Our verification team will review your business documents and digital presence. We'll get back to you within 48 hours.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-sm text-slate-500">
            Next step: Watch for an onboarding email from <span className="font-bold text-slate-900">partners@slasham.com</span>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs hover:gap-3 transition-all">
            Back to Home <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {/* Header Overlay */}
      <div className="bg-emerald-600 py-20 px-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
         <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <Link to="/business" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em] mb-4">
               <ArrowLeft size={14} /> Back to Business
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                Merchant <span className="text-emerald-300">Interest Form.</span>
            </h1>
            <p className="text-emerald-100/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                Join our premium network of verified partners. Every application undergoes a rigorous vetting process to ensure platform quality.
            </p>
         </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 px-6 pb-24 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          
          <div className="bg-slate-50 border-b border-slate-100 px-10 py-6 flex flex-wrap gap-8 items-center justify-center md:justify-start">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" /> Legitimacy Check
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Zap size={14} className="text-emerald-500" /> Fast Onboarding
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Sparkles size={14} className="text-emerald-500" /> Exclusive Verified
             </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-16">
            
            {/* Section 1: Business Identity */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                 <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center"><Store size={20}/></div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Business Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Business Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      required
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="e.g. RSVP Lagos"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Category</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <select 
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option>Restaurant</option>
                      <option>Spa & Wellness</option>
                      <option>Nightlife & Bar</option>
                      <option>Hotel & Travel</option>
                      <option>Shopping & Retail</option>
                      <option>Professional Services</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RC Number / Registration ID</label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      required
                      name="rc_number"
                      value={formData.rc_number}
                      onChange={handleChange}
                      placeholder="Enter CAC/Registration No."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Years in Operation</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <select 
                      name="years_in_operation"
                      value={formData.years_in_operation}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option>Less than 1 year</option>
                      <option>1-3 years</option>
                      <option>3-5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Contact Point */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><User size={20}/></div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Contact Person</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      required
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      placeholder="Enter contact person name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role / Designation</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <select 
                      name="contact_role"
                      value={formData.contact_role}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option>Owner</option>
                      <option>Manager</option>
                      <option>Marketing Lead</option>
                      <option>Operations Manager</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="partners@yourbusiness.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 ..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Performance & Goals */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                 <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center"><Target size={20}/></div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Performance & Goals</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Monthly Customers</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <select 
                      name="monthly_customers"
                      value={formData.monthly_customers}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option>0-500</option>
                      <option>500-1,000</option>
                      <option>1,000-5,000</option>
                      <option>5,000+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Avg. Transaction Value (₦)</label>
                  <div className="relative group">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      required
                      name="avg_transaction_value"
                      value={formData.avg_transaction_value}
                      onChange={handleChange}
                      placeholder="e.g. 15,000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Campaign Goal</label>
                  <div className="relative group">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <select 
                      name="primary_goal"
                      value={formData.primary_goal}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option>Increase Foot Traffic</option>
                      <option>Launch New Product/Menu</option>
                      <option>Fill Off-Peak Hours</option>
                      <option>Clear Old Inventory</option>
                      <option>Brand Awareness</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operating Hours</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      required
                      name="operating_hours"
                      value={formData.operating_hours}
                      onChange={handleChange}
                      placeholder="e.g. 9AM - 10PM Daily"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Physical & Digital Presence */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                 <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><Globe size={20}/></div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Presence & Location</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary City</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option>Lagos</option>
                      <option>Abuja</option>
                      <option>Port Harcourt</option>
                      <option>Ibadan</option>
                      <option>Enugu</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website URL</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      name="website_social"
                      value={formData.website_social}
                      onChange={handleChange}
                      placeholder="www.yourbusiness.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instagram Handle</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      required
                      name="instagram_handle"
                      value={formData.instagram_handle}
                      onChange={handleChange}
                      placeholder="@yourbusiness"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <textarea 
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={1}
                      placeholder="Full street address"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Description & Value Proposition</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <textarea 
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us what makes your business unique and why you want to join Slasham..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </section>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                <Zap size={16} /> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Detailed Application...
                </>
              ) : (
                <>
                  Submit Interest Form <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              By submitting, you consent to our verification team contacting you and visiting your physical location if necessary.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
