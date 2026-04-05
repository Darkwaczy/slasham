import { Link } from "react-router-dom";
import { Share2, ArrowRight } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

interface DealCardProps {
  id: number;
  title: string;
  price: string;
  original: string;
  image: string;
  key?: React.Key;
}

export default function DealCard({ id, title, price, original, image }: DealCardProps) {
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
      navigator.clipboard.writeText(window.location.origin + `/deal/${id}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Link to={`/deal/${id}`} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all relative flex flex-col h-full">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <FavoriteButton dealId={id} className="" />
        <button 
          onClick={handleShare}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Share2 size={20} className="text-slate-600" />
        </button>
      </div>
      <div className="aspect-4/3 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-100" 
          referrerPolicy="no-referrer" 
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=70" }}
        />
      </div>
      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold mb-2 text-slate-900 line-clamp-2">{title}</h3>
        <div className="flex items-center gap-3 mt-auto pt-4">
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
