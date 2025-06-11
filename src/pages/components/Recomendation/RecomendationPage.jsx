import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Api from "../../../config/apiConfig";
import { BrainCircuit } from 'lucide-react';


// Helper untuk format mata uang Rupiah
const formatCurrency = (value) =>
    "Rp" + (value || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

// Konstanta untuk perhitungan rekomendasi budget
const BUDGET_RECOMMENDATION_MULTIPLIER = 1.15; // Rekomendasi 15% lebih tinggi dari prediksi

// --- Komponen Utama ---

const RecommendationPage = () => {
    const [last30DaysExpenses, setLast30DaysExpenses] = useState(0);
    // Gabungkan state hasil prediksi untuk manajemen yang lebih bersih
    const [predictionResult, setPredictionResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCalculating, setIsCalculating] = useState(false);
    const [predictionError, setPredictionError] = useState("");

    const [userName, setUserName] = useState("Pengguna");
    const [userEmail, setUserEmail] = useState("email@example.com");

    const navigate = useNavigate();

    // --- Fungsi Pengambilan Data Utama ---

    const fetchRecommendationData = async () => {
        setLoading(true);
        setError(null);
        try {
            let token = localStorage.getItem("jwt_token");
            let userId = localStorage.getItem("user_id");

            if (!token || !userId) {
                setError("Sesi Anda tidak valid. Silakan login kembali.");
                setTimeout(() => navigate("/login"), 1500);
                return;
            }

            // Ambil data user dari cache dulu
            const cachedUserName = localStorage.getItem("user_name");
            const cachedUserEmail = localStorage.getItem("user_email");
            if (cachedUserName) setUserName(cachedUserName);
            if (cachedUserEmail) setUserEmail(cachedUserEmail);

            // Ambil data dari API secara bersamaan untuk efisiensi
            const [expensesResult, userResult] = await Promise.allSettled([
                Api.get("/expenses"),
                Api.get(`/users/${userId}`),
            ]);

            // Proses hasil dari API pengeluaran
            if (expensesResult.status === "fulfilled") {
                const allExpenses = expensesResult.value.expenses || [];

                const now = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);

                const recentExpenses = allExpenses.filter(exp => new Date(exp.date) >= thirtyDaysAgo);
                const totalRecentExpenses = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                setLast30DaysExpenses(totalRecentExpenses);
            } else {
                // Tangani jika API pengeluaran gagal
                console.error("Gagal mengambil data pengeluaran:", expensesResult.reason);
            }

            // Proses hasil dari API pengguna
            if (userResult.status === "fulfilled" && userResult.value?.user) {
                const { name, email } = userResult.value.user;
                setUserName(name || "Pengguna");
                setUserEmail(email || "email@example.com");
                localStorage.setItem("user_name", name || "Pengguna");
                localStorage.setItem("user_email", email || "email@example.com");
            } else {
                // Tangani jika API user gagal
                console.error("Gagal mengambil data pengguna:", userResult.reason);
            }

        } catch (error) {
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
        setPredictionResult(null); // Reset hasil sebelumnya

        try {
            const response = await Api.post('/predict-expense', {});
            if (response && typeof response.predicted_expense !== 'undefined') {
                const prediction = response.predicted_expense;
                const recommendation = prediction * BUDGET_RECOMMENDATION_MULTIPLIER;

                // Atur hasil prediksi dan rekomendasi secara bersamaan
                setPredictionResult({
                    predicted: prediction,
                    recommended: recommendation,
                });

            } else {
                throw new Error("Respons dari server tidak memiliki format yang valid.");
            }
        } catch (error) {
            console.error("Gagal melakukan prediksi:", error);
            setPredictionError(error.response?.data?.message || 'Gagal terhubung ke server prediksi. Silakan coba lagi nanti.');
        } finally {
            setIsCalculating(false);
        }
    };
    // --- Komponen Skeleton (Diletakkan di luar komponen utama) ---

    const SkeletonHeader = () => (
        <header className="flex justify-between items-center mb-8 animate-pulse">
            <div>
                <div className="h-8 bg-gray-200 rounded-md w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-32"></div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="hidden sm:block">
                    <div className="h-5 bg-gray-200 rounded-md w-24 mb-1.5"></div>
                    <div className="h-3 bg-gray-200 rounded-md w-32"></div>
                </div>
            </div>
        </header>
    );

    const SkeletonBody = () => (
        <div className="bg-white max-w mx-auto rounded-2xl shadow-sm p-6 sm:p-8 animate-pulse">
            <div className="h-5 bg-gray-200 rounded-md w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-40 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-md w-56 mb-6"></div>
            <div className="h-11 bg-gray-300 rounded-lg w-64"></div>
        </div>
    );

    // Komponen Skeleton Halaman Penuh
    const RecommendationPageSkeleton = () => (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
            <SkeletonHeader />
            <SkeletonBody />
        </div>
    )

    // Tampilkan skeleton halaman penuh saat loading
    if (loading) {
        return <RecommendationPageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Prediksi dan Rekomendasi</h1>
                    <p className="text-gray-500 text-sm mt-1">Halo {userName}, lihat prediksi pengeluaran dan rekomendasi budget Anda.</p>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Notification Bell */}
                    <div className="p-2 bg-white rounded-full shadow-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </div>
                    {/* Profile */}
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full pr-3 pl-1 py-1 shadow-sm">
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
                </div>
            </header>

            <div className="bg-white max-w mx-auto rounded-2xl shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-gray-800">Analisis Data</h3>
                <p className="text-sm text-gray-500 mb-4">Total pengeluaran Anda dalam 30 hari terakhir</p>
                <p className="text-3xl font-bold text-gray-900 mb-6">
                    {formatCurrency(last30DaysExpenses)}
                </p>

                <button
                    onClick={handlePrediction}
                    disabled={isCalculating}
                    className="px-5 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-wait"
                >
                    {isCalculating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menghitung...
                        </>
                    ) : (
                        <>
                            <BrainCircuit size={16} /> Lakukan Prediksi & Rekomendasi
                        </>
                    )}
                </button>

                {/* Tampilkan pesan error jika ada */}
                {predictionError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mt-4">
                        <strong>Gagal:</strong> {predictionError}
                    </div>
                )}

                {/* Area Hasil Prediksi dan Rekomendasi */}
                {predictionResult && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        {/* Kartu Prediksi */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 transition-all duration-500">
                            <p className="text-sm text-blue-800 font-semibold mb-2">Prediksi Pengeluaran Bulan Depan</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {formatCurrency(predictionResult.predicted)}
                            </p>
                        </div>
                        {/* Kartu Rekomendasi */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 transition-all duration-500">
                            <p className="text-sm text-green-800 font-semibold mb-2">Rekomendasi Budget Bulan Depan</p>
                            <p className="text-3xl font-bold text-green-900">
                                {formatCurrency(predictionResult.recommended)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationPage;