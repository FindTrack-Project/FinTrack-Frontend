import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  HandCoins,
  Settings,
  ArrowRightLeft,
  LogOut,
  CircleHelp,
  ChevronLast,
  CreditCard,
  ReceiptText,
  ChevronDown,
  ChevronRight,
  BanknoteArrowUp,
  BanknoteArrowDown,
} from "lucide-react";
// Memperbaiki jalur impor untuk logo.svg
// Asumsi: Sidebar.jsx berada di 'src/pages/components/Sidebar/'
// dan logo.svg berada di 'src/assets/'
import Logo from "../../../assets/logo.svg";

const Sidebar = ({ onToggleCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      if (onToggleCollapse) {
        onToggleCollapse(newState);
      }
      return newState;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
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
          onClick={toggleCollapse}
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

        {/* Service (Dropdown Example)
        <div className="relative">
          <button
            onClick={toggleService}
            className="flex items-center min-h-[48px] w-full p-2 rounded-lg text-white transition-colors duration-200 group cursor-pointer"
            aria-expanded={isServiceOpen}
            aria-controls="service-submenu"
          >
            <CreditCard size={20} className="mr-3 flex-shrink-0" />
            <span
              className={`font-medium whitespace-nowrap overflow-hidden ${
                isCollapsed ? "hidden" : ""
              }`}
            >
              Service
            </span>
            <span className={`ml-auto ${isCollapsed ? "hidden" : ""}`}>
              {isServiceOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          </button>
          {!isCollapsed && isServiceOpen && (
            <div
              id="service-submenu"
              className="pl-8 pt-1 pb-1 space-y-1 overflow-hidden"
            >
              <NavLink
                to="/service/credit"
                className={({ isActive }) =>
                  `flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 text-sm ${
                    isActive ? "bg-secondary" : "hover:bg-[var(--color-hov)]"
                  }`
                }
              >
                <BanknoteArrowUp size={16} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap overflow-hidden">
                  Income
                </span>
              </NavLink>

              <NavLink
                to="/service/bills"
                className={({ isActive }) =>
                  `flex items-center min-h-[48px] p-2 rounded-lg text-white transition-colors duration-200 text-sm relative ${
                    isActive ? "bg-secondary" : "hover:bg-[var(--color-hov)]"
                  }`
                }
              >
                <BanknoteArrowDown size={16} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap overflow-hidden">
                  Expense
                </span>
                <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap overflow-hidden">
                  2
                </span>
              </NavLink>
            </div>
          )}
        </div>
        */}

        {/* Pocket */}
        <NavLink
          to="/pocket"
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

        <button
          onClick={handleLogout}
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
    </div>
  );
};

export default Sidebar;
