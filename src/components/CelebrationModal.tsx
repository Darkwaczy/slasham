import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, Star } from "lucide-react";

interface CelebrationModalProps {
  deal: any;
  onComplete: () => void;
}

// Random particle config
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,        // % from left
  delay: Math.random() * 0.8,    // seconds
  duration: 1.2 + Math.random() * 1.2,
  size: 6 + Math.random() * 10,
  color: [
    "#10b981", "#34d399", "#6ee7b7",  // emerald
    "#fbbf24", "#f59e0b",              // amber
    "#fb7185", "#f43f5e",             // rose
    "#a78bfa", "#8b5cf6",             // purple
    "#38bdf8", "#0ea5e9",             // sky
    "#ffffff",
  ][Math.floor(Math.random() * 12)],
  shape: i % 3 === 0 ? "circle" : i % 3 === 1 ? "rect" : "star",
  rotation: Math.random() * 720 - 360,
}));

const DURATION_MS = 5000;

export default function CelebrationModal({ deal, onComplete }: CelebrationModalProps) {
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / DURATION_MS, 1);
      setProgress(pct);
      setSecondsLeft(Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000)));
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ background: "rgba(5, 46, 22, 0.92)", backdropFilter: "blur(10px)" }}
      >
        {/* Confetti particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "-10vh", x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
            animate={{
              y: "110vh",
              x: [`${p.x}vw`, `${p.x + (Math.random() * 20 - 10)}vw`],
              opacity: [1, 1, 0],
              rotate: p.rotation,
              scale: [1, 1.2, 0.8],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 1.5,
              ease: "easeIn",
            }}
            className="absolute pointer-events-none"
            style={{ width: p.size, height: p.size }}
          >
            {p.shape === "circle" ? (
              <div className="w-full h-full rounded-full" style={{ background: p.color }} />
            ) : p.shape === "rect" ? (
              <div className="w-full h-full rounded-sm" style={{ background: p.color, transform: "rotate(45deg)" }} />
            ) : (
              <Star size={p.size} fill={p.color} color={p.color} />
            )}
          </motion.div>
        ))}

        {/* Main card */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 }}
          className="relative z-10 text-center px-8 py-12 max-w-sm w-full mx-4"
        >
          {/* Pulsing ring behind icon */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)" }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-dashed border-emerald-400/40"
            />
            <div className="absolute inset-3 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }}
              >
                <Zap size={36} className="text-white fill-white" />
              </motion.div>
            </div>
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-emerald-400 text-[11px] font-black uppercase tracking-[0.4em] mb-2">
              <Sparkles size={10} className="inline mr-1" />
              Congratulations!
              <Sparkles size={10} className="inline ml-1" />
            </p>
            <h2 className="text-white text-3xl font-black leading-tight mb-3">
              You're about to<br />grab this deal! 🎉
            </h2>
            <p className="text-emerald-200/70 text-sm font-medium mb-1 leading-relaxed">
              {deal?.title}
            </p>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
              Save {deal?.original && deal?.price ? `₦${(
                parseInt(deal.original.replace(/\D/g, '')) - parseInt(deal.price.replace(/\D/g, ''))
              ).toLocaleString()}` : "big"} on this purchase
            </p>
          </motion.div>

          {/* Progress bar + countdown */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Taking you to payment…</span>
              <span className="text-emerald-400 text-[11px] font-black tabular-nums">{secondsLeft}s</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background: "linear-gradient(to right, #10b981, #34d399)",
                  boxShadow: "0 0 12px rgba(16,185,129,0.6)",
                }}
              />
            </div>
          </div>

          {/* Skip */}
          <button
            onClick={onComplete}
            className="mt-6 text-white/30 hover:text-white/60 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Skip →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
