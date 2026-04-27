import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Ticket, Heart, CreditCard, Star, Settings, 
  LogOut, Bell, Search, Menu, X, User, ChevronRight, HelpCircle, Gift
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { storage } from "../utils/storage";
import { apiClient } from "../api/client";
import { UserProvider, useUser } from "../context/UserContext";

export default function UserLayout() {
  return (
    <UserProvider>
      <UserLayoutContent />
    </UserProvider>
  );
}

function UserLayoutContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useUser();

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/deals?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await apiClient.get("/user/notifications");
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  useEffect(() => {
    // Prefetch the most common user pages so route switches feel faster.
    import("../pages/user/Settings");
    import("../pages/user/MyCoupons");
    import("../pages/user/SavedDeals");
    import("../pages/user/OrdersPayments");
    import("../pages/user/Reviews");
    import("../pages/user/RewardsReferrals");
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apiClient.post(`/user/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

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
    storage.removeItem("slasham_user");
    navigate("/login");
  };

  const currentPageName = navItems.find(item => item.path === location.pathname)?.name || "Dashboard";

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
          <NavLink to="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <Logo size="md" />
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
                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
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
              <a 
                href="mailto:support@slasham.com" 
                className="w-full py-2 bg-white text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100 flex items-center justify-center"
              >
                Support Center
              </a>
           </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer relative">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shadow-inner ring-2 ring-white">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=10b981&color=fff`} alt="User" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">{user?.name || "Member"}</p>
              <p className="text-xs text-slate-500 truncate">Standard Plan</p>
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
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search deals, vouchers..."
                className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl relative transition-all group"
                >
                  <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                  {notifications.some(n => !n.is_read) && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-60"
                    >
                      <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="font-black text-slate-900">Notifications</h3>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                          {notifications.filter(n => !n.is_read).length} New
                        </span>
                      </div>
                      
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center">
                            <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-xs text-slate-400 font-bold">All caught up!</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group ${!n.is_read ? 'bg-emerald-50/20' : ''}`}
                            >
                              <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  n.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : 
                                  n.type === 'PROMO' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  <Bell size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-black text-slate-900 mb-0.5">{n.title}</p>
                                  <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{n.message}</p>
                                  <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                                    {new Date(n.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shadow-lg shadow-emerald-500/50"></div>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <button 
                        onClick={() => { navigate("/user/notifications"); setShowNotifications(false); }}
                        className="w-full p-4 text-[11px] font-black text-slate-400 hover:text-emerald-500 text-center uppercase tracking-widest border-t border-slate-50 transition-colors"
                      >
                        View all notifications
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                    {getInitials(user?.name || "")}
                  </div>
                </button>
                
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 z-60"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <p className="text-sm font-black text-slate-900">{user?.name || "Member"}</p>
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
