import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "Ak7vie9@") {
      localStorage.setItem("auth", "true");
      navigate("/painel");
    } else {
      alert("Senha incorreta!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500">
      <div className="bg-white/90 p-8 rounded-2xl shadow-xl w-80">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Painel Administrativo</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha"
            className="border rounded-md px-3 py-2"
          />
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-md">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
