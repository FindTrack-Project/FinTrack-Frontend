import React, { useState } from "react";
// Api tidak lagi dibutuhkan di sini
import {
  getTransactionIcon,
  formatCurrency
} from "./utils";
import { AlertTriangle } from 'lucide-react'; // PlusCircle juga tidak dibutuhkan jika tidak ada tombol tambah

const POCKET_ICON_COLORS = ["#facc15", "#38bdf8", "#4ade80", "#f87171", "#a78bfa", "#fb923c"];

// --- PERUBAHAN UTAMA: Menerima 'accounts' sebagai props ---
const RecentTransactions = ({
  incomes,
  expenses,
  accounts,
}) => {
  // useEffect dan useState untuk 'accounts' telah dihapus untuk optimisasi
  const [selectedTimeRange, setSelectedTimeRange] = useState("7_days");
  const [selectedPocket, setSelectedPocket] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // isModalOpen juga tidak dibutuhkan jika tidak ada tombol tambah
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const getAccountName = (accountId) => {
    // Fungsi ini sekarang menggunakan 'accounts' dari props
    const account = accounts.find((acc) => acc.id === accountId);
    return account ? account.name : "N/A";
  };

  const allTransactions = [
    ...incomes.map(i => ({ ...i, type: 'Pemasukan' })),
    ...expenses.map(e => ({ ...e, type: 'Pengeluaran' }))
  ];

  const allCategoriesAndSources = [...new Set(
    allTransactions.map(trx => trx.category || trx.source).filter(Boolean)
  )].sort();

  const filteredTransactions = allTransactions.filter((trx) => {
    const transactionDate = new Date(trx.date);
    const now = new Date();
    const isDateMatch = () => {
      if (selectedTimeRange === "all") return true;
      let startDate;
      if (selectedTimeRange === "7_days") {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
      } else if (selectedTimeRange === "30_days") {
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
      } else if (selectedTimeRange === "current_month") { // Tambahkan filter bulan ini
          return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
      }
      return transactionDate.setHours(0,0,0,0) >= startDate.setHours(0,0,0,0);
    };
    const isPocketMatch = selectedPocket === 'all' || trx.accountId === selectedPocket;
    const isCategoryMatch = () => {
      if (selectedCategory === 'all') return true;
      return (trx.category === selectedCategory) || (trx.source === selectedCategory);
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
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm h-100 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
        {/* Tombol "Tambah Transaksi" telah dihapus sesuai permintaan */}
      </div>

      <div className="flex flex-row flex-wrap gap-3 mb-6">
        <div className="relative">
          <select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)} className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option value="7_days">7 Hari Terakhir</option>
            <option value="30_days">30 Hari Terakhir</option>
            <option value="current_month">Bulan Ini</option> {/* Tambahkan opsi Bulan Ini */}
            <option value="all">Semua Waktu</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
        <div className="relative">
          <select value={selectedPocket} onChange={(e) => setSelectedPocket(e.target.value)} className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option value="all">Pocket</option>
            {accounts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
        <div className="relative">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option value="all">Kategori</option>
            {allCategoriesAndSources.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
      </div>

      <div className="flex-grow space-y-2 max-h-[26rem] overflow-y-auto -mr-2 pr-2 custom-scrollbar">
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

            // PERBAIKAN PENTING: Urutkan transaksi di dalam hari dari yang terbaru ke terlama
            const sortedDailyTransactions = [...transactions].sort((a, b) => {
                const dateA = new Date(a.date); // Menggunakan objek Date dari properti 'date' transaksi
                const dateB = new Date(b.date); // Menggunakan objek Date dari properti 'date' transaksi
                return dateB.getTime() - dateA.getTime(); // Urutkan secara descending berdasarkan timestamp
            });

            return (
              <div key={dateKey}>
                <div className="flex justify-between items-center my-3">
                  <h3 className="text-sm font-semibold text-gray-800">{formattedDate}</h3>
                  <p className="text-sm font-semibold text-gray-800">{formatCurrency(dailyTotal)}</p>
                </div>
                <div className="space-y-1">
                  {sortedDailyTransactions.map((trx) => { // Menggunakan sortedDailyTransactions
                    const isIncome = trx.type === "Pemasukan";
                    const Icon = getTransactionIcon(trx.category || trx.source, isIncome ? 'income' : 'expense');
                    const accountIndex = accounts.findIndex(acc => acc.id === trx.accountId);

                    // Menyesuaikan warna ikon background dan teks
                    const iconBgColor = isIncome ? 'bg-green-100' : 'bg-red-100';
                    const iconTextColor = isIncome ? 'text-green-500' : 'text-red-500';

                    return (
                      <div key={trx.id} className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${iconBgColor} ${iconTextColor}`}>
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
                            {/* Pastikan accountIndex valid sebelum digunakan untuk POCKET_ICON_COLORS */}
                            <span className="w-2 h-2 rounded-full" style={{backgroundColor: accountIndex !== -1 ? POCKET_ICON_COLORS[accountIndex % POCKET_ICON_COLORS.length] : '#9ca3af'}}></span>
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
    </div>
  );
};

export default RecentTransactions;