import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig"; // Pastikan path ini benar
import { BrainCircuit, Bell, ChevronDown, ChevronUp } from "lucide-react";

// Helper untuk format mata uang Rupiah
const formatCurrency = (value) =>
  "Rp" + (value || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

// Konstanta untuk perhitungan rekomendasi budget
const BUDGET_RECOMMENDATION_MULTIPLIER = 1.15; // Rekomendasi 15% lebih tinggi dari prediksi

// --- Komponen Skeleton (Sudah Responsif) ---
const SkeletonHeader = () => (
  <header className="flex justify-between items-center mb-8 animate-pulse">
    <div>
      <div className="h-7 sm:h-8 bg-gray-200 rounded-md w-40 sm:w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-32"></div>
    </div>
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      <div className="hidden sm:block">
        <div className="h-5 bg-gray-200 rounded-md w-24 mb-1.5"></div>
        <div className="h-3 bg-gray-200 rounded-md w-32"></div>
      </div>
    </div>
  </header>
);

const SkeletonBody = () => (
  <div className="bg-white max-w mx-auto rounded-2xl shadow-sm p-4 sm:p-8 animate-pulse">
    <div className="h-5 bg-gray-200 rounded-md w-20 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-md w-40 mb-4"></div>
    <div className="h-9 sm:h-10 bg-gray-200 rounded-md w-48 sm:w-56 mb-6"></div>
    <div className="h-11 bg-gray-300 rounded-lg w-full sm:w-64"></div>
  </div>
);

const SkeletonFAQ = () => (
  <div className="mt-8 bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-md w-48 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="border-b border-gray-200 last:border-b-0 pb-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-5 w-5 bg-gray-200 rounded-md"></div>
          </div>
          <div className="mt-3 h-4 bg-gray-200 rounded-md w-full"></div>
        </div>
      ))}
    </div>
  </div>
);

const RecommendationPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-800">
    <SkeletonHeader />
    <SkeletonBody />
    <SkeletonFAQ />
  </div>
);

// --- Komponen FAQ ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left cursor-pointer"
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="pb-4 text-gray-600">{answer}</div>}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "Bagaimana cara kerja prediksi pengeluaran?",
      answer:
        "Sistem kami menganalisis pola pengeluaran Anda selama 30 hari terakhir dan menggunakan algoritma machine learning untuk memprediksi pengeluaran bulan depan. Prediksi ini mempertimbangkan tren pengeluaran, pola berulang, dan faktor musiman.",
    },
    {
      question: "Apakah rekomendasi budget bisa diandalkan?",
      answer:
        "Rekomendasi budget kami dibuat dengan mempertimbangkan prediksi pengeluaran dan menambahkan buffer 15% untuk mengakomodasi kebutuhan tak terduga. Namun, Anda tetap perlu menyesuaikan dengan kebutuhan dan prioritas pribadi Anda.",
    },
    {
      question: "Bagaimana cara meningkatkan akurasi prediksi?",
      answer:
        "Untuk meningkatkan akurasi prediksi, pastikan Anda mencatat semua transaksi secara konsisten dan detail. Semakin banyak data yang tersedia, semakin akurat prediksi yang dihasilkan.",
    },
    {
      question: "Apakah prediksi memperhitungkan pengeluaran tidak terduga?",
      answer:
        "Ya, sistem kami mempertimbangkan pengeluaran tidak terduga dalam rekomendasi budget dengan menambahkan buffer 15%. Namun, untuk pengeluaran besar yang sangat tidak terduga, sebaiknya Anda memiliki dana darurat terpisah.",
    },
    {
      question: "Bagaimana cara menggunakan rekomendasi budget dengan efektif?",
      answer:
        "Gunakan rekomendasi sebagai panduan awal, kemudian sesuaikan dengan kebutuhan spesifik Anda. Buat kategori pengeluaran, prioritaskan kebutuhan pokok, dan alokasikan sisa dana untuk tabungan atau investasi.",
    },
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
        Frequently Asked Questions
      </h3>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

// --- Komponen Utama ---

const RecommendationPage = () => {
  const [last30DaysExpenses, setLast30DaysExpenses] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("email@example.com");

  const navigate = useNavigate();

  const fetchRecommendationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwt_token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        setError("Sesi Anda tidak valid. Silakan login kembali.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const cachedUserName = localStorage.getItem("user_name");
      const cachedUserEmail = localStorage.getItem("user_email");
      if (cachedUserName) setUserName(cachedUserName);
      if (cachedUserEmail) setUserEmail(cachedUserEmail);

      const [expensesResult, userResult] = await Promise.allSettled([
        Api.get("/expenses"),
        Api.get(`/users/${userId}`),
      ]);

      if (expensesResult.status === "fulfilled") {
        const allExpenses = expensesResult.value.expenses || [];
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const recentExpenses = allExpenses.filter(
          (exp) => new Date(exp.date) >= thirtyDaysAgo
        );
        const totalRecentExpenses = recentExpenses.reduce(
          (sum, exp) => sum + exp.amount,
          0
        );
        setLast30DaysExpenses(totalRecentExpenses);
      } else {
        console.error(
          "Gagal mengambil data pengeluaran:",
          expensesResult.reason
        );
      }

      if (
        userResult.status === "fulfilled" &&
        (userResult.value?.user || userResult.value)
      ) {
        const userData = userResult.value.user || userResult.value;
        const { name, email } = userData;
        setUserName(name || "Pengguna");
        setUserEmail(email || "email@example.com");
        localStorage.setItem("user_name", name || "Pengguna");
        localStorage.setItem("user_email", email || "email@example.com");
      } else {
        console.error("Gagal mengambil data pengguna:", userResult.reason);
      }
    } catch (e) {
      console.log(e);
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendationData();
  }, []);

  const handlePrediction = async () => {
    setIsCalculating(true);
    setPredictionError("");
    setPredictionResult(null);

    try {
      const response = await Api.post("/predict-expense", {});
      if (response && typeof response.predicted_expense !== "undefined") {
        const prediction = response.predicted_expense;
        const recommendation = prediction * BUDGET_RECOMMENDATION_MULTIPLIER;
        setPredictionResult({
          predicted: prediction,
          recommended: recommendation,
        });
      } else {
        throw new Error(
          "Respons dari server tidak memiliki format yang valid."
        );
      }
    } catch (error) {
      console.error("Gagal melakukan prediksi:", error);
      setPredictionError(
        error.response?.data?.message ||
          "Gagal terhubung ke server prediksi. Silakan coba lagi nanti."
      );
    } finally {
      setIsCalculating(false);
    }
  };

  if (loading) {
    return <RecommendationPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-800">
      <header className="flex items-center justify-between mb-8">
        <div>
          {/* PERBAIKAN: Ukuran judul dibuat responsif */}
          <h1 className="text-2xl sm:text-3xl text-gray-900 font-semibold">
            Recomendation
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <Bell size={20} className="text-gray-600" />
          </button>
          <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 rounded-full pr-3 pl-1 py-1 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-right">
              <p className="font-semibold text-gray-800 text-sm">{userName}</p>
              <p className="text-gray-500 text-xs">{userEmail}</p>
            </div>
          </div>
          <div className="sm:hidden">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* PERBAIKAN: Padding card utama dibuat lebih responsif */}
      <div className="bg-white max-w mx-auto rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Analisis Data
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Total pengeluaran Anda dalam 30 hari terakhir
        </p>
        {/* PERBAIKAN: Ukuran teks nominal dibuat responsif */}
        <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
          {formatCurrency(last30DaysExpenses)}
        </p>

        <button
          onClick={handlePrediction}
          disabled={isCalculating}
          className="px-5 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-wait"
        >
          {isCalculating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Menghitung...
            </>
          ) : (
            <>
              <BrainCircuit size={16} /> Lakukan Prediksi & Rekomendasi
            </>
          )}
        </button>

        {predictionError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mt-4">
            <strong>Gagal:</strong> {predictionError}
          </div>
        )}

        {predictionResult && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kartu Prediksi */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 transition-all duration-500">
              <p className="text-sm text-blue-800 font-semibold mb-2">
                Prediksi Pengeluaran Bulan Depan
              </p>
              <p className="text-2xl sm:text-3xl font-semibold text-blue-900">
                {formatCurrency(predictionResult.predicted)}
              </p>
            </div>
            {/* Kartu Rekomendasi */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 transition-all duration-500">
              <p className="text-sm text-green-800 font-semibold mb-2">
                Rekomendasi Budget Bulan Depan
              </p>
              <p className="text-2xl sm:text-3xl font-semibold text-green-900">
                {formatCurrency(predictionResult.recommended)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tambahkan FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default RecommendationPage;