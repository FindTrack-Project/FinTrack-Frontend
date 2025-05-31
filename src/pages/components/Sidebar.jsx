import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Wallet,
  History,
  Settings,
  CreditCard,
  ArrowRightLeft,
  LandPlot,
  ReceiptText,
  Bookmark,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import iconLogo from "../../assets/icon-logo.png"; // Pastikan path ini benar

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
        flex flex-col h-screen bg-white shadow-lg
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
        rounded-r-xl
        fixed top-0 left-0 z-40
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 overflow-hidden">
          <img
            src={iconLogo}
            alt="Fintrack Logo"
            className="w-15 h-15 object-contain"
          />
          <span
            className={`text-lg font-bold text-gray-800 whitespace-nowrap ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Fintrack
          </span>
        </div>
        <button
          onClick={toggleCollapse}
          className={`
            p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors duration-200
            ${isCollapsed ? "rotate-180" : ""}
            flex-shrink-0
          `}
          aria-label={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        <Link
          to="/"
          className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition-colors duration-200 group"
        >
          <Home size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Home
          </span>
        </Link>

        <Link
          to="/pocket"
          className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition-colors duration-200 group"
        >
          <Wallet size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Pocket
          </span>
        </Link>

        <Link
          to="/history"
          className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition-colors duration-200 group relative"
        >
          <History size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            History
          </span>
          <span
            className={`ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            New 6
          </span>
        </Link>

        <div className="relative">
          <button
            onClick={toggleService}
            className="flex items-center w-full p-2 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition-colors duration-200 group"
            aria-expanded={isServiceOpen}
            aria-controls="service-submenu"
          >
            <Settings size={20} className="mr-3 flex-shrink-0" />
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
              <Link
                to="/service/credit"
                className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors duration-200 text-sm"
              >
                <CreditCard size={16} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap overflow-hidden">
                  Credit
                </span>
              </Link>
              <Link
                to="/service/transfer"
                className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors duration-200 text-sm"
              >
                <ArrowRightLeft size={16} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap overflow-hidden">
                  Transfer
                </span>
              </Link>
              <Link
                to="/service/cash"
                className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors duration-200 text-sm"
              >
                <LandPlot size={16} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap overflow-hidden">Cash</span>
              </Link>
              <Link
                to="/service/bills"
                className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors duration-200 text-sm relative"
              >
                <ReceiptText size={16} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap overflow-hidden">
                  My Bills
                </span>
                <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap overflow-hidden">
                  2
                </span>
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/saved"
          className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition-colors duration-200 group"
        >
          <Bookmark size={20} className="mr-3 flex-shrink-0" />
          <span
            className={`font-medium whitespace-nowrap overflow-hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Saved
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
