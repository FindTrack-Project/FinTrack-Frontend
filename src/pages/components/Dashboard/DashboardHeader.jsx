import React from "react";
import { Bell, Menu, X } from "lucide-react"; // Impor ikon Menu dan X

const DashboardHeader = ({
  userName,
  userEmail,
  toggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {/* Tombol Toggle Sidebar */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:shadow-md transition-all duration-200"
          aria-label={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
        >
          {isSidebarOpen ? (
            <X size={20} className="text-gray-600" /> // Ikon X saat sidebar terbuka
          ) : (
            <Menu size={20} className="text-gray-600" /> // Ikon Menu saat sidebar tertutup
          )}
        </button>
        <div>
          <h1 className="text-3xl text-gray-900 font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {userName}!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
        </button>
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
    </div>
  );
};

export default DashboardHeader;
