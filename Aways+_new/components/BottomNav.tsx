
import React from 'react';
import { LayoutGrid, Calendar, BarChart3, Plus, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  
  const NavItem = ({ tab, icon: Icon, label }: { tab: AppTab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    
    return (
      <button
        onClick={() => onTabChange(tab)}
        className={`relative flex flex-col items-center justify-center w-full h-14 transition-all ${isActive ? 'text-primary' : 'text-main opacity-20 hover:opacity-50'}`}
      >
        <div className={`p-2 transition-all ${isActive ? 'scale-110' : 'scale-100'}`}>
          <Icon size={22} strokeWidth={isActive ? 3 : 2} />
        </div>
        <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          {label}
        </span>
        {isActive && (
           <motion.div 
            layoutId="nav-pill" 
            className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
           />
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none">
      <motion.div 
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="max-w-md mx-auto bg-surface/80 backdrop-blur-xl border-[3px] border-main px-4 py-2 flex items-center justify-between neo-shadow pointer-events-auto relative"
      >
        <div className="flex-1 flex justify-around items-center">
          <NavItem tab="home" icon={LayoutGrid} label="Inicio" />
          <NavItem tab="calendar" icon={Calendar} label="Agenda" />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddClick}
          className="w-14 h-14 bg-main text-surface border-[3px] border-main flex items-center justify-center neo-shadow -mt-12 mx-4 z-10 hover:bg-primary transition-colors"
        >
          <Plus size={28} strokeWidth={4} />
        </motion.button>

        <div className="flex-1 flex justify-around items-center">
          <NavItem tab="stats" icon={BarChart3} label="Stats" />
          <NavItem tab="settings" icon={Shield} label="Ajustes" />
        </div>
      </motion.div>
    </div>
  );
};
