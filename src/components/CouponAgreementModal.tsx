import { useState } from "react";
import { X, ShieldCheck, AlertTriangle, Calendar, FileText, CheckSquare, Square, BadgePercent, Landmark, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CouponAgreementModalProps {
  deal: any;
  onAgree: () => void;
  onCancel: () => void;
}

function formatExpiryDate(expiryDate?: string): string {
  if (!expiryDate) return "No expiry set";
  const d = new Date(expiryDate);
  return d.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function getExpiryLabel(expiryDate?: string): string | null {
  if (!expiryDate) return null;
  const diff = new Date(expiryDate).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}hr${hours !== 1 ? "s" : ""} left`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} left`;
}

function parseAmount(str?: string): number {
  if (!str) return 0;
  return parseInt(str.replace(/\D/g, "")) || 0;
}

function fmt(num: number): string {
  return `₦${num.toLocaleString()}`;
}

export default function CouponAgreementModal({ deal, onAgree, onCancel }: CouponAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);

  const slashamPrice    = parseAmount(deal?.price);         // what you pay Slasham
  const faceValue       = parseAmount(deal?.couponFaceValue || deal?.original); // coupon discount at merchant
  const minimumSpend    = parseAmount(deal?.minimumSpend);  // min spend at merchant
  const savings         = faceValue - slashamPrice;         // your total benefit
  const discountPct     = faceValue > 0 ? Math.round(((faceValue - slashamPrice) / faceValue) * 100) : 0;
  const latePenaltyAmt  = Math.round(faceValue * 0.05);     // 5% of face value

  const expiryLabel = getExpiryLabel(deal?.expiryDate);
  const isUrgent    = expiryLabel && (expiryLabel.includes("hr") || expiryLabel === "Expired");

  const dealTerms = [
    `Minimum spend of ${fmt(minimumSpend)} required at the merchant`,
    "You may spend more than the minimum — coupon still applies",
    "Coupon code is your proof of purchase — keep it safe",
    "Non-transferable — valid for the named purchaser only",
    "No extensions after expiry unless approved by Slasham",
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Green Header */}
          <div className="bg-emerald-500 px-8 py-8 text-center relative shrink-0">
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X size={16} />
            </button>
            {deal?.image && (
              <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 border-4 border-white/30 shadow-xl">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-white/80 text-[11px] font-black uppercase tracking-[0.3em] mb-1">Almost There!</p>
            <h2 className="text-white text-2xl md:text-4xl font-black leading-tight mb-2">{deal?.title}</h2>
            <p className="text-white/70 text-sm font-medium">
              by {deal?.companyName || deal?.location || "Exclusive Partner"}
            </p>
            {/* Discount badge */}
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 text-white text-sm font-black px-4 py-1.5 rounded-full">
              <BadgePercent size={14} />
              {discountPct}% off market price
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5">

            {/* ── HOW THIS COUPON WORKS ── */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span className="text-[11px] md:text-sm font-black text-emerald-700 uppercase tracking-widest">How This Coupon Works</span>
              </div>
              <div className="space-y-5 md:space-y-8 text-sm md:text-base">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] md:text-base font-black shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-black text-slate-800 md:text-lg">Pay Slasham now</p>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      You pay <span className="font-black text-emerald-600">{fmt(slashamPrice)}</span> today. This is Slasham's fee and is <span className="font-bold text-slate-700">non-refundable</span>. You get your coupon code instantly.
                    </p>
                  </div>
                </div>
                <div className="ml-3 md:ml-5 border-l-2 border-dashed border-emerald-200 h-4 md:h-6" />
                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] md:text-base font-black shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-black text-slate-800 md:text-lg">Visit the merchant</p>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      Spend a minimum of <span className="font-black text-slate-800">{fmt(minimumSpend)}</span> at the merchant to unlock your coupon. You may spend more — the coupon still applies.
                    </p>
                  </div>
                </div>
                <div className="ml-3 md:ml-5 border-l-2 border-dashed border-emerald-200 h-4 md:h-6" />
                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] md:text-base font-black shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-black text-slate-800 md:text-lg">Redeem your coupon code</p>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      Present your code — the merchant deducts <span className="font-black text-emerald-600">{fmt(faceValue)}</span> from your bill. You save <span className="font-black text-emerald-600">{fmt(savings)}</span> vs buying outright.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary row */}
              <div className="mt-5 pt-4 border-t border-emerald-100 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Landmark size={12} className="text-emerald-600" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">You Pay Slasham</span>
                  </div>
                  <p className="font-black text-slate-900 text-base">{fmt(slashamPrice)}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ShoppingBag size={12} className="text-emerald-600" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Min. Spend</span>
                  </div>
                  <p className="font-black text-slate-900 text-base">{fmt(minimumSpend)}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BadgePercent size={12} className="text-emerald-600" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Coupon Value</span>
                  </div>
                  <p className="font-black text-emerald-600 text-base md:text-xl">{fmt(faceValue)}</p>
                </div>
              </div>
            </div>

            {/* ── EXPIRY ── */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={15} className="text-rose-500" />
                <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Coupon Expiry</span>
              </div>
              {deal?.expiryDate ? (
                <>
                  <p className={`font-black text-base md:text-xl mb-1 ${isUrgent ? "text-rose-600" : "text-slate-800"}`}>
                    {formatExpiryDate(deal.expiryDate)}
                    {expiryLabel && (
                      <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full font-black ${
                        isUrgent ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"
                      }`}>
                        {expiryLabel}
                      </span>
                    )}
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    After this date, late redemption may be possible on a case-by-case basis with a{" "}
                    <span className="font-bold text-rose-600">5% penalty ({fmt(latePenaltyAmt)})</span>{" "}
                    on the coupon face value, subject to merchant availability.
                  </p>
                </>
              ) : (
                <p className="text-slate-500 text-sm">Check with the merchant for validity period.</p>
              )}
            </div>

            {/* ── IMPORTANT WARNINGS ── */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-amber-600" />
                <span className="text-[11px] md:text-sm font-black text-amber-700 uppercase tracking-widest">Important — Read Before You Proceed</span>
              </div>
              <ul className="space-y-3 md:space-y-4">
                {[
                  `Your ${fmt(slashamPrice)} payment goes directly to Slasham. This is our service fee and is final upon purchase.`,
                  "Once you redeem the coupon code at the merchant, the transaction is complete.",
                  "You have 48 hours after redemption to raise a dispute if the service didn't match what was listed.",
                  "Disputes require photo or video evidence.",
                  "Slasham does not issue cash refunds. Store credit only in the event of a confirmed merchant fault.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 md:mt-2.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── DEAL TERMS ── */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-slate-500" />
                <span className="text-[11px] md:text-sm font-black text-slate-500 uppercase tracking-widest">Deal Terms</span>
              </div>
              <ul className="space-y-2 md:space-y-3">
                {dealTerms.map((term, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 md:mt-2.5 shrink-0" />
                    {term}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── CHECKBOX ── */}
            <button
              onClick={() => setAgreed(!agreed)}
              className="w-full flex items-start gap-3 text-left p-4 rounded-2xl border-2 transition-all"
              style={{ borderColor: agreed ? "#10b981" : "#e2e8f0", background: agreed ? "#f0fdf4" : "white" }}
            >
              <div className="shrink-0 mt-0.5">
                {agreed
                  ? <CheckSquare size={20} className="text-emerald-500" />
                  : <Square size={20} className="text-slate-300" />
                }
              </div>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                I understand that my <span className="font-bold text-emerald-600">{fmt(slashamPrice)} payment is Slasham's service fee</span> and is non-refundable. I agree to spend a minimum of{" "}
                <span className="font-bold text-slate-800">{fmt(minimumSpend)}</span> at the merchant, and I accept the expiry and dispute policy.
              </p>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2 shrink-0 space-y-3 border-t border-slate-100">
            <button
              onClick={onAgree}
              disabled={!agreed}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                agreed
                  ? "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-lg shadow-emerald-200"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {agreed ? `Pay ${fmt(slashamPrice)} & Get Coupon →` : "Agree to terms to continue"}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
