import React, { useEffect, useState } from "react";
import { getAppointments, deleteAppointment } from "@/lib/storage";
import { exportToExcel } from "@/lib/excel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ScheduleSettings from "@/components/ScheduleSettings";

function AdminPanel({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filters, setFilters] = useState({
    program: "",
    date: "",
    time: "",
    name: "",
    cpf: "",
    phone: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [password, setPassword] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const ADMIN_PASSWORD = "Ak7vie9@";

  // 🔐 Verifica senha
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Acesso liberado ✅",
        description: "Bem-vindo ao painel administrativo.",
      });
    } else {
      toast({
        title: "Senha incorreta ❌",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // 🔁 Carregar agendamentos
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        toast({
          title: "Erro ao carregar agendamentos",
          description: "Verifique sua conexão com o banco de dados.",
          variant: "destructive",
        });
      }
    };
    fetchAppointments();
  }, [isAuthenticated, toast]);

  // 🔍 Aplicar filtros
  useEffect(() => {
    let filtered = appointments;

    if (filters.program)
      filtered = filtered.filter((apt) =>
        apt.program?.toLowerCase().includes(filters.program.toLowerCase().trim())
      );

    if (filters.date)
      filtered = filtered.filter((apt) => apt.date === filters.date);

    if (filters.time)
      filtered = filtered.filter((apt) => apt.time === filters.time);

    if (filters.name)
      filtered = filtered.filter((apt) =>
        apt.name?.toLowerCase().includes(filters.name.toLowerCase().trim())
      );

    if (filters.cpf)
      filtered = filtered.filter((apt) =>
        apt.cpf?.replace(/\D/g, "").includes(filters.cpf.replace(/\D/g, ""))
      );

    if (filters.phone)
      filtered = filtered.filter((apt) =>
        apt.phone?.replace(/\D/g, "").includes(filters.phone.replace(/\D/g, ""))
      );

    // 🔽 Ordenação
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a[sortConfig.key] || "").toString().toLowerCase();
        const bValue = (b[sortConfig.key] || "").toString().toLowerCase();
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredAppointments(filtered);
  }, [filters, appointments, sortConfig]);

  // 🧹 Limpar filtros
  const handleClearFilters = () => {
    setFilters({
      program: "",
      date: "",
      time: "",
      name: "",
      cpf: "",
      phone: "",
    });
  };

  // 🔽 Alternar ordenação
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // 🗑️ Excluir agendamento
  const handleDelete = async (id) => {
    if (window.confirm("Deseja excluir este agendamento?")) {
      await deleteAppointment(id);
      const updated = appointments.filter((apt) => apt.id !== id);
      setAppointments(updated);
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi removido com sucesso.",
      });
    }
  };

  // 🧠 Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Acesso Administrativo
          </h2>
          <Input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 text-center"
          />
          <Button onClick={handleLogin} className="w-full bg-cyan-500 text-white">
            Entrar
          </Button>
          <p className="text-gray-500 text-sm mt-4">
            * Acesso restrito aos administradores.
          </p>
        </div>
      </div>
    );
  }

  // ⚙️ Tela de configurações
  if (showSettings) {
    return <ScheduleSettings onClose={() => setShowSettings(false)} />;
  }

  // 🧩 Painel principal
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">
            Painel de Agendamentos
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={() => exportToExcel(filteredAppointments)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Exportar Excel
            </Button>
            <Button
              onClick={() => setShowSettings(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Configurações
            </Button>
            <Button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Fechar Painel
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-6">
          <select
            name="program"
            value={filters.program}
            onChange={(e) =>
              setFilters({ ...filters, program: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Programa</option>
            <option value="FIES">FIES</option>
            <option value="PROUNI">PROUNI</option>
          </select>

          <Input
            type="date"
            name="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <Input
            type="time"
            name="time"
            value={filters.time}
            onChange={(e) => setFilters({ ...filters, time: e.target.value })}
          />
          <Input
            type="text"
            name="name"
            placeholder="Nome"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <Input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={filters.cpf}
            onChange={(e) => setFilters({ ...filters, cpf: e.target.value })}
          />
          <Input
            type="text"
            name="phone"
            placeholder="Telefone"
            value={filters.phone}
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
          />
          <Button
            onClick={handleClearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Limpar
          </Button>
        </div>

        {/* Tabela */}
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhum agendamento encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    { label: "Programa", key: "program" },
                    { label: "Nome", key: "name" },
                    { label: "CPF", key: "cpf" },
                    { label: "Telefone", key: "phone" },
                    { label: "Data", key: "date" },
                    { label: "Hora", key: "time" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="border p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {col.label}{" "}
                      {sortConfig.key === col.key
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                  ))}
                  <th className="border p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="border p-2">{apt.program}</td>
                    <td className="border p-2">{apt.name}</td>
                    <td className="border p-2">{apt.cpf}</td>
                    <td className="border p-2">{apt.phone}</td>
                    <td className="border p-2">{apt.date}</td>
                    <td className="border p-2">{apt.time}</td>
                    <td className="border p-2 text-center">
                      <Button
                        onClick={() => handleDelete(apt.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
