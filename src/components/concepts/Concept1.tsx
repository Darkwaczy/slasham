import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { deals } from "../../data/mockData";

export default function Concept1() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* HERO: Modern Fintech */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live in Lagos & Abuja
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Pay small. <br />
            <span className="text-emerald-600">Unlock more.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg">
            Discover exclusive deals that give you more value when you spend. Stop paying full price for the experiences you love.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2">
              Explore Deals <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-gray-50 text-gray-700 rounded-full font-bold hover:bg-gray-100 transition-colors">
              How it works
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-50 translate-x-10 translate-y-10"></div>
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
              alt="People enjoying food" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Coupon Redeemed</p>
                <p className="text-gray-900 font-bold">Saved ₦15,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEALS: 4x4 Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trending Deals</h2>
            <p className="text-gray-500">Grab these before they sell out.</p>
          </div>
          <button className="text-emerald-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            View all <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col">
              <div className="aspect-[4/3] relative">
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                  {deal.tag}
                </div>
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">{deal.category}</span>
                <h3 className="text-lg font-bold mb-1 text-gray-900 line-clamp-1">{deal.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                  <MapPin size={14} /> <span className="line-clamp-1">{deal.location}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-0.5">Coupon</p>
                    <p className="text-xl font-bold text-emerald-600">{deal.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-0.5">Value</p>
                    <p className="text-sm font-semibold text-gray-400 line-through">{deal.original}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
