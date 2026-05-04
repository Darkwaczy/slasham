import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Home, Mail } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");
  
  // Get user email from localStorage
  const user = JSON.parse(localStorage.getItem("slasham_user") || "{}");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-12 max-w-md w-full text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
          Payment Successful!
        </h1>
        
        <p className="text-slate-500 font-medium mb-2">
          Your voucher for this deal has been confirmed.
        </p>

        {user.email && (
          <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8">
            <Mail size={16} className="text-emerald-600 shrink-0" />
            <p className="text-sm font-bold text-emerald-700">
              Voucher sent to <span className="text-emerald-900">{user.email}</span>
            </p>
          </div>
        )}

        <div className="space-y-3">
          {user.email && (
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-600 transition-all"
            >
              Login to View Vouchers
            </Link>
          )}
          
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-3 border border-slate-200 text-slate-600 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-all"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>

        {ref && (
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-6">
            Ref: {ref}
          </p>
        )}
      </div>
    </div>
  );
}
