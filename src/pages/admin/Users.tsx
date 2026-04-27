import { Search, Filter, MoreHorizontal, UserPlus, Mail, Shield, MapPin, Trash2, ShieldCheck, UserMinus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminModal from "../../components/AdminModal";
import { apiClient } from "../../api/client";
import AdminSkeleton from "../../components/AdminSkeleton";
import { useAdminData } from "../../context/AdminContext";

export default function AdminUsers() {
  const { data, isLoading, updateData, fetchEntity } = useAdminData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [, setIsProcessing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchUsers = async () => {
    try {
      await fetchEntity('users', currentPage, pageSize, searchQuery);
      if (isInitialLoad) setIsInitialLoad(false);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery]);

  const users = (data?.users || []).map((u: any) => ({
    ...u,
    status: u.is_verified === false ? 'Suspended' : 'Active',
    roleLabel: u.role === "ADMIN" ? "Administrator" : u.role === "MERCHANT" ? "Merchant" : "Standard User",
    joinDate: new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    location: u.city || "Not Specified"
  }));

  const totalUsers = data?.counts?.users || users.length;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const handleToggleStatus = async (user: any) => {
    setIsProcessing(true);
    try {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        await apiClient(`/admin/users/${user.id}/status`, {
            method: "POST",
            body: JSON.stringify({ status: newStatus })
        });
        
        // Update local context instantly
        const updatedRawUsers = data.users.map((u: any) => 
            u.id === user.id ? { ...u, is_verified: newStatus === 'Active' } : u
        );
        updateData('users', updatedRawUsers);
        
        setIsActionModalOpen(false);
    } catch (error: any) {
        alert("Status update failed: " + error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Permanently delete this user account?")) return;
    try {
        await apiClient(`/admin/users/${id}`, { method: "DELETE" });
        fetchUsers();
        setIsActionModalOpen(false);
    } catch (error: any) {
        alert("Delete failed: " + error.message);
    }
  };

  const handleChangeRole = async (user: any, newRole: string) => {
    try {
        await apiClient(`/admin/users/${user.id}/role`, {
            method: "POST",
            body: JSON.stringify({ role: newRole })
        });
        fetchUsers();
        setIsActionModalOpen(false);
        alert(`User role updated to ${newRole}`);
    } catch (error: any) {
        alert("Role update failed: " + error.message);
    }
  };

  const handleSendNotification = async (user: any) => {
    const message = prompt(`Enter system notification for ${user.name}:`);
    if (!message) return;
    try {
        await apiClient(`/admin/users/${user.id}/notify`, {
            method: "POST",
            body: JSON.stringify({ message })
        });
        alert("Notification sent successfully!");
    } catch (error: any) {
        alert("Notification failed: " + error.message);
    }
  };

  if (isLoading && isInitialLoad) return <AdminSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage and monitor all platform users</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/10 hover:scale-105 transition-all"
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
              <Filter size={16} /> Filters
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-visible">
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
              <AnimatePresence mode="popLayout">
                {users.map((user, idx) => (
                  <motion.tr 
                    key={user.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5 text-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                          {user.name?.charAt(0) || "U"}
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
                    <td className="px-8 py-5 text-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{user.joinDate}</span>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <MapPin size={10} /> {user.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setIsActionModalOpen(true);
                        }}
                        className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900 active:scale-95"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {users.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold">No users match your search criteria</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          <p>Page {currentPage} of {Math.max(1, totalPages)} • Total {totalUsers} Users</p>
          <div className="flex gap-2">
            <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50 font-bold hover:bg-slate-50 transition-colors"
            >
                Prev
            </button>
            <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50 font-bold hover:bg-slate-50 transition-colors"
            >
                Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AdminModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        description="Onboard a new member to the Slasham platform manually."
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <input 
                name="name"
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                placeholder="e.g. David Chima"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <input 
                name="email"
                type="email" 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all outline-none"
                placeholder="chima@example.com"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-500/20 transition-all"
            >
              Create Account
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Action/Manage User Modal */}
      <AdminModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Manage User"
        description={selectedUser ? `Actions for ${selectedUser.name}` : ""}
      >
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">
               {selectedUser?.name?.charAt(0) || "U"}
             </div>
             <div>
               <p className="font-black text-slate-900">{selectedUser?.name}</p>
               <p className="text-xs text-slate-500 font-medium">{selectedUser?.email}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => handleToggleStatus(selectedUser)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                selectedUser?.status === 'Active' 
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              }`}
            >
              {selectedUser?.status === 'Active' ? <UserMinus size={18} /> : <ShieldCheck size={18} />}
              {selectedUser?.status === 'Active' ? 'Suspend User Access' : 'Restore User Access'}
            </button>
            <button 
              onClick={() => {
                const roles = ['USER', 'MERCHANT', 'ADMIN'];
                const currentRole = selectedUser.role === 'Administrator' ? 'ADMIN' : selectedUser.role === 'Merchant' ? 'MERCHANT' : 'USER';
                const nextRole = roles[(roles.indexOf(currentRole) + 1) % roles.length];
                if (confirm(`Change ${selectedUser.name}'s role from ${currentRole} to ${nextRole}?`)) {
                  handleChangeRole(selectedUser, nextRole);
                }
              }}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Shield size={18} /> Change Membership Role
            </button>
            <button 
              onClick={() => handleSendNotification(selectedUser)}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Mail size={18} /> Send System Notification
            </button>
            <div className="my-2 border-t border-slate-100"></div>
            <button 
              onClick={() => handleDeleteUser(selectedUser.id)}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
            >
              <Trash2 size={18} /> Permanently Delete Account
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
