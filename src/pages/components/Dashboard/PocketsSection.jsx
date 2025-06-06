import React from "react";
import { Link } from "react-router-dom";
import { Wallet, CreditCard, DollarSign } from "lucide-react";
import { PIE_COLORS } from "./constants";

const PocketsSection = ({ accounts, formatCurrency }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Pockets</h2>
      <div className="space-y-4">
        {accounts.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No accounts found.
            <Link to="/accounts/add" className="text-blue-500 ml-1">
              Add one?
            </Link>
          </div>
        ) : (
          accounts.map((account) => {
            let IconComponent = Wallet;
            if (account.type === "Bank") {
              IconComponent = CreditCard;
            } else if (
              account.type === "E-Wallet" ||
              account.name.toLowerCase().includes("dana") ||
              account.name.toLowerCase().includes("gopay")
            ) {
              IconComponent = Wallet;
            } else if (
              account.type === "Cash" ||
              account.name.toLowerCase().includes("kas")
            ) {
              IconComponent = DollarSign;
            }

            const color =
              PIE_COLORS[accounts.indexOf(account) % PIE_COLORS.length];

            return (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className="p-2 rounded-lg mr-3"
                    style={{ backgroundColor: `${color}1A` }}
                  >
                    <IconComponent size={20} style={{ color: color }} />
                  </div>
                  <span className="font-medium text-gray-800">
                    {account.name}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(account.currentBalance)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PocketsSection;
