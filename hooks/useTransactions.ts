import { useEffect, useState } from 'react';
import { getTransactionsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

export interface ApiTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  category: string;
  description?: string;
}

export const useApiTransactions = (category?: string) => {
  const token = useAuthStore((s) => s.token);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getTransactionsApi(
        category !== 'All' ? category : undefined,
        token || undefined
      );
      // Extract transactions from response
      const txns = response.data?.items || response.transactions || [];
      setTransactions(txns);
    } catch (err: any) {
      console.error('Transactions fetch error:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, category]);

  return { transactions, loading, error, refetch: fetchTransactions };
};