
import React, { useState } from 'react';
import { LayoutGrid, Calendar, Plus, Settings, ClipboardList, BarChart3, X, MoreHorizontal, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  const [isHubOpen, setIsHubOpen] = useState(false);

  const handleAddAction = () => {
    setIsHubOpen(false);
    onAddClick();
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: AppTab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => {
          onTabChange(tab);
          setIsHubOpen(false);
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${isActive ? 'text-primary' : 'text-main opacity-20 hover:opacity-50'}`}
      >
        <Icon size={20} strokeWidth={isActive ? 3 : 2} />
        <span className={`text-[7px] font-black uppercase tracking-tighter mt-1 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none lg:hidden">
      <div className="max-w-md mx-auto relative">
        
        <AnimatePresence>
          {isHubOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                onClick={() => setIsHubOpen(false)}
              />
              <motion.div 
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.9 }}
                className="absolute bottom-20 right-0 w-52 p-4 bg-surface border-[4px] border-main neo-shadow pointer-events-auto flex flex-col gap-2"
              >
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Protocolos</span>
                   <button 
                    onClick={() => setIsHubOpen(false)}
                    className="p-1 hover:bg-main/5 transition-colors"
                   >
                    <X size={16} strokeWidth={3} />
                   </button>
                </div>

                <button
                  onClick={() => { onTabChange('evaluations'); setIsHubOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 border-[3px] border-main neo-shadow-sm transition-all ${activeTab === 'evaluations' ? 'bg-main text-surface' : 'bg-surface text-main'}`}
                >
                  <GraduationCap size={18} className={activeTab === 'evaluations' ? 'text-white' : 'text-primary'} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Evaluaciones</span>
                </button>

                <button
                  onClick={() => { onTabChange('settings'); setIsHubOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 border-[3px] border-main neo-shadow-sm transition-all ${activeTab === 'settings' ? 'bg-main text-surface' : 'bg-surface text-main'}`}
                >
                  <Settings size={18} className={activeTab === 'settings' ? 'text-white' : 'text-primary'} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ajustes</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="absolute -top-12 right-0 pointer-events-auto">
          <AnimatePresence>
            {!isHubOpen && (
              <motion.button
                key="hub-trigger"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsHubOpen(true)}
                className="w-10 h-10 border-[3px] border-main neo-shadow-sm flex items-center justify-center bg-surface text-main hover:bg-main/5 transition-colors"
              >
                <MoreHorizontal size={18} strokeWidth={4} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-surface border-[3px] border-main h-16 flex items-center neo-shadow pointer-events-auto overflow-hidden">
          <NavItem tab="home" icon={LayoutGrid} label="INICIO" />
          <NavItem tab="tasks" icon={ClipboardList} label="TAREAS" />
          
          <button
            onClick={handleAddAction}
            className="w-16 h-full bg-primary text-surface border-x-[3px] border-main flex items-center justify-center hover:brightness-110 active:brightness-90 transition-all group"
          >
            <Plus size={28} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <NavItem tab="calendar" icon={Calendar} label="AGENDA" />
          <NavItem tab="stats" icon={BarChart3} label="STATS" />
        </div>
      </div>
    </div>
  );
};
