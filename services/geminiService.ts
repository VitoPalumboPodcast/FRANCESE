import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, QuizDifficulty } from "../types";

// Initialize client only when needed to ensure API key is present
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuizQuestions = async (difficulty: QuizDifficulty, count: number = 3): Promise<QuizQuestion[]> => {
  const ai = getAIClient();
  if (!ai) return [];

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "The quiz question (e.g., 'Translate: Eat the apple!')." },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 possible answers." },
        correctAnswer: { type: Type.STRING, description: "The correct option string." },
        explanation: { type: Type.STRING, description: "Brief explanation of the rule." }
      },
      required: ["question", "options", "correctAnswer", "explanation"]
    }
  };

  const prompt = `Generate ${count} multiple-choice questions about the French Imperative Mode (L'Impératif). 
  Difficulty: ${difficulty}.
  Focus on: Verb conjugation (ER/IR groups), Irregular verbs (Avoir, Venir, Etre), and Pronoun placement (COD, Reflexive).
  The user is an Italian speaker, so questions/prompts should be in Italian, but answers in French.
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

export const checkImperativeCommand = async (userCommand: string): Promise<{ isCorrect: boolean; feedback: string; improved: string }> => {
  const ai = getAIClient();
  if (!ai) return { isCorrect: false, feedback: "API Error", improved: "" };

  const prompt = `Analyze this French sentence: "${userCommand}".
  The user is trying to give a command using the Imperative Mood.
  1. Is it grammatically correct in the Imperative?
  2. If yes, say "Correct".
  3. If no, explain why in Italian and provide the correct form.
  
  Return JSON: { "isCorrect": boolean, "feedback": string, "improved": string }`;

  const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        isCorrect: { type: Type.BOOLEAN },
        feedback: { type: Type.STRING },
        improved: { type: Type.STRING }
      }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    
    const text = response.text;
    if(!text) throw new Error("No response");
    return JSON.parse(text);

  } catch (error) {
     console.error("Error checking command:", error);
     return { isCorrect: false, feedback: "Errore di connessione.", improved: "" };
  }
};

export const getTutorResponse = async (history: {role: string, parts: {text: string}[]}[], userText: string) => {
    const ai = getAIClient();
    if(!ai) return "Errore API";

    const systemInstruction = `Sei "Pierre", un robot francese un po' snob ma simpatico. 
    Obbedisci solo agli ordini dati correttamente all'imperativo francese.
    Se l'utente sbaglia grammatica, lo correggi gentilmente in italiano ma ti rifiuti di eseguire l'ordine.
    Se l'ordine è corretto, descrivi l'azione che fai in francese tra asterischi (es: *Je me lève rapidement*).
    Rispondi in modo breve.`;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: history
    });

    const result = await chat.sendMessage({ message: userText });
    return result.text;
}