import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { exportToExcel } from "@/lib/excel";

function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 Verifica se o usuário está logado
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth !== "true") navigate("/admin");
  }, [navigate]);

  // 🔄 Busca os agendamentos do Firestore
  const fetchAppointments = async () => {
    try {
      const snapshot = await getDocs(collection(db, "agendamentos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Excluir agendamento do Firebase
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este agendamento?")) return;
    try {
      await deleteDoc(doc(db, "agendamentos", id));
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      alert("Agendamento excluído com sucesso!");
    } catch (err) {
      alert("Erro ao excluir agendamento: " + err.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🧾 Exportar para Excel (usando o mesmo formato que você já tinha)
  const handleExport = () => {
    if (appointments.length === 0) {
      alert("Não há agendamentos para exportar.");
      return;
    }
    exportToExcel(appointments);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Carregando agendamentos...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Painel de Agendamentos</h1>

        <div className="flex justify-between mb-4">
          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Exportar para Excel
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("auth");
              navigate("/admin");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Sair
          </button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum agendamento encontrado.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Programa</th>
                <th className="border p-2">Nome</th>
                <th className="border p-2">CPF</th>
                <th className="border p-2">Data</th>
                <th className="border p-2">Hora</th>
                <th className="border p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td className="border p-2">{apt.program}</td>
                  <td className="border p-2">{apt.name}</td>
                  <td className="border p-2">{apt.cpf}</td>
                  <td className="border p-2">{apt.date}</td>
                  <td className="border p-2">{apt.time}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
