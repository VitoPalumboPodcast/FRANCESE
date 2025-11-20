import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, Type } from 'lucide-react';
import { LessonSection } from '../types';

const lessons: LessonSection[] = [
  {
    id: 'basics',
    title: 'Formazione e Basi',
    content: "L'imperativo è privo di soggetto esplicito. Si usa per ordini e consigli. Esiste solo per tre persone: Tu, Nous, Vous.",
    examples: [
      { french: 'Parle !', italian: 'Parla! (Tu)', note: 'Verbi in -ER: perdi la "s" finale.' },
      { french: 'Finissons !', italian: 'Finiamo! (Nous)', note: 'Regolare come il presente.' },
      { french: 'Attendez !', italian: 'Aspettate! (Vous)', note: 'Regolare come il presente.' },
    ]
  },
  {
    id: 'irregulars',
    title: 'Irregolarità Importanti',
    content: "Alcuni verbi fondamentali cambiano radicale all'imperativo.",
    examples: [
      { french: 'Aie confiance !', italian: 'Abbi fiducia!', note: 'Avoir: Aie, Ayons, Ayez' },
      { french: 'Sois sage !', italian: 'Sii bravo!', note: 'Être: Sois, Soyons, Soyez' },
      { french: 'Viens ici !', italian: 'Vieni qui!', note: 'Venir: Viens, Venons, Venez' },
    ]
  },
  {
    id: 'cod',
    title: 'Posizione dei Pronomi (COD)',
    content: "La posizione cambia se la frase è affermativa o negativa.",
    examples: [
      { french: 'Regarde-la !', italian: 'Guardala!', note: 'Affermativo: dopo il verbo con trattino.' },
      { french: 'Ne la regarde pas !', italian: 'Non guardarla!', note: 'Negativo: prima del verbo.' },
      { french: 'Mange-le !', italian: 'Mangialo!', note: 'Affermativo.' }
    ]
  },
  {
    id: 'reflexive',
    title: 'Verbi Riflessivi',
    content: "I pronomi riflessivi vanno dopo il verbo nell'affermativo. Attenzione a 'Me' e 'Te'.",
    examples: [
      { french: 'Lève-toi !', italian: 'Alzati!', note: 'Te diventa Toi.' },
      { french: 'Ne te lève pas.', italian: 'Non alzarti.', note: 'Torna normale nel negativo.' },
      { french: 'Promenons-nous.', italian: 'Passeggiamo.', note: '' }
    ]
  }
];

const LearnView: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('basics');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">L'Impératif</h1>
        <p className="text-lg text-slate-600">
          Il modo del comando, del consiglio e dell'esortazione.
        </p>
      </header>

      <div className="space-y-6">
        {lessons.map((lesson) => (
          <div 
            key={lesson.id} 
            className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${
              openSection === lesson.id ? 'ring-2 ring-french-blue ring-opacity-50 shadow-lg' : 'hover:shadow-md'
            }`}
          >
            <button
              onClick={() => toggleSection(lesson.id)}
              className="w-full flex items-center justify-between p-6 bg-white text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${openSection === lesson.id ? 'bg-french-blue text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {lesson.id === 'basics' && <Type size={24} />}
                  {lesson.id === 'irregulars' && <AlertTriangle size={24} />}
                  {lesson.id === 'cod' && <Info size={24} />}
                  {lesson.id === 'reflexive' && <Info size={24} />}
                </div>
                <span className="text-xl font-bold text-slate-800">{lesson.title}</span>
              </div>
              {openSection === lesson.id ? <ChevronUp className="text-french-blue" /> : <ChevronDown className="text-slate-400" />}
            </button>

            {openSection === lesson.id && (
              <div className="p-6 pt-0 bg-white animate-in slide-in-from-top-2 duration-300">
                <div className="prose text-slate-600 mb-6 border-l-4 border-french-red pl-4 bg-red-50 py-2 rounded-r-lg">
                  {lesson.content}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.examples.map((ex, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-french-blue transition-colors cursor-default group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif text-lg font-bold text-french-blue">{ex.french}</span>
                        <button 
                           onClick={() => {
                             const u = new SpeechSynthesisUtterance(ex.french);
                             u.lang = 'fr-FR';
                             window.speechSynthesis.speak(u);
                           }}
                           className="opacity-0 group-hover:opacity-100 text-xs bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded text-slate-600 transition-opacity"
                        >
                          Ascolta
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 italic mb-2">{ex.italian}</p>
                      {ex.note && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded w-fit">
                          <Info size={12} />
                          {ex.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnView;