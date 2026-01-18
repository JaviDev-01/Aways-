
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Exam } from '../types';
import { ChevronLeft, ChevronRight, BookOpen, Calendar as CalendarIcon, Zap, LayoutGrid, List, Clock, CalendarDays, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarViewProps {
  exams: Exam[];
}

type ViewType = 'grid' | 'timeline';
type ListMode = 'weekly' | 'monthly';

export const CalendarView: React.FC<CalendarViewProps> = ({ exams }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('grid');
  const [listMode, setListMode] = useState<ListMode>('weekly');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTodayButton, setShowTodayButton] = useState(false);
  
  const todayRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isTodayInView = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => {
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajuste para lunes
  };

  const handlePrev = () => {
    if (view === 'grid' || listMode === 'monthly') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 7);
      setCurrentDate(prevWeek);
    }
  };

  const handleNext = () => {
    if (view === 'grid' || listMode === 'monthly') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      setCurrentDate(nextWeek);
    }
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    
    // Si ya estamos en la vista correcta, hacemos scroll suave
    if (view === 'timeline') {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  // Efecto para detectar scroll y mostrar botón "Hoy"
  useEffect(() => {
    const handleScroll = () => {
      if (view !== 'timeline') {
        setShowTodayButton(false);
        return;
      }

      if (todayRef.current) {
        const rect = todayRef.current.getBoundingClientRect();
        // Mostrar botón si el elemento "hoy" está fuera del área visible (con margen)
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight - 150; // Ajuste de margen inferior
        setShowTodayButton(!isVisible);
      } else {
        // Si no existe hoyRef (otro mes/semana), mostrar botón si la fecha actual no es hoy
        const now = new Date();
        const sameMonth = currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear();
        setShowTodayButton(!sameMonth);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view, currentDate, listMode]);

  // Autoscroll al montar la vista de lista
  useEffect(() => {
    if (view === 'timeline') {
      const now = new Date();
      if (currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear()) {
         setTimeout(() => {
           todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }, 300);
      }
    }
  }, [view]);

  const getEventsForDay = (checkDate: Date) => {
    const d = new Date(checkDate);
    d.setHours(0,0,0,0);
    return exams.map(exam => {
      const examDate = new Date(exam.examDate);
      examDate.setHours(0,0,0,0);
      const startDate = new Date(examDate);
      startDate.setDate(examDate.getDate() - exam.studyDurationDays);
      
      let type: 'examen' | 'inicio' | 'estudio' | null = null;
      if (d.getTime() === examDate.getTime()) type = 'examen';
      else if (d.getTime() === startDate.getTime()) type = 'inicio';
      else if (d > startDate && d < examDate) type = 'estudio';
      return type ? { exam, type } : null;
    }).filter(Boolean) as { exam: Exam, type: 'examen' | 'inicio' | 'estudio' }[];
  };

  const timelineDays = useMemo(() => {
    const daysArr = [];
    let startPoint = new Date(currentDate);
    let iterations = 0;

    if (listMode === 'monthly') {
      startPoint = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      iterations = getDaysInMonth(currentDate);
    } else {
      const day = startPoint.getDay();
      const diff = startPoint.getDate() - day + (day === 0 ? -6 : 1);
      startPoint.setDate(diff);
      iterations = 7;
    }

    for (let i = 0; i < iterations; i++) {
      const d = new Date(startPoint);
      d.setDate(startPoint.getDate() + i);
      d.setHours(0,0,0,0);
      daysArr.push({ date: d, events: getEventsForDay(d) });
    }
    return daysArr;
  }, [exams, currentDate, listMode]);

  return (
    <div className="space-y-6 pb-32 relative" ref={scrollContainerRef}>
      {/* BOTÓN FLOTANTE VOLVER A HOY - POSICIÓN CORREGIDA */}
      <AnimatePresence>
        {showTodayButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={jumpToToday}
            className="fixed bottom-36 left-1/2 -translate-x-1/2 z-[105] bg-main text-surface border-[3px] border-surface neo-shadow px-6 py-3 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95 hover:scale-105"
          >
            <Target size={16} strokeWidth={4} /> VOLVER A HOY
          </motion.button>
        )}
      </AnimatePresence>

      {/* HEADER DE NAVEGACIÓN */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-main leading-none">Agenda</h2>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mt-1">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
          </p>
        </div>
        <div className="flex bg-surface border-2 border-main p-1 neo-shadow-sm">
          <button 
            onClick={() => setView('grid')} 
            className={`p-1.5 transition-all ${view === 'grid' ? 'bg-main text-surface' : 'text-main opacity-20'}`}
          >
            <LayoutGrid size={16} strokeWidth={3} />
          </button>
          <button 
            onClick={() => setView('timeline')} 
            className={`p-1.5 transition-all ${view === 'timeline' ? 'bg-main text-surface' : 'text-main opacity-20'}`}
          >
            <List size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* CONTROLES DE TIEMPO */}
      <div className="flex items-center justify-between bg-surface border-[3px] border-main p-3 neo-shadow-sm">
        <div className="flex gap-2">
          <button onClick={handlePrev} className="p-2 bg-main text-surface hover:bg-primary transition-colors"><ChevronLeft size={18} strokeWidth={4} /></button>
          <button onClick={handleNext} className="p-2 bg-main text-surface hover:bg-primary transition-colors"><ChevronRight size={18} strokeWidth={4} /></button>
        </div>
        
        <AnimatePresence mode="wait">
          {view === 'timeline' && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex bg-main/5 p-1 border-2 border-main rounded"
            >
              <button 
                onClick={() => setListMode('weekly')}
                className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all ${listMode === 'weekly' ? 'bg-main text-surface' : 'text-main opacity-40'}`}
              >
                Semana
              </button>
              <button 
                onClick={() => setListMode('monthly')}
                className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all ${listMode === 'monthly' ? 'bg-main text-surface' : 'text-main opacity-40'}`}
              >
                Mes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div 
            key="grid" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            <div className="bg-surface border-[3px] border-main p-4 neo-shadow relative overflow-hidden">
              <div className="grid grid-cols-7 gap-1">
                {['L','M','X','J','V','S','D'].map(d => (
                  <div key={d} className="text-center text-[9px] font-black text-main opacity-20 pb-3">{d}</div>
                ))}
                {Array(getFirstDayOfMonth(currentDate)).fill(null).map((_, i) => (
                  <div key={`blank-${i}`} className="aspect-square bg-main/5 border border-dashed border-main/5" />
                ))}
                {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(d => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                  date.setHours(0,0,0,0);
                  const events = getEventsForDay(date);
                  const isToday = new Date().setHours(0,0,0,0) === date.getTime();
                  const isSelected = selectedDate.getTime() === date.getTime();
                  
                  return (
                    <button 
                      key={d} 
                      onClick={() => setSelectedDate(new Date(date))}
                      className={`aspect-square relative flex items-center justify-center border text-[11px] font-black transition-all ${
                        isSelected ? 'bg-main text-surface border-main z-10 scale-110 neo-shadow-sm' : 
                        isToday ? 'bg-primary/10 text-primary border-primary/20' : 
                        'bg-surface text-main border-main/5 hover:border-main/20'
                      }`}
                    >
                      {d}
                      {events.length > 0 && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {events.slice(0, 3).map((ev, idx) => (
                            <div 
                              key={idx} 
                              className="w-1 h-1 rounded-full" 
                              style={{ backgroundColor: ev.exam.color || '#0066FF' }} 
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={selectedDate.getTime()}
              className="bg-main text-surface p-5 border-[3px] border-main neo-shadow"
            >
              <div className="flex items-center justify-between mb-4 border-b border-surface/10 pb-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">AGENDA DEL DÍA</p>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase()}
                 </p>
              </div>
              
              <div className="space-y-3">
                {getEventsForDay(selectedDate).length === 0 ? (
                  <p className="text-[10px] font-bold opacity-30 italic py-2 text-center uppercase tracking-widest">Sin misiones programadas</p>
                ) : (
                  getEventsForDay(selectedDate).map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 bg-surface/5 p-3 rounded border border-surface/10" style={{ borderLeft: `4px solid ${ev.exam.color}` }}>
                       <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ color: ev.exam.color }}>
                          {ev.type === 'examen' ? <Zap size={18} fill="currentColor" /> : <Clock size={18} />}
                       </div>
                       <div className="min-w-0">
                          <p className="text-[7px] font-black uppercase tracking-widest opacity-60" style={{ color: ev.exam.color }}>{ev.type}</p>
                          <p className="text-xs font-black truncate uppercase text-surface">{ev.exam.name}</p>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="timeline" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {timelineDays.map((item, idx) => {
              const isToday = isTodayInView(item.date);
              return (
                <div key={idx} className="flex gap-4" ref={isToday ? todayRef : null}>
                  <div className="w-12 pt-1 shrink-0 text-center flex flex-col items-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-main opacity-30">
                      {item.date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
                    </p>
                    <p className={`text-2xl font-black italic leading-none transition-colors ${isToday ? 'text-primary scale-110' : 'text-main'}`}>
                      {item.date.getDate()}
                    </p>
                    {isToday && (
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 mb-6">
                    {item.events.length === 0 ? (
                      <div className="h-14 border border-dashed border-main/10 rounded flex items-center px-4 opacity-10 bg-main/5">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-main">Estado Libre</span>
                      </div>
                    ) : (
                      item.events.map((ev, eIdx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={eIdx} 
                          className={`p-4 border-[3px] border-main neo-shadow-sm flex items-center gap-4 ${
                            ev.type === 'examen' ? 'bg-main text-surface' : 'bg-surface text-main'
                          }`}
                          style={{ 
                            borderLeftWidth: '8px',
                            borderLeftColor: ev.exam.color
                          }}
                        >
                          <div style={{ color: ev.type === 'examen' ? 'inherit' : ev.exam.color }}>
                            {ev.type === 'examen' ? <CalendarDays size={20} strokeWidth={3} /> : ev.type === 'inicio' ? <Zap size={20} fill="currentColor" /> : <BookOpen size={20} strokeWidth={3} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50 truncate">
                              {ev.type.toUpperCase()}
                            </p>
                            <h4 className="text-xs font-black truncate uppercase leading-tight">{ev.exam.name}</h4>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
