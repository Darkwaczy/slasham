import { deals as STATIC_DEALS } from "../data/mockData";

const STORAGE_KEY = "slasham_persistent_deals";

export interface Deal {
  id: number;
  title: string;
  location: string;
  price: string;
  original: string;
  image: string;
  category: string;
  tag: string;
  description: string;
  validity: string;
  expiryDate?: string;
  shippingInfo?: { enabled: boolean; fee: string; note: string };
  isHotCoupon?: boolean;
  isTrending?: boolean;
  isFeaturedAd?: boolean;
  targetCity?: 'Lagos' | 'Abuja' | 'All';
  companyName?: string;
  unlockNote?: string;
  redeemAddress?: string;
  requestId?: string;
}

const STATIC_ADS = [
  {
    id: 1,
    bg: "bg-sky-200/50",
    pattern: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=1200&q=80",
    title: "Best Offers.",
    subtitle: "Lowest Prices.",
    desc: "Save on dining, beauty, services, and more.",
    code: "SLASHAM",
    codeBg: "bg-rose-600 shadow-rose-600/20",
    img1: "https://images.unsplash.com/photo-1492106087820-71f110052c51?auto=format&fit=crop&w=400&q=80",
    img2: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    bg: "bg-emerald-100",
    pattern: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    title: "Weekend",
    subtitle: "Pamper Special.",
    desc: "Up to 50% off top rated Spas in Lagos.",
    code: "RELAX50",
    codeBg: "bg-emerald-600 shadow-emerald-600/20",
    img1: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    img2: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    bg: "bg-indigo-100",
    pattern: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    title: "2-For-1",
    subtitle: "Fine Dining.",
    desc: "Exclusive dinner reservations at half price.",
    code: "GOURMET",
    codeBg: "bg-indigo-600 shadow-indigo-600/20",
    img1: "https://images.unsplash.com/photo-1414235077428-33898bd1e150?auto=format&fit=crop&w=400&q=80",
    img2: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
  }
];

const ADS_KEY = "slasham_persistent_ads";

export const getPersistentAds = () => {
    const stored = localStorage.getItem(ADS_KEY);
    if (!stored) {
        localStorage.setItem(ADS_KEY, JSON.stringify(STATIC_ADS));
        return STATIC_ADS;
    }
    return JSON.parse(stored);
};

export const savePersistentAd = (ad: any) => {
    const ads = getPersistentAds();
    const updated = ads.map((item: any) => item.id === ad.id ? ad : item);
    localStorage.setItem(ADS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('persistentAdsUpdate'));
};


export const getPersistentDeals = (): Deal[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATIC_DEALS));
    return STATIC_DEALS as Deal[];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return STATIC_DEALS as Deal[];
  }
};

export const savePersistentDeals = (deals: Deal[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  window.dispatchEvent(new Event('dealsUpdate'));
};

export const addPersistentDeal = (deal: Omit<Deal, 'id'>) => {
  const deals = getPersistentDeals();
  const newDeal = { ...deal, id: Date.now() };
  const updated = [newDeal, ...deals];
  savePersistentDeals(updated);
  return newDeal;
};

export const deletePersistentDeal = (id: number) => {
  const deals = getPersistentDeals();
  const updated = deals.filter(d => d.id !== id);
  savePersistentDeals(updated);
};

// --- NEW: VOUCHER PERSISTENCE ---
const VOUCHER_KEY = "slasham_user_vouchers";

export const getUserVouchers = () => {
  const stored = localStorage.getItem(VOUCHER_KEY);
  return stored ? JSON.parse(stored) : [];
};

import { issueCoupon } from "./couponVerification";

export const saveUserVoucher = (deal: Deal) => {
  const vouchers = getUserVouchers();
  
  // SECURE: Issue a real, verifiable coupon hash from the engine
  const verifiedCoupon = issueCoupon(deal.id, "USER_CURRENT");

  const newVoucher = {
      ...deal,
      id: `S-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Active",
      dateAdded: new Date().toISOString(),
      code: verifiedCoupon.hash // Match the SLSH-XXXX-XXXX protocol
  };
  localStorage.setItem(VOUCHER_KEY, JSON.stringify([newVoucher, ...vouchers]));
  window.dispatchEvent(new Event('vouchersUpdate'));
  return newVoucher;
};
