import * as XLSX from 'xlsx';

export const exportToExcel = (appointments) => {
  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const dataToExport = appointments.map(apt => ({
    'Programa': apt.program,
    'Nome': apt.name,
    'CPF': formatCPF(apt.cpf),
    'Data do agendamento': formatDate(apt.date),
    'Horário do agendamento': apt.time,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Agendamentos');

  // Auto-ajustar largura das colunas
  const cols = [
    { wch: 15 }, // Programa
    { wch: 40 }, // Nome
    { wch: 20 }, // CPF
    { wch: 20 }, // Data do agendamento
    { wch: 20 }, // Horário do agendamento
  ];
  worksheet['!cols'] = cols;

  XLSX.writeFile(workbook, `agendamentos_${new Date().toISOString().split('T')[0]}.xlsx`);
};