const INITIAL_USERS = [
  { id: "#1024", name: "John Doe", email: "john@example.com", status: "Active", role: "Gold Member", joinDate: "Jan 12, 2026", location: "Lagos" },
  { id: "#1025", name: "Sarah Smith", email: "sarah.s@gmail.com", status: "Active", role: "Platinum", joinDate: "Feb 02, 2026", location: "Abuja" },
  { id: "#1026", name: "Mike Johnson", email: "mike.j@outlook.com", status: "Pending", role: "New User", joinDate: "Mar 20, 2026", location: "Lagos" },
  { id: "#1027", name: "Emily Brown", email: "emily.b@slasham.com", status: "Active", role: "Gold Member", joinDate: "Mar 15, 2026", location: "Port Harcourt" },
  { id: "#1028", name: "Alex Wilson", email: "alex.w@yahoo.com", status: "Suspended", role: "Basic", joinDate: "Dec 28, 2025", location: "Abuja" },
];

const INITIAL_DISPUTES = [
  { id: "DIS-120", user: "John Doe", merchant: "Pizza Hut", reason: "Coupon Not Accepted", date: "2 hours ago", priority: "High", status: "Open" },
  { id: "DIS-121", user: "Sarah S.", merchant: "Oasis Spa", reason: "Double Charge", date: "5 hours ago", priority: "Critical", status: "In-Progress" },
  { id: "DIS-122", user: "Mike J.", merchant: "Lagos Grill", reason: "Misleading Deal", date: "Yesterday", priority: "Medium", status: "Resolved" },
  { id: "DIS-123", user: "Emily B.", merchant: "Skyline", reason: "Facility Closed", date: "Yesterday", priority: "High", status: "In-Progress" },
];

export const getAdminUsers = () => {
    try {
        const data = localStorage.getItem('slasham_admin_users');
        return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
        return INITIAL_USERS;
    }
};

export const saveAdminUsers = (users: any[]) => {
    localStorage.setItem('slasham_admin_users', JSON.stringify(users));
    window.dispatchEvent(new Event('adminDataUpdate'));
};

export const getAdminDisputes = () => {
    try {
        const data = localStorage.getItem('slasham_admin_disputes');
        return data ? JSON.parse(data) : INITIAL_DISPUTES;
    } catch {
        return INITIAL_DISPUTES;
    }
};

export const saveAdminDisputes = (disputes: any[]) => {
    localStorage.setItem('slasham_admin_disputes', JSON.stringify(disputes));
    window.dispatchEvent(new Event('adminDataUpdate'));
};

const INITIAL_BUSINESSES = [
  { id: "B-882", name: "Zaza Lounge", owner: "Kunle A.", category: "Dining", rating: 4.8, status: "Verified", deals: 12, city: "Lagos", email: "ops@zaza.com", address: "14, Victoria Island, Lagos" },
  { id: "B-883", name: "Oasis Spa", owner: "Sarah O.", category: "Wellness", rating: 4.9, status: "Verified", deals: 5, city: "Abuja", email: "hello@oasis.com", address: "Plot 12, Wuse 2, Abuja" },
  { id: "B-884", name: "Lagos Grill", owner: "James K.", category: "Food", rating: 4.2, status: "Pending", deals: 0, city: "Lagos", email: "admin@lagosgrill.com", address: "55, Isaac John, Ikeja" },
  { id: "B-885", name: "Skyline Cinema", owner: "Rita W.", category: "Movies", rating: 4.5, status: "Verified", deals: 8, city: "Port Harcourt", email: "support@skyline.com", address: "Ph Mall, Port Harcourt" },
];

export const getAdminBusinesses = () => {
    try {
        const data = localStorage.getItem('slasham_admin_businesses');
        return data ? JSON.parse(data) : INITIAL_BUSINESSES;
    } catch {
        return INITIAL_BUSINESSES;
    }
};

export const saveAdminBusinesses = (businesses: any[]) => {
    localStorage.setItem('slasham_admin_businesses', JSON.stringify(businesses));
    window.dispatchEvent(new Event('adminDataUpdate'));
};
