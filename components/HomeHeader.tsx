
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Sparkles, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import { Task } from '../types';

interface HomeHeaderProps {
  user: string;
  todayMinutes: number;
  dailyGoal: number;
  activeExamsCount: number;
  todayTasks: Task[];
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ user, todayMinutes, dailyGoal, activeExamsCount, todayTasks }) => {
  const progress = Math.min(100, (todayMinutes / dailyGoal) * 100);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const totalTasks = todayTasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full pulse-blue" />
            <p className="text-[9px] font-black uppercase tracking-widest text-main opacity-40">Unidad: {user.toUpperCase()}</p>
          </div>
          <h1 className="text-3xl font-black italic text-main tracking-tight leading-none">
            HOLA, <span className="text-primary">{user.split(' ')[0]}</span>
          </h1>
        </div>
        <div className="w-10 h-10 bg-surface border-2 border-main neo-shadow-sm flex items-center justify-center text-primary">
          <ShieldCheck size={20} strokeWidth={3} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* RADAR DE TAREAS - DISEÑO TIPO TERMINAL */}
        <div className="bg-surface border-[3px] border-main p-4 neo-shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                 <ClipboardCheck size={14} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-main">Estado de Operaciones</span>
              </div>
              <span className="text-[10px] font-black text-primary italic">{completedTasks}/{totalTasks} COMPLETADAS</span>
           </div>
           
           <div className="flex gap-1.5 h-4 mb-4">
              {totalTasks > 0 ? (
                Array.from({ length: totalTasks }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    className={`h-full flex-1 border border-main/20 ${i < completedTasks ? 'bg-primary' : 'bg-main/5'}`} 
                  />
                ))
              ) : (
                <div className="w-full h-full border border-dashed border-main/20 flex items-center justify-center">
                   <span className="text-[7px] font-black uppercase opacity-20">No hay misiones asignadas hoy</span>
                </div>
              )}
           </div>

           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <p className="text-[8px] font-black opacity-30 uppercase">Tiempo de Estudio Hoy</p>
                 <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black italic leading-none text-main">{todayMinutes}M</span>
                    <span className="text-[10px] font-black opacity-20">/ {dailyGoal}M META</span>
                 </div>
              </div>
              <div className="w-12 h-12 relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-main/5" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-primary" stroke="currentColor" strokeWidth="4" strokeDasharray={`${progress}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Activity size={12} className="text-primary" />
                  </div>
              </div>
           </div>
        </div>

        {/* STATUS BAR SLIM */}
        <div className="bg-main text-surface border-2 border-main p-3 neo-shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Sparkles size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Objetivos Académicos</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-lg font-black italic text-primary">{activeExamsCount}</span>
              <ArrowUpRight size={14} className="opacity-40" />
           </div>
        </div>
      </div>
    </div>
  );
};
