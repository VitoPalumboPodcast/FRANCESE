
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, ArrowLeft, RefreshCw, Mic, MicOff, AlertCircle, Dumbbell, ShieldAlert, MessageCircle, MapPin, Compass } from 'lucide-react';
import { getTutorResponse } from '../services/geminiService';
import { TopicId } from '../types';

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
}

interface RoleplayViewProps {
    topicId: TopicId;
    onBack: () => void;
}

// Type definition for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isUser }) => (
  <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
    <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm ${isUser ? 'bg-french-blue text-white' : 'bg-slate-800 text-white'}`}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className={`p-5 rounded-3xl text-sm md:text-base shadow-sm leading-relaxed whitespace-pre-wrap ${
        isUser 
          ? 'bg-french-blue text-white rounded-tr-none' 
          : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
      }`}>
        {text.split('*').map((part, i) => 
          i % 2 === 1 ? <span key={i} className="italic text-slate-500 block my-2 text-sm border-l-2 border-slate-300 pl-2">{part}</span> : part
        )}
      </div>
    </div>
  </div>
);

// Persona Configuration
const PERSONAS = {
    [TopicId.COD]: {
        name: "Pierre Curieux",
        role: "Robot Pettegolo",
        icon: <MessageCircle />,
        openers: [
            "Salut! Je suis Pierre. J'adore les ragots. Tu aimes les secrets? (Usa i pronomi 'le, la, les' per rispondermi!)",
            "Coucou! Tu as vu la nouvelle voiture du voisin? Tu la trouves belle? (Rispondi usando 'la')",
            "Dis-moi, tu regardes souvent la télé? (Usa 'la' o 'les' nella risposta)",
            "J'ai acheté des bonbons. Tu les veux? (Rispondi con 'les')"
        ]
    },
    [TopicId.IMPERATIF]: {
        name: "Sergent Pierre",
        role: "Istruttore Militare",
        icon: <ShieldAlert />,
        openers: [
            "Garde-à-vous! Je suis le Sergent Pierre. Dammi un ordine in francese (all'imperativo) e vedremo se sei capace di comandare!",
            "Soldat! Je m'ennuie! Ordine-mi di fare qualcosa! (Usa l'imperativo, es: 'Mange!')",
            "Attention! Siamo in missione. Dimmi cosa devo guardare! (Es: 'Regarde-la!')",
            "Je suis prêt à l'action. Donne-moi un ordre direct, tout de suite!"
        ]
    },
    [TopicId.VERBI_IR]: {
        name: "Coach Remy",
        role: "Personal Trainer",
        icon: <Dumbbell />,
        openers: [
            "Allez hop! On bouge! Je suis Coach Remy. Tu finis ton exercice? (Usa verbi come Finir, Choisir)",
            "Salut sportif! Tu choisis les poids légers ou lourds? (Rispondi 'Je choisis...')",
            "On ne mollit pas! Nous finissons la série ensemble? (Rispondi usando il verbo Finir)",
            "Regarde tes bras! Tu grossis ou tu maigris? (Usa verbi in -IR)"
        ]
    },
    [TopicId.LYON]: {
        name: "Sophie la Guide",
        role: "Guida Turistica",
        icon: <MapPin />,
        openers: [
            "Bienvenue à Lyon ! Je suis Sophie. Tu veux visiter le Vieux Lyon ou le quartier moderne Confluence ?",
            "Bonjour ! Sais-tu quels sont les deux fleuves qui traversent Lyon ?",
            "J'ai faim ! On va manger dans un Bouchon ? Tu aimes la gastronomie lyonnaise ?",
            "Regarde cette vue depuis la Basilique de Fourvière. C'est magnifique, non ?"
        ]
    },
    [TopicId.ORIENTATION]: {
        name: "Marie la Touriste",
        role: "Turista Persa",
        icon: <Compass />,
        openers: [
            "Pardon monsieur/madame, je suis perdue... Pour aller à la gare, s'il vous plaît ?",
            "Excusez-moi, je cherche le musée. C'est loin d'ici ? (Dammi indicazioni)",
            "Bonjour, où se trouve la pharmacie ? Je dois tourner à droite ou à gauche ?",
            "S'il vous plaît, je dois aller à l'hôtel de ville. Je peux y aller à pied ?"
        ]
    }
};

const RoleplayView: React.FC<RoleplayViewProps> = ({ topicId, onBack }) => {
  const [input, setInput] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const persona = PERSONAS[topicId];

  // Select a random opener only on mount or when topic changes
  const initialMessage = useMemo(() => {
      const opts = persona.openers;
      return opts[Math.floor(Math.random() * opts.length)];
  }, [persona]);

  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: initialMessage }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- TTS SETUP ---
  useEffect(() => {
    const loadVoices = () => {
        const vs = window.speechSynthesis.getVoices();
        setVoices(vs);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
    }
  }, []);

  const getBestVoice = (lang: string) => {
      // 1. Prefer "Google" voices (usually higher quality on Chrome)
      let voice = voices.find(v => v.lang.startsWith(lang) && v.name.includes('Google'));
      // 2. Fallback to any voice matching language
      if (!voice) voice = voices.find(v => v.lang.startsWith(lang));
      return voice;
  }

  const speak = (text: string, lang: string, isPierre: boolean) => {
      if (!text.trim()) return;
      const u = new SpeechSynthesisUtterance(text);
      const voice = getBestVoice(lang);
      if (voice) u.voice = voice;
      
      u.lang = lang;
      
      if (isPierre) {
          // French Persona: Energetic
          u.pitch = 1.05; 
          u.rate = 0.95; 
      } else {
          // Italian Explainer: Neutral, slightly deeper
          u.pitch = 0.95;
          u.rate = 1.0;
      }
      
      window.speechSynthesis.speak(u);
  }
  // ----------------

  // --- SPEECH TO TEXT SETUP ---
  const toggleListening = () => {
    setErrorMsg(null);
    if (isListening) {
      window.speechSynthesis.cancel(); // Stop speaking if user interrupts
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("Il tuo browser non supporta il riconoscimento vocale.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR'; // Force French to test pronunciation
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg("Accesso al microfono negato. Controlla le impostazioni dei permessi del browser.");
        } else if (event.error === 'no-speech') {
          // Just stop listening, no big error
        } else {
          setErrorMsg("Errore microfono: " + event.error);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setErrorMsg("Errore nell'avvio del microfono.");
    }
  };
  // ----------------

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    setErrorMsg(null);

    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text.replace('\n', ' ') }]
    }));

    try {
        const responseText = await getTutorResponse(history, userText, topicId);
        if(responseText) {
            // 1. Handle Text Display
            const displayText = responseText.replace('|||', '\n\n');
            setMessages(prev => [...prev, { role: 'model', text: displayText }]);
            
            // 2. Handle Speech (TTS) with smarter sequencing
            const parts = responseText.split('|||');
            const frPart = parts[0] || "";
            const itPart = parts[1] || "";

            window.speechSynthesis.cancel(); // Clear previous queue

            // Speak French part (Persona)
            if (frPart.trim()) {
                const cleanFr = frPart.replace(/\*.*?\*/g, '').trim();
                if (cleanFr) speak(cleanFr, 'fr-FR', true);
            }

            // Speak Italian part (Explanation)
            if (itPart.trim()) {
                const cleanIt = itPart.replace(/\*.*?\*/g, '').trim();
                // Small pause handled by separate utterances queue in browser
                if (cleanIt) speak(cleanIt, 'it-IT', false);
            }
        }
    } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, { role: 'model', text: "Désolé, je suis fatigué (Erreur API)." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
      window.speechSynthesis.cancel();
      // Re-roll a random message on manual reset
      const opts = persona.openers;
      const newOpener = opts[Math.floor(Math.random() * opts.length)];
      setMessages([{ role: 'model', text: newOpener }]);
      setErrorMsg(null);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-slate-50 relative">
      {/* Decorative BG */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      
      {/* Header */}
      <div className="p-4 bg-white/90 backdrop-blur border-b border-slate-200 z-10 flex justify-between items-center sticky top-0 shadow-sm">
         <div className="flex items-center gap-3">
           <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full mr-1">
                <ArrowLeft size={20} className="text-slate-500"/>
           </button>
           <div className="relative">
             <div className="w-11 h-11 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg ring-2 ring-slate-100">
               {persona.icon}
             </div>
             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
           </div>
           <div>
             <h2 className="font-bold text-slate-800 leading-tight">{persona.name}</h2>
             <p className="text-xs font-medium text-french-blue uppercase tracking-wide">
                {persona.role}
             </p>
           </div>
         </div>
         <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 p-2" title="Nuova Conversazione">
            <RefreshCw size={18} />
         </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 z-10">
        {messages.map((m, idx) => (
          <ChatBubble key={idx} text={m.text} isUser={m.role === 'user'} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-16 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest mr-2">{persona.name} sta scrivendo</span>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 z-10">
        {errorMsg && (
           <div className="mb-2 flex items-center text-red-600 text-xs font-bold bg-red-50 p-2 rounded-lg animate-in slide-in-from-bottom-2">
             <AlertCircle size={14} className="mr-2" />
             {errorMsg}
           </div>
        )}
        <div className="flex gap-2 relative max-w-3xl mx-auto items-center">
          <div className="relative w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Ascolto... (Parla in francese)" : "Scrivi la tua risposta..."}
                className={`w-full pl-6 pr-14 py-4 rounded-full focus:ring-2 outline-none transition-all border border-transparent shadow-inner text-base
                    ${isListening 
                        ? 'bg-red-50 text-red-800 focus:ring-red-400 placeholder-red-300' 
                        : 'bg-slate-100 focus:bg-white focus:ring-french-blue text-slate-800'}`}
              />
              
              <button
                onClick={toggleListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200
                    ${isListening 
                        ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,65,53,0.6)]' 
                        : 'text-slate-400 hover:bg-slate-200'}`}
                title="Parla in francese"
              >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 shrink-0 bg-french-blue text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleplayView;