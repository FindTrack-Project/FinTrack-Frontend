import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "./utils"; 
import { COLORS_INCOME_PIE } from "./data"; 

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
      backgroundColor: "#1F2937",
      titleColor: "#FFFFFF",
      bodyColor: "#FFFFFF",
      borderRadius: 8,
      padding: 12,
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ${formatCurrency(value)}`;
        },
      },
    },
  },
  // DIUBAH LAGI: untuk chart yang sangat tebal
  cutout: "50%", 
};

const IncomeBreakdownCard = ({ incomePieData }) => {
  const totalIncomeAmount = incomePieData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const chartData = {
    labels: incomePieData.map((item) => item.name),
    datasets: [
      {
        data: incomePieData.map((item) => item.value),
        backgroundColor: COLORS_INCOME_PIE,
        borderColor: "#ffffff",
        borderWidth: 8,
        borderRadius: 8,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <section className="h-full bg-white rounded-2xl shadow-sm p-6 col-span-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Incomes</h2>
        <select className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer">
          <option>Last 6 month</option>
          <option>Last month</option>
          <option>Last year</option>
        </select>
      </div>

      <p className="text-start text-4xl font-bold text-gray-800 mb-6">
        {formatCurrency(totalIncomeAmount)}
      </p>

      <div className="h-52 w-full flex justify-center mb-6">
        {totalIncomeAmount === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No income data available.
          </div>
        ) : (
          <Pie data={chartData} options={pieOptions} />
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {incomePieData
          .map((entry, index) => (
            <div key={index} className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor:
                    COLORS_INCOME_PIE[index % COLORS_INCOME_PIE.length],
                }}
              ></span>
              <span className="text-gray-700">{entry.name}</span>
            </div>
        ))}
      </div>
    </section>
  );
};

export default IncomeBreakdownCard;