
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../types';
import { Trophy, Star, Sparkles, Footprints, Moon, Target, Zap, CheckCircle2, X } from 'lucide-react';

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

const IconMap: Record<string, any> = {
  Footprints,
  Trophy,
  CheckCircle2,
  Moon,
  Target,
  Zap
};

export const AchievementUnlockedModal: React.FC<Props> = ({ achievement, onClose }) => {
  const Icon = IconMap[achievement.icon] || Trophy;

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        className="bg-white border-[6px] border-black p-8 max-w-sm w-full neo-shadow relative overflow-hidden text-center"
      >
        {/* Background Sparkles */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-4 left-4 animate-bounce"><Sparkles size={40} /></div>
            <div className="absolute bottom-4 right-4 animate-pulse"><Star size={40} fill="currentColor" /></div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-black/20 hover:text-black">
            <X size={24} strokeWidth={4} />
        </button>

        <motion.div 
            animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-24 h-24 bg-black mx-auto mb-6 flex items-center justify-center neo-shadow-sm"
            style={{ color: achievement.color }}
        >
            <Icon size={48} strokeWidth={3} fill="currentColor" />
        </motion.div>

        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">¡LOGRO DESBLOQUEADO!</p>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{achievement.title}</h2>
        <p className="text-sm font-bold text-black/60 leading-relaxed mb-8">
            {achievement.description}
        </p>

        <button 
            onClick={onClose}
            className="w-full bg-black text-white py-4 border-[3px] border-black font-black italic uppercase tracking-widest neo-shadow hover:bg-primary transition-colors"
        >
            CONTINUAR MISIÓN
        </button>
      </motion.div>
    </div>
  );
};
