import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User } from 'lucide-react';
import { getTutorResponse } from '../services/geminiService';

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isUser }) => (
  <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`flex max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${isUser ? 'bg-french-blue text-white' : 'bg-slate-800 text-white'}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`p-4 rounded-2xl text-sm md:text-base shadow-sm leading-relaxed ${
        isUser 
          ? 'bg-french-blue text-white rounded-tr-none' 
          : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
      }`}>
        {text.split('*').map((part, i) => 
          i % 2 === 1 ? <span key={i} className="italic text-slate-500 block my-1 text-xs border-l-2 border-slate-300 pl-2">{part}</span> : part
        )}
      </div>
    </div>
  </div>
);

const RoleplayView: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: "Bonjour! Je suis Pierre. Dammi un ordine in francese (all'imperativo) e, se me lo chiedi gentilmente e correttamente, forse lo farò." }
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

    // Prepare history for API (convert to Gemini format if needed, simplified here)
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    try {
        const responseText = await getTutorResponse(history, userText);
        if(responseText) {
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
            // Simple TTS for Pierre
            const u = new SpeechSynthesisUtterance(responseText.replace(/\*.*?\*/g, '')); // Don't speak actions
            u.lang = 'fr-FR';
            window.speechSynthesis.speak(u);
        }
    } catch (e) {
        setMessages(prev => [...prev, { role: 'model', text: "Désolé, j'ai eu un bug." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-slate-50 relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
      
      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur border-b border-slate-200 z-10 flex justify-between items-center sticky top-0">
         <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
               <Bot />
             </div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
           </div>
           <div>
             <h2 className="font-bold text-slate-800">Pierre Le Robot</h2>
             <p className="text-xs text-slate-500">Attende ordini (Imperativo)</p>
           </div>
         </div>
         <div className="text-xs text-slate-400 hidden sm:block bg-slate-100 px-3 py-1 rounded-full">
            Prova: "Lève-toi", "Chante une chanson", "Ne parle pas"
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 z-10">
        {messages.map((m, idx) => (
          <ChatBubble key={idx} text={m.text} isUser={m.role === 'user'} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
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
            placeholder="Dai un ordine..."
            className="w-full pl-4 pr-12 py-3 rounded-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-french-blue outline-none transition-all border border-transparent focus:border-french-blue text-slate-800"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-french-blue text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleplayView;