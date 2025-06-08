import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Laptop,
  Plane,
  HomeIcon,
  GraduationCap,
  Car,
  Book,
  TrendingUp,
} from "lucide-react";
import { PIE_COLORS } from "./constants";

const SavingGoalsSection = ({ savingGoals, formatCurrency }) => {
  const getGoalIcon = (goalName) => {
    const nameLower = goalName.toLowerCase();
    if (nameLower.includes("laptop") || nameLower.includes("komputer")) return Laptop;
    if (nameLower.includes("liburan") || nameLower.includes("travel") || nameLower.includes("haji")) return Plane;
    if (nameLower.includes("sekolah") || nameLower.includes("pendidikan")) return GraduationCap;
    if (nameLower.includes("rumah") || nameLower.includes("properti")) return HomeIcon;
    if (nameLower.includes("mobil") || nameLower.includes("kendaraan")) return Car;
    if (nameLower.includes("investasi")) return TrendingUp;
    if (nameLower.includes("buku")) return Book;
    return DollarSign;
  };

  return (
    // --- PERUBAHAN 1: Menambahkan flexbox dan memastikan tinggi kartu konsisten ---
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm h-100 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex-shrink-0">Saving Goals</h2>
      
      {/* --- PERUBAHAN 2: Menambahkan max-height dan overflow --- */}
      <div className="flex-grow space-y-4 max-h-[26rem] overflow-y-auto -mr-2 pr-2 custom-scrollbar">
        {savingGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-4 text-gray-500 text-sm">
            <p>No saving goals found.</p>
            <Link to="/savings" className="text-blue-500 hover:underline mt-1">
              Create one?
            </Link>
          </div>
        ) : (
          savingGoals.map((goal, index) => {
            const progress =
              goal.targetAmount > 0
                ? (goal.currentSavedAmount / goal.targetAmount) * 100
                : 0;
            const IconComponent = getGoalIcon(goal.name);
            const color = PIE_COLORS[index % PIE_COLORS.length];

            return (
              <div
                key={goal.id}
                className="p-3 bg-gray-50 rounded-lg relative overflow-hidden group hover:bg-gray-100 transition-colors"
              >
                <div
                  className="absolute bottom-0 left-0 h-1.5 rounded-br-lg"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: color,
                    opacity: 0.7,
                  }}
                ></div>

                <div className="relative z-10 flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                      style={{ backgroundColor: `${color}40`, color: color }}
                    >
                      <IconComponent size={16} />
                    </div>
                    <span className="font-medium text-gray-800 text-sm truncate">
                      {goal.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 ml-auto whitespace-nowrap">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <p className="relative z-10 text-xs text-gray-600 ml-11">
                  {formatCurrency(goal.currentSavedAmount)} /{" "}
                  {formatCurrency(goal.targetAmount)}
                </p>
                {goal.isCompleted && (
                  <span className="relative z-10 text-xs font-semibold text-green-600 ml-11 mt-1 block">
                    (Completed!)
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
       {/* --- PERUBAHAN 3: Menambahkan style untuk scrollbar --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </div>
  );
};

export default SavingGoalsSection;
