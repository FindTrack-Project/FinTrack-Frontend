import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label, formatCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-sm text-gray-800">{label}</p>
        <p className="font-bold text-base text-blue-600">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const BalanceOverview = ({
  totalBalance,
  totalIncomeCurrentMonth,
  totalExpenseCurrentMonth,
  incomeGrowth, // Asumsi ini adalah desimal (misal: 0.05 untuk 5%)
  expenseGrowth, // Asumsi ini adalah desimal (misal: 0.10 untuk 10%)
  months,
  balanceOverTime,
  formatCurrency,
  onTimeRangeChange,
  selectedTimeRange,
}) => {
  const chartData = months.map((month, index) => ({
    name: month,
    balance: balanceOverTime[index] || 0,
  }));

  const isMobile = window.innerWidth < 640;

  return (
    <div className="bg-white h-full border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Balance</h2>
        <div className="relative">
          <select
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            value={selectedTimeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            <option value="6_months">Last 6 month</option>
            <option value="3_months">Last 3 month</option>
            <option value="12_months">Last 12 month</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm text-gray-500 mb-1">Total Balance</h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          {formatCurrency(totalBalance)}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-12 mb-6">
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Income</h3>
          <p className="text-xl font-bold text-green-600 flex items-center">
            {formatCurrency(totalIncomeCurrentMonth)}
            <span className={`ml-2 text-xs font-semibold ${incomeGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {/* PERBAIKAN: Kalikan dengan 100 untuk persentase */}
              {Math.abs(incomeGrowth * 100).toFixed(1)}% {incomeGrowth >= 0 ? "▲" : "▼"}
            </span>
          </p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Expenses</h3>
          <p className="text-xl font-bold text-red-600 flex items-center">
            {formatCurrency(totalExpenseCurrentMonth)}
            <span className={`ml-2 text-xs font-semibold ${expenseGrowth >= 0 ? "text-red-500" : "text-green-500"}`}>
              {/* PERBAIKAN: Kalikan dengan 100 untuk persentase */}
              {Math.abs(expenseGrowth * 100).toFixed(1)}% {expenseGrowth >= 0 ? "▲" : "▼"}
            </span>
          </p>
        </div>
      </div>

      <div className="h-64 min-h-[200px] sm:min-h-[256px] relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={
              isMobile
                ? { top: 5, right: 0, left: 20, bottom: 0 }
                : { top: 5, right: 0, left: 20, bottom: 0 }
            }
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              interval={isMobile ? "preserveStart" : "preserveStartEnd"}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#9ca3af"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              width={isMobile ? 50 : 70}
            />
            <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBalance)"
              dot={false}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: '#3b82f6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceOverview;