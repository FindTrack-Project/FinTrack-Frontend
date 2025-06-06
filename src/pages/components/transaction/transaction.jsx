// src/pages/components/transaction/transaction.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig"; // Adjust path if necessary

// Import components
import TransactionHeader from "./TransactionHeader";
import CashFlowChart from "./CashFlowChart";
import IncomeBreakdownCard from "./IncomeBreakdownCard";
import ExpenseBreakdownCard from "./ExpenseBreakdownCard";
import TransactionList from "./TransactionList"; // Assuming TransactionList is the component for the list section

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

  // Define the function to refetch all data (this will be passed as onTransactionAdded)
  const refetchAllTransactionData = async () => {
    setLoading(true); // Show loading state again
    setError(null); // Clear any previous errors
    try {
      let token = null;
      let userId = null;

      if (typeof window !== "undefined") {
        token = localStorage.getItem("jwt_token");
        userId = localStorage.getItem("user_id");
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
        setUserName(userResult.value.user.name || "Pengguna");
        setUserEmail(userResult.value.user.email || "email@example.com");
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "user_name",
            userResult.value.user.name || "Pengguna"
          );
          localStorage.setItem(
            "user_email",
            userResult.value.user.email || "email@example.com"
          );
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

  useEffect(() => {
    refetchAllTransactionData(); // Initial data fetch on component mount
  }, [navigate]); // navigate is a dependency, ensure it's stable (from useNavigate)

  // Data processing for charts and list
  const filteredCashFlowData = calculateCashFlowData(incomes, expenses);

  const incomePieData = calculatePieData(incomes, "amount", "source");
  const expensesPieData = calculatePieData(expenses, "amount", "category");

  const allTransactions = [
    ...incomes.map((i) => ({ ...i, type: "Pemasukan" })),
    ...expenses.map((e) => ({ ...e, type: "Pengeluaran" })),
  ];

  if (error) {
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

<<<<<<< HEAD
  // Skeleton Loaders
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 col-span-1 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
=======
  // Skeleton Loader Component (simple placeholders)
  const CashFlowChartSkeleton = () => (
  <section className="bg-white rounded-2xl shadow-sm p-6 col-span-1 animate-pulse">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
      <div className="h-8 bg-gray-200 rounded w-32"></div>
    </div>
    {/* Filter Buttons */}
    <div className="flex items-center mb-6 space-x-2">
      <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
      <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
      <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
    </div>
    {/* Legend */}
    <div className="flex space-x-6 mb-6 text-sm">
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-2"></span>
        <span className="h-4 w-14 bg-gray-200 rounded"></span>
      </div>
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-2"></span>
        <span className="h-4 w-16 bg-gray-200 rounded"></span>
>>>>>>> c6dd8bf6cf4ce2c2af1781a428522de6a81b3d30
      </div>
    </div>
    {/* Chart Area */}
    <div className="h-56 bg-gray-200 rounded"></div>
  </section>
  );

  const IncomeBreakdownCardSkeleton = () => (
    <section className="h-full bg-white rounded-2xl shadow-sm p-6 col-span-1 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
      {/* Total Income */}
      <div className="text-center text-2xl font-bold text-gray-800 mb-6">
        <div className="h-8 w-32 mx-auto bg-gray-200 rounded"></div>
      </div>
      {/* Pie Chart Skeleton */}
      <div className="flex justify-center mb-6">
        <div className="h-48 w-48 bg-gray-200 rounded-full"></div>
      </div>
      {/* Legend Skeleton */}
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0 bg-gray-300"></span>
            <span className="h-4 w-16 bg-gray-200 rounded"></span>
          </div>
        ))}
      </div>
    </section>
  );

  const TransactionListSkeleton = () => (
    <section className="bg-white rounded-2xl shadow-sm p-6 col-span-1 animate-pulse">
      {/* Header & Filters */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-28 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      {/* List Skeleton */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {[...Array(2)].map((_, dateIdx) => (
          <div key={dateIdx}>
            <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-3 px-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, trxIdx) => (
                <div
                  key={trxIdx}
                  className="flex items-center p-3 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-4 flex-shrink-0"></div>
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const ExpenseBreakdownCardSkeleton = () => (
    <section className="h-full bg-white rounded-2xl shadow-sm p-6 col-span-1 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
      {/* Total Expenses */}
      <div className="text-center text-2xl font-bold text-gray-800 mb-6">
        <div className="h-8 w-32 mx-auto bg-gray-200 rounded"></div>
      </div>
      {/* Pie Chart Skeleton */}
      <div className="flex justify-center mb-6">
        <div className="h-48 w-48 bg-gray-200 rounded-full"></div>
      </div>
      {/* Legend Skeleton */}
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0 bg-gray-300"></span>
            <span className="h-4 w-16 bg-gray-200 rounded"></span>
          </div>
        ))}
      </div>
    </section>
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
        {/* Skeleton Header */}
        <SkeletonHeader />
<<<<<<< HEAD
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SkeletonChartCard />
          <SkeletonChartCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
=======
        {/* Main Grid Layout for 3x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Top-Left: Cash Flow Section */}
          <div className="lg:col-span-3 min-w-0">
            <CashFlowChartSkeleton />
          </div>
          {/* Top-Right: Income Section */}
          <div className="lg:col-span-2 min-w-0">
            <IncomeBreakdownCardSkeleton />
          </div>
        </div>
        {/* Main Grid Layout for 3x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Bottom-Left: Transactions List Section */}
          <div className="lg:col-span-3 min-w-0">
            <TransactionListSkeleton />
          </div>
          {/* Bottom-Right: Expenses Section */}
          <div className="lg:col-span-2 min-w-0">
            <ExpenseBreakdownCardSkeleton />
          </div>
>>>>>>> c6dd8bf6cf4ce2c2af1781a428522de6a81b3d30
        </div>
        {/* End of Main Grid */}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      {/* Header */}
      <TransactionHeader userName={userName} userEmail={userEmail} />
      {/* Main Grid Layout for 3x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Top-Left: Cash Flow Section */}
        <div className="lg:col-span-3 min-w-0">
          <CashFlowChart
            cashFlowData={filteredCashFlowData}
            cashFlowFilter={cashFlowFilter}
            setCashFlowFilter={setCashFlowFilter}
          />
        </div>
        {/* Top-Right: Income Section */}
        <div className="lg:col-span-2 min-w-0">
          <IncomeBreakdownCard incomePieData={incomePieData}  />
        </div>
      </div>
      {/* Main Grid Layout for 3x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Bottom-Left: Transactions List Section */}
<<<<<<< HEAD
        <TransactionList
          allTransactions={allTransactions}
          accounts={accounts}
          getAccountName={getAccountName}
          onTransactionAdded={refetchAllTransactionData} // Pass the refetch function here
        />

=======
        <div className="lg:col-span-3 min-w-0">
          <TransactionList
            allTransactions={allTransactions}
            accounts={accounts}
            getAccountName={getAccountName} // Pass getAccountName to TransactionList
          />
        </div>
>>>>>>> c6dd8bf6cf4ce2c2af1781a428522de6a81b3d30
        {/* Bottom-Right: Expenses Section */}
        <div className="lg:col-span-2 min-w-0">
          <ExpenseBreakdownCard expensesPieData={expensesPieData}   />
        </div>
      </div>
      {/* End of Main Grid */}
    </div>
  );
};

export default TransactionPage;
