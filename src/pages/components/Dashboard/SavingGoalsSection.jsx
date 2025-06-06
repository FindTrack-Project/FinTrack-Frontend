import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Laptop,
  Plane,
  HomeIcon,
  ArrowRightLeft,
  TrendingUp,
  Book,
  GraduationCap,
  Car,
} from "lucide-react";
import { PIE_COLORS } from "./constants";

const SavingGoalsSection = ({ savingGoals, formatCurrency }) => {
  // Fungsi helper untuk memilih ikon yang lebih spesifik
  const getGoalIcon = (goalName) => {
    const nameLower = goalName.toLowerCase();
    if (nameLower.includes("laptop") || nameLower.includes("komputer"))
      return Laptop;
    if (nameLower.includes("liburan") || nameLower.includes("travel"))
      return Plane;
    if (nameLower.includes("haji") || nameLower.includes("umroh")) return Plane; // Atau ikon yang lebih spesifik jika ada
    if (nameLower.includes("sekolah") || nameLower.includes("pendidikan"))
      return GraduationCap;
    if (nameLower.includes("rumah") || nameLower.includes("properti"))
      return HomeIcon;
    if (nameLower.includes("mobil") || nameLower.includes("kendaraan"))
      return Car;
    if (nameLower.includes("investasi")) return TrendingUp;
    if (nameLower.includes("buku")) return Book;
    return DollarSign; // Default
  };

  return (
    <div className="bg-white border h-full border-gray-200 p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Saving Goals</h2>
      <div className="space-y-4">
        {savingGoals.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No saving goals found.
            <Link to="/goals/add" className="text-blue-500 ml-1">
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
            const color = PIE_COLORS[index % PIE_COLORS.length]; // Warna untuk ikon dan progres

            return (
              <div
                key={goal.id}
                className="p-3 bg-gray-50 rounded-lg relative overflow-hidden group hover:bg-gray-100 transition-colors" // Add group for hover effect
              >
                {/* Progres bar di bagian bawah card, lebih subtle */}
                <div
                  className="absolute bottom-0 left-0 h-1.5 rounded-br-lg" // Lebih tipis dan di bagian bawah
                  style={{
                    width: `${progress}%`,
                    backgroundColor: color, // Warna progres bar
                    opacity: 0.7, // Sedikit transparan
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
                  {/* Persentase di kanan judul */}
                  <span className="text-xs font-semibold text-gray-700 ml-auto whitespace-nowrap">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <p className="relative z-10 text-xs text-gray-600 ml-11">
                  {" "}
                  {/* Sesuaikan margin-left untuk menyelaraskan */}
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
    </div>
  );
};

export default SavingGoalsSection;
