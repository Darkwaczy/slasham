import { useParams, Link } from "react-router-dom";
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Ticket,
  ArrowLeft,
  Share2,
  Heart,
  Info,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "../api/client";

const businessInfo: Record<string, any> = {
  "rsvp-lagos": {
    name: "RSVP Lagos",
    type: "Upscale Dining",
    location: "Victoria Island, Lagos",
    rating: 4.8,
    reviews: 1240,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=60",
    description: "RSVP is a New American restaurant and bar in the heart of Victoria Island. Inspired by the prohibition era, RSVP offers a unique dining experience with a focus on fresh ingredients and craft cocktails.",
    openingHours: "12:00 PM - 11:00 PM",
    phone: "+234 800 RSVP LAGOS",
    website: "www.rsvplagos.com",
    features: ["Outdoor Seating", "Craft Cocktails", "Live Music", "Valet Parking"]
  },
  "hard-rock-cafe": {
    name: "Hard Rock Cafe",
    type: "Entertainment",
    location: "Victoria Island, Lagos",
    rating: 4.6,
    reviews: 3500,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=60",
    description: "Hard Rock Cafe Lagos is the ultimate destination for fans of music, food, and great times. Located on the beach, it offers a legendary dining experience with rock 'n' roll memorabilia.",
    openingHours: "11:00 AM - 1:00 AM",
    phone: "+234 800 HARD ROCK",
    website: "www.hardrockcafe.com/lagos",
    features: ["Beachfront", "Live Music", "Souvenir Shop", "Kid Friendly"]
  },
  "yellow-chilli": {
    name: "The Yellow Chilli",
    type: "Gourmet Nigerian",
    location: "Ikoyi, Lagos",
    rating: 4.7,
    reviews: 850,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=60",
    description: "The Yellow Chilli is one of Nigeria's finest gourmet restaurants. We offer a unique blend of traditional Nigerian dishes with a modern twist, served in an elegant and sophisticated environment.",
    openingHours: "11:00 AM - 10:00 PM",
    phone: "+234 800 YELLOW CHILLI",
    website: "www.yellowchilling.com",
    features: ["Gourmet Menu", "Private Dining", "Authentic Flavors", "Catering"]
  },
  "nike-art-gallery": {
    name: "Nike Art Gallery",
    type: "Cultural Hub",
    location: "Lekki, Lagos",
    rating: 4.9,
    reviews: 5200,
    image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=60",
    description: "Nike Art Gallery is the largest of its kind in West Africa. Owned by Nike Davies-Okundaye, the gallery houses over 8,000 diverse artworks from various Nigerian artists.",
    openingHours: "10:00 AM - 6:00 PM",
    phone: "+234 800 NIKE ART",
    website: "www.nikeart.com",
    features: ["Art Tours", "Workshops", "Gift Shop", "Cultural Events"]
  },
  "oasis-wellness": {
    name: "Oasis Wellness",
    type: "Spa & Spa",
    location: "Maitama, Abuja",
    rating: 4.8,
    reviews: 620,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=60",
    description: "Oasis Wellness is a sanctuary of peace and tranquility in the heart of Abuja. We offer a wide range of spa treatments designed to rejuvenate your mind, body, and soul.",
    openingHours: "9:00 AM - 8:00 PM",
    phone: "+234 800 OASIS SPA",
    website: "www.oasiswellness.ng",
    features: ["Massage Therapy", "Facials", "Sauna", "Relaxation Lounge"]
  }
};

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const business = id ? businessInfo[id] : null;

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await apiClient("/deals");
        setDeals(data.map((d: any) => ({
          id: d.id,
          title: d.title,
          price: `₦${d.discount_price.toLocaleString()}`,
          original: `₦${d.original_price.toLocaleString()}`,
          image: d.images?.[0] || "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
          category: d.category,
          tag: d.category
        })));
      } catch (error) {
        console.error("Failed to fetch deals for business", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
        <Link to="/" className="text-emerald-600 font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  // Filter deals for this business (using name matching for mock data)
  const businessDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(business.name.toLowerCase()) ||
    business.name.toLowerCase().includes(deal.title.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-100 flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
      )}
      {/* Hero Header */}
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img 
          src={business.image} 
          alt={business.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Top Actions */}
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-20">
          <Link to="/" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
              <Share2 size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
              <Heart size={20} />
            </button>
          </div>
        </div>

        {/* Business Info Overlay */}
        <div className="absolute bottom-12 left-6 right-6 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest">
                  {business.type}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={14} className="fill-current" />
                  <span className="text-sm font-bold text-white">{business.rating}</span>
                  <span className="text-xs text-white/60">({business.reviews} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">{business.name}</h1>
              <p className="text-white/80 flex items-center gap-2 text-lg">
                <MapPin size={18} className="text-emerald-400" /> {business.location}
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">
                View Menu / Catalog
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Left: Info & About */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Info size={24} className="text-emerald-500" /> About the Business
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                {business.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Available Deals</h2>
              {businessDeals.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {businessDeals.map((deal) => (
                    <Link key={deal.id} to={`/deal/${deal.id}`} className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                          {deal.tag}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-600 transition-colors">{deal.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-slate-900">{deal.price}</span>
                            <span className="text-sm text-slate-400 line-through">{deal.original}</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Zap size={18} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 bg-slate-50 rounded-3xl text-center border border-dashed border-slate-200">
                  <Ticket size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No active deals at the moment. Check back soon!</p>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {business.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Contact & Location Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 sticky top-32">
              <h3 className="text-xl font-bold mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Opening Hours</p>
                    <p className="font-bold text-slate-900">{business.openingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                    <p className="font-bold text-slate-900">{business.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Website</p>
                    <p className="font-bold text-emerald-600 hover:underline cursor-pointer">{business.website}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-200">
                <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                  <MapPin size={18} /> Get Directions
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">Verified Partner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
