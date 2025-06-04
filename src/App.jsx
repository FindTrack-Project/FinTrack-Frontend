import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pastikan jalur impor ini benar relatif terhadap App.jsx
import Login from "./pages/Auth/login.jsx";
import Register from "./pages/Auth/register.jsx";

import Home from "./pages/components/Dashboard/Home.jsx";
import Income from "./pages/components/Dashboard/Income.jsx";
import Expense from "./pages/components/Dashboard/Expense.jsx";
import Balance from "./pages/components/Dashboard/Balance.jsx";

import Sidebar from "./pages/components/Sidebar/Sidebar.jsx";
import Transaction from "./pages/components/transaction/transaction.jsx"; // Mengimpor komponen Transaction

// MainLayout tidak perlu diekspor jika hanya digunakan di App.jsx
const MainLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Meneruskan fungsi setIsSidebarCollapsed ke Sidebar */}
      <Sidebar onToggleCollapse={setIsSidebarCollapsed} />
      {/* Konten utama halaman akan memiliki margin kiri yang dinamis */}
      <div
        className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Mengkloning elemen anak dan meneruskan isSidebarCollapsed sebagai prop */}
        {React.cloneElement(children, { isSidebarCollapsed })}
      </div>
    </div>
  );
};

// PrivateRoute tidak perlu diekspor jika hanya digunakan di App.jsx
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("userToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Root tidak perlu diekspor jika hanya digunakan di App.jsx
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("userToken");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

// Pastikan hanya satu jenis ekspor untuk komponen App
const App = () => {
  // Hapus 'export' di sini
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Root />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <PrivateRoute>
              <MainLayout>
                <Expense />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/income"
          element={
            <PrivateRoute>
              <MainLayout>
                <Income />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/balance"
          element={
            <PrivateRoute>
              <MainLayout>
                <Balance />
              </MainLayout>
            </PrivateRoute>
          }
        />
        {/* Rute baru untuk Transaksi */}
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <MainLayout>
                <Transaction />
              </MainLayout>
            </PrivateRoute>
          }
        />
        {/* Opsional: Rute untuk menambahkan transaksi baru, jika Anda membuat formulir terpisah */}
        <Route
          path="/add-transaction"
          element={
            <PrivateRoute>
              <MainLayout>
                {/* Anda akan menempatkan komponen AddTransactionForm Anda di sini */}
                <div className="text-gray-700 text-center py-10">
                  Formulir Tambah Transaksi Baru (Placeholder)
                </div>
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App; // Pastikan ini adalah satu-satunya ekspor default untuk App
