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

export const lineChartOptions = (formatCurrency) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: "Balance Over Time",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += formatCurrency(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6B7280", // gray-500
      },
    },
    y: {
      beginAtZero: false,
      grid: {
        color: "#E5E7EB", // gray-200
      },
      ticks: {
        callback: function (value) {
          return formatCurrency(value);
        },
        color: "#6B7280", // gray-500
      },
    },
  },
});

export const pieOptions = (formatCurrency) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: function (context) {
          const value = context.parsed;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
        },
      },
    },
  },
  cutout: "60%",
});
