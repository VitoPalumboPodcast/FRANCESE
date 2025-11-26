
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Volume2, Car, MapPin, Navigation, RefreshCcw } from 'lucide-react';
import { LessonSection, TopicId } from '../types';

// -- Interactive Map Component --
const CityMapGame: React.FC = () => {
  
  // Defined explicit types for buildings to render them differently
  type BuildingType = 'standard' | 'L-shape' | 'park' | 'square' | 'complex';

  interface MapObject {
    id: string;
    name: string;
    type: BuildingType;
    color: string;
    // Grid position (1-4 to accommodate the river on the left)
    col: number;
    row: number;
    // Visual tweaks
    roofColor?: string;
  }

  const mapObjects: MapObject[] = [
    { id: 'gare', name: 'Gare', type: 'complex', color: 'bg-slate-300', col: 2, row: 1, roofColor: 'bg-slate-500' },
    { id: 'parc', name: 'Parc', type: 'park', color: 'bg-green-100', col: 3, row: 1 },
    { id: 'poste', name: 'Poste', type: 'standard', color: 'bg-yellow-100', col: 4, row: 1, roofColor: 'bg-yellow-400' },
    
    { id: 'mairie', name: 'Mairie', type: 'standard', color: 'bg-blue-100', col: 2, row: 2, roofColor: 'bg-slate-600' },
    { id: 'place', name: 'Place', type: 'square', color: 'bg-transparent', col: 3, row: 2 }, // Roundabout
    { id: 'banque', name: 'Banque', type: 'standard', color: 'bg-emerald-100', col: 4, row: 2, roofColor: 'bg-emerald-600' },
    
    { id: 'cinema', name: 'Cinéma', type: 'L-shape', color: 'bg-purple-100', col: 2, row: 3, roofColor: 'bg-purple-500' },
    { id: 'ecole', name: 'École', type: 'standard', color: 'bg-orange-100', col: 3, row: 3, roofColor: 'bg-orange-400' },
    { id: 'hopital', name: 'Hôpital', type: 'complex', color: 'bg-red-50', col: 4, row: 3, roofColor: 'bg-white' },
  ];

  // GPS LOGIC (Precise Coordinates):
  // Vertical Street Centers: 39.5% (Left), 64.5% (Right)
  // Horizontal Street Centers: 30.5% (Top), 63.5% (Bottom)
  
  const challenges = [
    { 
        targetId: 'banque', 
        // Start: Intersection Horizontal 1 & Vertical 2
        instruction: "Descendez la rue. La Banque est le bâtiment vert sur votre gauche.",
        arrow: { top: '30.5%', left: '64.5%', rot: 180 }
    },
    { 
        targetId: 'gare', 
        // Start: Intersection Horizontal 2 & Vertical 2
        instruction: "Avancez jusqu'au croisement. Tournez à droite. Continuez tout droit. C'est le grand bâtiment gris à votre gauche.",
        arrow: { top: '63.5%', left: '64.5%', rot: 270 }
    },
    { 
        targetId: 'poste', 
        // Start: Vertical 2 (between Place/Banque)
        instruction: "Allez tout droit vers le nord. La destination est le bâtiment jaune sur votre droite.",
        arrow: { top: '47%', left: '64.5%', rot: 0 }
    },
    { 
        targetId: 'mairie', 
        // Start: Vertical 2 (Top)
        instruction: "Descendez la rue jusqu'au carrefour. Tournez à droite. Avancez. La Mairie est le bâtiment sur votre gauche.",
        arrow: { top: '15%', left: '64.5%', rot: 180 }
    },
    {
        targetId: 'cinema',
        // Start: Vertical 1 (Top)
        instruction: "Allez tout droit vers le sud. Traversez deux carrefours. Le Cinéma est le bâtiment violet sur votre droite.",
        arrow: { top: '15%', left: '39.5%', rot: 180 }
    }
  ];

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currentChallenge = challenges[currentChallengeIndex];

  const handleBuildingClick = (b: MapObject) => {
    if (success) return;
    
    if (b.id === currentChallenge.targetId) {
      setFeedback("🎯 Vous êtes arrivé à destination !");
      setSuccess(true);
      const u = new SpeechSynthesisUtterance("Vous êtes arrivé à destination !");
      u.lang = 'fr-FR';
      window.speechSynthesis.speak(u);
    } else {
      setFeedback(`⚠️ Non, ici c'est : ${b.name}.`);
      const u = new SpeechSynthesisUtterance(`Recalcul en cours... c'est ${b.name}`);
      u.lang = 'fr-FR';
      window.speechSynthesis.speak(u);
    }
  };

  const nextChallenge = () => {
    setSuccess(false);
    setFeedback(null);
    setCurrentChallengeIndex((prev) => (prev + 1) % challenges.length);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border-2 border-slate-200 shadow-sm">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
            <h4 className="text-xl font-bold text-french-blue flex items-center gap-2">
                <Navigation size={24}/> GPS Simulator
            </h4>
            <button 
            onClick={nextChallenge} 
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
            >
            <RefreshCcw size={14} /> Nuovo Percorso
            </button>
        </div>
        
        <div className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 flex gap-4 items-center shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-500 animate-pulse"></div>
            <div className="bg-green-600/20 p-3 rounded-full border border-green-500/50">
                <Car size={24} className="text-green-400" />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Assistente Vocale</p>
                <p className="text-lg font-medium leading-tight font-serif">
                    "{currentChallenge.instruction}"
                </p>
            </div>
        </div>
      </div>

      <div className="relative max-w-[500px] mx-auto aspect-square bg-[#2c2c2c] rounded-xl overflow-hidden shadow-2xl border-4 border-slate-900 group cursor-crosshair">
        
        {/* --- MAP LAYOUT --- */}
        
        {/* 1. River (Left Side) */}
        <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-cyan-700 border-r-4 border-slate-500/30 z-0">
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/water.png')]"></div>
            <div className="absolute top-10 left-1 text-cyan-200/50 -rotate-90 text-xs font-bold tracking-[0.5em]">LA SAÔNE</div>
        </div>

        {/* 2. Streets & Markings (The Grid) */}
        {/* Vertical Street 1 (Center Left) */}
        <div className="absolute left-[39.5%] top-0 bottom-0 w-0 border-l-2 border-dashed border-white/20 h-full z-0"></div>
        {/* Vertical Street 2 (Center Right) */}
        <div className="absolute left-[64.5%] top-0 bottom-0 w-0 border-l-2 border-dashed border-white/20 h-full z-0"></div>
        
        {/* Horizontal Street 1 (Top) */}
        <div className="absolute top-[30.5%] left-[15%] right-0 h-0 border-t-2 border-dashed border-white/20 w-full z-0"></div>
        {/* Horizontal Street 2 (Bottom) */}
        <div className="absolute top-[63.5%] left-[15%] right-0 h-0 border-t-2 border-dashed border-white/20 w-full z-0"></div>

        {/* 3. Buildings Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
            {mapObjects.map((b) => {
                const left = 18 + ((b.col - 2) * 25);
                const top = 3 + ((b.row - 1) * 33);
                
                // Specific Roundabout Handling (It's on the road)
                if (b.type === 'square') {
                    return (
                        <div key={b.id} className="absolute w-[22%] h-[26%] rounded-full border-[6px] border-[#2c2c2c] flex items-center justify-center bg-slate-600 shadow-lg pointer-events-auto cursor-pointer"
                             style={{ left: `${left-2}%`, top: `${top-2}%` }} // Slightly larger
                             onClick={() => handleBuildingClick(b)}>
                             <div className="w-16 h-16 border-2 border-dashed border-white/30 rounded-full absolute"></div>
                             <div className="w-2 h-2 bg-white rounded-full z-10"></div>
                             <span className="absolute -bottom-5 text-[9px] text-white/80 font-bold bg-black/50 px-1 rounded">Rond-Point</span>
                        </div>
                    );
                }

                return (
                    <div 
                        key={b.id}
                        className="absolute w-[18%] h-[22%] pointer-events-auto transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        style={{ left: `${left}%`, top: `${top}%` }}
                        onClick={() => handleBuildingClick(b)}
                    >
                        {/* Building Body */}
                        <div 
                            className={`w-full h-full ${b.color} relative shadow-[8px_8px_0px_rgba(0,0,0,0.4)] border border-white/10`}
                            style={
                                b.type === 'L-shape' ? { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 40% 100%, 40% 40%, 0 40%)' } :
                                b.type === 'park' ? { borderRadius: '9999px', opacity: 0.9, border: '4px solid #86efac' } :
                                { borderRadius: '4px' }
                            }
                        >
                            {/* Roof / Texture */}
                            {b.roofColor && (
                                <div className={`absolute inset-2 ${b.roofColor} shadow-inner opacity-90`}>
                                    {b.type === 'complex' && <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black/20"></div>}
                                    {b.type === 'complex' && <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black/20"></div>}
                                </div>
                            )}
                            
                            {/* Label Tag */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] text-center py-0.5 font-bold truncate px-1 backdrop-blur-sm z-20">
                                {b.name}
                            </div>
                            
                            {/* Center Icon/Content */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                {b.type === 'park' && <span className="text-2xl">🌳</span>}
                                {b.id === 'hopital' && <span className="text-red-500 font-bold text-xl bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">+</span>}
                                {b.id === 'poste' && <span className="text-yellow-800 text-lg">✉️</span>}
                            </div>
                        </div>
                        
                        {success && b.id === currentChallenge.targetId && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce z-30">
                                <MapPin className="text-green-500 drop-shadow-lg" size={32} fill="currentColor" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* 4. THE PLAYER ARROW (Absolute Positioning Layer - Z-20 to float above roads) */}
        <div 
            className="absolute w-8 h-8 z-20 transition-all duration-700 ease-in-out filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            style={{ 
                top: currentChallenge.arrow.top, 
                left: currentChallenge.arrow.left, 
                transform: `translate(-50%, -50%) rotate(${currentChallenge.arrow.rot}deg)`
            }}
        >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="white" strokeWidth="2">
                <path d="M12 2L4.5 20.29C4.21 21.01 4.96 21.74 5.67 21.39L12 18.25L18.33 21.39C19.04 21.74 19.79 21.01 19.5 20.29L12 2Z" />
            </svg>
        </div>

      </div>

      {feedback && (
        <div className={`mt-6 p-4 rounded-xl text-center font-bold shadow-sm animate-in slide-in-from-bottom-2 ${success ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          {feedback}
          {success && (
             <button onClick={nextChallenge} className="block mx-auto mt-3 text-sm bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-colors shadow-md">
               Prossima Destinazione →
             </button>
          )}
        </div>
      )}
    </div>
  );
};

// Content Database
const courseContent: Record<TopicId, { title: string; description: string; sections: LessonSection[] }> = {
  [TopicId.PRONUNCIATION]: {
      title: "Basi di Pronuncia",
      description: "I segreti per leggere e parlare come un vero francese: vocali, nasali e lettere mute.",
      sections: [
          {
              id: 'vowels',
              title: "1. Le Vocali Composte",
              content: "In francese, quando vedi due o tre vocali vicine, spesso formano un unico suono nuovo. Imparali a memoria!",
              examples: [
                  { french: "OU", italian: "U (come in 'tutto')", note: "Rouge (Rosso), Bonjour" },
                  { french: "OI", italian: "UA (come in 'guanto')", note: "Moi (Io), Toi (Tu), Roi (Re)" },
                  { french: "AU / EAU", italian: "O chiusa (come in 'sole')", note: "Auto, Beau (Bello), Eau (Acqua)" },
                  { french: "AI / EI", italian: "È aperta (come in 'caffè')", note: "Lait (Latte), Neige (Neve)" }
              ]
          },
          {
              id: 'nasals',
              title: "2. I Suoni Nasali (Il naso!)",
              content: "I suoni nasali sono tipici del francese. L'aria deve passare dal naso. Il trucco è non pronunciare mai la 'N' finale, ma usarla per colorare la vocale precedente.",
              examples: [
                  { french: "AN / EN", italian: "A nasale (Bocca aperta, suono profondo)", note: "Maman, Enfant, Vent" },
                  { french: "ON", italian: "O nasale (Labbra molto chiuse)", note: "Non, Bonbon, Maison" },
                  { french: "IN / AIN / EIN", italian: "E nasale (Sorriso largo)", note: "Matin, Vin, Pain, Plein" },
                  { french: "UN", italian: "OE nasale (Labbra avanti ma aperte)", note: "Un, Brun (suono raro oggi, spesso = IN)" }
              ]
          },
          {
              id: 'silent',
              title: "3. Le Lettere Mute",
              content: "La regola d'oro: la maggior parte delle consonanti alla fine della parola NON si leggono. Ricorda la regola del 'Deposito' (D, P, S, T, X, Z sono spesso mute).",
              examples: [
                  { french: "Paris", italian: "Si legge 'Parì'", note: "S finale muta" },
                  { french: "Salut", italian: "Si legge 'Salù'", note: "T finale muta" },
                  { french: "Beaucoup", italian: "Si legge 'Bocù'", note: "P finale muta" },
                  { french: "H (Hôtel, Homme)", italian: "L'H è SEMPRE muta!", note: "Non si aspira mai" }
              ]
          },
          {
              id: 'special',
              title: "4. Consonanti Speciali",
              content: "Alcune combinazioni di consonanti hanno suoni specifici.",
              examples: [
                  { french: "CH", italian: "SC (come in 'sciare')", note: "Chat (Gatto), Chien (Cane)" },
                  { french: "QU", italian: "K (la U non si legge mai!)", note: "Qui (Ki), Quatre (Katre)" },
                  { french: "GN", italian: "GN (come in 'gnocco')", note: "Montagne, Gagner" },
                  { french: "Ç (Cediglia)", italian: "S (rende dolce la C)", note: "Garçon, Français" },
                  { french: "IL / ILLE", italian: "J (come in 'yoghurt')", note: "Famille, Soleil, Fille" }
              ]
          }
      ]
  },
  [TopicId.GREETINGS]: {
      title: "Saluti e Presentazioni",
      description: "Le basi assolute: come salutare, chiedere come stai e presentarsi.",
      sections: [
          {
              id: 'hello',
              title: "1. Salutare",
              content: "Esistono due modi principali di salutare: formale (sconosciuti, anziani, lavoro) e informale (amici, famiglia).",
              examples: [
                  { french: "Bonjour", italian: "Buongiorno (si usa tutto il giorno finché c'è luce)", note: "Formale e Standard" },
                  { french: "Bonsoir", italian: "Buonasera", note: "Dopo le 18:00" },
                  { french: "Salut", italian: "Ciao", note: "Informale (solo amici!)" },
                  { french: "Au revoir", italian: "Arrivederci", note: "Standard" }
              ]
          },
          {
              id: 'how_are_you',
              title: "2. Come stai?",
              content: "La domanda più comune è 'Ça va?'. È magica perché vale sia come domanda che come risposta.",
              examples: [
                  { french: "Comment allez-vous ?", italian: "Come sta? (Lei)", note: "Formale" },
                  { french: "Comment ça va ?", italian: "Come va?", note: "Standard" },
                  { french: "Ça va ?", italian: "Tutto bene?", note: "Informale" },
                  { french: "Ça va bien, merci.", italian: "Va bene, grazie.", note: "Risposta" }
              ]
          },
          {
              id: 'presentation',
              title: "3. Presentarsi",
              content: "Per dire il proprio nome si usa il verbo 'S'appeler' (Chiamarsi).",
              examples: [
                  { french: "Je m'appelle Marco.", italian: "Mi chiamo Marco.", note: "Presentazione" },
                  { french: "Je suis italien / italienne.", italian: "Sono italiano / italiana.", note: "Nazionalità" },
                  { french: "Enchanté(e)", italian: "Piacere", note: "Quando incontri qualcuno" }
              ]
          }
      ]
  },
  [TopicId.ARTICLES]: {
      title: "Articoli e Genere (Basi)",
      description: "Il, La, Un, Una. Impara a identificare il genere delle parole.",
      sections: [
          {
              id: 'definite',
              title: "1. Articoli Determinativi (Il/La/I/Le)",
              content: "Attenzione: in francese esistono solo due generi (Maschile e Femminile). Non c'è il neutro. Al plurale c'è un solo articolo per tutti!",
              examples: [
                  { french: "Le garçon", italian: "Il ragazzo", note: "Maschile Singolare" },
                  { french: "La fille", italian: "La ragazza", note: "Femminile Singolare" },
                  { french: "L'ami / L'école", italian: "L'amico / La scuola", note: "Davanti a vocale (L')" },
                  { french: "Les garçons / Les filles", italian: "I ragazzi / Le ragazze", note: "Plurale (Unico!)" }
              ]
          },
          {
              id: 'indefinite',
              title: "2. Articoli Indeterminativi (Un/Uno/Una)",
              content: "Anche qui, il plurale 'Des' è fondamentale perché in italiano spesso lo omettiamo, ma in francese è obbligatorio!",
              examples: [
                  { french: "Un livre", italian: "Un libro", note: "Maschile" },
                  { french: "Une pomme", italian: "Una mela", note: "Femminile" },
                  { french: "Des livres", italian: "Dei libri (Alcuni libri)", note: "Plurale Obbligatorio" }
              ]
          },
          {
              id: 'gender_tips',
              title: "3. Trucchi per il Genere",
              content: "Come capire se una parola è maschile o femminile? Ci sono delle tendenze.",
              examples: [
                  { french: "La table, La lampe", italian: "Il tavolo, La lampada", note: "Spesso finiscono in -e" },
                  { french: "Le bureau, Le moment", italian: "L'ufficio, Il momento", note: "Spesso consonante o -eau" },
                  { french: "Le problème, Le système", italian: "Il problema, Il sistema", note: "Eccezione! Finiscono in -e ma sono Greci (Maschili)" }
              ]
          }
      ]
  },
  [TopicId.NUMBERS]: {
      title: "Numeri e Calendario",
      description: "Contare fino a 100 e gestire le date.",
      sections: [
          {
              id: '1_20',
              title: "1. I Numeri da 0 a 20",
              content: "La base di tutto. Imparali a memoria perché sono irregolari.",
              examples: [
                  { french: "Un, Deux, Trois", italian: "1, 2, 3", note: "" },
                  { french: "Quatre, Cinq, Six", italian: "4, 5, 6", note: "Six si legge 'Siss'" },
                  { french: "Sept, Huit, Neuf", italian: "7, 8, 9", note: "Sept si legge 'Set' (P muta)" },
                  { french: "Dix, Onze, Douze", italian: "10, 11, 12", note: "" },
                  { french: "Treize, Quatorze, Quinze", italian: "13, 14, 15", note: "" },
                  { french: "Seize, Dix-sept, Dix-huit", italian: "16, 17, 18", note: "" },
                  { french: "Dix-neuf, Vingt", italian: "19, 20", note: "Vingt si legge 'Ven' (GT muti)" }
              ]
          },
          {
              id: '20_69',
              title: "2. Da 20 a 69",
              content: "Qui la logica è regolare: Decina + Unità.",
              examples: [
                  { french: "Vingt et un", italian: "Ventuno", note: "Si usa 'et' solo con l'uno" },
                  { french: "Vingt-deux", italian: "Ventidue", note: "Trattino per gli altri" },
                  { french: "Trente, Quarante, Cinquante", italian: "30, 40, 50", note: "" },
                  { french: "Soixante", italian: "60", note: "La X si legge 'S'" }
              ]
          },
          {
              id: '70_90',
              title: "3. Il Caos (70, 80, 90)",
              content: "I francesi usano la matematica antica. 70 è '60+10', 80 è '4x20'.",
              examples: [
                  { french: "Soixante-dix", italian: "70 (60+10)", note: "" },
                  { french: "Soixante-onze", italian: "71 (60+11)", note: "" },
                  { french: "Quatre-vingts", italian: "80 (4x20)", note: "" },
                  { french: "Quatre-vingt-dix", italian: "90 (4x20+10)", note: "" },
                  { french: "Quatre-vingt-onze", italian: "91 (4x20+11)", note: "" }
              ]
          },
          {
              id: 'days',
              title: "4. Giorni e Mesi",
              content: "Il calendario in francese. I giorni sono sempre maschili.",
              examples: [
                  { french: "Lundi, Mardi, Mercredi", italian: "Lunedì, Martedì, Mercoledì", note: "" },
                  { french: "Jeudi, Vendredi, Samedi", italian: "Giovedì, Venerdì, Sabato", note: "" },
                  { french: "Dimanche", italian: "Domenica", note: "" },
                  { french: "Janvier, Février, Mars...", italian: "Gennaio, Febbraio, Marzo...", note: "" }
              ]
          }
      ]
  },
  [TopicId.DAILY_LIFE]: {
    title: "Vita Quotidiana, Scuola e Gusti",
    description: "Come parlare della scuola, del meteo e dei propri gusti. E la sfida finale: C'est vs Il est.",
    sections: [
      {
        id: 'cest_ilest',
        title: "1. La Grande Sfida: C'est vs Il est",
        content: "Confusione classica! Ecco la regola d'oro per presentare o descrivere.",
        examples: [
          { french: "C'est un professeur.", italian: "È un professore.", note: "C'est + Articolo + Nome (Presentazione)" },
          { french: "Il est professeur.", italian: "È professore.", note: "Il est + Professione (senza articolo! Descrizione)" },
          { french: "C'est génial !", italian: "È fantastico!", note: "C'est + Aggettivo (situazione generale)" },
          { french: "Il est intelligent.", italian: "È intelligente.", note: "Il est + Aggettivo (riferito a persona)" }
        ]
      },
      {
        id: 'school',
        title: "2. A Scuola",
        content: "Il vocabolario essenziale per sopravvivere in classe.",
        examples: [
          { french: "Le stylo / Le crayon", italian: "La penna / La matita", note: "" },
          { french: "Le tableau", italian: "La lavagna", note: "" },
          { french: "Je ne comprends pas.", italian: "Non capisco.", note: "Frase salvavita" },
          { french: "Comment on dit ... en français ?", italian: "Come si dice ... in francese?", note: "" }
        ]
      },
      {
        id: 'tastes',
        title: "3. Gusti e Pronomi Tonici",
        content: "Per dire cosa ti piace, usa i pronomi tonici (Moi, Toi...) per dare enfasi.",
        examples: [
          { french: "J'aime le foot.", italian: "Mi piace il calcio.", note: "" },
          { french: "Moi, je déteste la pluie.", italian: "Io (enfasi), odio la pioggia.", note: "Moi rafforza Je" },
          { french: "J'adore le chocolat.", italian: "Adoro il cioccolato.", note: "" },
          { french: "Pas moi !", italian: "Io no!", note: "Risposta breve" }
        ]
      },
      {
        id: 'weather',
        title: "4. Il Meteo",
        content: "Che tempo fa? (Quel temps fait-il ?)",
        examples: [
          { french: "Il fait beau.", italian: "Fa bel tempo.", note: "" },
          { french: "Il pleut.", italian: "Piove.", note: "" },
          { french: "Il fait froid.", italian: "Fa freddo.", note: "" },
          { french: "Il y a du vent.", italian: "C'è vento.", note: "" }
        ]
      }
    ]
  },
  [TopicId.LYON]: { 
      title: "Découvrir Lyon", 
      description: "La capitale della gastronomia, tra due fiumi e due colline.", 
      sections: [
          {
              id: 'geo',
              title: "1. Geografia: Due Fiumi",
              content: "Lyon è attraversata da due fiumi: il Rodano (Le Rhône) e la Saona (La Saône). Il centro si chiama 'Presqu'île' (Penisola).",
              examples: [
                  { french: "Le Rhône et la Saône", italian: "Il Rodano e la Saona", note: "I due fiumi" },
                  { french: "La Presqu'île", italian: "La Penisola (il centro)", note: "Tra i due fiumi" },
                  { french: "La colline de Fourvière", italian: "La collina di Fourvière (che prega)", note: "Ovest" },
                  { french: "La colline de la Croix-Rousse", italian: "La collina della Croix-Rousse (che lavora)", note: "Nord" }
              ]
          },
          {
              id: 'food',
              title: "2. Gastronomia: Les Bouchons",
              content: "Lyon è famosa per i suoi ristoranti tipici chiamati 'Bouchons'.",
              examples: [
                  { french: "Un Bouchon Lyonnais", italian: "Trattoria tipica", note: "" },
                  { french: "La Quenelle", italian: "Polpetta di luccio (pesce)", note: "Piatto tipico" },
                  { french: "La Tarte aux Pralines", italian: "Crostata alle mandorle rosse", note: "Dolce tipico" }
              ]
          },
          {
              id: 'modern',
              title: "3. Quartiere Confluence",
              content: "Dove i due fiumi si incontrano, c'è un quartiere modernissimo.",
              examples: [
                  { french: "Le Musée des Confluences", italian: "Il museo delle confluenze", note: "Architettura moderna" },
                  { french: "C'est un quartier moderne.", italian: "È un quartiere moderno.", note: "" }
              ]
          }
      ] 
  },
  // Default fallback for other topics to prevent crashes
  [TopicId.COD]: { title: "Pronomi COD", description: "Complementi Oggetto Diretto.", sections: [] },
  [TopicId.VERBI_ER]: { title: "Verbi -ER", description: "Verbi del primo gruppo.", sections: [] },
  [TopicId.VERBI_IR]: { title: "Verbi -IR", description: "Verbi del secondo gruppo.", sections: [] },
  [TopicId.VERBI_TOP]: { title: "Verbi Top", description: "Essere, Avere, Fare, Andare.", sections: [] },
  [TopicId.VERBI_3_GROUP]: { title: "Terzo Gruppo", description: "Verbi irregolari.", sections: [] },
  [TopicId.IMPERATIF]: { title: "Imperativo", description: "Dare ordini.", sections: [] },
  [TopicId.NEGATION]: { title: "Negazione", description: "Ne...pas.", sections: [] },
  [TopicId.GENDER_NUMBER]: { title: "Genere e Numero", description: "Maschile/Femminile, Singolare/Plurale.", sections: [] },
  [TopicId.FAMILY]: { title: "Famiglia", description: "Vocabolario della famiglia.", sections: [] },
  [TopicId.DESCRIPTION]: { title: "Descrizione", description: "Descrivere persone e cose.", sections: [] },
  [TopicId.ORIENTATION]: { title: "Orientamento", description: "Chiedere indicazioni.", sections: [] },
};

interface LearnViewProps {
  topicId: TopicId;
  onBack: () => void;
}

const LearnView: React.FC<LearnViewProps> = ({ topicId, onBack }) => {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const content = courseContent[topicId];
  
  // Audio state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
     const loadVoices = () => {
         const vs = window.speechSynthesis.getVoices();
         setVoices(vs);
     };
     loadVoices();
     window.speechSynthesis.onvoiceschanged = loadVoices;
     return () => { window.speechSynthesis.onvoiceschanged = null; }
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const playAudio = (text: string, isPronunciationTopic: boolean = false) => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      
      const preferredVoice = voices.find(v => v.lang === 'fr-FR' && v.name.includes('Google')) ||
                             voices.find(v => v.lang === 'fr-FR');
      if (preferredVoice) u.voice = preferredVoice;
      
      // Slower rate for pronunciation drills
      u.rate = isPronunciationTopic ? 0.75 : 0.9;
      u.pitch = 1.0; 
      
      window.speechSynthesis.speak(u);
  };

  // Only ORIENTATION uses the game. Lyon is cultural.
  const isOrientation = topicId === TopicId.ORIENTATION;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-32">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium">
        <ArrowLeft size={20} className="mr-2" /> Torna alla Mappa
      </button>

      <div className="mb-10 animate-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 leading-tight">
          {content?.title || "Modulo in costruzione"}
        </h2>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
          {content?.description}
        </p>
      </div>

      {isOrientation ? (
          <div className="animate-in fade-in duration-700">
              <CityMapGame />
          </div>
      ) : (
          <div className="space-y-6">
            {content?.sections.map((section, index) => {
                const isOpen = openSections.includes(section.id) || index === 0; // First section open by default
                
                return (
                    <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
                    <button 
                        onClick={() => toggleSection(section.id)}
                        className={`w-full flex items-center justify-between p-6 text-left transition-colors ${isOpen ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isOpen ? 'bg-french-blue text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {index + 1}
                            </div>
                            <h3 className={`text-xl font-bold ${isOpen ? 'text-french-blue' : 'text-slate-700'}`}>
                                {section.title}
                            </h3>
                        </div>
                        {isOpen ? <ChevronUp className="text-french-blue" /> : <ChevronDown className="text-slate-400" />}
                    </button>

                    {isOpen && (
                        <div className="p-6 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                                {section.content}
                            </p>

                            {section.examples && section.examples.length > 0 && (
                                <div className="grid gap-3">
                                    {section.examples.map((ex, idx) => {
                                        // AUDIO LOGIC: 
                                        // If Pronunciation Topic AND we have specific cases like "OI", "AN" etc, we read the examples (note) instead of the title.
                                        // For standard lessons, we read the French sentence.
                                        
                                        const isPronun = topicId === TopicId.PRONUNCIATION;
                                        // Exception for Phonetics: If the title is just a sound like "OI", "AN", "QU", read the example words in the note
                                        const textToRead = (isPronun && (ex.french.length <= 4 || ex.french.includes('/') || ex.french.includes('Cediglia'))) 
                                            ? ex.note?.replace(/\(.*?\)/g, '') || ex.french // Read note (examples) without parens
                                            : ex.french; // Read phrase normally

                                        return (
                                            <div 
                                                key={idx} 
                                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 transition-colors group cursor-pointer"
                                                onClick={() => playAudio(textToRead || "", isPronun)}
                                            >
                                                <div className="flex-1">
                                                    <p className="font-serif text-lg font-medium text-slate-900 mb-1 group-hover:text-french-blue transition-colors">
                                                        {ex.french}
                                                    </p>
                                                    <p className="text-slate-500 text-sm">
                                                        {ex.italian}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                    {ex.note && (
                                                        <span className="hidden md:inline-block text-xs font-bold px-2 py-1 bg-white text-slate-400 rounded border border-slate-200 uppercase tracking-wide">
                                                            {ex.note}
                                                        </span>
                                                    )}
                                                    <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-french-blue group-hover:border-french-blue shadow-sm transition-all">
                                                        <Volume2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                );
            })}
          </div>
      )}
    </div>
  );
};

export default LearnView;
