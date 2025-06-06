import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Plus,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Film,
  HeartPulse,
  Users,
  BookOpen,
  Banknote,
  Receipt,
  Wallet,
  CreditCard,
  PiggyBank,
  ArrowRightLeft,
  ChevronDown,
  CircleDollarSign,
  Briefcase,
  Gift,
  HandCoins,
  WalletMinimal, // More generic icon for pocket
  Tag, // More generic icon for category
} from "lucide-react";

// CATATAN PENTING UNTUK PENGGUNAAN FONT:
// Agar font 'Inter' atau 'Arial' diterapkan dengan benar:
// 1. Pastikan Anda mengimpor font 'Inter' di file HTML utama Anda (public/index.html)
//    atau di file CSS utama Anda (misalnya, index.css) menggunakan Google Fonts.
//    Contoh link di <head> public/index.html:
//    <link rel="preconnect" href="https://fonts.googleapis.com">
//    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
//
// 2. Konfigurasi Tailwind CSS Anda (file tailwind.config.js) untuk menggunakan font ini
//    sebagai font-sans default Anda:
//    module.exports = {
//      theme: {
//        extend: {
//          fontFamily: {
//            sans: ['Inter', 'Arial', 'sans-serif'], // 'Inter' sebagai prioritas pertama, 'Arial' sebagai fallback
//          },
//        },
//      },
//    };
//
// Setelah konfigurasi ini, class 'font-sans' yang sudah ada di kode akan secara otomatis
// menggunakan font 'Inter' atau 'Arial' yang Anda tentukan.

// DUMMY DATA TRANSAKSI
const DUMMY_TRANSACTIONS = [
  {
    id: "t1",
    date: "2025-05-31T10:30:00",
    description: "Makan di Afui",
    amount: 157000,
    type: "expense",
    category: "Food & Drink",
    source: "Makan Siang",
  },
  {
    id: "t2",
    date: "2025-05-31T09:00:00",
    description: "Nasi Padang",
    amount: 16000,
    type: "expense",
    category: "Food & Drink",
    source: "GoPay Saldo",
  },
  {
    id: "t3",
    date: "2025-05-31T08:00:00",
    description: "Nasi Padang",
    amount: 16000,
    type: "expense",
    category: "Food & Drink",
    source: "GoPay Saldo",
  },
  {
    id: "t4",
    date: "2025-05-31T12:00:00",
    description: "Nasi djsk online ke kantor",
    amount: 21000,
    type: "expense",
    category: "Transport",
    source: "Transportasi",
  },
  {
    id: "t5",
    date: "2025-05-31T15:00:00",
    description: "Paket data Telkomsel",
    amount: 100000,
    type: "expense",
    category: "Bills", // Added Bills category to dummy data for better breakdown
    source: "Bank BRI Saldo",
  },
  {
    id: "t6",
    date: "2025-05-20T10:00:00",
    description: "Gaji Freelance",
    amount: 5000000,
    type: "income",
    category: "Freelance",
    source: "Bank Jago",
  },
  {
    id: "t7",
    date: "2025-05-15T09:00:00",
    description: "Belanja Pakaian",
    amount: 300000,
    type: "expense",
    category: "Groceries",
    source: "Credit Card",
  },
  {
    id: "t8",
    date: "2025-04-01T08:00:00",
    description: "Gaji Utama",
    amount: 40000000,
    type: "income",
    category: "Gaji",
    source: "Bank Mandiri",
  },
  {
    id: "t9",
    date: "2025-04-20T14:00:00",
    description: "Bonus Kerja",
    amount: 5000000,
    type: "income",
    category: "Bonus",
    source: "Bank BCA",
  },
  {
    id: "t10",
    date: "2025-03-01T08:00:00",
    description: "Hadiah/Lain-lain",
    amount: 695700,
    type: "income",
    category: "Hadiah/Lain-lain",
    source: "Bank Mandiri",
  },
  {
    id: "t11",
    date: "2025-03-10T11:00:00",
    description: "Transportasi Umum",
    amount: 2600000,
    type: "expense",
    category: "Transport",
    source: "GoPay",
  },
  {
    id: "t12",
    date: "2025-02-01T08:00:00",
    description: "Belanja Groceries",
    amount: 12000000,
    type: "expense",
    category: "Groceries",
    source: "Bank Mandiri",
  },
  {
    id: "t13",
    date: "2025-02-05T19:00:00",
    description: "Food & Drink",
    amount: 15000000,
    type: "expense",
    category: "Food & Drink",
    source: "Credit Card",
  },
  {
    id: "t14",
    date: "2025-01-01T08:00:00",
    description: "Entertainment",
    amount: 5000000,
    type: "expense",
    category: "Entertainment",
    source: "Bank Mandiri",
  },
  {
    id: "t15",
    date: "2025-01-15T16:00:00",
    description: "Pendidikan Anak",
    amount: 8000000,
    type: "expense",
    category: "Education",
    source: "Bank BCA",
  },
  {
    id: "t16",
    date: "2025-01-20T16:00:00",
    description: "Kesehatan",
    amount: 1500000,
    type: "expense",
    category: "Health",
    source: "Bank BCA",
  },
  {
    id: "t17",
    date: "2025-01-25T16:00:00",
    description: "Cicilan Rumah",
    amount: 7000000,
    type: "expense",
    category: "Cicilan/Lain-lain",
    source: "Bank BCA",
  },
  {
    id: "t18",
    date: "2025-05-01T08:00:00",
    description: "Uang Jajan",
    amount: 100000,
    type: "income",
    category: "Uang Jajan",
    source: "Bank Mandiri",
  },
  {
    id: "t19",
    date: "2025-05-30T10:00:00",
    description: "Kursus Online",
    amount: 250000,
    type: "expense",
    category: "Education",
    source: "OVO",
  },
  {
    id: "t20",
    date: "2025-05-30T14:00:00",
    description: "Jasa Fotografi",
    amount: 1500000,
    type: "income",
    category: "Freelance",
    source: "Bank Jago",
  },
  {
    id: "t21",
    date: "2025-05-29T09:30:00",
    description: "Beli Kopi",
    amount: 35000,
    type: "expense",
    category: "Food & Drink",
    source: "Debit Card",
  },
  {
    id: "t22",
    date: "2025-05-29T11:00:00",
    description: "Tiket Bioskop",
    amount: 80000,
    type: "expense",
    category: "Entertainment",
    source: "Cash",
  },
  {
    id: "t23",
    date: "2025-05-28T16:00:00",
    description: "Belanja Bulanan",
    amount: 750000,
    type: "expense",
    category: "Groceries",
    source: "Credit Card",
  },
  {
    id: "t24",
    date: "2025-05-28T18:00:00",
    description: "Bayar Listrik",
    amount: 300000,
    type: "expense",
    category: "Bills",
    source: "LinkAja",
  },
  {
    id: "t25",
    date: "2025-05-27T08:00:00",
    description: "Bensin Mobil",
    amount: 100000,
    type: "expense",
    category: "Transport",
    source: "Cash",
  },
  {
    id: "t26",
    date: "2025-05-27T13:00:00",
    description: "Makan Siang Kantor",
    amount: 45000,
    type: "expense",
    category: "Food & Drink",
    source: "QRIS",
  },
];

// Helper to format currency
const formatCurrency = (amount) => {
  return `Rp${amount.toLocaleString("id-ID")},00`;
};

// Map categories to icons
const categoryIcons = {
  "Food & Drink": Utensils,
  Transport: Car,
  Groceries: ShoppingBag,
  Entertainment: Film,
  Education: BookOpen,
  Health: HeartPulse,
  Social: Users,
  "Cicilan/Lain-lain": Home,
  Bills: Receipt,
  default: Banknote, // Default icon for unknown categories
};

const incomeCategoryIcons = {
  Gaji: Banknote,
  Bonus: HandCoins,
  Freelance: Briefcase,
  "Uang Jajan": PiggyBank,
  "Hadiah/Lain-lain": Gift,
  default: CircleDollarSign, // Default icon for unknown income categories
};

const Transaction = () => {
  const [filterPeriod, setFilterPeriod] = useState("Last 6 month");
  const [transactions, setTransactions] = useState([]);
  const [cashFlowData, setCashFlowData] = useState({
    labels: [],
    incomes: [],
    expenses: [],
  });
  const [incomeBreakdown, setIncomeBreakdown] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);

  useEffect(() => {
    const processData = () => {
      let filtered = DUMMY_TRANSACTIONS;

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0, 0, 0, 0);

      filtered = filtered.filter((t) => new Date(t.date) >= sixMonthsAgo);

      setTransactions(
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
      );

      // Calculate Cash Flow data
      const monthlyData = {};
      const currentMonth = new Date().getMonth();
      const months = [];
      for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(currentMonth - (5 - i));
        months.push(d.toLocaleString("en-US", { month: "short" }));
      }

      months.forEach((month) => {
        monthlyData[month] = { income: 0, expense: 0 };
      });

      filtered.forEach((trx) => {
        const month = new Date(trx.date).toLocaleString("en-US", {
          month: "short",
        });
        if (monthlyData[month]) {
          if (trx.type === "income") {
            monthlyData[month].income += trx.amount;
          } else {
            monthlyData[month].expense += trx.amount;
          }
        }
      });

      setCashFlowData({
        labels: months,
        incomes: months.map((month) => monthlyData[month].income),
        expenses: months.map((month) => monthlyData[month].expense),
      });

      // Calculate Income breakdown
      const incomeCategories = {};
      let totalIncome = 0;
      filtered
        .filter((t) => t.type === "income")
        .forEach((t) => {
          incomeCategories[t.category] =
            (incomeCategories[t.category] || 0) + t.amount;
          totalIncome += t.amount;
        });
      setIncomeBreakdown(
        Object.entries(incomeCategories).map(([category, amount]) => ({
          category,
          amount,
          percentage: (amount / totalIncome) * 100,
        }))
      );
      setTotalIncomeAmount(totalIncome);

      // Calculate Expense breakdown
      const expenseCategories = {};
      let totalExpense = 0;
      filtered
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          expenseCategories[t.category] =
            (expenseCategories[t.category] || 0) + t.amount;
          totalExpense += t.amount;
        });
      setExpenseBreakdown(
        Object.entries(expenseCategories).map(([category, amount]) => ({
          category,
          amount,
          percentage: (amount / totalExpense) * 100,
        }))
      );
      setTotalExpenseAmount(totalExpense);
    };

    processData();
  }, [filterPeriod]);

  const renderLineChart = (labels, incomes, expenses) => {
    const allValues = [...incomes, ...expenses];
    const maxDataValue = Math.max(...allValues);
    const chartMaxY =
      maxDataValue > 0 ? Math.ceil(maxDataValue / 2500000) * 2500000 : 12500000;

    const yAxisLabels = [];
    for (let i = 0; i <= 5; i++) {
      yAxisLabels.push((chartMaxY / 5) * i);
    }
    yAxisLabels.reverse();

    const yPosition = (value) => {
      return 168 - (value / chartMaxY) * 128;
    };

    const points = (data) => {
      return labels
        .map((_, i) => {
          const x = 60 + i * 50;
          const y = yPosition(data[i]);
          return `${x},${y}`;
        })
        .join(" ");
    };

    const areaPoints = (data) => {
      const linePoints = points(data);
      const lastX = 60 + (labels.length - 1) * 50;
      const firstX = 60;
      return `${linePoints} ${lastX},${yPosition(0)} ${firstX},${yPosition(
        0
      )} Z`;
    };

    return (
      <div className="relative h-64 w-full">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="40"
              y1={40 + i * 32}
              x2="360"
              y2={40 + i * 32}
              stroke="#e5e7eb" // Slightly darker grid lines for better contrast
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {yAxisLabels.map((label, i) => (
            <text
              key={i}
              x="35"
              y={45 + i * 32}
              textAnchor="end"
              className="fill-gray-600 text-xs" // Darker gray for labels
            >
              {formatCurrency(label)
                .replace(",00", "")
                .replace("Rp", "")
                .replace(".000", "K") // Simplify for display
                .replace(".000.000", "JT")}
            </text>
          ))}

          {/* Income Area */}
          <path
            d={areaPoints(incomes)}
            fill="rgba(59, 130, 246, 0.15)" // Slightly more opaque blue for income area
          />
          {/* Income line */}
          <polyline
            fill="none"
            stroke="#2563eb" // Deeper blue
            strokeWidth="2.5" // Slightly thicker line
            points={points(incomes)}
          />

          {/* Expense Area */}
          <path
            d={areaPoints(expenses)}
            fill="rgba(239, 68, 68, 0.15)" // Slightly more opaque red for expense area
          />
          {/* Expense line */}
          <polyline
            fill="none"
            stroke="#dc2626" // Deeper red
            strokeWidth="2.5" // Slightly thicker line
            points={points(expenses)}
          />

          {/* Data points */}
          {labels.map((_, i) => (
            <g key={i}>
              <circle
                cx={60 + i * 50}
                cy={yPosition(incomes[i])}
                r="4" // Slightly larger points
                fill="#2563eb" // Deeper blue
                stroke="white"
                strokeWidth="1.5"
              />
              <circle
                cx={60 + i * 50}
                cy={yPosition(expenses[i])}
                r="4" // Slightly larger points
                fill="#dc2626" // Deeper red
                stroke="white"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* X-axis labels */}
          {labels.map((label, i) => (
            <text
              key={i}
              x={60 + i * 50}
              y="190"
              textAnchor="middle"
              className="fill-gray-600 text-xs font-medium" // Darker gray, medium font weight
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  const renderDoughnutChart = (data, colors) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    if (total === 0) {
      return (
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center text-gray-400">
          No data
        </div>
      );
    }

    let cumulativeAngle = 0;
    const radius = 60;
    const innerRadius = 30;
    const centerX = 80;
    const centerY = 80;

    return (
      <div className="relative w-40 h-40 mx-auto">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full transform -rotate-90"
        >
          {data.map((item, index) => {
            const percentage = item.amount / total;
            const angle = percentage * 360;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX + innerRadius * Math.cos(startAngleRad)} ${
                centerY + innerRadius * Math.sin(startAngleRad)
              }`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `L ${centerX + innerRadius * Math.cos(endAngleRad)} ${
                centerY + innerRadius * Math.sin(endAngleRad)
              }`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${
                centerX + innerRadius * Math.cos(startAngleRad)
              } ${centerY + innerRadius * Math.sin(startAngleRad)}`,
              "Z",
            ].join(" ");

            cumulativeAngle += angle;

            return (
              <path
                key={item.category}
                d={pathData}
                fill={colors[index % colors.length]}
                className="transition-all duration-300 hover:scale-105" // Subtle hover effect
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dateKey;
    if (transactionDate.toDateString() === today.toDateString()) {
      dateKey = "Today";
    } else {
      dateKey = transactionDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {});

  const incomeColors = [
    "#3b82f6",
    "#ef4444",
    "#eab308",
    "#22c55e",
    "#a855f7",
    "#f97316",
  ];
  const expenseColors = [
    "#0ea5e9",
    "#f43f5e",
    "#84cc16",
    "#6366f1",
    "#f97316",
    "#ef4444",
    "#d946ef",
    "#ec4899",
    "#6b7280",
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white px-8 py-4 shadow-lg border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-900 mr-2">
            Transactions
          </h1>
          <p className="text-gray-600 text-sm">Welcome back, Ahsan Nafis!</p>
        </div>
        <div className="flex items-center space-x-5">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg shadow-inner border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-base font-semibold text-gray-900">
                Ahsan Nafis'alimi
              </div>
              <div className="text-xs text-gray-600">ahsannafis@gmail.com</div>
            </div>
            <ChevronDown size={18} className="text-gray-500" />
          </div>
        </div>
      </header>
      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Cash Flow</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600 font-medium">
                  <div className="flex items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 mr-2"></div>
                    <span>Income</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-600 mr-2"></div>
                    <span>Expense</span>
                  </div>
                </div>
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                  >
                    <option>Last 6 month</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex space-x-6 text-sm text-gray-600 border-b border-gray-200 pb-2 mb-4">
                <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-2 -mb-2">
                  All
                </button>
                <button className="hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-2 -mb-2 transition-colors duration-200">
                  Incomes
                </button>
                <button className="hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-2 -mb-2 transition-colors duration-200">
                  Expenses
                </button>
              </div>
            </div>
            {cashFlowData.labels &&
              renderLineChart(
                cashFlowData.labels,
                cashFlowData.incomes,
                cashFlowData.expenses
              )}
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Income</h2>
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer">
                  <option>Last 6 month</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-6">
              {formatCurrency(totalIncomeAmount)}
            </div>
            <div className="mb-6 flex justify-center">
              {renderDoughnutChart(incomeBreakdown, incomeColors)}
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {incomeBreakdown.map((item, index) => {
                const Icon =
                  incomeCategoryIcons[item.category] ||
                  incomeCategoryIcons.default;
                return (
                  <div key={item.category} className="flex items-center group">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-200"
                      style={{
                        backgroundColor: `${
                          incomeColors[index % incomeColors.length]
                        }1A`,
                      }}
                    >
                      <Icon
                        size={18}
                        className="transition-transform duration-200 group-hover:scale-110"
                        style={{
                          color: incomeColors[index % incomeColors.length],
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-800 font-medium">
                        {item.category}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(item.amount)} (
                        {item.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer">
                    <option>7 hari terakhir</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
                <div className="relative">
                  <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer">
                    <option>Pocket</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
                <div className="relative">
                  <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer">
                    <option>Kategori</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex-grow overflow-y-auto pr-2 custom-scrollbar"
              style={{ maxHeight: "500px" }}
            >
              <div className="space-y-6">
                {Object.entries(groupedTransactions).map(
                  ([dateKey, transactionsInDay]) => (
                    <div
                      key={dateKey}
                      className="pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">
                          {dateKey}
                        </h3>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(
                            transactionsInDay.reduce(
                              (sum, t) =>
                                sum +
                                (t.type === "income" ? t.amount : -t.amount),
                              0
                            )
                          )}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {transactionsInDay.map((trx) => {
                          const IconComponent =
                            trx.type === "income"
                              ? incomeCategoryIcons[trx.category] ||
                                incomeCategoryIcons.default
                              : categoryIcons[trx.category] ||
                                categoryIcons.default;
                          return (
                            <div
                              key={trx.id}
                              className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                  style={{
                                    backgroundColor:
                                      trx.type === "income"
                                        ? "#dbeafe"
                                        : "#fee2e2",
                                  }}
                                >
                                  <IconComponent
                                    size={20}
                                    className={
                                      trx.type === "income"
                                        ? "text-blue-600"
                                        : "text-red-600"
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 text-base">
                                    {trx.description}
                                  </div>
                                  <div className="text-xs text-gray-500 flex items-center">
                                    {trx.source.includes("GoPay") && (
                                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1 flex-shrink-0"></div>
                                    )}
                                    {trx.source}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-bold text-base ${
                                    trx.type === "income"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {trx.type === "income" ? "+" : "-"}
                                  {formatCurrency(trx.amount)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Expenses</h2>
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer">
                  <option>Last 6 month</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-6">
              {formatCurrency(totalExpenseAmount)}
            </div>
            <div className="mb-6 flex justify-center">
              {renderDoughnutChart(expenseBreakdown, expenseColors)}
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {expenseBreakdown.map((item, index) => {
                const Icon =
                  categoryIcons[item.category] || categoryIcons.default;
                return (
                  <div key={item.category} className="flex items-center group">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-200"
                      style={{
                        backgroundColor: `${
                          expenseColors[index % expenseColors.length]
                        }1A`,
                      }}
                    >
                      <Icon
                        size={18}
                        className="transition-transform duration-200 group-hover:scale-110"
                        style={{
                          color: expenseColors[index % expenseColors.length],
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-800 font-medium">
                        {item.category}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(item.amount)} (
                        {item.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transaction;
