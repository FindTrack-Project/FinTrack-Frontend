import React, { useState, useEffect } from 'react';

const SavingGoalModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setTargetAmount('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (!name || !targetAmount || Number(targetAmount) <= 0) {
        throw new Error("Nama dan Target Dana (harus lebih dari 0) wajib diisi.");
      }
      await onSave({ name, targetAmount: Number(targetAmount) });
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
          <h2 className="text-lg font-semibold">Tambah Tujuan Tabungan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Tujuan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Liburan ke Bali, Laptop Baru"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Dana (Rp)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Contoh: 5000000"
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? "Menyimpan..." : "Simpan Tujuan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingGoalModal;