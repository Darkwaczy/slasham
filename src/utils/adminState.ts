/**
 * Admin State Utility
 * Mocked settings store. Product requirement: do not persist on the frontend.
 */

import { storage } from "./storage";

export interface AdminSettings {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  commission: string;
  withdrawalFee: string;
  taxRate: string;
  enforce2FA: boolean;
  rateLimit: string;
  sessionTimeout: string;
  promoBanner: {
    enabled: boolean;
    text: string;
    type: 'info' | 'success' | 'warning' | 'error';
  };
  featuredDealId: number | null;
}

const DEFAULT_SETTINGS: AdminSettings = {
  siteName: "Slasham Deals",
  supportEmail: "ops@slasham.com",
  maintenanceMode: false,
  commission: "15%",
  withdrawalFee: "₦500",
  taxRate: "7.5%",
  enforce2FA: true,
  rateLimit: "1,000 req/min",
  sessionTimeout: "24 Hours",
  promoBanner: {
    enabled: true,
    text: "🔥 FLASH SALE: Use code SLASHAM20 for extra 20% off on all spa deals!",
    type: 'info'
  },
  featuredDealId: 1
};

const STORAGE_KEY = "slasham_admin_settings";

export const getAdminSettings = (): AdminSettings => {
  const stored = storage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveAdminSettings = (settings: AdminSettings) => {
  storage.setItem(STORAGE_KEY, JSON.stringify(settings));
  // Dispatch a custom event so other components can listen without re-polling
  window.dispatchEvent(new Event('adminSettingsUpdate'));
};
