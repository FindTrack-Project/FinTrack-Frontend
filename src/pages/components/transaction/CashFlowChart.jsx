import React from "react";
import {
  AreaChart, // Ganti LineChart dengan AreaChart
  Area,      // Ganti Line dengan Area
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupiahJT } from "./utils"; // Import formatter baru

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((pld) => (
          <div key={pld.dataKey} style={{ color: pld.color }} className="flex justify-between items-center">
            <span className="capitalize text-sm">{pld.dataKey}: </span>
            <span className="font-semibold ml-4 text-sm">{`Rp${pld.value.toLocaleString('id-ID')}`}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CashFlowChart = ({ cashFlowData, cashFlowFilter, setCashFlowFilter }) => {
  return (
    <section className="h-full bg-white rounded-2xl shadow-sm p-6 col-span-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Cash Flow</h2>
        <select className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent cursor-pointer">
          <option>Last 6 month</option>
          <option>Last year</option>
          <option>All time</option>
        </select>
      </div>

      {/* Filter Buttons */}
      <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-6 self-start">
        {["All", "Incomes", "Expenses"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              cashFlowFilter === filter
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setCashFlowFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex space-x-6 mb-6 text-sm text-gray-600">
        {cashFlowFilter !== "Expenses" && (
           <span className="flex items-center">
             <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
             Incomes
           </span>
        )}
        {cashFlowFilter !== "Incomes" && (
           <span className="flex items-center">
             <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
             Expenses
           </span>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart // Gunakan AreaChart
          data={cashFlowData}
          margin={{ top: 5, right: 20, left: 15, bottom: 5 }}
        >
          {/* Definisikan gradien untuk fill area */}
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>

          {/* PERBAIKAN: Hilangkan grid vertikal */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          
          <XAxis
            dataKey="name"
            stroke="#9ca3af" // Warna lebih lembut
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatRupiahJT} // Gunakan formatter baru
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            // Domain diatur otomatis oleh Recharts, lebih simpel dan aman
          />
          <Tooltip content={<CustomTooltip />} />

          {cashFlowFilter !== "Expenses" && (
            <Area // Gunakan komponen Area
              type="monotone"
              dataKey="income"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)" // Terapkan gradien
              dot={false} // Hilangkan titik
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: '#3b82f6' }}
            />
          )}
          {cashFlowFilter !== "Incomes" && (
            <Area // Gunakan komponen Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)" // Terapkan gradien
              dot={false} // Hilangkan titik
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: '#ef4444' }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
};

export default CashFlowChart;