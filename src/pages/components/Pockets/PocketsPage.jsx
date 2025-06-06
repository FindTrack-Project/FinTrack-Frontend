// src/pages/components/Pockets/PocketsPage.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig"; // Adjust path if necessary
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  DollarSign,
  CreditCard,
  Wallet,
  PlusCircle,
  Pen,
  Trash2,
} from "lucide-react"; // Icons for pockets, edit/delete

// Import utilities
import { formatCurrency, calculatePieData } from "../transaction/utils"; // Reusing utils

// Define colors for the Pie Chart - adjust to your design system
const PIE_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
];

// Helper to get Lucide icon component based on account type/name
const getAccountIconComponent = (account) => {
  if (account.type === "Bank") return CreditCard;
  if (
    account.type === "E-Wallet" ||
    account.name.toLowerCase().includes("gopay") ||
    account.name.toLowerCase().includes("dana")
  )
    return Wallet;
  if (account.type === "Cash") return DollarSign;
  // Fallback for specific names if type is generic or missing
  if (account.name.toLowerCase().includes("bca")) return CreditCard;
  if (account.name.toLowerCase().includes("bri")) return CreditCard;
  if (account.name.toLowerCase().includes("jago")) return CreditCard;
  if (account.name.toLowerCase().includes("shopeepay")) return Wallet;
  if (account.name.toLowerCase().includes("main account")) return Wallet; // Example for default account
  return Wallet; // Default generic icon
};

const PocketsPage = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");

  const navigate = useNavigate();

  // Function to refetch all data (useful after add/edit/delete pocket)
  const refetchAllPocketData = async () => {
    setLoading(true);
    setError(null);
    try {
      let token = null;
      let userId = null;

      if (typeof window !== "undefined") {
        token = localStorage.getItem("jwt_token");
        userId = localStorage.getItem("user_id");
        // Try to get cached user data from localStorage for faster display
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

      // Fetch all necessary data using Promise.allSettled
      const [balanceResult, accountsResult, userResult] =
        await Promise.allSettled([
          Api.get(`/users/balance`),
          Api.get(`/accounts`),
          Api.get(`/users/${userId}`),
        ]);

      // Process Balance data
      if (balanceResult.status === "fulfilled") {
        setTotalBalance(balanceResult.value.currentBalance || 0);
      } else {
        console.error("Error fetching total balance:", balanceResult.reason);
      }

      // Process Accounts data
      if (accountsResult.status === "fulfilled") {
        setAccounts(accountsResult.value.accounts || []);
      } else {
        console.error("Error fetching accounts:", accountsResult.reason);
      }

      // Process User data for header
      if (
        userResult.status === "fulfilled" &&
        userResult.value &&
        userResult.value.user
      ) {
        setUserName(userResult.value.user.name || "Pengguna");
        userResult.value.user?.email &&
          setUserEmail(userResult.value.user.email);
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
        console.error("Error fetching user profile:", userResult.reason);
        // Fallback to cached values or defaults if fetch failed
        if (typeof window !== "undefined") {
          setUserName(localStorage.getItem("user_name") || "Pengguna");
          setUserEmail(
            localStorage.getItem("user_email") || "email@example.com"
          );
        }
      }
    } catch (err) {
      // Catch for any critical errors in Promise.allSettled itself (rare)
      console.error("Failed to fetch data in PocketsPage:", err);
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
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchAllPocketData(); // Initial data fetch on component mount
  }, [navigate]); // navigate is a dependency

  // Prepare data for the Ringkasan (Pie Chart)
  // Use calculatePieData utility, mapping account.name to the chart legend
  const pieChartData = calculatePieData(accounts, "currentBalance", "name");

  // --- Skeleton Loaders (similar to TransactionPage) ---
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
    <div className="bg-white rounded-2xl shadow-sm p-6 col-span-1 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-4">
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

  // --- Render based on loading and error state ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
        <SkeletonHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonBalanceCard />
          <SkeletonChartCard />
        </div>
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
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Pockets</h1>
          <p className="text-gray-500 text-sm mt-1">
            Lorem ipsum dolor sit amet
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-white rounded-full shadow-sm text-gray-600 cursor-pointer">
            {/* Bell Icon - Placeholder SVG or Lucide */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          <div className="flex items-center space-x-3 bg-white p-2 rounded-full shadow-sm pr-4 cursor-pointer">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <span className="font-semibold text-sm">{userName}</span>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Total Balance & Pocket List */}
        <div className="col-span-1">
          {/* Total Balance Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Balance
              </h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
                <PlusCircle size={16} /> Tambah pocket baru
              </button>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-6">
              {formatCurrency(totalBalance)}
            </p>

            {/* Pocket List */}
            <div className="space-y-4">
              {accounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Tidak ada pocket ditemukan.
                  <button
                    onClick={() => {
                      /* Open add pocket modal */
                    }}
                    className="text-blue-500 ml-1"
                  >
                    Tambahkan satu?
                  </button>
                </div>
              ) : (
                accounts.map((account, index) => {
                  const IconComponent = getAccountIconComponent(account); // Get dynamic icon
                  const color = PIE_COLORS[index % PIE_COLORS.length]; // Assign color from PIE_COLORS

                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center">
                        <div
                          className="p-2 rounded-lg mr-3 flex-shrink-0"
                          style={{ backgroundColor: `${color}1A` }}
                        >
                          <IconComponent size={20} style={{ color: color }} />
                        </div>
                        <span className="font-medium text-gray-800">
                          {account.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(account.currentBalance)}
                        </span>
                        <button className="text-gray-500 hover:text-blue-600 p-1 rounded-full">
                          <Pen size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-red-600 p-1 rounded-full">
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
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Ringkasan
            </h2>
            {totalBalance === 0 && accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Tidak ada data ringkasan. Tambahkan pocket dan transaksi.
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      cornerRadius={5}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mt-4">
                  {pieChartData.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      ></span>
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PocketsPage;
