import { useEffect, useState } from 'react';
import { getDashboardApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

export interface DashboardData {
  totalDebit: number;
  totalCredit: number;
  highestSpendingMonth?: {
    month: string;
    amount: number;
  };
  topCategory?: {
    name: string;
    percentage: number;
  };
  categories?: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

export const useDashboard = () => {
  const token = useAuthStore((s) => s.token);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getDashboardApi(token || undefined);
      // Adapt the response to your UI needs
      // Handle both response.data.X and response.X formats
      setData({
        totalDebit: response.data?.summary?.totalDebit || response.totalDebit || 0,
        totalCredit: response.data?.summary?.totalCredit || response.totalCredit || 0,
        highestSpendingMonth: response.data?.highestSpendingMonth || response.highestSpendingMonth,
        topCategory: response.data?.topCategory || response.topCategory,
        categories: response.data?.categories || response.categories || [],
      });
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // Set fallback dummy data on error to prevent UI breaking
      setData({
        totalDebit: 0,
        totalCredit: 0,
        categories: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  return { data, loading, error, refetch: fetchDashboard };
};
