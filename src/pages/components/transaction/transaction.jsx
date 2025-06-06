import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig"; // Adjust path if necessary

// Import components
import TransactionHeader from "./TransactionHeader";
import CashFlowChart from "./CashFlowChart";
import IncomeBreakdownCard from "./IncomeBreakdownCard";
import ExpenseBreakdownCard from "./ExpenseBreakdownCard";
import TransactionList from "./TransactionList";

// Import utilities and data
import {
  calculateCashFlowData,
  calculatePieData,
  getAccountName as getAccountNameUtil,
} from "./utils";
import { COLORS_INCOME_PIE, COLORS_EXPENSES_PIE } from "./data";

const TransactionPage = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]); // To map accountId to account name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");
  const [cashFlowFilter, setCashFlowFilter] = useState("All");

  const navigate = useNavigate();

  const getAccountName = (accountId) => getAccountNameUtil(accountId, accounts);

  useEffect(() => {
    const fetchTransactionData = async () => {
      setLoading(true);
      setError(null);
      try {
        let token = null;
        let userId = null;

        if (typeof window !== "undefined") {
          token = localStorage.getItem("jwt_token");
          userId = localStorage.getItem("user_id");
          const cachedUserName = localStorage.getItem("user_name");
          const cachedUserEmail = localStorage.getItem("user_email");
          if (cachedUserName && cachedUserEmail) {
            setUserName(cachedUserName);
            setUserEmail(cachedUserEmail);
          }
        }

        if (!token || !userId) {
          setError(
            "Sesi Anda tidak valid atau kedaluwarsa. Silakan login kembali."
          );
          if (typeof window !== "undefined") {
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_email");
          }
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const [expensesResult, incomesResult, accountsResult, userResult] =
          await Promise.allSettled([
            Api.get(`/expenses`),
            Api.get(`/incomes`),
            Api.get(`/accounts`),
            Api.get(`/users/${userId}`),
          ]);

        if (expensesResult.status === "fulfilled") {
          setExpenses(expensesResult.value.expenses || []);
        } else {
          console.error("Error fetching expenses:", expensesResult.reason);
        }

        if (incomesResult.status === "fulfilled") {
          setIncomes(incomesResult.value.incomes || []);
        } else {
          console.error("Error fetching incomes:", incomesResult.reason);
        }

        if (accountsResult.status === "fulfilled") {
          setAccounts(accountsResult.value.accounts || []);
        } else {
          console.error("Error fetching accounts:", accountsResult.reason);
        }

        if (
          userResult.status === "fulfilled" &&
          userResult.value &&
          userResult.value.user
        ) {
          const fetchedUserName = userResult.value.user.name || "Pengguna";
          const fetchedUserEmail =
            userResult.value.user.email || "email@example.com";

          setUserName(fetchedUserName);
          setUserEmail(fetchedUserEmail);

          if (typeof window !== "undefined") {
            localStorage.setItem("user_name", fetchedUserName);
            localStorage.setItem("user_email", fetchedUserEmail);
          }
        } else {
          const reason = userResult.reason
            ? userResult.reason instanceof Error
              ? userResult.reason.message
              : String(userResult.reason)
            : userResult.status === "fulfilled" && !userResult.value?.user
            ? "Fulfilled but missing 'user' object in value"
            : "Unknown reason (likely rejected)";

          console.error(
            "Error fetching user profile (Rejected or Missing Data):",
            reason
          );
          if (typeof window !== "undefined") {
            setUserName(localStorage.getItem("user_name") || "Pengguna");
            setUserEmail(
              localStorage.getItem("user_email") || "email@example.com"
            );
          }
        }
      } catch (err) {
        console.error(
          "Failed to fetch data in TransactionPage (main catch):",
          err
        );
        let errorMessage = "Gagal memuat data transaksi.";
        if (err.message) {
          errorMessage = err.message;
          if (
            errorMessage.includes("401") ||
            errorMessage.toLowerCase().includes("unauthorized") ||
            errorMessage.toLowerCase().includes("expired token")
          ) {
            errorMessage =
              "Sesi Anda tidak valid atau kedaluwarsa. Silakan login kembali.";
            if (typeof window !== "undefined") {
              localStorage.removeItem("jwt_token");
              localStorage.removeItem("user_id");
              localStorage.removeItem("user_name");
              localStorage.removeItem("user_email");
            }
            setTimeout(() => navigate("/login"), 1500);
          } else if (
            errorMessage.toLowerCase().includes("server error") ||
            errorMessage.toLowerCase().includes("api error") ||
            errorMessage.toLowerCase().includes("failed to fetch")
          ) {
            errorMessage =
              "Terjadi masalah server atau koneksi. Silakan coba lagi nanti.";
          } else if (
            errorMessage
              .toLowerCase()
              .includes("cannot read properties of undefined")
          ) {
            errorMessage =
              "Terjadi kesalahan data. Beberapa informasi mungkin tidak tersedia.";
          }
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [navigate]);

  // Data processing for charts and list
  const filteredCashFlowData = calculateCashFlowData(incomes, expenses);

  const incomePieData = calculatePieData(incomes, "amount", "source");
  const expensesPieData = calculatePieData(expenses, "amount", "category");

  // Combine and sort all transactions for the list
  const allTransactions = [
    ...incomes.map((i) => ({ ...i, type: "Pemasukan" })),
    ...expenses.map((e) => ({ ...e, type: "Pengeluaran" })),
  ];

  if (error) {
    // Show error state before loading
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-4 rounded-lg m-4 shadow-md">
        <p className="text-lg font-semibold mb-2">Terjadi Kesalahan!</p>
        <p className="text-base text-center">{error}</p>
        {error.includes("login kembali") && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  // Skeleton Loader Component (simple placeholders)
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 col-span-1 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const SkeletonChartCard = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 col-span-1 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-48 bg-gray-200 rounded mb-6"></div> {/* Chart area */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  const SkeletonHeader = () => (
    <header className="flex justify-between items-center mb-8 animate-pulse">
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="h-10 w-40 bg-gray-200 rounded-full"></div>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
        <SkeletonHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SkeletonChartCard /> {/* For Balance */}
          <SkeletonChartCard /> {/* For Expenses Pie Chart */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SkeletonCard /> {/* For Pockets */}
          <SkeletonCard /> {/* For Saving Goals */}
          <SkeletonCard /> {/* For Transactions List */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      {/* Header */}
      <TransactionHeader userName={userName} userEmail={userEmail} />
      {/* Main Grid Layout for 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-Left: Cash Flow Section */}
        <CashFlowChart
          cashFlowData={filteredCashFlowData}
          cashFlowFilter={cashFlowFilter}
          setCashFlowFilter={setCashFlowFilter}
        />

        {/* Top-Right: Income Section */}
        <IncomeBreakdownCard incomePieData={incomePieData} />

        {/* Bottom-Left: Transactions List Section */}
        <TransactionList
          allTransactions={allTransactions}
          accounts={accounts}
          getAccountName={getAccountName} // Pass getAccountName to TransactionList
        />

        {/* Bottom-Right: Expenses Section */}
        <ExpenseBreakdownCard expensesPieData={expensesPieData} />
      </div>{" "}
      {/* End of Main Grid */}
    </div>
  );
};

export default TransactionPage;
