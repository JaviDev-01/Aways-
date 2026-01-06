
import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-surface border-[4px] border-main w-full max-w-md max-h-[80vh] flex flex-col neo-shadow relative"
      >
        {/* Header */}
        <div className="p-6 border-b-[3px] border-main bg-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} />
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Privacidad</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-main no-scrollbar">
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Lock size={16} />
              <h3 className="font-black uppercase text-xs">Tu Seguridad es lo Primero</h3>
            </div>
            <p className="text-xs leading-relaxed opacity-70">
              En **Aways+**, nos tomamos tu privacidad muy en serio. Esta aplicación ha sido diseñada bajo el principio de "Privacidad por diseño". No somos una red social ni vendemos tus datos.
            </p>Section
          </section>

          <section className="space-y-4">
            <div className="bg-primary/5 border-2 border-primary/20 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                  <EyeOff size={16} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] leading-tight">Cero Recopilación de Datos</h4>
                  <p className="text-[10px] opacity-60">No recopilamos nombres reales, correos ni datos sensibles.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                  <Server size={16} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] leading-tight">Almacenamiento Local</h4>
                  <p className="text-[10px] opacity-60">Toda tu información se guarda exclusivamente en tu dispositivo.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3 pb-4">
            <h4 className="font-black uppercase text-xs">Uso de la Información</h4>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <p className="text-[11px] opacity-70">Los datos de tus exámenes y tiempos de estudio se usan solo para generar tus estadísticas personales.</p>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <p className="text-[11px] opacity-70">Las notificaciones se gestionan localmente en tu sistema operativo.</p>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <p className="text-[11px] opacity-70">No compartimos información con terceros ni servicios de publicidad.</p>
              </li>
            </ul>
          </section>

          <div className="pt-4 border-t-2 border-main/10">
            <p className="text-[9px] text-center opacity-40 font-bold uppercase tracking-widest">
              Aways+ Final System • 2026
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-surface border-t-[3px] border-main">
          <button 
            onClick={onClose}
            className="w-full bg-primary text-white py-3 font-black uppercase italic text-sm neo-shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Entendido
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
