import React, { useState, useEffect } from 'react';
import { formatCurrency } from "./utils"; // atau sesuaikan path utilitas Anda

const AllocateFundModal = ({ isOpen, onClose, onAllocate, goal, accounts = [] }) => {
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (accounts.length > 0) {
        setAccountId(accounts[0].id);
      }
    } else {
      setAmount('');
      setAccountId('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen, accounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (!amount || !accountId || Number(amount) <= 0) {
        throw new Error("Jumlah dana dan sumber dana wajib diisi.");
      }
      await onAllocate({ amount: Number(amount), accountId });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 pb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold truncate pr-2">Alokasi Dana untuk "{goal?.name}"</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 100000"
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sumber Dana</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
              disabled={accounts.length === 0}
            >
              {accounts.length > 0 ? (
                accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {/* 2. SEKARANG FUNGSI INI DIKENALI */}
                    {acc.name} ({formatCurrency(acc.currentBalance)})
                  </option>
                ))
              ) : (
                <option>Tidak ada pocket tersedia</option>
              )}
            </select>
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" disabled={isLoading || accounts.length === 0} className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? "Mengalokasikan..." : "Alokasikan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocateFundModal;