import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getAppointments } from '@/lib/storage';

const FormStep = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('');
  const { toast } = useToast();

  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };

  const handleCPFChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setCpf(value);
    }
  };

  const handlePhoneChange = (e) => {
    // mantém apenas números e formata (XX) XXXXXXXX ou (XX) XXXXX-XXXX
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    setPhone(value);
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const validatePhone = (phone) => {
    const clean = phone.replace(/\D/g, '');
    return clean.length >= 10 && clean.length <= 11;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome completo.",
        variant: "destructive"
      });
      return;
    }

    if (!validateCPF(cpf)) {
      toast({
        title: "Erro",
        description: "CPF deve conter 11 dígitos.",
        variant: "destructive"
      });
      return;
    }

    if (!validatePhone(phone)) {
      toast({
        title: "Erro",
        description: "Telefone inválido. Insira DDD + número.",
        variant: "destructive"
      });
      return;
    }

    if (!program) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um programa (FIES ou PROUNI).",
        variant: "destructive"
      });
      return;
    }

    let appointments = [];
    try {
      appointments = await getAppointments();
      if (!Array.isArray(appointments)) appointments = [];
    } catch (err) {
      console.warn("Erro ao carregar agendamentos:", err);
      appointments = [];
    }

    const existingAppointment = appointments.find(apt => apt.cpf === cpf);

    if (existingAppointment) {
      toast({
        title: "Erro",
        description: "Este CPF já possui um agendamento.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({ name, cpf, phone, program });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700">
              SELECIONE O PROGRAMA
            </Label>
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setProgram('FIES')}
                className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                  program === 'FIES'
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                FIES
              </Button>
              <Button
                type="button"
                onClick={() => setProgram('PROUNI')}
                className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                  program === 'PROUNI'
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                PROUNI
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              NOME COMPLETO DO CANDIDATO
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-2 border-gray-200 focus:border-cyan-500"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700">
              CPF DO CANDIDATO
            </Label>
            <Input
              id="cpf"
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              className="h-12 rounded-xl border-2 border-gray-200 focus:border-cyan-500"
              placeholder="00000000000"
              maxLength={11}
            />
            <p className="text-xs text-red-500 font-medium">Apenas números</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
              TELEFONE CELULAR (COM DDD)
            </Label>
            <Input
              id="phone"
              type="text"
              value={formatPhone(phone)}
              onChange={handlePhoneChange}
              className="h-12 rounded-xl border-2 border-gray-200 focus:border-cyan-500"
              placeholder="(99) 99999-9999"
            />
            <p className="text-xs text-red-500 font-medium">Apenas números</p>
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            AGENDAR DIA E HORÁRIO
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default FormStep;
