import React from "react";
import { TrendingUp, Users, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function Lagos() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="relative h-[500px] rounded-[40px] overflow-hidden mb-16">
        <img src="https://images.unsplash.com/photo-1576613109771-46328635832a?auto=format&fit=crop&w=1200&q=80" alt="Lagos" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest mb-4">
            Active City
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">Lagos</h1>
          <p className="text-xl text-white/80 max-w-xl">The center of excellence. Discover premium deals in Victoria Island, Ikoyi, Lekki, and beyond.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-24">
        <h2 className="text-4xl font-bold mb-8">Discover the Center of Excellence</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          Lagos, the bustling economic hub of Nigeria, is a city that never sleeps. Known for its vibrant nightlife, stunning beaches, and thriving business scene, Lagos is a melting pot of culture, creativity, and opportunity.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          From the upscale restaurants of Victoria Island to the serene beaches of Lekki, Lagos offers an endless array of experiences. With Slasham, you can unlock exclusive deals and enjoy the very best that this dynamic city has to offer.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-24">
        {[
          { title: "Victoria Island Luxury", desc: "Indulge in premium dining, high-end shopping, and vibrant nightlife in the heart of Lagos.", img: "https://images.unsplash.com/photo-1582407947313-f89552171545?auto=format&fit=crop&w=800&q=80" },
          { title: "Lekki Serenity", desc: "Relax by the beach, explore modern shopping malls, and enjoy top-tier hospitality in Lekki.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" }
        ].map((place, i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <img src={place.img} alt={place.title} className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">{place.title}</h3>
              <p className="text-slate-600">{place.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
            <Store size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-2">500+ Partners</h3>
          <p className="text-slate-500">The best restaurants, spas, and clubs in Lagos are now on Slasham.</p>
        </div>
        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-2">45,000+ Members</h3>
          <p className="text-slate-500">Join the largest community of active spenders in the Center of Excellence.</p>
        </div>
        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-2">₦120M+ Saved</h3>
          <p className="text-slate-500">Lagosians are saving big on premium experiences every single day.</p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to explore Lagos?</h2>
        <Link to="/deals" className="inline-flex items-center gap-2 px-10 py-5 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all">
          Browse Lagos Deals
        </Link>
      </div>
    </div>
  );
}
