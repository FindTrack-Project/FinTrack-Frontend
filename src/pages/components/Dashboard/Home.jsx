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
} from "lucide-react";
import Api from "../../../config/apiConfig";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const DUMMY_EXPENSES = [
  { id: 1, amount: 50000, date: "2025-06-01", description: "Makan siang", category: "Food & Drink" },
  { id: 2, amount: 100000, date: "2025-06-02", description: "Transportasi", category: "Transport" },
  { id: 3, amount: 75000, date: "2025-06-03", description: "Groceries", category: "Groceries" },
  { id: 4, amount: 30000, date: "2025-06-04", description: "Tagihan Listrik", category: "Tagihan" },
  { id: 5, amount: 20000, date: "2025-06-05", description: "Nonton Bioskop", category: "Entertainment" },
  { id: 6, amount: 40000, date: "2025-06-06", description: "Obat", category: "Health" },
  { id: 7, amount: 25000, date: "2025-06-07", description: "Sosial", category: "Social" },
  { id: 8, amount: 60000, date: "2025-06-08", description: "Buku", category: "Education" },
  { id: 9, amount: 90000, date: "2025-06-09", description: "Cicilan Motor", category: "Cicilan/Lain-lain" },
];

const PIE_COLORS = [
  "#62C1A3", "#449E7B", "#FF6384", "#36A2EB", "#FFCE56", "#A259FF", "#F67228", "#F67272", "#F6D728"
];

const Home = ({ isSidebarCollapsed }) => {
  const [balance, setBalance] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [balRes, incRes, expRes] = await Promise.all([
          Api.get("/users/balance"),
          Api.get("/incomes"),
          Api.get("/expenses"),
        ]);
        setBalance(balRes.data.currentBalance);
        setIncomes(incRes.data.incomes || []);
        setExpenses(
          (expRes.data.expenses && expRes.data.expenses.length > 0)
            ? expRes.data.expenses
            : DUMMY_EXPENSES
        );
      } catch {
        setExpenses(DUMMY_EXPENSES);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const monthlyIncomes = incomes.filter((inc) => {
    const d = new Date(inc.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthlyExpenses = expenses.filter((exp) => {
    const d = new Date(exp.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const totalIncome = monthlyIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Ambil 5 transaksi terbaru
  const recentTransactions = [
    ...incomes.map((i) => ({ ...i, type: "income" })),
    ...expenses.map((e) => ({ ...e, type: "expense" })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Group pengeluaran berdasarkan kategori
  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: PIE_COLORS,
        borderWidth: 1,
      },
    ],
  };

  const infoCardsGridClass = isSidebarCollapsed
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative bg-white rounded-full p-2 shadow hover:bg-gray-100">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
              <User size={24} />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className={`grid ${infoCardsGridClass} gap-4 md:gap-6 mb-6`}>
          {/* Saldo */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow flex items-center">
            <div className="p-3 bg-[var(--color-accent)]/20 rounded-full mr-4 flex-shrink-0">
              <Wallet size={28} className="text-accent" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-1">
                Total Balance
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-accent">
                {loading || balance === null
                  ? "..."
                  : `Rp${balance.toLocaleString("id-ID")}`}
              </p>
              <p className="text-xs text-gray-400">
                Per {new Date().toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
          {/* Income */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4 flex-shrink-0">
              <DollarSign size={28} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-1">
                Income (This Month)
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-green-500">
                {loading
                  ? "..."
                  : `Rp${totalIncome.toLocaleString("id-ID")}`}
              </p>
              <p className="text-xs text-gray-400">
                {monthlyIncomes.length} transaksi
              </p>
            </div>
          </div>
          {/* Expense */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow flex items-center">
            <div className="p-3 bg-red-100 rounded-full mr-4 flex-shrink-0">
              <TrendingUp size={28} className="text-red-600 rotate-180" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-1">
                Expense (This Month)
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-red-500">
                {loading
                  ? "..."
                  : `Rp${totalExpense.toLocaleString("id-ID")}`}
              </p>
              <p className="text-xs text-gray-400">
                {monthlyExpenses.length} transaksi
              </p>
            </div>
          </div>
        </div>

        {/* Grid Transaksi Terbaru & Pie Chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Transaksi Terbaru (2/3) */}
          <div className="md:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
                <ArrowRightLeft size={18} className="mr-2 text-accent" />
                Transactions
              </h2>
              {/* Filter bisa ditambahkan di sini */}
            </div>
            <ul className="space-y-2 flex-1">
              {recentTransactions.length === 0 ? (
                <li className="text-gray-400">Belum ada transaksi.</li>
              ) : (
                recentTransactions.map((trx) => (
                  <li
                    key={trx.id}
                    className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-medium text-gray-800 truncate">
                        {trx.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(trx.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <p
                      className={`font-semibold ${
                        trx.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      } text-right flex-shrink-0`}
                    >
                      {trx.type === "income" ? "+" : "-"}Rp{" "}
                      {Math.abs(trx.amount).toLocaleString("id-ID")}
                    </p>
                  </li>
                ))
              )}
            </ul>
            <div className="flex justify-end mt-2">
              <Link
                to="/expense"
                className="bg-accent text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-accent/80 transition text-sm"
              >
                Lihat Semua Pengeluaran
              </Link>
              <Link
                to="/income"
                className="ml-2 bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600 transition text-sm"
              >
                Lihat Semua Pemasukan
              </Link>
            </div>
          </div>
          {/* Pie Chart (1/3) */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Expenses
              </h2>
              {/* Filter waktu bisa ditambahkan di sini */}
            </div>
            {Object.keys(expenseByCategory).length === 0 ? (
              <p className="text-gray-400">Belum ada data pengeluaran.</p>
            ) : (
              <Pie data={pieData} />
            )}
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {Object.keys(expenseByCategory).map((cat, idx) => (
                <div key={cat} className="flex items-center text-xs">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  ></span>
                  <span className="text-gray-700">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Tambah Transaksi */}
        <div className="bg-accent p-4 md:p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-2 md:mb-0 min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-1">
              Siap untuk Mencatat Transaksi Baru?
            </h2>
            <p className="text-gray-100 text-xs md:text-sm">
              Catat pemasukan atau pengeluaran Anda dengan cepat.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Link
              to="/income"
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
            >
              <PlusCircle size={18} className="mr-2" />
              Tambah Pemasukan
            </Link>
            <Link
              to="/expense"
              className="flex items-center bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
            >
              <PlusCircle size={18} className="mr-2" />
              Tambah Pengeluaran
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
