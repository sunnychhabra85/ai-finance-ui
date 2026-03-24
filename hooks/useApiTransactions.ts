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

export const useApiTransactions = () => {
  const token = useAuthStore((s) => s.token);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getTransactionsApi(
        undefined,
        token || undefined
      );
      // Extract transactions from response - handle both formats
      const txns = response.data?.items || response.transactions || [];
      
      // Ensure amount is a number
      const normalizedTxns = txns.map((txn: any) => ({
        ...txn,
        amount: typeof txn.amount === 'string' ? Number(txn.amount) : txn.amount
      }));
      
      // Extract unique categories from transactions
      const uniqueCategories = Array.from(
        new Set(normalizedTxns.map((txn: ApiTransaction) => txn.category).filter(Boolean))
      ) as string[];
      
      setTransactions(normalizedTxns);
      setCategories(uniqueCategories);
    } catch (err: any) {
      console.error('Transactions fetch error:', err);
      setError(err.message || 'Failed to load transactions');
      
      // Set empty array on error
      setTransactions([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
      return;
    }

    setLoading(false);
    setError(null);
    setTransactions([]);
    setCategories([]);
  }, [token]);

  return { transactions, categories, loading, error, refetch: fetchTransactions };
};
