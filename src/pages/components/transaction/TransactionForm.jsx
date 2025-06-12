import React from "react";

const TransactionForm = ({
  activeTab,
  formData,
  displayAmount,
  error,
  isLoading,
  handleChange,
  handleSubmit,
  handleAmountBlur,
  handleAmountFocus,
  accounts,
  categoriesList,
  sourcesList,
}) => {
  return (
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
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
            inputMode="decimal"
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="2"
          className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all disabled:opacity-50"
        >
          {isLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
