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
