import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function FavoriteButton({ dealId, deal, className = "" }: { dealId: number | string; deal?: any; className?: string }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('slasham_saved_deals') || '[]');
      if (saved.find((d: any) => String(d.id) === String(dealId))) {
        setIsSaved(true);
      }
    } catch {
      // ignore
    }
  }, [dealId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSaved(!isSaved);
    
    if (deal) {
      try {
        const saved = JSON.parse(localStorage.getItem('slasham_saved_deals') || '[]');
        if (!isSaved) {
          localStorage.setItem('slasham_saved_deals', JSON.stringify([...saved, deal]));
        } else {
          localStorage.setItem('slasham_saved_deals', JSON.stringify(saved.filter((d: any) => String(d.id) !== String(dealId))));
        }
        window.dispatchEvent(new Event('savedDealsUpdate'));
      } catch (err) {
        console.error("Save failed", err);
      }
    }
  };

  return (
    <button 
      onClick={toggleFavorite}
      title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      className={`p-2 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all outline-none border border-slate-100 ${className}`}
    >
      <Heart 
        size={14} 
        className={`transition-all duration-300 ${isSaved ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-400 hover:text-rose-400"}`} 
      />
    </button>
  );
}
