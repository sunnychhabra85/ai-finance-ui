import { useMemo } from "react";
import { Category, TRANSACTIONS } from "../data/transactions";

export const useTransactions = (
  search: string,
  category: Category | "All"
) => {
  const data = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        category === "All" || t.category === category;

      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return data;
};
