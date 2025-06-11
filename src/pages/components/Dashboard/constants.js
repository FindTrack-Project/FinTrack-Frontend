export const PIE_COLORS = [
  "#3B82F6", // Food & Drink / Primary
  "#10B981", // Transport / Green
  "#F59E0B", // Groceries / Yellow
  "#EF4444", // Tagihan / Red
  "#8B5CF6", // Entertainment / Purple
  "#06B6D4", // Health / Cyan
  "#F97316", // Social / Orange
  "#84CC16", // Education / Lime
  "#EC4899", // Cicilan/Lain-lain / Pink
  "#6366F1", // Indigo fallback
  "#A855F7", // Violet fallback
  "#F43F5E", // Rose fallback
];

/**
 * Konfigurasi untuk Line Chart (BalanceOverview).
 * Disesuaikan agar cocok dengan desain gambar.
 */
export const lineChartOptions = (formatCurrency) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Legenda tidak ditampilkan
    },
    tooltip: {
      enabled: true,
      // --- PERBAIKAN: Styling tooltip agar sesuai gambar (latar putih) ---
      backgroundColor: '#ffffff',
      titleColor: '#374151',    // Warna judul (misal: "Apr")
      bodyColor: '#111827',     // Warna isi (misal: "Rp15.700.000")
      borderColor: '#e5e7eb',   // Warna border tooltip
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false,    // Menghilangkan kotak warna di tooltip
      callbacks: {
        // Format label tooltip agar hanya menampilkan nilai terformat
        label: function (context) {
          const value = context.parsed.y || 0;
          return formatCurrency(value);
        },
        // Menghilangkan judul jika tidak diperlukan
        title: function(context) {
            return context[0].label;
        }
      },
    },
  },
  scales: {
    y: {
      // --- PERBAIKAN: Sumbu Y wajib dimulai dari 0 untuk data finansial ---
      beginAtZero: true,
      grid: {
        drawBorder: false, // Menghilangkan garis border sumbu
      },
      ticks: {
        maxTicksLimit: 5, // Batasi jumlah label di sumbu Y
        // Format label di sumbu Y (misal: "Rp0", "Rp5.000.000")
        callback: function (value) {
          return formatCurrency(value);
        },
        color: "#6B7280", // Warna teks label sumbu
      },
    },
    x: {
      grid: {
        display: false, // Menghilangkan garis grid vertikal untuk tampilan bersih
      },
      ticks: {
        color: "#6B7280",
      },
    },
  },
  // Mengatur interaksi hover
  interaction: {
    intersect: false,
    mode: 'index',
  },
});

/**
 * Konfigurasi untuk Pie/Doughnut Chart (seperti di halaman Pockets).
 * Konfigurasi ini sudah baik.
 */
export const pieOptions = (formatCurrency) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "#111827",
      titleColor: "#FFFFFF",
      bodyColor: "#E5E7EB",
      borderRadius: 8,
      padding: 12,
      boxPadding: 4,
      callbacks: {
        label: (context) => {
           const label = context.label || '';
           const value = formatCurrency(context.parsed);
           return `${label}: ${value}`;
        }
      },
    },
  },
  cutout: "50%",
});