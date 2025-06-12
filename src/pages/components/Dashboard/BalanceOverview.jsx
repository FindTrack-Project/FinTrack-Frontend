import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { lineChartOptions } from "./constants"; // Pastikan path ini benar

// Registrasi semua modul Chart.js yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BalanceOverview = ({
  totalBalance,
  totalIncomeCurrentMonth,
  totalExpenseCurrentMonth,
  incomeGrowth,
  expenseGrowth,
  months,
  balanceOverTime,
  formatCurrency,
  onTimeRangeChange,
  selectedTimeRange,
}) => {
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Balance",
        data: balanceOverTime,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(59, 130, 246)",
      },
    ],
  };

  return (
    <div className="bg-white h-full border border-gray-200 p-6 rounded-xl shadow-sm">
      {/* Header */}
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

      {/* Total Balance */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-500 mb-1">Total Balance</h3>
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(totalBalance)}
        </p>
      </div>

      {/* --- INI BAGIAN UTAMA YANG DIPERBAIKI DENGAN FLEXBOX --- */}
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-12 mb-6">
        {/* Kolom Income */}
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Income</h3>
          <p className="text-xl font-bold text-green-600 flex items-center">
            {formatCurrency(totalIncomeCurrentMonth)}
          </p>
        </div>
        {/* Kolom Expenses */}
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Expenses</h3>
          <p className="text-xl font-bold text-red-600 flex items-center">
            {formatCurrency(totalExpenseCurrentMonth)}
          </p>
        </div>
      </div>

      {/* Line Chart (posisi tetap di bawah) */}
      <div className="h-64 relative">
        <Line data={lineChartData} options={lineChartOptions(formatCurrency)} />
      </div>
    </div>
  );
};

export default BalanceOverview;