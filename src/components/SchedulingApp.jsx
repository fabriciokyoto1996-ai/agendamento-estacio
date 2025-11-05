import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormStep from '@/components/FormStep';
import CalendarStep from '@/components/CalendarStep';
import ConfirmationStep from '@/components/ConfirmationStep';
import SuccessStep from '@/components/SuccessStep';
import AdminPanel from '@/components/AdminPanel';
import { Settings, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SchedulingApp = () => {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    program: '',
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = 'Ak7vie9@'; // 🔒 altere aqui

  // Etapas do agendamento
  const handleFormSubmit = (data) => setFormData(data) || setStep('calendar');
  const handleSlotSelect = (slot) => setSelectedSlot(slot) || setStep('confirmation');
  const handleConfirm = (appointment) => setLastAppointment(appointment) || setStep('success');
  const handleCancelConfirmation = () => setStep('calendar');
  const handleNewAppointment = () => {
    setStep('form');
    setFormData({ name: '', cpf: '', program: '' });
    setSelectedSlot(null);
    setLastAppointment(null);
  };

  // 🔐 Autenticação simples
  const handleOpenAdmin = () => {
    const authenticated = localStorage.getItem('admin-auth') === 'true';
    if (authenticated) {
      setShowAdmin(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handleCheckPassword = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin-auth', 'true');
      setShowPasswordModal(false);
      setPassword('');
      setError('');
      setShowAdmin(true);
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('admin-auth');
    setShowAdmin(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo decorativo */}
      <div className="geometric-bg no-print">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
      </div>

      {/* Modal de senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
          >
            <Lock className="mx-auto text-cyan-500 w-12 h-12 mb-4" />
            <h2 className="text-xl font-bold mb-2 text-gray-800">Acesso Restrito</h2>
            <p className="text-gray-500 mb-4">Digite a senha para entrar no painel administrativo</p>

            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex gap-3">
              <Button
                onClick={handleCheckPassword}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
              >
                Entrar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 no-print"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            PROCESSO SELETIVO
          </h1>
        </motion.div>

        {/* Botão Admin */}
        <Button
          onClick={handleOpenAdmin}
          className="fixed top-4 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm no-print"
          size="icon"
        >
          <Settings className="h-5 w-5 text-white" />
        </Button>

        {/* Conteúdo principal */}
        <AnimatePresence mode="wait">
          {showAdmin ? (
            <AdminPanel key="admin" onClose={handleLogoutAdmin} />
          ) : (
            <>
              {step === 'form' && (
                <FormStep key="form" onSubmit={handleFormSubmit} />
              )}
              {step === 'calendar' && (
                <CalendarStep
                  key="calendar"
                  formData={formData}
                  onSlotSelect={handleSlotSelect}
                  onBack={handleNewAppointment}
                />
              )}
              {step === 'confirmation' && (
                <ConfirmationStep
                  key="confirmation"
                  formData={formData}
                  selectedSlot={selectedSlot}
                  onConfirm={handleConfirm}
                  onCancel={handleCancelConfirmation}
                />
              )}
              {step === 'success' && (
                <SuccessStep
                  key="success"
                  appointment={lastAppointment}
                  onNewAppointment={handleNewAppointment}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SchedulingApp;
