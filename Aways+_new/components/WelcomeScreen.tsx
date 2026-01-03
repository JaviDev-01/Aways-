
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 select-none overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#0066FF_1px,transparent_1px),linear-gradient(to_bottom,#0066FF_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm z-10"
      >
        <div className="space-y-4 mb-16 text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 neo-shadow-sm mb-2"
          >
            <Terminal size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Iniciando Protocolo...</span>
          </motion.div>
          
          <h1 className="text-7xl sm:text-8xl font-black italic tracking-tighter leading-none text-black">
            AWAYS<span className="text-primary">!</span>
          </h1>
          
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em]">
            Optimiza tu legado académico
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu Apodo / Nickname"
              className="w-full bg-white border-[3px] border-black p-5 text-xl font-black italic placeholder:text-black/10 neo-shadow focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all outline-none"
              autoFocus
            />
          </div>

          <motion.button
            type="submit"
            disabled={!name.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-18 bg-black text-white p-5 text-xl font-black italic uppercase tracking-tighter neo-shadow hover:bg-primary flex items-center justify-center gap-4 transition-colors disabled:opacity-30"
          >
            CONECTAR <ArrowRight size={24} strokeWidth={4} />
          </motion.button>
        </form>
      </motion.div>

      <div className="absolute bottom-10 text-[9px] font-black uppercase tracking-widest text-black/20">
        © 2025 AWAYS TECH LABS
      </div>
    </div>
  );
};
