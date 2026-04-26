import { ArrowRight, MapPin } from "lucide-react";

const deals: any[] = [];

export default function Concept3() {
  return (
    <div className="bg-white text-black font-sans border-x-8 border-black min-h-screen">
      {/* HERO: Brutalist */}
      <section className="border-b-8 border-black grid lg:grid-cols-2">
        <div className="p-12 lg:p-20 flex flex-col justify-center border-b-8 lg:border-b-0 lg:border-r-8 border-black bg-[#F4F4F0]">
          <div className="inline-block border-4 border-black bg-[#FFD700] px-4 py-2 font-bold uppercase tracking-widest mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-max">
            Live in Lagos & Abuja
          </div>
          <h1 className="text-6xl lg:text-8xl font-black uppercase leading-[0.9] mb-8">
            Pay Small.<br />
            <span className="text-[#00C896]">Unlock More.</span>
          </h1>
          <p className="text-xl font-medium mb-10 border-l-4 border-black pl-4">
            Discover exclusive deals that give you more value when you spend. Stop paying full price.
          </p>
          <div className="flex flex-wrap gap-6">
            <button className="px-8 py-4 bg-[#00C896] text-black border-4 border-black font-black uppercase text-lg hover:-translate-y-1 hover:translate-x-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
              Explore Deals <ArrowRight size={24} />
            </button>
          </div>
        </div>
        <div className="relative bg-[#FF6B6B] p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full aspect-square border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
            <img 
              src="https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?q=80&w=1000&auto=format&fit=crop" 
              alt="Lagos Vibe" 
              className="w-full h-full object-cover mix-blend-hard-light"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-b-8 border-black bg-[#FFD700] overflow-hidden py-4 flex whitespace-nowrap">
        <div className="animate-blob font-black uppercase text-2xl tracking-widest flex gap-8">
          <span>🔥 TRENDING DEALS</span>
          <span>🔥 MASSIVE SAVINGS</span>
          <span>🔥 LAGOS & ABUJA</span>
          <span>🔥 TRENDING DEALS</span>
          <span>🔥 MASSIVE SAVINGS</span>
          <span>🔥 LAGOS & ABUJA</span>
        </div>
      </div>

      {/* DEALS: 4x4 Grid (Brutalist Style) */}
      <section className="p-8 lg:p-16 bg-[#F4F4F0]">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-5xl font-black uppercase">Trending Now</h2>
          <button className="font-black uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
              <div className="aspect-4/3 border-b-4 border-black relative">
                <div className="absolute top-0 left-0 bg-[#FFD700] border-r-4 border-b-4 border-black px-3 py-1 font-black uppercase text-xs z-10">
                  {deal.tag}
                </div>
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
              </div>
              <div className="p-5 flex flex-col grow">
                <h3 className="text-xl font-black uppercase mb-2 line-clamp-1">{deal.title}</h3>
                <div className="flex items-center gap-1 font-bold text-sm mb-6">
                  <MapPin size={16} /> <span className="line-clamp-1">{deal.location}</span>
                </div>
                <div className="mt-auto pt-4 border-t-4 border-black flex items-center justify-between bg-[#00C896] -mx-5 -mb-5 p-5">
                  <div>
                    <p className="text-xs font-black uppercase mb-1">Pay</p>
                    <p className="text-2xl font-black">{deal.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase mb-1">Value</p>
                    <p className="text-lg font-bold line-through opacity-70">{deal.original}</p>
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
