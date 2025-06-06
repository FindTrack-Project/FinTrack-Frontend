import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
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
          }
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const userDataPromise = Api.get(`/users/${userId}`).catch((err) => {
          console.error(
            "Error fetching user profile for user ID:",
            userId,
            err
          );
          return { user: { name: "Guest", email: "guest@example.com" } };
        });

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
          userDataPromise,
        ]);

        setTotalBalance(balanceResponse.currentBalance || 0);
        setAccounts(accountsResponse.accounts || []);
        setSavingGoals(savingGoalsResponse.savingGoals || []);
        setExpenses(expensesResponse.expenses || []);
        setIncomes(incomesResponse.incomes || []);

        setUserName(userResponse?.user?.name || "Pengguna");
        setUserEmail(userResponse?.user?.email || "email@example.com");
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
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  const { months, incomeAmounts, expenseAmounts, balanceOverTime } =
    getMonthlyData(incomes, expenses, totalBalance);

  const totalIncomeLastMonth = incomeAmounts[incomeAmounts.length - 2] || 0;
  const totalExpenseLastMonth = expenseAmounts[expenseAmounts.length - 2] || 0;
  const totalIncomeCurrentMonth = incomeAmounts[incomeAmounts.length - 1] || 0;
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading financial data...</p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/*
        PERBAIKAN: Hapus 'max-w-7xl mx-auto' dari div ini.
        Ini akan memungkinkan konten dashboard mengambil seluruh lebar yang tersedia
        dari parent 'flex-1' di DashboardLayout.
      */}
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <DashboardHeader userName={userName} userEmail={userEmail} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tambahkan min-w-0 untuk memungkinkan item grid menyusut */}
          <div className="min-w-0">
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
          {/* Tambahkan min-w-0 untuk memungkinkan item grid menyusut */}
          <div className="min-w-0">
            <ExpensesChart
              expenseByCategory={expenseByCategory}
              totalAllExpenses={totalAllExpenses}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Tambahkan min-w-0 untuk memungkinkan item grid menyusut */}
          <div className="min-w-0">
            <PocketsSection
              accounts={accounts}
              formatCurrency={formatCurrency}
            />
          </div>
          {/* Tambahkan min-w-0 untuk memungkinkan item grid menyusut */}
          <div className="min-w-0">
            <SavingGoalsSection
              savingGoals={savingGoals}
              formatCurrency={formatCurrency}
            />
          </div>
          {/* Tambahkan min-w-0 untuk memungkinkan item grid menyusut */}
          <div className="min-w-0">
            <RecentTransactions
              incomes={incomes}
              expenses={expenses}
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
