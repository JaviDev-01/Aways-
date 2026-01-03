
import React from 'react';
import { Exam } from '../types';
import { X, Play, Pause, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudySessionModalProps {
  exam: Exam;
  isOpen: boolean;
  isActive: boolean;
  timeLeft: number;
  mode: 'focus' | 'break';
  selectedTopicId: string | null;
  onSelectTopic: (id: string | null) => void;
  setIsActive: (active: boolean) => void;
  onClose: () => void;
  onSaveSession: () => void;
}

export const StudySessionModal: React.FC<StudySessionModalProps> = ({ 
  exam, isOpen, isActive, timeLeft, mode, selectedTopicId, onSelectTopic, setIsActive, onClose, onSaveSession
}) => {
  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2, '0')}:${(s%60).toString().padStart(2, '0')}`;
  const themeColor = exam.color || 'var(--primary)';
  
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-between p-6 sm:p-12 overflow-y-auto transition-colors duration-500"
    >
      <div className="w-full flex justify-between items-center">
         <div className="flex items-center gap-2 bg-main text-surface px-3 py-1 text-[9px] font-black uppercase tracking-widest">
            <Zap size={10} style={{ color: themeColor }} fill="currentColor" />
            {mode === 'focus' ? 'SISTEMA DE ENFOQUE' : 'RECUPERACIÓN ACTIVA'}
         </div>
         <button onClick={onClose} className="p-3 text-main opacity-20 hover:opacity-100 transition-opacity">
            <X size={28} strokeWidth={4} />
         </button>
      </div>

      <div className="flex flex-col items-center relative py-8 w-full">
         <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ backgroundColor: themeColor }}
            />
          )}
        </AnimatePresence>
        
        <motion.div 
          key={mode + timeLeft}
          initial={{ scale: 0.98, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[22vw] sm:text-[10rem] font-black italic tracking-tighter tabular-nums text-main leading-none z-10"
        >
          {formatTime(timeLeft)}
        </motion.div>
        
        <div className="text-center z-10 mt-4 space-y-1">
          <p className="text-[12px] font-black text-main opacity-40 uppercase tracking-[0.4em]">{exam.name}</p>
          {selectedTopicId && (
            <p className="text-[10px] font-black text-surface bg-main px-3 py-1 uppercase tracking-widest inline-block italic neo-shadow-sm">
              TRABAJANDO EN: {exam.syllabus?.find(t => t.id === selectedTopicId)?.topic}
            </p>
          )}
        </div>
      </div>

      {/* TOPIC SELECTOR */}
      {mode === 'focus' && exam.syllabus && exam.syllabus.length > 0 && !isActive && (
        <div className="w-full max-w-sm z-10">
          <p className="text-[9px] font-black text-main opacity-30 uppercase tracking-[0.2em] mb-3 text-center">Selecciona objetivo de sesión</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {exam.syllabus.map(topic => (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic.id === selectedTopicId ? null : topic.id)}
                className={`px-4 py-2 border-2 border-main whitespace-nowrap text-[10px] font-black uppercase transition-all ${selectedTopicId === topic.id ? 'text-white' : 'bg-surface text-main opacity-40'}`}
                style={{ backgroundColor: selectedTopicId === topic.id ? themeColor : '' }}
              >
                {topic.topic}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-sm space-y-4 z-10 mt-6">
        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsActive(!isActive)}
          className={`w-full py-7 border-[4px] border-main neo-shadow font-black text-2xl italic uppercase tracking-widest flex items-center justify-center gap-4 transition-all ${isActive ? 'bg-surface text-main' : 'text-surface'}`}
          style={{ backgroundColor: !isActive ? themeColor : '' }}
        >
          {isActive ? <><Pause size={32} fill="currentColor" /> PAUSAR</> : <><Play size={32} fill="currentColor" /> INICIAR</>}
        </motion.button>
        
        <button 
          onClick={onSaveSession}
          className="w-full py-5 border-[3px] border-main neo-shadow-sm bg-main text-surface text-[11px] font-black uppercase tracking-widest hover:brightness-125 transition-all flex items-center justify-center gap-2"
        >
          COMPLETAR MISIÓN Y ARCHIVAR TIEMPO
        </button>
      </div>
      
      <div className="text-[9px] font-black text-main opacity-20 uppercase tracking-[0.3em] mt-4">
        ESTADO: {isActive ? 'SINCRONIZACIÓN' : 'STANDBY'}
      </div>
    </motion.div>
  );
};
