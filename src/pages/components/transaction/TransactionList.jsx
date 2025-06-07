// src/pages/components/transaction/TransactionList.jsx

import React, { useState } from "react";
import { getTransactionIcon, formatCurrency } from "./utils";
import TransactionModal from "./TransactionModal";

const TransactionList = ({
  allTransactions,
  accounts,
  getAccountName,
  onTransactionAdded,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("all_time");
  const [selectedPocket, setSelectedPocket] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pocketsList = accounts;

  // DAFTAR KATEGORI EXPENSE YANG LEBIH BANYAK (Didefinisikan secara statis di sini)
  const predefinedExpenseCategories = [
    "Makanan & Minuman",
    "Transportasi",
    "Belanja",
    "Hiburan",
    "Tagihan (Listrik, Air, Internet)",
    "Pendidikan",
    "Kesehatan",
    "Rumah Tangga (Sewa, Perbaikan)",
    "Pakaian & Aksesoris",
    "Perawatan Diri",
    "Hadiah & Donasi",
    "Cicilan & Pinjaman",
    "Asuransi",
    "Investasi",
    "Pajak",
    "Liburan & Perjalanan",
    "Olahraga & Hobi",
    "Peliharaan",
    "Lain-lain",
  ];

  // Dapatkan daftar kategori unik dari data expenses yang ada (untuk filter)
  const dynamicCategoriesFromTransactions = [
    ...new Set(
      allTransactions
        .filter((trx) => trx.type === "Pengeluaran" && trx.category)
        .map((trx) => trx.category)
    ),
  ];

  // Gabungkan predefined categories dengan yang dari transaksi (pastikan unik dan urutkan)
  const categoriesList = [
    ...new Set([
      ...predefinedExpenseCategories,
      ...dynamicCategoriesFromTransactions,
    ]),
  ];
  categoriesList.sort();

  // DAFTAR SUMBER PEMASUKAN YANG LEBIH BANYAK (Didefinisikan secara statis di sini)
  const predefinedIncomeSources = [
    "Gaji Pokok",
    "Bonus",
    "Pekerjaan Sampingan",
    "Investasi",
    "Dividen",
    "Hadiah",
    "Pengembalian Dana",
    "Penjualan Aset",
    "Bunga Bank",
    "Sewa Properti",
    "Pensiun",
    "Lain-lain",
  ];

  // Dapatkan daftar sumber unik dari data incomes yang ada (untuk filter)
  const dynamicSourcesFromTransactions = [
    ...new Set(
      allTransactions
        .filter((trx) => trx.type === "Pemasukan" && trx.source)
        .map((trx) => trx.source)
    ),
  ];

  // Gabungkan predefined sources dengan yang dari transaksi (pastikan unik dan urutkan)
  const sourcesList = [
    ...new Set([...predefinedIncomeSources, ...dynamicSourcesFromTransactions]),
  ];
  sourcesList.sort();

  // Logika filter
  const filteredTransactions = allTransactions.filter((trx) => {
    const transactionDate = new Date(trx.date);
    const now = new Date();
    let isDateMatch = true;
    let isPocketMatch = true;
    let isCategoryMatch = true; // Akan digunakan untuk expense
    let isSourceMatch = true; // Akan digunakan untuk income

    // Filter berdasarkan rentang waktu
    if (selectedTimeRange === "7_days") {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      transactionDate.setHours(0, 0, 0, 0);
      isDateMatch = transactionDate >= sevenDaysAgo && transactionDate <= now;
    } else if (selectedTimeRange === "30_days") {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      transactionDate.setHours(0, 0, 0, 0);
      isDateMatch = transactionDate >= thirtyDaysAgo && transactionDate <= now;
    } else if (selectedTimeRange === "current_month") {
      isDateMatch =
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear();
    } else if (selectedTimeRange === "all_time") {
      isDateMatch = true;
    }

    // Filter berdasarkan pocket
    if (selectedPocket !== "all") {
      isPocketMatch = trx.accountId && trx.accountId === selectedPocket;
    }

    // Filter berdasarkan kategori (hanya berlaku untuk expense)
    if (selectedCategory !== "all") {
      if (trx.type === "Pengeluaran") {
        isCategoryMatch =
          trx.category &&
          trx.category.toLowerCase() === selectedCategory.toLowerCase();
      } else {
        isCategoryMatch = true; // Pemasukan dan Transfer tidak difilter berdasarkan kategori
      }
    }

    // Filter berdasarkan sumber (hanya berlaku untuk income)
    if (selectedCategory !== "all" && trx.type === "Pemasukan") {
      // Menggunakan selectedCategory untuk filter sumber di sini bisa membingungkan,
      // lebih baik membuat state filter baru untuk sumber jika Anda ingin memfilter sumber secara terpisah.
      // Namun, jika maksudnya adalah filter "kategori" di UI digunakan untuk kategori DAN sumber,
      // maka logikanya perlu diperluas di sini.
      // Untuk saat ini, kita akan mengasumsikan filter "kategori" hanya untuk expense,
      // dan Anda mungkin ingin menambahkan filter sumber terpisah nanti.
      // Contoh: isSourceMatch = trx.source && trx.source.toLowerCase() === selectedSource.toLowerCase();
      isSourceMatch = true; // Biarkan ini true agar filter kategori tidak memengaruhi pemasukan
    }

    return isDateMatch && isPocketMatch && isCategoryMatch && isSourceMatch;
  });

  // Kelompokkan transaksi yang sudah difilter berdasarkan tanggal
  const groupedTransactions = filteredTransactions.reduce((acc, trx) => {
    const date = new Date(trx.date);
    const dateString = date.toLocaleDateString("id-ID", {
      weekday: "long",
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
    <section className="bg-white rounded-2xl shadow-sm p-6 col-span-1">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
        {/* Tombol Tambah Transaksi */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          Tambah Transaksi
        </button>

        <div className="flex flex-row flex-wrap gap-2 w-full mt-2 sm:mt-0 sm:w-auto">
          {/* Filter Tanggal */}
          <div className="relative flex-1 min-w-[120px] sm:min-w-0">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-7 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="7_days">7 hari terakhir</option>
              <option value="30_days">30 hari terakhir</option>
              <option value="current_month">Bulan ini</option>
              <option value="all_time">Semua Waktu</option>
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
              <option value="all">Semua Pocket</option>
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
          {/* Filter Kategori (Ini masih hanya untuk expense) */}
          <div className="relative flex-1 min-w-[120px] sm:min-w-0">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-7 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {/* Ini akan menampilkan daftar kategori gabungan untuk expense dan income */}
              {/* Jika Anda ingin filter terpisah untuk income dan expense, Anda perlu state filter baru */}
              {categoriesList.map((category) => (
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
              <div className="space-y-3">
                {transactions.map((transaction, idx) => (
                  <div
                    key={transaction.id || idx}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg mr-4 flex-shrink-0">
                      {getTransactionIcon(
                        transaction.description,
                        transaction.source ? "income" : "expense"
                      )}{" "}
                    </div>
                    <div className="flex-grow flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {transaction.type === "Pemasukan"
                            ? transaction.source
                            : transaction.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-semibold text-sm"
                          style={{
                            color:
                              transaction.type === "Pemasukan"
                                ? "#10b981"
                                : "#ef4444",
                          }}
                        >
                          {transaction.type === "Pemasukan" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {getAccountName(transaction.accountId)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
      {/* Modal Tambah Transaksi */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={onTransactionAdded}
        accounts={accounts}
        categoriesList={categoriesList}
        sourcesList={sourcesList} // Meneruskan daftar sumber yang sudah diperkaya
      />
    </section>
  );
};

export default TransactionList;
