import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  HandCoins,
  Settings,
  ArrowRightLeft,
  CircleHelp,
  ChevronLast,
  CreditCard,
  ReceiptText,
  ChevronDown,
  ChevronRight,
  BanknoteArrowUp,
  BanknoteArrowDown,
} from "lucide-react";
import Logo from "../../../assets/logo.svg"; // Pastikan path ini benar

const Sidebar = ({ onToggleCollapse }) => {
  // Menerima prop onToggleCollapse
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      if (onToggleCollapse) {
        onToggleCollapse(newState); // Panggil fungsi dari parent (App.jsx)
      }
      return newState;
    });
  };

  const toggleService = () => {
    setIsServiceOpen(!isServiceOpen);
  };

  return (
    <div
      className={`
        flex flex-col h-screen bg-primary shadow-lg
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
        fixed top-0 left-0 z-40
      `}
    >
      {/* Icon Logo < */}
      <div className="flex items-center justify-between p-4 border-b border-secondary">
        <div className="flex items-center space-x-2 overflow-hidden">
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
            p-1 rounded-full text-white hover:bg-secondary transition-colors duration-200
            ${isCollapsed ? "rotate-180" : ""}
            flex-shrink-0
          `}
          aria-label={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
        >
          <ChevronLast size={20} />
        </button>
      </div>
      {/* Icon Logo > */}

      
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {/* Home < */}
        <Link
          to="/"
          className="flex items-center p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 group"
        >
          <LayoutDashboard size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Dashboard
          </span>
        </Link>
        {/* Home > */}

        
        <Link
          to="/"
          className="flex items-center p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 group"
        >
          <ArrowRightLeft size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Transactions
          </span>
        </Link>
        
{/*  
        <div className="relative">
          <button
            onClick={toggleService}
            className="flex items-center w-full p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 group"
            aria-expanded={isServiceOpen}
            aria-controls="service-submenu"
          >
            <ArrowRightLeft size={20} className="mr-3 flex-shrink-0" />
            <span
              className={`font-medium whitespace-nowrap overflow-hidden ${
                isCollapsed ? "hidden" : ""
              }`}
            >
              Transactions
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
              <Link
                to="/service/credit"
                className="flex items-center p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 text-sm"
              >
                <BanknoteArrowUp size={16} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap overflow-hidden">
                  Income
                </span>
              </Link>
              
              <Link
                to="/service/bills"
                className="flex items-center p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 text-sm relative"
              >
                <BanknoteArrowDown size={16} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap overflow-hidden">
                  Expense
                </span>
                <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap overflow-hidden">
                  2
                </span>
              </Link>
            </div>
          )}
        </div>
        */}
        <Link
          to="/history"
          className="flex items-center p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 group relative"
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
        </Link>

        <Link
          to="/saved"
          className="flex items-center p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 group"
        >
          <HandCoins size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Savings
          </span>
        </Link>

      </nav>
      <div className="p-4">
        <Link
          to="/settings"
          className="flex items-center p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 group"
        >
          <Settings size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Settings
          </span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center p-2 rounded-lg text-white hover:bg-secondary hover:text-white transition-colors duration-200 group"
        >
          <CircleHelp size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Help & Support
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
