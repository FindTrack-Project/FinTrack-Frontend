import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "./utils"; 
import { COLORS_EXPENSES_PIE } from "./data"; 

ChartJS.register(ArcElement, Tooltip, Legend);

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#111827",
      titleColor: "#FFFFFF",
      bodyColor: "#E5E7EB",
      borderRadius: 8,
      padding: 12,
      boxPadding: 4,
      callbacks: {
        label: (context) => `${formatCurrency(context.parsed)}`,
      },
    },
  },
  cutout: "50%",
};

const ExpenseBreakdownCard = ({ expensesPieData }) => {
  const totalExpenseAmount = expensesPieData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const chartData = {
    labels: expensesPieData.map((item) => item.name),
    datasets: [
      {
        data: expensesPieData.map((item) => item.value),
        backgroundColor: COLORS_EXPENSES_PIE,
        borderColor: "#ffffff",
        borderWidth: 5,
        borderRadius: 8,
        hoverOffset: 10,
      },
    ],
  };

  return (
    // Pastikan kartu menggunakan flexbox vertikal dan memiliki tinggi yang pasti
    <section className="h-130 bg-white rounded-2xl shadow-sm p-6 flex flex-col">
      {/* Header Kartu */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Expenses</h2>
        <select className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer">
          <option>Last 6 month</option>
          <option>Last month</option>
          <option>Last year</option>
        </select>
      </div>

      <p className="text-start text-4xl font-bold text-gray-800 mb-6">
        {formatCurrency(totalExpenseAmount)}
      </p>
      
      {/* Chart */}
      <div className="h-56 w-full flex justify-center my-4 flex-shrink-0">
        {totalExpenseAmount === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No expense data.
          </div>
        ) : (
          <Pie data={chartData} options={pieOptions} />
        )}
      </div>

      {/* --- LEGENDA DENGAN SCROLL --- */}
      <div className="flex-grow overflow-y-auto -mr-3 pr-3 custom-scrollbar">
        <div className="flex flex-wrap justify-center gap-3">
          {expensesPieData
            .map((entry, index) => (
              <div key={index} className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor:
                      COLORS_EXPENSES_PIE[index % COLORS_EXPENSES_PIE.length],
                  }}
                ></span>
                <span className="text-gray-700">{entry.name}</span>
              </div>
          ))}
        </div>
      </div>

      {/* Style untuk scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { 
          width: 8px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: #93c5fd; /* Warna biru muda */
          border-radius: 10px;
          border: 2px solid #ffffff; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background-color: #60a5fa; /* Warna biru lebih gelap saat hover */
        }
      `}</style>
    </section>
  );
};

export default ExpenseBreakdownCard;
