import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Laptop,
  Plane,
  HomeIcon,
  ArrowRightLeft,
  TrendingUp,
} from "lucide-react";
import { PIE_COLORS } from "./constants";

const SavingGoalsSection = ({ savingGoals, formatCurrency }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
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
          savingGoals.map((goal) => {
            const progress =
              (goal.currentSavedAmount / goal.targetAmount) * 100;
            let IconComponent = DollarSign;
            if (goal.name.toLowerCase().includes("laptop")) {
              IconComponent = Laptop;
            } else if (
              goal.name.toLowerCase().includes("haji") ||
              goal.name.toLowerCase().includes("umroh")
            ) {
              IconComponent = Plane;
            } else if (
              goal.name.toLowerCase().includes("sekolah") ||
              goal.name.toLowerCase().includes("rumah")
            ) {
              IconComponent = HomeIcon;
            } else if (
              goal.name.toLowerCase().includes("liburan") ||
              goal.name.toLowerCase().includes("travel")
            ) {
              IconComponent = Plane;
            } else if (
              goal.name.toLowerCase().includes("mobil") ||
              goal.name.toLowerCase().includes("motor")
            ) {
              IconComponent = ArrowRightLeft;
            } else if (goal.name.toLowerCase().includes("investasi")) {
              IconComponent = TrendingUp;
            }

            const color =
              PIE_COLORS[savingGoals.indexOf(goal) % PIE_COLORS.length];

            return (
              <div
                key={goal.id}
                className="p-4 bg-gray-50 rounded-lg relative overflow-hidden"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-blue-100 rounded-l-lg"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: `${color}40`,
                  }}
                ></div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div
                      className="p-2 rounded-lg mr-3"
                      style={{ backgroundColor: `${color}1A` }}
                    >
                      <IconComponent size={20} style={{ color: color }} />
                    </div>
                    <span className="font-medium text-gray-800">
                      {goal.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <p className="relative z-10 text-xs text-gray-600">
                  {formatCurrency(goal.currentSavedAmount)} /{" "}
                  {formatCurrency(goal.targetAmount)}
                </p>
                {goal.isCompleted && (
                  <span className="relative z-10 text-xs font-semibold text-green-600 ml-2">
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
