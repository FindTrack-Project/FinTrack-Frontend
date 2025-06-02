import React, { useEffect, useState } from "react";
import Api from "../../../config/apiConfig";

export const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchIncomes = async () => {
    try {
      const res = await Api.get("/incomes");
      setIncomes(res.data.incomes || []);
    } catch (err) {
      setError("Gagal mengambil data pemasukan.");
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await Api.post("/incomes", {
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        description,
        source,
      });
      setAmount("");
      setDate("");
      setDescription("");
      setSource("");
      fetchIncomes();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menambah pemasukan."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Batasi hanya 5 pemasukan terbaru untuk desktop
  const displayedIncomes = incomes.slice(0, 5);

  return (
    <div className="min-h-full bg-gray-100 p-4 font-inter text-white flex items-center justify-center">
      <div className="w-full max-w-xl bg-secondary rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-4 text-accent">Tambah Pemasukan</h2>
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <div>
            <label className="block mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-3 py-2 rounded bg-primary border border-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Tanggal</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 rounded bg-primary border border-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Deskripsi</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 rounded bg-primary border border-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Sumber</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 rounded bg-primary border border-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded bg-accent text-white font-semibold hover:bg-accent/80 transition"
          >
            {isLoading ? "Menyimpan..." : "Tambah Pemasukan"}
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-2">Daftar Pemasukan Terbaru</h3>
        <div>
          {displayedIncomes.length === 0 ? (
            <p className="text-gray-200">Belum ada data pemasukan.</p>
          ) : (
            <ul className="divide-y divide-gray-600">
              {displayedIncomes.map((inc) => (
                <li key={inc.id} className="py-2 flex flex-col">
                  <span className="font-semibold text-accent">
                    Rp {inc.amount.toLocaleString()}
                  </span>
                  <span className="text-sm">{inc.description} | {inc.source}</span>
                  <span className="text-xs text-gray-300">{new Date(inc.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;