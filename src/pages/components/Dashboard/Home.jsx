import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Api from "../../../config/apiConfig";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

// Register necessary Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

import DashboardHeader from "./DashboardHeader";
import BalanceOverview from "./BalanceOverview";
import ExpensesChart from "./ExpensesChart";
import PocketsSection from "./PocketsSection";
import SavingGoalsSection from "./SavingGoalsSection";
import RecentTransactions from "./RecentTransactions";

import { formatCurrency, getMonthlyData, getTransactionIcon } from "./utils";
import { PIE_COLORS } from "./constants";

const Home = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setError] = useState(null);
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");

  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const isSidebarOpen = outletContext.isSidebarOpen ?? false;
  const toggleSidebar = outletContext.toggleSidebar ?? (() => {});

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      if (typeof setError === "function") {
        setError(null);
      }
      try {
        let token = null;
        let userId = null;

        if (typeof window !== "undefined") {
          token = localStorage.getItem("jwt_token");
          userId = localStorage.getItem("user_id");
        }

        if (!token || !userId) {
          if (typeof setError === "function") {
            setError(
              "Sesi Anda tidak valid atau kedaluwarsa. Silakan login kembali."
            );
          }
          if (typeof window !== "undefined") {
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_name");
          }
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const userDataPromise = Api.get(`/users/${userId}`);

        const [
          balanceResponse,
          accountsResponse,
          savingGoalsResponse,
          expensesResponse,
          incomesResponse,
          userResponse,
        ] = await Promise.all([
          Api.get(`/users/balance`).catch((err) => {
            console.error("Error fetching balance:", err);
            return { currentBalance: 0 };
          }),
          Api.get(`/accounts`).catch((err) => {
            console.error("Error fetching accounts:", err);
            return { accounts: [] };
          }),
          Api.get(`/saving-goals`).catch((err) => {
            console.error("Error fetching saving goals:", err);
            return { savingGoals: [] };
          }),
          Api.get(`/expenses`).catch((err) => {
            console.error("Error fetching expenses:", err);
            return { expenses: [] };
          }),
          Api.get(`/incomes`).catch((err) => {
            console.error("Error fetching incomes:", err);
            return { incomes: [] };
          }),
          userDataPromise.catch((err) => {
            console.error(
              "Error fetching user profile for user ID:",
              userId,
              err
            );
            return { name: "Guest", email: "guest@example.com" };
          }),
        ]);

        setTotalBalance(balanceResponse.currentBalance || 0);
        setAccounts(accountsResponse.accounts || []);
        setSavingGoals(savingGoalsResponse.savingGoals || []);
        setExpenses(expensesResponse.expenses || []);
        setIncomes(incomesResponse.incomes || []);

        setUserName(userResponse?.name || "Pengguna");
        setUserEmail(userResponse?.email || "email@example.com");
      } catch (err) {
        console.error("Failed to fetch data in Promise.all:", err);
        let errorMessage = "Gagal memuat data.";

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
            }
            setTimeout(() => navigate("/login"), 1500);
          } else if (
            errorMessage.toLowerCase().includes("server error") ||
            errorMessage.toLowerCase().includes("api error")
          ) {
            errorMessage =
              "Terjadi masalah server. Silakan coba beberapa saat lagi.";
          } else if (
            errorMessage
              .toLowerCase()
              .includes("koneksi atau kebijakan keamanan")
          ) {
            errorMessage =
              "Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau masalah CORS.";
          } else if (
            errorMessage.toLowerCase().includes("failed to parse response")
          ) {
            errorMessage =
              "Gagal memproses respons dari server. Mungkin masalah CORS/jaringan.";
          } else if (
            errorMessage
              .toLowerCase()
              .includes("cannot read properties of undefined")
          ) {
            errorMessage =
              "Terjadi kesalahan data. Beberapa informasi mungkin tidak tersedia.";
          }
        }
        if (typeof setError === "function") {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [setError, navigate]);

  const { months, incomeAmounts, expenseAmounts, balanceOverTime } =
    getMonthlyData(incomes, expenses, totalBalance);

  const totalIncomeLastMonth = incomeAmounts[incomeAmounts.length - 2] || 0;
  // PERBAIKAN: Mengambil total pengeluaran bulan lalu dari expenseAmounts
  const totalExpenseLastMonth = expenseAmounts[expenseAmounts.length - 2] || 0;
  const totalIncomeCurrentMonth = incomeAmounts[incomeAmounts.length - 1] || 0;
  // PERBAIKAN: Mengambil total pengeluaran bulan berjalan dari expenseAmounts
  const totalExpenseCurrentMonth =
    expenseAmounts[expenseAmounts.length - 1] || 0;

  const incomeGrowth =
    totalIncomeLastMonth > 0
      ? ((totalIncomeCurrentMonth - totalIncomeLastMonth) /
          totalIncomeLastMonth) *
        100
      : 0;
  const expenseGrowth =
    totalExpenseLastMonth > 0
      ? ((totalExpenseCurrentMonth - totalExpenseLastMonth) /
          totalExpenseLastMonth) *
        100
      : 0;

  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const totalAllExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 w-full animate-pulse">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-gray-300 rounded-md"></div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-3 bg-gray-300 rounded-full pr-3 pl-1 py-1">
              <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
              <div className="text-right">
                <div className="h-4 w-24 bg-gray-400 rounded-md mb-1"></div>
                <div className="h-3 w-32 bg-gray-400 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Balance and Expenses Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Skeleton Balance Section */}
          <div className="lg:col-span-3 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="h-6 w-32 bg-gray-300 rounded-md mb-6"></div>
            <div className="h-4 w-24 bg-gray-300 rounded-md mb-1"></div>
            <div className="h-8 w-48 bg-gray-400 rounded-md mb-6"></div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="h-4 w-20 bg-gray-300 rounded-md mb-1"></div>
                <div className="h-6 w-24 bg-gray-400 rounded-md"></div>
              </div>
              <div className="text-right">
                <div className="h-4 w-20 bg-gray-300 rounded-md mb-1"></div>
                <div className="h-6 w-24 bg-gray-400 rounded-md"></div>
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded-md"></div>{" "}
            {/* Placeholder for line chart */}
          </div>

          {/* Skeleton Expenses Pie Chart Section */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="h-6 w-32 bg-gray-300 rounded-md mb-6"></div>
            <div className="flex flex-col items-center">
              <div className="h-48 w-48 rounded-full bg-gray-200 mb-6"></div>{" "}
              {/* Placeholder for pie chart */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-xs">
                {[...Array(4)].map(
                  (
                    _,
                    i // 4 placeholder categories
                  ) => (
                    <div key={i} className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
                      <div className="h-3 w-8 bg-gray-400 rounded-md ml-auto"></div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Pockets, Saving Goals, and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Skeleton Pockets */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="h-6 w-24 bg-gray-300 rounded-md mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map(
                (
                  _,
                  i // 3 placeholder accounts
                ) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-200 mr-3 h-8 w-8"></div>
                      <div className="h-5 w-24 bg-gray-300 rounded-md"></div>
                    </div>
                    <div className="h-5 w-20 bg-gray-400 rounded-md"></div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Skeleton Saving Goals */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="h-6 w-28 bg-gray-300 rounded-md mb-6"></div>
            <div className="space-y-4">
              {[...Array(2)].map(
                (
                  _,
                  i // 2 placeholder goals
                ) => (
                  <div key={i} className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-gray-200 mr-3 h-8 w-8"></div>
                        <div className="h-5 w-28 bg-gray-300 rounded-md"></div>
                      </div>
                      <div className="h-4 w-12 bg-gray-400 rounded-md"></div>
                    </div>
                    <div className="h-3 w-40 bg-gray-300 rounded-md"></div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Skeleton Transactions */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="h-6 w-32 bg-gray-300 rounded-md mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map(
                (
                  _,
                  i // 5 placeholder transactions
                ) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                      <div>
                        <div className="h-4 w-28 bg-gray-300 rounded-md mb-1"></div>
                        <div className="h-3 w-20 bg-gray-400 rounded-md"></div>
                      </div>
                    </div>
                    <div className="h-4 w-20 bg-gray-400 rounded-md"></div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <DashboardHeader
          userName={userName}
          userEmail={userEmail}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3 min-w-0">
            <BalanceOverview
              totalBalance={totalBalance}
              totalIncomeCurrentMonth={totalIncomeCurrentMonth}
              totalExpenseCurrentMonth={totalExpenseCurrentMonth}
              incomeGrowth={incomeGrowth}
              expenseGrowth={expenseGrowth}
              months={months}
              balanceOverTime={balanceOverTime}
              formatCurrency={formatCurrency}
            />
          </div>
          <div className="lg:col-span-2 min-w-0">
            <ExpensesChart
              expenseByCategory={expenseByCategory}
              totalAllExpenses={totalAllExpenses}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>

        {/* Kolom Bawah*/}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

          {/* Kolom 1: Pockets */}
          <div className="lg:col-span-1 min-w-0">
            <PocketsSection
              accounts={accounts}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Kolom 2: Saving Goals */}
          <div className="lg:col-span-1 min-w-0">
            <SavingGoalsSection
              savingGoals={savingGoals}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Kolom 3 & 4: Transactions (lebih lebar) */}
          <div className="lg:col-span-2 min-w-0">
            <RecentTransactions
              incomes={incomes}
              expenses={expenses}
              accounts={accounts} 
              formatCurrency={formatCurrency}
              getTransactionIcon={getTransactionIcon}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
