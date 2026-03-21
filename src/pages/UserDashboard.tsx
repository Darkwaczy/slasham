
import { Heart, ShoppingBag, User, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const user = { name: "John Doe", email: "john.doe@example.com", memberSince: "January 2026" };
  const favorites = [
    { id: 1, title: "Delicious Pizza", price: "₦5,000", category: "Food" },
    { id: 2, title: "Spa Day", price: "₦10,000", category: "Wellness" },
  ];
  const vouchers = [
    { id: 1, title: "Pizza Discount", status: "Active", expiry: "2026-04-01" },
  ];
  const activity = [
    { id: 1, action: "Redeemed voucher for Spa Day", date: "2 days ago" },
    { id: 2, action: "Favorited Delicious Pizza", date: "1 week ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 bg-slate-50 min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-12 text-slate-900"
      >
        Welcome back, {user.name}
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm col-span-2">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-slate-500">{user.email}</p>
              <p className="text-sm text-slate-400 mt-1">Member since {user.memberSince}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Savings", value: "₦15,000", icon: <TrendingUp className="text-emerald-500" /> },
              { label: "Favorites", value: favorites.length.toString(), icon: <Heart className="text-rose-500" /> },
              { label: "Vouchers", value: vouchers.length.toString(), icon: <ShoppingBag className="text-blue-500" /> },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="mb-3">{stat.icon}</div>
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {activity.map((act, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1 p-2 bg-slate-100 rounded-full text-slate-500">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{act.action}</p>
                  <p className="text-xs text-slate-400">{act.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Your Vouchers</h3>
            <button className="text-emerald-600 font-bold text-sm flex items-center gap-1">View All <ChevronRight size={16} /></button>
          </div>
          <div className="space-y-4">
            {vouchers.map((v, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-bold">{v.title}</p>
                  <p className="text-xs text-slate-500">Expires: {v.expiry}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">{v.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Recommended for You</h3>
          <div className="space-y-4">
            {[
              { title: "Luxury Hotel Stay", category: "Travel", discount: "20% OFF" },
              { title: "Gourmet Dinner", category: "Food", discount: "15% OFF" },
            ].map((rec, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-bold">{rec.title}</p>
                  <p className="text-xs text-slate-500">{rec.category}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{rec.discount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
