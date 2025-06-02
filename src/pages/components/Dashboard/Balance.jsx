import React, { useEffect, useState } from "react";
import Api from "../../../config/apiConfig";

export const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  const fetchBalance = async () => {
    try {
      const res = await Api.get("/users/balance");
      setBalance(res.data.currentBalance);
    } catch (err) {
      setError("Gagal mengambil saldo.");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="min-h-full bg-gray-100 p-4 font-inter text-white flex items-center justify-center">
      <div className="bg-secondary rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-accent">Saldo Anda</h2>
        {error && <p className="text-red-400 mb-2">{error}</p>}
        {balance !== null ? (
          <div className="text-4xl font-bold text-accent mb-4">
            Rp {balance.toLocaleString()}
          </div>
        ) : (
          <div className="text-gray-200">Memuat saldo...</div>
        )}
      </div>
    </div>
  );
};

export default Balance;