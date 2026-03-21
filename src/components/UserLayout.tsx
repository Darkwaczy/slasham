import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Ticket, Heart, CreditCard, Star, Settings, 
  LogOut, Bell, Search, Menu, X, User, ChevronRight, HelpCircle, Gift
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { name: "Overview", path: "/user/dashboard", icon: LayoutDashboard },
    { name: "My Vouchers", path: "/user/coupons", icon: Ticket },
    { name: "Wishlist", path: "/user/saved", icon: Heart },
    { name: "Transactions", path: "/user/orders", icon: CreditCard },
    { name: "My Reviews", path: "/user/reviews", icon: Star },
    { name: "Rewards", path: "/user/rewards", icon: Gift },
    { name: "Settings", path: "/user/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("slasham_user");
    navigate("/login");
  };

  const currentPageName = navItems.find(item => item.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-slate-600 font-sans">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
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
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
              <Star size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Slasham</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mb-4 ml-0.5 animate-pulse"></span>
          </NavLink>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all relative group ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {location.pathname === item.path && (
                <motion.div layoutId="nav-active" className="w-1.5 h-5 bg-emerald-500 rounded-full absolute -right-1" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Support Section */}
        <div className="px-6 mb-8 pt-8 border-t border-slate-100">
           <div className="p-4 bg-emerald-50 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                  <HelpCircle size={16} />
                </div>
                <span className="font-bold text-emerald-900 text-sm">Need Help?</span>
              </div>
              <p className="text-xs text-emerald-700/70 font-medium">Contact our 24/7 support team for any queries.</p>
              <button className="w-full py-2 bg-white text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100">
                Support Center
              </button>
           </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer relative">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shadow-inner ring-2 ring-white">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" alt="User" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">John Doe</p>
              <p className="text-xs text-slate-500 truncate">Pro Member</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={18} />
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
                <span>User</span>
                <ChevronRight size={10} />
                <span className="text-emerald-500">{currentPageName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-2xl ring-1 ring-slate-200 border-b-2 border-slate-200/50 focus-within:ring-emerald-500 focus-within:bg-white transition-all w-80">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search deals, vouchers..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl relative transition-all group">
                <Bell size={20} className="group-hover:rotate-12" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-lg shadow-slate-900/10">
                    JD
                  </div>
                </button>
                
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 z-[60]"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <p className="text-sm font-black text-slate-900">John Doe</p>
                        <p className="text-xs text-slate-500">Member since 2026</p>
                      </div>
                      <button 
                        onClick={() => { navigate("/user/settings"); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <User size={18} /> Profile Settings
                      </button>
                      <button 
                        onClick={() => { navigate("/user/settings"); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Star size={18} fill="currentColor" className="text-amber-500" /> Upgrade to Pro
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
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
