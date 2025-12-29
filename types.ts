
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

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface UserLevel {
  title: string;
  minMinutes: number;
}

export interface StudyPlanResponse {
  tips: string[];
}

// NUEVAS INTERFACES PARA EVALUACIONES
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

export type AppTab = 'home' | 'tasks' | 'calendar' | 'stats' | 'settings' | 'evaluations';

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

const generateAchievements = (): Achievement[] => {
  const achievements: Achievement[] = [];
  const timeMilestones = [1, 10, 30, 60, 120, 300, 600, 1000, 2000, 3000, 5000, 7000, 10000];
  timeMilestones.forEach((min, idx) => {
    achievements.push({
      id: `time_${min}`,
      title: `Enfoque Nv.${idx + 1}`,
      description: `Acumula ${min} minutos de estudio.`,
      icon: 'Clock',
      category: 'TIEMPO',
      color: '#5AC8FA',
      requirement: (stats) => (stats.totalMinutes || 0) >= min
    });
  });
  return achievements;
};

export const ALL_ACHIEVEMENTS = generateAchievements();
