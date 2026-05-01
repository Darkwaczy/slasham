import { Heart } from "lucide-react";
import DealCard from "../../components/DealCard";
import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";

export default function BeautyDeals() {
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await apiClient("/deals?category=Beauty & Spas");
        const formattedDeals = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          price: d.discount_price.toString(),
          original: d.original_price.toString(),
          couponPrice: d.coupon_price?.toString() || "100",
          image: d.images?.[0] || "",
          category: d.category,
          location: d.merchants?.city || "",
          expiryDate: d.expiry_date,
          totalQuantity: d.total_quantity,
          soldQuantity: d.sold_quantity,
          dealExplanation: d.deal_explanation,
        }));
        setDeals(formattedDeals);
      } catch (error) {
        console.error("Failed to fetch beauty deals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
          <Heart size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Beauty & Spas</h1>
          <p className="text-slate-500">Self-care that doesn't break the bank.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              id={deal.id}
              title={deal.title}
              price={deal.price}
              original={deal.original}
              image={deal.image}
              category={deal.category}
              location={deal.location}
              expiryDate={deal.expiryDate}
              totalQuantity={deal.totalQuantity}
              soldQuantity={deal.soldQuantity}
              dealExplanation={deal.dealExplanation}
            />
          ))}
          {deals.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active beauty & spas deals at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

