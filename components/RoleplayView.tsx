

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, ArrowLeft, RefreshCw, Mic, MicOff, AlertCircle, Dumbbell, ShieldAlert, MessageCircle, MapPin, Compass, Frown, Scissors, Heart, Zap, Home, Search, Crown, GraduationCap, Music, Hand, ShoppingCart, BookOpen, Sun } from 'lucide-react';
import { getTutorResponse } from '../services/geminiService';
import { TopicId } from '../types';

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
  correction?: { sentence: string; explanation: string };
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

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isUser, correction }) => (
  <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-in slide-in-from-bottom-2 duration-300 flex-col`}>
    
    {/* Correction Box appearing BEFORE the bot response if it exists */}
    {!isUser && correction && (
        <div className="max-w-[85%] md:max-w-[70%] mb-2 bg-red-50 border border-red-200 rounded-2xl rounded-bl-none p-4 ml-12 shadow-sm animate-in zoom-in duration-300">
            <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                    <GraduationCap size={18} />
                </div>
                <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Correzione Grammaticale</p>
                    <p className="text-slate-800 font-medium italic mb-1">"{correction.sentence}"</p>
                    <p className="text-slate-500 text-sm">{correction.explanation}</p>
                </div>
            </div>
        </div>
    )}

    <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 self-${isUser ? 'end' : 'start'}`}>
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
    [TopicId.PRONUNCIATION]: {
        name: "Madame Phonétique",
        role: "Logopedista",
        icon: <Music />,
        openers: [
            "Bonjour ! Prêt pour la gymnastique de la bouche ? Répète : 'Un chasseur sachant chasser sans son chien...'",
            "Salut ! Aujourd'hui, on travaille le son 'R'. Répète après moi : 'La roue rouge roule sur la route'.",
            "Attention aux nasales ! Dis-moi : 'Un bon vin blanc'. Je t'écoute !",
            "Le son 'U' est difficile. Essaie de dire : 'Tu as vu la lune au-dessus de la rue ?'"
        ]
    },
    [TopicId.GREETINGS]: {
        name: "Pierre le Portier",
        role: "Concierge dell'Hotel",
        icon: <Hand />,
        openers: [
            "Bonjour Monsieur/Madame ! Bienvenue au Grand Hôtel. Comment allez-vous ?",
            "Bonsoir ! Je m'appelle Pierre. Et vous, comment vous appelez-vous ?",
            "Enchanté ! C'est votre première fois à Paris ? (Rispondi presentandoti)",
            "Au revoir et bonne journée ! (Prova a salutarmi in modo formale)"
        ]
    },
    [TopicId.ARTICLES]: {
        name: "Professeur Plume",
        role: "Maestra Elementare",
        icon: <BookOpen />,
        openers: [
            "Bonjour ! Regarde les objets sur la table. C'est UN livre ou UNE livre ? (Usa un/une)",
            "Voici des animaux. Tu vois LE chat ou LA chatte ? Attention al genere !",
            "Dans mon sac, j'ai DES stylos. Et toi, qu'est-ce que tu as ? (Usa un/une/des)",
            "Attention ! Si je dis 'L'école', c'est masculin ou féminin ? Dis-moi..."
        ]
    },
    [TopicId.NUMBERS]: {
        name: "Mathieu le Marchand",
        role: "Venditore al Mercato",
        icon: <ShoppingCart />,
        openers: [
            "Bonjour ! Les pommes coûtent 2 euros le kilo. Tu en veux combien ? (Usa i numeri)",
            "C'est mon anniversaire le 14 juillet. Et toi, c'est quand ton anniversaire ?",
            "Ça fait 75 euros s'il vous plaît ! (Attento: come si scrive settantacinque?)",
            "Il est quelle heure ? Moi j'ouvre à 8 heures. (Dimmi l'ora)"
        ]
    },
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
    [TopicId.VERBI_ER]: {
        name: "Julien le Poète",
        role: "Poeta Romantico",
        icon: <Heart />,
        openers: [
            "Ah, l'amour... Je pense à toi. Et toi, à quoi tu penses ? (Usa il verbo 'Penser')",
            "J'aime regarder les étoiles. Qu'est-ce que tu aimes faire ? (Usa 'Aimer')",
            "Je chante pour oublier. Tu chantes aussi ? (Usa 'Chanter')",
            "Je rêve d'un monde meilleur. Tu rêves aussi ? (Usa 'Rêver')"
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
    [TopicId.VERBI_TOP]: {
        name: "Le Baron",
        role: "Nobile Esagerato",
        icon: <Crown />,
        openers: [
            "Bonjour! Je suis le Baron. J'ai trois châteaux. Et toi, qu'est-ce que tu as ? (Usa 'J'ai...')",
            "Je suis très important. Et toi, tu es qui ? (Usa 'Je suis...')",
            "Je fais du sport tous les jours. Qu'est-ce que tu fais le matin ? (Usa 'Je fais...')",
            "Je vais à Paris en hélicoptère. Tu vas où ? (Usa 'Je vais...')"
        ]
    },
    [TopicId.VERBI_3_GROUP]: {
        name: "Merlin le Magicien",
        role: "Mago Caotico",
        icon: <Zap />,
        openers: [
            "Abra Cadabra ! Je peux voler ! Et toi, qu'est-ce que tu peux faire ? (Usa 'Je peux...')",
            "Je bois une potion magique. Tu bois quoi ? (Usa 'Je bois...')",
            "Je vois le futur ! Tu vois quelque chose ? (Usa 'Je vois...')",
            "Je prends ma baguette. Tu prends quoi ? (Usa 'Je prends...')"
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
    },
    [TopicId.NEGATION]: {
        name: "Marcel le Sceptique",
        role: "Il Pessimista",
        icon: <Frown />,
        openers: [
            "Pfff. Je n'aime rien. Et toi, tu aimes le football ? (Rispondi di NO)",
            "Moi, je n'ai pas de chance. Tu as une voiture ? (Usa la negazione, ricorda 'de')",
            "Je ne mange jamais. Tu manges des légumes ? (Rispondi 'Je ne mange pas de...')",
            "Tout va mal. Tu es content ? (Rispondi 'Je ne suis pas...')"
        ]
    },
    [TopicId.GENDER_NUMBER]: {
        name: "Chantal la Styliste",
        role: "Critica di Moda",
        icon: <Scissors />,
        openers: [
            "Oh là là, regarde ce garçon. Il est beau ? Et sa sœur ? (Trasforma 'Beau' al femminile)",
            "J'adore les chevaux ! Tu aimes les animaux ? (Attenzione ai plurali irregolari)",
            "C'est un nouveau style. Tu aimes ma nouvelle robe ? (Usa gli aggettivi corretti)",
            "Il a les yeux bleus. Tu as les yeux de quelle couleur ? (Plurale di 'Oeil')"
        ]
    },
    [TopicId.FAMILY]: {
        name: "Grand-mère Yvette",
        role: "La Nonna Curiosa",
        icon: <Home />,
        openers: [
            "Bonjour mon chéri ! Comment va ta famille ? Tes parents vont bien ?",
            "Dis-moi, tu es marié(e) ou célibataire ? Je veux savoir !",
            "Tu as des frères et sœurs ? Comment ils s'appellent ?",
            "Moi j'ai beaucoup de petits-enfants. Et toi, tu as des enfants ?"
        ]
    },
    [TopicId.DESCRIPTION]: {
        name: "L'Inspecteur Jacques",
        role: "Detective",
        icon: <Search />,
        openers: [
            "Bonjour. Je cherche un suspect. Pouvez-vous me le décrire ? Il est grand ou petit ?",
            "J'ai besoin d'indices ! Comment est-il habillé ? Il porte un chapeau ?",
            "Décrivez son caractère. Est-il gentil ou méchant ? Menteur ?",
            "A-t-il un animal de compagnie ? Un chien dangereux peut-être ?"
        ]
    },
    [TopicId.DAILY_LIFE]: {
        name: "Lucas l'Étudiant",
        role: "Compagno di Scuola",
        icon: <Sun />,
        openers: [
            "Salut ! Quel temps il fait aujourd'hui ? Il pleut ? (Usa le espressioni meteo)",
            "Moi, j'adore le football. Et toi, qu'est-ce que tu aimes faire ? (Usa J'aime...)",
            "Regarde sur la table. C'est quoi ? (Usa C'est un...)",
            "Moi, je suis français. Et toi, tu es italien ? (Usa i pronomi tonici: Moi, Toi...)"
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

  const [messages, setMessages] = useState<{role: string, text: string, correction?: { sentence: string, explanation: string }}[]>([
    { role: 'model', text: initialMessage }
  ]);
  
  // Use a ref to keep track of messages for the async handleSend callback
  const messagesRef = useRef(messages);
  useEffect(() => {
      messagesRef.current = messages;
  }, [messages]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (arg?: any) => {
    // Allow calling with a specific string (from speech recognizer) or as an event handler
    const textToSend = typeof arg === 'string' ? arg : input;
    
    if (!textToSend.trim()) return;
    
    const userText = textToSend;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    setErrorMsg(null);

    // Use ref to get latest messages for API history context (avoids stale closures)
    const history = [...messagesRef.current, { role: 'user', text: userText }].map(m => ({
        role: m.role,
        parts: [{ text: m.text.replace('\n', ' ') }]
    }));

    try {
        const responseText = await getTutorResponse(history, userText, topicId);
        if(responseText) {
            // Parsing logic for Corrections
            let finalDisplay = responseText;
            let correctionObj = undefined;

            // Check for [CORRECTION: ...] block
            // Regex looks for [CORRECTION: Sentence. Explanation]
            const correctionMatch = responseText.match(/\[CORRECTION:(.*?)\]/s);
            
            if (correctionMatch) {
                const rawCorrection = correctionMatch[1]; // "Je suis allé. Explanation."
                // Remove the tag from the displayed text
                finalDisplay = responseText.replace(correctionMatch[0], '').trim();
                
                // Split sentence and explanation roughly
                const splitPoint = rawCorrection.indexOf('.');
                if (splitPoint > 0) {
                    correctionObj = {
                        sentence: rawCorrection.substring(0, splitPoint + 1).trim(),
                        explanation: rawCorrection.substring(splitPoint + 1).trim()
                    };
                } else {
                    correctionObj = {
                        sentence: rawCorrection.trim(),
                        explanation: "Correggi la grammatica."
                    };
                }
            }

            // Clean ||| separator for display
            finalDisplay = finalDisplay.replace('|||', '\n\n').trim();

            setMessages(prev => [...prev, { role: 'model', text: finalDisplay, correction: correctionObj }]);
            
            // 2. Handle Speech (TTS) with smarter sequencing
            const parts = finalDisplay.split('|||');
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
        setInput(transcript); // Visual feedback
        handleSend(transcript); // Auto-send the recognized text
      };

      recognition.onerror = (event: any) => {
        console.error("Speech error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg("Consenti l'accesso al microfono nelle impostazioni del browser.");
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
            <RefreshCw size={20} />
         </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 space-y-4">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} text={msg.text} isUser={msg.role === 'user'} correction={msg.correction} />
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse mb-6">
             <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
             <div className="bg-slate-200 h-12 w-32 rounded-3xl"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:p-6 pb-8 z-20">
         {errorMsg && (
            <div className="absolute -top-12 left-0 right-0 mx-auto w-max max-w-[90%] bg-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-bottom-2">
                <AlertCircle size={14}/> {errorMsg}
            </div>
         )}

         <div className="max-w-3xl mx-auto flex items-end gap-3">
             <button
                onClick={toggleListening}
                className={`p-4 rounded-full transition-all duration-300 shadow-sm border ${
                    isListening 
                    ? 'bg-red-500 text-white border-red-500 animate-pulse scale-110' 
                    : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'
                }`}
             >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
             </button>

             <div className="flex-1 bg-slate-100 rounded-3xl flex items-center p-2 border border-slate-200 focus-within:ring-2 focus-within:ring-french-blue/20 focus-within:border-french-blue transition-all">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder={`Parla con ${persona.name}...`}
                    className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[48px] py-3 px-3 text-slate-700 placeholder:text-slate-400"
                    rows={1}
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-french-blue text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md ml-2"
                >
                    <Send size={20} />
                </button>
             </div>
         </div>
         <p className="text-center text-xs text-slate-400 mt-3 hidden md:block">
            L'AI analizzerà la tua grammatica in tempo reale.
         </p>
      </div>
    </div>
  );
};

export default RoleplayView;