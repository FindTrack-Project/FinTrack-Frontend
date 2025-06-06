import React, { useState, useEffect } from "react";
import Api from "../../../config/apiConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatCurrency } from "./utils"; // Pastikan path ini benar!

const TransactionModal = ({
  isOpen,
  onClose,
  onTransactionAdded,
  accounts,
  categoriesList,
  sourcesList,
}) => {
  const [activeTab, setActiveTab] = useState("Income");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    amount: "", // Menyimpan nilai numerik (atau string kosong)
    description: "",
    accountId: "",
    category: "",
    source: "",
    sourceAccountId: "",
    destinationAccountId: "",
  });
  const [displayAmount, setDisplayAmount] = useState(""); // Menyimpan nilai string yang diformat untuk input
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
        amount: "", // Reset amount to empty string
        description: "",
        accountId: accounts.length > 0 ? accounts[0].id : "",
        category: categoriesList.length > 0 ? categoriesList[0] : "",
        source: sourcesList.length > 0 ? sourcesList[0] : "",
        sourceAccountId: accounts.length > 0 ? accounts[0].id : "",
        destinationAccountId:
          accounts.length > 1
            ? accounts[1].id
            : accounts.length > 0
            ? accounts[0].id
            : "",
      });
      setDisplayAmount(""); // Reset display amount when modal opens
      setError(null);
    }
  }, [isOpen, accounts, categoriesList, sourcesList]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      // 1. Hapus semua karakter selain digit dan koma/titik.
      let cleanValue = value.replace(/[^0-9.,]/g, "");

      // 2. Ganti koma dengan titik untuk konsistensi parseFloat
      cleanValue = cleanValue.replace(/,/g, ".");

      // 3. Pastikan hanya ada satu titik desimal
      const parts = cleanValue.split(".");
      if (parts.length > 2) {
        cleanValue = parts[0] + "." + parts.slice(1).join("");
      }

      // 4. Konversi ke angka float
      let numericValue = parseFloat(cleanValue);

      // 5. Jika hasilnya NaN (misal inputnya hanya "."), set ke 0 atau ""
      if (isNaN(numericValue) && cleanValue !== "") {
        // Biarkan "" jika inputnya kosong
        numericValue = 0; // Atau biarkan string kosong jika input benar-benar tidak valid
      }

      setFormData((prev) => ({
        ...prev,
        amount: numericValue === 0 && cleanValue === "" ? "" : numericValue,
      })); // Set to "" if user clears
      setDisplayAmount(cleanValue); // Display the cleaned string for direct editing
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmountBlur = () => {
    if (formData.amount !== "" && typeof formData.amount === "number") {
      setDisplayAmount(formatCurrency(formData.amount));
    } else {
      setDisplayAmount(""); // Kosongkan tampilan jika nilai numerik kosong
    }
  };

  const handleAmountFocus = () => {
    // Saat fokus, tampilkan angka mentah tanpa format (gunakan . toString() untuk memastikan)
    // dan ganti titik desimal kembali ke koma jika pengguna Indonesia.
    if (formData.amount !== "") {
      setDisplayAmount(String(formData.amount).replace(".", ","));
    } else {
      setDisplayAmount("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let endpoint = "";
    let payload = {};

    try {
      // Validasi jumlah nominal sebelum pengiriman
      const finalAmount = parseFloat(formData.amount);
      if (isNaN(finalAmount) || finalAmount <= 0) {
        throw new Error(
          "Jumlah nominal tidak valid atau harus lebih besar dari nol."
        );
      }

      const fullDateTime = `${formData.date}T${formData.time}:00Z`;

      if (activeTab === "Income") {
        endpoint = "/incomes";
        payload = {
          amount: finalAmount, // Menggunakan nilai numerik yang sudah divalidasi
          date: fullDateTime,
          description: formData.description,
          source: formData.source,
          accountId: formData.accountId,
        };
      } else if (activeTab === "Expense") {
        endpoint = "/expenses";
        payload = {
          amount: finalAmount, // Menggunakan nilai numerik yang sudah divalidasi
          date: fullDateTime,
          description: formData.description,
          category: formData.category,
          accountId: formData.accountId,
        };
      } else if (activeTab === "Transfer") {
        endpoint = "/transfers";
        payload = {
          amount: finalAmount, // Menggunakan nilai numerik yang sudah divalidasi
          description: formData.description,
          sourceAccountId: formData.sourceAccountId,
          destinationAccountId: formData.destinationAccountId,
        };
      }

      await Api.post(endpoint, payload);
      toast.success(`${activeTab} berhasil ditambahkan/ditransfer!`);
      onTransactionAdded();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Error adding transaction:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal menambahkan transaksi.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Tambah transaksi baru
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === "Income"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("Income")}
            >
              Income
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === "Expense"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("Expense")}
            >
              Expense
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === "Transfer"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("Transfer")}
            >
              Transfer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-6 space-y-6">
          {error && (
            <p className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Date and Time for Income/Expense */}
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

          {/* Combined Amount and Category/Source/Pocket */}
          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah
              </label>
              <input
                type="text" // Tetap type="text"
                name="amount"
                value={displayAmount} // Tampilan dari displayAmount
                onChange={handleChange} // Gunakan handler ini untuk membersihkan dan mengupdate nilai
                onBlur={handleAmountBlur} // Format saat blur
                onFocus={handleAmountFocus} // Hapus format saat fokus
                required
                placeholder="Rp5.000.000"
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                inputMode="decimal" // Petunjuk untuk keyboard virtual
              />
            </div>

            {/* Conditional Dropdown for Category/Source/Pocket */}
            {activeTab === "Expense" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="">Pilih Kategori</option>
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Income" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sumber
                </label>
                <div className="relative">
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="">Pilih Sumber</option>
                    {sourcesList.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === "Income" || activeTab === "Expense") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pocket
                </label>
                <div className="relative">
                  <select
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="">💰 Cash</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transfer specific fields */}
          {activeTab === "Transfer" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Pocket
                </label>
                <div className="relative">
                  <select
                    name="sourceAccountId"
                    value={formData.sourceAccountId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="">Pilih Sumber</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ke Pocket
                </label>
                <div className="relative">
                  <select
                    name="destinationAccountId"
                    value={formData.destinationAccountId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="">Pilih Tujuan</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Gaji bulan Juni"
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TransactionModal;
