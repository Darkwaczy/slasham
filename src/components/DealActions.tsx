import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

interface FavoriteButtonProps {}

export function FavoriteButton({}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <button 
      onClick={toggleFavorite}
      className="p-3 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
      aria-label="Add to favorites"
    >
      <Heart size={24} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-600"} />
    </button>
  );
}

interface ShareButtonProps {
  dealId: number;
  title: string;
}

export function ShareButton({ dealId, title }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.origin + `/deal/${dealId}`,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/deal/${dealId}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="p-3 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
      aria-label="Share deal"
    >
      <Share2 size={24} className="text-slate-600" />
    </button>
  );
}
