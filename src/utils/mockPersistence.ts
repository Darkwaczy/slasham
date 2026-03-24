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
  companyName?: string;
  unlockNote?: string;
  redeemAddress?: string;
  requestId?: string;
}

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
