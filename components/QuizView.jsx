
import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { UserLevel, TopicId } from '../types';
import { Loader2, Check, X, Award, ArrowLeft, Volume2, Flame, Sparkles, RotateCcw, Clock, Zap, Brain, Utensils, Train, Bike, Plane, Heart, Eye, Home, Camera, Landmark, Music, Sun, Coffee, ShoppingBag, Users, Smile } from 'lucide-react';

// Helper to get context icon (Duplicated for safety, ideally shared utility)
const getContextIcon = (text) => {
    const t = text.toLowerCase();
    if (t.includes('mang') || t.includes('faim') || t.includes('boir') || t.includes('bouchon') || t.includes('gâteau') || t.includes('délicieux')) return <Utensils size={32} className="text-orange-500"/>;
    if (t.includes('voiture') || t.includes('bus') || t.includes('train') || t.includes('métro') || t.includes('tram') || t.includes('gare')) return <Train size={32} className="text-blue-500"/>;
    if (t.includes('vélo') || t.includes('cyclable')) return <Bike size={32} className="text-green-500"/>;
    if (t.includes('avion')) return <Plane size={32} className="text-sky-500"/>;
    if (t.includes('aim') || t.includes('ador') || t.includes('coeur')) return <Heart size={32} className="text-red-500"/>;
    if (t.includes('regard') || t.includes('voir') || t.includes('yeux') || t.includes('lunettes')) return <Eye size={32} className="text-purple-500"/>;
    if (t.includes('maison') || t.includes('habiter') || t.includes('rue') || t.includes('ville')) return <Home size={32} className="text-indigo-500"/>;
    if (t.includes('cinéma') || t.includes('film') || t.includes('photo')) return <Camera size={32} className="text-pink-500"/>;
    if (t.includes('musée') || t.includes('art') || t.includes('basilique') || t.includes('château')) return <Landmark size={32} className="text-amber-600"/>;
    if (t.includes('chant') || t.includes('musique')) return <Music size={32} className="text-teal-500"/>;
    if (t.includes('soleil') || t.includes('été') || t.includes('chaud')) return <Sun size={32} className="text-yellow-500"/>;
    if (t.includes('café') || t.includes('thé')) return <Coffee size={32} className="text-amber-800"/>;
    if (t.includes('acheter') || t.includes('boutique') || t.includes('magasin') || t.includes('sac') || t.includes('vêtement') || t.includes('robe') || t.includes('pantalon')) return <ShoppingBag size={32} className="text-rose-500"/>;
    if (t.includes('ami') || t.includes('parent') || t.includes('famille') || t.includes('enfant') || t.includes('gens')) return <Users size={32} className="text-cyan-600"/>;
    if (t.includes('content') || t.includes('heureux') || t.includes('ravi')) return <Smile size={32} className="text-green-400"/>;
    
    return <Brain size={32} className="text-slate-400"/>; // Default
};

const QuizView = ({ topicId, onBack }) => {
  const [viewState, setViewState] = useState('SETUP');

  // Session Configuration State
  const [selectedLevel, setSelectedLevel] = useState(UserLevel.A2);
  const [selectedTime, setSelectedTime] = useState(5); // Minutes

  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [voices, setVoices] = useState([]);

  // TTS Setup
  useEffect(() => {
       const load = () => setVoices(window.speechSynthesis.getVoices());
       load();
       window.speechSynthesis.onvoiceschanged = load;
       return () => { window.speechSynthesis.onvoiceschanged = null; }
    }, []);

  const playAudio = (text) => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/\//g, ',')); 
      u.lang = 'fr-FR';
      const preferredVoice = voices.find(v => v.lang.startsWith('fr') && v.name.includes('Google')) ||
                             voices.find(v => v.lang.startsWith('fr'));
      if (preferredVoice) u.voice = preferredVoice;
      u.rate = 0.9;
      u.pitch = 1.05; 
      window.speechSynthesis.speak(u);
  }

  const playSound = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'complete') {
        const notes = [440, 554, 659]; 
        notes.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.frequency.value = freq;
            o.connect(g);
            g.connect(ctx.destination);
            g.gain.setValueAtTime(0.1, ctx.currentTime + i*0.1);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.1 + 1);
            o.start(ctx.currentTime + i*0.1);
            o.stop(ctx.currentTime + i*0.1 + 1);
        });
      }
    } catch (e) {
      // Audio context blocked
    }
  };

  // --- LOGIC: CALCULATE SESSION VOLUME ---
  const getQuestionCount = () => {
      let multiplier = 3; // Default for A1/A2 (20s per exercise)
      
      if (selectedLevel === UserLevel.B1 || selectedLevel === UserLevel.B2) {
          multiplier = 1.5; // Intermediate (40s per exercise)
      } else if (selectedLevel === UserLevel.C1 || selectedLevel === UserLevel.C2) {
          multiplier = 0.5; // Advanced (2m per exercise)
      }
      
      // Ensure at least 3 questions even for short C2 sessions
      return Math.max(3, Math.ceil(selectedTime * multiplier));
  };

  const startSession = async () => {
    setViewState('LOADING');
    setQuestions([]);
    setScore(0);
    setStreak(0);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);

    const count = getQuestionCount();
    console.log(`Generating ${count} questions for ${selectedLevel} in ${selectedTime}m`);

    const qs = await generateQuizQuestions(topicId, selectedLevel, count);
    
    if (qs.length > 0) {
        setQuestions(qs);
        setViewState('PLAYING');
    } else {
        // Fallback or error state could be handled here
        setViewState('SETUP');
    }
  };

  const handleAnswer = (option) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(option);
    setIsAnswerChecked(true);
    
    const currentQ = questions[currentQIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      if (!currentQ.question.includes("(Ripasso)")) {
          setScore(s => s + 1);
      }
      setStreak(s => s + 1);
      playSound('correct');
    } else {
      setStreak(0);
      playSound('wrong');
      
      // SRS LITE: Re-queue the question
      setQuestions(prev => {
          const newQ = { ...currentQ, question: currentQ.question.endsWith("(Ripasso)") ? currentQ.question : `${currentQ.question} (Ripasso)` };
          return [...prev, newQ];
      });
    }
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setViewState('RESULT');
      playSound('complete');
    }
  };

  // --- RENDER STATES ---

  if (viewState === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-pulse">
        <Loader2 size={64} className="text-french-blue animate-spin" />
        <div className="text-center">
            <p className="text-xl font-bold text-slate-800">L'AI sta preparando la sessione...</p>
            <p className="text-slate-500 mt-2">Livello: {selectedLevel} • {getQuestionCount()} Esercizi</p>
        </div>
      </div>
    );
  }

  if (viewState === 'RESULT') {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-6 text-center">
        <div className="relative">
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <Award size={64} className="text-yellow-600" />
            </div>
            <div className="absolute top-0 right-0 animate-bounce delay-700">
                <Sparkles className="text-yellow-400" size={32} />
            </div>
        </div>
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Sessione Completata!</h2>
        <p className="text-slate-600 mb-8 text-lg">Hai dominato <span className="font-bold text-french-blue">{questions.length}</span> concetti.</p>
        
        <div className="flex gap-4">
            <button 
                onClick={onBack}
                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 transition-all"
            >
                Menu
            </button>
            <button 
                onClick={() => setViewState('SETUP')}
                className="px-8 py-3 bg-french-blue text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
            >
                Nuova Sessione
            </button>
        </div>
      </div>
    );
  }

  if (viewState === 'SETUP') {
      return (
          <div className="max-w-3xl mx-auto p-6 h-full flex flex-col justify-center">
              <button onClick={onBack} className="absolute top-6 left-6 p-2 hover:bg-slate-100 rounded-full text-slate-500">
                  <ArrowLeft size={24}/>
              </button>
              
              <div className="text-center mb-10">
                  <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Configura la tua Sessione</h2>
                  <p className="text-slate-500">L'algoritmo adatterà il carico cognitivo alle tue esigenze.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                  {/* Level Selection */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                      <div className="flex items-center gap-2 mb-4 text-french-blue font-bold uppercase tracking-widest text-xs">
                          <Brain size={16}/> Livello CEFR
                      </div>
                      <div className="space-y-2">
                          {Object.values(UserLevel).map((lvl) => (
                              <button
                                key={lvl}
                                onClick={() => setSelectedLevel(lvl)}
                                className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all ${
                                    selectedLevel === lvl 
                                    ? 'bg-french-blue text-white shadow-md ring-2 ring-blue-200' 
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {lvl}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-6">
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 text-orange-500 font-bold uppercase tracking-widest text-xs">
                            <Clock size={16}/> Tempo Disponibile
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {[5, 10, 15, 20, 30].map((min) => (
                                <button
                                    key={min}
                                    onClick={() => setSelectedTime(min)}
                                    className={`flex justify-between items-center p-4 rounded-xl transition-all ${
                                        selectedTime === min
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="font-bold">{min} Minuti</span>
                                    {min === 5 && <span className="text-xs opacity-80">Caffè veloce</span>}
                                    {min === 15 && <span className="text-xs opacity-80">Standard</span>}
                                    {min === 30 && <span className="text-xs opacity-80">Deep Work</span>}
                                </button>
                            ))}
                        </div>
                      </div>

                      {/* Prediction Card */}
                      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Volume Previsto</p>
                          <div className="flex items-end gap-2">
                              <span className="text-5xl font-bold text-green-400">{getQuestionCount()}</span>
                              <span className="text-lg mb-1 font-medium">Esercizi</span>
                          </div>
                          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                              Basato sul livello {selectedLevel.split(' ')[0]}. 
                              Mix: 80% Ripasso, 20% Nuovi concetti.
                          </p>
                          <button 
                            onClick={startSession}
                            className="w-full mt-6 bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                              <Zap size={20} fill="currentColor"/> Inizia Sessione
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // VIEWSTATE: PLAYING
  const currentQ = questions[currentQIndex];
  const isCloze = currentQ.type === 'cloze';
  const isRepeat = currentQ.question.includes("(Ripasso)");

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full mr-2">
             <ArrowLeft size={20} className="text-slate-500"/>
        </button>
        <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-french-blue uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">
                        {topicId}
                    </span>
                    {isRepeat && (
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-100 px-2 py-1 rounded-md flex items-center gap-1">
                            <RotateCcw size={10}/> Ripasso
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {streak > 1 && (
                        <div className="flex items-center gap-1 text-orange-500 font-bold animate-pulse text-sm">
                            <Flame size={16} fill="currentColor" />
                            <span>Combo x{streak}</span>
                        </div>
                    )}
                    <span className="text-sm font-bold text-slate-400">{currentQIndex + 1}/{questions.length}</span>
                </div>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                    className="bg-french-blue h-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        
        {/* Render Question based on Type */}
        <div className="mb-10 text-center">
            {/* Visual Context Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-sm border border-slate-200">
                    {getContextIcon(currentQ.question)}
                </div>
            </div>

            {isCloze ? (
                <>
                    <p className="text-sm text-slate-400 uppercase font-bold tracking-widest mb-4">Completa la frase</p>
                    <h3 className="text-2xl md:text-3xl font-serif font-medium text-slate-800 leading-tight">
                        {currentQ.question.split('_______').map((part, i, arr) => (
                            <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                    <span className={`inline-block min-w-[80px] border-b-4 mx-2 px-2 transition-colors ${
                                        isAnswerChecked 
                                            ? (selectedAnswer === currentQ.correctAnswer ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600')
                                            : 'border-slate-300 text-french-blue'
                                    }`}>
                                        {selectedAnswer || "?"}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </h3>
                </>
            ) : (
                <h3 className="text-2xl md:text-3xl font-serif font-medium text-slate-800 mb-8 leading-tight text-center">
                  {currentQ.question}
                </h3>
            )}
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let buttonStyle = "bg-white border-slate-200 hover:border-french-blue hover:bg-slate-50 shadow-sm";
            
            if (isAnswerChecked) {
               if (option === currentQ.correctAnswer) {
                 buttonStyle = "bg-green-100 border-green-500 text-green-900 ring-1 ring-green-500 shadow-md transform scale-[1.01]";
               } else if (option === selectedAnswer) {
                 buttonStyle = "bg-red-50 border-red-500 text-red-800 opacity-90";
               } else {
                 buttonStyle = "opacity-40 bg-slate-50 border-slate-100 grayscale";
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
                {isAnswerChecked && option === currentQ.correctAnswer && <Check size={24} className="text-green-700" />}
                {isAnswerChecked && option === selectedAnswer && option !== currentQ.correctAnswer && <X size={24} className="text-red-600" />}
              </button>
            );
          })}
        </div>

        {isAnswerChecked && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-slate-800 p-5 rounded-2xl text-slate-200 mb-4 shadow-lg border border-slate-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <div className="flex items-center gap-2 mb-2 text-yellow-400 font-bold uppercase text-xs tracking-wide relative z-10">
                    <Award size={14} /> Spiegazione
               </div>
               <p className="leading-relaxed mb-4 text-slate-300 relative z-10">{currentQ.explanation}</p>
               
               {/* Example Section */}
               <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600 flex items-start gap-3 relative z-10">
                    <button 
                        onClick={() => playAudio(currentQ.exampleSentence?.french || currentQ.correctAnswer)}
                        className="bg-french-blue text-white p-3 rounded-full hover:bg-blue-600 transition-colors shrink-0 shadow-lg group"
                        title="Ascolta esempio"
                    >
                        <Volume2 size={20} className="group-hover:scale-110 transition-transform"/>
                    </button>
                    <div>
                        <p className="text-white font-serif italic text-lg">{currentQ.exampleSentence?.french}</p>
                        <p className="text-slate-400 text-sm">{currentQ.exampleSentence?.italian}</p>
                    </div>
               </div>
             </div>
             
             <button 
               onClick={nextQuestion}
               className="w-full py-4 bg-french-blue text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-95"
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
