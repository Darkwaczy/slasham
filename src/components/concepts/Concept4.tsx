import { ArrowRight, MapPin } from "lucide-react";
import { deals } from "../../data/mockData";

export default function Concept4() {
  return (
    <div className="bg-[#FDFBF7] text-[#2D3748] font-sans">
      {/* HERO: Warm Organic */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E8EFE9] text-[#2F5A36] font-medium text-sm mb-8">
            Now live in Abuja & Lagos
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif font-medium tracking-tight mb-6 text-[#1A202C]">
            Pay small.<br />
            <span className="text-[#386641]">Unlock more.</span>
          </h1>
          <p className="text-xl text-[#4A5568] mb-10 max-w-lg leading-relaxed">
            Discover exclusive deals that give you more value when you spend. Stop paying full price for the experiences you love.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-[#386641] text-white rounded-full font-medium hover:bg-[#2F5A36] transition-colors flex items-center gap-2">
              Explore Deals <ArrowRight size={20} />
            </button>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="w-full max-w-md aspect-[3/4] rounded-[100px] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
              alt="People enjoying food" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decorative organic shape */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#E8EFE9] rounded-full -z-10"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F6E8D5] rounded-full -z-10"></div>
        </div>
      </section>

      {/* DEALS: 4x4 Grid (Organic Style) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif font-medium mb-2 text-[#1A202C]">Trending Deals</h2>
            <p className="text-[#718096]">Grab these before they sell out.</p>
          </div>
          <button className="text-[#386641] font-medium flex items-center gap-2 hover:gap-3 transition-all">
            View all <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col">
              <div className="aspect-[4/3] relative p-2">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#2D3748]">
                    {deal.tag}
                  </div>
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[#386641] text-xs font-medium uppercase tracking-wider mb-2">{deal.category}</span>
                <h3 className="text-lg font-serif font-medium mb-1 text-[#1A202C] line-clamp-1">{deal.title}</h3>
                <div className="flex items-center gap-1 text-[#718096] text-sm mb-6">
                  <MapPin size={14} /> <span className="line-clamp-1">{deal.location}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#A0AEC0] uppercase font-medium mb-0.5">Coupon</p>
                    <p className="text-xl font-medium text-[#386641]">{deal.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#A0AEC0] uppercase font-medium mb-0.5">Value</p>
                    <p className="text-sm font-medium text-[#A0AEC0] line-through">{deal.original}</p>
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
