
import React, { useState, useEffect, useMemo } from 'react';
import { Exam, USER_LEVELS, AppTab, Achievement, Task, DailyArchive, TaskSubject, StudySession, Quarter } from './types';
import { StorageService } from './services/storageService';
import { ExamCard } from './components/ExamCard';
import { CalendarView } from './components/CalendarView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { EvaluationsView } from './components/EvaluationsView';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StudySessionModal } from './components/StudySessionModal';
import { HomeHeader } from './components/HomeHeader';
import { ExamFormModal } from './components/ExamFormModal';
import { TaskBoard } from './components/TaskBoard';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Maximize2, Timer } from 'lucide-react';

const DAILY_GOAL_MINUTES = 120;

const STUDY_TIPS = [
  "Divide el temario en bloques de 25 minutos (Pomodoro).",
  "Estudia lo más difícil primero mientras tu mente está fresca.",
  "Bebe agua: un cerebro hidratado procesa datos un 15% más rápido.",
  "Explica el tema en voz alta para fijar conceptos.",
  "Dormir 8 horas es tan importante como estudiar 8 horas."
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(StorageService.getCurrentUser());
  const [exams, setExams] = useState<Exam[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [totalMinutes, setTotalMinutes] = useState(0);
  
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [taskHistory, setTaskHistory] = useState<DailyArchive[]>([]);
  const [taskSubjects, setTaskSubjects] = useState<TaskSubject[]>([]);
  
  const [quarters, setQuarters] = useState<Quarter[]>([]);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(localStorage.getItem('aways_dark_mode') === 'true');
  const [accentColor, setAccentColor] = useState<string>(localStorage.getItem('aways_accent_color') || '#0066FF');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  
  const [currentStudyExam, setCurrentStudyExam] = useState<Exam | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [studyMode, setStudyMode] = useState<'focus' | 'break'>('focus');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', accentColor);
    localStorage.setItem('aways_accent_color', accentColor);
    
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('aways_dark_mode', 'true');
      document.getElementById('meta-theme-color')?.setAttribute('content', '#0A0A0B');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('aways_dark_mode', 'false');
      document.getElementById('meta-theme-color')?.setAttribute('content', accentColor);
    }
  }, [accentColor, isDarkMode]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (studyMode === 'focus') {
          setElapsedSeconds(prev => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      const nextMode = studyMode === 'focus' ? 'break' : 'focus';
      setStudyMode(nextMode);
      setTimeLeft(nextMode === 'focus' ? 25 * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, studyMode]);

  const handleSaveSession = () => {
    if (!currentStudyExam) return;
    
    // Solo contabilizar si es >= 1 minuto (60 segundos)
    const minutesStudied = Math.floor(elapsedSeconds / 60);
    
    if (minutesStudied >= 1) {
      const todayStr = new Date().toISOString().split('T')[0];
      const newSession: StudySession = { 
        date: todayStr, 
        minutes: minutesStudied, 
        topicId: selectedTopicId || undefined 
      };

      const updatedExams = exams.map(e => {
        if (e.id === currentStudyExam.id) {
          const newLog = [...(e.studyLog || []), newSession];
          const newSyllabus = e.syllabus?.map(s => {
            if (s.id === selectedTopicId) return { ...s, minutesSpent: (s.minutesSpent || 0) + minutesStudied };
            return s;
          });
          return { ...e, studyLog: newLog, syllabus: newSyllabus };
        }
        return e;
      });

      setExams(updatedExams);
    }
    
    // Limpiar estados para ocultar la ventana flotante y resetear el sistema
    setElapsedSeconds(0);
    setIsTimerActive(false);
    setIsStudyModalOpen(false);
    setCurrentStudyExam(null);
    setSelectedTopicId(null);
    setTimeLeft(25 * 60);
    setStudyMode('focus');
  };

  useEffect(() => {
    if (currentUser) {
      setExams(StorageService.loadUserData(currentUser));
      const savedTasks = localStorage.getItem(`aways_tasks_curr_${currentUser}`);
      if (savedTasks) setCurrentTasks(JSON.parse(savedTasks));
      const savedHist = localStorage.getItem(`aways_tasks_hist_${currentUser}`);
      if (savedHist) setTaskHistory(JSON.parse(savedHist));
      const savedSubjects = localStorage.getItem(`aways_subjects_${currentUser}`);
      if (savedSubjects) setTaskSubjects(JSON.parse(savedSubjects));
      
      const savedQuarters = localStorage.getItem(`aways_evals_${currentUser}`);
      if (savedQuarters) {
        setQuarters(JSON.parse(savedQuarters));
      } else {
        const defaultQuarters: Quarter[] = [
          { id: 'q1', name: '1º TRIMESTRE', subjects: [] },
          { id: 'q2', name: '2º TRIMESTRE', subjects: [] },
          { id: 'q3', name: '3º TRIMESTRE', subjects: [] }
        ];
        setQuarters(defaultQuarters);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveUserData(currentUser, exams);
      localStorage.setItem(`aways_tasks_curr_${currentUser}`, JSON.stringify(currentTasks));
      localStorage.setItem(`aways_subjects_${currentUser}`, JSON.stringify(taskSubjects));
      localStorage.setItem(`aways_evals_${currentUser}`, JSON.stringify(quarters));
      const mins = exams.reduce((acc, e) => acc + (e.studyLog?.reduce((sAcc, s) => sAcc + s.minutes, 0) || 0), 0);
      setTotalMinutes(mins);
    }
  }, [exams, currentTasks, currentUser, taskSubjects, quarters]);

  const todayMinutes = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return exams.reduce((acc, ex) => {
      const todayLogs = ex.studyLog?.filter(log => log.date === todayStr) || [];
      return acc + todayLogs.reduce((lAcc, l) => lAcc + l.minutes, 0);
    }, 0);
  }, [exams]);

  const currentLevel = useMemo(() => {
    const levels = [...USER_LEVELS];
    return levels.reverse().find(l => totalMinutes >= l.minMinutes) || USER_LEVELS[0];
  }, [totalMinutes]);

  if (!currentUser) return <WelcomeScreen onStart={(name) => { StorageService.setCurrentUser(name); setCurrentUser(name); }} />;

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto px-5 pt-6 pb-40">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <HomeHeader user={currentUser} todayMinutes={todayMinutes} dailyGoal={DAILY_GOAL_MINUTES} activeExamsCount={exams.length} todayTasks={currentTasks} />
              
              {/* VENTANA FLOTANTE DE SESIÓN EN CURSO */}
              {currentStudyExam && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="bg-surface border-[3px] border-main neo-shadow p-5 flex items-center justify-between relative overflow-hidden group"
                >
                  <div className="flex flex-col gap-1 z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase text-main opacity-50 flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${studyMode === 'focus' ? 'bg-primary' : 'bg-green-500'}`} /> 
                        {studyMode === 'focus' ? 'SESIÓN DE ENFOQUE' : 'TIEMPO DE DESCANSO'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <h4 className="text-xl font-black italic uppercase truncate max-w-[140px] leading-tight text-main">{currentStudyExam.name}</h4>
                      <motion.span 
                        key={timeLeft}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-black italic tabular-nums text-primary"
                      >
                        {formatTime(timeLeft)}
                      </motion.span>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsStudyModalOpen(true)} 
                    className="w-12 h-12 bg-primary text-white border-2 border-main neo-shadow-sm flex items-center justify-center group-hover:bg-main transition-colors"
                  >
                    <Maximize2 size={20} strokeWidth={3} />
                  </motion.button>
                </motion.div>
              )}

              <div className="bg-primary/5 border-2 border-primary/20 p-4 rounded-xl flex gap-3 items-center">
                <Lightbulb size={18} className="text-primary" />
                <p className="text-xs font-bold text-main opacity-70 italic">{STUDY_TIPS[new Date().getDate() % STUDY_TIPS.length]}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {exams.map(ex => (
                  <ExamCard key={ex.id} exam={ex} onDelete={(id) => setExams(exams.filter(e => e.id !== id))} onEdit={(e) => { setEditingExamId(e.id); setIsFormModalOpen(true); }} onOpenStudySession={(e) => { setCurrentStudyExam(e); setTimeLeft(25 * 60); setStudyMode('focus'); setIsStudyModalOpen(true); }} onStartEarly={() => {}} />
                ))}
                {exams.length === 0 && (
                   <div className="text-center py-16 border-[3px] border-dashed border-main opacity-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sin misiones activas</p>
                   </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <TaskBoard currentTasks={currentTasks} history={taskHistory} subjects={taskSubjects} onUpdateTasks={setCurrentTasks} />
            </motion.div>
          )}

          {activeTab === 'calendar' && <CalendarView exams={exams} />}
          {activeTab === 'stats' && <StatsView exams={exams} totalMinutes={totalMinutes} currentLevel={currentLevel} />}
          {activeTab === 'evaluations' && <EvaluationsView quarters={quarters} onUpdateQuarters={setQuarters} />}
          {activeTab === 'settings' && (
            <SettingsView currentUser={currentUser} currentLevel={currentLevel} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} accentColor={accentColor} setAccentColor={setAccentColor} onLogout={() => { StorageService.logout(); setCurrentUser(null); }} subjects={taskSubjects} onUpdateSubjects={setTaskSubjects} onDataImported={() => {}} />
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAddClick={() => setIsFormModalOpen(true)} />

      <AnimatePresence>
        {isFormModalOpen && (
          <ExamFormModal isOpen={isFormModalOpen} onClose={() => { setIsFormModalOpen(false); setEditingExamId(null); }} onSave={(data) => { if (editingExamId) { setExams(exams.map(e => e.id === editingExamId ? { ...e, ...data } : e)); } else { setExams([...exams, { id: crypto.randomUUID(), ...data, studyLog: [] }]); } setIsFormModalOpen(false); }} editingExam={editingExamId ? exams.find(e => e.id === editingExamId) : null} defaultColor={accentColor} />
        )}
        {isStudyModalOpen && currentStudyExam && (
          <StudySessionModal exam={currentStudyExam} isOpen={isStudyModalOpen} isActive={isTimerActive} timeLeft={timeLeft} mode={studyMode} selectedTopicId={selectedTopicId} onSelectTopic={setSelectedTopicId} setIsActive={setIsTimerActive} onClose={() => setIsStudyModalOpen(false)} onSaveSession={handleSaveSession} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
