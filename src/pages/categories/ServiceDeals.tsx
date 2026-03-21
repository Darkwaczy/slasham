import React from "react";
import { Settings } from "lucide-react";
import DealCard from "../../components/DealCard";

export default function ServiceDeals() {
  const deals = [
    { id: 13, title: "Professional Car Detailing", price: "₦15,000", original: "₦25,000", image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=400&q=60" },
    { id: 14, title: "Home Deep Cleaning Service", price: "₦20,000", original: "₦35,000", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&w=400&q=60" },
    { id: 15, title: "1-on-1 Personal Training Session", price: "₦10,000", original: "₦18,000", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=60" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
          <Settings size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Services</h1>
          <p className="text-slate-500">Expert help for your home, car, and life.</p>
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
