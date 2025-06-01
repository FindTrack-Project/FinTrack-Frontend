import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Bell,
  PlusCircle,
  ArrowRightLeft,
  Wallet,
  CalendarDays,
} from "lucide-react";

const Home = ({ isSidebarCollapsed }) => {
  const recentTransactions = [
    {
      id: 1,
      description: "Belanja Mingguan",
      amount: -750000,
      date: "2025-05-30",
      type: "expense",
    },
    {
      id: 2,
      description: "Gaji Bulanan",
      amount: 10000000,
      date: "2025-05-28",
      type: "income",
    },
    {
      id: 3,
      description: "Makan Siang",
      amount: -50000,
      date: "2025-05-29",
      type: "expense",
    },
    {
      id: 4,
      description: "Tagihan Listrik",
      amount: -300000,
      date: "2025-05-27",
      type: "expense",
    },
    {
      id: 5,
      description: "Pembayaran Utang",
      amount: -1500000,
      date: "2025-05-26",
      type: "expense",
    },
  ];

  const financialGoals = [
    { id: 1, name: "Dana Darurat", current: 5000000, target: 10000000 },
    { id: 2, name: "Liburan", current: 2000000, target: 5000000 },
  ];

  // Menentukan kelas grid secara dinamis berdasarkan isSidebarCollapsed
  // Untuk kartu informasi utama (Total Saldo, Pengeluaran, Saran)
  const infoCardsGridClass = isSidebarCollapsed
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" // Saat diciutkan: 3 kolom pada md ke atas
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"; // Saat diperluas: 3 kolom pada lg ke atas

  // Untuk bagian transaksi dan tujuan
  const mainContentGridClass = isSidebarCollapsed
    ? "grid-cols-1 md:grid-cols-2" // Saat diciutkan: 2 kolom pada md ke atas
    : "grid-cols-1 md:grid-cols-2"; // Saat diperluas: 2 kolom pada md ke atas

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Selamat Datang di Fintrack!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manajemen keuangan pribadi Anda kini lebih mudah dan cerdas.
        </p>

        {/* Bagian Kartu Informasi Utama */}
        <div className={`grid ${infoCardsGridClass} gap-6 mb-8`}>
          {/* Kartu Total Saldo */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center sm:flex-row sm:items-start text-center sm:text-left">
            <div className="p-3 bg-cyan-100 rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
              <Wallet size={24} className="text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              {" "}
              {/* Tambahkan min-w-0 */}
              <h2 className="text-xl font-semibold text-gray-700 mb-1">
                Total Saldo
              </h2>
              <p className="text-3xl lg:text-2xl xl:text-3xl font-bold text-cyan-600 break-words">
                Rp 12.500.000
              </p>{" "}
              {/* Sesuaikan ukuran teks */}
              <p className="text-sm text-gray-500">Per 31 Mei 2025</p>
            </div>
          </div>

          {/* Kartu Pengeluaran Bulan Ini */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center sm:flex-row sm:items-start text-center sm:text-left">
            <div className="p-3 bg-red-100 rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
              <TrendingUp size={24} className="text-red-600 rotate-180" />
            </div>
            <div className="flex-1 min-w-0">
              {" "}
              {/* Tambahkan min-w-0 */}
              <h2 className="text-xl font-semibold text-gray-700 mb-1">
                Pengeluaran Bulan Ini
              </h2>
              <p className="text-3xl lg:text-2xl xl:text-3xl font-bold text-red-600 break-words">
                Rp 3.200.000
              </p>{" "}
              {/* Sesuaikan ukuran teks */}
              <p className="text-sm text-gray-500 break-words">
                Dari anggaran Rp 5.000.000
              </p>{" "}
              {/* Tambahkan break-words */}
            </div>
          </div>

          {/* Kartu Saran Keuangan */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center sm:flex-row sm:items-start text-center sm:text-left">
            <div className="p-3 bg-green-100 rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              {" "}
              {/* Tambahkan min-w-0 */}
              <h2 className="text-xl font-semibold text-gray-700 mb-1">
                Saran Keuangan
              </h2>
              <p className="text-base text-gray-700 break-words">
                {" "}
                {/* Tambahkan break-words */}
                Anda telah menghemat 15% lebih banyak dari bulan lalu!
              </p>
              <Link
                to="/advice"
                className="text-cyan-600 hover:underline font-medium text-sm mt-1 block"
              >
                Lihat Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>

        {/* Bagian Transaksi Terbaru & Tujuan Keuangan */}
        <div className={`grid ${mainContentGridClass} gap-6 mb-8`}>
          {/* Kartu Transaksi Terbaru */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <ArrowRightLeft size={20} className="mr-2 text-gray-500" />
              Transaksi Terbaru
            </h2>
            <ul className="space-y-3">
              {recentTransactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    {" "}
                    {/* Tambahkan min-w-0 dan flex-1 */}
                    <p className="font-medium text-gray-800 break-words">
                      {transaction.description}
                    </p>{" "}
                    {/* Tambahkan break-words */}
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    } break-words text-right flex-shrink-0`}
                  >
                    {transaction.type === "income" ? "+" : "-"}Rp{" "}
                    {Math.abs(transaction.amount).toLocaleString("id-ID")}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              to="/history"
              className="block text-center mt-4 text-cyan-600 hover:underline font-medium text-sm"
            >
              Lihat Semua Transaksi
            </Link>
          </div>

          {/* Kartu Tujuan Keuangan Anda */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <Bell size={20} className="mr-2 text-gray-500" />
              Tujuan Keuangan Anda
            </h2>
            <ul className="space-y-4">
              {financialGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <li key={goal.id}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-gray-800 break-words">
                        {goal.name}
                      </p>{" "}
                      {/* Tambahkan break-words */}
                      <p className="text-sm text-gray-600 break-words text-right">
                        Rp {goal.current.toLocaleString("id-ID")} / Rp{" "}
                        {goal.target.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">
                      {progress.toFixed(0)}% Selesai
                    </p>
                  </li>
                );
              })}
            </ul>
            <Link
              to="/goals"
              className="block text-center mt-4 text-cyan-600 hover:underline font-medium text-sm"
            >
              Kelola Tujuan
            </Link>
          </div>
        </div>

        {/* Kartu Call to Action (CTA) */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0 min-w-0">
            {" "}
            {/* Tambahkan min-w-0 */}
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Siap untuk Mencatat Transaksi Baru?
            </h2>
            <p className="text-gray-600 text-sm break-words">
              {" "}
              {/* Tambahkan break-words */}
              Catat pemasukan atau pengeluaran Anda dengan cepat.
            </p>
          </div>
          <Link
            to="/transactions"
            className="flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 flex-shrink-0"
          >
            <PlusCircle size={20} className="mr-2" />
            Tambah Transaksi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
