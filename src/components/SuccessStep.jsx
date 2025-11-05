import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  CreditCard,
  Award,
  Printer,
  PlusCircle,
} from 'lucide-react';

const SuccessStep = ({ appointment, onNewAppointment }) => {
  if (!appointment) return null;

  // 📅 Formata data
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 🔢 Formata CPF
  const formatCPF = (cpf) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  // 🖨️ Imprime comprovante
  const handlePrint = () => window.print();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto printable-area"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block"
          >
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Agendamento Realizado!
          </h2>
          <p className="text-gray-600">
            Seu comprovante de agendamento está pronto.
          </p>
        </div>

        {/* Informações */}
        <div className="space-y-4 mb-8">
          {/* Nome */}
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <User className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Nome Completo
              </p>
              <p className="text-lg font-bold text-gray-800">
                {appointment.name}
              </p>
            </div>
          </div>

          {/* CPF */}
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <CreditCard className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">CPF</p>
              <p className="text-lg font-bold text-gray-800">
                {formatCPF(appointment.cpf)}
              </p>
            </div>
          </div>

          {/* Programa */}
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <Award className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Programa</p>
              <p className="text-lg font-bold text-gray-800">
                {appointment.program}
              </p>
            </div>
          </div>

          {/* Data */}
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <Calendar className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Data</p>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {formatDate(appointment.date)}
              </p>
            </div>
          </div>

          {/* Horário */}
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <Clock className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Horário</p>
              <p className="text-lg font-bold text-gray-800">
                {appointment.time}
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-4 no-print">
          <Button
            onClick={onNewAppointment}
            variant="outline"
            className="flex-1 h-14 rounded-xl border-2 border-gray-300 hover:bg-gray-100 font-semibold"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Novo Agendamento
          </Button>

          <Button
            onClick={handlePrint}
            className="flex-1 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Printer className="mr-2 h-5 w-5" />
            Imprimir / Salvar PDF
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessStep;
