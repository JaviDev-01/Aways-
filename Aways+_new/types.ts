

export enum Importance {
  LOW = 'BAJA',
  MEDIUM = 'MEDIA',
  HIGH = 'CRÍTICA'
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskSubject {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  importance: Importance;
  subjectId?: string;
  subtasks: SubTask[];
  createdAt: number;
}

export interface DailyArchive {
  date: string;
  tasks: { t: string; c: boolean; s?: string; i: Importance }[];
  successRate: number;
}

export interface WeightCategory {
  id: string;
  name: string;
  weight: number; 
}

export interface GradeEntry {
  id: string;
  name: string;
  score: number;
  categoryId: string; 
  date: string;
}

export interface EvaluationSubject {
  id: string;
  name: string;
  color: string;
  weightCategories: WeightCategory[];
  grades: GradeEntry[];
  isClosed?: boolean;
  recoveryGrade?: number;
  improvementGrade?: number;
  finalManualGrade?: number;
}

export interface Quarter {
  id: string;
  name: string;
  subjects: EvaluationSubject[];
}

export interface StudySession {
  date: string; 
  minutes: number;
  topicId?: string; 
}

export interface SyllabusItem {
  id: string;
  topic: string;
  completed: boolean;
  minutesSpent: number; 
}

// Added to fix the error: Module '"../types"' has no exported member 'StudyPlanResponse'
export interface StudyPlanResponse {
  tips: string[];
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'TIEMPO' | 'RACHA' | 'EXAMENES' | 'ESPECIAL';
  requirement: (stats: any) => boolean;
  color: string;
}

export interface Exam {
  id: string;
  name: string;
  examDate: string;
  studyDurationDays: number;
  color: string; 
  syllabus?: SyllabusItem[];
  priority: Priority;
  manuallyStarted?: boolean;
  studyLog?: StudySession[];
}

export enum FilterType {
  ALL = 'ALL',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface UserLevel {
  title: string;
  minMinutes: number;
}

export type AppTab = 'home' | 'tasks' | 'calendar' | 'evaluations' | 'stats' | 'settings';

export const USER_LEVELS: UserLevel[] = [
  { title: "Cadete", minMinutes: 0 },
  { title: "Estudiante", minMinutes: 60 },
  { title: "Analista", minMinutes: 300 },
  { title: "Estratega", minMinutes: 1000 },
  { title: "Maestro", minMinutes: 3000 },
  { title: "Leyenda Académica", minMinutes: 10000 },
];

export const SUBJECT_COLORS = [
  { name: 'Azul Electrón', value: '#0066FF' },
  { name: 'Rojo Alerta', value: '#FF3B30' },
  { name: 'Verde Éxito', value: '#34C759' },
  { name: 'Naranja Fuego', value: '#FF9500' },
  { name: 'Púrpura Zen', value: '#AF52DE' },
  { name: 'Rosa Neón', value: '#FF2D55' },
  { name: 'Cian Tech', value: '#5AC8FA' },
  { name: 'Negro Vacío', value: '#000000' },
];

// GENERACIÓN DE 50 LOGROS BASE
const generateAchievements = (): Achievement[] => {
  const achievements: Achievement[] = [];

  // 1. TIEMPO (15 LOGROS)
  const timeMilestones = [1, 10, 30, 60, 120, 300, 600, 1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000];
  timeMilestones.forEach((min, idx) => {
    achievements.push({
      id: `time_${min}`,
      title: idx < 5 ? `Iniciación ${idx + 1}` : idx < 10 ? `Concentración Nv.${idx - 4}` : `Inmortalidad Nv.${idx - 9}`,
      description: `Acumula ${min} minutos de estudio total.`,
      icon: 'Clock',
      category: 'TIEMPO',
      color: idx < 5 ? '#5AC8FA' : idx < 10 ? '#0066FF' : '#AF52DE',
      requirement: (stats) => stats.totalMinutes >= min
    });
  });

  // 2. RACHAS (10 LOGROS)
  const streaks = [2, 3, 5, 7, 10, 14, 21, 30, 60, 100];
  streaks.forEach((day, idx) => {
    achievements.push({
      id: `streak_${day}`,
      title: day < 10 ? `Racha de ${day} días` : `Constancia de Hierro`,
      description: `Mantén una racha de estudio de ${day} días seguidos.`,
      icon: 'Flame',
      category: 'RACHA',
      color: '#FF9500',
      requirement: (stats) => stats.currentStreak >= day
    });
  });

  // 3. EXÁMENES (10 LOGROS)
  const examCounts = [1, 3, 5, 10, 15, 20, 30, 50, 75, 100];
  examCounts.forEach((count, idx) => {
    achievements.push({
      id: `exams_${count}`,
      title: count === 1 ? 'Bautismo de Fuego' : `Veterano de ${count} Batallas`,
      description: `Completa satisfactoriamente ${count} exámenes.`,
      icon: 'Target',
      category: 'EXAMENES',
      color: '#34C759',
      requirement: (stats) => stats.completedExams >= count
    });
  });

  // 4. ESPECIALES (15 LOGROS)
  const specials = [
    { id: 'night_1', title: 'Búho Nocturno', desc: 'Estudia después de las 11 PM.', icon: 'Moon' },
    { id: 'early_1', title: 'Madrugador', desc: 'Inicia una sesión antes de las 7 AM.', icon: 'Sun' },
    { id: 'marathon_1', title: 'Ultramaratón', desc: 'Estudia más de 4 horas en un día.', icon: 'Zap', req: (s: any) => s.maxMinutesInADay >= 240 },
    { id: 'weekend_1', title: 'Guerrero de Finde', desc: 'Estudia un sábado y domingo seguidos.', icon: 'Calendar' },
    { id: 'focus_1', title: 'Enfoque Profundo', desc: 'Completa 5 pomodoros seguidos sin parar.', icon: 'Brain' },
    { id: 'planner_1', title: 'Gran Arquitecto', desc: 'Ten 10 misiones activas simultáneamente.', icon: 'LayoutGrid', req: (s: any) => s.activeExams >= 10 },
    { id: 'priority_1', title: 'Bajo Presión', desc: 'Completa un examen de Prioridad Alta.', icon: 'ShieldAlert' },
    { id: 'variety_1', title: 'Polímata', desc: 'Ten exámenes de 5 colores diferentes.', icon: 'Palette' },
    { id: 'syllabus_1', title: 'Detallista', desc: 'Crea un examen con más de 15 temas.', icon: 'ListChecks' },
    { id: 'speed_1', title: 'Relámpago', desc: 'Termina un examen en menos de 3 días de plan.', icon: 'Zap' },
    { id: 'long_1', title: 'Largo Alcance', desc: 'Planifica un examen con 60 días de antelación.', icon: 'Compass' },
    { id: 'clean_1', title: 'Orden Absoluto', desc: 'Borra 5 exámenes completados.', icon: 'Trash2' },
    { id: 'social_1', title: 'Embajador', desc: 'Exporta tus datos por primera vez.', icon: 'Share2' },
    { id: 'perfect_1', title: 'Perfeccionista', desc: 'Completa todos los temas de un examen.', icon: 'CheckCircle2' },
    { id: 'survivor_1', title: 'Superviviente', desc: 'Estudia el día antes de un examen de Prioridad Alta.', icon: 'LifeBuoy' },
  ];

  specials.forEach(s => {
    achievements.push({
      id: s.id,
      title: s.title,
      description: s.desc,
      icon: s.icon,
      category: 'ESPECIAL',
      color: '#FF2D55',
      requirement: s.req || ((stats) => stats[s.id] || false)
    });
  });

  return achievements;
};

export const ALL_ACHIEVEMENTS = generateAchievements();