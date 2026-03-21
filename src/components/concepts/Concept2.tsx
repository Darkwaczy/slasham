import { ArrowRight, MapPin } from "lucide-react";
import { deals } from "../../data/mockData";

export default function Concept2() {
  return (
    <div className="bg-white text-black font-sans">
      {/* HERO: Editorial / Magazine */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 z-10">
          <p className="text-sm uppercase tracking-[0.2em] mb-6 font-semibold">The New Standard</p>
          <h1 className="text-6xl lg:text-8xl font-serif font-light leading-[0.9] tracking-tight mb-8">
            Pay small.<br />
            <span className="italic">Unlock more.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-md font-light leading-relaxed">
            Discover exclusive deals that give you more value when you spend. Stop paying full price for the experiences you love in Lagos and Abuja.
          </p>
          <div className="flex gap-6 items-center">
            <button className="border-b-2 border-black pb-1 font-semibold hover:text-gray-600 hover:border-gray-600 transition-colors flex items-center gap-2">
              Explore Deals <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="lg:col-span-7 relative">
          <div className="aspect-[3/2] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1517594422361-5e18a40060f2?q=80&w=1200&auto=format&fit=crop" 
              alt="Editorial Lifestyle" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* DEALS: 4x4 Grid (Editorial Style) */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-black">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-serif italic">Trending Experiences</h2>
          <button className="text-sm uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity">
            View Collection
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {deals.map((deal) => (
            <div key={deal.id} className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden mb-4">
                <img 
                  src={deal.image} 
                  alt={deal.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-medium line-clamp-1">{deal.title}</h3>
                <span className="text-sm font-semibold">{deal.price}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                <MapPin size={14} /> <span>{deal.location}</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-400">
                <span>{deal.category}</span>
                <span className="line-through">{deal.original}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
