import React from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import SchedulingApp from '@/components/SchedulingApp';

function App() {
  return (
    <>
      <Helmet>
        <title>Processo Seletivo - Agendamento</title>
        <meta name="description" content="Sistema de agendamento para processo seletivo FIES e PROUNI" />
      </Helmet>
      <main id="app-container">
        <SchedulingApp />
      </main>
      <Toaster />
    </>
  );
}

export default App;