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
  Filler, // <-- PENTING: Pastikan 'Filler' di-import dari chart.js
} from "chart.js";
// import { useRef, useEffect } from "react"; // <-- PERBAIKAN: useRef dan useEffect tidak lagi diperlukan
import { lineChartOptions } from "./constants";

// Registrasi semua modul Chart.js yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // <-- PENTING: Pastikan 'Filler' juga didaftarkan di sini
);

const BalanceOverview = ({
  totalBalance,
  totalIncomeCurrentMonth,
  totalExpenseCurrentMonth,
  months,
  balanceOverTime,
  formatCurrency,
  onTimeRangeChange,
  selectedTimeRange,
}) => {
  // const chartRef = useRef(null); // <-- PERBAIKAN: Dihapus

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Balance",
        data: balanceOverTime,
        borderColor: "rgb(59, 130, 246)",
        fill: true, // <-- Penting agar background muncul
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(59, 130, 246)",
        
        // --- [PERBAIKAN UTAMA] ---
        // Ganti string statis dengan fungsi untuk membuat gradasi dinamis
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // Kembali jika area chart belum ada (untuk render awal)
            return null;
          }
          // Membuat gradasi vertikal dari atas ke bawah
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          
          // Menerjemahkan gaya gradasi yang Anda inginkan
          gradient.addColorStop(0.05, "rgba(59, 130, 246, 0.2)"); // 5% dari atas
          gradient.addColorStop(0.95, "rgba(59, 130, 246, 0)");   // 95% dari atas (transparan)

          return gradient;
        },
      },
    ],
  };

  // const useEffect = ...; // <-- PERBAIKAN: Dihapus

  return (
    <div className="bg-white h-full border border-gray-200 p-6 rounded-xl shadow-sm">
      {/* Header (TIDAK DIUBAH) */}
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

      {/* Total Balance (TIDAK DIUBAH) */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-500 mb-1">Total Balance</h3>
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(totalBalance)}
        </p>
      </div>

      {/* Income & Expenses (TIDAK DIUBAH) */}
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-12 mb-6">
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Incomes</h3>
          <p className="text-xl font-bold text-green-600 flex items-center">
            {formatCurrency(totalIncomeCurrentMonth)}
          </p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Expenses</h3>
          <p className="text-xl font-bold text-red-600 flex items-center">
            {formatCurrency(totalExpenseCurrentMonth)}
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-64 relative">
        {/* PERBAIKAN: ref pada komponen Line dihapus */}
        <Line data={lineChartData} options={lineChartOptions(formatCurrency)} />
      </div>
    </div>
  );
};

export default BalanceOverview;