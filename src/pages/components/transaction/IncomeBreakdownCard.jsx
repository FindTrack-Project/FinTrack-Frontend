// src/pages/components/transaction/IncomeBreakdownCard.jsx

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "./utils"; // Import utility
import { COLORS_INCOME_PIE } from "./data"; // Import colors

const IncomeBreakdownCard = ({ incomePieData }) => {
  const totalIncomeAmount = incomePieData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 col-span-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Income</h2>
        <select className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent">
          <option>Last 6 month</option>
          <option>Last month</option>
          <option>Last year</option>
        </select>
      </div>

      <p className="text-center text-2xl font-bold text-gray-800 mb-6">
        {formatCurrency(totalIncomeAmount)}
      </p>

      <div className="flex justify-center mb-6">
        {totalIncomeAmount === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No income data available for breakdown.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={incomePieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                cornerRadius={5}
              >
                {incomePieData.map((entry, index) => (
                  <Cell
                    key={`cell-income-${index}`}
                    fill={COLORS_INCOME_PIE[index % COLORS_INCOME_PIE.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `Rp${value.toLocaleString("id-ID")}`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
        {incomePieData.map((entry, index) => (
          <div key={index} className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              style={{
                backgroundColor:
                  COLORS_INCOME_PIE[index % COLORS_INCOME_PIE.length],
              }}
            ></span>
            <span className="text-xs">{entry.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IncomeBreakdownCard;
