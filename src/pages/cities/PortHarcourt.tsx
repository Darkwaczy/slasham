import React from "react";
import { MapPin, Zap, Mail } from "lucide-react";

export default function PortHarcourt() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="relative h-[400px] rounded-[40px] overflow-hidden mb-16">
        <img src="https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&w=1200&q=80" alt="Port Harcourt" className="w-full h-full object-cover grayscale opacity-50" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-12 left-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500 text-white font-bold text-xs uppercase tracking-widest mb-4">
            Coming Later
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">Port Harcourt</h1>
          <p className="text-xl text-white/80 max-w-xl">The garden city. We're bringing the best deals to the heart of the Niger Delta very soon.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center py-24">
        <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-8">
          <Zap size={40} />
        </div>
        <h2 className="text-4xl font-bold mb-6">Be the first to know when we launch in Port Harcourt</h2>
        <p className="text-xl text-slate-500 mb-12">
          Join our waitlist and get an exclusive 50% discount on your first Port Harcourt coupon.
        </p>
        
        <form className="flex gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex-grow">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              required
            />
          </div>
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-colors">
            Join Waitlist
          </button>
        </form>
      </div>
    </div>
  );
}
