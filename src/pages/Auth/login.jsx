import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../config/apiConfig";

import mataTutup from "../../assets/mataTutup.svg";
import mataBuka from "../../assets/mataBuka.svg";
import bgLogin from "../../assets/bg-login.jpg";
import Logo from "../../assets/logo.svg";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const toggleEye = () => setIsClosed(!isClosed);

  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/dashboard");
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await Api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("userToken", response.data.token);
      setShowSuccessModal(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Masuk gagal. Periksa email dan kata sandi Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4 font-inter">
      <div className="flex bg-secondary rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-16">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex justify-start mb-8">
              <img src={Logo} alt="Logo" className="h-14 w-auto" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Selamat <span className="text-accent">datang</span> kembali! 👋
            </h1>
            <p className="text-gray-200 mb-8 text-base">
              Masuk untuk mendapatkan akses tak terbatas ke data & informasi.
            </p>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-white text-sm font-semibold mb-2"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Masukkan alamat email Anda"
                className="w-full px-4 py-2.5 border border-gray-400 bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200 text-sm placeholder-gray-400"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-white text-sm font-semibold mb-2"
              >
                Kata Sandi *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={isClosed ? "password" : "text"}
                  required
                  placeholder="Masukkan kata sandi"
                  className="w-full px-4 py-2.5 border border-gray-400 bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200 text-sm pr-10 placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center w-8 h-8"
                  onClick={toggleEye}
                >
                  <img
                    src={isClosed ? mataTutup : mataBuka}
                    alt="toggle eye"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="inline-flex items-center text-gray-200 text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-accent rounded border-gray-400 focus:ring-accent transition duration-150"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2">Ingat saya</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-accent text-sm font-medium hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-md cursor-pointer font-semibold text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                isLoading
                  ? "bg-accent/60 cursor-not-allowed"
                  : "bg-accent hover:bg-accent/80"
              }`}
            >
              {isLoading ? "Sedang Masuk..." : "Masuk"}
            </button>

            <p className="text-center text-sm text-gray-200 mt-6">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-accent font-semibold hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:flex flex-1">
          <img
            src={bgLogin}
            alt="Background Login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                Masuk Berhasil! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                Selamat datang kembali! Anda akan diarahkan ke dashboard dalam
                beberapa detik.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
