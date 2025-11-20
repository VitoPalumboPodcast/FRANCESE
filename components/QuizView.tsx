import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion, QuizDifficulty } from '../types';
import { Loader2, Check, X, Award } from 'lucide-react';

const QuizView: React.FC = () => {
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

    const qs = await generateQuizQuestions(difficulty);
    setQuestions(qs);
    setLoading(false);
  };

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

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
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
        <Loader2 size={48} className="text-french-blue animate-spin" />
        <p className="text-slate-500 font-medium">Generazione Quiz con Gemini AI...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-6 text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <Award size={48} className="text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completato!</h2>
        <p className="text-slate-600 mb-8">Hai risposto correttamente a <span className="font-bold text-french-blue">{score}</span> su <span className="font-bold">{questions.length}</span> domande.</p>
        
        <button 
          onClick={loadQuiz}
          className="px-8 py-3 bg-french-blue text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
        >
          Nuovo Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center mt-20">
        <p>Errore nel caricamento delle domande. Riprova.</p>
        <button onClick={loadQuiz} className="text-french-blue underline">Ricarica</button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficoltà</label>
           <div className="flex gap-2 mt-1">
             {Object.values(QuizDifficulty).map((d) => (
               <button
                 key={d}
                 onClick={() => !isAnswerChecked && setDifficulty(d)}
                 disabled={isAnswerChecked}
                 className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${difficulty === d ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}
               >
                 {d}
               </button>
             ))}
           </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-slate-500">Domanda {currentQIndex + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <h3 className="text-2xl font-serif font-medium text-slate-800 mb-8 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let buttonStyle = "bg-white border-slate-200 hover:border-french-blue hover:bg-slate-50";
            
            if (isAnswerChecked) {
               if (option === currentQ.correctAnswer) {
                 buttonStyle = "bg-green-100 border-green-500 text-green-800";
               } else if (option === selectedAnswer) {
                 buttonStyle = "bg-red-100 border-red-500 text-red-800";
               } else {
                 buttonStyle = "opacity-50 bg-slate-50 border-slate-200";
               }
            } else if (selectedAnswer === option) {
               buttonStyle = "bg-french-blue border-french-blue text-white";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={isAnswerChecked}
                className={`w-full p-4 rounded-xl border-2 text-left text-lg transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
              >
                <span>{option}</span>
                {isAnswerChecked && option === currentQ.correctAnswer && <Check size={20} />}
                {isAnswerChecked && option === selectedAnswer && option !== currentQ.correctAnswer && <X size={20} />}
              </button>
            );
          })}
        </div>

        {isAnswerChecked && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-indigo-900 mb-4">
               <p className="font-bold text-sm uppercase mb-1 text-indigo-400">Spiegazione</p>
               {currentQ.explanation}
             </div>
             <button 
               onClick={nextQuestion}
               className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition-all"
             >
               {currentQIndex < questions.length - 1 ? 'Prossima Domanda' : 'Vedi Risultati'}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;