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

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // 1. Fetch Merchant Details
        const merchant = await apiClient(`/merchants/public/${id}`);
        setBusiness({
          name: merchant.business_name,
          type: merchant.category || "Verified Partner",
          location: merchant.address || merchant.city,
          rating: 4.8, // Fallback for now as reviews table might be empty
          reviews: 0,
          image: merchant.banner_url || "",
          description: merchant.description || "No description provided.",
          openingHours: "Open Daily",
          phone: merchant.phone || "Not provided",
          website: merchant.website || "No website",
          features: ["Verified Partner", "Secure Payments"]
        });

        // 2. Fetch Merchant's Deals
        const dealsData = await apiClient(`/deals?merchant_id=${merchant.id}`);
        setDeals(dealsData.map((d: any) => ({
          id: d.id,
          title: d.title,
          price: `₦${d.discount_price.toLocaleString()}`,
          original: `₦${d.original_price.toLocaleString()}`,
          image: d.images?.[0] || "",
          category: d.category,
          tag: d.category
        })));
      } catch (error) {
        console.error("Failed to fetch business detail", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const businessDeals = deals;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

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

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        {business.image ? (
          <img
            src={business.image}
            alt={business.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
            No business image
          </div>
        )}
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
                        {deal.image ? (
                          <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
                            No image
                          </div>
                        )}
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

