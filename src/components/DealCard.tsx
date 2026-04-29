import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MapPin, Timer, ArrowRight, Star, ShoppingBag } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

interface DealCardProps {
  id: string;
  title: string;
  price: string | number;
  original: string | number;
  image?: string;
  category?: string;
  location?: string;
  totalQuantity?: number;
  soldQuantity?: number;
  expiryDate?: string;
  rating?: number;
  reviewCount?: number;
  dealExplanation?: string;
  imagePosition?: string;
  merchantName?: string;
}

const parseNumber = (value: string | number) => {
  if (typeof value === "number") return value;
  const numeric = String(value).replace(/[^0-9.]/g, "");
  return numeric ? Number(numeric) : 0;
};

const formatNaira = (amount: number) => {
  return `₦${amount.toLocaleString("en-NG")}`;
};

function useCountdown(expiryDate?: string) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiryDate) return;
    const calculateTimeLeft = () => {
      const diff = new Date(expiryDate).getTime() - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
}

const DealCard = React.memo<DealCardProps>(({
  id,
  title,
  price,
  original,
  image,
  category = "Retail",
  location = "Location unavailable",
  totalQuantity = 100,
  soldQuantity = 0,
  expiryDate,
  rating = 4.5,
  reviewCount = 120,
  imagePosition = "center 33%",
  merchantName,
}) => {
  const { hours, minutes, seconds } = useCountdown(expiryDate);
  const originalVal = parseNumber(original);
  const discountedVal = parseNumber(price);
  const savings = originalVal - discountedVal;
  const discountPercent = originalVal > 0 ? Math.round((savings / originalVal) * 100) : 0;
  const progressPercent = Math.min((soldQuantity / totalQuantity) * 100, 100);
  const remaining = totalQuantity - soldQuantity;

  return (
    <div style={{ 
      width: "100%",
      maxWidth: "100%", 
      margin: "0 auto",
      backgroundColor: "#fff",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      display: "flex",
      flexDirection: "column",
      border: "1px solid #f1f5f9",
      height: "100%",
      position: "relative",
      fontFamily: "'DM Sans', sans-serif",
    }} className="group">
      <Link to={`/deal/${id}`} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Image Section */}
        <div style={{ position: "relative", width: "100%", height: "220px", overflow: "hidden", background: "#e8e8e8", flexShrink: 0 }}>
          {image ? (
            <img
              src={image}
              alt={title}
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                objectPosition: imagePosition, 
                display: "block" 
              }}
              className="transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 bg-slate-100">
              <ShoppingBag size={26} />
              <span className="text-[10px] font-black uppercase tracking-widest">No image</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 10 }}>
            <div style={{ backgroundColor: "#f97316", color: "#fff", padding: "6px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
              {discountPercent}% OFF
            </div>
          </div>
          
          <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: "700", color: "#334155", zIndex: 10 }}>
            {category}
          </div>

          <FavoriteButton dealId={id.toString()} deal={{id: id.toString(), title, price, original, image, category, location}} className="absolute bottom-3 right-3 z-20" />
        </div>

        {/* Content Section */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
             <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3EB28F" }}></div>
             <span style={{ fontSize: "10px", fontWeight: "900", color: "#f97316", textTransform: "uppercase", letterSpacing: "0.1em" }}>{merchantName || "Verified Partner"}</span>
          </div>

          <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", lineHeight: "1.3", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
            {title}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
               <MapPin size={12} color="#94a3b8" />
               <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>{location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto" }}>
               <Star size={12} color="#facc15" fill="#facc15" />
               <span style={{ fontSize: "11px", fontWeight: "800", color: "#1e293b" }}>{rating.toFixed(1)}</span>
               <span style={{ fontSize: "11px", color: "#94a3b8" }}>({reviewCount})</span>
            </div>
          </div>

          {/* Price Section */}
          <div style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "10px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Market Price</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "24px", fontWeight: "900", color: "#16a34a", letterSpacing: "-0.04em" }}>{formatNaira(discountedVal)}</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through", fontWeight: "600" }}>{formatNaira(originalVal)}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                 <span style={{ fontSize: "10px", fontWeight: "900", color: "#f97316", textTransform: "uppercase", letterSpacing: "0.1em" }}>Savings</span>
                 <span style={{ fontSize: "11px", fontWeight: "800", color: "#10b981", background: "#ecfdf5", padding: "2px 8px", borderRadius: "6px" }}>
                   Save {formatNaira(savings)}
                 </span>
              </div>
            </div>

            {/* Countdown & Progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                   <Timer size={14} color="#f97316" />
                   <span style={{ fontSize: "11px", fontWeight: "700", color: "#334155" }}>Ends in</span>
                 </div>
                 <div style={{ display: "flex", gap: "4px" }}>
                    {[hours, minutes, seconds].map((unit, i) => (
                      <div key={i} style={{ background: "#0f172a", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "900", minWidth: "22px", textAlign: "center" }}>
                        {unit}
                      </div>
                    ))}
                 </div>
              </div>

              <div style={{ position: "relative", width: "100%", height: "6px", backgroundColor: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ position: "absolute", top: 0, left: 0, height: "100%", backgroundColor: "#3EB28F", borderRadius: "10px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b" }}>{soldQuantity} claimed</span>
                 <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b" }}>{remaining} left</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(249,115,22,0.2)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#f97316",
                color: "#fff",
                borderRadius: "12px",
                fontWeight: "900",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(249,115,22,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              Claim Deal Now <ArrowRight size={16} />
            </motion.div>
          </div>
        </div>
      </Link>
    </div>
  );
});

DealCard.displayName = "DealCard";

export default DealCard;
