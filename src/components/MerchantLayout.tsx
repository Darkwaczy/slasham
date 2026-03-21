import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  Plus,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MerchantLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/merchant/dashboard" },
    { icon: <Ticket size={20} />, label: "My Campaigns", path: "/merchant/campaigns" },
    { icon: <Users size={20} />, label: "Customers", path: "/merchant/customers" },
    { icon: <MessageSquare size={20} />, label: "Reviews", path: "/merchant/reviews" },
    { icon: <TrendingUp size={20} />, label: "Analytics", path: "/merchant/analytics" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 leading-normal antialiased">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-lg shadow-emerald-600/20">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">Slasham</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Merchant Console</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Business Menu</span>
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                  ${isActive(item.path) 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-95' 
                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'}
                `}
              >
                <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                {isActive(item.path) && (
                  <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </Link>
            ))}

            <div className="px-4 mt-8 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Support</span>
            </div>
            <Link to="/merchant/settings" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all">
              <Settings size={20} className="text-slate-400" />
              <span className="font-bold text-sm">Business Settings</span>
            </Link>
          </nav>

          {/* Sidebar Footer - Profile Section */}
          <div className="p-4 border-t border-slate-100 mb-2">
            <div className="p-4 bg-slate-50 rounded-3xl group cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  OB
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-slate-900 truncate tracking-tight">Orchid Bistro</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified Merchant</span>
                </div>
                <button className="ml-auto text-slate-400 hover:text-rose-500 transition-colors border-none p-1">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 px-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Store Open
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3 lg:gap-5 ml-auto">
            <button className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200 hidden md:block mx-1" />
            <div className="flex items-center gap-3">
               <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/10 hover:scale-105 active:scale-95 transition-all">
                  <Plus size={16} /> New Campaign
               </button>
               <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm cursor-pointer shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-colors">
                  OB
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <main className="p-4 md:p-8 lg:p-10 max-w-[1600px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
