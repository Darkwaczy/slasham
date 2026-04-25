import { ArrowUpRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";

const data = [
  { name: "Mon", revenue: 4000, reach: 2400 },
  { name: "Tue", revenue: 3000, reach: 1398 },
  { name: "Wed", revenue: 2000, reach: 9800 },
  { name: "Thu", revenue: 2780, reach: 3908 },
  { name: "Fri", revenue: 1890, reach: 4800 },
  { name: "Sat", revenue: 2390, reach: 3800 },
  { name: "Sun", revenue: 3490, reach: 4300 },
];

export default function MerchantAnalytics() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Performance Intelligence</h1>
          <p className="text-slate-500 font-medium">Detailed data on your campaign velocity and reach</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
           <button className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10">Weekly</button>
           <button className="px-5 py-2.5 bg-transparent text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">Monthly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="font-black text-xl text-slate-900 tracking-tight">Revenue Velocity</h3>
            <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
               <ArrowUpRight size={14} />
               +24.8% <span className="text-slate-300 font-bold ml-1">vs last week</span>
            </div>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0f172a", 
                    border: "none", 
                    borderRadius: "16px", 
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    padding: "12px 16px"
                  }}
                  itemStyle={{ color: "#fff", fontWeight: 900, fontSize: "12px" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: 700, fontSize: "10px", marginBottom: "4px", textTransform: "uppercase" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#eab308" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorReach)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden h-full flex flex-col justify-between">
              <div className="relative z-10">
                 <Activity className="text-yellow-400 mb-6" size={32} />
                 <h3 className="text-2xl font-black mb-2 tracking-tight">Real-Time Pulse</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Current campaign reach across all active cities is expanding.</p>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Users</span>
                       <span className="text-lg font-black text-yellow-400">1,240</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                       />
                    </div>
                 </div>
              </div>

              <div className="mt-12 relative z-10">
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                    Generate Detailed PDF
                 </button>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
           </div>
        </div>
      </div>
    </div>
  );
}
