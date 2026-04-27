import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface AdminContextType {
  data: {
    users: any[];
    merchants: any[];
    applications: any[];
    deals: any[];
    requests: any[];
    vouchers: any[];
    reports: any[];
    reviews: any[];
    auditLogs: any[];
    analytics: any[];
    settings: any;
    counts?: {
      users: number;
      merchants: number;
      applications: number;
      deals: number;
      requests: number;
      vouchers: number;
      reports: number;
      reviews: number;
      total_revenue: number;
    };
  };
  isLoading: boolean;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
  updateData: (key: string, newData: any) => void;
  fetchEntity: (entity: 'users' | 'merchants' | 'deals', page: number, limit: number, search?: string) => Promise<any>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState({
    users: [],
    merchants: [],
    applications: [],
    deals: [],
    requests: [],
    vouchers: [],
    reports: [],
    reviews: [],
    auditLogs: [],
    analytics: [],
    settings: {
        siteName: "",
        supportEmail: "",
        maintenanceMode: false,
        promoBanner: { enabled: false, text: "" },
        commission: "10%",
        withdrawalFee: "100",
        taxRate: "7.5%",
        enforce2FA: false,
        rateLimit: "100/min",
        sessionTimeout: "24h"
    },
    counts: {
        users: 0,
        merchants: 0,
        applications: 0,
        deals: 0,
        requests: 0,
        vouchers: 0,
        reports: 0,
        reviews: 0,
        total_revenue: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSummary = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const summary = await apiClient('/admin/summary');
      if (summary) {
        setData(summary);
      }
    } catch (error) {
      console.error('Failed to pre-fetch admin summary:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchEntity = async (entity: 'users' | 'merchants' | 'deals', page: number, limit: number, search: string = "") => {
    try {
      const result = await apiClient(`/admin/${entity}?page=${page}&limit=${limit}&search=${search}`);
      // Update specific entity data in state to keep counts synced if needed
      if (result.data) {
          setData(prev => ({
              ...prev,
              [entity]: result.data,
              counts: {
                  ...prev.counts,
                  [entity]: result.count
              }
          }));
      }
      return result;
    } catch (error) {
      console.error(`Failed to fetch ${entity}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const updateData = (key: string, newData: any) => {
    setData(prev => ({ ...prev, [key]: newData }));
  };

  return (
    <AdminContext.Provider value={{ 
      data, 
      isLoading, 
      isRefreshing, 
      refreshData: () => fetchSummary(true),
      updateData,
      fetchEntity
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminProvider');
  }
  return context;
};
