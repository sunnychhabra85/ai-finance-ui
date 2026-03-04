/* =========================================================
   STATIC/MOCK DATA - COMMENTED OUT - NOW USING REAL APIs
   This file contains mock data that was used before API integration.
   All screens now use real API endpoints:
   - useDashboard() for financial summary
   - useApiTransactions() for transactions
   - useDocuments() for upload history
   - sendChatMessageApi() for chat messages
========================================================= */

/* =========================================================
   Types (can later be moved to /types folder)
========================================================= */

export type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: string;
  positive?: boolean;
  category: "Food" | "Travel" | "Bills" | "Entertainment" | "Income";
};

export type SpendingCategory = {
  label: string;
  value: number;
};

export type FinancialSummary = {
  totalDebit: number;
  totalCredit: number;
  highestSpendingMonth: {
    month: string;
    amount: number;
  };
  topCategory: {
    name: string;
    percentage: number;
  };
  totalSpending: number;
  categories: SpendingCategory[];
};

/* =========================================================
   Transactions (matches Transactions screen exactly)
   NOW REPLACED BY: useApiTransactions() hook
========================================================= */

/* COMMENTED OUT - Using API
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Spotify Premium",
    date: "2024-05-24",
    amount: "-$14.99",
    category: "Entertainment",
  },
  {
    id: "2",
    title: "Uber Ride",
    date: "2024-05-23",
    amount: "-$24.50",
    category: "Travel",
  },
  {
    id: "3",
    title: "Whole Foods Market",
    date: "2024-05-23",
    amount: "-$142.30",
    category: "Food",
  },
  {
    id: "4",
    title: "Salary Deposit",
    date: "2024-05-22",
    amount: "+$4,500.00",
    positive: true,
    category: "Income",
  },
  {
    id: "5",
    title: "Starbucks Coffee",
    date: "2024-05-21",
    amount: "-$6.75",
    category: "Food",
  },
  {
    id: "6",
    title: "Netflix Subscription",
    date: "2024-05-20",
    amount: "-$19.99",
    category: "Entertainment",
  },
  {
    id: "7",
    title: "Electricity Bill",
    date: "2024-05-19",
    amount: "-$120.00",
    category: "Bills",
  },
];
*/

/* =========================================================
   Financial Overview & Insights (Overview screen)
   NOW REPLACED BY: useDashboard() hook
========================================================= */

/* COMMENTED OUT - Using API
export const mockSummary: FinancialSummary = {
  totalDebit: 3240,
  totalCredit: 5350,

  highestSpendingMonth: {
    month: "June",
    amount: 3500,
  },

  topCategory: {
    name: "Food",
    percentage: 25,
  },

  totalSpending: 1550,

  categories: [
    { label: "Food", value: 390 },
    { label: "Travel", value: 280 },
    { label: "Shopping", value: 420 },
    { label: "Bills", value: 310 },
    { label: "Entertainment", value: 150 },
  ],
};
*/

/* =========================================================
   AI Chat Suggested Prompts (AI Chat screen)
   NOW IMPLEMENTED IN: ChatChips component
========================================================= */

/* COMMENTED OUT - Using API
export const mockAiPrompts = [
  "Where am I spending most?",
  "Why was last month expensive?",
  "How can I reduce food expenses?",
  "Show me travel spending trends",
];
*/

/* =========================================================
   Upload History (Upload screen)
   NOW REPLACED BY: useDocuments() hook
========================================================= */

/* COMMENTED OUT - Using API
export const mockUploads = [
  {
    id: "1",
    fileName: "Chase_Statement_May.pdf",
    size: "1.2 MB",
    date: "Uploaded May 24",
    status: "Done",
  },
  {
    id: "2",
    fileName: "WellsFargo_Apr.pdf",
    size: "0.8 MB",
    date: "Uploaded Apr 01",
    status: "Done",
  },
];
*/
