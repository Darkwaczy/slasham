/**
 * Merchant & Admin Synchronization Utility
 * Handles Campaign Requests, Approvals, and Notifications.
 */

export interface CampaignRequest {
  id: string;
  merchantId: string;
  businessName: string;
  productName: string;
  productImage: string;
  originalPrice: string;
  dealPrice: string;
  category: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  couponType: 'Discount' | 'Voucher' | 'BOGO' | 'Stay' | 'Gift Card';
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNote?: string;
  submittedAt: string;
}

export interface Notification {
  id: string;
  userId: string; // 'admin' or merchantId
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

const STORAGE_KEY_REQUESTS = "slasham_campaign_requests";
const STORAGE_KEY_NOTIFS = "slasham_notifications";

export const getCampaignRequests = (): CampaignRequest[] => {
  const stored = localStorage.getItem(STORAGE_KEY_REQUESTS);
  return stored ? JSON.parse(stored) : [];
};

export const saveCampaignRequest = (request: Omit<CampaignRequest, 'id' | 'status' | 'submittedAt'>) => {
  const requests = getCampaignRequests();
  const newRequest: CampaignRequest = {
    ...request,
    id: `REQ-${Date.now()}`,
    status: 'Pending',
    submittedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify([newRequest, ...requests]));
  
  // Notify Admin
  addNotification('admin', 'New Campaign Request', `Merchant ${request.businessName} submitted a new deal for ${request.productName}.`, 'info');
  
  window.dispatchEvent(new Event('campaignRequestsUpdate'));
  return newRequest;
};

export const updateCampaignRequest = (id: string, updates: Partial<CampaignRequest>) => {
  const requests = getCampaignRequests();
  const updated = requests.map(r => r.id === id ? { ...r, ...updates } : r);
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated));
  window.dispatchEvent(new Event('campaignRequestsUpdate'));
};

export const updateRequestStatus = (id: string, status: 'Approved' | 'Rejected', note?: string, adminDeterminedPrice?: string) => {
  const requests = getCampaignRequests();
  const updated = requests.map(r => {
    if (r.id === id) {
      const finalPrice = adminDeterminedPrice || r.dealPrice;
      // Notify Merchant
      addNotification(r.merchantId, 
        `Campaign ${status}`, 
        status === 'Approved' ? `Your deal for ${r.productName} has been approved and is now live at ${finalPrice}!` : `Your deal was rejected. Note: ${note}`,
        status === 'Approved' ? 'success' : 'error'
      );
      return { ...r, status, adminNote: note, dealPrice: finalPrice };
    }
    return r;
  });
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated));
  window.dispatchEvent(new Event('campaignRequestsUpdate'));
};

// Notification Helpers
export const getNotifications = (userId: string): Notification[] => {
  const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
  const all = stored ? JSON.parse(stored) : [];
  return all.filter((n: Notification) => n.userId === userId);
};

export const addNotification = (userId: string, title: string, message: string, type: Notification['type']) => {
  const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
  const all = stored ? JSON.parse(stored) : [];
  const newNotif: Notification = {
    id: `NOTIF-${Date.now()}`,
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify([newNotif, ...all]));
  window.dispatchEvent(new Event('notificationsUpdate'));
};

export const markNotifsRead = (userId: string) => {
  const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
  const all = stored ? JSON.parse(stored) : [];
  const updated = all.map((n: Notification) => n.userId === userId ? { ...n, read: true } : n);
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdate'));
};
