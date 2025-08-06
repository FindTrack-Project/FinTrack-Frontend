import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../config/apiConfig";
import Logo from "../../assets/logo.svg";
import { Eye, EyeOff } from "lucide-react";

// --- KOMPONEN BARU: Loading Overlay ---
const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
        <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
            {/* Ikon Spinner */}
            <svg className="animate-spin h-10 w-10 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-700 font-semibold">Membuat akun...</p>
        </div>
    </div>
);


export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isClosed, setIsClosed] = useState(true);
  const [isConfirmClosed, setIsConfirmClosed] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const togglePassword = () => setIsClosed(!isClosed);
  const toggleConfirmPassword = () => setIsConfirmClosed(!isConfirmClosed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi harus sama");
      return;
    }
    
    setIsLoading(true); // Tampilkan overlay loading
    try {
      await Api.post("/auth/register", {
        name,
        email,
        password,
        initialBalance: 0,
      });
      // Jangan langsung tampilkan modal sukses, biarkan finally handle loading
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal. Coba lagi.");
    } finally {
      setIsLoading(false); // Sembunyikan overlay loading
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <>
      {/* --- PERBAIKAN: Tampilkan overlay saat isLoading true --- */}
      {isLoading && <LoadingOverlay />}

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8">
            <img src={Logo} alt="Logo" className="h-12 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 text-center">
                Buat <span className="text-accent">akun</span> Anda
            </h1>
            <p className="text-gray-500 text-center text-base">
                Masukkan detail data diri Anda untuk membuat akun baru FinTrack.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label
                    htmlFor="name"
                    className="block text-gray-700 font-semibold text-sm mb-1"
                >
                    Nama Lengkap *
                </label>
                <input
                    id="name"
                    type="text"
                    required
                    placeholder="Contoh: John Doe"
                    className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm placeholder-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold text-sm mb-1"
                >
                    Email *
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    placeholder="Contoh: johndoe@gmail.com"
                    className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm placeholder-gray-400"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-gray-700 font-semibold text-sm mb-1"
                >
                    Kata Sandi *
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={isClosed ? "password" : "text"}
                        required
                        placeholder="Masukkan Kata Sandi"
                        className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm placeholder-gray-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center w-8 h-8"
                        onClick={togglePassword}
                    >
                        {isClosed ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>
            <div>
                <label
                    htmlFor="confirm-password"
                    className="block text-gray-700 font-semibold text-sm mb-1"
                >
                    Konfirmasi Kata Sandi *
                </label>
                <div className="relative">
                    <input
                        id="confirm-password"
                        type={isConfirmClosed ? "password" : "text"}
                        required
                        placeholder="Ulangi Kata Sandi"
                        className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm placeholder-gray-400"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center w-8 h-8"
                        onClick={toggleConfirmPassword}
                    >
                        {isConfirmClosed ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>
              {error && (
              <p className="text-red-500 text-sm text-center !mt-3">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-lg font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                    isLoading
                    ? "bg-accent/60 cursor-not-allowed"
                    : "bg-accent hover:bg-accent/90 cursor-pointer"
                }`}
              >
                {/* Kita hapus teks loading di sini karena sudah ada overlay */}
                Daftar
              </button>
            <p className="text-center text-sm text-gray-500 mt-4">
                Sudah punya akun?{" "}
                <Link
                    to="/login"
                    className="text-accent font-semibold hover:underline"
                >
                    Masuk sekarang
                </Link>
            </p>
          </form>
        </div>
        {showSuccessModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Registrasi Berhasil! 🎉
                </h3>
                <p className="text-gray-600 mb-6">
                  Akun Anda telah berhasil dibuat. Silakan lanjut untuk masuk.
                </p>
              </div>
              <button
                onClick={handleSuccessModalClose}
                className="w-full bg-accent cursor-pointer hover:bg-accent/80 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
              >
                Lanjut ke Halaman Login
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;