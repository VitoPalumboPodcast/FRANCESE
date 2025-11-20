
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, Type, ArrowLeft, Book, CheckCircle2 } from 'lucide-react';
import { LessonSection, TopicId } from '../types';

// Content Database
const courseContent: Record<TopicId, { title: string; description: string; sections: LessonSection[] }> = {
  [TopicId.COD]: {
    title: "I Pronomi COD",
    description: "Evita le ripetizioni! Impara a usare le, la, les, l' come un vero francese.",
    sections: [
      {
        id: 'def',
        title: 'Cosa sono i COD?',
        content: "COD sta per 'Complément d'Objet Direct'. Rispondono alla domanda 'Chi?' o 'Che cosa?'. Servono a non ripetere un nome già menzionato.",
        examples: [
          { french: 'Je regarde la télé.', italian: 'Guardo la TV.', note: 'Senza pronome.' },
          { french: 'Je la regarde.', italian: 'La guardo.', note: '"La" sostituisce "la télé".' },
          { french: 'Il mange le gâteau.', italian: 'Mangia il dolce.', note: '' },
          { french: 'Il le mange.', italian: 'Lo mangia.', note: '"Le" sostituisce "le gâteau".' }
        ]
      },
      {
        id: 'forms',
        title: 'Le Forme dei Pronomi',
        content: "Ecco i pronomi che devi conoscere. Nota come 'Le' e 'La' diventano 'L'' davanti a vocale.",
        examples: [
          { french: 'Me / Te / Nous / Vous', italian: 'Mi / Ti / Ci / Vi', note: '1ª e 2ª persona.' },
          { french: 'Le / La', italian: 'Lo / La', note: '3ª singolare.' },
          { french: 'Les', italian: 'Li / Le', note: '3ª plurale (sia maschio che femmina).' },
          { french: 'Je l\'aime.', italian: 'Lo/La amo.', note: 'Elisione davanti a vocale!' }
        ]
      },
      {
        id: 'position',
        title: 'La Regola D\'Oro: Posizione',
        content: "A differenza dell'italiano che a volte li attacca alla fine (Guardalo), in francese i COD vanno quasi sempre PRIMA del verbo coniugato.",
        examples: [
          { french: 'Je te vois.', italian: 'Ti vedo.', note: 'Soggetto + Pronome + Verbo.' },
          { french: 'Tu les connais ?', italian: 'Li conosci?', note: '' },
          { french: 'Nous le prenons.', italian: 'Lo prendiamo.', note: '' }
        ]
      },
      {
        id: 'negation',
        title: 'La Negazione (Il Panino)',
        content: "Nella frase negativa, 'Ne' e 'Pas' circondano il blocco formato dal Pronome e dal Verbo. Non separarli mai!",
        examples: [
          { french: 'Je ne la regarde pas.', italian: 'Non la guardo.', note: 'Ne + Pronome + Verbo + Pas.' },
          { french: 'Il ne l\'aime pas.', italian: 'Non lo ama.', note: '' },
          { french: 'Nous ne les achetons pas.', italian: 'Non li compriamo.', note: '' }
        ]
      }
    ]
  },
  [TopicId.IMPERATIF]: {
    title: "L'Impératif",
    description: "Il modo del comando. L'unica grande eccezione alla posizione dei pronomi.",
    sections: [
      {
        id: 'basics',
        title: 'Formazione e Basi',
        content: "L'imperativo non ha soggetto esplicito. Esiste solo per tre persone: Tu, Nous, Vous.",
        examples: [
          { french: 'Parle !', italian: 'Parla! (Tu)', note: 'Verbi in -ER: perdi la "s".' },
          { french: 'Finissons !', italian: 'Finiamo! (Nous)', note: 'Regolare.' },
          { french: 'Attendez !', italian: 'Aspettate! (Vous)', note: 'Regolare.' },
        ]
      },
      {
        id: 'exception',
        title: 'L\'Eccezione COD',
        content: "Ecco il collegamento! Se l'ordine è AFFERMATIVO, il pronome va DOPO il verbo con un trattino. Se è NEGATIVO, torna tutto normale (PRIMA).",
        examples: [
          { french: 'Regarde-la !', italian: 'Guardala!', note: 'Affermativo: DOPO.' },
          { french: 'Ne la regarde pas !', italian: 'Non guardarla!', note: 'Negativo: PRIMA.' },
          { french: 'Mange-le !', italian: 'Mangialo!', note: 'Affermativo.' }
        ]
      },
      {
        id: 'irregulars',
        title: 'Irregolarità Importanti',
        content: "Verbi fondamentali che cambiano completamente.",
        examples: [
          { french: 'Aie confiance !', italian: 'Abbi fiducia!', note: 'Avoir' },
          { french: 'Sois sage !', italian: 'Sii bravo!', note: 'Être' },
          { french: 'Viens ici !', italian: 'Vieni qui!', note: 'Venir' },
        ]
      },
      {
        id: 'reflexive',
        title: 'Verbi Riflessivi',
        content: "Anche i riflessivi vanno dopo il verbo nell'affermativo. 'Te' diventa 'Toi'.",
        examples: [
          { french: 'Lève-toi !', italian: 'Alzati!', note: 'Te -> Toi.' },
          { french: 'Ne te lève pas.', italian: 'Non alzarti.', note: 'Torna normale nel negativo.' },
        ]
      }
    ]
  }
};

interface LearnViewProps {
  topicId: TopicId;
  onBack: () => void;
}

const LearnView: React.FC<LearnViewProps> = ({ topicId, onBack }) => {
  const data = courseContent[topicId];
  const [openSection, setOpenSection] = useState<string | null>(data.sections[0].id);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-french-blue mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} className="mr-2" />
        Torna al Corso
      </button>

      <header className="mb-10 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-lg">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-4xl font-serif font-bold mb-3">{data.title}</h1>
                <p className="text-lg text-slate-300 opacity-90">
                {data.description}
                </p>
            </div>
            <Book size={48} className="text-french-red opacity-80 hidden md:block" />
        </div>
      </header>

      <div className="space-y-6">
        {data.sections.map((lesson, idx) => (
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-serif transition-colors ${
                    openSection === lesson.id ? 'bg-french-blue text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {idx + 1}
                </div>
                <span className="text-xl font-bold text-slate-800">{lesson.title}</span>
              </div>
              {openSection === lesson.id ? <ChevronUp className="text-french-blue" /> : <ChevronDown className="text-slate-400" />}
            </button>

            {openSection === lesson.id && (
              <div className="p-6 pt-0 bg-white animate-in slide-in-from-top-2 duration-300">
                <div className="prose text-slate-600 mb-6 border-l-4 border-french-red pl-4 bg-red-50 py-4 rounded-r-lg text-lg leading-relaxed">
                  {lesson.content}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.examples.map((ex, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-french-blue transition-all cursor-default group hover:bg-blue-50/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-xl font-bold text-french-blue">{ex.french}</span>
                        <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             const u = new SpeechSynthesisUtterance(ex.french);
                             u.lang = 'fr-FR';
                             window.speechSynthesis.speak(u);
                           }}
                           className="opacity-100 md:opacity-0 group-hover:opacity-100 text-xs bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1 rounded-full text-slate-600 transition-all shadow-sm"
                        >
                          🔊
                        </button>
                      </div>
                      <p className="text-slate-600 mb-2 font-medium">{ex.italian}</p>
                      {ex.note && (
                        <div className="flex items-start gap-2 text-xs text-amber-700 font-medium bg-amber-50 px-3 py-2 rounded-lg w-full border border-amber-100">
                          <Info size={14} className="mt-0.5 shrink-0" />
                          <span>{ex.note}</span>
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
