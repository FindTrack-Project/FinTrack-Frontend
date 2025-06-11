import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../config/apiConfig";
import Logo from "../../assets/logo.svg";
import { Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toggleEye = () => setIsClosed(!isClosed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await Api.post("/auth/login", { email, password });
      if (response && response.token) {
        localStorage.setItem("jwt_token", response.token);
        if (response.userId) localStorage.setItem("user_id", response.userId);
        if (response.name) localStorage.setItem("user_name", response.name);
        navigate("/dashboard", { replace: true });
      } else {
        setError("Token tidak ditemukan dalam respons. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Email atau kata sandi salah. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="Logo" className="h-12 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">
            Selamat <span className="text-accent">datang</span> kembali! 👋
          </h1>
          <p className="text-gray-500 text-center text-base">
            Masuk untuk mendapatkan akses tak terbatas ke data & informasi.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Masukkan alamat email Anda"
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
                placeholder="Masukkan kata sandi"
                className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center w-8 h-8"
                onClick={toggleEye}
              >
                {isClosed ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-gray-600 text-sm">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-accent rounded border-gray-300 focus:ring-accent transition"
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
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
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
            {isLoading ? "Sedang Masuk..." : "Masuk"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
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
    </div>
  );
};

export default Login;
