import { ArrowRight, MapPin } from "lucide-react";

const deals: any[] = [];

export default function Concept5() {
  return (
    <div className="bg-[#F9FAFB] text-[#111827] font-sans">
      {/* HERO: Clean Utility / Minimal */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center border-b border-gray-200">
        <div className="pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-md bg-white text-gray-600 font-mono text-xs mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            SYS.STATUS: LIVE_LAG_ABJ
          </div>
          <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Pay small.<br />
            <span className="text-gray-400">Unlock more.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-md">
            Discover exclusive deals that give you more value when you spend. Stop paying full price for the experiences you love.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
              Explore Deals <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-4/3 rounded-xl overflow-hidden border border-gray-200 bg-white p-2 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
              alt="People enjoying food" 
              className="w-full h-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* DEALS: 4x4 Grid (Minimal Style) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Trending Deals</h2>
            <p className="text-sm text-gray-500 font-mono">DATA.SET: TOP_8</p>
          </div>
          <button className="text-sm font-medium flex items-center gap-2 hover:text-gray-500 transition-colors">
            View all <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors flex flex-col group">
              <div className="aspect-4/3 relative border-b border-gray-100">
                <div className="absolute top-2 left-2 z-10 bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-mono text-gray-600">
                  {deal.tag}
                </div>
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="p-4 flex flex-col grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{deal.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
                  <MapPin size={12} /> <span className="line-clamp-1">{deal.location}</span>
                </div>
                
                <div className="mt-auto flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-500 font-mono mb-0.5">CPN_PRICE</p>
                    <p className="text-base font-semibold text-black">{deal.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-mono mb-0.5">EST_VALUE</p>
                    <p className="text-sm font-medium text-gray-400 line-through">{deal.original}</p>
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
