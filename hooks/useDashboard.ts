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
  monthlyTrend?: Array<{
    month: string;
    amount: number;
  }>;
}

const toNumber = (value: any): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const normalizeMonthlyTrend = (rawTrend: any): Array<{ month: string; amount: number }> => {
  if (!Array.isArray(rawTrend)) return [];

  return rawTrend
    .map((item: any) => {
      const month =
        item?.month ||
        item?.monthName ||
        item?.label ||
        item?.name ||
        item?.period ||
        "";

      const amount = toNumber(
        item?.amount ??
          item?.total ??
          item?.totalSpending ??
          item?.spending ??
          item?.value ??
          item?.spent ??
          item?.expense ??
          item?.debit
      );

      return { month: String(month).trim(), amount };
    })
    .filter((item) => item.month.length > 0);
};

const normalizeCategories = (
  rawCategories: any
): Array<{ name: string; amount: number; percentage: number }> => {
  if (!Array.isArray(rawCategories)) return [];

  const normalized = rawCategories
    .map((item: any) => {
      const name = String(
        item?.name || item?.category || item?.categoryName || item?.label || ""
      ).trim();
      const amount = toNumber(
        item?.amount ??
          item?.total ??
          item?.totalSpending ??
          item?.spending ??
          item?.value
      );
      const percentage = toNumber(item?.percentage ?? item?.percent ?? item?.share);
      return { name, amount, percentage };
    })
    .filter((item) => item.name.length > 0);

  const totalAmount = normalized.reduce((sum, item) => sum + item.amount, 0);

  return normalized.map((item) => ({
    ...item,
    percentage:
      item.percentage > 0
        ? item.percentage
        : totalAmount > 0
        ? Number(((item.amount / totalAmount) * 100).toFixed(1))
        : 0,
  }));
};

const normalizeTopCategory = (rawTopCategory: any) => {
  if (!rawTopCategory) return undefined;

  if (typeof rawTopCategory === 'string') {
    return {
      name: rawTopCategory.trim(),
      percentage: 0,
    };
  }

  const name = String(
    rawTopCategory?.name ||
      rawTopCategory?.category ||
      rawTopCategory?.categoryName ||
      rawTopCategory?.label ||
      ""
  ).trim();
  const percentage = toNumber(
    rawTopCategory?.percentage ?? rawTopCategory?.percent ?? rawTopCategory?.share
  );

  if (!name) return undefined;

  return { name, percentage };
};

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
      const root = response.data || response;
      const summary = root?.summary || response.summary || {};
      const categories = normalizeCategories(
        root?.categories || summary?.categories || response.categories || []
      );
      const monthlyTrend = normalizeMonthlyTrend(
        root?.monthlyTrend ||
          root?.monthlyTrends ||
          summary?.monthlyTrend ||
          summary?.monthlyTrends ||
          response.monthlyTrend ||
          response.monthlyTrends
      );

      const derivedTopCategory =
        !normalizeTopCategory(
          root?.topCategory ||
            root?.mostSpendingCategory ||
            root?.highestSpendingCategory ||
            summary?.topCategory ||
            summary?.mostSpendingCategory ||
            response.topCategory ||
            response.mostSpendingCategory
        ) && categories.length > 0
          ? categories.reduce((max: any, current: any) =>
              (current.percentage || 0) > (max.percentage || 0) ? current : max
            )
          : undefined;

      const derivedHighestMonth =
        !root?.highestSpendingMonth && monthlyTrend.length > 0
          ? monthlyTrend.reduce((max, current) =>
              current.amount > max.amount ? current : max
            )
          : undefined;

      setData({
        totalDebit:
          summary?.totalDebit ||
          root?.totalDebit ||
          response.totalDebit ||
          0,
        totalCredit:
          summary?.totalCredit ||
          root?.totalCredit ||
          response.totalCredit ||
          0,
        highestSpendingMonth:
          root?.highestSpendingMonth ||
          response.highestSpendingMonth ||
          (derivedHighestMonth
            ? {
                month: derivedHighestMonth.month,
                amount: derivedHighestMonth.amount,
              }
            : undefined),
        topCategory:
          normalizeTopCategory(
            root?.topCategory ||
              root?.mostSpendingCategory ||
              root?.highestSpendingCategory ||
              summary?.topCategory ||
              summary?.mostSpendingCategory ||
              response.topCategory ||
              response.mostSpendingCategory
          ) || derivedTopCategory,
        categories,
        monthlyTrend,
      });
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // Set fallback dummy data on error to prevent UI breaking
      setData({
        totalDebit: 0,
        totalCredit: 0,
        categories: [],
        monthlyTrend: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setData({
        totalDebit: 0,
        totalCredit: 0,
        categories: [],
        monthlyTrend: [],
      });
      setLoading(false);
      return;
    }

    fetchDashboard();
  }, [token]);

  return { data, loading, error, refetch: fetchDashboard };
};
