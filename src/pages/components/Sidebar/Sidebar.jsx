import React, { useState } from "react";
import ReactDOM from "react-dom"; // --- 1. IMPORT ReactDOM ---
import { NavLink, useNavigate } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  HandCoins,
  Settings,
  ArrowRightLeft,
  LogOut,
  BrainCircuit,
  ChevronFirst,
  X
} from "lucide-react";
import Logo from "../../../assets/logo.svg";

// Data menu untuk dirender secara dinamis
const navItems = [
  { to: "/dashboard", icon: <LayoutDashboard size={20} />, text: "Dashboard" },
  { to: "/transactions", icon: <ArrowRightLeft size={20} />, text: "Transaction" },
  { to: "/pockets", icon: <Wallet size={20} />, text: "Pocket" },
  { to: "/savings", icon: <HandCoins size={20} />, text: "Savings" },
  { to: "/recomendation", icon: <BrainCircuit size={20} />, text: "Recomendation" },
];

const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, toggleMobileSidebar }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  const LogoutModal = () => (
    // --- 2. BUNGKUS MODAL DENGAN PORTAL ---
    ReactDOM.createPortal(
      <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[70]">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Konfirmasi Logout</h2>
          <p className="text-gray-700 mb-6">Apakah Anda yakin ingin keluar dari akun?</p>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer hover:bg-gray-300">Batal</button>
            <button onClick={confirmLogout} className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700">Logout</button>
          </div>
        </div>
      </div>,
      document.getElementById('modal-root') // --- 3. Tentukan tujuan portal ---
    )
  );


  return (
    <>
      {/* Overlay untuk tampilan mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileSidebar}
        aria-hidden="true"
      />

      {/* --- KONTENER SIDEBAR UTAMA --- */}
      <aside
        className={`
          fixed md:fixed md:top-0 md:left-0
          flex flex-col bg-primary shadow-lg z-50
          transition-all duration-300 ease-in-out
          h-screen
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          md:translate-x-0
          ${isCollapsed ? "md:w-20" : "md:w-64"}
        `}
        style={{ willChange: "transform, width" }}
      >
        {/* Header Sidebar (Logo dan Tombol Toggle) */}
        <div className="flex items-center justify-between p-4 border-b border-secondary min-h-[64px] relative">
          <div className={`flex items-center overflow-hidden ${isCollapsed ? 'md:justify-center md:w-full' : ''}`}>
            <img src={Logo} alt="Fintrack Logo" className="w-10 h-10 object-contain flex-shrink-0" />
            <span
              className={`
                text-lg font-semibold text-white whitespace-nowrap
                transition-all duration-300
                ${isCollapsed ? "md:max-w-0 md:opacity-0 md:ml-0" : "md:max-w-xs md:opacity-100 ml-3"}
                overflow-hidden
              `}
              style={{ transitionProperty: "max-width, opacity, margin-left" }}
            >
              Fin<span className="text-accent">track</span>
            </span>
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-full bg-white text-primary hidden md:block absolute top-1/2 -translate-y-1/2 -right-3 border border-secondary shadow-md cursor-pointer"
          >
            <ChevronFirst size={18} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
          
          <button onClick={toggleMobileSidebar} className="md:hidden text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigasi Utama */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <SidebarLink
              key={item.text}
              isCollapsed={isCollapsed}
              onClick={isMobileOpen ? toggleMobileSidebar : undefined}
              {...item}
            />
          ))}
        </nav>

        {/* Footer Sidebar (Settings & Logout) */}
        <div className="p-2 border-t border-secondary">
          <SidebarLink
            to="/settings"
            icon={<Settings size={20} />}
            text="Settings"
            isCollapsed={isCollapsed}
            onClick={isMobileOpen ? toggleMobileSidebar : undefined}
          />
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center w-full p-3 mt-1 rounded-lg text-white transition-colors duration-300 group hover:bg-secondary/60 cursor-pointer ${isCollapsed ? 'md:justify-center' : ''}`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span
              className={`
                ml-3 font-medium whitespace-nowrap
                transition-all duration-300
                ${isCollapsed ? "md:max-w-0 md:opacity-0 md:ml-0" : "md:max-w-xs md:opacity-100 md:ml-3"}
                overflow-hidden
              `}
              style={{ transitionProperty: "max-width, opacity, margin-left" }}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* --- 4. PANGGIL MODAL DI SINI --- */}
      {/* JSX ini tidak dirender di sini, tapi di 'modal-root' berkat Portal */}
      {showLogoutModal && <LogoutModal />}
    </>
  );
};

// --- KOMPONEN SIDEBARLINK ---
const SidebarLink = ({ to, icon, text, isCollapsed, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center w-full p-3 rounded-lg text-white transition-colors duration-300 group
         ${isActive ? "bg-secondary" : "hover:bg-secondary/60"}
         ${isCollapsed ? "md:justify-center" : ""}`
      }
    >
      {icon}
      <span
        className={`
          ml-3 font-medium whitespace-nowrap
          transition-all duration-300
          ${isCollapsed ? "md:max-w-0 md:opacity-0 md:ml-0" : "md:max-w-xs md:opacity-100 md:ml-3"}
          overflow-hidden
        `}
        style={{ transitionProperty: "max-width, opacity, margin-left" }}
      >
        {text}
      </span>
    </NavLink>
  );
};

export default Sidebar;