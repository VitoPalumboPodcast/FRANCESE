
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, QuizDifficulty, TopicId } from "../types";

// Initialize client only when needed to ensure API key is present
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuizQuestions = async (topic: TopicId, difficulty: QuizDifficulty, count: number = 3): Promise<QuizQuestion[]> => {
  const ai = getAIClient();
  if (!ai) return [];

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "The quiz question." },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 possible answers." },
        correctAnswer: { type: Type.STRING, description: "The correct option string." },
        explanation: { type: Type.STRING, description: "Brief explanation of the rule." },
        exampleSentence: {
            type: Type.OBJECT,
            properties: {
                french: { type: Type.STRING, description: "A short example sentence using the correct answer." },
                italian: { type: Type.STRING, description: "Italian translation of the example." }
            },
            required: ["french", "italian"]
        }
      },
      required: ["question", "options", "correctAnswer", "explanation", "exampleSentence"]
    }
  };

  let topicContext = "";
  if (topic === TopicId.IMPERATIF) {
    topicContext = "French Imperative Mode (L'Impératif). Focus on Verb conjugation (removing 's' for -ER), Irregular verbs (Avoir, Venir, Etre, Savoir, Aller), Pronoun placement (COD after verb in affirmative), and Euphony exceptions (Vas-y, Manges-en).";
  } else if (topic === TopicId.COD) {
    topicContext = "French Direct Object Pronouns (COD - Les pronoms compléments d'objet direct). Focus on: le, la, les, l', me, te, nous, vous. Rules: Placement BEFORE the verb (Je la regarde), Negation sandwich (Je ne la regarde pas), Elision (l').";
  } else if (topic === TopicId.VERBI_IR) {
    topicContext = "French Regular 2nd Group Verbs (-IR verbs like Finir, Choisir, Grossir). Focus on the present indicative conjugation: -is, -is, -it, -issons, -issez, -issent. ESPECIALLY test the plural forms with 'SS' (finissons). Distinguish from irregulars like Venir (which are NOT 2nd group).";
  } else if (topic === TopicId.LYON) {
    topicContext = "City of Lyon, France. Topics: Geography (Rhone and Saone confluence), Gastronomy (Bouchons, Rosette de Lyon, Paul Bocuse), History (Vieux Lyon, Traboules), and Modernity (Confluence district, Museum). Questions should be general culture about Lyon.";
  } else if (topic === TopicId.ORIENTATION) {
    topicContext = "Asking and giving directions in French (L'Orientation). Prepositions of place (devant, derrière, à côté de, en face de, au bout de). City places (Mairie, Gare, Banque). Verbs of movement (Tournez à gauche, Allez tout droit, Traversez le pont). Transport vocabulary (En bus, à pied, en voiture).";
  }

  const prompt = `Generate ${count} multiple-choice questions about ${topicContext}.
  Difficulty: ${difficulty}.
  The user is an Italian speaker learning French. 
  Questions/Prompts should be in Italian (asking to translate or fill in the blank or culture questions), but options/answers in French.
  For COD questions, test specifically if they put the pronoun BEFORE the verb.
  For IR verbs, focus on correct endings and the "iss" pattern in plural.
  For ORIENTATION, use maps or spatial logic in the question text if possible (e.g. 'Se la banca è davanti al parco...').
  Provide a concrete 'exampleSentence' that uses the correct answer in context.
  Output strictly JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const getTutorResponse = async (history: {role: string, parts: {text: string}[]}[], userText: string, topic: TopicId) => {
    const ai = getAIClient();
    if(!ai) return "Errore API";

    let systemInstruction = "";
    
    if (topic === TopicId.IMPERATIF) {
        systemInstruction = `Sei "Sergent Pierre", un sergente istruttore robotico francese. 
        Il tuo obiettivo è far esercitare l'utente sull'IMPERATIVO.
        Chiedi all'utente di darti ordini.
        Obbedisci solo agli ordini dati correttamente all'imperativo francese (es: "Fais ça!", "Mange-le!").
        Se l'utente sbaglia (es: mette il pronome prima "Le mange"), correggilo severamente ma simpaticamente.

        IMPORTANTE PER LA VOCE:
        1. Inizia sempre con una reazione/frase in FRANCESE.
        2. Se devi dare una spiegazione o correzione in ITALIANO, mettila alla fine separata rigorosamente da "|||".
        
        Esempio Corretto:
        "Repos, soldat ! C'est incorrect ! ||| Ricorda che all'imperativo affermativo il pronome va dopo il verbo."
        
        Esempio Corretto 2:
        "Oui ! Très bien ! À vos ordres !"

        Non mischiare le lingue nella stessa frase senza il separatore. Rispondi in modo breve.`;
    } else if (topic === TopicId.COD) {
        systemInstruction = `Sei "Pierre Curieux", un pettegolo robotico francese.
        Il tuo obiettivo è far esercitare l'utente sui PRONOMI COD (le, la, les, l').
        Fai domande all'utente su cosa gli piace o cosa fa (es: "Tu aimes la pizza?", "Tu regardes la télé?").
        L'utente DEVE rispondere usando il pronome (es: "Oui, je l'aime", "Non, je ne la regarde pas").
        
        IMPORTANTE PER LA VOCE:
        1. Inizia sempre in FRANCESE.
        2. Se devi spiegare o correggere in ITALIANO, usa il separatore "|||" per dividere le lingue.
        
        Esempio: 
        "Ah bon ? Tu l'aimes ? C'est magnifique ! ||| Hai usato correttamente l'apostrofo."
        
        Non essere noioso, sii vivace.`;
    } else if (topic === TopicId.VERBI_IR) {
        systemInstruction = `Sei "Coach Remy", un personal trainer francese molto energico e ossessionato dalla crescita muscolare e dalla dieta.
        Il tuo obiettivo è far esercitare l'utente sui VERBI DEL SECONDO GRUPPO (-IR) come Grossir (ingrassare), Maigrir (dimagrire), Grandir (crescere), Finir (finire la serie), Choisir (scegliere il cibo sano).
        
        Chiedi all'utente se sta finendo l'esercizio, se sta dimagrendo, ecc.
        Se l'utente sbaglia la coniugazione (es: dimentica "iss" al plurale), correggilo motivandolo.
        
        IMPORTANTE PER LA VOCE:
        1. Inizia sempre in FRANCESE con tono da coach.
        2. Spiegazioni in ITALIANO solo dopo "|||".
        
        Esempio:
        "Allez ! Tu finis ta série ? ||| Corretto, 'Tu finis' con la 's'."
        "Non ! Nous finissons ! Pas 'nous finons' ! ||| Al plurale ci vuole sempre -issons."
        `;
    } else if (topic === TopicId.LYON) {
        systemInstruction = `Sei "Sophie", una guida turistica di Lyon molto appassionata. 
        Il tuo obiettivo è conversare con l'utente sulla città di Lyon (Fiumi Rodano e Saona, Gastronomia, Quartiere Confluence).
        Racconta aneddoti sulla città in francese semplice.
        
        IMPORTANTE PER LA VOCE:
        1. Inizia sempre in FRANCESE.
        2. Spiegazioni in ITALIANO solo dopo "|||".
        
        Esempio:
        "Bienvenue à Lyon ! Tu veux visiter le Vieux Lyon ? C'est magnifique. ||| Il Vieux Lyon è il quartiere rinascimentale."
        "On mange très bien ici. Tu connais les Bouchons ? ||| I Bouchons sono i ristoranti tipici."
        `;
    } else if (topic === TopicId.ORIENTATION) {
        systemInstruction = `Sei "Marie", una turista francese persa in una grande città. Sei un po' ansiosa e confusa.
        Il tuo obiettivo è chiedere indicazioni stradali all'utente (es: "Où est la gare?", "Pardon, pour aller au musée?").
        L'utente deve darti indicazioni usando verbi all'imperativo (Allez tout droit, Tournez à gauche) e preposizioni (en face, à côté).
        Se l'utente ti dà indicazioni corrette, ringrazia con sollievo.
        Se l'utente sbaglia grammatica o lessico, dillo che non hai capito o correggilo gentilmente.
        
        IMPORTANTE PER LA VOCE:
        1. Inizia sempre in FRANCESE.
        2. Spiegazioni o correzioni in ITALIANO solo dopo "|||".
        
        Esempio:
        "Pardon, je cherche la poste. C'est loin d'ici ? ||| Chiedi se è lontano."
        "Merci beaucoup ! Donc je tourne à gauche ? ||| Hai detto 'gauche', significa sinistra."
        `;
    }

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: history
    });

    const result = await chat.sendMessage({ message: userText });
    return result.text;
}