import React from "react";
import { Link } from "react-router-dom";
// Menggunakan ikon yang lebih generik atau sesuai untuk pocket, atau Lucide jika ada yang pas
import {
  Wallet,
  CreditCard,
  DollarSign,
  PiggyBank,
  Landmark,
  Circle,
} from "lucide-react";
import { PIE_COLORS } from "./constants";

const PocketsSection = ({ accounts, formatCurrency }) => {
  // Fungsi helper untuk memilih ikon dan warna yang lebih spesifik berdasarkan nama akun
  const getPocketDisplay = (account, index) => {
    let IconComponent = Wallet; // Default
    let iconBgColor = PIE_COLORS[index % PIE_COLORS.length]; // Warna default dari PIE_COLORS
    let iconColor = "white"; // Warna ikon default

    const nameLower = account.name.toLowerCase();
    const typeLower = account.type ? account.type.toLowerCase() : "";

    if (nameLower.includes("cash") || typeLower.includes("cash")) {
      IconComponent = DollarSign; // Ikon uang tunai
      iconBgColor = "#10B981"; // Hijau
    } else if (
      nameLower.includes("bni") ||
      nameLower.includes("BRI") ||
      nameLower.includes("mandiri") ||
      typeLower.includes("bank")
    ) {
      IconComponent = Landmark; // Ikon bank
      iconBgColor = "#3B82F6"; // Biru
    } else if (nameLower.includes("jago") || nameLower.includes("seabank")) {
      IconComponent = PiggyBank; // Ikon umum untuk Jago jika tidak ada yang lebih spesifik
      iconBgColor = "#F59E0B"; // Oranye/kuning
    } else if (
      nameLower.includes("gopay") ||
      nameLower.includes("dana") ||
      typeLower.includes("e-wallet")
    ) {
      IconComponent = Wallet; // Ikon dompet untuk e-wallet
      iconBgColor = "#8B5CF6"; // Ungu
    } else {
      // Fallback untuk akun lain, gunakan warna dari PIE_COLORS
      iconBgColor = PIE_COLORS[index % PIE_COLORS.length];
      iconColor = "white"; // Atau bisa disesuaikan agar kontras
    }

    return { IconComponent, iconBgColor, iconColor };
  };

  return (
    <div className="bg-white border h-100 border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex-shrink-0">
        Pockets
      </h2>
      <div className="flex-grow space-y-4 max-h-[22rem] overflow-y-auto -mr-2 pr-2 custom-scrollbar min-h-0">
        {accounts.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No accounts found.
            <Link to="/accounts/add" className="text-blue-500 ml-1">
              Add one?
            </Link>
          </div>
        ) : (
          accounts.map((account, index) => {
            const { IconComponent, iconBgColor, iconColor } = getPocketDisplay(
              account,
              index
            );

            return (
              <div
                key={account.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ backgroundColor: iconBgColor }}
                >
                  <IconComponent size={20} style={{ color: iconColor }} />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800 block">
                    {account.name}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 ml-auto whitespace-nowrap">
                  {formatCurrency(account.currentBalance)}
                </span>
              </div>
            );
          })
        )}
      </div>
      <style>{`
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
    `}</style>
    </div>
  );
};

export default PocketsSection;
