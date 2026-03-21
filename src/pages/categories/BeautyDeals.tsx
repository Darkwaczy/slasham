import React from "react";
import { Heart } from "lucide-react";
import DealCard from "../../components/DealCard";

export default function BeautyDeals() {
  const deals = [
    { id: 7, title: "Full Body Massage at Oasis Spa", price: "₦15,000", original: "₦30,000", image: "https://images.unsplash.com/photo-1544161515-4508f5ad4c14?auto=format&fit=crop&w=400&q=60" },
    { id: 8, title: "Hydrafacial & Skin Consultation", price: "₦25,000", original: "₦45,000", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=60" },
    { id: 9, title: "Manicure & Pedicure Package", price: "₦8,000", original: "₦15,000", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&q=60" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
          <Heart size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Beauty & Wellness</h1>
          <p className="text-slate-500">Self-care that doesn't break the bank.</p>
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
