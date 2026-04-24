import { Package } from "lucide-react";
import DealCard from "../../components/DealCard";

const now = new Date();
const in5hrs   = new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString();
const in3Days  = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const in10Days = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export default function ProductDeals() {
  const deals = [
    { id: 10, title: "Premium Leather Wallet",               price: "₦12,000", original: "₦25,000", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=60", totalQuantity: 50, soldQuantity: 38, expiryDate: in5hrs   },
    { id: 11, title: "Wireless Noise Cancelling Headphones", price: "₦45,000", original: "₦80,000", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=60", totalQuantity: 30, soldQuantity: 27, expiryDate: in3Days  },
    { id: 12, title: "Organic Skincare Set",                 price: "₦18,000", original: "₦30,000", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=60", totalQuantity: 75, soldQuantity: 29, expiryDate: in10Days },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
          <Package size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Products</h1>
          <p className="text-slate-500">Curated items at exclusive member prices.</p>
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
