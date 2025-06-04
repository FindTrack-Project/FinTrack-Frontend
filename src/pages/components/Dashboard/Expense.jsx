import React, { useEffect, useState } from "react";
import Api from "../../../config/apiConfig"; // Pastikan path ini benar

export const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await Api.get("/expenses");
      // Urutkan pengeluaran berdasarkan tanggal secara menurun (terbaru di atas)
      const sortedExpenses = res.data.expenses.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setExpenses(sortedExpenses || []);
    } catch (err) {
      // Tangkap error untuk pesan yang lebih spesifik
      setError(
        err.response?.data?.message || "Gagal mengambil data pengeluaran."
      );
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error setiap kali submit
    setIsLoading(true);
    try {
      await Api.post("/expenses", {
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        description,
        category,
      });
      // Reset form setelah berhasil
      setAmount("");
      setDate("");
      setDescription("");
      setCategory("");
      fetchExpenses(); // Ambil data terbaru setelah berhasil menambah
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal menambah pengeluaran. Pastikan semua kolom terisi dengan benar."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Batasi hanya 5 pengeluaran terbaru untuk ditampilkan (sudah diurutkan di fetchExpenses)
  const displayedExpenses = expenses.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-inter text-gray-800 flex items-center justify-center">
      {" "}
      {/* Ubah text-white menjadi text-gray-800 untuk teks umum agar kontras dengan bg-gray-100 */}
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-4 md:p-6">
        {" "}
        {/* Ubah bg-secondary menjadi bg-white untuk tampilan yang lebih cerah dan modern */}
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center">
          {" "}
          {/* Perbesar dan tebalkan judul, ubah warna, dan tengahkan */}
          Catat Pengeluaranmu
        </h2>
        {/* Formulir Tambah Pengeluaran */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          {" "}
          {/* Tambah space-y-4 dan mb-8 */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Jumlah (Rp)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              required
              placeholder="Contoh: 50000.00" // Tambahkan placeholder
              className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" // Gaya input lebih modern
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal
            </label>
            <input
              id="date"
              type="date"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Deskripsi
            </label>
            <input
              id="description"
              type="text"
              required
              placeholder="Contoh: Beli kopi, Makan siang" // Tambahkan placeholder
              className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kategori
            </label>
            <input
              id="category"
              type="text"
              required
              placeholder="Contoh: Makanan, Transportasi, Hiburan" // Tambahkan placeholder
              className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-3 text-center">{error}</p> // Warna error lebih jelas dan tengahkan
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" // Gaya tombol lebih modern, fokus, dan efek disabled
          >
            {isLoading ? "Menyimpan..." : "Tambah Pengeluaran"}
          </button>
        </form>
        {/* Daftar Pengeluaran Terbaru */}
        <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
          {" "}
          {/* Judul daftar lebih menonjol */}
          Riwayat Pengeluaran
        </h3>
        <div>
          {displayedExpenses.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              Belum ada pengeluaran yang dicatat.
            </p> // Gaya pesan kosong lebih baik
          ) : (
            <ul className="divide-y divide-gray-200">
              {" "}
              {/* Garis pemisah lebih tipis */}
              {displayedExpenses.map((exp) => (
                <li
                  key={exp.id}
                  className="py-3 px-2 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  {" "}
                  {/* Layout responsif untuk item daftar */}
                  <div className="flex-1 mb-2 sm:mb-0">
                    {" "}
                    {/* Kontainer detail utama */}
                    <span className="font-semibold text-lg text-indigo-600 block sm:inline-block sm:mr-3">
                      Rp {exp.amount.toLocaleString("id-ID")}
                    </span>
                    <span className="text-gray-700 text-base block sm:inline-block break-words">
                      {" "}
                      {/* break-words tetap penting di sini */}
                      {exp.description}{" "}
                      <span className="font-medium text-gray-600">
                        ({exp.category})
                      </span>
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 ml-0 sm:ml-4 flex-shrink-0">
                    {" "}
                    {/* Tanggal di sisi kanan */}
                    {new Date(exp.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expense;
