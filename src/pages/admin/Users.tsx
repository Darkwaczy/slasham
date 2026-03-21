import { Search, Filter, MoreHorizontal, UserPlus, Mail, Shield, MapPin } from "lucide-react";
import { motion } from "motion/react";

const users = [
  { id: "#1024", name: "John Doe", email: "john@example.com", status: "Active", role: "Gold Member", joinDate: "Jan 12, 2026", location: "Lagos" },
  { id: "#1025", name: "Sarah Smith", email: "sarah.s@gmail.com", status: "Active", role: "Platinum", joinDate: "Feb 02, 2026", location: "Abuja" },
  { id: "#1026", name: "Mike Johnson", email: "mike.j@outlook.com", status: "Pending", role: "New User", joinDate: "Mar 20, 2026", location: "Lagos" },
  { id: "#1027", name: "Emily Brown", email: "emily.b@slasham.com", status: "Active", role: "Gold Member", joinDate: "Mar 15, 2026", location: "Port Harcourt" },
  { id: "#1028", name: "Alex Wilson", email: "alex.w@yahoo.com", status: "Suspended", role: "Basic", joinDate: "Dec 28, 2025", location: "Abuja" },
];

export default function AdminUsers() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage and monitor all platform users</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:scale-105 transition-transform">
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", count: "1,200", color: "indigo" },
          { label: "Active Now", count: "482", color: "emerald" },
          { label: "New Today", count: "+24", color: "blue" },
          { label: "Suspended", count: "12", color: "rose" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter users..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-slate-900 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={16} /> Filters
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User / Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tier / Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user, idx) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 mb-0.5">{user.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                      user.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <Shield size={14} className="text-indigo-500" />
                       <span className="text-sm font-bold text-slate-700">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{user.joinDate}</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <MapPin size={10} /> {user.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400">
          <p>Showing 5 of 1,200 users</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50">Prev</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
