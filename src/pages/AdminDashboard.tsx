import { Users, Store, Tag, BarChart3, ArrowUpRight, Wallet, ShieldCheck, Download, FileText, PieChart, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import AdminModal from "../components/AdminModal";

const data = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 9000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 4890, users: 4800 },
  { name: 'Jun', revenue: 6390, users: 4200 },
];

export default function AdminDashboard() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | 'clean' | 'threat'>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRunScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
        setIsScanning(false);
        setScanResult('clean');
        setTimeout(() => setScanResult(null), 5000);
    }, 3000);
  };

  const handleRefreshStats = () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Console</h1>
          <p className="text-slate-500 font-medium">Real-time performance metrics across the Slasham network</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefreshStats}
            className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all hover:bg-indigo-50 active:scale-90"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            Generate Intelligence Report
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
            className="p-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg ${
                stat.color === 'indigo' ? 'bg-indigo-600 text-white shadow-indigo-200' :
                stat.color === 'emerald' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                stat.color === 'amber' ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-rose-500 text-white shadow-rose-200'
              }`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
                {stat.trend} <ArrowUpRight size={12} />
              </div>
            </div>
            <h3 className="relative z-10 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">{stat.title}</h3>
            <p className="relative z-10 text-3xl font-black text-slate-900 tracking-tighter">{stat.count}</p>
            
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity ${
                stat.color === 'indigo' ? 'bg-indigo-600' :
                stat.color === 'emerald' ? 'bg-emerald-500' :
                stat.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                  <BarChart3 size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tighter">Growth Velocity</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Aggregate Revenue & Traffic</p>
                </div>
              </div>
              <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-50 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">L30D</button>
                  <button className="px-4 py-2 bg-white text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-all">L6M</button>
              </div>
            </div>
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                  <Tooltip 
                    cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '4 4' }}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* System Monitoring */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">System Telemetry</h2>
            <div className="space-y-8">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Edge Server Load</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">Normal</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '38%' }}
                        className="h-full bg-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-3">4 Nodes Active • Uptime: 99.992%</p>
               </div>

               <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Audit Logs</p>
                  {recentEvents.map((event, idx) => (
                    <div key={idx} className="flex gap-4 group cursor-pointer">
                      <div className={`shrink-0 w-2 h-2 rounded-full mt-2 transition-transform group-hover:scale-150 ${
                        event.status === 'Critical' ? 'bg-rose-500' : 
                        event.status === 'Complete' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{event.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{event.user} • {event.time}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <ShieldCheck className="text-indigo-400 mb-6" size={40} />
              <h3 className="text-xl font-black mb-2 tracking-tight">Sentinel Audit</h3>
              <p className="text-slate-400 text-xs mb-8 leading-relaxed font-medium">Auto-protection is active. No security anomalies detected in the last scan block.</p>
              
              <AnimatePresence mode="wait">
                {scanResult === 'clean' ? (
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest mb-4 bg-emerald-500/10 px-4 py-3 rounded-2xl"
                   >
                     <CheckCircle2 size={16} /> All Systems Clean
                   </motion.div>
                ) : (
                    <button 
                        onClick={handleRunScan}
                        disabled={isScanning}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isScanning ? <RefreshCw className="animate-spin" size={14} /> : <ShieldAlert size={14} />}
                        {isScanning ? 'Decrypting Logs...' : 'Execute Deep Scan'}
                    </button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <AdminModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Intelligence Report Generator"
        description="Compile and export platform data artifacts."
      >
        <div className="space-y-8 pt-6">
            <div className="grid grid-cols-2 gap-4">
                <button className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-slate-900 hover:text-white transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-xl mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={28} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">PDF Audit</span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500">Full platform summary</span>
                </button>
                <button className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-slate-900 hover:text-white transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl mb-4 group-hover:scale-110 transition-transform">
                        <Download size={28} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Raw CSV Data</span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500">Unfiltered ledger logs</span>
                </button>
                <button className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-slate-900 hover:text-white transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-xl mb-4 group-hover:scale-110 transition-transform">
                        <PieChart size={28} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Merchant Insights</span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500">Performance breakdowns</span>
                </button>
                <button className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-slate-900 hover:text-white transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-xl mb-4 group-hover:scale-110 transition-transform">
                        <Users size={28} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">User Demographics</span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500">Localized heatmaps</span>
                </button>
            </div>
            
            <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Notice</p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    Intelligence reports are generated in real-time. Extremely large datasets (L1Y+) may take up to 2 minutes to compile.
                </p>
            </div>

            <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                    Cancel
                </button>
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-slate-900/20 transition-all">
                    Compile Artifacts
                </button>
            </div>
        </div>
      </AdminModal>
    </div>
  );
}
