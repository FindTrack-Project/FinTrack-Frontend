// src/pages/components/transaction/CashFlowChart.jsx

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupiahK } from "./utils"; // Import utility

const CashFlowChart = ({ cashFlowData, cashFlowFilter, setCashFlowFilter }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 col-span-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Cash Flow</h2>
        <select className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent">
          <option>Last 6 month</option>
          <option>Last year</option>
          <option>All time</option>
        </select>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center mb-6 space-x-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            cashFlowFilter === "All"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setCashFlowFilter("All")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            cashFlowFilter === "Incomes"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setCashFlowFilter("Incomes")}
        >
          Incomes
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            cashFlowFilter === "Expenses"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setCashFlowFilter("Expenses")}
        >
          Expenses
        </button>
      </div>

      {/* Legend */}
      <div className="flex space-x-6 mb-6 text-sm text-gray-600">
        <span className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Income
        </span>
        <span className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Expenses
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={cashFlowData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            stroke="#888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatRupiahK}
            stroke="#888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[
              0,
              Math.max(
                ...cashFlowData.map((d) => d.income || 0),
                ...cashFlowData.map((d) => d.expenses || 0),
                1000000 // Minimum upper bound for Y-axis if data is small
              ) * 1.2,
            ]}
          />
          <Tooltip
            formatter={(value) => `Rp${value.toLocaleString("id-ID")}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          {cashFlowFilter !== "Expenses" && (
            <Line
              type="monotone"
              dataKey="income"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 6, fill: "#3b82f6" }}
            />
          )}
          {cashFlowFilter !== "Incomes" && (
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ef4444" }}
              activeDot={{ r: 6, fill: "#ef4444" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default CashFlowChart;
