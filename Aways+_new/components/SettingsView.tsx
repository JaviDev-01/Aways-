
import React from 'react';
import { UserLevel, SUBJECT_COLORS } from '../types';
import { LogOut, Trash2, Moon, Sun, Palette, ChevronRight, ShieldCheck, Database } from 'lucide-react';
import pkg from '../package.json';

interface SettingsViewProps {
  currentUser: string;
  currentLevel: UserLevel;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
  onLogout: () => void;
  onDataImported: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  currentUser, currentLevel, isDarkMode, setIsDarkMode, accentColor, setAccentColor, onLogout 
}) => {
  return (
    <div className="space-y-8 pb-20">
      <div className="bg-surface border-[3px] border-main p-6 neo-shadow flex items-center gap-5">
        <div className="w-16 h-16 border-[3px] border-main bg-primary text-white flex items-center justify-center text-2xl font-black italic neo-shadow-sm">
            {currentUser.substring(0, 2).toUpperCase()}
        </div>
        <div>
            <h2 className="text-2xl font-black italic text-main tracking-tighter uppercase leading-none">{currentUser}</h2>
            <div className="bg-primary/20 text-primary px-2 py-0.5 text-[8px] font-black uppercase tracking-widest inline-block mt-1">
                {currentLevel.title}
            </div>
        </div>
      </div>

      {/* PERSONALIZACIÓN */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-main opacity-30 uppercase tracking-[0.3em] ml-2">Personalización</h3>
        <div className="bg-surface border-[3px] border-main p-5 space-y-6 neo-shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
                    <span className="text-xs font-black uppercase">Modo Oscuro</span>
                </div>
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-12 h-6 border-2 border-main rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-slate-200'}`}
                >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full border border-main bg-white transition-all ${isDarkMode ? 'right-0.5' : 'left-0.5'}`} />
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Palette size={18} className="text-primary" />
                    <span className="text-xs font-black uppercase">Color de Acento</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {SUBJECT_COLORS.map(c => (
                        <button 
                            key={c.value}
                            onClick={() => setAccentColor(c.value)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${accentColor === c.value ? 'border-main scale-110 neo-shadow-sm' : 'border-transparent opacity-50'}`}
                            style={{ backgroundColor: c.value }}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* SISTEMA */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-main opacity-30 uppercase tracking-[0.3em] ml-2">Seguridad</h3>
        <div className="space-y-2">
            <button className="w-full bg-surface border-[2px] border-main p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center"><Database size={16} /></div>
                    <span className="text-xs font-black uppercase">Backup Local (.JSON)</span>
                </div>
                <ChevronRight size={16} className="opacity-20" />
            </button>
            <button className="w-full bg-surface border-[2px] border-main p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center"><ShieldCheck size={16} /></div>
                    <span className="text-xs font-black uppercase">Politica de privacidad</span>
                </div>
                <ChevronRight size={16} className="opacity-20" />
            </button>
        </div>
      </div>

      <div className="pt-4 space-y-3 text-center">
        <button onClick={onLogout} className="w-full bg-surface border-[2px] border-main p-4 neo-shadow-sm flex items-center justify-center gap-2 font-black italic uppercase text-xs">
            Cerrar Sesión
        </button>
        <button className="w-full bg-red-500/10 text-red-500 border-[2px] border-main p-4 neo-shadow-sm flex items-center justify-center gap-2 font-black italic uppercase text-xs">
            Borrar Todos Los Datos
        </button>
        
        <div className="pt-4">
          <p className="text-[10px] font-black text-main opacity-20 uppercase tracking-[0.2em]">
            Aways+ System v{pkg.version}
          </p>
        </div>
      </div>
    </div>
  );
};
