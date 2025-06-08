import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  DollarSign,
  CreditCard,
  Wallet,
  PlusCircle,
  Pen,
  Trash2,
} from "lucide-react";
import PocketModal from "./PocketModal";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define colors for the Pie Chart
const PIE_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
];

// Helper to get Lucide icon component
const getAccountIconComponent = (account) => {
  if (account.type === "Bank") return CreditCard;
  if (
    account.type === "E-Wallet" ||
    account.name.toLowerCase().includes("gopay") ||
    account.name.toLowerCase().includes("dana")
  )
    return Wallet;
  if (account.type === "Cash") return DollarSign;
  if (account.name.toLowerCase().includes("bca")) return CreditCard;
  if (account.name.toLowerCase().includes("bri")) return CreditCard;
  if (account.name.toLowerCase().includes("jago")) return CreditCard;
  if (account.name.toLowerCase().includes("shopeepay")) return Wallet;
  if (account.name.toLowerCase().includes("main account")) return Wallet;
  return Wallet;
};

// Utility: Format currency
const formatCurrency = (value) =>
  "Rp" +
  (value || 0).toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

// Configuration for Chart.js Pie chart
const pieOptions = (formatter) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // We use a custom legend
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#1F2937", // bg-gray-800
      titleColor: "#FFFFFF",
      bodyColor: "#FFFFFF",
      borderRadius: 8,
      padding: 12,
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ${formatter(value)}`;
        },
      },
    },
  },
  // PERUBAHAN DI SINI: Nilai lebih kecil = chart lebih tebal
  cutout: "45%",
});


const PocketsPage = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");
  const [isPocketModalOpen, setIsPocketModalOpen] = useState(false);
  const [editingPocket, setEditingPocket] = useState(null); // null = Add, object = Edit

  const navigate = useNavigate();

  const refetchAllPocketData = async () => {
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
          localStorage.clear();
        }
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const [balanceResult, accountsResult, userResult] =
        await Promise.allSettled([
          Api.get(`/users/balance`),
          Api.get(`/accounts`),
          Api.get(`/users/${userId}`),
        ]);

      if (balanceResult.status === "fulfilled") {
        setTotalBalance(balanceResult.value.currentBalance || 0);
      } else {
        console.error("Error fetching total balance:", balanceResult.reason);
      }

      if (accountsResult.status === "fulfilled") {
        setAccounts(accountsResult.value.accounts || []);
      } else {
        console.error("Error fetching accounts:", accountsResult.reason);
      }

      // Setelah Promise.allSettled atau Promise.all
      let userData = null;
      if (userResult.status === "fulfilled") {
        // Cek struktur respons
        userData = userResult.value?.user || userResult.value;
      }
      setUserName(userData?.name || "Pengguna");
      setUserEmail(userData?.email || "email@example.com");
      if (typeof window !== "undefined") {
        localStorage.setItem("user_name", userData?.name || "Pengguna");
        localStorage.setItem("user_email", userData?.email || "email@example.com");
      }
      if (!userData) {
        setUserName(localStorage.getItem("user_name") || "Pengguna");
        setUserEmail(localStorage.getItem("user_email") || "email@example.com");
      }
    } catch (err) {
      console.error("Failed to fetch data in PocketsPage:", err);
      let errorMessage = "Gagal memuat data.";
      if (err.message?.includes("401")) {
        errorMessage =
          "Sesi Anda tidak valid atau kedaluwarsa. Silakan login kembali.";
        if (typeof window !== "undefined") {
          localStorage.clear();
        }
        setTimeout(() => navigate("/login"), 1500);
      } else if (err.message?.toLowerCase().includes("failed to fetch")) {
        errorMessage =
          "Terjadi masalah server atau koneksi. Silakan coba lagi nanti.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchAllPocketData();
  }, [navigate]);

  // Prepare data for the Chart.js Pie Chart
  const pieChartData = {
    labels: accounts.map((account) => account.name),
    datasets: [
      {
        data: accounts.map((account) => account.currentBalance || 0),
        backgroundColor: PIE_COLORS,
        borderColor: "#ffffff",
        borderWidth: 8,
        borderRadius: 8,
        hoverOffset: 8,
        spacing: 2,
      },
    ],
  };
  
  // Handler untuk menghapus pocket
  const handleDeletePocket = async (pocketId) => {
    if (window.confirm("Anda yakin ingin menghapus pocket ini?")) {
      try {
        await Api.delete(`/accounts/${pocketId}`);
        await refetchAllPocketData();
      } catch (err) {
        console.error("Gagal menghapus pocket:", err);
        alert("Gagal menghapus pocket.");
      }
    }
  };

  const handlePocketSaved = async () => {
    await refetchAllPocketData();
  };

  const handleOpenAddModal = () => {
    setEditingPocket(null);
    setIsPocketModalOpen(true);
  };

  const handleOpenEditModal = (pocket) => {
    setEditingPocket(pocket);
    setIsPocketModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPocketModalOpen(false);
    // Tidak perlu setEditingPocket(null) di sini, karena useEffect di modal akan menanganinya
  };

  
  // --- Skeleton Loaders ---
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

  const SkeletonBalanceCard = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonChartCard = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="flex flex-col items-center">
        <div className="h-60 w-60 bg-gray-200 rounded-full mb-6"></div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-xs">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full mr-2 bg-gray-300"></span>
              <span className="h-4 w-20 bg-gray-300 rounded"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
        <SkeletonHeader />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 min-w-0">
            <SkeletonBalanceCard />
          </div>
          <div className="lg:col-span-2 min-w-0">
            <SkeletonChartCard />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-4">
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
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Pockets</h1>
        <p className="text-gray-500 text-sm mt-1">View, manage, and track all your financial accounts here, {userName}!</p>
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="p-2 bg-white rounded-full shadow-sm text-gray-600 cursor-pointer hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        {/* Profile */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full pr-3 pl-1 py-1 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-right">
            <p className="font-semibold text-gray-800 text-sm">{userName}</p>
            <p className="text-gray-500 text-xs">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Balance
              </h2>
              <button
                onClick={() => setIsPocketModalOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle size={16} /> Tambah Pocket
              </button>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-6">
              {formatCurrency(totalBalance)}
            </p>

            <div className="space-y-4">
              {accounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Belum ada pocket.
                  <button
                    onClick={() => setIsPocketModalOpen(true)}
                    className="text-blue-500 ml-1 font-semibold cursor-pointer"
                  >
                    Buat baru?
                  </button>
                </div>
              ) : (
                accounts.map((account, index) => {
                  const IconComponent = getAccountIconComponent(account);
                  const color = PIE_COLORS[index % PIE_COLORS.length];

                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center min-w-0">
                        <div
                          className="p-2 rounded-lg mr-3 flex-shrink-0"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <IconComponent size={20} style={{ color }} />
                        </div>
                        <span className="font-medium text-gray-800 truncate">
                          {account.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(account.currentBalance)}
                        </span>
                        <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled>
                          <Pen size={16} />
                        </button>
                        <button onClick={() => handleDeletePocket(account.id)} className="px-4 py-2 text-sm font-medium border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ringkasan (Summary Pie Chart) */}
        <div className="lg:col-span-2 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Ringkasan
            </h2>
            {totalBalance === 0 && accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Tidak ada data untuk ditampilkan.
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-60 w-60 relative mb-6">
                   <Pie data={pieChartData} options={pieOptions(formatCurrency)} />
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-xs">
                  {accounts
                    .sort((a, b) => b.currentBalance - a.currentBalance)
                    .map((account, idx) => (
                      <div key={account.id} className="flex items-center">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                          }}
                        ></span>
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {account.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {totalBalance > 0
                            ? ((account.currentBalance / totalBalance) * 100).toFixed(1) + "%"
                            : "0%"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PocketModal
        isOpen={isPocketModalOpen}
        onClose={() => setIsPocketModalOpen(false)}
        onPocketSaved={handlePocketSaved}
      />
    </div>
  );
};

export default PocketsPage;