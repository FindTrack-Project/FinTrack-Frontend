import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // IMpor DEFAULT, TIDAK pakai kurung kurawal
import "./index.css"; // Sesuaikan jika nama file CSS Anda berbeda atau tidak ada

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
