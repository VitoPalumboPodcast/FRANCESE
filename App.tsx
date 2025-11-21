
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LearnView from './components/LearnView';
import QuizView from './components/QuizView';
import RoleplayView from './components/RoleplayView';
import { ViewState, TopicId, ModuleData } from './types';
import { Sparkles, BookOpen, MessageSquare, Lock, ArrowRight, Check } from 'lucide-react';

// Course Data
const modules: ModuleData[] = [
    {
        id: TopicId.COD,
        title: "1. Pronomi COD",
        description: "Impara a dire 'Lo mangio', 'La guardo' invece di ripetere i nomi.",
        icon: "🍎",
        unlocked: true,
        progress: 80
    },
    {
        id: TopicId.IMPERATIF,
        title: "2. L'Imperativo",
        description: "Dai ordini e consigli. Attenzione: qui i pronomi cambiano posto!",
        icon: "👉",
        unlocked: true,
        progress: 50
    },
    {
        id: TopicId.VERBI_IR, 
        title: "3. Verbi in -IR (2° Gr.)",
        description: "Finir, Choisir, Grossir. Il segreto è nel ponte 'ISS'.",
        icon: "🚀",
        unlocked: true,
        progress: 20
    },
    {
        id: TopicId.ORIENTATION,
        title: "4. Orientamento",
        description: "Scusi, per andare alla stazione? Impara a chiedere e dare indicazioni.",
        icon: "🗺️",
        unlocked: true,
        progress: 10
    },
    {
        id: TopicId.LYON, 
        title: "5. Culture: Lyon",
        description: "Un viaggio tra i fiumi, la gastronomia e il quartiere moderno Confluence.",
        icon: "🏙️",
        unlocked: true,
        progress: 0
    }
];

const CourseMap: React.FC<{ onSelectModule: (m: TopicId, view: ViewState) => void }> = ({ onSelectModule }) => (
  <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
    <div className="mb-12 text-center">
      <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
        Corso di Francese
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        Un percorso passo dopo passo. Padroneggia i pronomi, l'imperativo e scopri la cultura francese.
      </p>
    </div>

    <div className="space-y-8 relative before:absolute before:left-8 md:before:left-1/2 before:top-10 before:bottom-10 before:w-1 before:bg-slate-200 before:-z-10">
      {modules.map((module, index) => (
        <div key={module.id} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
          
          {/* Connector Dot */}
          <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-white border-4 border-slate-300 rounded-full -translate-x-1.5 md:-translate-x-2"></div>

          {/* Content Card */}
          <div className={`flex-1 w-full md:w-[calc(50%-2rem)] ${!module.unlocked && 'opacity-60 grayscale pointer-events-none'}`}>
             <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                {/* Progress Bar Background */}
                <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
                    <div className="h-full bg-green-400" style={{width: `${module.progress}%`}}></div>
                </div>

                <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl shadow-sm bg-slate-50 rounded-2xl w-16 h-16 flex items-center justify-center border border-slate-100">
                        {module.unlocked ? module.icon : <Lock size={24} className="text-slate-400"/>}
                    </span>
                    {module.unlocked && module.progress === 100 && (
                        <div className="bg-green-100 text-green-700 p-2 rounded-full"><Check size={16} strokeWidth={3}/></div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-2">{module.title}</h3>
                <p className="text-slate-500 mb-6">{module.description}</p>

                {module.unlocked ? (
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => onSelectModule(module.id, ViewState.LEARN)}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-french-blue hover:bg-french-blue hover:text-white transition-colors"
                        >
                            <BookOpen size={20} className="mb-1"/>
                            <span className="text-xs font-bold uppercase">Scopri</span>
                        </button>
                        <button 
                            onClick={() => onSelectModule(module.id, ViewState.QUIZ)}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
                        >
                            <Sparkles size={20} className="mb-1"/>
                            <span className="text-xs font-bold uppercase">Quiz</span>
                        </button>
                        <button 
                            onClick={() => onSelectModule(module.id, ViewState.ROLEPLAY)}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                        >
                            <MessageSquare size={20} className="mb-1"/>
                            <span className="text-xs font-bold uppercase">Guida</span>
                        </button>
                    </div>
                ) : (
                    <div className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl text-center font-bold text-sm uppercase">
                        Bloccato
                    </div>
                )}
             </div>
          </div>

          {/* Spacer for layout balance */}
          <div className="flex-1 hidden md:block"></div>
        </div>
      ))}
    </div>

    <div className="mt-20 text-center">
        <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all flex items-center mx-auto gap-2">
            Sblocca Prossimi Livelli <ArrowRight size={20} />
        </button>
    </div>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [activeTopic, setActiveTopic] = useState<TopicId>(TopicId.COD);

  const handleModuleSelect = (topic: TopicId, view: ViewState) => {
      setActiveTopic(topic);
      setCurrentView(view);
  };

  const goBack = () => {
      setCurrentView(ViewState.HOME);
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth">
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="h-full">
          {currentView === ViewState.HOME && <CourseMap onSelectModule={handleModuleSelect} />}
          {currentView === ViewState.LEARN && <LearnView topicId={activeTopic} onBack={goBack} />}
          {currentView === ViewState.QUIZ && <QuizView topicId={activeTopic} onBack={goBack} />}
          {currentView === ViewState.ROLEPLAY && <RoleplayView topicId={activeTopic} onBack={goBack} />}
        </div>
      </main>
    </div>
  );
}

export default App;