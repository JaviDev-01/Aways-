
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

interface HomeHeaderProps {
  user: string;
  todayMinutes: number;
  dailyGoal: number;
  activeExamsCount: number;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ user, todayMinutes, dailyGoal, activeExamsCount }) => {
  const progress = Math.min(100, (todayMinutes / dailyGoal) * 100);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full pulse-blue" />
            <p className="text-[9px] font-black uppercase tracking-widest text-main opacity-40">Sessión de {user.toUpperCase()}</p>
          </div>
          <h1 className="text-3xl font-black italic text-main tracking-tight leading-none">
            EY, <span className="text-primary">{user.split(' ')[0]}</span>
          </h1>
        </div>
        <div className="w-10 h-10 bg-surface border-2 border-main neo-shadow-sm flex items-center justify-center text-primary">
          <ShieldCheck size={20} strokeWidth={3} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface border-2 border-main p-4 neo-shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest text-main opacity-60">Progreso Diario</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black italic text-main">{Math.round(progress)}%</span>
            <span className="text-[9px] font-bold text-main opacity-30">/{dailyGoal}m</span>
          </div>
          <div className="h-2 w-full bg-progress border border-main/10 rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        <div className="bg-main text-surface border-2 border-main p-4 neo-shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest text-primary">Status Quests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black italic">{activeExamsCount}</span>
            <span className="text-[9px] font-black uppercase tracking-tighter opacity-50 italic">ACTIVAS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
