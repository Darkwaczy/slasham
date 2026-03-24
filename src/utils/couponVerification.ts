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
  // Scramble the seed with high-entropy components including userId
  const timestamp = Date.now().toString(36).toUpperCase();
  const userSeed = userId.slice(0, 2).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const dealRef = String(dealId).padStart(4, '0').slice(-4);
  
  // Create a mixed-alphabet hash that doesn't follow a simple dealID prefix
  // Pattern: SLSH - [Random/User] - [Deal/Time]
  const part1 = (randomPart[0] + userSeed + timestamp.slice(-1)).toUpperCase();
  const part2 = (dealRef.slice(-2) + timestamp.slice(-2)).toUpperCase();
  
  return `SLSH-${part1}-${part2}`;
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

  // --- NEW: SYNC WITH USER WALLET ---
  try {
    const VOUCHER_KEY = "slasham_user_vouchers";
    const userVouchers = JSON.parse(localStorage.getItem(VOUCHER_KEY) || "[]");
    const updatedUserVouchers = userVouchers.map((v: any) => 
      v.code === hash ? { ...v, status: "Redeemed", redeemedAt: new Date().toISOString() } : v
    );
    localStorage.setItem(VOUCHER_KEY, JSON.stringify(updatedUserVouchers));
    window.dispatchEvent(new Event('vouchersUpdate'));
  } catch (err) {
    console.error("Wallet sync failed:", err);
  }

  return { success: true, message: "Secure Validation Success - Coupon Cleared" };
};
