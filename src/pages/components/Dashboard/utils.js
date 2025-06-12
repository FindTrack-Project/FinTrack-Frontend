import {
  CreditCard,
  Wallet,
  Landmark,
  Briefcase,
  Gift,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  FileText,
  Film,
  HeartPulse,
  Users,
  BookOpen,
  Banknote,
  GraduationCap,
  ShieldCheck,
  Plane,
  Bike,
  Dog,
  HelpCircle,
} from "lucide-react";

// 2. Fungsi formatCurrency Anda sudah bagus
export const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "Rp0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0, // Dibuat 0 agar konsisten
  }).format(amount);
};

// 3. FUNGSI getTransactionIcon YANG SUDAH DIPERBAIKI TOTAL
export const getTransactionIcon = (description, type) => {
  if (!description) return CreditCard; // Ikon default jika tidak ada deskripsi
  const lowerDesc = description.toLowerCase();

  // Peta kata kunci ke komponen ikon
  const iconMap = {
    // Expense Keywords
    "makan": UtensilsCrossed,
    "transportasi": Car,
    "ojek": Bike,
    "belanja": ShoppingBag,
    "groceries": ShoppingBag,
    "tagihan": FileText,
    "bioskop": Film,
    "hiburan": Film,
    "obat": HeartPulse,
    "kesehatan": HeartPulse,
    "sosial": Users,
    "buku": BookOpen,
    "cicilan": Landmark,
    "pendidikan": GraduationCap,
    "asuransi": ShieldCheck,
    "liburan": Plane,
    "travel": Plane,
    "hobi": Bike,
    "peliharaan": Dog,
    "pajak": FileText,

    // Income Keywords
    "gaji": Banknote,
    "project": Briefcase,
    "hadiah": Gift,
    "bonus": Gift,
    
    // Universal
    "transfer": Wallet,
  };

  // Cari kata kunci dalam deskripsi atau kategori
  for (const key in iconMap) {
    if (lowerDesc.includes(key)) {
      return iconMap[key];
    }
  }

  // Jika tidak ada kata kunci yang cocok, kembalikan ikon default
  return CreditCard;
};


// 4. Fungsi-fungsi lain di bawah ini tidak diubah dan sudah benar

export const getMonthlyData = (incomes, expenses, totalBalance) => {
  const monthlyIncomeMap = new Map();
  const monthlyExpenseMap = new Map();
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const monthsLabels = [];
  const orderedMonthsKeys = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const monthYearKey = `${d.getFullYear()}-${d.getMonth()}`;
    monthsLabels.push(d.toLocaleString("id-ID", { month: "short", year: "2-digit" }));
    orderedMonthsKeys.push(monthYearKey);
    monthlyIncomeMap.set(monthYearKey, 0);
    monthlyExpenseMap.set(monthYearKey, 0);
  }

  incomes.forEach((item) => {
    const date = new Date(item.date);
    const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthlyIncomeMap.has(monthYearKey)) {
      monthlyIncomeMap.set(monthYearKey, monthlyIncomeMap.get(monthYearKey) + item.amount);
    }
  });

  expenses.forEach((item) => {
    const date = new Date(item.date);
    const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthlyExpenseMap.has(monthYearKey)) {
      monthlyExpenseMap.set(monthYearKey, monthlyExpenseMap.get(monthYearKey) + item.amount);
    }
  });

  const incomeAmounts = orderedMonthsKeys.map((key) => monthlyIncomeMap.get(key));
  const expenseAmounts = orderedMonthsKeys.map((key) => monthlyExpenseMap.get(key));

  let tempBalanceForChart = totalBalance;
  const balanceOverTime = [];
  for (let i = orderedMonthsKeys.length - 1; i >= 0; i--) {
    const monthKey = orderedMonthsKeys[i];
    balanceOverTime.unshift(tempBalanceForChart);
    tempBalanceForChart = tempBalanceForChart - monthlyIncomeMap.get(monthKey) + monthlyExpenseMap.get(monthKey);
  }

  return { months: monthsLabels, incomeAmounts, expenseAmounts, balanceOverTime };
};
