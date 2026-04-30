import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Scale, FileText, Gavel, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 py-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12">
            <Scale size={300} />
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
            Terms of <span className="text-emerald-500">Service.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Please read these terms carefully before using the Slasham platform. By using our services, you agree to be bound by these terms.
          </p>
          <div className="flex gap-4 mt-10">
             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                <FileText size={14} /> Last Updated: April 30, 2026
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={14} /> Version 1.2
             </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="space-y-16">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">01</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Agreement to Terms</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <p>
                By accessing or using the Slasham marketplace ("Platform"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
              </p>
              <p>
                Slasham reserves the right to modify these terms at any time. Changes will be effective immediately upon posting to the Platform.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">02</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">The Slasham Model</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <p>
                Slasham provides a platform where users can purchase "Coupons" or "Vouchers" that enable them to access discounted products and services at partner Merchant locations.
              </p>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl">
                 <p className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertCircle size={14} /> Important Disclaimer
                 </p>
                 <p className="text-emerald-800 text-sm italic">
                    "The purchase price paid on Slasham is a service fee for access to the exclusive discount. The final payment for products or services is made directly to the Merchant at their physical or digital location."
                 </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">03</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Voucher Redemption</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <ul className="space-y-4 list-disc pl-5">
                <li>Vouchers must be presented to the Merchant for validation before the service is rendered.</li>
                <li>Each voucher has a specific expiry date. Expired vouchers are non-refundable and cannot be redeemed.</li>
                <li>Merchant availability and scheduling are the sole responsibility of the Merchant. We recommend contacting the Merchant before visiting.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">04</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Transaction Verification</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <p>
                To ensure a secure marketplace, users are required to verify the completion of their transaction with the Merchant by entering a unique **Verification PIN** in the Slasham app after the service is provided.
              </p>
              <p>
                Failure to verify a transaction may result in the suspension of points rewards or restricted access to future "Hot Deals."
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">05</div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Refund Policy</h2>
            </div>
            <div className="text-slate-600 font-medium leading-relaxed space-y-4 ml-13">
              <p>
                Coupon sales on Slasham are final. Refunds are only considered if:
              </p>
              <ul className="space-y-4 list-disc pl-5">
                <li>The Merchant has permanently closed their business.</li>
                <li>The Merchant refuses to honor the valid, unexpired voucher.</li>
                <li>There is a technical error in the Slasham platform that prevents redemption.</li>
              </ul>
            </div>
          </section>

          <div className="pt-20 border-t border-slate-100 text-center">
             <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                <Gavel size={16} /> Legal Compliance Dept.
             </div>
             <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Slasham Marketplace Nigeria © 2026. All Rights Reserved.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
