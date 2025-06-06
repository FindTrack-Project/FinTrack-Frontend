import React from "react";
import { getTransactionIcon } from "./utils"; // Import the helper function

const RecentTransactions = ({ incomes, expenses, formatCurrency }) => {
  const combinedTransactions = incomes
    .concat(expenses)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // Show only 5 latest transactions

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <option>7 hari terakhir</option>
            <option>30 hari terakhir</option>
            <option>All Time</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {combinedTransactions.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No recent transactions.
          </div>
        ) : (
          combinedTransactions.map((trx) => (
            <div
              key={trx.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-3 text-lg">
                  {getTransactionIcon(
                    trx.description,
                    trx.source ? "income" : "expense"
                  )}{" "}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {trx.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(trx.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p
                className={`font-semibold text-sm ${
                  trx.source ? "text-green-600" : "text-red-600"
                }`}
              >
                {trx.source ? "+" : "-"}
                {formatCurrency(trx.amount)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
