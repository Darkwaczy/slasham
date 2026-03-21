import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-5xl font-bold mb-8 text-slate-900">Contact Us</h1>
      <p className="text-xl text-slate-600 mb-12 leading-relaxed">
        Have questions, feedback, or just want to say hello? We'd love to hear from you. Our dedicated support team is here to assist you with any inquiries you may have.
      </p>
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: <Mail className="text-emerald-500" />, title: "Email Support", desc: "For general inquiries and support, reach out to us at support@slasham.com. We aim to respond within 24 hours." },
          { icon: <Phone className="text-blue-500" />, title: "Call Us", desc: "Need immediate assistance? Give us a call at +234 800 123 4567. Our lines are open from 9 AM to 6 PM." },
          { icon: <MapPin className="text-rose-500" />, title: "Visit Our Office", desc: "Drop by our headquarters at 123 Business Way, Abuja, Nigeria. We'd love to meet you in person." }
        ].map((item, i) => (
          <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="mx-auto mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="p-12 bg-slate-900 rounded-[3rem] text-white">
        <h2 className="text-3xl font-bold mb-6">Business Partnerships</h2>
        <p className="text-slate-400 leading-relaxed">
          Are you a business owner looking to partner with Slasham? We'd love to hear from you. Please fill out our <Link to="/business/list" className="text-emerald-400 font-bold hover:underline">business registration form</Link> or email us directly at partners@slasham.com.
        </p>
      </div>
    </div>
  );
}
