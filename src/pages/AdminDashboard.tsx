import { Users, Store, Tag, BarChart3, ArrowUpRight, Wallet, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 9000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 4890, users: 4800 },
  { name: 'Jun', revenue: 6390, users: 4200 },
];

export default function AdminDashboard() {
  const stats = [
    { title: "Total Users", count: "1,200", icon: <Users size={24} />, trend: "+12%", color: "indigo" },
    { title: "Businesses", count: "150", icon: <Store size={24} />, trend: "+5%", color: "emerald" },
    { title: "Active Campaigns", count: "450", icon: <Tag size={24} />, trend: "+8%", color: "amber" },
    { title: "Monthly Revenue", count: "₦5.2M", icon: <Wallet size={24} />, trend: "+15%", color: "rose" },
  ];

  const recentEvents = [
    { title: "New Merchant Application", user: "Zaza Lounge", time: "10 mins ago", status: "Review Required" },
    { title: "Dispute Raised", user: "John Doe #128", time: "1 hour ago", status: "Critical" },
    { title: "Campaign Goal Reached", user: "Pizza Hut", time: "2 hours ago", status: "Complete" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Console Overview</h1>
          <p className="text-slate-500 font-medium">Real-time performance metrics across the Slasham network</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${
                stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend} <ArrowUpRight size={14} />
              </div>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.title}</h3>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <BarChart3 size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight text-right">Revenue Velocity</h2>
              </div>
              <select className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-500 focus:ring-indigo-500 py-2 pl-4 pr-10">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* System Monitoring */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grow">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">System Health</h2>
            <div className="space-y-6">
               <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">Network Load</span>
                    <span className="text-xs font-bold text-emerald-600">Optimal</span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        className="h-full bg-emerald-500"
                    />
                  </div>
               </div>

               <div className="space-y-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Events</p>
                  {recentEvents.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className={`shrink-0 w-2 h-2 rounded-full mt-2 ${event.status === 'Critical' ? 'bg-rose-500' : event.status === 'Complete' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{event.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{event.user} • {event.time}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="relative z-10">
              <ShieldCheck className="text-indigo-400 mb-4" size={32} />
              <h3 className="text-lg font-black mb-2 leading-tight">Security Audit</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">No unauthorized access attempts detected in last 24h. Certificate valid for 180 days.</p>
              <button className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] border-b-2 border-indigo-400/20 hover:border-indigo-400 pb-1 transition-all">
                Run Full Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
