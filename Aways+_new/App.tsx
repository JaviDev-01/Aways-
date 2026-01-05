
import React, { useState, useEffect, useMemo } from 'react';
import { Exam, FilterType, USER_LEVELS, AppTab, Priority, ALL_ACHIEVEMENTS, Achievement, SUBJECT_COLORS } from './types';
import { StorageService } from './services/storageService';
import { NotificationService } from './services/notificationService';
import { ExamCard } from './components/ExamCard';
import { CalendarView } from './components/CalendarView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StudySessionModal } from './components/StudySessionModal';
import { HomeHeader } from './components/HomeHeader';
import { ExamFormModal } from './components/ExamFormModal';
import { AchievementUnlockedModal } from './components/AchievementUnlockedModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Zap, Maximize2 } from 'lucide-react';
import { OtaService } from './ota';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

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
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(localStorage.getItem('aways_dark_mode') === 'true');
  const [accentColor, setAccentColor] = useState<string>(localStorage.getItem('aways_accent_color') || '#0066FF');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  const [currentStudyExam, setCurrentStudyExam] = useState<Exam | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [studyMode, setStudyMode] = useState<'focus' | 'break'>('focus');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [updateStatus, setUpdateStatus] = useState<'idle' | 'available' | 'downloading' | 'installing' | 'ready'>('idle');
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('aways_dark_mode', String(isDarkMode));
    
    const root = document.documentElement;
    root.style.setProperty('--primary', accentColor);
    localStorage.setItem('aways_accent_color', accentColor);
    
    const r = parseInt(accentColor.slice(1, 3), 16);
    const g = parseInt(accentColor.slice(3, 5), 16);
    const b = parseInt(accentColor.slice(5, 7), 16);
    root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    
    const meta = document.getElementById('meta-theme-color');
    if (meta) meta.setAttribute('content', accentColor);
  }, [isDarkMode, accentColor]);

  useEffect(() => {
    if (currentUser) {
      const userExams = StorageService.loadUserData(currentUser);
      setExams(userExams);
      calculateStats(userExams);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageService.saveUserData(currentUser, exams);
      calculateStats(exams);
      NotificationService.scheduleExamNotifications(exams);
    }
  }, [exams, currentUser]);

  useEffect(() => {
    NotificationService.requestPermissions();
    
    // OTA Logic
    CapacitorUpdater.notifyAppReady(); 
    
    OtaService.checkRemoteVersion().then(version => {
      if (version) {
        setNewVersion(version);
        setUpdateStatus('available');
      }
    });
  }, []);

  // Listener para el progreso de descarga
  useEffect(() => {
    let listenerHandle: any;

    const setupListener = async () => {
      listenerHandle = await CapacitorUpdater.addListener('download', (info: any) => {
        // info.percent suele ser un valor entre 0 y 100
        if (info.percent) {
          setDownloadProgress(Math.round(info.percent));
        }
      });
    };
    
    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, []);

  const handleUpdate = async () => {
    if (!newVersion) return;
    try {
      setUpdateStatus('downloading');
      setDownloadProgress(0);
      
      const result = await OtaService.download(newVersion);
      
      if (result.version) {
        setUpdateStatus('installing');
        // Pequeño delay para asegurar que el usuario lee "Instalando..."
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // La app se recargará aquí. Si falla por timeout suele ser falso positivo.
        await OtaService.install(result.version);
        setUpdateStatus('ready');
      }
    } catch (error) {
      // Ignoramos errores si estamos en fase de instalación (posible reload race condition)
      if (updateStatus === 'installing') {
         console.log("Reload triggered (ignoring catch block)");
         return;
      }
      console.error("Update failed", error);
      setUpdateStatus('available');
      alert("Error al actualizar. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
        if (studyMode === 'focus') setElapsedSeconds(e => e + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (studyMode === 'focus') {
        setStudyMode('break');
        setTimeLeft(5 * 60);
      } else {
        setStudyMode('focus');
        setTimeLeft(25 * 60);
        setIsTimerActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, studyMode]);

  const calculateStats = (currentExams: Exam[]) => {
    const mins = currentExams.reduce((acc, e) => 
      acc + (e.studyLog?.reduce((sAcc, s) => sAcc + s.minutes, 0) || 0), 0);
    setTotalMinutes(mins);
  };

  const currentLevel = useMemo(() => {
    return [...USER_LEVELS].reverse().find(l => totalMinutes >= l.minMinutes) || USER_LEVELS[0];
  }, [totalMinutes]);

  const todayMinutes = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return exams.reduce((acc, ex) => {
      const todayLogs = ex.studyLog?.filter(log => log.date === todayStr) || [];
      return acc + todayLogs.reduce((lAcc, l) => lAcc + l.minutes, 0);
    }, 0);
  }, [exams]);

  const dailyTip = useMemo(() => STUDY_TIPS[new Date().getDate() % STUDY_TIPS.length], []);

  const handleSaveExam = (formData: any) => {
    if (editingExamId) {
      setExams(prev => prev.map(ex => ex.id === editingExamId ? { ...ex, ...formData } : ex));
    } else {
      const newExam: Exam = {
        id: crypto.randomUUID(),
        ...formData,
        studyLog: [],
        manuallyStarted: false
      };
      setExams(prev => [...prev, newExam]);
    }
    setEditingExamId(null);
    setIsFormModalOpen(false);
  };

  const handleDeleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    // Limpieza de estados críticos para evitar que la app se quede "pillada"
    if (currentStudyExam?.id === id) {
      setCurrentStudyExam(null);
      setIsTimerActive(false);
      setIsStudyModalOpen(false);
    }
    if (editingExamId === id) {
      setEditingExamId(null);
    }
    setIsFormModalOpen(false);
  };

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2, '0')}:${(s%60).toString().padStart(2, '0')}`;

  const handleSaveSession = () => {
    if (currentStudyExam) {
      const mins = Math.floor(elapsedSeconds / 60);
      if (mins > 0) {
        setExams(prev => prev.map(ex => {
          if (ex.id !== currentStudyExam.id) return ex;
          const updatedSyllabus = ex.syllabus?.map(topic => 
            topic.id === selectedTopicId ? { ...topic, minutesSpent: topic.minutesSpent + mins } : topic
          ) || [];
          return { 
            ...ex, 
            syllabus: updatedSyllabus,
            studyLog: [...(ex.studyLog || []), { 
              date: new Date().toISOString().split('T')[0], 
              minutes: mins,
              topicId: selectedTopicId || undefined
            }] 
          };
        }));
      }
      setCurrentStudyExam(null);
      setSelectedTopicId(null);
      setIsTimerActive(false);
      setElapsedSeconds(0);
      setTimeLeft(25 * 60);
      setIsStudyModalOpen(false);
    }
  };

  if (!currentUser) return <WelcomeScreen onStart={(name) => { StorageService.setCurrentUser(name); setCurrentUser(name); }} />;

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto px-5 pt-app-container pb-40">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <HomeHeader user={currentUser} todayMinutes={todayMinutes} dailyGoal={DAILY_GOAL_MINUTES} activeExamsCount={exams.length} />

              {currentStudyExam && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface border-[3px] border-main neo-shadow p-5 flex items-center justify-between group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-2 opacity-10 rotate-12">
                    <Zap size={60} fill="currentColor" style={{ color: currentStudyExam.color }} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 z-10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentStudyExam.color }} />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-main opacity-50">Sesión en Curso</span>
                    </div>
                    <h4 className="text-lg font-black text-main italic truncate uppercase leading-none">{currentStudyExam.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 z-10">
                    <span className="text-2xl font-black italic tracking-tighter tabular-nums text-primary">{formatTime(timeLeft)}</span>
                    <button onClick={() => setIsStudyModalOpen(true)} className="w-10 h-10 flex items-center justify-center bg-primary text-white border-2 border-main neo-shadow-sm"><Maximize2 size={18} strokeWidth={3} /></button>
                  </div>
                </motion.div>
              )}

              <div className="bg-primary/5 border-2 border-primary/20 p-4 rounded-xl flex gap-3 items-start relative overflow-hidden">
                <div className="bg-primary text-surface p-2 rounded-lg shrink-0 z-10">
                  <Lightbulb size={18} />
                </div>
                <div className="z-10">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Consejo del día</p>
                  <p className="text-xs font-bold leading-relaxed text-main opacity-70">{dailyTip}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {exams.map(ex => (
                  <ExamCard key={ex.id} exam={ex} onDelete={handleDeleteExam} onEdit={(e) => { setEditingExamId(e.id); setIsFormModalOpen(true); }} onOpenStudySession={(e) => { setCurrentStudyExam(e); setIsStudyModalOpen(true); }} onStartEarly={(id) => {}} />
                ))}
                {exams.length === 0 && (
                  <div className="text-center py-20 border-[3px] border-dashed border-main opacity-20">
                     <p className="text-xs font-black uppercase tracking-[0.3em] text-main">No hay misiones activas</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && <CalendarView exams={exams} />}
          {activeTab === 'stats' && <StatsView exams={exams} totalMinutes={totalMinutes} currentLevel={currentLevel} />}
          {activeTab === 'settings' && <SettingsView currentUser={currentUser} currentLevel={currentLevel} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} accentColor={accentColor} setAccentColor={setAccentColor} onLogout={() => { StorageService.logout(); setCurrentUser(null); }} onDataImported={() => {}} />}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => { setEditingExamId(null); setIsFormModalOpen(false); setActiveTab(tab); }} onAddClick={() => { setEditingExamId(null); setIsFormModalOpen(true); }} />

      <AnimatePresence>
        {isFormModalOpen && (
          <ExamFormModal 
            isOpen={isFormModalOpen} 
            onClose={() => { setIsFormModalOpen(false); setEditingExamId(null); }} 
            onSave={handleSaveExam} 
            onDelete={handleDeleteExam} 
            editingExam={editingExamId ? exams.find(e => e.id === editingExamId) : null}
            defaultColor={accentColor}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentStudyExam && isStudyModalOpen && (
          <StudySessionModal 
            exam={currentStudyExam} 
            isOpen={isStudyModalOpen} 
            isActive={isTimerActive} 
            timeLeft={timeLeft} 
            mode={studyMode} 
            selectedTopicId={selectedTopicId} 
            onSelectTopic={setSelectedTopicId} 
            setIsActive={setIsTimerActive} 
            onClose={() => setIsStudyModalOpen(false)} 
            onSaveSession={handleSaveSession} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {newlyUnlockedAchievement && <AchievementUnlockedModal achievement={newlyUnlockedAchievement} onClose={() => setNewlyUnlockedAchievement(null)} />}
      </AnimatePresence>
      <AnimatePresence>
      <AnimatePresence>
        {updateStatus !== 'idle' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-5 right-5 z-50 bg-black text-white p-4 border-2 border-primary shadow-[4px_4px_0px_0px_var(--primary)] flex items-center justify-between"
          >
            <div>
              <p className="font-black uppercase text-xs text-primary mb-1">
                {updateStatus === 'available' && 'Nueva Versión Disponible'}
                {updateStatus === 'downloading' && 'Descargando...'}
                {updateStatus === 'installing' && 'Descomprimiendo...'}
                {updateStatus === 'ready' && 'Reiniciando...'}
              </p>
              <p className="text-sm font-bold">
                 {updateStatus === 'available' && `v${newVersion} lista para instalar`}
                 {updateStatus === 'downloading' && 'Por favor espera'}
                 {updateStatus === 'installing' && 'Instalando actualización'}
                 {updateStatus === 'ready' && 'Aplicando cambios...'}
              </p>
            </div>
            
            {updateStatus === 'available' && (
              <button 
                onClick={handleUpdate}
                className="bg-primary text-white px-4 py-2 font-black uppercase text-xs hover:scale-105 active:scale-95 transition-transform"
              >
                INSTALAR
              </button>
            )}
            
            {(updateStatus === 'downloading' || updateStatus === 'installing') && (
               <div className="w-full max-w-[120px]">
                 <div className="w-full bg-surface/20 h-2 rounded-full overflow-hidden border border-surface/30">
                   <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: updateStatus === 'installing' ? '100%' : `${downloadProgress}%` }}
                   />
                 </div>
                 <p className="text-[10px] font-black text-right mt-1 opacity-70">
                    {updateStatus === 'installing' ? '100%' : `${downloadProgress}%`}
                 </p>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

export default App;
