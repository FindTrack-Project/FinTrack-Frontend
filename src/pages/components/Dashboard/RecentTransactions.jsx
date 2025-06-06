import React, { useState, useEffect } from "react";
import { getTransactionIcon } from "./utils";
import Api from "../../../config/apiConfig"; // Asumsi path ini benar

const RecentTransactions = ({ incomes, expenses, formatCurrency }) => {
  // State untuk filter
  const [selectedTimeRange, setSelectedTimeRange] = useState("7_days");
  const [selectedPocket, setSelectedPocket] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // State untuk data dropdown (hanya pockets dari API)
  const [pocketsList, setPocketsList] = useState([]);

  useEffect(() => {
    const fetchPockets = async () => {
      try {
        // Hanya mengambil data pockets dari API
        const pocketsResponse = await Api.get("/accounts");
        setPocketsList(pocketsResponse.accounts || []);
      } catch (error) {
        console.error("Error fetching pockets:", error);
      }
    };
    fetchPockets();
  }, []); // Hanya dijalankan sekali saat komponen di-mount

  // Gabungkan semua transaksi dan urutkan berdasarkan tanggal terbaru
  const combinedTransactions = incomes
    .concat(expenses)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // --- PERUBAHAN UTAMA: Buat daftar kategori unik dari transaksi yang ada ---
  const uniqueCategories = [
    ...new Set(combinedTransactions.map((trx) => trx.category).filter(Boolean)),
  ].sort(); // filter(Boolean) untuk menghapus nilai null/undefined/kosong & .sort() untuk urutan alfabetis

  // Logika filter
  const filteredTransactions = combinedTransactions.filter((trx) => {
    const transactionDate = new Date(trx.date);
    const now = new Date();
    let isDateMatch = true;
    let isPocketMatch = true;
    let isCategoryMatch = true;

    // Filter berdasarkan rentang waktu
    if (selectedTimeRange === "7_days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      isDateMatch = transactionDate >= sevenDaysAgo;
    } else if (selectedTimeRange === "30_days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      isDateMatch = transactionDate >= thirtyDaysAgo;
    }

    // Filter berdasarkan pocket
    if (selectedPocket !== "all") {
      isPocketMatch = trx.accountId === selectedPocket;
    }

    // Filter berdasarkan kategori
    if (selectedCategory !== "all") {
      isCategoryMatch =
        trx.category &&
        trx.category.toLowerCase() === selectedCategory.toLowerCase();
    }

    return isDateMatch && isPocketMatch && isCategoryMatch;
  });

  // Kelompokkan transaksi yang sudah difilter berdasarkan tanggal
  const groupedTransactions = filteredTransactions.reduce((acc, trx) => {
    const date = new Date(trx.date);
    const dateString = date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(trx);
    return acc;
  }, {});

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
        <div className="flex flex-row flex-wrap gap-2">
          {/* Filter Waktu */}
          <div className="relative flex-1 min-w-[120px] sm:min-w-0">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-7 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="all">Waktu</option>
              <option value="7_days">7 hari terakhir</option>
              <option value="30_days">30 hari terakhir</option>
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
          {/* Filter Pocket */}
          <div className="relative flex-1 min-w-[120px] sm:min-w-0">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-7 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              value={selectedPocket}
              onChange={(e) => setSelectedPocket(e.target.value)}
            >
              <option value="all">Pocket</option>
              {pocketsList.map((pocket) => (
                <option key={pocket.id} value={pocket.id}>
                  {pocket.name}
                </option>
              ))}
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
          {/* Filter Kategori */}
          <div className="relative flex-1 min-w-[120px] sm:min-w-0">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-7 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Kategori</option>
              {/* --- PERUBAHAN: Gunakan uniqueCategories yang sudah dibuat --- */}
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            Tidak ada transaksi untuk filter yang dipilih.
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-800 mb-2 mt-4 first:mt-0">
                {date}
              </h3>
              {transactions.map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors mb-2"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mr-3 flex-shrink-0">
                      {getTransactionIcon(
                        trx.description,
                        trx.source ? "income" : "expense"
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {trx.description}
                      </p>
                      {trx.category && (
                        <p className="text-xs text-gray-500">{trx.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <p
                      className={`font-semibold text-sm ${
                        trx.source ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trx.source ? "+" : "-"}
                      {formatCurrency(trx.amount)}
                    </p>
                    {trx.accountName && (
                      <p className="text-xs text-gray-500">{trx.accountName}</p>
                    )}
                    {trx.source && !trx.accountName && (
                      <p className="text-xs text-gray-500">{trx.source}</p>
                    )}
                    {trx.destination && !trx.accountName && (
                      <p className="text-xs text-gray-500">{trx.destination}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default RecentTransactions;
