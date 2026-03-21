import React from "react";
import { Utensils } from "lucide-react";
import DealCard from "../../components/DealCard";

export default function FoodDeals() {
  const deals = [
    { id: 1, title: "50% Off Lunch at The Grill House", price: "₦5,000", original: "₦10,000", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=60" },
    { id: 2, title: "Buy 1 Get 1 Free Cocktails at SkyBar", price: "₦3,500", original: "₦7,000", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=60" },
    { id: 3, title: "₦10,000 Voucher for ₦6,000 at Mama's Kitchen", price: "₦6,000", original: "₦10,000", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=60" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
          <Utensils size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Food & Drinks</h1>
          <p className="text-slate-500">The best dining experiences in your city for less.</p>
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
          />
        ))}
      </div>
    </div>
  );
}
