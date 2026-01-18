import React from 'react';
import { LayoutGrid, Calendar, BarChart3, Plus, Shield, LogOut, ClipboardList, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onAddClick: () => void;
  currentUser?: string | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onAddClick, currentUser, onLogout }) => {
  
  const NavItem = ({ tab, icon: Icon, label }: { tab: AppTab, icon: any, label: string }) => {
    const isActive = activeTab === tab;
    
    return (
      <button
        onClick={() => onTabChange(tab)}
        className={`relative flex items-center justify-start w-full px-6 py-4 transition-all gap-4 group ${isActive ? 'text-primary bg-primary/5' : 'text-main opacity-50 hover:opacity-80 hover:bg-black/5 dark:hover:bg-white/5'}`}
      >
        <div className={`transition-all ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
          <Icon size={24} strokeWidth={isActive ? 3 : 2} />
        </div>
        <span className={`text-sm font-black uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-70'}`}>
          {label}
        </span>
        {isActive && (
           <motion.div 
            layoutId="sidebar-pill" 
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
           />
        )}
      </button>
    );
  };

  return (
    <div className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-72 bg-surface border-r-[3px] border-main z-50">
      
      {/* Header Logo */}
      <div className="p-8 pb-12">
        <h1 className="text-3xl font-black italic tracking-tighter text-main">
          AWAYS<span className="text-primary text-4xl leading-none">+</span>
        </h1>
        {currentUser && (
            <p className="text-xs font-bold text-main opacity-40 mt-2 uppercase tracking-widest pl-1">
                Hola, {currentUser}
            </p>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col gap-2">
        <NavItem tab="home" icon={LayoutGrid} label="Inicio" />
        <NavItem tab="tasks" icon={ClipboardList} label="Misiones" />
        <NavItem tab="calendar" icon={Calendar} label="Agenda" />
        <NavItem tab="evaluations" icon={GraduationCap} label="Evaluaciones" />
        <NavItem tab="stats" icon={BarChart3} label="Estadísticas" />
        <NavItem tab="settings" icon={Shield} label="Ajustes" />
      </div>

      {/* Add Button (Desktop version) */}
      <div className="p-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddClick}
          className="w-full h-16 bg-primary text-white border-[3px] border-black flex items-center justify-center gap-3 neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          <Plus size={24} strokeWidth={4} />
          <span className="font-black uppercase tracking-widest text-sm">Nueva Misión</span>
        </motion.button>
      </div>
      
       {/* Footer / Logout */}
       <div className="p-6 border-t-2 border-main/10 mt-auto">
            <button 
                onClick={onLogout}
                className="flex items-center gap-3 text-main opacity-40 hover:opacity-100 hover:text-red-500 transition-colors w-full px-2"
            >
                <LogOut size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Cerrar Sesión</span>
            </button>
       </div>

    </div>
  );
};
