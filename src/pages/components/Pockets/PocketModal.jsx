import React, { useState, useEffect } from "react";

const PocketModal = ({ isOpen, onClose, onPocketSaved, existingPocket }) => {
  // Gunakan satu state untuk form agar lebih mudah dikelola
  const [formData, setFormData] = useState({
    name: "",
    type: "Bank",
    initialBalance: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // PERBAIKAN: Tentukan mode berdasarkan prop `existingPocket`
  const isEditMode = Boolean(existingPocket);

  // PERBAIKAN: Gunakan useEffect untuk mengisi form saat mode edit atau mereset saat mode tambah
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          name: existingPocket.name,
          type: existingPocket.type,
          initialBalance: existingPocket.initialBalance, // Tetap simpan untuk data, tapi tidak ditampilkan
        });
      } else {
        // Reset form untuk mode "Tambah Baru"
        setFormData({
          name: "",
          type: "Bank",
          initialBalance: "",
        });
      }
      setError(""); // Selalu reset error saat modal dibuka
    }
  }, [isOpen, existingPocket, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (!formData.name || !formData.type) {
        throw new Error("Nama dan tipe pocket wajib diisi.");
      }

      const dataToSave = {
        name: formData.name,
        type: formData.type,
      };

      // Hanya tambahkan initialBalance jika BUKAN mode edit
      if (!isEditMode) {
        dataToSave.initialBalance = Number(formData.initialBalance) || 0;
      }
      
      await onPocketSaved(dataToSave);
      onClose();
    } catch (err) {
      setError(err.message || "Gagal menyimpan pocket.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 pb-4 flex justify-between items-center">
          {/* PERBAIKAN: Judul modal dinamis */}
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Pocket" : "Tambah Pocket Baru"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl p-1">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          {error && <p className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Pocket</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Contoh: BCA, Dana, Uang Tunai"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Pocket</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="Bank">Bank</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* PERBAIKAN: Saldo Awal hanya muncul saat mode Tambah */}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Saldo Awal</label>
              <input
                type="number"
                name="initialBalance"
                value={formData.initialBalance}
                onChange={handleInputChange}
                required
                min={0}
                placeholder="Rp 0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 cursor-pointer">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PocketModal;