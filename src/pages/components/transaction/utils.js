// src/pages/components/transaction/utils.js

// 1. Tambahkan semua ikon yang dibutuhkan dari 'lucide-react' di sini
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

// Fungsi formatCurrency Anda sudah bagus, tidak perlu diubah
export const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "Rp0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// --- FUNGSI getTransactionIcon YANG SUDAH DIPERBAIKI TOTAL ---
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

  // Cari kata kunci dalam deskripsi
  for (const key in iconMap) {
    if (lowerDesc.includes(key)) {
      return iconMap[key];
    }
  }

  // Jika tidak ada kata kunci yang cocok, kembalikan ikon default
  return CreditCard;
};

// Helper untuk Y-axis ticks di Recharts (tidak diubah)
export const formatRupiahK = (value) => {
  if (value >= 1000000) {
    return `Rp${(value / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1, })}JT`;
  } else if (value >= 1000) {
    return `Rp${(value / 1000).toLocaleString("id-ID")}K`;
  }
  return `Rp${value.toLocaleString("id-ID")}`;
};

// Helper untuk Pie Charts (tidak diubah)
export const calculatePieData = (data, valueKey, nameKey) => {
  const aggregatedData = data.reduce((acc, item) => {
    const key = item[nameKey] || "Lain-lain";
    acc[key] = (acc[key] || 0) + item[valueKey];
    return acc;
  }, {});
  return Object.keys(aggregatedData).map((key) => ({
    name: key,
    value: aggregatedData[key],
  }));
};

// Fungsi untuk mendapatkan nama akun (tidak diubah)
export const getAccountName = (accountId, accounts) => {
  const account = accounts.find((acc) => acc.id === accountId);
  return account ? account.name : "Akun Dihapus";
};

// --- Fungsi Helper BARU untuk Dropdown (tidak diubah) ---
export const getUniqueCategories = (expenses) => {
  return [...new Set(expenses.map((exp) => exp.category).filter(Boolean))];
};

export const getUniqueSources = (incomes) => {
  return [...new Set(incomes.map((inc) => inc.source).filter(Boolean))];
};

// Fungsi untuk data line chart (tidak diubah)
export const calculateCashFlowData = (incomes, expenses) => {
  const monthlyDataMap = new Map();
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthYearKey = `${d.getFullYear()}-${d.getMonth()}`;
    const monthLabel = d.toLocaleString("id-ID", { month: "short" });
    monthlyDataMap.set(monthYearKey, { name: monthLabel, income: 0, expenses: 0 });
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
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthlyDataMap.has(monthKey)) {
      monthlyDataMap.get(monthKey).expenses += item.amount;
    }
  });

  return Array.from(monthlyDataMap.values());
};