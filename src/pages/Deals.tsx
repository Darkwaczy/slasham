import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Zap } from "lucide-react";
import gsap from "gsap";
import { deals } from "../data/mockData";

export default function Deals() {
  useEffect(() => {
    gsap.fromTo(
      ".deal-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-slate-900 tracking-tight">Explore Deals</h1>
          <p className="text-xl text-slate-500">Find the best value in your city.</p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
          <button className="px-6 py-2 rounded-full bg-slate-900 text-white font-bold whitespace-nowrap shadow-sm">All Deals</button>
          <button className="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shadow-sm">Food & Drinks</button>
          <button className="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shadow-sm">Nightlife</button>
          <button className="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shadow-sm">Beauty & Spa</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((deal) => (
          <Link to={`/deal/${deal.id}`} key={deal.id} className="deal-card group relative bg-white border-2 border-slate-100 hover:border-teal-500 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex flex-col">
            {deal.tag && (
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-teal-700 border border-teal-100 shadow-sm flex items-center gap-1">
                <Zap size={14} className="text-amber-500 fill-amber-500" /> {deal.tag}
              </div>
            )}
            <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
              <img 
                src={deal.image} 
                alt={deal.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-3 font-medium">
                <MapPin size={16} className="text-teal-600" /> {deal.location}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">{deal.title}</h3>
              <p className="text-slate-500 mb-6 line-clamp-2 flex-grow">Get amazing discounts when you purchase this deal through Slasham. Valid for a limited time.</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Coupon Price</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-slate-900">{deal.price}</p>
                    <p className="text-sm text-slate-400 line-through">{deal.original}</p>
                  </div>
                </div>
                <div className="bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white px-5 py-2.5 rounded-full font-semibold transition-colors">
                  Get Deal
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
