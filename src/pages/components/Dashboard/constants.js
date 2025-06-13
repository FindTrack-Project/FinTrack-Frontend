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
 */
export const lineChartOptions = (formatCurrency) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#ffffff',
      titleColor: '#374151',
      bodyColor: '#111827',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function (context) {
          const value = context.parsed.y || 0;
          return formatCurrency(value);
        },
        title: function(context) {
            // Menggunakan optional chaining (?) untuk keamanan jika context kosong
            return context[0]?.label;
        }
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
      },
      ticks: {
        maxTicksLimit: 5,
        callback: function (value) {
          return formatCurrency(value);
        },
        color: "#6B7280",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6B7280",
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
});

/**
 * Konfigurasi untuk Pie/Doughnut Chart.
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
