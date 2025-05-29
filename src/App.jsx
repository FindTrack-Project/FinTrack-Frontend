import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './pages/Auth/login';
import Register from './pages/Auth/register';
import Home from './pages/Dasboard/Home';
import Income from './pages/Dasboard/Income';
import Expense from './pages/Dasboard/Expense';

export const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/expense" exact element={<Expense />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  // Redirect to login if not authenticated, otherwise to login
  return isAuthenticated ? (
  <Navigate to="/dashboard" />
   ) : (
  <Navigate to="/login" />
   );
};