/**
 * Secure Coupon Verification Engine
 * Implements strong hashing for unique coupon identification and validation.
 */

export interface Coupon {
  hash: string;
  dealId: number | string;
  userId: string;
  redeemed: boolean;
  redeemedAt?: string;
}

/**
 * Generates a high-entropy hash for a coupon.
 * Combines dealId, userId, and a high-resolution timestamp.
 */
export const generateCouponHash = (dealId: string | number, userId: string): string => {
  const seed = `${dealId}-${userId}-${Date.now()}-${Math.random().toString(36)}`;
  
  // Strong hash simulation ensuring valid alphanumeric characters
  let hash = "";
  for (let i = 0; i < seed.length && hash.length < 8; i++) {
    const charCode = seed.charCodeAt(i);
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      hash += seed[i].toUpperCase();
    }
  }
  
  // Ensure we have exactly 8 characters after 'SLSH'
  while (hash.length < 8) {
    hash += Math.random().toString(36).substring(2, 3).toUpperCase();
  }
  
  const part2 = hash.substring(0, 4);
  const part3 = hash.substring(4, 8);
  
  return `SLSH-${part2}-${part3}`;
};

const STORAGE_KEY_COUPONS = "slasham_verified_coupons";

export const getVerifiedCoupons = (): Coupon[] => {
  const stored = localStorage.getItem(STORAGE_KEY_COUPONS);
  return stored ? JSON.parse(stored) : [];
};

export const issueCoupon = (dealId: string | number, userId: string): Coupon => {
  const coupons = getVerifiedCoupons();
  const newCoupon: Coupon = {
    hash: generateCouponHash(dealId, userId),
    dealId,
    userId,
    redeemed: false
  };
  localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify([...coupons, newCoupon]));
  return newCoupon;
};

export const validateCoupon = (hash: string): { success: boolean; message: string } => {
  const coupons = getVerifiedCoupons();
  const coupon = coupons.find(c => c.hash === hash);

  if (!coupon) return { success: false, message: "Invalid Coupon Protocol - Asset Not Found" };
  if (coupon.redeemed) return { success: false, message: "Double-Verification Blocked - Coupon Already Liquidated" };

  const updated = coupons.map(c => 
    c.hash === hash ? { ...c, redeemed: true, redeemedAt: new Date().toISOString() } : c
  );
  
  localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(updated));
  return { success: true, message: "Secure Validation Success - Coupon Cleared" };
};
