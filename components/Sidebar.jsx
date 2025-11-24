
import React from 'react';
import { ViewState } from '../types';
import { Map, BookOpen, LogOut, GraduationCap } from 'lucide-react';

const Sidebar = ({ currentView, setView }) => {
  // Simplified sidebar as navigation is now mostly driven by the Course Map
  // Keeping it for global context and potential future features (Settings, Profile)
  
  return (
    <div className="w-20 lg:w-64 h-screen bg-slate-900 text-white flex flex-col justify-between transition-all duration-300 shadow-2xl z-50 shrink-0">
      <div>
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-french-red rounded-xl flex items-center justify-center mr-0 lg:mr-3 shadow-[0_0_15px_rgba(239,65,53,0.5)] rotate-3 hover:rotate-0 transition-transform">
            <span className="font-serif font-bold text-white text-xl">F</span>
          </div>
          <div className="hidden lg:block">
              <span className="font-serif font-bold text-xl tracking-wide block leading-none">Français</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest">Master Class</span>
          </div>
        </div>

        <nav className="mt-8 space-y-2 px-2">
           <button
                onClick={() => setView(ViewState.HOME)}
                className={`w-full flex items-center justify-center lg:justify-start px-4 py-4 rounded-2xl transition-all duration-200 group ${
                  currentView === ViewState.HOME
                    ? 'bg-french-blue text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Map size={24} className={`lg:mr-3 ${currentView === ViewState.HOME ? 'text-white' : 'group-hover:text-french-blue'}`} />
                <span className="hidden lg:block font-medium text-lg">Mappa Corso</span>
           </button>
           
           {currentView !== ViewState.HOME && (
               <div className="mt-4 px-4 hidden lg:block animate-in fade-in duration-500">
                   <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                       <p className="text-xs text-slate-400 uppercase mb-2">Stai studiando</p>
                       <div className="flex items-center text-french-blue font-bold">
                           <GraduationCap size={16} className="mr-2"/>
                           Modulo Attivo
                       </div>
                   </div>
               </div>
           )}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4 hidden lg:block group hover:bg-slate-700 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center font-bold text-white">
                  ET
              </div>
              <div>
                  <p className="font-bold text-sm">Étudiant Top</p>
                  <p className="text-xs text-slate-400">Livello: Principiante</p>
              </div>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
          </div>
        </div>
        <div className="lg:hidden flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
