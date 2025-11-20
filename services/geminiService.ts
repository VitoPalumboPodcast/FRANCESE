
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
        explanation: { type: Type.STRING, description: "Brief explanation of the rule." }
      },
      required: ["question", "options", "correctAnswer", "explanation"]
    }
  };

  let topicContext = "";
  if (topic === TopicId.IMPERATIF) {
    topicContext = "French Imperative Mode (L'Impératif). Focus on Verb conjugation, Irregular verbs (Avoir, Venir, Etre), and Pronoun placement (COD after verb).";
  } else if (topic === TopicId.COD) {
    topicContext = "French Direct Object Pronouns (COD - Les pronoms compléments d'objet direct). Focus on: le, la, les, l', me, te, nous, vous. Rules: Placement BEFORE the verb (Je la regarde), Negation sandwich (Je ne la regarde pas), Elision (l').";
  }

  const prompt = `Generate ${count} multiple-choice questions about ${topicContext}.
  Difficulty: ${difficulty}.
  The user is an Italian speaker learning French. 
  Questions/Prompts should be in Italian (asking to translate or fill in the blank), but options/answers in French.
  For COD questions, test specifically if they put the pronoun BEFORE the verb (unlike Italian where it can vary).
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
        systemInstruction = `Sei "Pierre", un sergente istruttore robotico francese. 
        Il tuo obiettivo è far esercitare l'utente sull'IMPERATIVO.
        Chiedi all'utente di darti ordini.
        Obbedisci solo agli ordini dati correttamente all'imperativo francese (es: "Fais ça!", "Mange-le!").
        Se l'utente sbaglia (es: mette il pronome prima "Le mange"), correggilo severamente ma simpaticamente in italiano.
        Rispondi in modo breve.`;
    } else {
        systemInstruction = `Sei "Pierre", un pettegolo robotico francese.
        Il tuo obiettivo è far esercitare l'utente sui PRONOMI COD (le, la, les, l').
        Fai domande all'utente su cosa gli piace o cosa fa (es: "Tu aimes la pizza?", "Tu regardes la télé?").
        L'utente DEVE rispondere usando il pronome (es: "Oui, je l'aime", "Non, je ne la regarde pas").
        Se ripete il nome (es: "J'aime la pizza"), correggilo dicendo che deve usare il pronome COD per non essere ripetitivo.
        Parla un misto di francese facile e spiegazioni in italiano.`;
    }

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: history
    });

    const result = await chat.sendMessage({ message: userText });
    return result.text;
}
