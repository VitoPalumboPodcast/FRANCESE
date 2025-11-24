
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, UserLevel, TopicId } from "../types";

// Initialize client only when needed to ensure API key is present
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuizQuestions = async (topic: TopicId, level: UserLevel, count: number): Promise<QuizQuestion[]> => {
  const ai = getAIClient();
  if (!ai) return [];

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: ["multiple-choice", "cloze"], description: "Type of question." },
        question: { type: Type.STRING, description: "The question or sentence with '_______'." },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options." },
        correctAnswer: { type: Type.STRING, description: "Correct option." },
        explanation: { type: Type.STRING, description: "Explanation of the rule." },
        exampleSentence: {
            type: Type.OBJECT,
            properties: {
                french: { type: Type.STRING, description: "Example sentence." },
                italian: { type: Type.STRING, description: "Italian translation." }
            },
            required: ["french", "italian"]
        }
      },
      required: ["type", "question", "options", "correctAnswer", "explanation", "exampleSentence"]
    }
  };

  let topicContext = "";
  // Context mapping
  if (topic === TopicId.IMPERATIF) topicContext = "French Imperative Mode.";
  else if (topic === TopicId.COD) topicContext = "French Direct Object Pronouns (COD).";
  else if (topic === TopicId.VERBI_ER) topicContext = "French 1st Group Verbs (-ER).";
  else if (topic === TopicId.VERBI_IR) topicContext = "French 2nd Group Verbs (-IR).";
  else if (topic === TopicId.VERBI_TOP) topicContext = "French Top 4 Verbs (Etre, Avoir, Aller, Faire).";
  else if (topic === TopicId.VERBI_3_GROUP) topicContext = "French 3rd Group Verbs (-RE, -OIR, Irregular -IR).";
  else if (topic === TopicId.LYON) topicContext = "Culture: Lyon City.";
  else if (topic === TopicId.ORIENTATION) topicContext = "Orientation and Directions.";
  else if (topic === TopicId.NEGATION) topicContext = "French Negation.";
  else if (topic === TopicId.GENDER_NUMBER) topicContext = "French Irregular Gender and Number.";
  else if (topic === TopicId.FAMILY) topicContext = "French Family Vocabulary.";
  else if (topic === TopicId.DESCRIPTION) topicContext = "French Descriptions and Clothing.";
  else if (topic === TopicId.PRONUNCIATION) topicContext = "French Pronunciation Basics (Phonetics, Nasals, Silent letters).";
  else if (topic === TopicId.GREETINGS) topicContext = "French Greetings, Introductions, and Politeness (Bonjour, Comment ça va, Je m'appelle).";
  else if (topic === TopicId.ARTICLES) topicContext = "French Definite and Indefinite Articles (Le, La, Les, Un, Une, Des).";
  else if (topic === TopicId.NUMBERS) topicContext = "French Numbers (1-100), Days of the Week, Months.";

  // Cognitive Load Adaptation Logic
  let levelInstruction = "";
  if (level === UserLevel.A1 || level === UserLevel.A2) {
      levelInstruction = `
      LEVEL: ${level} (Beginner).
      STYLE: High volume drills. Focus on recognition and basic rules.
      TYPES: Mostly 'multiple-choice'. Simple sentences.
      VOCAB: Very basic and high frequency.
      `;
  } else if (level === UserLevel.B1 || level === UserLevel.B2) {
      levelInstruction = `
      LEVEL: ${level} (Intermediate).
      STYLE: Sentence construction and nuances.
      TYPES: Mix of 'cloze' (fill-in-the-blank) and 'multiple-choice'.
      CONTENT: Focus on exceptions and context.
      `;
  } else {
      levelInstruction = `
      LEVEL: ${level} (Advanced).
      STYLE: Production and complex rules.
      TYPES: Mostly 'cloze' with subtle distractors.
      CONTENT: Focus on style, formal register, and rare exceptions.
      `;
  }

  const prompt = `
  ACT AS: Expert French Language Teacher.
  TASK: Generate ${count} distinct quiz questions about: ${topicContext}.
  
  ${levelInstruction}
  
  CONTENT MIX (The 80/20 Rule):
  - 80% of questions should review Fundamental Rules of the topic (Solidify basics).
  - 20% of questions should introduce a New or Tricky concept/exception within the topic.
  
  FORMAT:
  - Output strictly JSON matching the schema.
  - Options must be plausible distractors (same grammatical category).
  `;

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

    const baseInstruction = `
    ROLE: You are an interactive French Tutor Persona.
    LANGUAGE: Speak strictly in French for the persona part. Use Italian ONLY for explanations/corrections.
    
    TASK:
    1. Analyze the user's French input for GRAMMAR and SPELLING errors.
    2. IF ERROR FOUND: Start your response EXACTLY with this format: "[CORRECTION: <Corrected French Sentence>. <Brief Italian Explanation>]".
    3. THEN: Continue with the Persona's conversational response in French.
    4. IF NO ERROR: Just provide the Persona's conversational response in French.
    5. SEPARATOR: If you need to provide a translation or extra help at the end, separate it with "|||".
    `;

    let personaInstruction = "";
    
    // Mapping Personas
    if (topic === TopicId.IMPERATIF) personaInstruction = `Sei "Sergent Pierre".`; 
    else if (topic === TopicId.COD) personaInstruction = `Sei "Pierre Curieux".`;
    else if (topic === TopicId.PRONUNCIATION) personaInstruction = `Sei "Madame Phonétique". Aiuta l'utente con la pronuncia e i suoni difficili (R, U, Nasali). Proponi scioglilingua.`;
    else if (topic === TopicId.GREETINGS) personaInstruction = `Sei "Pierre le Portier". Un portiere di hotel molto gentile e formale. Insegna i saluti (Bonjour, Bonsoir, Enchanté) e come presentarsi.`;
    else if (topic === TopicId.ARTICLES) personaInstruction = `Sei "Professeur Plume". Una maestra elementare dolce ma precisa. Correggi sempre se l'utente sbaglia genere (Le/La) o numero.`;
    else if (topic === TopicId.NUMBERS) personaInstruction = `Sei "Mathieu le Marchand". Un venditore al mercato. Chiedi prezzi, quantità e date. Fai esercitare l'utente sui numeri (costa 20 euro, ne voglio 3, etc.).`;
    
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: baseInstruction + "\nSPECIFIC PERSONA (Topic: " + topic + "):\n" + personaInstruction },
        history: history
    });

    const result = await chat.sendMessage({ message: userText });
    return result.text;
}