import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "@/App";
import AdminLogin from "@/pages/AdminLogin";
import AdminPanel from "@/pages/AdminPanel";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/painel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
