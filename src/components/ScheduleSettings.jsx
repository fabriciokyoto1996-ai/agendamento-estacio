// src/components/ScheduleSettings.jsx
import React, { useEffect, useState } from "react";
import { saveAgendaConfig, getAgendaConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const DEFAULT = {
  startDate: "2026-02-02",
  endDate: "2026-02-20",
  daysOfWeek: [1,2,3,4,5], // 0=Dom,1=Seg...
  startHour: 11,
  endHour: 18,
  interval: 30
};

const Weekday = ({ value, checked, onChange, label }) => (
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(value)}
    />
    <span className="text-sm">{label}</span>
  </label>
);

export default function ScheduleSettings({ onClose }) {
  const { toast } = useToast();
  const [config, setConfig] = useState(DEFAULT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const remote = await getAgendaConfig();
      if (!mounted) return;
      if (remote) setConfig({ ...DEFAULT, ...remote });
    })();
    return () => { mounted = false; };
  }, []);

  const toggleDay = (day) => {
    setConfig((c) => {
      const has = c.daysOfWeek.includes(day);
      return {
        ...c,
        daysOfWeek: has ? c.daysOfWeek.filter(d => d !== day) : [...c.daysOfWeek, day]
      };
    });
  };

  const handleSave = async () => {
    // validações simples
    if (new Date(config.startDate) > new Date(config.endDate)) {
      toast({ title: "Erro", description: "Data inicial maior que final", variant: "destructive" });
      return;
    }
    if (config.startHour >= config.endHour) {
      toast({ title: "Erro", description: "Hora inicial deve ser menor que hora final", variant: "destructive" });
      return;
    }
    if (!Array.isArray(config.daysOfWeek) || config.daysOfWeek.length === 0) {
      toast({ title: "Erro", description: "Selecione ao menos 1 dia da semana", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await saveAgendaConfig({
        ...config,
        // garantir tipos corretos
        startHour: Number(config.startHour),
        endHour: Number(config.endHour),
        interval: Number(config.interval)
      });
      toast({ title: "Salvo", description: "Configuração atualizada com sucesso." });
      if (onClose) onClose();
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao salvar. Veja console.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold mb-4">Configuração de Agenda</h3>

      <div className="grid gap-3">
        <label className="text-sm">
          Data inicial
          <input type="date" value={config.startDate}
            onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
            className="w-full p-2 border rounded mt-1" />
        </label>

        <label className="text-sm">
          Data final
          <input type="date" value={config.endDate}
            onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
            className="w-full p-2 border rounded mt-1" />
        </label>

        <div className="text-sm">
          Dias da semana permitidos
          <div className="grid grid-cols-4 gap-2 mt-2">
            <Weekday value={1} checked={config.daysOfWeek.includes(1)} onChange={toggleDay} label="Seg" />
            <Weekday value={2} checked={config.daysOfWeek.includes(2)} onChange={toggleDay} label="Ter" />
            <Weekday value={3} checked={config.daysOfWeek.includes(3)} onChange={toggleDay} label="Qua" />
            <Weekday value={4} checked={config.daysOfWeek.includes(4)} onChange={toggleDay} label="Qui" />
            <Weekday value={5} checked={config.daysOfWeek.includes(5)} onChange={toggleDay} label="Sex" />
            <Weekday value={0} checked={config.daysOfWeek.includes(0)} onChange={toggleDay} label="Dom" />
            <Weekday value={6} checked={config.daysOfWeek.includes(6)} onChange={toggleDay} label="Sab" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <label className="text-sm">
            Hora início (hora inteira)
            <input type="number" min={0} max={23} value={config.startHour}
              onChange={(e) => setConfig({ ...config, startHour: e.target.value })} className="w-full p-2 border rounded mt-1" />
          </label>

          <label className="text-sm">
            Hora fim (hora inteira)
            <input type="number" min={0} max={23} value={config.endHour}
              onChange={(e) => setConfig({ ...config, endHour: e.target.value })} className="w-full p-2 border rounded mt-1" />
          </label>

          <label className="text-sm">
            Intervalo (minutos)
            <select value={config.interval} onChange={(e) => setConfig({ ...config, interval: Number(e.target.value) })}
              className="w-full p-2 border rounded mt-1">
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3 mt-4">
          <Button onClick={handleSave} className="bg-green-500 text-white" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Configuração"}
          </Button>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}
