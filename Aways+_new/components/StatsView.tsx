
import React, { useMemo, useState } from 'react';
import { Exam, UserLevel, ALL_ACHIEVEMENTS, Achievement } from '../types';
import { Clock, CheckCircle2, Trophy, Zap, Activity, Star, Lock, Footprints, Moon, Target, Flame, Sun, LayoutGrid, ListChecks, ShieldAlert, Palette, Compass, Trash2, Share2, LifeBuoy, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatsViewProps {
  exams: Exam[];
  totalMinutes: number;
  currentLevel: UserLevel;
}

const IconMap: Record<string, any> = {
  Footprints, Trophy, CheckCircle2, Moon, Target, Zap, Clock, Flame, Sun, LayoutGrid, ListChecks, ShieldAlert, Palette, Compass, Trash2, Share2, LifeBuoy, Brain
};

export const StatsView: React.FC<StatsViewProps> = ({ exams, totalMinutes, currentLevel }) => {
  const [activeCategory, setActiveCategory] = useState<Achievement['category'] | 'TODOS'>('TODOS');

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dayStats: Record<string, number> = {};
    
    exams.forEach(ex => {
        ex.studyLog?.forEach(log => {
            dayStats[log.date] = (dayStats[log.date] || 0) + log.minutes;
        });
    });

    let currentStreak = 0;
    const tempDate = new Date();
    while (dayStats[tempDate.toISOString().split('T')[0]]) {
        currentStreak++;
        tempDate.setDate(tempDate.getDate() - 1);
    }

    return { 
        totalMinutes, 
        completedExams: exams.filter(e => new Date(e.examDate) < today).length, 
        activeExams: exams.length,
        currentStreak,
        maxMinutesInADay: Math.max(0, ...Object.values(dayStats))
    };
  }, [exams, totalMinutes]);

  const filteredAchievements = useMemo(() => {
    return activeCategory === 'TODOS' 
        ? ALL_ACHIEVEMENTS 
        : ALL_ACHIEVEMENTS.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  const unlockedCount = ALL_ACHIEVEMENTS.filter(a => a.requirement(stats)).length;

  return (
    <div className="space-y-6 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RANGO CARD */}
        <div className="bg-surface border-[3px] border-main p-6 neo-shadow relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-primary opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                <Star size={180} fill="currentColor" />
            </div>
            <div className="relative z-10 flex justify-between items-center">
               <div className="space-y-1">
                  <p className="text-[9px] font-black text-main opacity-40 uppercase tracking-[0.3em]">Rango de Combate</p>
                  <h3 className="text-3xl font-black italic text-main tracking-tighter uppercase leading-none">{currentLevel.title}</h3>
               </div>
               <div className="w-14 h-14 bg-primary text-white border-[3px] border-main flex items-center justify-center neo-shadow-sm">
                  <Trophy size={28} strokeWidth={3} />
               </div>
            </div>
        </div>
  
        {/* QUICK STATS */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-surface p-4 border-[3px] border-main neo-shadow-sm h-full flex flex-col justify-center">
              <Flame size={20} className="text-orange-500 mb-1" fill="currentColor" />
              <p className="text-[24px] font-black italic text-main leading-none">{stats.currentStreak}D</p>
              <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Racha Actual</p>
           </div>
           <div className="bg-surface p-4 border-[3px] border-main neo-shadow-sm h-full flex flex-col justify-center">
              <Clock size={20} className="text-primary mb-1" />
              <p className="text-[24px] font-black italic text-main leading-none">{Math.floor(totalMinutes/60)}H</p>
              <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Estudio Total</p>
           </div>
        </div>
      </div>

      {/* ACHIEVEMENTS ENGINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-main">Medallero ({unlockedCount}/{ALL_ACHIEVEMENTS.length})</h4>
        </div>

        {/* CATEGORY SELECTOR */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 py-2">
            {['TODOS', 'TIEMPO', 'RACHA', 'EXAMENES', 'ESPECIAL'].map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-4 py-1.5 border-2 border-main font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white neo-shadow-sm' : 'bg-surface text-main'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
        
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            <AnimatePresence mode="popLayout">
                {filteredAchievements.map((achievement) => {
                    const isUnlocked = achievement.requirement(stats);
                    const Icon = IconMap[achievement.icon] || Trophy;
                    return (
                        <motion.div 
                            layout
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`aspect-square border-[3px] border-main p-3 flex flex-col items-center justify-center text-center relative ${isUnlocked ? 'bg-surface neo-shadow-sm' : 'bg-surface opacity-20'}`}
                        >
                            <Icon size={24} style={{ color: isUnlocked ? achievement.color : 'inherit' }} strokeWidth={2.5} />
                            <p className="text-[7px] font-black uppercase mt-2 leading-tight tracking-tighter truncate w-full">{achievement.title}</p>
                            {!isUnlocked && <Lock size={10} className="absolute top-1 right-1 opacity-50" />}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
