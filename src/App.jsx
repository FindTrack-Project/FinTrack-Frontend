import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useNavigate, // Import useNavigate
} from "react-router-dom";

// Import halaman-halaman
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";

// Halaman Dashboard
import Home from "./pages/components/Dashboard/Home";
// Komponen dalam folder Transaction
import Transaction from "./pages/components/transaction/transaction"; // Halaman Transactions
import PocketsPage from "./pages/components/Pockets/PocketsPage"; // Halaman Pockets 
import SavingsPage from "./pages/components/Savings/SavingsPage"; // Halaman Savings 
import RecomendationPage from "./pages/components/Recomendation/RecomendationPage"; // Halaman Recomendation

// Komponen Layout
import Sidebar from "./pages/components/Sidebar/Sidebar";

// MainLayout untuk menampung Sidebar dan konten utama
function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter">
      {/* Sidebar - melewatkan state dan setter ke Sidebar */}
      <Sidebar
        onToggleCollapse={toggleSidebar}
        isCollapsed={isSidebarOpen}
      />

      {/* Konten utama halaman */}
      <div
        className={`
          flex-1 p-8 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "ml-20" : "ml-64"}
          min-h-screen overflow-auto
        `}
      >
        <Outlet context={{ isSidebarOpen, toggleSidebar }} />
      </div>
    </div>
  );
}

// PrivateRoute untuk melindungi rute yang memerlukan autentikasi
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: sedang memeriksa, false: tidak auth, true: auth
  const navigate = useNavigate(); // Inisialisasi useNavigate

  useEffect(() => {
    // Memastikan kode berjalan hanya di sisi klien (browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt_token"); // Gunakan kunci yang benar: "jwt_token"
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      // Untuk SSR, asumsikan tidak terautentikasi secara default untuk mencegah error localStorage
      setIsAuthenticated(false);
    }
  }, []); // useEffect ini hanya berjalan sekali saat komponen di-mount di klien

  // Gunakan useEffect untuk navigasi jika tidak terautentikasi
  useEffect(() => {
    if (isAuthenticated === false && typeof window !== "undefined") {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Tampilkan loading spinner atau null saat status autentikasi belum diketahui
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Memeriksa sesi...
      </div>
    );
  }

  // Jika tidak terautentikasi, jangan render children
  if (isAuthenticated === false) {
    return null;
  }

  // Jika terautentikasi, render children (komponen yang dilindungi)
  return children;
};

// Root untuk mengarahkan pengguna ke dashboard atau login saat pertama kali membuka aplikasi
const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: sedang memeriksa
  const navigate = useNavigate(); // Inisialisasi useNavigate

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt_token"); // Gunakan kunci yang benar: "jwt_token"
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false); // Asumsi tidak terautentikasi di SSR
    }
  }, []);

  // Menggunakan useEffect untuk mengelola navigasi berdasarkan status autentikasi
  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/dashboard");
    } else if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Tampilkan loading spinner saat status autentikasi sedang diperiksa
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
      Memeriksa sesi...
    </div>
  );
};

// Komponen utama App
function App() {
  // Menggunakan function App()
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Root />} /> {/* Rute root */}
        {/* Rute yang dilindungi di bawah DashboardLayout */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/pockets" element={<PocketsPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/recomendation" element={<RecomendationPage />} /> {" "}
          {/* Rute baru untuk Pockets */}
          {/* Tambahkan rute lain yang memerlukan DashboardLayout dan autentikasi di sini */}
        </Route>
        {/* Tambahkan rute untuk halaman Balance, Income, Expense jika Anda memiliki komponen terpisah untuk itu */}
        {/* Contoh:
        <Route path="/balance" element={<PrivateRoute><DashboardLayout><Balance /></DashboardLayout></PrivateRoute>} />
        <Route path="/income" element={<PrivateRoute><DashboardLayout><Income /></DashboardLayout></PrivateRoute>} />
        <Route path="/expense" element={<PrivateRoute><DashboardLayout><Expense /></DashboardLayout></PrivateRoute>} />
        */}
        {/* Opsional: Jika ada rute lain yang tidak memerlukan layout atau autentikasi */}
        {/* <Route path="/public-page" element={<PublicComponent />} /> */}
      </Routes>
    </Router>
  );
}

export default App; // Pastikan ini adalah satu-satunya ekspor default untuk App
