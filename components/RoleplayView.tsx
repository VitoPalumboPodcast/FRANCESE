
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, RefreshCw } from 'lucide-react';
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

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isUser }) => (
  <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
    <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm ${isUser ? 'bg-french-blue text-white' : 'bg-slate-800 text-white'}`}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className={`p-5 rounded-3xl text-sm md:text-base shadow-sm leading-relaxed ${
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

const RoleplayView: React.FC<RoleplayViewProps> = ({ topicId, onBack }) => {
  const [input, setInput] = useState('');
  
  const initialMessage = topicId === TopicId.IMPERATIF 
    ? "Garde-à-vous! Je suis le Sergent Pierre. Dammi un ordine in francese (all'imperativo) e vedremo se sei capace di comandare!"
    : "Salut! Je suis Pierre. J'adore les ragots. Tu aimes les secrets? (Usa i pronomi 'le, la, les' per rispondermi!)";

  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: initialMessage }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    try {
        const responseText = await getTutorResponse(history, userText, topicId);
        if(responseText) {
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
            const cleanText = responseText.replace(/\*.*?\*/g, ''); 
            const u = new SpeechSynthesisUtterance(cleanText);
            u.lang = 'fr-FR';
            window.speechSynthesis.speak(u);
        }
    } catch (e) {
        setMessages(prev => [...prev, { role: 'model', text: "Désolé, je suis fatigué (Erreur API)." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
      setMessages([{ role: 'model', text: initialMessage }]);
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
               <Bot />
             </div>
             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
           </div>
           <div>
             <h2 className="font-bold text-slate-800 leading-tight">Pierre Le Robot</h2>
             <p className="text-xs font-medium text-french-blue uppercase tracking-wide">
                {topicId === TopicId.IMPERATIF ? 'Allenamento Comandi' : 'Allenamento COD'}
             </p>
           </div>
         </div>
         <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 p-2" title="Riavvia conversazione">
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
            <span className="text-xs font-bold uppercase tracking-widest mr-2">Pierre sta scrivendo</span>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 z-10">
        <div className="flex gap-2 relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={topicId === TopicId.IMPERATIF ? "Es: Lève-toi ! / Ne parle pas !" : "Es: Oui, je l'aime. / Non, je ne le connais pas."}
            className="w-full pl-6 pr-14 py-4 rounded-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-french-blue outline-none transition-all border border-transparent focus:border-french-blue text-slate-800 shadow-inner text-base"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-french-blue text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleplayView;
