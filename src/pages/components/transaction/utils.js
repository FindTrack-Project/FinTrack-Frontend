export const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "Rp0"; // Atau string kosong, tergantung kebutuhan
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Tidak menampilkan desimal jika bulat
    maximumFractionDigits: 2, // Maksimal 2 desimal jika ada
  }).format(amount);
};

// Helper to get transaction icon based on description or type
export const getTransactionIcon = (description, type) => {
  const desc = description ? description.toLowerCase() : "";
  if (type === "income") {
    if (desc.includes("gaji")) return "💰";
    if (desc.includes("project")) return "💼";
    if (desc.includes("transfer")) return "💸";
    if (desc.includes("hadiah")) return "🎁";
    return "💸"; // Default income icon
  }
  if (type === "expense") {
    if (desc.includes("makan")) return "🍽️";
    if (desc.includes("transportasi")) return "🚗";
    if (desc.includes("groceries")) return "🛒";
    if (desc.includes("tagihan")) return "🧾";
    if (desc.includes("bioskop")) return "🎬";
    if (desc.includes("obat")) return "💊";
    if (desc.includes("sosial")) return "🤝";
    if (desc.includes("buku")) return "📚";
    if (desc.includes("cicilan")) return "🏦";
    if (desc.includes("transfer")) return "💸";
    return "💳"; // Default expense icon (credit card)
  }
  return "💡"; // Default for unknown
};

// Helper for Y-axis ticks in Recharts
export const formatRupiahK = (value) => {
  if (value >= 1000000) {
    return `Rp${(value / 1000000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })}JT`;
  } else if (value >= 1000) {
    return `Rp${(value / 1000).toLocaleString("id-ID")}K`;
  }
  return `Rp${value.toLocaleString("id-ID")}`;
};

// Helper to calculate data for Pie Charts
export const calculatePieData = (data, valueKey, nameKey) => {
  const aggregatedData = data.reduce((acc, item) => {
    acc[item[nameKey]] = (acc[item[nameKey]] || 0) + item[valueKey];
    return acc;
  }, {});
  return Object.keys(aggregatedData).map((key) => ({
    name: key,
    value: aggregatedData[key],
  }));
};

// Function to get account name from accountId (requires 'accounts' array as second arg)
export const getAccountName = (accountId, accounts) => {
  const account = accounts.find((acc) => acc.id === accountId);
  return account ? account.name : "Akun Tidak Ditemukan";
};

// --- Fungsi Helper BARU untuk Dropdown ---
export const getUniqueCategories = (expenses) => {
  return [...new Set(expenses.map((exp) => exp.category).filter(Boolean))];
};

export const getUniqueSources = (incomes) => {
  return [...new Set(incomes.map((inc) => inc.source).filter(Boolean))];
};

// Function to calculate cash flow data for line chart
export const calculateCashFlowData = (incomes, expenses) => {
  const monthlyDataMap = new Map();
  const today = new Date();

  // Initialize map for last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthYearKey = `${d.getFullYear()}-${d.getMonth()}`; // e.g., "2025-0" for Jan 2025
    const monthLabel = d.toLocaleString("en-US", { month: "short" }); // e.g., "Jan"
    monthlyDataMap.set(monthYearKey, {
      name: monthLabel,
      income: 0,
      expenses: 0,
    });
  }

  incomes.forEach((item) => {
    const date = new Date(item.date);
    const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthlyDataMap.has(monthYearKey)) {
      monthlyDataMap.get(monthYearKey).income += item.amount;
    }
  });

  expenses.forEach((item) => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // Using full year and month for consistent keys
    if (monthlyDataMap.has(monthKey)) {
      monthlyDataMap.get(monthKey).expenses += item.amount;
    }
  });

  return Array.from(monthlyDataMap.values());
};
