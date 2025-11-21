
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, Type, ArrowLeft, Book, CheckCircle2, Volume2, PlayCircle, FileText, MapPin, Navigation, User, RefreshCcw } from 'lucide-react';
import { LessonSection, TopicId } from '../types';

// -- Interactive Map Component --
const CityMapGame: React.FC = () => {
  const buildings = [
    { id: 'gare', name: 'Gare', row: 1, col: 1, icon: '🚂' },
    { id: 'parc', name: 'Parc', row: 1, col: 2, icon: '🌳' },
    { id: 'poste', name: 'Poste', row: 1, col: 3, icon: '✉️' },
    { id: 'mairie', name: 'Mairie', row: 2, col: 1, icon: '🏛️' },
    { id: 'place', name: 'Place', row: 2, col: 2, icon: '⛲' },
    { id: 'banque', name: 'Banque', row: 2, col: 3, icon: '💶' },
    { id: 'cinema', name: 'Cinéma', row: 3, col: 1, icon: '🎬' },
    { id: 'ecole', name: 'École', row: 3, col: 2, icon: '🏫' },
    { id: 'hopital', name: 'Hôpital', row: 3, col: 3, icon: '🏥' },
  ];

  const challenges = [
    { targetId: 'banque', instruction: "Tu es à la Gare. Va tout droit jusqu'à la Mairie, puis traverse la Place. C'est à droite." },
    { targetId: 'parc', instruction: "Le lieu se trouve au Nord, à côté de la Gare." },
    { targetId: 'hopital', instruction: "C'est au Sud-Est. Derrière l'école." },
    { targetId: 'mairie', instruction: "C'est en face de la Place, à gauche." }
  ];

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleBuildingClick = (b: any) => {
    if (success) return;
    
    if (b.id === challenges[currentChallengeIndex].targetId) {
      setFeedback("Bravo ! C'est correct ! 🎉");
      setSuccess(true);
      const u = new SpeechSynthesisUtterance("Bravo ! C'est correct !");
      u.lang = 'fr-FR';
      window.speechSynthesis.speak(u);
    } else {
      setFeedback(`Non, ce n'est pas ${b.name}. Essaie encore !`);
      const u = new SpeechSynthesisUtterance(`Non, ce n'est pas ${b.name}`);
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
    <div className="bg-slate-100 p-6 rounded-xl border-2 border-slate-200">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-french-blue flex items-center gap-2">
            <Navigation size={20}/> Trouve le chemin !
          </h4>
          <p className="text-slate-600 italic mt-2 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            "{challenges[currentChallengeIndex].instruction}"
          </p>
        </div>
        <button 
          onClick={nextChallenge} 
          className="text-xs bg-slate-200 hover:bg-slate-300 p-2 rounded-full transition-colors"
          title="Prossima sfida"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto aspect-square">
        {buildings.map((b) => (
          <button
            key={b.id}
            onClick={() => handleBuildingClick(b)}
            className={`relative bg-white rounded-xl shadow-sm border-2 flex flex-col items-center justify-center p-2 transition-all hover:scale-105 active:scale-95
              ${success && b.id === challenges[currentChallengeIndex].targetId ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-slate-200 hover:border-french-blue'}
            `}
          >
            <span className="text-3xl mb-1">{b.icon}</span>
            <span className="text-xs font-bold text-slate-600">{b.name}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`mt-4 p-3 rounded-lg text-center font-bold ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {feedback}
          {success && (
             <button onClick={nextChallenge} className="block mx-auto mt-2 text-xs bg-green-600 text-white px-4 py-2 rounded-full">
               Prossima Sfida →
             </button>
          )}
        </div>
      )}
    </div>
  );
};


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
  [TopicId.VERBI_IR]: {
    title: "Verbi Regolari in -IR",
    description: "Il Secondo Gruppo. Sembrano difficili, ma sono regolarissimi se ricordi il trucco 'ISS'.",
    sections: [
        {
            id: 'tech',
            title: 'La Tecnica (Togli e Aggiungi)',
            content: "Questi verbi finiscono in -IR all'infinito (es. Finir). Per coniugarli, togli la 'R' o la 'IR' e aggiungi le desinenze. Ma attenzione al plurale!",
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
                    title: "Finir (Finire) - Il Modello",
                    rows: [
                        { pronoun: "Je", verb: "finis" },
                        { pronoun: "Tu", verb: "finis" },
                        { pronoun: "Il/Elle", verb: "finit" },
                        { pronoun: "Nous", verb: "finissons" },
                        { pronoun: "Vous", verb: "finissez" },
                        { pronoun: "Ils/Elles", verb: "finissent" }
                    ]
                },
                {
                    title: "Choisir (Scegliere)",
                    rows: [
                        { pronoun: "Je", verb: "choisis" },
                        { pronoun: "Tu", verb: "choisis" },
                        { pronoun: "Il/Elle", verb: "choisit" },
                        { pronoun: "Nous", verb: "choisissons" },
                        { pronoun: "Vous", verb: "choisissez" },
                        { pronoun: "Ils/Elles", verb: "choisissent" }
                    ]
                },
                {
                    title: "Réfléchir (Riflettere)",
                    rows: [
                        { pronoun: "Je", verb: "réfléchis" },
                        { pronoun: "Tu", verb: "réfléchis" },
                        { pronoun: "Il/Elle", verb: "réfléchit" },
                        { pronoun: "Nous", verb: "réfléchissons" },
                        { pronoun: "Vous", verb: "réfléchissez" },
                        { pronoun: "Ils/Elles", verb: "réfléchissent" }
                    ]
                }
            ]
        },
        {
            id: 'trap',
            title: "La Trappola: Non tutti gli -IR...",
            content: "Attenzione! Verbi come 'Venir', 'Dormir', 'Partir' finiscono in -IR ma sono IRREGOLARI (3° gruppo). Come li riconosci? Non hanno il ponte 'ISS'.",
            examples: [
                { french: 'Nous partons', italian: 'Noi partiamo', note: 'NON partissons! (Irregolare)' },
                { french: 'Nous dormons', italian: 'Noi dormiamo', note: 'NON dormissons! (Irregolare)' },
                { french: 'Nous finissons', italian: 'Noi finiamo', note: 'Questo è 2° gruppo!' }
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
                  { french: "Traversez le pont / la place.", italian: "Attraversate il ponte / la piazza.", note: "" },
                  { french: "Prenez la deuxième rue à droite.", italian: "Prendete la seconda strada a destra.", note: "" }
              ]
          },
          {
              id: 'places_transport',
              title: "IV. Luoghi e Trasporti",
              content: "Vocabolario essenziale per muoversi in città.",
              examples: [
                  { french: "La Gare / L'Hôtel de Ville / La Mairie", italian: "Stazione / Comune / Municipio", note: "Luoghi pubblici" },
                  { french: "Je vais en voiture / en bus / en métro.", italian: "Vado in auto / bus / metro.", note: "EN per mezzi chiusi" },
                  { french: "Je vais à pied / à vélo / à moto.", italian: "Vado a piedi / bici / moto.", note: "À per mezzi aperti" }
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
- Alors en termes d'architecture, oui ! C'est un délire d'architecte, ce quartier ! En termes de vie pour tous ceux qui habitent ici, c'est vrai qu'ils ont très bien conçu leur quartier. Entre la proximité avec le centre-ville, le centre commercial où on peut trouver absolument tout ce dont on a besoin... Même comme le quartier a été conçu, c'est vrai que c'est assez novateur et très bien conçu.
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
              id: 'food',
              title: "IV. Gastronomie (Les Bouchons)",
              content: "Non puoi visitare Lyon senza mangiare in un 'Bouchon', le trattorie tipiche. Qui si mangiano piatti ricchi e tradizionali. La città è considerata la capitale mondiale della gastronomia.",
              examples: [
                  { french: "On mange dans un bouchon lyonnais.", italian: "Mangiamo in una trattoria lionese.", note: "Vocabolario" },
                  { french: "La rosette de Lyon est délicieuse.", italian: "Il salame di Lione è delizioso.", note: "Cibo" }
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [expandedTranscript, setExpandedTranscript] = useState<string | null>(null);

  useEffect(() => {
     const load = () => setVoices(window.speechSynthesis.getVoices());
     load();
     window.speechSynthesis.onvoiceschanged = load;
     return () => { window.speechSynthesis.onvoiceschanged = null; }
  }, []);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
    setExpandedTranscript(null); // Reset transcript view on section change
  };

  const playAudio = (text: string) => {
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
                                    <span className="font-bold text-slate-500 w-1/3">{row.pronoun}</span>
                                    <span className="font-bold text-slate-800 text-lg w-2/3">{row.verb}</span>
                                    <Volume2 size={16} className="text-french-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.examples.map((ex, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-french-blue transition-all cursor-default group hover:bg-blue-50/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-xl font-bold text-french-blue">{ex.french}</span>
                        <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             playAudio(ex.french);
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