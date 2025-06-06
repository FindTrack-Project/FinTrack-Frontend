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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleSidebarToggle = (newIsCollapsedState) => {
    setIsSidebarExpanded(!newIsCollapsedState);
  };

  const contentMarginClass = isSidebarExpanded ? "ml-64" : "ml-17";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onToggleCollapse={handleSidebarToggle} />

      <div
        className={`
        ${contentMarginClass} 
        transition-all duration-300 ease-in-out
        min-h-screen overflow-auto
      `}
      >
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element="/register" />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
