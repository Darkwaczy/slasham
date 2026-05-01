import { Store, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Abuja() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="relative h-[500px] rounded-[40px] overflow-hidden mb-16">
        <img src="https://picsum.photos/seed/abuja-hero/1200/500" alt="Abuja" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest mb-4">
            Active City
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">Abuja</h1>
          <p className="text-xl text-white/80 max-w-xl">The heart of Nigeria. Discover premium deals in Wuse, Garki, Maitama, and beyond.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-24">
        <h2 className="text-4xl font-bold mb-8">Discover the Capital</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          Abuja, the capital city of Nigeria, is known for its stunning architecture, lush greenery, and vibrant culture. From the iconic Aso Rock to the bustling markets of Wuse, Abuja offers a unique blend of modern convenience and traditional charm.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Whether you're looking for fine dining in Maitama, a relaxing spa day in Garki, or an exciting night out in Wuse, Abuja has something for everyone. With Slasham, you can explore the best of the city for less.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-24">
        {[
          { title: "Maitama Splendor", desc: "Experience luxury dining and high-end shopping in one of Abuja's most prestigious districts.", img: "https://picsum.photos/seed/maitama-abuja/800/400" },
          { title: "Wuse Vibrancy", desc: "Dive into the heart of Abuja's social scene with top-rated restaurants, bars, and entertainment venues.", img: "https://picsum.photos/seed/wuse-abuja/800/400" }
        ].map((place, i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <img src={place.img} alt={place.title} className="w-full h-64 object-cover" />
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
          <h3 className="text-2xl font-bold mb-2">200+ Partners</h3>
          <p className="text-slate-500">From fine dining to luxury spas, we've got you covered.</p>
        </div>
        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-2">15,000+ Members</h3>
          <p className="text-slate-500">Join the largest community of active spenders in the FCT.</p>
        </div>
        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-2">₦50M+ Saved</h3>
          <p className="text-slate-500">Our members have saved millions on premium experiences.</p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to explore Abuja?</h2>
        <Link to="/deals" className="inline-flex items-center gap-2 px-10 py-5 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all">
          Browse Abuja Deals
        </Link>
      </div>
    </div>
  );
}
