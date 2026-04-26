import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, Store, Tag, Ticket, 
  CheckCircle, Star, AlertTriangle, Settings, LogOut,
  Bell, Search, Menu, X, ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { storage } from "../utils/storage";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { name: "Console", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Partner Applications", path: "/admin/applications", icon: ArrowUpRight },
    { name: "Businesses", path: "/admin/businesses", icon: Store },
    { name: "Campaigns", path: "/admin/deals", icon: Tag },
    { name: "Vouchers", path: "/admin/coupons", icon: Ticket },
    { name: "Redemptions", path: "/admin/redemptions", icon: CheckCircle },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
    { name: "Disputes", path: "/admin/reports", icon: AlertTriangle },
    { name: "Admin Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    storage.removeItem("slasham_user");
    navigate("/login");
  };

  const currentPageName = navItems.find(item => item.path === location.pathname)?.name || "Admin Console";

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-slate-600 font-sans">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative z-50 flex flex-col w-72 h-screen bg-white border-r border-slate-200 transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-8 flex items-center justify-between">
          <NavLink to="/" className="inline-block group hover:opacity-80 transition-opacity">
            <Logo size="md" className="mb-1" />
            <div className="flex flex-col ml-[42px]">
               <span className="text-[10px] font-black text-[#04bd36] uppercase tracking-widest">Admin Control</span>
            </div>
          </NavLink>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Management</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all relative group ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="transition-transform group-hover:scale-110" />
                <span className="text-sm">{item.name}</span>
              </div>
              {location.pathname === item.path && (
                <motion.div layoutId="admin-nav-active" className="w-1 h-4 bg-indigo-500 rounded-full absolute -right-1" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* System Health */}
        <div className="px-6 mb-6 pt-6 border-t border-slate-100 uppercase tracking-tighter">
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 mb-2">System Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700">All Systems Operational</span>
              </div>
           </div>
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              AU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">Admin User</p>
              <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-widest">Master Admin</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">{currentPageName}</h1>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>Admin</span>
                <ChevronRight size={10} />
                <span className="text-indigo-600">{currentPageName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl ring-1 ring-slate-200 focus-within:ring-indigo-500 focus-within:bg-white transition-all w-96">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources, logs, or users..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl relative transition-all">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20"
                >
                  AU
                </button>
                
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 z-60"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-2 text-center">
                        <p className="text-sm font-black text-slate-900">Admin User</p>
                        <p className="text-[10px] text-slate-500 tracking-widest uppercase">Super Administrator</p>
                      </div>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Settings size={18} /> System Settings
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <ArrowUpRight size={18} /> View Public Site
                      </button>
                      <div className="my-2 border-t border-slate-50"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth bg-[#FBFDFF]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
