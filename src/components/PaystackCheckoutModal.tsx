import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, AlertCircle, Check, CreditCard, Lock, Shield } from "lucide-react";
import { apiClient } from "../api/client";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackCheckoutModalProps {
  isOpen: boolean;
  dealTitle: string;
  dealPrice: number;
  dealImage?: string;
  onClose: () => void;
  onPaymentSuccess: (reference: string) => void;
  onPaymentError: (error: string) => void;
  dealId: string;
}

export default function PaystackCheckoutModal({
  isOpen,
  dealTitle,
  dealPrice,
  dealImage,
  onClose,
  onPaymentSuccess,
  onPaymentError,
  dealId,
}: PaystackCheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Load Paystack script
  useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleInitializePayment = async () => {
    setIsLoading(true);
    setPaymentError("");

    try {
      // Use apiClient to handle correct base URL and credentials
      const data = await apiClient.post("/payments/initiate", { 
        deal_id: dealId 
      });

      // Open Paystack checkout
      if (window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_cf2a375f12be9eff21e3bb3697a84b740821386e",
          email: localStorage.getItem("slasham_user_email") || "",
          amount: dealPrice * 100, // Convert to kobo
          ref: data.reference,
          onClose: () => {
            setIsLoading(false);
            setPaymentError("Payment window closed");
          },
          onSuccess: (_: any) => {
            setPaymentInitiated(true);
            // Verify payment with backend
            verifyPayment(data.reference);
          },
        });
        handler.openIframe();
      } else {
        throw new Error("Paystack library not loaded");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      const msg = error.message || "Failed to initialize payment";
      
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("token")) {
        setPaymentError("Your session has expired. Please Sign Out and Sign In again to continue.");
        onPaymentError("Unauthorized");
        return;
      }
      
      setPaymentError(msg);
      onPaymentError(msg);
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setVerifying(true);
    try {
      // Use apiClient for verification
      const data = await apiClient.post(`/payments/verify/${reference}`);

      if (data.status === "success") {
        onPaymentSuccess(reference);
        setTimeout(() => {
          setVerifying(false);
          onClose();
        }, 2000);
      } else {
        throw new Error(`Payment failed: ${data.message}`);
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setPaymentError(error.message || "Failed to verify payment");
      setVerifying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Secure Payment
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading || verifying}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Deal Summary */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  {dealImage && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={dealImage}
                        alt={dealTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Order Summary
                    </p>
                    <h3 className="text-sm font-black text-slate-900 line-clamp-2">
                      {dealTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-baseline justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">
                    ₦{dealPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Info */}
              {!paymentInitiated && !paymentError && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
                    <Shield size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">
                        Secure Payment
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your payment is processed securely by Paystack. You'll be redirected to complete your payment.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Accepted Payment Methods
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {["Debit Card", "Mobile Money", "Bank Transfer"].map((method) => (
                        <div
                          key={method}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center"
                        >
                          <p className="text-xs font-bold text-slate-600">{method}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {paymentError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-900 uppercase tracking-widest">
                      Payment Error
                    </p>
                    <p className="text-xs text-red-700 mt-1">{paymentError}</p>
                    <button
                      onClick={() => setPaymentError("")}
                      className="text-xs font-bold text-red-600 hover:text-red-900 mt-2 uppercase tracking-widest"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Success State */}
              {paymentInitiated && !paymentError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3"
                >
                  <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-widest">
                      Payment Successful
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">
                      {verifying
                        ? "Verifying payment..."
                        : "Your voucher is being prepared. You'll be redirected shortly."}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading || verifying || paymentInitiated}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitializePayment}
                  disabled={isLoading || verifying || paymentInitiated || !!paymentError}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Initializing...
                    </>
                  ) : verifying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Verifying...
                    </>
                  ) : paymentInitiated ? (
                    <>
                      <Check size={16} /> Confirmed
                    </>
                  ) : (
                    <>
                      <Lock size={16} /> Pay Now
                    </>
                  )}
                </button>
              </div>

              {/* Info Footer */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">
                  🔒 Powered by Paystack • Your voucher will be emailed to you after successful payment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
