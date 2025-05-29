import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../config/apiConfig";

import mataTutup from "../../assets/mataTutup.svg";
import mataBuka from "../../assets/mataBuka.svg";
import bgLogin from "../../assets/bg-login.jpg";
import iconLogo from "../../assets/icon-logo.png";

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
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi harus sama");
      setIsLoading(false);
      return;
    }

    try {
      const response = await Api.post("/auth/register", {
        name,
        email,
        password,
      });
      console.log("Register success:", response.data);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(
        "Register failed:",
        err.response?.data?.message || err.message
      );
      setError(err.response?.data?.message || "Registrasi gagal. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      <div className="flex bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-16">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex justify-start mb-8">
              <img src={iconLogo} alt="Logo" className="h-15 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Buat <span className="text-cyan-600">akun</span> Anda 📝
            </h1>
            <p className="text-gray-600 mb-8 text-base">
              Masukkan detail Anda untuk membuat akun.
            </p>

            <div className="mb-5">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Nama Lengkap *
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Contoh: John Doe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Contoh: johndoe@gmail.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Kata Sandi *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={isClosed ? "password" : "text"}
                  required
                  placeholder="Masukkan Kata Sandi"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center w-8 h-8"
                  onClick={togglePassword}
                >
                  <img
                    src={isClosed ? mataTutup : mataBuka}
                    alt="toggle"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Konfirmasi Kata Sandi *
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={isConfirmClosed ? "password" : "text"}
                  required
                  placeholder="Ulangi Kata Sandi"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center w-8 h-8"
                  onClick={toggleConfirmPassword}
                >
                  <img
                    src={isConfirmClosed ? mataTutup : mataBuka}
                    alt="toggle"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-md font-semibold text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                isLoading
                  ? "bg-cyan-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700"
              }`}
            >
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-cyan-600 font-semibold hover:underline"
              >
                Masuk sekarang
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:flex flex-1">
          <img
            src={bgLogin}
            alt="Background Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                Akun Anda telah berhasil dibuat. Sekarang Anda dapat masuk
                menggunakan akun yang baru dibuat.
              </p>
            </div>
            <button
              onClick={handleSuccessModalClose}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
            >
              Lanjut ke Halaman Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
