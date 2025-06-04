import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowRightLeft,
  PlusCircle,
  Bell,
  User,
  Eye,
  Calendar,
  CreditCard, // For Pockets (Cash, Bank BRI, Bank Jago, GoPay)
  Laptop, // For Saving Goals (Laptop Baru)
  Plane, // For Saving Goals (Haji Furoda)
  HomeIcon, // For Saving Goals (Bangun Sekolah)
} from "lucide-react";
import Api from "../../../config/apiConfig"; // Assuming this path is correct
import { Pie, Line } from "react-chartjs-2"; // Import Line for the line chart
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale, // For line chart x-axis
  LinearScale, // For line chart y-axis
  PointElement, // For line chart points
  LineElement, // For line chart lines
  Title, // For chart title
} from "chart.js";

// Register necessary Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

// DUMMY DATA (Expanded and refined to match image)
const DUMMY_EXPENSES = [
  {
    id: 1,
    amount: 50000,
    date: "2025-01-15",
    description: "Makan siang",
    category: "Food & Drink",
  },
  {
    id: 2,
    amount: 100000,
    date: "2025-02-10",
    description: "Transportasi",
    category: "Transport",
  },
  {
    id: 3,
    amount: 75000,
    date: "2025-03-05",
    description: "Groceries",
    category: "Groceries",
  },
  {
    id: 4,
    amount: 30000,
    date: "2025-04-20",
    description: "Tagihan Listrik",
    category: "Tagihan",
  },
  {
    id: 5,
    amount: 20000,
    date: "2025-05-12",
    description: "Nonton Bioskop",
    category: "Entertainment",
  },
  {
    id: 6,
    amount: 40000,
    date: "2025-06-01",
    description: "Obat",
    category: "Health",
  },
  {
    id: 7,
    amount: 25000,
    date: "2025-06-02",
    description: "Sosial",
    category: "Social",
  },
  {
    id: 8,
    amount: 60000,
    date: "2025-06-03",
    description: "Buku",
    category: "Education",
  },
  {
    id: 9,
    amount: 90000,
    date: "2025-06-04",
    description: "Cicilan Motor",
    category: "Cicilan/Lain-lain",
  },
  {
    id: 10,
    amount: 30000,
    date: "2025-06-04",
    description: "Nasi Padang",
    category: "Food & Drink",
  },
  {
    id: 11,
    amount: 10000,
    date: "2025-06-04",
    description: "Paket data Telkomsel",
    category: "Tagihan",
  },
];

const DUMMY_INCOMES = [
  {
    id: 1,
    amount: 15000000,
    date: "2025-01-01",
    description: "Gaji Bulanan",
    category: "Gaji",
  },
  {
    id: 2,
    amount: 500000,
    date: "2025-02-01",
    description: "Freelance Project",
    category: "Lain-lain",
  },
  {
    id: 3,
    amount: 15000000,
    date: "2025-03-01",
    description: "Gaji Bulanan",
    category: "Gaji",
  },
  {
    id: 4,
    amount: 15000000,
    date: "2025-04-01",
    description: "Gaji Bulanan",
    category: "Gaji",
  },
  {
    id: 5,
    amount: 15000000,
    date: "2025-05-01",
    description: "Gaji Bulanan",
    category: "Gaji",
  },
  {
    id: 6,
    amount: 15000000,
    date: "2025-06-01",
    description: "Gaji Bulanan",
    category: "Gaji",
  },
];

const DUMMY_POCKETS = [
  { name: "Cash", balance: 795700, icon: CreditCard, color: "#10B981" },
  { name: "Bank BRI", balance: 8500000, icon: CreditCard, color: "#2563EB" },
  { name: "Bank Jago", balance: 4500000, icon: CreditCard, color: "#F59E0B" },
  { name: "GoPay", balance: 900000, icon: CreditCard, color: "#EF4444" },
];

const DUMMY_SAVING_GOALS = [
  {
    name: "Laptop Baru",
    current: 2400000,
    target: 12000000,
    icon: Laptop,
    color: "#6366F1",
  },
  {
    name: "Haji Furoda",
    current: 1000000,
    target: 20000000,
    icon: Plane,
    color: "#14B8A6",
  },
  {
    name: "Bangun Sekolah",
    current: 0,
    target: 5000000,
    icon: HomeIcon,
    color: "#EAB308",
  },
];

const PIE_COLORS = [
  "#3B82F6", // Food & Drink
  "#10B981", // Transport
  "#F59E0B", // Groceries
  "#EF4444", // Tagihan
  "#8B5CF6", // Entertainment
  "#06B6D4", // Health
  "#F97316", // Social
  "#84CC16", // Education
  "#EC4899", // Cicilan/Lain-lain
  "#6366F1", // Fallback if more categories
];

const Home = () => {
  const [balance] = useState(15595700); // Initial balance based on image
  const [incomes] = useState(DUMMY_INCOMES);
  const [expenses] = useState(DUMMY_EXPENSES);
  const [loading, setLoading] = useState(true);

  // Simulate API calls
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  // Helper to format currency
  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")}`;
  };

  // Calculate monthly income and expenses for the line chart
  const getMonthlyData = (data) => {
    const monthlySummary = {};
    data.forEach((item) => {
      const date = new Date(item.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = 0;
      }
      monthlySummary[monthYear] += item.amount;
    });

    const months = [];
    const incomeAmounts = [];
    const expenseAmounts = [];
    const balanceOverTime = [];

    const today = new Date();
    // Get last 6 months for the chart
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(d.toLocaleString("en-US", { month: "short" })); // e.g., "Jan", "Feb"

      // Accumulate balance up to this month
      let currentBalance = 0;
      if (i === 5) {
        // For the first month in the 6-month range, use a base balance or calculate from scratch
        currentBalance = DUMMY_INCOMES.filter(
          (inc) => new Date(inc.date) < d
        ).reduce((sum, inc) => sum + inc.amount, 0);
        currentBalance -= DUMMY_EXPENSES.filter(
          (exp) => new Date(exp.date) < d
        ).reduce((sum, exp) => sum + exp.amount, 0);
        currentBalance += DUMMY_POCKETS.reduce(
          (sum, pocket) => sum + pocket.balance,
          0
        ); // Add pockets to initial balance
      } else {
        currentBalance = balanceOverTime[balanceOverTime.length - 1];
      }

      const monthlyIncome = DUMMY_INCOMES.filter(
        (inc) =>
          new Date(inc.date).getMonth() === d.getMonth() &&
          new Date(inc.date).getFullYear() === d.getFullYear()
      ).reduce((sum, inc) => sum + inc.amount, 0);

      const monthlyExpense = DUMMY_EXPENSES.filter(
        (exp) =>
          new Date(exp.date).getMonth() === d.getMonth() &&
          new Date(exp.date).getFullYear() === d.getFullYear()
      ).reduce((sum, exp) => sum + exp.amount, 0);

      balanceOverTime.push(currentBalance + monthlyIncome - monthlyExpense);
      incomeAmounts.push(monthlyIncome);
      expenseAmounts.push(monthlyExpense);
    }

    return {
      months,
      incomeAmounts,
      expenseAmounts,
      balanceOverTime,
    };
  };

  const { months, incomeAmounts, expenseAmounts, balanceOverTime } =
    getMonthlyData([...incomes, ...expenses]);

  const totalIncomeLastMonth = incomeAmounts[incomeAmounts.length - 2] || 0;
  const totalExpenseLastMonth = expenseAmounts[expenseAmounts.length - 2] || 0;
  const totalIncomeCurrentMonth = incomeAmounts[incomeAmounts.length - 1] || 0;
  const totalExpenseCurrentMonth =
    expenseAmounts[expenseAmounts.length - 1] || 0;

  const incomeGrowth =
    totalIncomeLastMonth > 0
      ? ((totalIncomeCurrentMonth - totalIncomeLastMonth) /
          totalIncomeLastMonth) *
        100
      : 0;
  const expenseGrowth =
    totalExpenseLastMonth > 0
      ? ((totalExpenseCurrentMonth - totalExpenseLastMonth) /
          totalExpenseLastMonth) *
        100
      : 0;

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Balance",
        data: balanceOverTime,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(59, 130, 246)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Balance Over Time",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280", // gray-500
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "#E5E7EB", // gray-200
        },
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
          color: "#6B7280", // gray-500
        },
      },
    },
  };

  // Group expenses by category for Pie Chart
  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const totalAllExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const pieData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: PIE_COLORS,
        borderColor: "#ffffff", // Border color between segments
        borderWidth: 8, // Thickness of the pie chart segments
        borderRadius: 8, // Rounded corners for segments
        hoverOffset: 8, // Adds a slight pop-out effect on hover
        spacing: 2, // Spacing between segments (optional)
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll render custom legend
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(
              value
            )} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%", // Adjust cutout to make the donut thicker
  };

  const getTransactionIcon = (description) => {
    if (description.toLowerCase().includes("makan")) return "🍽️";
    if (description.toLowerCase().includes("transportasi")) return "🚗";
    if (description.toLowerCase().includes("groceries")) return "🛒";
    if (description.toLowerCase().includes("tagihan")) return "🧾";
    if (description.toLowerCase().includes("bioskop")) return "🎬";
    if (description.toLowerCase().includes("obat")) return "💊";
    if (description.toLowerCase().includes("sosial")) return "🤝";
    if (description.toLowerCase().includes("buku")) return "📚";
    if (description.toLowerCase().includes("cicilan")) return "🏦";
    return "💸";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - now full width */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:shadow-md transition-all duration-200">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full pr-3 pl-1 py-1 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-right">
                <p className="font-semibold text-gray-800 text-sm">
                  Ahsan Nafis'almi
                </p>
                <p className="text-gray-500 text-xs">ahsannafis@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Balance and Expenses Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Balance Section */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Balance</h2>
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

            <div className="mb-6">
              <h3 className="text-sm text-gray-600 font-medium mb-1">
                Total Balance
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : formatCurrency(balance)}
              </p>
            </div>

            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-sm text-gray-600 mb-1">Income</h3>
                <p className="text-xl font-bold text-green-600 flex items-center">
                  {loading ? "..." : formatCurrency(totalIncomeCurrentMonth)}
                  <span
                    className={`ml-2 text-xs font-semibold ${
                      incomeGrowth >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {incomeGrowth.toFixed(1)}% {incomeGrowth >= 0 ? "▲" : "▼"}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-sm text-gray-600 mb-1">Expenses</h3>
                <p className="text-xl font-bold text-red-600 flex items-center justify-end">
                  {loading ? "..." : formatCurrency(totalExpenseCurrentMonth)}
                  <span
                    className={`ml-2 text-xs font-semibold ${
                      expenseGrowth >= 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {expenseGrowth.toFixed(1)}% {expenseGrowth >= 0 ? "▲" : "▼"}
                  </span>
                </p>
              </div>
            </div>

            <div className="h-64 relative">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Loading chart...
                </div>
              ) : (
                <Line data={lineChartData} options={lineChartOptions} />
              )}
            </div>
          </div>

          {/* Expenses Pie Chart Section */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
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
                <p className="text-gray-500 text-sm">
                  No expense data available.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-48 w-48 relative mb-6">
                  <Pie data={pieData} options={pieOptions} />
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-xs">
                  {Object.entries(expenseByCategory)
                    .sort(([, a], [, b]) => b - a) // Sort by amount descending
                    .map(([cat, amount], idx) => (
                      <div key={cat} className="flex items-center">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor:
                              PIE_COLORS[idx % PIE_COLORS.length],
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
        </div>

        {/* Pockets, Saving Goals, and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pockets */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Pockets
            </h2>
            <div className="space-y-4">
              {DUMMY_POCKETS.map((pocket, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className="p-2 rounded-lg mr-3"
                      style={{ backgroundColor: `${pocket.color}1A` }} // 1A for 10% opacity
                    >
                      <pocket.icon size={20} style={{ color: pocket.color }} />
                    </div>
                    <span className="font-medium text-gray-800">
                      {pocket.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(pocket.balance)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Saving Goals */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Saving Goals
            </h2>
            <div className="space-y-4">
              {DUMMY_SAVING_GOALS.map((goal, index) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-100 rounded-l-lg"
                      style={{ width: `${progress}%` }}
                    ></div>
                    <div className="relative z-10 flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className="p-2 rounded-lg mr-3"
                          style={{ backgroundColor: `${goal.color}1A` }}
                        >
                          <goal.icon size={20} style={{ color: goal.color }} />
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
                      {formatCurrency(goal.current)} /{" "}
                      {formatCurrency(goal.target)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Transactions
              </h2>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                  <option>7 hari terakhir</option>
                  <option>30 hari terakhir</option>
                  <option>All Time</option>
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

            <div className="space-y-4">
              {[...incomes, ...expenses]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5) // Show only 5 latest transactions as in the image
                .map((trx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-3 text-lg">
                        {getTransactionIcon(trx.description)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {trx.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(trx.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold text-sm ${
                        trx.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {trx.type === "income" ? "+" : "-"}
                      {formatCurrency(trx.amount)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
