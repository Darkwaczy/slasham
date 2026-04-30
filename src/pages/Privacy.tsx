import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Eye, Lock, Globe, Database } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 py-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-5 -rotate-12">
            <ShieldCheck size={300} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-all group mb-12 uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-6">
            Privacy <span className="text-emerald-500">Policy.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Your trust is our most valuable asset. We are committed to protecting your personal data and being transparent about how we use it.
          </p>
          <div className="flex gap-4 mt-10">
             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Globe size={14} /> NDPR Compliant
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-slate-900/10">
                <Database size={14} /> Secure Storage
             </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="space-y-16">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black">01</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Data Collection</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <p>
                To provide you with exclusive deals, we collect personal information including:
              </p>
              <ul className="space-y-4 list-disc pl-5">
                <li><strong className="text-slate-900">Identity Data:</strong> Name, email address, and phone number.</li>
                <li><strong className="text-slate-900">Transaction Data:</strong> Details about coupons purchased and vouchers redeemed.</li>
                <li><strong className="text-slate-900">Technical Data:</strong> IP address, browser type, and device information for security and optimization.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black">02</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">How We Use Data</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <p>
                We process your data to:
              </p>
              <ul className="space-y-4 list-disc pl-5">
                <li>Facilitate the purchase and redemption of digital vouchers.</li>
                <li>Verify transaction completion with Merchants.</li>
                <li>Send transactional emails and security alerts.</li>
                <li>Improve our platform via analytics and customer support interactions.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black">03</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Data Sharing</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <p>
                We share your name and voucher code with the specific **Merchant** you have chosen to visit. This is necessary to validate your discount.
              </p>
              <p className="font-black text-slate-900">
                We NEVER sell your personal data to third-party advertisers.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black">04</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Security</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <div className="bg-slate-900 p-8 rounded-4xl text-white space-y-4">
                 <div className="flex items-center gap-3 text-emerald-400">
                    <Lock size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Enterprise Encryption</span>
                 </div>
                 <p className="text-sm font-medium text-slate-400 leading-relaxed">
                    All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We use secure cloud infrastructure with 24/7 monitoring to prevent unauthorized access.
                 </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black">05</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Your Rights</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <p>
                Under the Nigeria Data Protection Regulation (NDPR), you have the right to:
              </p>
              <ul className="space-y-4 list-disc pl-5">
                <li>Access your personal data.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your account and data.</li>
                <li>Object to the processing of your data for direct marketing.</li>
              </ul>
            </div>
          </section>

          <div className="pt-20 border-t border-slate-100 text-center">
             <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                <Eye size={16} /> Privacy Trust Center
             </div>
             <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Contact: <span className="text-slate-900">privacy@slasham.com</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
