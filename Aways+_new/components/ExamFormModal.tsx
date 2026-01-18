
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';
import { Exam, SUBJECT_COLORS, Priority, SyllabusItem } from '../types';

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  editingExam?: Exam | null;
  defaultColor?: string;
}

export const ExamFormModal: React.FC<ExamFormModalProps> = ({ isOpen, onClose, onSave, onDelete, editingExam, defaultColor }) => {
  const [formData, setFormData] = useState({
    name: '',
    examDate: '',
    studyDurationDays: 7,
    color: defaultColor || SUBJECT_COLORS[0].value,
    priority: Priority.MEDIUM,
    syllabus: [] as SyllabusItem[]
  });
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    if (editingExam) {
      setFormData({
        name: editingExam.name,
        examDate: editingExam.examDate,
        studyDurationDays: editingExam.studyDurationDays,
        color: editingExam.color || defaultColor || SUBJECT_COLORS[0].value,
        priority: editingExam.priority,
        syllabus: editingExam.syllabus || []
      });
    } else {
      setFormData({
        name: '',
        examDate: '',
        studyDurationDays: 7,
        color: defaultColor || SUBJECT_COLORS[0].value,
        priority: Priority.MEDIUM,
        syllabus: []
      });
    }
  }, [editingExam, defaultColor, isOpen]);

  const addTopic = () => {
    if (!newTopic.trim()) return;
    const topic: SyllabusItem = {
      id: crypto.randomUUID(),
      topic: newTopic.trim(),
      completed: false,
      minutesSpent: 0
    };
    setFormData(prev => ({ ...prev, syllabus: [...prev.syllabus, topic] }));
    setNewTopic('');
  };

  const removeTopic = (id: string) => {
    setFormData(prev => ({ ...prev, syllabus: prev.syllabus.filter(t => t.id !== id) }));
  };

  const handleDelete = () => {
    if (editingExam && onDelete) {
      if (window.confirm("¿BORRAR PERMANENTEMENTE ESTA MISIÓN? No hay vuelta atrás.")) {
        onDelete(editingExam.id);
      }
    }
  };

  if (!isOpen) return null;

  return (
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 bg-surface z-[160] overflow-y-auto flex flex-col"
      >
        <div className="sticky top-0 bg-surface/95 backdrop-blur z-20 px-6 py-6 border-b-[3px] border-main flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={onClose} className="p-2 -ml-2 text-main hover:bg-main/5 rounded-full transition-colors">
                <ChevronDown size={32} strokeWidth={3} />
             </button>
             <h2 className="text-2xl font-black italic uppercase tracking-tighter text-main">
                {editingExam ? 'Editar Misión' : 'Nueva Misión'}
             </h2>
          </div>
        </div>

        <div className="p-6 space-y-8 max-w-3xl mx-auto w-full pb-32">
          {/* COLOR PICKER */}
          <div>
            <label className="text-[9px] font-black text-main opacity-40 uppercase tracking-[0.2em] block mb-3">ADN Visual del Objetivo</label>
            <div className="flex flex-wrap gap-3">
              {SUBJECT_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setFormData({...formData, color: c.value})}
                  className={`w-9 h-9 rounded-full border-[3px] transition-all ${formData.color === c.value ? 'border-main scale-110 neo-shadow-sm' : 'border-transparent opacity-40 hover:opacity-70'}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black text-main opacity-40 uppercase tracking-[0.2em] block mb-2">Nombre del Objetivo</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
              className="w-full bg-main/10 border-[3px] border-main p-4 font-black italic text-xl outline-none focus:bg-primary/10 transition-colors text-main placeholder:text-main/20"
              placeholder="EJ: CÁLCULO AVANZADO"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black text-main opacity-40 uppercase tracking-[0.2em] block mb-2">Fecha Límite</label>
              <input 
                type="date" 
                value={formData.examDate} 
                onChange={e => setFormData({...formData, examDate: e.target.value})} 
                className="w-full bg-main/5 border-[3px] border-main p-3 font-black outline-none text-xs text-main" 
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-main opacity-40 uppercase tracking-[0.2em] block mb-2">Días de Plan</label>
              <input 
                type="number" 
                value={formData.studyDurationDays} 
                onChange={e => setFormData({...formData, studyDurationDays: Number(e.target.value)})} 
                className="w-full bg-main/5 border-[3px] border-main p-3 font-black outline-none text-xs text-main" 
              />
            </div>
          </div>

          {/* TOPICS / SYLLABUS */}
          <div className="bg-main/5 p-4 border-2 border-main/10 rounded-lg">
            <label className="text-[9px] font-black text-main opacity-40 uppercase tracking-[0.2em] block mb-3">Desglose de Temas (Sub-misiones)</label>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addTopic()}
                placeholder="Nombre del tema..."
                className="flex-1 bg-surface border-[2px] border-main p-3 text-xs font-bold outline-none text-main placeholder:opacity-20"
              />
              <button onClick={addTopic} className="bg-main text-surface px-5 border-[2px] border-main neo-shadow-sm active:scale-95 transition-transform">
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {formData.syllabus.map(topic => (
                <div key={topic.id} className="flex items-center justify-between bg-surface border-[1px] border-main/20 p-3 neo-shadow-sm">
                  <span className="text-[10px] font-black uppercase truncate pr-4 text-main">{topic.topic}</span>
                  <button onClick={() => removeTopic(topic.id)} className="text-red-500 hover:scale-125 transition-transform p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {formData.syllabus.length === 0 && (
                <p className="text-[9px] text-center italic text-main opacity-20 uppercase tracking-widest py-4 border border-dashed border-main/10">Sin temas definidos aún</p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <button 
              onClick={() => onSave(formData)} 
              className="w-full py-6 border-[3px] border-main font-black italic text-xl uppercase tracking-widest neo-shadow hover:brightness-110 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 text-white"
              style={{ backgroundColor: formData.color }}
            >
              ACTIVAR MISIÓN <CheckCircle2 size={24} />
            </button>

            {editingExam && (
              <button 
                onClick={handleDelete}
                className="w-full bg-red-500/10 text-red-500 py-4 border-[2px] border-red-500/30 font-black italic text-[10px] uppercase tracking-[0.3em] hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
              >
                <AlertTriangle size={16} /> ELIMINAR REGISTRO TOTALMENTE
              </button>
            )}
          </div>
        </div>
      </motion.div>
  );
};
