import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Home from "./pages/components/Dashboard/Home";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/Register";
import Sidebar from "./pages/components/Sidebar/Sidebar";
import Transaction from "./pages/components/transaction/transaction";

function DashboardLayout() {
  // State ini akan mencerminkan apakah sidebar dalam keadaan 'collapsed'
  // Nilai awal harus sesuai dengan state awal `isCollapsed` di Sidebar Anda.
  // Jika Sidebar Anda defaultnya TIDAK collapsed (yaitu expanded), maka isCollapsed defaultnya false.
  // Jadi, kita akan menyimpan kebalikannya: isSidebarExpanded defaultnya true.
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Handler yang akan dipanggil oleh Sidebar ketika status collapse-nya berubah
  const handleSidebarToggle = (newIsCollapsedState) => {
    // Jika Sidebar mengirim `true` (berarti collapsed), maka kita set isSidebarExpanded ke `false`
    // Jika Sidebar mengirim `false` (berarti expanded), maka kita set isSidebarExpanded ke `true`
    setIsSidebarExpanded(!newIsCollapsedState);
  };

  // Tentukan kelas margin-left berdasarkan state `isSidebarExpanded`
  // Jika expanded (sidebar w-64), maka content ml-64
  // Jika collapsed (sidebar w-17), maka content ml-17
  const contentMarginClass = isSidebarExpanded ? "ml-64" : "ml-17";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Meneruskan prop `onToggleCollapse` ke Sidebar.
        Sidebar akan memanggil ini dengan state `isCollapsed` internalnya.
      */}
      <Sidebar onToggleCollapse={handleSidebarToggle} />

      {/* Konten Utama: menggunakan margin kiri dinamis
        untuk menyesuaikan dengan lebar sidebar fixed.
        PERBAIKAN KRUSIAL: Menambahkan kembali prop 'context' ke Outlet
        dengan nama yang diharapkan oleh Home.jsx (isSidebarOpen, toggleSidebar).
      */}
      <div
        className={`
        ${contentMarginClass} 
        transition-all duration-300 ease-in-out
        min-h-screen overflow-auto
      `}
      >
        <Outlet
          context={{
            isSidebarOpen: isSidebarExpanded, // Map state isSidebarExpanded ke isSidebarOpen untuk Home.jsx
            toggleSidebar: handleSidebarToggle, // Map handler handleSidebarToggle ke toggleSidebar untuk Home.jsx
          }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* PERBAIKAN: Mengubah element="/register" menjadi element={<Register />} */}
        <Route path="/register" element={<Register />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
