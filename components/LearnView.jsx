
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, Type, ArrowLeft, Book, CheckCircle2, Volume2, PlayCircle, FileText, MapPin, Navigation, User, RefreshCcw, Car, PauseCircle, Utensils, Heart, Eye, Home, Camera, Music, Sun, Coffee, ShoppingBag, Users, Smile, Clock, Zap, Bike, Train, Plane, Landmark, Hand, Calculator, Box } from 'lucide-react';
import { TopicId } from '../types';

// -- Interactive Map Component --
const CityMapGame = () => {
  const mapObjects = [
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
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const currentChallenge = challenges[currentChallengeIndex];

  const handleBuildingClick = (b) => {
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
const courseContent = {
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
              title: "2. Da 20 a 69 (La Logica)",
              content: "È facile: Decina + Unità. Attenzione: per l'uno si aggiunge 'et' (Vingt-et-un). Per gli altri c'è il trattino.",
              examples: [
                  { french: "Vingt-et-un", italian: "Ventuno", note: "C'è 'et'" },
                  { french: "Vingt-deux", italian: "Ventidue", note: "C'è il trattino" },
                  { french: "Trente, Quarante", italian: "30, 40", note: "" },
                  { french: "Cinquante, Soixante", italian: "50, 60", note: "" }
              ]
          },
          {
              id: '70_99',
              title: "3. Il Disastro (70, 80, 90)",
              content: "I francesi non hanno parole per 70, 80, 90. Usano la matematica!\n70 = 60+10 (Soixante-dix)\n80 = 4x20 (Quatre-vingts)\n90 = 4x20+10 (Quatre-vingt-dix)",
              examples: [
                  { french: "Soixante-dix", italian: "70 (Sessanta-dieci)", note: "" },
                  { french: "Soixante-onze", italian: "71 (Sessanta-undici)", note: "" },
                  { french: "Quatre-vingts", italian: "80 (Quattro-venti)", note: "Ha la S finale" },
                  { french: "Quatre-vingt-un", italian: "81 (Quattro-venti-uno)", note: "Niente S, niente et" },
                  { french: "Quatre-vingt-dix", italian: "90 (Quattro-venti-dieci)", note: "" }
              ]
          },
          {
              id: 'days',
              title: "4. I Giorni della Settimana",
              content: "Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche.",
              examples: [
                  { french: "Aujourd'hui, c'est lundi.", italian: "Oggi è lunedì.", note: "" },
                  { french: "À demain !", italian: "A domani!", note: "" }
              ]
          }
      ]
  },
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
          { french: "Je l'aime.", italian: 'Lo/La amo.', note: 'Elisione davanti a vocale!' }
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
  [TopicId.NEGATION]: {
    title: "La Forma Negativa",
    description: "Non, Pas, Jamais. Come negare correttamente.",
    sections: [
        {
            id: 'general',
            title: "Regola Generale",
            content: "Nella maggior parte dei casi, la forma negativa si ottiene racchiudendo il verbo coniugato tra i due elementi di negazione: 'ne' e 'pas'.",
            examples: [
                { french: "Je mange.", italian: "Io mangio.", note: "Affermativo" },
                { french: "Je ne mange pas.", italian: "Io non mangio.", note: "Negativo: ne + verbo + pas" },
                { french: "Tu parles.", italian: "Tu parli.", note: "" },
                { french: "Tu ne parles pas.", italian: "Tu non parli.", note: "" }
            ]
        },
        {
            id: 'apostrophe',
            title: "L'Elisione (N')",
            content: "Se il verbo (o il pronome che lo precede) inizia per vocale o per 'h' muta, 'ne' diventa 'n''. Questo serve per evitare l'incontro di due vocali.",
            examples: [
                { french: "Je n'ai pas de stylo.", italian: "Non ho una penna.", note: "Davanti a vocale (ai)" },
                { french: "Je n'aime pas le café.", italian: "Non mi piace il caffè.", note: "Davanti a vocale (aime)" }
            ]
        },
        {
            id: 'cod_neg',
            title: "Negazione con i Pronomi COD",
            content: "Quando c'è un pronome COD (me, te, le, la...), il gruppo Pronome+Verbo non si divide. Ne e Pas si mettono prima e dopo questo blocco.",
            examples: [
                { french: "Je ne la regarde pas.", italian: "Non la guardo.", note: "Ne [la regarde] pas" },
                { french: "Il ne m'écoute pas.", italian: "Non mi ascolta.", note: "Ne [m'écoute] pas" }
            ]
        },
        {
            id: 'articles',
            title: "Il Cambiamento degli Articoli",
            content: "Importante! Con la negazione (tranne con essere), gli articoli indeterminativi (un, une, des) diventano 'DE' o 'D''.",
            examples: [
                { french: "J'ai des amis. -> Je n'ai pas d'amis.", italian: "Ho amici. -> Non ho amici.", note: "Des diventa D'" },
                { french: "Je bois du lait. -> Je ne bois pas de lait.", italian: "Bevo latte. -> Non bevo latte.", note: "Du diventa De" },
                { french: "C'est une pomme. -> Ce n'est pas une pomme.", italian: "È una mela. -> Non è una mela.", note: "Eccezione: con 'Être' non cambia!" }
            ]
        },
        {
            id: 'imperative_neg',
            title: "Imperativo Negativo",
            content: "Nell'ordine negativo, la struttura è Ne + Pronome + Verbo + Pas. Il pronome resta prima del verbo, come una frase normale!",
            examples: [
                { french: "Regarde-la !", italian: "Guardala!", note: "Affermativo (Dopo)" },
                { french: "Ne la regarde pas !", italian: "Non guardarla!", note: "Negativo (Prima)" }
            ]
        }
    ]
  },
  [TopicId.GENDER_NUMBER]: {
    title: "Femminili e Plurali Irregolari",
    description: "Quando la 'e' e la 's' non bastano. Le trasformazioni speciali.",
    sections: [
        {
            id: 'general_rules',
            title: "Regola Generale (La base)",
            content: "Prima di vedere le eccezioni, ricordiamo la regola d'oro. Generalmente:\n1. Femminile = Maschile + 'e'\n2. Plurale = Singolare + 's'",
            examples: [
                { french: "Il est grand. -> Elle est grande.", italian: "Lui è alto. -> Lei è alta.", note: "Si aggiunge 'e'" },
                { french: "Un ami. -> Des amis.", italian: "Un amico. -> Degli amici.", note: "Si aggiunge 's'" },
                { french: "Une amie. -> Des amies.", italian: "Un'amica. -> Delle amiche.", note: "Femminile + Plurale (es)" }
            ]
        },
        {
            id: 'fem_irregular',
            title: "Femminili Irregolari",
            content: "Alcuni aggettivi formano il femminile in modo particolare.",
            examples: [],
            conjugationTables: [
                {
                    title: "Trasformazioni Femminili",
                    rows: [
                        { pronoun: "Maschile (-é)", verb: "Femminile (-ée)" },
                        { pronoun: "marié (sposato)", verb: "mariée" },
                        { pronoun: "fâché (arrabbiato)", verb: "fâchée" },
                        { pronoun: "Maschile (-f)", verb: "Femminile (-ve)" },
                        { pronoun: "veuf (vedovo)", verb: "veuve" },
                        { pronoun: "Maschile (-eux)", verb: "Femminile (-euse)" },
                        { pronoun: "heureux (felice)", verb: "heureuse" },
                        { pronoun: "furieux (furioso)", verb: "furieuse" },
                        { pronoun: "Casi Speciali", verb: "" },
                        { pronoun: "beau (bello)", verb: "belle" },
                        { pronoun: "nouveau (nuovo)", verb: "nouvelle" }
                    ]
                }
            ]
        },
        {
            id: 'plural_irregular',
            title: "Plurali Irregolari",
            content: "Alcuni nomi cambiano leggermente al plurale. Non si aggiunge solo la 's'!",
            examples: [
                { french: "l'œil -> les yeux", italian: "l'occhio -> gli occhi", note: "Cambio totale" },
                { french: "un travail -> des travaux", italian: "un lavoro -> dei lavori", note: "-ail diventa -aux" },
                { french: "un cheval -> des chevaux", italian: "un cavallo -> dei cavalli", note: "-al diventa -aux" }
            ]
        }
    ]
  },
  [TopicId.FAMILY]: {
      title: "La Famiglia e lo Stato Civile",
      description: "I parenti, i nonni, i nipoti e lo stato civile.",
      sections: [
          {
              id: 'parents',
              title: "I Gradi di Parentela (Basi)",
              content: "Ecco i membri fondamentali della famiglia.",
              examples: [
                  { french: "Les parents (Le père / La mère)", italian: "I genitori (Padre / Madre)", note: "Papa / Maman (fam.)" },
                  { french: "Les enfants (Le fils / La fille)", italian: "I figli (Figlio / Figlia)", note: "" },
                  { french: "Le mari / La femme", italian: "Il marito / La moglie", note: "" }
              ]
          },
          {
              id: 'grandparents',
              title: "Nonni e Nipoti",
              content: "Attenzione ai 'falsi amici'. 'Petit-fils' non è un piccolo figlio, è il nipote (di nonno)!",
              examples: [
                  { french: "Les grands-parents (Grand-père / Grand-mère)", italian: "I nonni", note: "Papi / Mamie (fam.)" },
                  { french: "Les petits-enfants (Petit-fils / Petite-fille)", italian: "I nipoti (dei nonni)", note: "" },
                  { french: "Le neveu / La nièce", italian: "Il nipote / La nipote (degli zii)", note: "Diverso da petit-fils!" }
              ]
          },
          {
              id: 'relatives',
              title: "Zii e Cugini",
              content: "Il resto della famiglia allargata.",
              examples: [
                  { french: "L'oncle / La tante", italian: "Lo zio / La zia", note: "" },
                  { french: "Le cousin / La cousine", italian: "Il cugino / La cugina", note: "" }
              ]
          },
          {
              id: 'civil_status',
              title: "Stato Civile",
              content: "Come descrivere la propria situazione sentimentale.",
              conjugationTables: [
                  {
                      title: "Stato Civile (M / F)",
                      rows: [
                          { pronoun: "Sposato/a", verb: "Marié / Mariée" },
                          { pronoun: "Separato/a", verb: "Séparé / Séparée" },
                          { pronoun: "Divorziato/a", verb: "Divorcé / Divorcée" },
                          { pronoun: "Vedovo/a", verb: "Veuf / Veuve" },
                          { pronoun: "Celibe/Nubile", verb: "Célibataire" }
                      ]
                  }
              ],
              examples: []
          }
      ]
  },
  [TopicId.DESCRIPTION]: {
      title: "Descrizione e Abbigliamento",
      description: "Com'è? Cosa indossa? Carattere, fisico e vestiti.",
      sections: [
          {
              id: 'character',
              title: "Il Carattere (Caractère)",
              content: "Aggettivi per descrivere la personalità.",
              examples: [
                  { french: "Il est sympathique / gentil.", italian: "È simpatico / gentile.", note: "" },
                  { french: "Elle est intelligente / honnête.", italian: "È intelligente / onesta.", note: "" },
                  { french: "C'est un menteur (une menteuse).", italian: "È un bugiardo.", note: "Sostantivo" },
                  { french: "Il est sage.", italian: "È saggio/bravo.", note: "Per i bambini" },
                  { french: "Il est grossier.", italian: "È scostumato.", note: "Dice parolacce (gros mots)" }
              ]
          },
          {
              id: 'emotions',
              title: "Glossario: Emozioni e Sentimenti",
              content: "Come ti senti oggi? Termini utili per esprimere stati d'animo.",
              examples: [
                  { french: "Ravi / Content", italian: "Raggiante / Contento", note: "Felicità" },
                  { french: "Déçu (Quelle déception !)", italian: "Deluso (Che delusione!)", note: "Aspettativa mancata" },
                  { french: "Fâché / En colère", italian: "Offeso / In collera (Arrabbiato)", note: "Rabbia" },
                  { french: "Avoir du chagrin", italian: "Essere tristi / Addolorati", note: "Tristezza" },
                  { french: "Intrigué", italian: "Incuriosito", note: "Curiosità" },
                  { french: "Farceur", italian: "Scherzoso", note: "Ama fare scherzi (blagues)" }
              ]
          },
          {
              id: 'physical',
              title: "Aspetto Fisico",
              content: "Descrivere il viso e i capelli.",
              examples: [
                  { french: "Elle a les cheveux lisses.", italian: "Ha i capelli lisci.", note: "" },
                  { french: "Il a les cheveux bruns et courts.", italian: "Ha i capelli castani e corti.", note: "" },
                  { french: "Il porte des lunettes.", italian: "Porta gli occhiali.", note: "" }
              ]
          },
          {
              id: 'clothing',
              title: "Abbigliamento (Vêtements)",
              content: "Cosa indossi oggi?",
              examples: [
                  { french: "Une veste / Une robe", italian: "Una giacca / Un vestito (donna)", note: "" },
                  { french: "Un pantalon / Un pull", italian: "Pantaloni / Maglione", note: "" },
                  { french: "Des baskets / Des chaussures à talons", italian: "Scarpe da ginnastica / Scarpe col tacco", note: "" }
              ]
          },
          {
              id: 'accessories',
              title: "Accessori",
              content: "I dettagli che fanno la differenza.",
              examples: [
                  { french: "Des boucles d'oreilles", italian: "Orecchini", note: "" },
                  { french: "Un collier / Une bague", italian: "Collana / Anello", note: "" },
                  { french: "Un sac", italian: "Borsa / Zaino", note: "" }
              ]
          },
          {
              id: 'pets',
              title: "Animali Domestici",
              content: "I nostri amici animali.",
              examples: [
                  { french: "Le chien / Le chat", italian: "Il cane / Il gatto", note: "" },
                  { french: "Le poisson rouge", italian: "Il pesce rosso", note: "" },
                  { french: "Le perroquet / La tortue", italian: "Il pappagallo / La tartaruga", note: "" }
              ]
          }
      ]
  },
  [TopicId.VERBI_ER]: {
    title: "Verbi in -ER (1° Gruppo)",
    description: "Parler, Manger, Aimer. Il 90% dei verbi francesi. Facili e regolari.",
    sections: [
        {
            id: 'intro_er',
            title: "Regola Generale",
            content: "Per coniugare un verbo in -ER, togli la desinenza -ER e aggiungi: -e, -es, -e, -ons, -ez, -ent.",
            conjugationTables: [
                {
                    title: "Parler (Parlare)",
                    rows: [
                        { pronoun: "Je", verb: "parle" },
                        { pronoun: "Tu", verb: "parles" },
                        { pronoun: "Il", verb: "parle" },
                        { pronoun: "Elle", verb: "parle" },
                        { pronoun: "On", verb: "parle" },
                        { pronoun: "Nous", verb: "parlons" },
                        { pronoun: "Vous", verb: "parlez" },
                        { pronoun: "Ils", verb: "parlent" },
                        { pronoun: "Elles", verb: "parlent" }
                    ]
                }
            ],
            examples: [
                { french: "Je parle français.", italian: "Parlo francese.", note: "" },
                { french: "Ils parlent (parl) anglais.", italian: "Loro parlano inglese.", note: "-ENT non si pronuncia!" }
            ]
        },
        {
            id: 'exceptions_spelling',
            title: "Eccezioni Ortografiche",
            content: "Per mantenere il suono dolce, alcuni verbi cambiano leggermente con 'Nous'.",
            examples: [
                { french: "Manger -> Nous mangeons", italian: "Mangiamo", note: "Si aggiunge 'e' per non leggere 'mang-ons'" },
                { french: "Commencer -> Nous commençons", italian: "Iniziamo", note: "Si usa la cediglia 'ç' per non leggere 'commenc-ons'" }
            ]
        },
        {
            id: 'aller_exception',
            title: "Attenzione: ALLER",
            content: "Il verbo 'Aller' (andare) finisce in -ER ma è IRREGOLARE (3° gruppo). Non dire 'J'alle'!",
            examples: [
                { french: "Je vais", italian: "Io vado", note: "Irregolare" },
                { french: "Tu vas", italian: "Tu vai", note: "" },
                { french: "Ils vont", italian: "Loro vanno", note: "" }
            ]
        }
    ]
  },
  [TopicId.VERBI_TOP]: {
    title: "I Fantastici 4 (Verbi Fondamentali)",
    description: "Essere, Avere, Andare, Fare. Sono irregolari, sono ovunque e sono essenziali.",
    sections: [
        {
            id: 'etre_avoir',
            title: "Être & Avoir (Essere & Avere)",
            content: "Le basi assolute. Servono anche per formare il passato. Imparali a memoria!",
            conjugationTables: [
                {
                    title: "Être (Essere)",
                    rows: [
                        { pronoun: "Je", verb: "suis" },
                        { pronoun: "Tu", verb: "es" },
                        { pronoun: "Il", verb: "est" },
                        { pronoun: "Elle", verb: "est" },
                        { pronoun: "On", verb: "est" },
                        { pronoun: "Nous", verb: "sommes" },
                        { pronoun: "Vous", verb: "êtes" },
                        { pronoun: "Ils", verb: "sont" },
                        { pronoun: "Elles", verb: "sont" }
                    ]
                },
                {
                    title: "Avoir (Avere)",
                    rows: [
                        { pronoun: "J'", verb: "ai" },
                        { pronoun: "Tu", verb: "as" },
                        { pronoun: "Il", verb: "a" },
                        { pronoun: "Elle", verb: "a" },
                        { pronoun: "On", verb: "a" },
                        { pronoun: "Nous", verb: "avons" },
                        { pronoun: "Vous", verb: "avez" },
                        { pronoun: "Ils", verb: "ont" },
                        { pronoun: "Elles", verb: "ont" }
                    ]
                }
            ],
            examples: [
                { french: "Je suis italien.", italian: "Sono italiano.", note: "Être" },
                { french: "J'ai faim (Affamé).", italian: "Ho fame (Affamato).", note: "Avoir" },
                { french: "J'ai soif (Assoifé).", italian: "Ho sete (Assetato).", note: "Avoir" },
                { french: "J'ai de la chance (Chanceux).", italian: "Sono fortunato.", note: "Avoir" }
            ]
        },
        {
            id: 'aller_faire',
            title: "Aller & Fare (Andare & Fare)",
            content: "Attenzione! 'Aller' sembra regolare ma non lo è. 'Faire' è usato in mille espressioni.",
            conjugationTables: [
                {
                    title: "Aller (Andare)",
                    rows: [
                        { pronoun: "Je", verb: "vais" },
                        { pronoun: "Tu", verb: "vas" },
                        { pronoun: "Il", verb: "va" },
                        { pronoun: "Elle", verb: "va" },
                        { pronoun: "On", verb: "va" },
                        { pronoun: "Nous", verb: "allons" },
                        { pronoun: "Vous", verb: "allez" },
                        { pronoun: "Ils", verb: "vont" },
                        { pronoun: "Elles", verb: "vont" }
                    ]
                },
                {
                    title: "Faire (Fare)",
                    rows: [
                        { pronoun: "Je", verb: "fais" },
                        { pronoun: "Tu", verb: "fais" },
                        { pronoun: "Il", verb: "fait" },
                        { pronoun: "Elle", verb: "fait" },
                        { pronoun: "On", verb: "fait" },
                        { pronoun: "Nous", verb: "faisons" },
                        { pronoun: "Vous", verb: "faites" },
                        { pronoun: "Ils", verb: "font" },
                        { pronoun: "Elles", verb: "font" }
                    ]
                }
            ],
            examples: [
                { french: "Je vais bien.", italian: "Sto bene.", note: "Si usa Aller per la salute" },
                { french: "Ils font du sport.", italian: "Loro fanno sport.", note: "Faire" },
                { french: "Vous faites quoi ?", italian: "Cosa fate?", note: "Attenzione: 'Faites' non 'Faisez'!" }
            ]
        }
    ]
  },
  [TopicId.VERBI_IR]: {
    title: "Verbi Regolari in -IR (2° Gr.)",
    description: "Il Secondo Gruppo. Sembrano difficili, ma sono regolarissimi se ricordi il trucco 'ISS'.",
    sections: [
        {
            id: 'definition',
            title: 'Definizione e Participio',
            content: "I verbi del 2° gruppo finiscono in -IR e il loro participio presente finisce in -ISSANT (es: Finir -> Finissant). Questo li distingue dagli irregolari!",
            examples: [
                { french: 'Finir (Finissant)', italian: 'Finire', note: '2° Gruppo (Regolare)' },
                { french: 'Partir (Partant)', italian: 'Partire', note: '3° Gruppo (Irregolare) - Niente ISS' }
            ]
        },
        {
            id: 'tech',
            title: 'La Tecnica (Togli e Aggiungi)',
            content: "Questi verbi finiscono in -IR all'infinito (es. Finir). Per coniugarli, togli la 'R' o la 'IR' e aggiungi le desinenze (-is, -is, -it, -issons, -issez, -issent).",
            examples: [
                { french: 'Finir -> Je finis', italian: 'Finire -> Io finisco', note: 'Togli R, aggiungi S.' },
                { french: 'Choisir -> Tu choisis', italian: 'Scegliere -> Tu scegli', note: 'Uguale a Je.' },
                { french: 'Grossir -> Il grossit', italian: 'Ingrassare -> Lui ingrassa', note: 'La T finale.' }
            ]
        },
        {
            id: 'bridge',
            title: "Il Ponte 'ISS' (Fondamentale!)",
            content: "Questa è la chiave. Al plurale (Nous, Vous, Ils), prima della desinenza spunta un doppio 'SS'. Questo suono allungato è ciò che distingue il 2° gruppo dagli irregolari.",
            examples: [
                { french: 'Nous finissons', italian: 'Noi finiamo', note: 'Fin + ISS + ons' },
                { french: 'Vous choisissez', italian: 'Voi scegliete', note: 'Chois + ISS + ez' },
                { french: 'Ils grossissent', italian: 'Loro ingrassano', note: 'Gross + ISS + ent' }
            ]
        },
        {
            id: 'pronunciation',
            title: "Segreti di Pronuncia",
            content: "Al singolare (Je, Tu, Il) la consonante finale (s, t) NON si legge. Al plurale, la desinenza -ENT (Ils finissent) è muta, ma devi far sentire forte il suono 'ISS'.",
            examples: [
                { french: 'Je finis', italian: 'Suono tronco (Finì).', note: 'Pronuncia: "Finì". La S è muta.' },
                { french: 'Il finit', italian: 'Suono uguale a Je/Tu.', note: 'Pronuncia: "Finì". La T è muta.' },
                { french: 'Ils finissent', italian: 'SS sonoro, ENT muto.', note: 'Pronuncia: "Finìss". Non dire "Finissenté"!' }
            ]
        },
        {
            id: 'tables',
            title: "Tabelle di Coniugazione",
            content: "Ecco la coniugazione completa dei verbi più importanti. Nota come seguono tutti lo stesso schema.",
            examples: [],
            conjugationTables: [
                {
                    title: "Finir (Finire)",
                    rows: [
                        { pronoun: "Je", verb: "finis" },
                        { pronoun: "Tu", verb: "finis" },
                        { pronoun: "Il", verb: "finit" },
                        { pronoun: "Elle", verb: "finit" },
                        { pronoun: "On", verb: "finit" },
                        { pronoun: "Nous", verb: "finissons" },
                        { pronoun: "Vous", verb: "finissez" },
                        { pronoun: "Ils", verb: "finissent" },
                        { pronoun: "Elles", verb: "finissent" }
                    ]
                },
                {
                    title: "Grossir (Ingrassare)",
                    rows: [
                        { pronoun: "Je", verb: "grossis" },
                        { pronoun: "Tu", verb: "grossis" },
                        { pronoun: "Il", verb: "grossit" },
                        { pronoun: "Elle", verb: "grossit" },
                        { pronoun: "On", verb: "grossit" },
                        { pronoun: "Nous", verb: "grossissons" },
                        { pronoun: "Vous", verb: "grossissez" },
                        { pronoun: "Ils", verb: "grossissent" },
                        { pronoun: "Elles", verb: "grossissent" }
                    ]
                },
                {
                    title: "Choisir (Scegliere)",
                    rows: [
                        { pronoun: "Je", verb: "choisis" },
                        { pronoun: "Tu", verb: "choisis" },
                        { pronoun: "Il", verb: "choisit" },
                        { pronoun: "Elle", verb: "choisit" },
                        { pronoun: "On", verb: "choisit" },
                        { pronoun: "Nous", verb: "choisissons" },
                        { pronoun: "Vous", verb: "choisissez" },
                        { pronoun: "Ils", verb: "choisissent" },
                        { pronoun: "Elles", verb: "choisissent" }
                    ]
                }
            ]
        }
    ]
  },
  [TopicId.VERBI_3_GROUP]: {
    title: "Verbi del 3° Gruppo (Irregolari)",
    description: "Il cestino dei verbi. Qui trovi -RE, -OIR e gli -IR irregolari. Bisogna studiarli a memoria!",
    sections: [
        {
            id: 'intro_3',
            title: "Le Tre Famiglie",
            content: "Questo gruppo include tutti i verbi che non sono nel 1° o nel 2°. Si dividono principalmente in tre sottogruppi.",
            examples: [
                { french: "Dormir / Partir / Sortir", italian: "Dormire/Partire/Uscire", note: "Finiscono in -IR ma niente 'ISS'" },
                { french: "Prendre / Attendre / Boire", italian: "Prendere/Attendere/Bere", note: "Finiscono in -RE" },
                { french: "Pouvoir / Vouloir / Voir", italian: "Potere/Volere/Vedere", note: "Finiscono in -OIR" }
            ]
        },
        {
            id: 'ir_irreg',
            title: "Gli Irregolari in -IR (Partir)",
            content: "A differenza di Finir, questi verbi perdono l'ultima lettera della radice al singolare.",
            conjugationTables: [
                {
                    title: "Partir (Partire)",
                    rows: [
                        { pronoun: "Je", verb: "pars" },
                        { pronoun: "Tu", verb: "pars" },
                        { pronoun: "Il", verb: "part" },
                        { pronoun: "Elle", verb: "part" },
                        { pronoun: "On", verb: "part" },
                        { pronoun: "Nous", verb: "partons" },
                        { pronoun: "Vous", verb: "partez" },
                        { pronoun: "Ils", verb: "partent" },
                        { pronoun: "Elles", verb: "partent" }
                    ]
                }
            ],
            examples: [
                { french: "Je pars.", italian: "Io parto.", note: "S compare, T sparisce" },
                { french: "Nous partons.", italian: "Noi partiamo.", note: "Niente 'ISS'!" }
            ]
        },
        {
            id: 're_irreg',
            title: "I verbi in -RE (Prendre)",
            content: "Molto comuni. Attenzione alla 3ª persona plurale che raddoppia la 'n'.",
            conjugationTables: [
                {
                    title: "Prendre (Prendere)",
                    rows: [
                        { pronoun: "Je", verb: "prends" },
                        { pronoun: "Tu", verb: "prends" },
                        { pronoun: "Il", verb: "prend" },
                        { pronoun: "Elle", verb: "prend" },
                        { pronoun: "On", verb: "prend" },
                        { pronoun: "Nous", verb: "prenons" },
                        { pronoun: "Vous", verb: "prenez" },
                        { pronoun: "Ils", verb: "prennent" },
                        { pronoun: "Elles", verb: "prennent" }
                    ]
                }
            ],
            examples: [
                { french: "Je prends le bus.", italian: "Prendo l'autobus.", note: "Prendre" },
                { french: "Ils prennent un café.", italian: "Prendono un caffè.", note: "Doube 'n'" }
            ]
        },
        {
            id: 'oir_irreg',
            title: "I verbi in -OIR (Pouvoir/Vouloir)",
            content: "Questi cambiano la vocale e usano la 'x' al singolare!",
            conjugationTables: [
                {
                    title: "Pouvoir (Potere)",
                    rows: [
                        { pronoun: "Je", verb: "peux" },
                        { pronoun: "Tu", verb: "peux" },
                        { pronoun: "Il", verb: "peut" },
                        { pronoun: "Elle", verb: "peut" },
                        { pronoun: "On", verb: "peut" },
                        { pronoun: "Nous", verb: "pouvons" },
                        { pronoun: "Vous", verb: "pouvez" },
                        { pronoun: "Ils", verb: "peuvent" },
                        { pronoun: "Elles", verb: "peuvent" }
                    ]
                },
                {
                    title: "Vouloir (Volere)",
                    rows: [
                        { pronoun: "Je", verb: "veux" },
                        { pronoun: "Tu", verb: "veux" },
                        { pronoun: "Il", verb: "veut" },
                        { pronoun: "Elle", verb: "veut" },
                        { pronoun: "On", verb: "veut" },
                        { pronoun: "Nous", verb: "voulons" },
                        { pronoun: "Vous", verb: "voulez" },
                        { pronoun: "Ils", verb: "veulent" },
                        { pronoun: "Elles", verb: "veulent" }
                    ]
                }
            ],
            examples: [
                { french: "Je peux venir.", italian: "Posso venire.", note: "Pouvoir" },
                { french: "Il veut partir.", italian: "Vuole partire.", note: "Vouloir" }
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
        content: "L'imperativo si usa per ordini, consigli o esortazioni. Non ha soggetto esplicito ed esiste solo per tre persone: Tu, Nous, Vous. Per i verbi in -ER (come Parler), alla 2ª pers. singolare (Tu) si toglie la 's' finale.",
        examples: [
          { french: 'Parle !', italian: 'Parla! (Tu)', note: 'Senza "s" finale (Verbi -ER).' },
          { french: 'Finis !', italian: 'Finisci! (Tu)', note: 'Verbi -IR mantengono la "s".' },
          { french: 'Allons-y !', italian: 'Andiamoci! (Nous)', note: 'Esortazione.' },
          { french: 'Écoutez !', italian: 'Ascoltate! (Vous)', note: 'Comando formale o plurale.' },
        ]
      },
      {
        id: 'euphony',
        title: 'Eccezione Eufonica (Il ritorno della S)',
        content: "Attenzione! Anche se i verbi in -ER perdono la 's', questa ritorna magicamente se il verbo è seguito dai pronomi 'y' o 'en', per evitare lo scontro di vocali.",
        examples: [
          { french: 'Va à la maison.', italian: 'Vai a casa.', note: 'Senza "s".' },
          { french: 'Vas-y !', italian: 'Vacci!', note: 'La "s" torna per suonare bene con "y".' },
          { french: 'Manges-en !', italian: 'Mangiane!', note: 'La "s" torna per legare con "en".' }
        ]
      },
      {
        id: 'exception',
        title: 'Posizione Pronomi COD',
        content: "Ecco il collegamento con i COD! Se l'ordine è AFFERMATIVO, il pronome va DOPO il verbo con un trattino. Se è NEGATIVO, torna tutto normale (PRIMA).",
        examples: [
          { french: 'Regarde-la !', italian: 'Guardala!', note: 'Affermativo: DOPO con trattino.' },
          { french: 'Ne la regarde pas !', italian: 'Non guardarla!', note: 'Negativo: PRIMA.' },
          { french: 'Mange-le !', italian: 'Mangialo!', note: 'Affermativo.' }
        ]
      },
      {
        id: 'irregulars',
        title: 'Verbi Irregolari Importanti',
        content: "Alcuni verbi fondamentali cambiano radice completamente all'imperativo. Ecco i quattro più importanti da memorizzare.",
        examples: [],
        conjugationTables: [
            {
                title: "Avoir (Avere)",
                rows: [
                    { pronoun: "(Tu)", verb: "Aie" },
                    { pronoun: "(Nous)", verb: "Ayons" },
                    { pronoun: "(Vous)", verb: "Ayez" }
                ]
            },
            {
                title: "Être (Essere)",
                rows: [
                    { pronoun: "(Tu)", verb: "Sois" },
                    { pronoun: "(Nous)", verb: "Soyons" },
                    { pronoun: "(Vous)", verb: "Soyez" }
                ]
            },
            {
                title: "Savoir (Sapere)",
                rows: [
                    { pronoun: "(Tu)", verb: "Sache" },
                    { pronoun: "(Nous)", verb: "Sachons" },
                    { pronoun: "(Vous)", verb: "Sachez" }
                ]
            },
            {
                title: "Aller (Andare)",
                rows: [
                    { pronoun: "(Tu)", verb: "Va" },
                    { pronoun: "(Nous)", verb: "Allons" },
                    { pronoun: "(Vous)", verb: "Allez" }
                ]
            }
        ]
      },
      {
        id: 'reflexive',
        title: 'Verbi Riflessivi (Me -> Moi)',
        content: "Anche i pronomi riflessivi vanno dopo il verbo nell'affermativo. Attenzione: 'Te' diventa 'Toi' e 'Me' diventa 'Moi'!",
        examples: [
          { french: 'Lève-toi !', italian: 'Alzati!', note: 'Te -> Toi.' },
          { french: 'Parle-moi !', italian: 'Parlami!', note: 'Me -> Moi.' },
          { french: 'Ne te lève pas.', italian: 'Non alzarti.', note: 'Torna normale nel negativo.' },
        ]
      }
    ]
  },
  [TopicId.ORIENTATION]: {
      title: "Orientamento e Città",
      description: "Impara a chiedere indicazioni, usare le preposizioni di luogo e muoverti in città.",
      sections: [
          {
              id: 'asking',
              title: "I. Chiedere Indicazioni",
              content: "Scusi signore, dov'è la stazione? Ecco le formule di cortesia fondamentali per non perdersi mai.",
              examples: [
                  { french: "Pardon madame, pour aller à la gare ?", italian: "Scusi signora, per andare alla stazione?", note: "Formale" },
                  { french: "Excusez-moi, où se trouve la cathédrale ?", italian: "Mi scusi, dove si trova la cattedrale?", note: "Standard" },
                  { french: "Je cherche la poste, s'il vous plaît.", italian: "Cerco la posta, per favore.", note: "Utile" },
                  { french: "Je ne suis pas d'ici.", italian: "Non sono di qui.", note: "Se ti chiedono qualcosa" }
              ]
          },
          {
              id: 'prepositions',
              title: "II. Le Preposizioni di Luogo",
              content: "Dove si trovano le cose? Davanti, dietro, a sinistra... Memorizza queste parole chiave.",
              examples: [
                  { french: "Devant / Derrière", italian: "Davanti / Dietro", note: "Opposti" },
                  { french: "À côté de / Près de", italian: "Accanto a / Vicino a", note: "+ 'de' + articolo" },
                  { french: "En face de", italian: "Di fronte a", note: "Dall'altro lato della strada" },
                  { french: "Au coin de la rue", italian: "All'angolo della strada", note: "" },
                  { french: "Entre la banque et le musée", italian: "Tra la banca e il museo", note: "Tra due cose" }
              ]
          },
          {
              id: 'directions',
              title: "III. Dare Istruzioni (Imperativo)",
              content: "Per spiegare la strada si usa l'Imperativo. Vai dritto, gira, attraversa!",
              examples: [
                  { french: "Allez tout droit.", italian: "Andate dritto.", note: "Sempre dritto" },
                  { french: "Tournez à gauche / à droite.", italian: "Girate a sinistra / a destra.", note: "" },
                  { french: "Traversez le pont / la piazza.", italian: "Attraversate il ponte / la piazza.", note: "" },
                  { french: "Prenez la deuxième rue à droite.", italian: "Prendete la seconda strada a destra.", note: "" },
                  { french: "Vous y êtes.", italian: "Siete arrivati.", note: "Fine percorso" }
              ]
          },
          {
              id: 'places_transport',
              title: "IV. Lessico: Muoversi in Città",
              content: "Vocabolario essenziale per muoversi e orientarsi.",
              examples: [
                  { french: "Se déplacer / Bouger", italian: "Spostarsi / Muoversi", note: "Verbi chiave" },
                  { french: "Un carrefour / Un feu rouge", italian: "Incrocio / Semaforo", note: "Strada" },
                  { french: "Je vais en voiture / en bus.", italian: "Vado in auto / bus.", note: "EN (dentro)" },
                  { french: "Je vais à pied / à vélo.", italian: "Vado a piedi / in bici.", note: "À (sopra/eccezione)" },
                  { french: "Une piste cyclable", italian: "Pista ciclabile", note: "Per le bici" }
              ]
          }
      ]
  },
  [TopicId.LYON]: {
      title: "Lyon: Capitale Gastronomique",
      description: "Scopri la terza città della Francia: fiumi, cinema, storia e futuro.",
      sections: [
          {
              id: 'geo_history',
              title: "I. Geografia e Storia del Cinema",
              content: "Lyon è una bella città situata nel sud-est della Francia, alla confluenza di due fiumi: il Rodano e la Saona. È qui che i fratelli Lumière hanno inventato il cinema nel 1895!",
              videoUrl: "https://npmitaly-pro-apidistribucion.sanoma.it/product/1122841/ONLINE/assets/book/resources/9hAZGuMuqApB3X0yyI9dnf/video/media/u4_75_lyon.mp4",
              transcript: `Tout le monde sait que le cinéma est né à Paris en 1895. La première projection publique et payante de l'histoire se passe à la fin de cette même année. Presque tout le monde sait aussi que ce sont les frères Auguste et Louis Lumière qui ont breveté l'invention du cinématographe. À Paris, il n'existe aucun musée qui conserve ses pionniers. Mais on trouve un musée à Lyon, une belle ville du sud-est de la France, au confluent du Rhône et de la Saône.
              
En effet, c'est ici que les deux entrepreneurs du cinéma ont décidé de mettre les images en mouvement. Le musée de Lyon rend un juste hommage à cette invention extraordinaire et fait voyager le visiteur jusqu'aux premières années du cinéma, au beau milieu de caméras en bois et de films muets en noir et blanc.
              
Mais il existe d'autres raisons pour visiter Lyon. En effet, la ville est aujourd'hui l'une des plus vivantes de France, mais aussi l'une des plus écologiques. Pour s'en rendre compte, il suffit de faire un tour dans le quartier de la Confluence, au sud du centre-ville.
              
Le Vieux Lyon, ou mieux, le "très vieux Lyon", n'est pas moins surprenant. Pour le découvrir, il faut monter sur la colline de Fourvière, où se trouve le théâtre romain, le site le plus ancien de la ville, témoignage de la domination romaine qui a commencé au premier siècle avant Jésus-Christ. C'est ici aussi que se trouve la splendide basilique Notre-Dame de Fourvière, inaugurée en 1872. Ses quatre tours rappellent plus un château qu'un édifice de culte. Mais il suffit de passer son portail pour se rendre compte que l'on est dans une église pleine d'œuvres d'art. En outre, la colline de Fourvière offre une vue magnifique sur la ville.
              
On aperçoit clairement son centre, la place Bellecour, une des plus grandes de France. Cette place forme le point de départ des rues principales de la ville, animées par des commerces, des musées et des monuments.
              
Les traboules sont par contre des passages couverts, réservés aux piétons, qui permettent de passer d'une rue à l'autre à travers des cours, des couloirs ou des escaliers. Les plus anciennes et célèbres traboules se trouvent dans le quartier du Vieux Lyon. Mais attention, ne vous perdez pas et respectez surtout la tranquillité des habitations que vous traversez.`,
              examples: [
                  { french: "Lyon est située au confluent du Rhône et de la Saône.", italian: "Lione è situata alla confluenza del Rodano e della Saona.", note: "Geografia" },
                  { french: "Ce sont les frères Lumière qui ont breveté l'invention du cinématographe.", italian: "Sono i fratelli Lumière che hanno brevettato l'invenzione del cinematografo.", note: "Storia" },
                  { french: "On trouve un musée du cinéma à Lyon.", italian: "Si trova un museo del cinema a Lione (non a Parigi!).", note: "Cultura" }
              ]
          },
          {
              id: 'vieux_lyon',
              title: "II. Il Cuore Storico: Vieux Lyon",
              content: "Il 'Vieux Lyon' è la parte rinascimentale. Si trova ai piedi della collina di Fourvière. Qui trovi i famosi 'Traboules', passaggi segreti tra i palazzi.",
              examples: [
                  { french: "La basilique Notre-Dame de Fourvière rappelle un château.", italian: "La basilica di Fourvière ricorda un castello (inaugurata nel 1872).", note: "Architettura" },
                  { french: "Les Traboules sont des passages couverts réservés aux piétons.", italian: "I Traboules sono passaggi coperti riservati ai pedoni.", note: "Urbanistica" },
                  { french: "La Place Bellecour est une des plus grandes de France.", italian: "Piazza Bellecour è una delle più grandi di Francia.", note: "Centro città" }
              ]
          },
          {
              id: 'confluence_vlog',
              title: "III. Confluence: Il Quartiere del Futuro",
              content: "Una volta zona industriale degradata, oggi Confluence è un eco-quartiere ultramoderno a sud del centro. Un vero 'delirio di architetti' basato sulla logica sostenibile.",
              videoUrl: "https://npmitaly-pro-apidistribucion.sanoma.it/product/1122841/ONLINE/assets/book/resources/9hAZGuMuqApB3X0yyI9dnf/video/media/u4_87_lyon_confluence.mp4",
              transcript: `Bonjour et bienvenue à tous et à toutes pour une nouvelle rencontre sur mon vlog, La France à 360 degrés. Jingle !
              
Aujourd'hui, direction Lyon ! Et plus précisément le quartier Confluence. On y va ?
Nous voici à Lyon. Ce quartier s'appelle Confluence parce qu'il est à la jonction de deux fleuves : le Rhône et la Saône.
              
Nous sommes avec Clémence au quartier Confluence. Elle a accepté de répondre à nos questions.
- Bonjour Clémence.
- Bonjour.
- Alors, vous habitez ici depuis combien de temps ?
- Un an. Tout juste un an. J'ai déménagé ici l'été dernier, donc ça fait un an que j'habite ici.
- Et pourquoi vous avez choisi ce quartier ?
- J'ai choisi ce quartier d'abord parce qu'il est très bien placé par rapport au centre-ville, très bien desservi par les transports. Et c'est un quartier tout neuf, donc très calme, très posé, non dégradé.
- On peut parler d'un éco-quartier ?
- Oui, c'est vrai que... je connais pas tout leur plan, mais en termes de service de propreté, c'est très bien mené. Entre autres, les règles sur le recyclage qui sont très strictes ici.
- Confluence est très innovateur. Vous en pensez quoi ?
- Alors en termes de architecture, oui ! C'est un délire d'architecte, ce quartier ! En termes de vie pour tous ceux qui habitent ici, c'est vrai qu'ils ont très bien conçu leur quartier. Entre la proximité avec le centre-ville, le centre commercial où on peut trouver absolument tout ce dont on a besoin... Même comme le quartier a été conçu, c'est vrai que c'est assez novateur et très bien conçu.
- C'est pour ça que vous avez choisi de vivre ici ?
- Tout à fait.
- Qu'est-ce qu'on peut faire comme loisirs dans le quartier de Confluence ?
- Alors les quais sont très bien aménagés. Ils ont vraiment aménagé de manière à ce qu'on puisse faire du vélo, qu'on puisse venir se détendre avec les enfants puisqu'ils ont fait beaucoup de structures pour les enfants, des stades, des parcs. C'est très bien en termes de restaurants, de chemins pour se détendre, c'est très agréable ici.
- Et à visiter du coup, il y a le musée ?
- Le musée, ouais, qui est assez célèbre.
- Est-ce qu'il y a des inconvénients à vivre ici ?
- J'en vois pas beaucoup, très honnêtement. Entre les berges qui sont très bien aménagées, les transports qui desservent absolument tout le quartier Confluence et le centre commercial, il n'y a pas grand, beaucoup d'inconvénients.
- Pour conclure d'un mot, Lyon ?
- C'est la plus belle ville du monde !
- Vous êtes d'ici ?
- Oui, je suis d'ici ouais. Je suis née, j'ai grandi ici, j'ai fait mes études ici, je travaille ici. Donc c'est vraiment idéal.
- Merci d'avoir répondu à nos questions, Clémence.
              
Voici les wagons où on transportait le sucre jusqu'à la Sucrière. Direction la Sucrière ! C'est aujourd'hui un centre d'art contemporain.
Derrière moi, le siège d'Euronews.
Ici, c'est le musée des Confluences, musée d'histoire naturelle. Il est situé à l'endroit où se rejoignent la Saône et le Rhône.
Et voilà, c'était le quartier Confluence à Lyon. À très bientôt pour une nouvelle rencontre et soyez de plus en plus nombreux à nous suivre !`,
              examples: [
                  { french: "C'est un éco-quartier avec des règles strictes sur le recyclage.", italian: "È un eco-quartiere con regole severe sul riciclaggio.", note: "Ambiente" },
                  { french: "Le Cube Orange a une enveloppe perforée pour l'isolation thermique.", italian: "Il Cubo Arancione ha un involucro perforato per l'isolamento termico.", note: "Design" },
                  { french: "La Sucrière est aujourd'hui un centre d'art contemporain.", italian: "La Sucrière (ex zuccherificio) è oggi un centro d'arte contemporanea.", note: "Cultura" }
              ]
          },
          {
              id: 'lexique_lyon',
              title: "IV. Glossario: Città ed Ecologia",
              content: "Parole chiave per capire Lione, la sua storia e il suo futuro sostenibile.",
              examples: [
                  { french: "Le confluent / La jonction", italian: "La confluenza (di fiumi)", note: "Dove si uniscono" },
                  { french: "Une zone dégradée", italian: "Una zona degradata (ex industriale)", note: "Prima del restauro" },
                  { french: "Logique durable / Éco-quartier", italian: "Sostenibilità / Eco-quartiere", note: "Ecologia" },
                  { french: "Végétalisation", italian: "Vegetalizzazione (piantare alberi)", note: "Verde urbano" },
                  { french: "Isolation thermique", italian: "Isolamento termico", note: "Risparmio energia" },
                  { french: "Le cinématographe", italian: "Il cinematografo", note: "Fratelli Lumière (1895)" }
              ]
          },
          {
              id: 'food',
              title: "V. Gastronomie (Les Bouchons)",
              content: "Non puoi visitare Lyon senza mangiare in un 'Bouchon', le trattorie tipiche. Qui si mangiano piatti ricchi e tradizionali. La città è considerata la capitale mondiale della gastronomia.",
              examples: [
                  { french: "On mange dans un bouchon lyonnais.", italian: "Mangiamo in una trattoria lionese.", note: "Vocabolario" },
                  { french: "La rosette de Lyon est délicieuse.", italian: "Il salame di Lione è delizioso.", note: "Cibo" }
              ]
          }
      ]
  }
};

// Helper to get context icon
  const getContextIcon = (text) => {
    const t = text.toLowerCase();
    if (t.includes('mang') || t.includes('faim') || t.includes('boir') || t.includes('bouchon') || t.includes('gâteau') || t.includes('délicieux')) return <Utensils size={24} className="text-orange-500"/>;
    if (t.includes('voiture') || t.includes('bus') || t.includes('train') || t.includes('métro') || t.includes('tram') || t.includes('gare')) return <Train size={24} className="text-blue-500"/>;
    if (t.includes('vélo') || t.includes('cyclable')) return <Bike size={24} className="text-green-500"/>;
    if (t.includes('avion')) return <Plane size={24} className="text-sky-500"/>;
    if (t.includes('aim') || t.includes('ador') || t.includes('coeur')) return <Heart size={24} className="text-red-500"/>;
    if (t.includes('regard') || t.includes('voir') || t.includes('yeux') || t.includes('lunettes')) return <Eye size={24} className="text-purple-500"/>;
    if (t.includes('maison') || t.includes('habiter') || t.includes('rue') || t.includes('ville')) return <Home size={24} className="text-indigo-500"/>;
    if (t.includes('cinéma') || t.includes('film') || t.includes('photo')) return <Camera size={24} className="text-pink-500"/>;
    if (t.includes('musée') || t.includes('art') || t.includes('basilique') || t.includes('château')) return <Landmark size={24} className="text-amber-600"/>;
    if (t.includes('chant') || t.includes('musique')) return <Music size={24} className="text-teal-500"/>;
    if (t.includes('soleil') || t.includes('été') || t.includes('chaud')) return <Sun size={24} className="text-yellow-500"/>;
    if (t.includes('café') || t.includes('thé')) return <Coffee size={24} className="text-amber-800"/>;
    if (t.includes('acheter') || t.includes('boutique') || t.includes('magasin') || t.includes('sac') || t.includes('vêtement') || t.includes('robe') || t.includes('pantalon') || t.includes('coûte') || t.includes('euros')) return <ShoppingBag size={24} className="text-rose-500"/>;
    if (t.includes('ami') || t.includes('parent') || t.includes('famille') || t.includes('enfant') || t.includes('gens') || t.includes('appelle')) return <Users size={24} className="text-cyan-600"/>;
    if (t.includes('content') || t.includes('heureux') || t.includes('ravi') || t.includes('enchanté')) return <Smile size={24} className="text-green-400"/>;
    if (t.includes('heure') || t.includes('temps') || t.includes('matin') || t.includes('soir')) return <Clock size={24} className="text-slate-500"/>;
    if (t.includes('un') || t.includes('deux') || t.includes('trois') || t.includes('compter')) return <Calculator size={24} className="text-blue-500"/>;
    if (t.includes('le') || t.includes('la') || t.includes('les') || t.includes('livre')) return <Box size={24} className="text-purple-400"/>;

    return <Zap size={24} className="text-yellow-400"/>; // Default
};

const LearnView = ({ topicId, onBack }) => {
  const data = courseContent[topicId];
  const [openSection, setOpenSection] = useState(data.sections[0].id);
  const [voices, setVoices] = useState([]);
  const [expandedTranscript, setExpandedTranscript] = useState(null);

  useEffect(() => {
     const load = () => setVoices(window.speechSynthesis.getVoices());
     load();
     window.speechSynthesis.onvoiceschanged = load;
     return () => { window.speechSynthesis.onvoiceschanged = null; }
  }, []);

  // Auto-read content on mount
  useEffect(() => {
    const speakQueue = (text, lang) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = 0.95;
        
        // Try to find best voice from the state or getVoices directly
        const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
        const preferredVoice = availableVoices.find(v => v.lang === lang && v.name.includes('Google')) ||
                               availableVoices.find(v => v.lang.startsWith(lang.split('-')[0]));
        
        if (preferredVoice) u.voice = preferredVoice;
        window.speechSynthesis.speak(u);
    };

    // Slight delay to allow transition
    const timer = setTimeout(() => {
        window.speechSynthesis.cancel();
        // Title (IT)
        speakQueue(data.title, 'it-IT');
        // Description (IT)
        speakQueue(data.description, 'it-IT');
        
        // First Section Title & Content (IT)
        if (data.sections.length > 0) {
            speakQueue(data.sections[0].title, 'it-IT');
            speakQueue(data.sections[0].content, 'it-IT');
        }
    }, 800);

    return () => {
        clearTimeout(timer);
        window.speechSynthesis.cancel();
    };
  }, [topicId, voices.length]); // Depend on voices.length to retry if voices load late

    const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
    setExpandedTranscript(null); // Reset transcript view on section change
  };

    const playAudio = (text) => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/\//g, ',')); // Clean slashes
      u.lang = 'fr-FR';
      
      // Attempt to find a high quality Google/Native voice
      const preferredVoice = voices.find(v => v.lang.startsWith('fr') && v.name.includes('Google')) ||
                             voices.find(v => v.lang.startsWith('fr'));
      
      if (preferredVoice) u.voice = preferredVoice;
      u.rate = 0.9; // Slightly slower for learning
      window.speechSynthesis.speak(u);
  }

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

      {/* SPECIAL INTERACTIVE COMPONENT FOR ORIENTATION */}
      {topicId === TopicId.ORIENTATION && (
          <div className="mb-10 animate-in slide-in-from-bottom-4 duration-500">
             <CityMapGame />
          </div>
      )}

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
                {/* VIDEO PLAYER INTEGRATION */}
                {lesson.videoUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-lg bg-slate-900 border border-slate-800">
                        <video 
                            controls 
                            playsInline
                            className="w-full aspect-video"
                            poster="https://images.unsplash.com/photo-1524196962809-588f69b9ae05?q=80&w=1000&auto=format&fit=crop" 
                            crossOrigin="anonymous"
                        >
                            <source src={lesson.videoUrl} type="video/mp4" />
                            Il tuo browser non supporta il video.
                        </video>
                        <div className="p-3 bg-slate-900 text-slate-300 text-sm flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <PlayCircle size={16} className="text-french-red"/>
                                <span>Video Lezione: {lesson.title}</span>
                            </div>
                            {lesson.transcript && (
                                <button 
                                    onClick={() => setExpandedTranscript(expandedTranscript === lesson.id ? null : lesson.id)}
                                    className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                                >
                                    <FileText size={12} />
                                    {expandedTranscript === lesson.id ? 'Chiudi Trascrizione' : 'Leggi Trascrizione'}
                                </button>
                            )}
                        </div>
                        {/* Transcript Panel */}
                        {expandedTranscript === lesson.id && lesson.transcript && (
                            <div className="bg-slate-50 p-4 border-t border-slate-800 max-h-64 overflow-y-auto">
                                <h4 className="text-slate-800 font-bold mb-2 text-sm uppercase tracking-wide sticky top-0 bg-slate-50 pb-2 border-b border-slate-200">Trascrizione Video</h4>
                                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm font-medium">
                                    {lesson.transcript}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="prose text-slate-600 mb-6 border-l-4 border-french-red pl-4 bg-red-50 py-4 rounded-r-lg text-lg leading-relaxed">
                  {lesson.content}
                </div>
                
                {/* Conjugation Tables Rendering */}
                {lesson.conjugationTables && lesson.conjugationTables.map((table, tIdx) => (
                    <div key={tIdx} className="mb-8 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                        <div className="bg-french-blue text-white p-3 font-bold text-center font-serif tracking-wide">
                            {table.title}
                        </div>
                        <div className="divide-y divide-slate-100">
                            {table.rows.map((row, rIdx) => (
                                <button 
                                    key={rIdx}
                                    onClick={() => playAudio(`${row.pronoun} ${row.verb}`)}
                                    className="w-full flex justify-between items-center p-3 hover:bg-blue-50 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-2 w-1/3">
                                        {(row.pronoun.startsWith('Je') || row.pronoun.startsWith('Tu') || row.pronoun.startsWith('Il') || row.pronoun.startsWith('Elle')) && <User size={14} className="text-slate-400"/>}
                                        {(row.pronoun.startsWith('Nous') || row.pronoun.startsWith('Vous') || row.pronoun.startsWith('Ils')) && <Users size={14} className="text-slate-400"/>}
                                        <span className="font-bold text-slate-500">{row.pronoun}</span>
                                    </div>
                                    <span className="font-bold text-slate-800 text-lg w-2/3">{row.verb}</span>
                                    <Volume2 size={16} className="text-french-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.examples.map((ex, idx) => {
                    // INTELLIGENT AUDIO LOGIC
                    // For Pronunciation module, if the main text is a short phoneme (e.g. "OI"), 
                    // reading it directly is useless (reads letters O-I). 
                    // We read the examples in the notes (e.g. "Moi, Toi") instead.
                    const textToRead = (topicId === TopicId.PRONUNCIATION && ex.note && (ex.french.length <= 4 || ex.french.includes('/') || ex.french.includes('Cediglia')))
                        ? ex.note.replace(/\s*\(.*?\)/g, '') // Remove (translation) to read only French words
                        : ex.french;

                    return (
                    <div 
                        key={idx} 
                        onClick={() => playAudio(textToRead)}
                        className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-french-blue hover:bg-blue-50/30 cursor-pointer transition-all group relative"
                    >
                      <div className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                          {getContextIcon(ex.french)}
                      </div>
                      <div className="flex items-center justify-between mb-2 pr-4">
                        <span className="font-serif text-xl font-bold text-french-blue">{ex.french}</span>
                        <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             playAudio(textToRead);
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
                  );
                  })}
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