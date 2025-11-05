// src/components/CalendarStep.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAppointments } from '@/lib/storage';
import { getAgendaConfig } from '@/lib/config';

const defaultConfig = {
  startDate: "2026-02-02",
  endDate: "2026-02-20",
  daysOfWeek: [1,2,3,4,5],
  startHour: 11,
  endHour: 18,
  interval: 30
};

const CalendarStep = ({ formData, onSlotSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [config, setConfig] = useState(defaultConfig);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const conf = await getAgendaConfig();
      if (conf) {
        setConfig({ ...defaultConfig, ...conf });
      } else {
        setConfig(defaultConfig);
      }

      const apts = await getAppointments();
      setAppointments(Array.isArray(apts) ? apts : []);
      setLoading(false);
    };
    load();
  }, []);

  const generateAvailableDates = () => {
    const dates = [];
    const [y1, m1, d1] = config.startDate.split("-").map(Number);
    const [y2, m2, d2] = config.endDate.split("-").map(Number);
    // note: month in Date is 0-based
    const startDate = new Date(y1, m1 - 1, d1);
    const endDate = new Date(y2, m2 - 1, d2);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (config.daysOfWeek.includes(dayOfWeek)) {
        dates.push(new Date(d));
      }
    }

    return dates;
  };

  const generateTimeSlots = () => {
    const slots = [];
    const interval = Number(config.interval) || 30;
    const start = Number(config.startHour);
    const end = Number(config.endHour);

    for (let h = start; h <= end; h++) {
      for (let m = 0; m < 60; m += interval) {
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        // Excluir horários depois do endHour:00 (exemplo endHour=18 -> allow 18:00 only)
        if (h === end && m > 0) continue;
        slots.push(time);
      }
    }

    // garantir que endHour:00 esteja presente
    const endTime = `${String(end).padStart(2, '0')}:00`;
    if (!slots.includes(endTime)) slots.push(endTime);

    // remover duplicados e ordenar
    return Array.from(new Set(slots));
  };

  const isSlotBooked = (date, time) => {
    if (!Array.isArray(appointments)) return false;
    const dateStr = date.toISOString().split('T')[0];
    return appointments.some(apt => apt.date === dateStr && apt.time === time);
  };

  const handleSlotClick = (date, time) => {
    if (isSlotBooked(date, time)) {
      toast({ title: "Horário indisponível", description: "Este horário já foi agendado.", variant: "destructive" });
      return;
    }

    onSlotSelect({
      date: date.toISOString().split('T')[0],
      time
    });
  };

  if (loading) return <p className="text-center text-gray-500">Carregando...</p>;

  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();

  return (
    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="mr-2 h-5 w-5" /> Voltar
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">Selecione Data e Horário</h2>
          <div className="w-24"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4"><Calendar className="h-5 w-5 text-cyan-500" /><h3 className="font-semibold text-gray-700">Datas Disponíveis</h3></div>
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
              {availableDates.map((date, index) => (
                <Button key={index} onClick={() => setSelectedDate(date)} className={`h-auto py-3 rounded-xl transition-all ${selectedDate?.toDateString() === date.toDateString() ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <div className="text-center">
                    <div className="text-xs font-medium">{date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</div>
                    <div className="text-lg font-bold">{date.getDate().toString().padStart(2, '0')}</div>
                    <div className="text-xs">{date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4"><Clock className="h-5 w-5 text-cyan-500" /><h3 className="font-semibold text-gray-700">{selectedDate ? 'Horários Disponíveis' : 'Selecione uma data'}</h3></div>

            {selectedDate ? (
              <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2">
                {timeSlots.map((time, index) => {
                  const isBooked = isSlotBooked(selectedDate, time);
                  return (
                    <Button key={index} onClick={() => handleSlotClick(selectedDate, time)} disabled={isBooked} className={`h-12 rounded-xl font-semibold transition-all ${isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'}`}>
                      {time}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400"><p>Selecione uma data para ver os horários</p></div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarStep;
