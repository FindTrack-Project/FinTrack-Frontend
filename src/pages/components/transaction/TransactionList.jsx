import React, { useState } from "react";
import { 
  getTransactionIcon, 
  formatCurrency 
} from "./utils"; 
import TransactionModal from "./TransactionModal";
import { PlusCircle, AlertTriangle } from 'lucide-react';

const POCKET_ICON_COLORS = ["#facc15", "#38bdf8", "#4ade80", "#f87171", "#a78bfa", "#fb923c"];

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
  const predefinedExpenseCategories = [ "Makanan & Minuman", "Transportasi", "Belanja", "Hiburan", "Tagihan (Listrik, Air, Internet)", "Pendidikan", "Kesehatan", "Rumah Tangga (Sewa, Perbaikan)", "Pakaian & Aksesoris", "Perawatan Diri", "Hadiah & Donasi", "Cicilan & Pinjaman", "Asuransi", "Investasi", "Pajak", "Liburan & Perjalanan", "Olahraga & Hobi", "Peliharaan", "Lain-lain" ];
  const dynamicCategoriesFromTransactions = [ ...new Set( allTransactions.filter((trx) => trx.type === "Pengeluaran" && trx.category).map((trx) => trx.category) ), ];
  const categoriesList = [ ...new Set([ ...predefinedExpenseCategories, ...dynamicCategoriesFromTransactions, ]), ];
  categoriesList.sort();

  const predefinedIncomeSources = [ "Gaji Pokok", "Bonus", "Pekerjaan Sampingan", "Investasi", "Dividen", "Hadiah", "Pengembalian Dana", "Penjualan Aset", "Bunga Bank", "Sewa Properti", "Pensiun", "Lain-lain", ];
  const dynamicSourcesFromTransactions = [ ...new Set( allTransactions.filter((trx) => trx.type === "Pemasukan" && trx.source).map((trx) => trx.source) ), ];
  const sourcesList = [ ...new Set([...predefinedIncomeSources, ...dynamicSourcesFromTransactions]), ];
  sourcesList.sort();
  
  const allCategoriesAndSources = [...new Set([...categoriesList, ...sourcesList])].sort();

  const filteredTransactions = allTransactions.filter((trx) => {
    const transactionDate = new Date(trx.date);
    const now = new Date();
    const isDateMatch = () => {
      if (selectedTimeRange === "all_time") return true;
      let startDate;
      if (selectedTimeRange === "7_days") {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
      } else if (selectedTimeRange === "30_days") {
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
      } else if (selectedTimeRange === "current_month") {
        return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
      }
      return transactionDate >= startDate;
    };
    const isPocketMatch = selectedPocket === 'all' || trx.accountId === selectedPocket;
    const isCategoryMatch = () => {
      if (selectedCategory === 'all') return true;
      if (trx.type === 'Pengeluaran') return trx.category === selectedCategory;
      if (trx.type === 'Pemasukan') return trx.source === selectedCategory;
      return true;
    };
    return isDateMatch() && isPocketMatch && isCategoryMatch();
  });

  const groupedTransactions = filteredTransactions.reduce((acc, trx) => {
    const dateKey = new Date(trx.date).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(trx);
    return acc;
  }, {});
  
  const sortedGroupedTransactions = Object.entries(groupedTransactions).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 col-span-1 lg:col-span-3 h-130 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center sm:w-auto w-full gap-2 cursor-pointer"
        >
          <PlusCircle size={16} /> Tambah Transaksi
        </button>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        {/* Filter Waktu */}
        <div className="relative w-full sm:w-auto">
          <select
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full cursor-pointer"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="all_time">Semua Waktu</option>
            <option value="current_month">Bulan Ini</option>
            <option value="30_days">30 Hari Terakhir</option>
            <option value="7_days">7 Hari Terakhir</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
        {/* Filter Pocket */}
        <div className="relative w-full sm:w-auto">
          <select
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full cursor-pointer"
            value={selectedPocket}
            onChange={(e) => setSelectedPocket(e.target.value)}
          >
            <option value="all">Pocket</option>
            {pocketsList.map((pocket) => (
              <option key={pocket.id} value={pocket.id}>{pocket.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
        {/* Filter Kategori */}
        <div className="relative w-full sm:w-auto">
          <select
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Kategori</option>
            {allCategoriesAndSources.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
      </div>

      <div className="flex-grow space-y-2 max-h-[30rem] overflow-y-auto -mr-2 pr-2 custom-scrollbar">
        {sortedGroupedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 text-gray-500">
            <AlertTriangle size={40} className="mb-2 text-gray-400"/>
            <p className="font-semibold">Tidak Ada Transaksi</p>
            <p className="text-sm">Data tidak ditemukan untuk filter yang dipilih.</p>
          </div>
        ) : (
          sortedGroupedTransactions.map(([dateKey, transactions]) => {
            const dailyTotal = transactions.reduce((sum, trx) => sum + (trx.type === "Pemasukan" ? trx.amount : -trx.amount), 0);
            const formattedDate = new Date(dateKey).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long' });

            // Mengurutkan transaksi di dalam hari dari yang terbaru ke terlama
            const sortedDailyTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

            return (
              <div key={dateKey}>
                <div className="flex justify-between items-center my-3">
                    <h3 className="text-sm font-semibold text-gray-800">{formattedDate}</h3>
                    <p className="text-sm font-semibold text-gray-800">{formatCurrency(dailyTotal)}</p>
                </div>
                <div className="space-y-1">
                  {sortedDailyTransactions.map((trx) => { // Gunakan sortedDailyTransactions di sini
                    const isIncome = trx.type === "Pemasukan";
                    const Icon = getTransactionIcon(trx.category || trx.source, isIncome ? 'income' : 'expense');
                    const accountIndex = accounts.findIndex(acc => acc.id === trx.accountId);

                    return (
                      <div key={trx.id} className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-blue-100 text-blue-500">
                          <Icon size={20} />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-gray-800 text-sm">{trx.description}</p>
                          <p className="text-xs text-gray-500">{trx.category || trx.source}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className={`font-semibold text-sm ${isIncome ? 'text-green-600' : 'text-gray-700'}`}>
                            {isIncome ? '' : '-'} {formatCurrency(trx.amount)}
                          </p>
                          <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            <p className="text-xs text-gray-500">{getAccountName(trx.accountId)}</p>
                            <span className="w-2 h-2 rounded-full" style={{backgroundColor: POCKET_ICON_COLORS[accountIndex % POCKET_ICON_COLORS.length]}}></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
      
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={() => {
          setIsModalOpen(false);
          onTransactionAdded(); 
        }}
        accounts={accounts}
        categoriesList={categoriesList}
        sourcesList={sourcesList}
      />
    </section>
  );
};

export default TransactionList;