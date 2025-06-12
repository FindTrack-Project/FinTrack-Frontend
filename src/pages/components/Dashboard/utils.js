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

// 3. FUNGSI getTransactionIcon (Tidak ada perubahan)
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


// 4. FUNGSI getMonthlyData YANG SUDAH DIPERBAIKI
export const getMonthlyData = (incomes, expenses, totalBalance, timeRange = '6_months') => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed (Jan = 0)

  let numberOfMonths;
  switch (timeRange) {
    case '3_months':
      numberOfMonths = 3;
      break;
    case '6_months':
      numberOfMonths = 6;
      break;
    case '12_months':
      numberOfMonths = 12;
      break;
    default:
      numberOfMonths = 6; // Default jika timeRange tidak valid
  }

  const monthsLabels = []; // Nama bulan untuk XAxis chart (misal: "Mei 25")
  const orderedMonthsKeys = []; // Kunci unik untuk map (misal: "2025-4")
  const monthlyNetChange = new Map(); // Untuk menyimpan perubahan bersih (income - expense) per bulan

  // Tentukan tanggal mulai dan akhir untuk data chart
  // Mulai dari 'numberOfMonths' bulan ke belakang dari bulan ini
  const chartStartDate = new Date(currentYear, currentMonth - (numberOfMonths - 1), 1);
  chartStartDate.setHours(0, 0, 0, 0); // Pastikan mulai dari awal hari
  const chartEndDate = new Date(currentYear, currentMonth, today.getDate(), 23, 59, 59, 999); // Akhir hari ini (sampai saat ini)

  // Inisialisasi map untuk setiap bulan dalam rentang waktu yang dipilih
  for (let i = 0; i < numberOfMonths; i++) {
    const d = new Date(chartStartDate.getFullYear(), chartStartDate.getMonth() + i, 1);
    const monthYearKey = `${d.getFullYear()}-${d.getMonth()}`;
    monthsLabels.push(d.toLocaleString("id-ID", { month: "short", year: "2-digit" }));
    orderedMonthsKeys.push(monthYearKey);
    monthlyNetChange.set(monthYearKey, 0); // Inisialisasi net change menjadi 0
  }

  // Gabungkan dan filter transaksi yang relevan dengan rentang waktu chart
  const relevantTransactions = [...incomes, ...expenses].filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= chartStartDate && itemDate <= chartEndDate;
  });

  // Hitung perubahan bersih (net change) per bulan dari transaksi yang relevan
  relevantTransactions.forEach(item => {
    const date = new Date(item.date);
    const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (monthlyNetChange.has(monthYearKey)) {
      if (item.type === 'Pemasukan') {
        monthlyNetChange.set(monthYearKey, monthlyNetChange.get(monthYearKey) + item.amount);
      } else if (item.type === 'Pengeluaran') {
        monthlyNetChange.set(monthYearKey, monthlyNetChange.get(monthYearKey) - item.amount);
      }
    }
  });

  // Hitung saldo dari waktu ke waktu (balanceOverTime)
  const balanceOverTime = new Array(numberOfMonths).fill(0);
  balanceOverTime[numberOfMonths - 1] = totalBalance; // Saldo akhir bulan terakhir adalah totalBalance

  for (let i = numberOfMonths - 2; i >= 0; i--) {
    const monthKeyForNextMonth = orderedMonthsKeys[i + 1];
    const nextMonthNetChange = monthlyNetChange.get(monthKeyForNextMonth) || 0;
    
    // Saldo akhir bulan ini = Saldo akhir bulan berikutnya - (perubahan bersih bulan berikutnya)
    balanceOverTime[i] = balanceOverTime[i + 1] - nextMonthNetChange;
  }

  // Jika Anda tetap ingin mengembalikan incomeAmounts dan expenseAmounts per bulan yang digambar
  const incomeAmounts = orderedMonthsKeys.map(key => {
    let sum = 0;
    relevantTransactions.forEach(item => {
      const date = new Date(item.date);
      const itemMonthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (itemMonthYearKey === key && item.type === 'Pemasukan') {
        sum += item.amount;
      }
    });
    return sum;
  });

  const expenseAmounts = orderedMonthsKeys.map(key => {
    let sum = 0;
    relevantTransactions.forEach(item => {
      const date = new Date(item.date);
      const itemMonthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (itemMonthYearKey === key && item.type === 'Pengeluaran') {
        sum += item.amount;
      }
    });
    return sum;
  });


  return { months: monthsLabels, incomeAmounts, expenseAmounts, balanceOverTime };
};