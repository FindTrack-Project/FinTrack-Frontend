import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";

import Home from "./pages/components/Dashboard/Home";
import Income from "./pages/components/Dashboard/Income";
import Expense from "./pages/components/Dashboard/Expense";

import Sidebar from "./pages/components/Sidebar/Sidebar";

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

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("userToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("userToken");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export const App = () => {
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
          path="/pocket"
          element={
            <PrivateRoute>
              <MainLayout>
                {/* Ganti dengan komponen Pocket Anda */}
                <div>Halaman Pocket</div>
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <MainLayout>
                {/* Ganti dengan komponen History Anda */}
                <div>Halaman History</div>
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/service/credit"
          element={
            <PrivateRoute>
              <MainLayout>
                {/* Ganti dengan komponen Credit Anda */}
                <div>Halaman Credit</div>
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/service/transfer"
          element={
            <PrivateRoute>
              <MainLayout>
                {/* Ganti dengan komponen Transfer Anda */}
                <div>Halaman Transfer</div>
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/service/cash"
          element={
            <PrivateRoute>
              <MainLayout>
                {/* Ganti dengan komponen Cash Anda */}
                <div>Halaman Cash</div>
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/service/bills"
          element={
            <PrivateRoute>
              <MainLayout>
                {/* Ganti dengan komponen MyBills Anda */}
                <div>Halaman My Bills</div>
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <PrivateRoute>
              <MainLayout>
                {/* Ganti dengan komponen Saved Anda */}
                <div>Halaman Saved</div>
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
