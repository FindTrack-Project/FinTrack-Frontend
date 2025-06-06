import React from "react";
import { Pie } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
import { PIE_COLORS, pieOptions } from "./constants"; // Import PIE_COLORS and pieOptions

const ExpensesChart = ({
  expenseByCategory,
  totalAllExpenses,
  formatCurrency,
}) => {
  const pieData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: PIE_COLORS,
        borderColor: "#ffffff",
        borderWidth: 8,
        borderRadius: 8,
        hoverOffset: 8,
        spacing: 2,
      },
    ],
  };

  return (
    <div className="bg-white h-full border border-gray-200 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Expenses</h2>
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <option>Last 6 month</option>
            <option>Last 3 month</option>
            <option>Last 12 month</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {totalAllExpenses === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <TrendingUp size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-gray-500 text-sm">No expense data available.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-60 w-60 relative mb-6">
            <Pie data={pieData} options={pieOptions(formatCurrency)} />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-xs">
            {Object.entries(expenseByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount], idx) => (
                <div key={cat} className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                    }}
                  ></span>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {cat}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {((amount / totalAllExpenses) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesChart;
