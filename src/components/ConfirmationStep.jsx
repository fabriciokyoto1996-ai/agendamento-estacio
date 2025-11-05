import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, User, CreditCard, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { saveAppointment } from '@/lib/storage';

const ConfirmationStep = ({ formData, selectedSlot, onConfirm, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // 🗓️ Formata a data no estilo brasileiro
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 🔢 Formata o CPF
  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // 💾 Confirma e salva o agendamento no Firestore
  const handleConfirm = async () => {
    setLoading(true);

    try {
      const appointment = {
        name: formData.name,
        cpf: formData.cpf,
        program: formData.program,
        date: selectedSlot.date,
        time: selectedSlot.time,
        createdAt: new Date().toISOString(),
      };

      await saveAppointment(appointment);

      toast({
        title: "✅ Agendamento confirmado com sucesso!",
        description: `Seu horário foi reservado para ${selectedSlot.time} no dia ${formatDate(selectedSlot.date)}.`,
        duration: 5000,
      });

      onConfirm(appointment);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      toast({
        title: "Erro ao confirmar agendamento",
        description: "Ocorreu um problema ao salvar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        {/* Título */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block"
          >
            <CheckCircle className="h-20 w-20 text-cyan-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Confirme seu Agendamento
          </h2>
          <p className="text-gray-600">
            Revise as informações antes de confirmar
          </p>
        </div>

        {/* Detalhes do agendamento */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <User className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Nome Completo</p>
              <p className="text-lg font-bold text-gray-800">{formData.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <CreditCard className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">CPF</p>
              <p className="text-lg font-bold text-gray-800">{formatCPF(formData.cpf)}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <Award className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Programa</p>
              <p className="text-lg font-bold text-gray-800">{formData.program}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <Calendar className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Data</p>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {formatDate(selectedSlot.date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <Clock className="h-6 w-6 text-cyan-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-600">Horário</p>
              <p className="text-lg font-bold text-gray-800">{selectedSlot.time}</p>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-14 rounded-xl border-2 border-gray-300 hover:bg-gray-100 font-semibold"
            disabled={loading}
          >
            Voltar
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? "Confirmando..." : "Confirmar Agendamento"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmationStep;
