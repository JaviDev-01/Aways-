
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
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-surface border-t-[3px] border-main lg:hidden pb-[env(safe-area-inset-bottom)]">
      <AnimatePresence>
        {isHubOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
            onClick={() => setIsHubOpen(false)}
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              className="absolute bottom-16 left-0 right-0 bg-surface border-t-[3px] border-main p-6 rounded-t-2xl space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Menú Rápido</span>
                  <button onClick={() => setIsHubOpen(false)}><X size={20} /></button>
              </div>
              
              <button
                onClick={() => { onTabChange('evaluations'); setIsHubOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 border-[3px] border-main neo-shadow-sm ${activeTab === 'evaluations' ? 'bg-main text-surface' : 'bg-surface text-main'}`}
              >
                <div className="p-2 bg-primary/10 rounded-full"><GraduationCap size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest">Evaluaciones</span>
              </button>

              <button
                onClick={() => { onTabChange('settings'); setIsHubOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 border-[3px] border-main neo-shadow-sm ${activeTab === 'settings' ? 'bg-main text-surface' : 'bg-surface text-main'}`}
              >
                <div className="p-2 bg-primary/10 rounded-full"><Settings size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest">Ajustes</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center h-16 relative">
          <NavItem tab="home" icon={LayoutGrid} label="INICIO" />
          <NavItem tab="tasks" icon={ClipboardList} label="TAREAS" />
          
          <div className="relative -top-6">
            <button
              onClick={handleAddAction}
              className="w-14 h-14 bg-primary text-surface border-[3px] border-main rounded-full flex items-center justify-center neo-shadow hover:scale-110 transition-transform"
            >
              <Plus size={28} strokeWidth={4} />
            </button>
          </div>

          <NavItem tab="stats" icon={BarChart3} label="STATS" />
          
          <button
            onClick={() => setIsHubOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${isHubOpen ? 'text-primary' : 'text-main opacity-20'}`}
          >
            <MoreHorizontal size={20} strokeWidth={3} />
            <span className="text-[7px] font-black uppercase tracking-tighter mt-1">MENÚ</span>
          </button>
      </div>
    </div>
  );
};
