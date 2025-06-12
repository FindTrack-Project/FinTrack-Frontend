import React, { useEffect, useState, useCallback } from "react";
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

import {
  PiggyBank,
  TrendingUp,
  Shield,
  Target,
  Clock,
  AlertCircle,
} from "lucide-react";

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
// Jika PIE_COLORS tidak digunakan di Home.jsx, baris ini bisa dihapus
// import { PIE_COLORS } from "./constants";

// Komponen Financial Tips (Tidak ada perubahan)
const FinancialTips = () => {
  const tips = [
    {
      icon: <PiggyBank className="w-6 h-6 text-blue-500" />,
      title: "50/30/20 Rule",
      description:
        "Alokasikan 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan/investasi.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "Investasi Rutin",
      description:
        "Mulai investasi dengan jumlah kecil secara konsisten untuk hasil jangka panjang.",
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: "Dana Darurat",
      description:
        "Siapkan dana darurat setara 3-6 bulan pengeluaran untuk antisipasi keadaan tak terduga.",
    },
    {
      icon: <Target className="w-6 h-6 text-red-500" />,
      title: "Target Keuangan",
      description:
        "Tetapkan target keuangan yang spesifik dan terukur untuk setiap periode.",
    },
    {
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      title: "Review Berkala",
      description:
        "Lakukan review keuangan bulanan untuk mengevaluasi dan menyesuaikan anggaran.",
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-orange-500" />,
      title: "Hindari Hutang",
      description:
        "Batasi penggunaan kartu kredit dan hindari hutang konsumtif.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Tips Keuangan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {tip.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [allIncomes, setAllIncomes] = useState([]); // Menyimpan semua data pendapatan
  const [allExpenses, setAllExpenses] = useState([]); // Menyimpan semua data pengeluaran
  const [accounts, setAccounts] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");
  const [selectedChartTimeRange, setSelectedChartTimeRange] = useState("6_months");

  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const isSidebarOpen = outletContext.isSidebarOpen ?? false;
  const toggleSidebar = outletContext.toggleSidebar ?? (() => {});

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setDashboardError(null);
    try {
      let token = null;
      let userId = null;

      if (typeof window !== "undefined") {
        token = localStorage.getItem("jwt_token");
        userId = localStorage.getItem("user_id");
      }

      if (!token || !userId) {
        setDashboardError(
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

      // Mengambil transaksi dari awal tahun untuk chart multi-bulan (misal: 12 bulan)
      const now = new Date();
      const currentYear = now.getFullYear();
      const startDateForCharts = new Date(currentYear, 0, 1).toISOString().split('T')[0];

      const [
        balanceResult,
        accountsResult,
        savingGoalsResult,
        allTransactionsResult,
        userResult,
      ] = await Promise.allSettled([
        Api.get(`/users/balance`),
        Api.get(`/accounts`),
        Api.get(`/saving-goals`),
        Api.get(`/transactions?startDate=${startDateForCharts}`),
        Api.get(`/users/${userId}`),
      ]);

      if (balanceResult.status === "fulfilled") {
        setTotalBalance(balanceResult.value.currentBalance || 0);
      } else {
        console.error("Error fetching balance:", balanceResult.reason);
      }

      if (accountsResult.status === "fulfilled") {
        setAccounts(accountsResult.value.accounts || []);
      } else {
        console.error("Error fetching accounts:", accountsResult.reason);
      }

      if (savingGoalsResult.status === "fulfilled") {
        setSavingGoals(savingGoalsResult.value.savingGoals || []);
      } else {
        console.error("Error fetching saving goals:", savingGoalsResult.reason);
      }

      let fetchedIncomes = [];
      let fetchedExpenses = [];
      if (allTransactionsResult.status === "fulfilled" && allTransactionsResult.value?.transactions) {
          const allTrx = allTransactionsResult.value.transactions;
          fetchedIncomes = allTrx.filter(t => t.type === 'Pemasukan');
          fetchedExpenses = allTrx.filter(t => t.type === 'Pengeluaran');
      } else {
          console.error("Error fetching all transactions for charts:", allTransactionsResult.reason);
      }
      setAllIncomes(fetchedIncomes);
      setAllExpenses(fetchedExpenses);

      if (userResult.status === "fulfilled" && (userResult.value?.user || userResult.value)) {
        const userData = userResult.value.user || userResult.value;
        setUserName(userData?.name || "Pengguna");
        setUserEmail(userData?.email || "email@example.com");
        localStorage.setItem("user_name", userData?.name || "Pengguna");
        localStorage.setItem("user_email", userData?.email || "email@example.com");
      } else {
        console.error("Error fetching user profile:", userResult.reason);
      }

    } catch (err) {
      console.error("Failed to fetch data in Home component:", err);
      let errorMessage = "Gagal memuat data dashboard.";
      if (err instanceof Error) {
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
          errorMessage.toLowerCase().includes("api error")
        ) {
          errorMessage =
            "Terjadi masalah server. Silakan coba beberapa saat lagi.";
        } else if (
          errorMessage.toLowerCase().includes("koneksi atau kebijakan keamanan")
        ) {
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau masalah CORS.";
        } else if (
          errorMessage.toLowerCase().includes("failed to parse response")
        ) {
          errorMessage =
            "Gagal memproses respons dari server. Mungkin masalah CORS/jaringan.";
        } else if (
          errorMessage.toLowerCase().includes("cannot read properties of undefined")
        ) {
          errorMessage =
            "Terjadi kesalahan data. Beberapa informasi mungkin tidak tersedia.";
        }
      }
      setDashboardError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- LOGIKA PERHITUNGAN DATA UNTUK BALANCE OVERVIEW DAN CHART ---
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0-indexed (Jan = 0)
  const currentYear = now.getFullYear();

  let totalIncomeCurrentMonth = 0;
  let totalExpenseCurrentMonth = 0;
  let totalIncomeLastMonth = 0;
  let totalExpenseLastMonth = 0;

  const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const yearForLastMonth = currentMonthIndex === 0 ? currentYear - 1 : currentYear;

  // Filter dan jumlahkan incomes untuk bulan ini dan bulan lalu dari SEMUA data pendapatan
  allIncomes.forEach(income => {
    const incomeDate = new Date(income.date);
    if (incomeDate.getMonth() === currentMonthIndex && incomeDate.getFullYear() === currentYear) {
      totalIncomeCurrentMonth += income.amount;
    } else if (incomeDate.getMonth() === lastMonthIndex && incomeDate.getFullYear() === yearForLastMonth) {
      totalIncomeLastMonth += income.amount;
    }
  });

  // Filter dan jumlahkan expenses untuk bulan ini dan bulan lalu dari SEMUA data pengeluaran
  allExpenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    if (expenseDate.getMonth() === currentMonthIndex && expenseDate.getFullYear() === currentYear) {
      totalExpenseCurrentMonth += expense.amount;
    } else if (expenseDate.getMonth() === lastMonthIndex && expenseDate.getFullYear() === yearForLastMonth) {
      totalExpenseLastMonth += expense.amount;
    }
  });

  // Hitung pertumbuhan Income (dalam desimal)
  const incomeGrowth =
    totalIncomeLastMonth === 0
      ? (totalIncomeCurrentMonth > 0 ? 1 : 0)
      : (totalIncomeCurrentMonth - totalIncomeLastMonth) / totalIncomeLastMonth;

  // Hitung pertumbuhan Expense (dalam desimal)
  const expenseGrowth =
    totalExpenseLastMonth === 0
      ? (totalExpenseCurrentMonth > 0 ? 1 : 0)
      : (totalExpenseCurrentMonth - totalExpenseLastMonth) / totalExpenseLastMonth;

  // Data untuk ExpensesChart (Donut Chart)
  // Ini akan menampilkan pengeluaran untuk bulan saat ini
  const expenseByCategory = allExpenses.reduce((acc, exp) => {
    const expenseDate = new Date(exp.date);
    if (expenseDate.getMonth() === currentMonthIndex && expenseDate.getFullYear() === currentYear) {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    }
    return acc;
  }, {});
  const totalAllExpenses = Object.values(expenseByCategory).reduce((sum, amount) => sum + amount, 0);

  // Data untuk BalanceOverview Chart (Area Chart)
  const { months, balanceOverTime } = getMonthlyData(allIncomes, allExpenses, totalBalance, selectedChartTimeRange);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 w-full animate-pulse">
        {/* Skeleton Header */}
        <header className="flex flex-row justify-between items-center mb-8 gap-4 animate-pulse">
          <div>
            <div className="h-8 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="hidden sm:flex flex-col gap-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </header>

        {/* Skeleton Atas: Balance & Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Skeleton BalanceOverview */}
          <div className="lg:col-span-3 bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-32 bg-gray-300 rounded-md"></div>
              <div className="h-8 w-32 bg-gray-300 rounded-md"></div>
            </div>
            <div className="mb-6">
              <div className="h-4 w-24 bg-gray-300 rounded-md mb-1"></div>
              <div className="h-8 w-48 bg-gray-400 rounded-md"></div>
            </div>
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
            <div className="h-48 sm:h-64 bg-gray-200 rounded-md flex-1"></div>
          </div>

          {/* Skeleton ExpensesChart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-32 bg-gray-300 rounded-md"></div>
              <div className="h-8 w-32 bg-gray-300 rounded-md"></div>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 min-h-0">
              <div className="h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-gray-200 mb-6"></div>
              <div className="w-full">
                <div className="flex flex-wrap justify-center gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center rounded-lg px-3 py-1.5 text-sm">
                      <span className="w-3 h-3 rounded-lg mr-2 flex-shrink-0 bg-gray-300"></span>
                      <span className="h-4 w-16 bg-gray-200 rounded"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Bawah: Pockets, Saving Goals, Recent Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Skeleton PocketsSection */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
            <div className="h-6 w-24 bg-gray-300 rounded-md mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center p-2 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
                  </div>
                  <div className="h-5 w-20 bg-gray-400 rounded-md ml-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton SavingGoalsSection */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
            <div className="h-6 w-28 bg-gray-300 rounded-md mb-6"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
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
              ))}
            </div>
          </div>

          {/* Skeleton RecentTransactions */}
          <div className="md:col-span-2 bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
            <div className="h-6 w-32 bg-gray-300 rounded-md mb-6"></div>
            <div className="flex flex-row flex-wrap gap-3 mb-6">
              <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-4">
              {[...Array(1)].map((_, dateIdx) => (
                <div key={dateIdx}>
                  <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-3 px-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, trxIdx) => (
                      <div key={trxIdx} className="flex items-center p-2 rounded-lg">
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
          </div>
        </div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        {dashboardError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{dashboardError}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setDashboardError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.196l-2.651 2.651a1.2 1.2 0 1 1-1.697-1.697L8.304 10l-2.651-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.304l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697L11.696 10l2.651 2.651a1.2 1.2 0 0 1 0 1.697z"/></svg>
            </span>
          </div>
        )}

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
              onTimeRangeChange={setSelectedChartTimeRange}
              selectedTimeRange={selectedChartTimeRange}
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
              incomes={allIncomes}
              expenses={allExpenses}
              accounts={accounts}
              formatCurrency={formatCurrency}
              getTransactionIcon={getTransactionIcon}
            />
          </div>
        </div>
          <FinancialTips />
      </div>
    </div>
  );
};

export default Home;