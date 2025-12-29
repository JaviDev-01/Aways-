
import React, { useState } from 'react';
import { UserLevel, SUBJECT_COLORS, TaskSubject } from '../types';
import { LogOut, Trash2, Moon, Sun, Palette, ChevronRight, ShieldCheck, Database, Tag, Plus, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsViewProps {
  currentUser: string;
  currentLevel: UserLevel;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
  onLogout: () => void;
  onDataImported: () => void;
  subjects: TaskSubject[];
  onUpdateSubjects: (subs: TaskSubject[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  currentUser, currentLevel, isDarkMode, setIsDarkMode, accentColor, setAccentColor, onLogout, subjects, onUpdateSubjects
}) => {
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#0066FF');

  const addSubject = () => {
    if (!newSubName.trim()) return;
    const newSub: TaskSubject = { id: crypto.randomUUID(), name: newSubName.trim().toUpperCase(), color: newSubColor };
    onUpdateSubjects([...subjects, newSub]);
    setNewSubName('');
    setIsAddingSub(false);
  };

  const deleteSubject = (id: string) => {
    if (subjects.length <= 1) return alert("Debes tener al menos una asignatura.");
    onUpdateSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 pb-24">
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

      {/* GESTIÓN DE ASIGNATURAS */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-main opacity-30 uppercase tracking-[0.3em] ml-2">Asignaturas de Misiones</h3>
        <div className="bg-surface border-[3px] border-main p-5 neo-shadow-sm space-y-4">
           <div className="space-y-2">
              {subjects.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 border-2 border-main/10 bg-main/5">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                      <span className="text-[10px] font-black uppercase text-main">{sub.name}</span>
                   </div>
                   <button onClick={() => deleteSubject(sub.id)} className="text-main/20 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
           </div>
           
           {!isAddingSub ? (
             <button 
              onClick={() => setIsAddingSub(true)}
              className="w-full py-2 border-2 border-dashed border-main/20 text-[9px] font-black uppercase opacity-40 hover:opacity-100 transition-all flex items-center justify-center gap-2"
             >
                <Plus size={12} /> AÑADIR ASIGNATURA
             </button>
           ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 border-2 border-main space-y-3">
                <input 
                  autoFocus
                  type="text" 
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Nombre de la asignatura"
                  className="w-full bg-main/5 border-2 border-main p-2 text-[10px] font-black uppercase outline-none text-main"
                />
                <div className="flex gap-2">
                   {SUBJECT_COLORS.slice(0, 6).map(c => (
                     <button 
                      key={c.value} 
                      onClick={() => setNewSubColor(c.value)}
                      className={`w-6 h-6 rounded-full border-2 ${newSubColor === c.value ? 'border-main scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c.value }}
                     />
                   ))}
                </div>
                <div className="flex gap-2">
                   <button onClick={addSubject} className="flex-1 bg-main text-surface py-2 text-[9px] font-black uppercase">Guardar</button>
                   <button onClick={() => setIsAddingSub(false)} className="px-4 py-2 border-2 border-main text-[9px] font-black uppercase text-main">X</button>
                </div>
             </motion.div>
           )}
        </div>
      </div>

      {/* PERSONALIZACIÓN */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-main opacity-30 uppercase tracking-[0.3em] ml-2">Apariencia</h3>
        <div className="bg-surface border-[3px] border-main p-5 space-y-6 neo-shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
                    <span className="text-xs font-black uppercase text-main">Modo Oscuro</span>
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
                    <span className="text-xs font-black uppercase text-main">Color de Acento Global</span>
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

      <div className="pt-4 space-y-3">
        <button onClick={onLogout} className="w-full bg-surface border-[3px] border-main p-4 neo-shadow-sm flex items-center justify-center gap-2 font-black italic uppercase text-xs text-main">
            Cerrar Sesión
        </button>
        <button className="w-full bg-red-500/10 text-red-500 border-[3px] border-red-500/30 p-4 neo-shadow-sm flex items-center justify-center gap-2 font-black italic uppercase text-xs">
            Borrar Todo el Legado
        </button>
      </div>
    </div>
  );
};
