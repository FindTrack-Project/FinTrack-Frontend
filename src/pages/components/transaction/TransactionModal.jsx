import React, { useState, useEffect } from "react";
import Api from "../../../config/apiConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatCurrency } from "./utils"; // Pastikan path ini benar!
import TransactionForm from "./TransactionForm";

// ...

<TransactionForm
  activeTab={activeTab}
  formData={formData}
  displayAmount={displayAmount}
  error={error}
  isLoading={isLoading}
  handleChange={handleChange}
  handleSubmit={handleSubmit}
  handleAmountBlur={handleAmountBlur}
  handleAmountFocus={handleAmountFocus}
  accounts={accounts}
  categoriesList={categoriesList}
  sourcesList={sourcesList}
/>


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
    amount: "",
    description: "",
    accountId: "",
    category: "",
    source: "",
    sourceAccountId: "",
    destinationAccountId: "",
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
      setDisplayAmount("");
      setError(null);
    }
  }, [isOpen, accounts, categoriesList, sourcesList]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      let cleanValue = value.replace(/[^0-9.,]/g, "");
      cleanValue = cleanValue.replace(/,/g, ".");
      const parts = cleanValue.split(".");
      if (parts.length > 2) {
        cleanValue = parts[0] + "." + parts.slice(1).join("");
      }
      let numericValue = parseFloat(cleanValue);
      if (isNaN(numericValue) && cleanValue !== "") {
        numericValue = 0;
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
    setError(null);

    let endpoint = "";
    let payload = {};

    try {
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

      await Api.post(endpoint, payload);
      toast.success(`${activeTab} berhasil ditambahkan/ditransfer!`);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
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

        <div className="px-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['Income', 'Expense', 'Transfer'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
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

          <div className="grid grid-cols-2 gap-4">
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

            {activeTab === "Expense" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === "Income" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sumber
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">Pilih Sumber</option>
                  {sourcesList.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === "Transfer" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dari Akun
                  </label>
                  <select
                    name="sourceAccountId"
                    value={formData.sourceAccountId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
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
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

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

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : `Tambah ${activeTab}`}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TransactionModal;
