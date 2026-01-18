
import React, { useState, useMemo } from 'react';
import { Task, DailyArchive, TaskSubject, Importance, SubTask } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Trash2, History, Archive, X, Filter, ChevronDown, ChevronUp, AlertCircle, Tag, ListFilter, SortAsc, Clock } from 'lucide-react';

interface TaskBoardProps {
  currentTasks: Task[];
  history: DailyArchive[];
  subjects: TaskSubject[];
  onUpdateTasks: (tasks: Task[]) => void;
}

type SortOption = 'recent' | 'alpha' | 'importance' | 'subject';

export const TaskBoard: React.FC<TaskBoardProps> = ({ currentTasks, history, subjects, onUpdateTasks }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newImportance, setNewImportance] = useState<Importance>(Importance.MEDIUM);
  
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedArchive, setSelectedArchive] = useState<DailyArchive | null>(null);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      importance: newImportance,
      subjectId: newSubjectId,
      subtasks: [],
      createdAt: Date.now()
    };
    
    onUpdateTasks([newTask, ...currentTasks]);
    setNewTaskText('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    onUpdateTasks(currentTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    onUpdateTasks(currentTasks.filter(t => t.id !== id));
  };

  const addSubtask = (taskId: string, text: string) => {
    if (!text.trim()) return;
    onUpdateTasks(currentTasks.map(t => {
      if (t.id === taskId) {
        const newSub: SubTask = { id: crypto.randomUUID(), text, completed: false };
        return { ...t, subtasks: [...t.subtasks, newSub] };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId: string, subId: string) => {
    onUpdateTasks(currentTasks.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          subtasks: t.subtasks.map(st => st.id === subId ? { ...st, completed: !st.completed } : st) 
        };
      }
      return t;
    }));
  };

  const sortedTasks = useMemo(() => {
    const tasks = [...currentTasks];
    switch (sortBy) {
      case 'alpha': return tasks.sort((a, b) => a.text.localeCompare(b.text));
      case 'importance': 
        const order = { [Importance.HIGH]: 0, [Importance.MEDIUM]: 1, [Importance.LOW]: 2 };
        return tasks.sort((a, b) => order[a.importance] - order[b.importance]);
      case 'subject':
        return tasks.sort((a, b) => {
          const sA = subjects.find(s => s.id === a.subjectId)?.name || '';
          const sB = subjects.find(s => s.id === b.subjectId)?.name || '';
          return sA.localeCompare(sB);
        });
      default: return tasks.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [currentTasks, sortBy, subjects]);

  const getSuccessColor = (rate: number) => {
    if (rate >= 100) return '#34C759';
    if (rate >= 50) return '#FF9500';
    return '#FF3B30';
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic uppercase tracking-tight text-main">Misiones</h2>
        <div className="flex bg-main/5 p-1 border-2 border-main rounded-lg">
          {(['recent', 'alpha', 'importance', 'subject'] as SortOption[]).map(opt => (
            <button 
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`p-1.5 rounded transition-all ${sortBy === opt ? 'bg-main text-surface' : 'text-main opacity-30'}`}
            >
              {opt === 'recent' && <Clock size={14} />}
              {opt === 'alpha' && <SortAsc size={14} />}
              {opt === 'importance' && <AlertCircle size={14} />}
              {opt === 'subject' && <Tag size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* ADD TASK TRIGGER */}
      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full bg-surface border-[3px] border-main p-4 flex items-center justify-center gap-3 neo-shadow font-black uppercase text-xs italic text-main hover:bg-main/5"
        >
          <Plus size={18} strokeWidth={4} /> ASIGNAR NUEVA MISIÓN
        </button>
      ) : (
        <motion.form 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={addTask}
          className="bg-surface border-[4px] border-main p-5 neo-shadow space-y-4"
        >
          <div className="flex justify-between items-center mb-2">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Parámetros de Misión</span>
             <button type="button" onClick={() => setIsAdding(false)} className="text-main/40"><X size={18} /></button>
          </div>
          
          <input
            autoFocus
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="¿Cuál es el objetivo principal?"
            className="w-full bg-main/10 border-[3px] border-main p-4 font-black italic text-lg outline-none text-main placeholder:text-main/20"
          />

          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest opacity-40">Prioridad</label>
                <select 
                  value={newImportance}
                  onChange={(e) => setNewImportance(e.target.value as Importance)}
                  className="w-full bg-surface border-[2px] border-main p-2 text-[10px] font-black uppercase outline-none"
                >
                   {Object.values(Importance).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest opacity-40">Asignatura</label>
                <select 
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full bg-surface border-[2px] border-main p-2 text-[10px] font-black uppercase outline-none"
                >
                   {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
             </div>
          </div>

          <button type="submit" className="w-full bg-main text-surface py-3 font-black uppercase tracking-widest text-xs neo-shadow-sm active:translate-x-1 active:translate-y-1 transition-all">
            DESPLEGAR MISIÓN
          </button>
        </motion.form>
      )}

      {/* ACTIVE TASKS LIST */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);
            return (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className={`bg-surface border-[3px] border-main neo-shadow-sm overflow-hidden transition-all ${task.completed ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="p-4 flex items-start gap-4">
                  <button onClick={() => toggleTask(task.id)} className="mt-1 shrink-0">
                    {task.completed ? <CheckCircle2 size={26} className="text-primary" fill="currentColor" /> : <Circle size={26} className="text-main/20" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {subject && (
                        <span className="text-[7px] font-black uppercase px-2 py-0.5 border border-main text-white" style={{ backgroundColor: subject.color }}>
                          {subject.name}
                        </span>
                      )}
                      <span className={`text-[7px] font-black uppercase px-2 py-0.5 border border-main ${
                        task.importance === Importance.HIGH ? 'bg-red-500 text-white' : 
                        task.importance === Importance.MEDIUM ? 'bg-orange-400 text-white' : 'bg-slate-100 text-main'
                      }`}>
                        {task.importance}
                      </span>
                    </div>
                    <h4 className={`text-sm font-black uppercase italic tracking-tight text-main ${task.completed ? 'line-through' : ''}`}>
                      {task.text}
                    </h4>
                    
                    {/* SUBTASKS SUMMARY */}
                    {task.subtasks.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {task.subtasks.map(st => (
                          <div key={st.id} className={`w-1.5 h-1.5 border border-main/20 ${st.completed ? 'bg-primary' : 'bg-main/5'}`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <button onClick={() => deleteTask(task.id)} className="text-main/10 hover:text-red-500"><Trash2 size={16} /></button>
                </div>

                {/* SUBTASKS PANEL */}
                {!task.completed && (
                  <div className="bg-main/5 p-4 border-t-2 border-main/10 space-y-3">
                    <div className="space-y-2">
                      {task.subtasks.map(st => (
                        <div key={st.id} className="flex items-center gap-2 group">
                          <button onClick={() => toggleSubtask(task.id, st.id)}>
                            {st.completed ? <CheckCircle2 size={14} className="text-primary" /> : <Circle size={14} className="text-main/30" />}
                          </button>
                          <span className={`text-[10px] font-bold uppercase truncate flex-1 text-main ${st.completed ? 'line-through opacity-40' : ''}`}>
                            {st.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                       <input 
                        type="text" 
                        placeholder="Nueva subtarea..."
                        className="flex-1 bg-main/10 border-2 border-main p-2 text-[10px] font-black uppercase outline-none text-main placeholder:text-main/20"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSubtask(task.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                       />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ARCHIVE MATRIX */}
      <div className="pt-8">
        <div className="flex items-center gap-3 mb-4">
           <History size={16} className="text-main/30" />
           <h3 className="text-[10px] font-black text-main opacity-30 uppercase tracking-[0.3em]">Archivo de Misiones</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {history.map(archive => (
            <motion.button
              key={archive.date}
              whileHover={{ scale: 1.1, y: -2 }}
              onClick={() => setSelectedArchive(archive)}
              className="w-10 h-10 border-[3px] border-main neo-shadow-sm flex items-center justify-center text-[10px] font-black text-white"
              style={{ backgroundColor: getSuccessColor(archive.successRate) }}
            >
              {archive.date.split('-')[2]}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ARCHIVE MODAL */}
      <AnimatePresence>
        {selectedArchive && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedArchive(null)} />
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-surface border-[4px] border-main p-6 w-full max-w-sm neo-shadow z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <p className="text-[10px] font-black text-main opacity-30 uppercase tracking-widest">Resumen Histórico</p>
                   <h4 className="text-lg font-black italic uppercase text-main">{new Date(selectedArchive.date).toLocaleDateString()}</h4>
                </div>
                <button onClick={() => setSelectedArchive(null)}><X size={20} /></button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {selectedArchive.tasks.map((t, i) => (
                  <div key={i} className="p-3 bg-main/5 border border-main/10 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${t.c ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-[7px] font-black opacity-40 uppercase mb-1">
                        <span>{t.s || 'GENERAL'}</span>
                        <span>{t.i}</span>
                      </div>
                      <p className={`text-[10px] font-black uppercase truncate ${t.c ? 'line-through opacity-30' : ''} text-main`}>{t.t}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t-2 border-main/10 flex justify-between items-center font-black">
                 <span className="text-[10px] opacity-40 uppercase">Efectividad</span>
                 <span className="text-xl italic" style={{ color: getSuccessColor(selectedArchive.successRate) }}>{Math.round(selectedArchive.successRate)}%</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
