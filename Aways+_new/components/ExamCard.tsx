
import React, { useState } from 'react';
import { Exam, Priority } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Timer, Settings, PlayCircle, ArrowRight, Clock, Target, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface ExamCardProps {
  exam: Exam;
  onDelete: (id: string) => void;
  onEdit: (exam: Exam) => void;
  onOpenStudySession: (exam: Exam) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onDelete, onEdit, onOpenStudySession }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalMinutes = exam.studyLog?.reduce((acc, log) => acc + log.minutes, 0) || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  // Usamos el color del examen pero permitimos que herede del global si es necesario
  const themeColor = exam.color || 'var(--primary)';

  return (
    <motion.div layout className="bg-surface border-[3px] border-main p-5 neo-shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none -mr-8 -mt-8 rotate-12" style={{ color: themeColor }}>
        <Target size={120} fill="currentColor" />
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="space-y-1">
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border border-main ${exam.priority === Priority.HIGH ? 'bg-primary text-white' : 'bg-surface text-main'}`}>
            {exam.priority}
          </span>
          <h3 className="text-xl font-black italic text-main tracking-tight leading-none pt-1 uppercase">{exam.name}</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(exam)} className="text-main opacity-20 hover:opacity-100 p-1 transition-opacity"><Settings size={18} /></button>
          <button onClick={() => onDelete(exam.id)} className="text-main opacity-20 hover:text-red-500 p-1 transition-colors"><Trash2 size={18} /></button>
        </div>
      </div>

      <div className="flex gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-1.5 opacity-50"><Calendar size={13} /><span className="text-[10px] font-black">{new Date(exam.examDate).toLocaleDateString()}</span></div>
        <div className="flex items-center gap-1.5"><Clock size={13} style={{ color: themeColor }} /><span className="text-[10px] font-black">{hours}H {mins}M</span></div>
      </div>

      <div className="h-2 w-full bg-main opacity-10 rounded-full overflow-hidden mb-5 relative z-10">
        <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} className="h-full" style={{ backgroundColor: themeColor }} />
      </div>

      <button 
        onClick={() => onOpenStudySession(exam)} 
        className="w-full py-4 border-[3px] border-main neo-shadow-sm font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 text-white hover:brightness-110 active:scale-[0.98] transition-all relative z-10"
        style={{ backgroundColor: themeColor }}
      >
        INICIAR PROTOCOLO <PlayCircle size={18} fill="currentColor" />
      </button>
    </motion.div>
  );
};
