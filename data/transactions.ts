export type Category = "Food" | "Travel" | "Bills" | "Income";

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  category: Category;
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Spotify Premium",
    date: "2024-05-24",
    amount: -14.99,
    category: "Bills",
  },
  {
    id: "2",
    title: "Uber Ride",
    date: "2024-05-23",
    amount: -24.5,
    category: "Travel",
  },
  {
    id: "3",
    title: "Whole Foods Market",
    date: "2024-05-23",
    amount: -142.3,
    category: "Food",
  },
  {
    id: "4",
    title: "Salary Deposit",
    date: "2024-05-22",
    amount: 4500,
    category: "Income",
  },
  {
    id: "5",
    title: "Starbucks Coffee",
    date: "2024-05-21",
    amount: -6.75,
    category: "Food",
  },
];
