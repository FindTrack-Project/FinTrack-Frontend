import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig"; // Sesuaikan path
import {
  DollarSign, Laptop, Plane, HomeIcon, GraduationCap, Car, Book, TrendingUp, PlusCircle, Trash2, Pen
} from "lucide-react";
import SavingGoalModal from "./SavingGoalModal";
import AllocateFundModal from "./AllocateFundModal";

// Palet Warna untuk Ikon & Progress Bar
const GOAL_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#EF4444", // Red
  "#F59E0B", // Yellow
  "#06B6D4", // Cyan
];

// Fungsi helper untuk memilih ikon
const getGoalIcon = (goalName) => {
  const nameLower = goalName.toLowerCase();
  if (nameLower.includes("laptop")) return Laptop;
  if (nameLower.includes("liburan") || nameLower.includes("travel") || nameLower.includes("haji")) return Plane;
  if (nameLower.includes("sekolah") || nameLower.includes("pendidikan")) return GraduationCap;
  if (nameLower.includes("rumah")) return HomeIcon;
  if (nameLower.includes("mobil")) return Car;
  if (nameLower.includes("investasi")) return TrendingUp;
  if (nameLower.includes("buku")) return Book;
  return DollarSign; // Default
};

// Utility untuk format mata uang
export const formatCurrency = (value) =>
  "Rp" + (value || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const SavingsPage = () => {
  const [savingGoals, setSavingGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const navigate = useNavigate();

  // Fungsi fetch data lengkap
  const refetchAllSavingsData = async () => {
    setLoading(true);
    setError(null);
    try {
      let token = localStorage.getItem("jwt_token");
      let userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        setError("Sesi Anda tidak valid. Silakan login kembali.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // Ambil data user dari cache dulu
      const cachedUserName = localStorage.getItem("user_name");
      const cachedUserEmail = localStorage.getItem("user_email");
      if (cachedUserName) setUserName(cachedUserName);
      if (cachedUserEmail) setUserEmail(cachedUserEmail);
      
      const [goalsResult, accountsResult, userResult] = await Promise.allSettled([
        Api.get(`/saving-goals`),
        Api.get(`/accounts`),
        Api.get(`/users/${userId}`),
      ]);

      if (goalsResult.status === "fulfilled") {
        setSavingGoals(goalsResult.value.savingGoals || []);
      }
      if (accountsResult.status === "fulfilled") {
        setAccounts(accountsResult.value.accounts || []);
      }
      if (userResult.status === "fulfilled" && userResult.value?.user) {
        const { name, email } = userResult.value.user;
        setUserName(name || "Pengguna");
        setUserEmail(email || "email@example.com");
        localStorage.setItem("user_name", name || "Pengguna");
        localStorage.setItem("user_email", email || "email@example.com");
      }
    } catch (err) {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchAllSavingsData();
  }, []);

  // Handlers tidak ada perubahan
  const handleSaveGoal = async (goalData) => {
    try {
      await Api.post("/saving-goals", goalData);
      await refetchAllSavingsData();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Gagal menyimpan.");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tujuan tabungan ini?")) {
      try {
        await Api.delete(`/saving-goals/${goalId}`);
        await refetchAllSavingsData();
      } catch (err) {
        alert("Gagal menghapus tujuan.");
      }
    }
  };
  
  const handleOpenAllocateModal = (goal) => {
    setSelectedGoal(goal);
    setIsAllocateModalOpen(true);
  };

  const handleAllocateFund = async ({ amount, accountId }) => {
    if (!selectedGoal) return;
    try {
      await Api.post(`/saving-goals/${selectedGoal.id}/allocate`, { amount, accountId });
      await refetchAllSavingsData();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Alokasi dana gagal.");
    }
  };

  // Kalkulasi Total Savings dari semua goals
  const totalSavings = savingGoals.reduce((sum, goal) => sum + goal.currentSavedAmount, 0);

  // Skeleton Header
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

  // Skeleton Card for Total Savings and Goals List
  const SkeletonSavingsCard = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg mt-4 sm:mt-0"></div>
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-grow space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="flex items-center gap-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-center">
              <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
        <SkeletonHeader />
        <div className="max-w mx-auto">
          <SkeletonSavingsCard />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      {/* --- HEADER HALAMAN DIKEMBALIKAN --- */}
      <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Saving Goals</h1>
        <p className="text-gray-500 text-sm mt-1">Here is your saving goals, {userName}</p>
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

      {/* KARTU UTAMA SESUAI DESAIN BARU */}
      <div className="bg-white max-w mx-auto rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Header Kartu */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Total Savings</h2>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">{formatCurrency(totalSavings)}</p>
          </div>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-secondary transition-colors flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={16} /> Tambah savings baru
          </button>
        </div>

        {/* Daftar Savings */}
        <div className="space-y-6">
          {savingGoals.map((goal, index) => {
            const progress = goal.targetAmount > 0 ? (goal.currentSavedAmount / goal.targetAmount) * 100 : 0;
            const IconComponent = getGoalIcon(goal.name);
            const color = GOAL_COLORS[index % GOAL_COLORS.length];

            return (
              <div key={goal.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <IconComponent size={24} style={{ color }} />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color }}></div>
                    </div>
                    <span className="font-semibold text-sm w-12 text-right" style={{ color }}>{progress.toFixed(0)}%</span>
                  </div>
                   <p className="text-xs text-gray-500 mt-1">{formatCurrency(goal.currentSavedAmount)} / {formatCurrency(goal.targetAmount)}</p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-center">
                  <button 
                     onClick={() => handleOpenAllocateModal(goal)}
                     disabled={goal.isCompleted}
                     className="px-4 py-2 text-sm font-medium border border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Alokasi
                  </button>
                  <button 
                     className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                     disabled 
                     title="Fungsi edit belum tersedia"
                  >
                    <Pen size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="px-4 py-2 text-sm font-medium border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors cursor-pointer"
                  > 
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {savingGoals.length === 0 && (
             <div className="text-center py-16 text-gray-500 border-2 border-dashed rounded-lg">
                <p>Belum ada tujuan tabungan.</p>
             </div>
          )}
        </div>
      </div>

      {/* Modals (tidak berubah) */}
      <SavingGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
      />
      <AllocateFundModal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        onAllocate={handleAllocateFund}
        goal={selectedGoal}
        accounts={accounts}
      />
    </div>
  );
};

export default SavingsPage;