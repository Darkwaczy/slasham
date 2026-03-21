import React from "react";
import { Newspaper } from "lucide-react";

export default function Press() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-5xl font-bold mb-8 text-slate-900">Press & Media</h1>
      <p className="text-xl text-slate-600 mb-12 leading-relaxed">
        Stay updated with the latest news, announcements, and media coverage about Slasham. We are constantly evolving and making headlines as we redefine the local experience economy.
      </p>
      <div className="space-y-8">
        {[
          { title: "Slasham Secures $2M in Seed Funding", date: "March 15, 2026", desc: "We are thrilled to announce our latest funding round to accelerate our expansion across Africa. This investment will allow us to scale our operations, enhance our technology platform, and bring the Slasham experience to even more cities." },
          { title: "Slasham Partners with Top 50 Local Businesses in Abuja", date: "February 20, 2026", desc: "Our partnership program continues to grow, with 50 of Abuja's most popular businesses now offering exclusive deals through Slasham." },
          { title: "Slasham Launches New Loyalty Ecosystem", date: "January 10, 2026", desc: "We've introduced a comprehensive loyalty program that rewards users for every redemption, making it easier than ever to earn points and unlock premium perks." }
        ].map((item, i) => (
          <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <Newspaper className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-500 mb-4">{item.date}</p>
            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
