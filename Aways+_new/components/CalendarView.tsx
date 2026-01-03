
import React, { useState, useMemo } from 'react';
import { Exam } from '../types';
import { ChevronLeft, ChevronRight, BookOpen, Calendar as CalendarIcon, Zap, LayoutGrid, List, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarViewProps {
  exams: Exam[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ exams }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'grid' | 'timeline'>('grid');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => {
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajuste para lunes
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate); 
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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

  const selectedDayEvents = useMemo(() => getEventsForDay(selectedDate), [selectedDate, exams]);

  const timelineDays = useMemo(() => {
    const daysArr = [];
    const tempDate = new Date();
    tempDate.setHours(0,0,0,0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(tempDate);
      d.setDate(tempDate.getDate() + i);
      daysArr.push({ date: d, events: getEventsForDay(d) });
    }
    return daysArr;
  }, [exams]);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic uppercase tracking-tight text-main">Calendario</h2>
        <div className="flex bg-surface border-2 border-main p-1 neo-shadow-sm">
          <button 
            onClick={() => setView('grid')} 
            className={`p-1.5 transition-colors ${view === 'grid' ? 'bg-primary text-white' : 'text-main opacity-20'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setView('timeline')} 
            className={`p-1.5 transition-colors ${view === 'timeline' ? 'bg-primary text-white' : 'text-main opacity-20'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div 
            key="grid" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-surface border-[3px] border-main p-4 neo-shadow relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-black uppercase tracking-widest text-primary">
                  {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                </p>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-1 text-main hover:text-primary"><ChevronLeft size={20} /></button>
                  <button onClick={nextMonth} className="p-1 text-main hover:text-primary"><ChevronRight size={20} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['L','M','X','J','V','S','D'].map(d => (
                  <div key={d} className="text-center text-[9px] font-black text-main opacity-20 pb-3">{d}</div>
                ))}
                {blanks.map((_, i) => (
                  <div key={i} className="aspect-square bg-main/5 border border-dashed border-main/5" />
                ))}
                {days.map(d => {
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
                {selectedDayEvents.length === 0 ? (
                  <p className="text-[10px] font-bold opacity-30 italic py-2 text-center uppercase tracking-widest">Sin misiones programadas</p>
                ) : (
                  selectedDayEvents.map((ev, i) => (
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
            initial={{ opacity: 0, x: 10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -10 }}
            className="space-y-3"
          >
            {timelineDays.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 pt-2 shrink-0 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-main opacity-20">
                    {item.date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
                  </p>
                  <p className="text-xl font-black italic leading-none text-main">{item.date.getDate()}</p>
                </div>
                <div className="flex-1 space-y-2 mb-4">
                  {item.events.length === 0 ? (
                    <div className="h-12 border border-dashed border-main/10 rounded-lg flex items-center px-4 opacity-10">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-main">Libre</span>
                    </div>
                  ) : (
                    item.events.map((ev, eIdx) => (
                      <div 
                        key={eIdx} 
                        className={`p-3 border-[2px] border-main neo-shadow-sm flex items-center gap-3 ${
                          ev.type === 'examen' ? 'bg-main text-surface' : 'bg-surface text-main'
                        }`}
                        style={{ 
                          borderLeftWidth: '6px',
                          borderLeftColor: ev.exam.color
                        }}
                      >
                        <div style={{ color: ev.type === 'examen' ? 'inherit' : ev.exam.color }}>
                          {ev.type === 'examen' ? <CalendarIcon size={14} /> : ev.type === 'inicio' ? <Zap size={14} fill="currentColor" /> : <BookOpen size={14} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[7px] font-black uppercase tracking-widest opacity-60 truncate">
                            {ev.type.toUpperCase()}
                          </p>
                          <p className="text-[10px] font-black truncate uppercase" style={{ color: ev.type === 'examen' ? 'white' : 'inherit' }}>{ev.exam.name}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
