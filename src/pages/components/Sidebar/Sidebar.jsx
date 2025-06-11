import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  HandCoins,
  Settings,
  ArrowRightLeft,
  LogOut,
  BrainCircuit,
  CircleHelp,
  ChevronLast,
  CreditCard,
  ReceiptText,
  ChevronDown,
  ChevronRight,
  BanknoteArrowUp,
  BanknoteArrowDown,
} from "lucide-react";

import Logo from "../../../assets/logo.svg";

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk menampilkan modal
  const handleShowLogoutModal = () => {
    setShowLogoutModal(true);
  };

  // Fungsi untuk menyembunyikan modal
  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("jwt_token"); // Ganti "userToken" dengan "jwt_token"
    localStorage.removeItem("user_id"); // Jika kamu ingin menghapus user_id juga
    localStorage.removeItem("user_name"); // Jika kamu ingin menghapus user_name juga

    navigate("/login"); // Redirect ke halaman login
    setShowLogoutModal(false); // Tutup modal setelah logout
  };

  return (
    <div
      className={`
        flex flex-col h-screen bg-primary shadow-lg
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-17" : "w-64"}
        fixed top-0 left-0 z-40
      `}
    >
      {/* Icon Logo < */}
      <div className="flex items-center min-h-[48px] justify-between p-4 border-b border-secondary relative">
        <div className="flex items-center min-h-[48px] space-x-2 overflow-hidden">
          <img
            src={Logo}
            alt="Fintrack Logo"
            className="w-16 h-16 object-contain"
          />
          <span
            className={`text-lg font-bold text-white whitespace-nowrap ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Fin<span className="text-lg font-bold text-accent">track</span>
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          className={`
            p-1 rounded-full bg-white text-primary
            absolute -right-3 top-1/2 -translate-y-1/2
            border border-secondary cursor-pointer
            transition-all duration-200 hover:bg-gray-100
            ${isCollapsed ? "rotate-180" : ""}
          `}
          aria-label={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
        >
          <ChevronLast size={18} />
        </button>
      </div>
      {/* Icon Logo > */}

      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 group ${
              isActive ? "bg-secondary" : "hover:bg-[var(--color-hov)]"
            }`
          }
        >
          <LayoutDashboard size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Dashboard
          </span>
        </NavLink>

        {/* Transactions - Disesuaikan ke "/transactions" */}
        <NavLink
          to="/transactions" // Perubahan di sini: dari "/transaction" menjadi "/transactions"
          className={({ isActive }) =>
            `flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 group ${
              isActive ? "bg-secondary" : "hover:bg-[var(--color-hov)]"
            }`
          }
        >
          <ArrowRightLeft size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Transaction
          </span>
        </NavLink>

        {/* Pocket */}
        <NavLink
          to="/pockets"
          className={({ isActive }) =>
            `flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 group relative ${
              isActive ? "bg-secondary" : "hover:bg-[var(--color-hov)]"
            }`
          }
        >
          <Wallet size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Pocket
          </span>
          <span
            className={`ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            New 6
          </span>
        </NavLink>

        {/* Savings */}
        <NavLink
          to="/savings"
          className={({ isActive }) =>
            `flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 group ${
              isActive ? "bg-secondary" : "hover:bg-[var(--color-hov)]"
            }`
          }
        >
          <HandCoins size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Savings
          </span>
        </NavLink>

        {/* Recomendation */}
        <NavLink
          to="/recomendation"
          className={({ isActive }) =>
            `flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 group ${
              isActive ? "bg-secondary" : "hover:bg-[var(--color-hov)]"
            }`
          }
        >
          <BrainCircuit size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Recomendation
          </span>
        </NavLink>
      </nav>

      <div className="p-4">
        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 group ${
              isActive ? "bg-secondary" : "hover:bg-[var(--color-hov)]"
            }`
          }
        >
          <Settings size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Settings
          </span>
        </NavLink>

        {/* Tombol Logout - Membuka Modal */}
        <button
          onClick={handleShowLogoutModal} // Mengubah ini untuk membuka modal
          className="flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 group cursor-pointer hover:bg-[var(--color-hov)] w-full"
        >
          <LogOut size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Logout
          </span>
        </button>
      </div>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Konfirmasi Logout
            </h2>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin keluar dari akun?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseLogoutModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
