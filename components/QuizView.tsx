
import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion, QuizDifficulty, TopicId } from '../types';
import { Loader2, Check, X, Award, ArrowLeft } from 'lucide-react';

interface QuizViewProps {
    topicId: TopicId;
    onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ topicId, onBack }) => {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(QuizDifficulty.BEGINNER);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const loadQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setShowResult(false);
    setScore(0);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);

    const qs = await generateQuizQuestions(topicId, difficulty);
    setQuestions(qs);
    setLoading(false);
  };

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, topicId]);

  const handleAnswer = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(option);
    setIsAnswerChecked(true);
    if (option === questions[currentQIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-pulse">
        <Loader2 size={64} className="text-french-blue animate-spin" />
        <div className="text-center">
            <p className="text-xl font-bold text-slate-800">Generazione Quiz AI...</p>
            <p className="text-slate-500 mt-2">Argomento: {topicId === TopicId.COD ? 'Pronomi COD' : 'Imperativo'}</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-6 text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <Award size={48} className="text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completato!</h2>
        <p className="text-slate-600 mb-8">Hai risposto correttamente a <span className="font-bold text-french-blue text-xl">{score}</span> su <span className="font-bold text-xl">{questions.length}</span> domande.</p>
        
        <div className="flex gap-4">
            <button 
                onClick={onBack}
                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 transition-all"
            >
                Torna al Menu
            </button>
            <button 
                onClick={loadQuiz}
                className="px-8 py-3 bg-french-blue text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
            >
                Nuovo Quiz
            </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-slate-600 mb-4">Errore nel caricamento delle domande AI.</p>
        <button onClick={onBack} className="text-french-blue underline mr-4">Indietro</button>
        <button onClick={loadQuiz} className="px-4 py-2 bg-french-blue text-white rounded-lg">Riprova</button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full mr-2">
             <ArrowLeft size={20} className="text-slate-500"/>
        </button>
        <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-french-blue uppercase tracking-wider">{topicId === TopicId.COD ? 'Pronomi' : 'Imperativo'}</span>
                <span className="text-sm font-bold text-slate-400">{currentQIndex + 1}/{questions.length}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                    className="bg-french-blue h-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
             {Object.values(QuizDifficulty).map((d) => (
               <button
                 key={d}
                 onClick={() => !isAnswerChecked && setDifficulty(d)}
                 disabled={isAnswerChecked}
                 className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${difficulty === d ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {d}
               </button>
             ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-serif font-medium text-slate-800 mb-8 leading-tight text-center">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let buttonStyle = "bg-white border-slate-200 hover:border-french-blue hover:bg-slate-50";
            
            if (isAnswerChecked) {
               if (option === currentQ.correctAnswer) {
                 buttonStyle = "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
               } else if (option === selectedAnswer) {
                 buttonStyle = "bg-red-50 border-red-500 text-red-800";
               } else {
                 buttonStyle = "opacity-40 bg-slate-50 border-slate-200";
               }
            } else if (selectedAnswer === option) {
               buttonStyle = "bg-french-blue border-french-blue text-white";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={isAnswerChecked}
                className={`w-full p-5 rounded-2xl border-2 text-left text-lg font-medium transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
              >
                <span>{option}</span>
                {isAnswerChecked && option === currentQ.correctAnswer && <Check size={24} className="text-green-600" />}
                {isAnswerChecked && option === selectedAnswer && option !== currentQ.correctAnswer && <X size={24} className="text-red-600" />}
              </button>
            );
          })}
        </div>

        {isAnswerChecked && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-slate-800 p-5 rounded-2xl text-slate-200 mb-4 shadow-lg">
               <div className="flex items-center gap-2 mb-2 text-yellow-400 font-bold uppercase text-xs tracking-wide">
                    <Award size={14} /> Spiegazione
               </div>
               <p className="leading-relaxed">{currentQ.explanation}</p>
             </div>
             <button 
               onClick={nextQuestion}
               className="w-full py-4 bg-french-blue text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-700 transition-all hover:scale-[1.02]"
             >
               {currentQIndex < questions.length - 1 ? 'Prossima Domanda →' : 'Vedi Risultati'}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
