import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from "react-router-dom";

// --- Halaman Autentikasi ---
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";

// --- Halaman Dashboard ---
import Home from "./pages/components/Dashboard/Home";

// --- Halaman Lainnya ---
import Transaction from "./pages/components/transaction/transaction";
import PocketsPage from "./pages/components/Pockets/PocketsPage";
import SavingsPage from "./pages/components/Savings/SavingsPage";
import RecomendationPage from "./pages/components/Recomendation/RecomendationPage";
import SettingsPage from "./pages/components/Settings/SettingsPage";

// --- Komponen Layout ---
import Sidebar from "./pages/components/Sidebar/Sidebar";
import { Menu } from "lucide-react";

// --- Komponen Header untuk Mobile View ---
const Header = ({ onMenuClick }) => (
  <header className="bg-white shadow-sm p-4 flex items-center md:hidden sticky top-0 z-30">
    <button onClick={onMenuClick} className="text-gray-600 hover:text-primary">
      <Menu size={24} />
    </button>
    <div className="flex-grow text-center font-semibold text-primary">
      Fin<span className="text-accent">track</span>
    </div>
    <div className="w-6" />
  </header>
);

// --- Layout Dashboard Utama (DENGAN PERBAIKAN) ---
function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Efek untuk menutup menu mobile secara otomatis saat layar membesar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // 768px adalah breakpoint default 'md' di Tailwind
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="flex min-h-screen bg-gray-50 font-inter">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((p) => !p)}
        isMobileOpen={isMobileOpen}
        toggleMobileSidebar={() => setIsMobileOpen((p) => !p)}
      />

      <div
        className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// --- Private Route Wrapper ---
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Memeriksa sesi...
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

// --- Redirect Root Route ---
const Root = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    navigate(token ? "/dashboard" : "/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
      Memuat...
    </div>
  );
};

// --- Aplikasi Utama ---
function App() {
  return (
    <Router>
      <Routes>
        {/* --- Route Publik --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Root />} />

        {/* --- Route Private & Layout --- */}
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
          <Route path="/recomendation" element={<RecomendationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
