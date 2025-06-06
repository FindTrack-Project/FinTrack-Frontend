export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return `Rp0`;
  return `Rp${amount.toLocaleString("id-ID")}`;
};

export const getTransactionIcon = (description, type) => {
  const lowerDesc = description ? description.toLowerCase() : "";
  if (type === "income") {
    if (lowerDesc.includes("gaji")) return "💰";
    if (lowerDesc.includes("project")) return "💼";
    if (lowerDesc.includes("transfer")) return "💸";
    if (lowerDesc.includes("hadiah")) return "🎁";
    return "💸";
  }
  if (type === "expense") {
    if (lowerDesc.includes("makan")) return "🍽️";
    if (lowerDesc.includes("transportasi")) return "🚗";
    if (lowerDesc.includes("groceries")) return "🛒";
    if (lowerDesc.includes("tagihan")) return "🧾";
    if (lowerDesc.includes("bioskop")) return "🎬";
    if (lowerDesc.includes("obat")) return "💊";
    if (lowerDesc.includes("sosial")) return "🤝";
    if (lowerDesc.includes("buku")) return "📚";
    if (lowerDesc.includes("cicilan")) return "🏦";
    if (lowerDesc.includes("transfer")) return "💸";
    return "💳";
  }
  return "💡";
};

export const getMonthlyData = (incomes, expenses, totalBalance) => {
  const monthlyIncomeMap = new Map();
  const monthlyExpenseMap = new Map();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-11

  const monthsLabels = [];
  const orderedMonthsKeys = [];

  // Initialize maps for last 6 months and create ordered keys
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const monthYearKey = `${d.getFullYear()}-${d.getMonth()}`;
    monthsLabels.push(
      d.toLocaleString("id-ID", { month: "short", year: "2-digit" })
    );
    orderedMonthsKeys.push(monthYearKey);
    monthlyIncomeMap.set(monthYearKey, 0);
    monthlyExpenseMap.set(monthYearKey, 0);
  }

  // Populate income data
  incomes.forEach((item) => {
    const date = new Date(item.date);
    const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthlyIncomeMap.has(monthYearKey)) {
      monthlyIncomeMap.set(
        monthYearKey,
        monthlyIncomeMap.get(monthYearKey) + item.amount
      );
    }
  });

  // Populate expense data
  expenses.forEach((item) => {
    const date = new Date(item.date);
    const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthlyExpenseMap.has(monthYearKey)) {
      monthlyExpenseMap.set(
        monthYearKey,
        monthlyExpenseMap.get(monthYearKey) + item.amount
      );
    }
  });

  const incomeAmounts = orderedMonthsKeys.map((key) =>
    monthlyIncomeMap.get(key)
  );
  const expenseAmounts = orderedMonthsKeys.map((key) =>
    monthlyExpenseMap.get(key)
  );

  let tempBalanceForChart = totalBalance;
  const balanceOverTime = [];

  for (let i = orderedMonthsKeys.length - 1; i >= 0; i--) {
    const monthKey = orderedMonthsKeys[i];
    const incomeMonth = monthlyIncomeMap.get(monthKey);
    const expenseMonth = monthlyExpenseMap.get(monthKey);
    balanceOverTime.unshift(tempBalanceForChart);
    tempBalanceForChart = tempBalanceForChart - incomeMonth + expenseMonth;
  }

  return {
    months: monthsLabels,
    incomeAmounts,
    expenseAmounts,
    balanceOverTime,
  };
};
