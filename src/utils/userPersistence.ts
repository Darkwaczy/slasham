// src/utils/userPersistence.ts

const INITIAL_TRANSACTIONS = [
  { id: "TX-9021", date: "Mar 18, 2026", type: "Voucher Purchase", merchant: "Zaza Lounge", amount: "₦12,500", status: "Completed", method: "Mastercard •• 4582" },
  { id: "TX-9020", date: "Mar 15, 2026", type: "Points Redemption", merchant: "Slasham Rewards", amount: "-500 pts", status: "Completed", method: "Points Wallet" },
  { id: "TX-9019", date: "Mar 12, 2026", type: "Voucher Purchase", merchant: "Oasis Spa", amount: "₦15,000", status: "Completed", method: "Visa •• 9012" },
  { id: "TX-9018", date: "Mar 08, 2026", type: "Wallet Top-up", merchant: "Slasham Pay", amount: "₦25,000", status: "Completed", method: "Bank Transfer" },
];

const INITIAL_REVIEWS = [
  { id: 1, title: "Delicious Pizza Buffet", merchant: "Pizza Hut", rating: 5, status: "Published", text: "The crust was perfectly thin and the toppings were incredibly fresh. Best pizza in Lagos!", date: "2 days ago", response: "Thank you John! We look forward to serving you again." },
  { id: 2, title: "Full Body Spa Day", merchant: "Oasis Spa", rating: 4, status: "Published", text: "Very relaxing environment, though I had to wait 10 mins beyond my appointment time.", date: "1 week ago", response: null },
  { id: 3, title: "RSVP Dinner Experience", merchant: "RSVP Lagos", rating: 5, status: "Flagged", text: "Exceptional service and the ambience is second to none. Worth every naira.", date: "Mar 10, 2026", response: null },
];

const INITIAL_PROFILE = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+234 800 123 4567",
  city: "Lagos, Nigeria",
  twoFactorEnabled: false
};

const INITIAL_POINTS = {
  total: 2450,
  history: [
    { id: 1, activity: "RSVP Lagos Review", pts: "+20 pts", date: "Today" },
    { id: 2, activity: "Weekly Login Bonus", pts: "+10 pts", date: "Yesterday" },
    { id: 3, activity: "Referral Bonus (Tunde)", pts: "+500 pts", date: "2 days ago" },
  ],
  referrals: [
    { id: 1, name: "Tunde Afolabi", date: "2 days ago", status: "Completed", reward: "500 pts" },
    { id: 2, name: "Chisom Okafor", date: "5 days ago", status: "Pending", reward: "---" },
    { id: 3, name: "Amaka Peters", date: "1 week ago", status: "Completed", reward: "500 pts" },
  ]
};

// --------------- GETTERS ---------------

export const getUserTransactions = () => {
    try {
        const data = localStorage.getItem('slasham_user_transactions');
        return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    } catch {
        return INITIAL_TRANSACTIONS;
    }
};

export const getUserReviews = () => {
    try {
        const data = localStorage.getItem('slasham_user_reviews');
        return data ? JSON.parse(data) : INITIAL_REVIEWS;
    } catch {
        return INITIAL_REVIEWS;
    }
};

export const getUserProfile = () => {
    try {
        const data = localStorage.getItem('slasham_user_profile');
        return data ? JSON.parse(data) : INITIAL_PROFILE;
    } catch {
        return INITIAL_PROFILE;
    }
};

export const getUserPoints = () => {
    try {
        const data = localStorage.getItem('slasham_user_points');
        return data ? JSON.parse(data) : INITIAL_POINTS;
    } catch {
        return INITIAL_POINTS;
    }
};

// --------------- SETTERS ---------------

export const saveUserTransactions = (transactions: any[]) => {
    localStorage.setItem('slasham_user_transactions', JSON.stringify(transactions));
    window.dispatchEvent(new Event('userDataUpdate'));
};

const parsePts = (ptsStr: string) => {
    if (!ptsStr) return 0;
    return parseInt(ptsStr.replace(/[^0-9-]/g, '')) || 0;
};

export const addPointsHistory = (historyItem: any) => {
    const pts = getUserPoints();
    const newTotal = pts.total + parsePts(historyItem.pts);
    const updated = {
        ...pts,
        total: newTotal,
        history: [historyItem, ...pts.history]
    };
    saveUserPoints(updated);
};

// Helper to push a new transaction and automatically deduct wallet/points
export const logTransaction = (tx: any) => {
    const transactions = [tx, ...getUserTransactions()];
    saveUserTransactions(transactions);
    
    // If it's a review or point earning activity we could also auto-update points
    if (tx.pts) {
       addPointsHistory({
           id: Date.now(),
           activity: tx.title || "Reward Activity",
           pts: `+${tx.pts} pts`,
           date: "Just now"
       });
    }
};

export const saveUserReviews = (reviews: any[]) => {
    localStorage.setItem('slasham_user_reviews', JSON.stringify(reviews));
    window.dispatchEvent(new Event('userDataUpdate'));
};

export const saveUserProfile = (profile: any) => {
    localStorage.setItem('slasham_user_profile', JSON.stringify(profile));
    window.dispatchEvent(new Event('userDataUpdate'));
};

export const saveUserPoints = (pointsData: any) => {
    localStorage.setItem('slasham_user_points', JSON.stringify(pointsData));
    window.dispatchEvent(new Event('userDataUpdate'));
};
