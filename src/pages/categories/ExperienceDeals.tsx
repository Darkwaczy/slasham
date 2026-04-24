import { Sparkles } from "lucide-react";
import DealCard from "../../components/DealCard";

const now = new Date();
const in2hrs   = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
const in4Days  = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export default function ExperienceDeals() {
  const deals = [
    { id: 4, title: "Skydiving over Abuja",        price: "₦150,000", original: "₦250,000", image: "https://images.unsplash.com/photo-1521017432521-f34f729bb917?auto=format&fit=crop&w=400&q=60", totalQuantity: 20, soldQuantity: 17, expiryDate: in2hrs   },
    { id: 5, title: "Sunset Boat Cruise in Lagos", price: "₦25,000",  original: "₦40,000",  image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=60", totalQuantity: 40, soldQuantity: 25, expiryDate: in4Days  },
    { id: 6, title: "Paint & Sip Experience",      price: "₦12,000",  original: "₦20,000",  image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&q=60", totalQuantity: 60, soldQuantity: 19, expiryDate: in14Days },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
          <Sparkles size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Experiences</h1>
          <p className="text-slate-500">Unforgettable moments at unbeatable prices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            id={deal.id}
            title={deal.title}
            price={deal.price}
            original={deal.original}
            image={deal.image}
            totalQuantity={deal.totalQuantity}
            soldQuantity={deal.soldQuantity}
            expiryDate={deal.expiryDate}
          />
        ))}
      </div>
    </div>
  );
}
