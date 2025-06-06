// src/pages/components/transaction/TransactionList.jsx

import React from "react";
import { formatCurrency, getTransactionIcon, getAccountName } from "./utils"; // Import utilities

const TransactionList = ({ allTransactions, accounts }) => {
  // Group transactions by date for the list
  const transactionsByDate = allTransactions.reduce((acc, transaction) => {
    // Pastikan tanggal diparsing dengan benar
    const dateObj = new Date(transaction.date);
    const dateString = dateObj.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(transaction);
    return acc;
  }, {});

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 col-span-1">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
        <div className="flex flex-wrap gap-2">
          <select className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent">
            <option>7 hari terakhir</option>
            <option>30 hari terakhir</option>
            <option>Bulan ini</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent">
            <option>Pocket</option>
            <option>Cash</option>
            <option>Bank</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent">
            <option>Kategori</option>
            <option>Makanan</option>
            <option>Transportasi</option>
            <option>Tagihan</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(transactionsByDate).map(([date, transactions]) => (
          <div key={date}>
            <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-3 px-2">
              <span>{date}</span>
              {/* Calculate total for date dynamically */}
              <span className="text-gray-500">
                {formatCurrency(
                  transactions.reduce((sum, trx) => {
                    const amount = parseFloat(
                      String(trx.amount)
                        .replace(/[^0-9,-]+/g, "")
                        .replace(",", ".")
                    );
                    return sum + (trx.type === "Pemasukan" ? amount : -amount);
                  }, 0)
                )}
              </span>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg mr-4 flex-shrink-0">
                    {getTransactionIcon(
                      transaction.description ||
                        transaction.category ||
                        transaction.source,
                      transaction.type === "Pemasukan" ? "income" : "expense"
                    )}
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {transaction.type === "Pemasukan"
                          ? transaction.source
                          : transaction.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-semibold text-sm"
                        style={{
                          color:
                            transaction.type === "Pemasukan"
                              ? "#10b981"
                              : "#ef4444",
                        }}
                      >
                        {transaction.type === "Pemasukan" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {getAccountName(transaction.accountId, accounts)}{" "}
                        {/* Pass accounts array */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TransactionList;
