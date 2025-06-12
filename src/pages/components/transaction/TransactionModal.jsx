import React, { useState, useEffect } from "react";
import Api from "../../../config/apiConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatCurrency } from "./utils";

const TransactionModal = ({
  isOpen,
  onClose,
  onTransactionAdded,
  accounts, // Pastikan ini tersedia sebagai prop
  categoriesList,
  sourcesList,
}) => {
  const [activeTab, setActiveTab] = useState("Income");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    amount: "",
    description: "",
    accountId: "", // Ini adalah akun untuk Income/Expense
    category: "",
    source: "",
    sourceAccountId: "", // Ini adalah akun sumber untuk Transfer
    destinationAccountId: "", // Ini adalah akun tujuan untuk Transfer
  });
  const [displayAmount, setDisplayAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const todayDate =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");
      const currentTime = now.toTimeString().slice(0, 5);

      setFormData({
        date: todayDate,
        time: currentTime,
        amount: "",
        description: "",
        // Set default accountId berdasarkan akun pertama yang tersedia
        accountId: accounts.length > 0 ? accounts[0].id : "",
        category: categoriesList.length > 0 ? categoriesList[0] : "",
        source: sourcesList.length > 0 ? sourcesList[0] : "",
        // Set default sourceAccountId dan destinationAccountId untuk transfer
        sourceAccountId: accounts.length > 0 ? accounts[0].id : "",
        destinationAccountId:
          accounts.length > 1
            ? accounts[1].id
            : accounts.length > 0
            ? accounts[0].id
            : "",
      });
      setDisplayAmount("");
      setError(null); // Reset error saat modal dibuka
    }
  }, [isOpen, accounts, categoriesList, sourcesList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear previous error message on input change
    if (error) setError(null);

    if (name === "amount") {
      let cleanValue = value.replace(/[^0-9.,]/g, "");
      cleanValue = cleanValue.replace(/,/g, ".");
      const parts = cleanValue.split(".");
      if (parts.length > 2) {
        cleanValue = parts[0] + "." + parts.slice(1).join("");
      }
      let numericValue = parseFloat(cleanValue);
      // Handle case where input becomes empty or invalid
      if (isNaN(numericValue) && cleanValue !== "") {
        numericValue = 0; // Or keep it as an empty string if you prefer
      }
      setFormData((prev) => ({
        ...prev,
        amount: numericValue === 0 && cleanValue === "" ? "" : numericValue,
      }));
      setDisplayAmount(cleanValue);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmountBlur = () => {
    if (formData.amount !== "" && typeof formData.amount === "number") {
      setDisplayAmount(formatCurrency(formData.amount));
    } else {
      setDisplayAmount("");
    }
  };

  const handleAmountFocus = () => {
    if (formData.amount !== "") {
      setDisplayAmount(String(formData.amount).replace(".", ","));
    } else {
      setDisplayAmount("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error sebelum submit

    let endpoint = "";
    let payload = {};

    try {
      const finalAmount = parseFloat(formData.amount);
      if (isNaN(finalAmount) || finalAmount <= 0) {
        throw new Error(
          "Jumlah nominal tidak valid atau harus lebih besar dari nol."
        );
      }

      // Validasi Saldo untuk Expense
      if (activeTab === "Expense") {
        const selectedAccount = accounts.find(acc => acc.id === formData.accountId);
        if (!selectedAccount) {
          throw new Error("Akun pengeluaran tidak ditemukan.");
        }
        if (finalAmount > selectedAccount.currentBalance) {
          throw new Error("Saldo di akun tidak mencukupi untuk pengeluaran ini.");
        }
      }

      // Validasi Saldo untuk Transfer (dari akun sumber)
      if (activeTab === "Transfer") {
        const sourceAccount = accounts.find(acc => acc.id === formData.sourceAccountId);
        if (!sourceAccount) {
          throw new Error("Akun sumber transfer tidak ditemukan.");
        }
        if (finalAmount > sourceAccount.currentBalance) {
          throw new Error("Saldo di akun sumber tidak mencukupi untuk transfer ini.");
        }
        if (formData.sourceAccountId === formData.destinationAccountId) {
          throw new Error("Akun sumber dan tujuan transfer tidak boleh sama.");
        }
      }


      const fullDateTime = `${formData.date}T${formData.time}:00Z`;

      if (activeTab === "Income") {
        endpoint = "/incomes";
        payload = {
          amount: finalAmount,
          date: fullDateTime,
          description: formData.description,
          source: formData.source,
          accountId: formData.accountId,
        };
      } else if (activeTab === "Expense") {
        endpoint = "/expenses";
        payload = {
          amount: finalAmount,
          date: fullDateTime,
          description: formData.description,
          category: formData.category,
          accountId: formData.accountId,
        };
      } else if (activeTab === "Transfer") {
        endpoint = "/transfers";
        payload = {
          amount: finalAmount,
          description: formData.description,
          sourceAccountId: formData.sourceAccountId,
          destinationAccountId: formData.destinationAccountId,
        };
      }

      // Panggil API
      await Api.post(endpoint, payload);
      toast.success(`${activeTab} berhasil ditambahkan/ditransfer!`);
      // Panggil callback untuk refresh data di halaman utama
      onTransactionAdded(); // Ini akan memicu refetch di komponen induk
      // Tutup modal setelah sukses
      setTimeout(() => onClose(), 500); // Tutup lebih cepat
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal menambahkan transaksi.";
      toast.error(errorMessage);
      setError(errorMessage); // Set error untuk ditampilkan di form
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Tambah transaksi baru
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['Income', 'Expense', 'Transfer'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-6 space-y-6">
          {error && (
            <p className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Bagian Tanggal & Waktu */}
          {(activeTab === "Income" || activeTab === "Expense") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          )}

          {/* Bagian Jumlah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah
            </label>
            <input
              type="text"
              name="amount"
              value={displayAmount}
              onChange={handleChange}
              onBlur={handleAmountBlur}
              onFocus={handleAmountFocus}
              required
              placeholder="Rp5.000.000"
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              inputMode="decimal"
            />
          </div>

          {/* Bagian Sumber/Kategori/Akun (Disusun di bawah Jumlah) */}
          {activeTab === "Expense" && (
            <div className="space-y-4"> {/* Menggunakan space-y untuk jarak vertikal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Akun Pengeluaran
                </label>
                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  {accounts.length === 0 ? (
                    <option value="">Tidak ada akun</option>
                  ) : (
                    accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (Saldo: {formatCurrency(acc.currentBalance)})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer"
                >
                  <option value="">Pilih Kategori</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "Income" && (
            <div className="space-y-4"> {/* Menggunakan space-y untuk jarak vertikal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Akun Penerima
                </label>
                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer"
                >
                  {accounts.length === 0 ? (
                    <option value="">Tidak ada akun</option>
                  ) : (
                    accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (Saldo: {formatCurrency(acc.currentBalance)})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sumber
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer"
                >
                  <option value="">Pilih Sumber</option>
                  {sourcesList.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "Transfer" && (
            <div className="space-y-4"> {/* Menggunakan space-y untuk jarak vertikal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Akun
                </label>
                <select
                  name="sourceAccountId"
                  value={formData.sourceAccountId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (Saldo: {formatCurrency(acc.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ke Akun
                </label>
                <select
                  name="destinationAccountId"
                  value={formData.destinationAccountId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (Saldo: {formatCurrency(acc.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Bagian Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi (Opsional)
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Contoh: Bayaran proyek, beli pulsa, dll"
            />
          </div>

          {/* Tombol Submit */}
          <div>
            <button
              type="submit"
              disabled={
                isLoading ||
                accounts.length === 0 ||
                (activeTab === "Transfer" && accounts.length < 2) ||
                (activeTab === "Transfer" && formData.sourceAccountId === formData.destinationAccountId)
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Menyimpan..." : `Simpan`}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TransactionModal;