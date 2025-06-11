import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig"; // Pastikan path ini benar
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  DollarSign,
  CreditCard,
  Wallet,
  PlusCircle,
  Pen,
  Trash2,
  Bell,
} from "lucide-react";
import PocketModal from "./PocketModal"; // Pastikan path ini benar

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// --- KONSTANTA & FUNGSI BANTU ---

const PIE_COLORS = [ "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4" ];

const getAccountIconComponent = (account) => {
  const nameLower = account.name.toLowerCase();
  if (account.type === "Bank") return CreditCard;
  if (account.type === "E-Wallet" || nameLower.includes("gopay") || nameLower.includes("dana")) return Wallet;
  if (account.type === "Cash") return DollarSign;
  if (nameLower.includes("bca") || nameLower.includes("bri") || nameLower.includes("jago")) return CreditCard;
  if (nameLower.includes("shopeepay") || nameLower.includes("main account")) return Wallet;
  return Wallet;
};

const formatCurrency = (value) =>
  "Rp" + (value || 0).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const pieOptions = (formatter) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true, backgroundColor: "#1F2937", titleColor: "#FFFFFF", bodyColor: "#FFFFFF",
      borderRadius: 8, padding: 12,
      callbacks: {
        label: (context) => `${context.label || ""}: ${formatter(context.parsed || 0)}`,
      },
    },
  },
  cutout: "50%",
});

// --- KOMPONEN HEADER (KONTEN ASLI) ---
const PocketsPageHeader = ({ userName, userEmail }) => (
    <header className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold">Pockets</h1>
        </div>
        <div className="flex items-center gap-3">
            <button className="relative bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:shadow-md transition-all duration-200">
                <Bell size={20} className="text-gray-600" />
            </button>
            <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 rounded-full pr-3 pl-1 py-1 shadow-sm">
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
            <div className="sm:hidden">
                <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                />
            </div>
        </div>
    </header>
);

// --- KOMPONEN SKELETON RESPONSIVE ---

const DesktopSkeleton = () => (
  <>
    {/* Skeleton Header */}
    <header className="flex flex-row justify-between items-center mb-8 gap-4 animate-pulse">
      <div>
        <div className="h-8 bg-gray-200 rounded w-40 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="flex flex-col gap-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </header>

    {/* Skeleton Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left: Pocket List */}
      <div className="lg:col-span-3 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col h-[32rem]">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-9 w-36 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-10 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 gap-2">
                <div className="flex items-center min-w-0 mb-2 sm:mb-0">
                  <div className="p-2 rounded-lg mr-3 flex-shrink-0 bg-gray-200 w-10 h-10"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right: Pie Chart & Legend */}
      <div className="lg:col-span-2 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col h-[32rem]">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="flex flex-col items-center flex-1 min-h-0">
            <div className="h-60 w-60 bg-gray-200 rounded-full mb-6"></div>
            <div className="flex-1 min-h-0 w-full max-w-xs">
              <div className="h-full flex-grow overflow-y-auto -mr-3 pr-3">
                <div className="flex flex-wrap justify-center gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 text-sm mb-2">
                      <span className="w-3 h-3 rounded-full mr-2 bg-gray-300"></span>
                      <span className="h-4 w-16 bg-gray-200 rounded"></span>
                      <span className="h-3 w-10 bg-gray-100 rounded ml-2"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const MobileSkeleton = () => (
  <div className="animate-pulse">
    {/* Skeleton Header */}
    <header className="flex flex-row justify-between items-center mb-6 gap-4">
      <div>
        <div className="h-7 bg-gray-200 rounded w-32 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="hidden sm:flex flex-col gap-1">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </header>

    {/* Skeleton Total Balance Card */}
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 gap-2">
            <div className="flex items-center min-w-0 mb-2 sm:mb-0">
              <div className="p-2 rounded-lg mr-3 flex-shrink-0 bg-gray-200 w-9 h-9"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Skeleton Ringkasan Card */}
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
      <div className="flex flex-col items-center">
        <div className="h-40 w-40 bg-gray-200 rounded-full mb-4"></div>
        <div className="w-full max-w-xs">
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center border border-gray-200 rounded-lg px-2 py-1 text-xs mb-2">
                <span className="w-3 h-3 rounded-full mr-2 bg-gray-300"></span>
                <span className="h-4 w-14 bg-gray-200 rounded"></span>
                <span className="h-3 w-8 bg-gray-100 rounded ml-2"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- KOMPONEN UTAMA ---

const PocketsPage = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");
  const [isPocketModalOpen, setIsPocketModalOpen] = useState(false);
  const [editingPocket, setEditingPocket] = useState(null);
  const navigate = useNavigate();

  const refetchAllPocketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwt_token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        setError("Sesi Anda tidak valid. Silakan login kembali.");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const [balanceResult, accountsResult, userResult] = await Promise.allSettled([
        Api.get(`/users/balance`),
        Api.get(`/accounts`),
        Api.get(`/users/${userId}`),
      ]);

      if (balanceResult.status === "fulfilled") {
        setTotalBalance(balanceResult.value.currentBalance || 0);
      }
      if (accountsResult.status === "fulfilled") {
        setAccounts(accountsResult.value.accounts || []);
      }
      if (userResult.status === "fulfilled") {
        const userData = userResult.value?.user || userResult.value;
        setUserName(userData?.name || "Pengguna");
        setUserEmail(userData?.email || "email@example.com");
        localStorage.setItem("user_name", userData?.name || "Pengguna");
        localStorage.setItem("user_email", userData?.email || "email@example.com");
      }
    } catch (err) {
      console.error("Failed to fetch data in PocketsPage:", err);
      setError("Gagal memuat data. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchAllPocketData();
  }, []);

  const pieChartData = {
    labels: accounts.map((account) => account.name),
    datasets: [{
        data: accounts.map((account) => account.currentBalance || 0),
        backgroundColor: PIE_COLORS,
        borderColor: "#ffffff", borderWidth: 8, borderRadius: 8, hoverOffset: 8, spacing: 2,
    }],
  };

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

  const handlePocketSaved = async (dataToSave) => {
    try {
      if (editingPocket) {
        await Api.put(`/accounts/${editingPocket.id}`, dataToSave);
      } else {
        await Api.post("/accounts", dataToSave);
      }
      await refetchAllPocketData();
    } catch (err) {
      console.error("Gagal menyimpan pocket:", err);
      alert("Gagal menyimpan pocket.");
    }
  };

  const handleOpenAddModal = () => { setEditingPocket(null); setIsPocketModalOpen(true); };
  const handleOpenEditModal = (pocket) => { setEditingPocket(pocket); setIsPocketModalOpen(true); };
  const handleCloseModal = () => { setIsPocketModalOpen(false); };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-800">
        <div className="hidden lg:block"> <DesktopSkeleton /> </div>
        <div className="block lg:hidden"> <MobileSkeleton /> </div>
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
      {/* PERBAIKAN: Memanggil komponen header yang benar */}
      <PocketsPageHeader userName={userName} userEmail={userEmail} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col" style={{ height: '32rem' }}>
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">Total Balance</h2>
                      <button onClick={handleOpenAddModal} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1">
                          <PlusCircle size={16} /> Tambah Pocket
                      </button>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-6">{formatCurrency(totalBalance)}</p>
                  <div className="flex-1 min-h-0">
                      <div className="space-y-4 h-full overflow-y-auto pr-1 custom-scrollbar">
                          {accounts.length === 0 ? (
                              <div className="text-center py-8 text-gray-500 text-sm">
                                  Belum ada pocket.
                                  <button onClick={handleOpenAddModal} className="text-blue-500 ml-1 font-semibold">Buat baru?</button>
                              </div>
                          ) : (
                              accounts.map((account, index) => {
                                  const IconComponent = getAccountIconComponent(account);
                                  const color = PIE_COLORS[index % PIE_COLORS.length];
                                  return (
                                      <div key={account.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 gap-2">
                                          <div className="flex items-center min-w-0 mb-2 sm:mb-0">
                                              <div className="p-2 rounded-lg mr-3 flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                                                  <IconComponent size={20} style={{ color }} />
                                              </div>
                                              <span className="font-medium text-gray-800 truncate text-base sm:text-lg">{account.name}</span>
                                          </div>
                                          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                                              <span className="font-semibold text-gray-900 text-base sm:text-lg">{formatCurrency(account.currentBalance)}</span>
                                              <button onClick={() => handleOpenEditModal(account)} className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                                                  <Pen size={16} />
                                              </button>
                                              <button onClick={() => handleDeletePocket(account.id)} className="px-3 py-2 text-sm font-medium border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
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
          </div>
          <div className="lg:col-span-2 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col" style={{ height: '32rem' }}>
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Ringkasan</h2>
                  {totalBalance === 0 && accounts.length === 0 ? (
                      <div className="text-center flex-1 flex items-center justify-center text-gray-500 text-sm">
                          Tidak ada data untuk ditampilkan.
                      </div>
                  ) : (
                      <div className="flex flex-col items-center flex-1 min-h-0">
                          <div className="h-60 w-60 relative mb-6 flex-shrink-0">
                              <Pie data={pieChartData} options={pieOptions(formatCurrency)} />
                          </div>
                          <div className="flex-1 min-h-0 w-full max-w-xs">
                              <div className="h-full flex-grow overflow-y-auto -mr-3 pr-3 custom-scrollbar">
                                  <div className="flex flex-wrap justify-center gap-3">
                                      {accounts
                                          .sort((a, b) => b.currentBalance - a.currentBalance)
                                          .map((account, idx) => (
                                              <div key={account.id} className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                                                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                                                  <span className="text-gray-700">{account.name}</span>
                                                  <span className="text-xs text-gray-500 ml-2">
                                                      {totalBalance > 0 ? ((account.currentBalance / totalBalance) * 100).toFixed(1) + "%" : "0%"}
                                                  </span>
                                              </div>
                                          ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>
      <PocketModal
          isOpen={isPocketModalOpen}
          onClose={handleCloseModal}
          onPocketSaved={handlePocketSaved}
          existingPocket={editingPocket}
      />
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }`}</style>
    </div>
  );
};

export default PocketsPage;