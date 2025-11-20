import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LearnView from './components/LearnView';
import QuizView from './components/QuizView';
import RoleplayView from './components/RoleplayView';
import { ViewState } from './types';
import { Sparkles } from 'lucide-react';

const Dashboard: React.FC<{ setView: (v: ViewState) => void }> = ({ setView }) => (
  <div className="p-6 md:p-10 max-w-6xl mx-auto">
    <div className="mb-12 text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
        Bonjour, <span className="text-french-blue">Étudiant</span>.
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl">
        Pronto a padroneggiare l'arte del comando? L'imperativo è la chiave per farsi ascoltare in Francia.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <button 
        onClick={() => setView(ViewState.LEARN)}
        className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 text-left"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="text-9xl font-serif text-french-blue">1</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-french-blue transition-colors">Le Basi</h3>
        <p className="text-slate-500 mb-6">Grammatica, eccezioni e pronomi.</p>
        <div className="inline-flex items-center text-french-blue font-bold text-sm uppercase tracking-wide">
          Inizia <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </button>

      <button 
        onClick={() => setView(ViewState.QUIZ)}
        className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left text-white"
      >
        <div className="absolute top-4 right-4">
          <Sparkles className="text-yellow-400 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Mettiti alla prova</h3>
        <p className="text-slate-300 mb-6">Quiz generati dall'AI infiniti.</p>
        <div className="inline-flex items-center text-white font-bold text-sm uppercase tracking-wide opacity-80 group-hover:opacity-100">
          Gioca <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </button>

      <button 
        onClick={() => setView(ViewState.ROLEPLAY)}
        className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 text-left"
      >
         <div className="absolute top-0 right-0 w-32 h-32 bg-french-red rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity -mr-10 -mt-10"></div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-french-red transition-colors">Sfida Pierre</h3>
        <p className="text-slate-500 mb-6">Simulazione reale con un Robot scontroso.</p>
        <div className="inline-flex items-center text-french-red font-bold text-sm uppercase tracking-wide">
          Chatta <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </button>
    </div>

    <div className="mt-12 p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h4 className="text-xl font-bold text-slate-800 mb-2">Il consiglio del giorno</h4>
        <p className="text-slate-600 italic">"Per i verbi in -ER come 'Manger', ricorda di togliere la 's' alla seconda persona singolare: 'Mange !', non 'Manges !'."</p>
      </div>
      <div className="shrink-0">
        <span className="text-4xl">🥐</span>
      </div>
    </div>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
        {/* Background elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="h-full">
          {currentView === ViewState.HOME && <Dashboard setView={setCurrentView} />}
          {currentView === ViewState.LEARN && <LearnView />}
          {currentView === ViewState.QUIZ && <QuizView />}
          {currentView === ViewState.ROLEPLAY && <RoleplayView />}
        </div>
      </main>
    </div>
  );
}

export default App;