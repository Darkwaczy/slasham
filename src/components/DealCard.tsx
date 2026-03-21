import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart, Share2, ArrowRight } from "lucide-react";

interface DealCardProps {
  id: number;
  title: string;
  price: string;
  original: string;
  image: string;
  key?: React.Key;
}

export default function DealCard({ id, title, price, original, image }: DealCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.origin + `/deal/${id}`,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/deal/${id}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Link to={`/deal/${id}`} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button 
          onClick={toggleFavorite}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart size={20} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-600"} />
        </button>
        <button 
          onClick={handleShare}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Share2 size={20} className="text-slate-600" />
        </button>
      </div>
      <div className="aspect-[4/3] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-emerald-600 font-bold text-lg">{price}</span>
          <span className="text-slate-400 line-through text-sm">{original}</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
          View Deal <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
