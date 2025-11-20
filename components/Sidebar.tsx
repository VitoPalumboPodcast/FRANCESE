import React from 'react';
import { ViewState } from '../types';
import { BookOpen, CheckCircle, MessageSquare, Home, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewState.HOME, label: 'Dashboard', icon: Home },
    { id: ViewState.LEARN, label: 'Lezioni', icon: BookOpen },
    { id: ViewState.QUIZ, label: 'Quiz AI', icon: CheckCircle },
    { id: ViewState.ROLEPLAY, label: 'Comanda Pierre', icon: MessageSquare },
  ];

  return (
    <div className="w-20 lg:w-64 h-screen bg-slate-900 text-white flex flex-col justify-between transition-all duration-300 shadow-2xl z-50">
      <div>
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-french-red rounded-full flex items-center justify-center mr-0 lg:mr-3 shadow-[0_0_15px_rgba(239,65,53,0.5)]">
            <span className="font-serif font-bold text-white">I</span>
          </div>
          <span className="hidden lg:block font-serif font-bold text-xl tracking-wide">Impératif</span>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-french-blue text-white shadow-lg shadow-blue-900/50 scale-105'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={24} className={`lg:mr-3 ${isActive ? 'text-white' : 'group-hover:text-french-blue'}`} />
                <span className="hidden lg:block font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4 hidden lg:block">
          <p className="text-xs text-slate-400 mb-1">Progresso Giornaliero</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div className="bg-green-400 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-right text-xs font-bold text-green-400">65%</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;