
import { Exam, StudySession, SyllabusItem } from '../types';

const EXAM_KEY_MAP: Record<string, string> = {
  id: 'i',
  name: 'n',
  examDate: 'e',
  studyDurationDays: 'd',
  color: 'c',
  notes: 't',
  syllabus: 's',
  manuallyStarted: 'm',
  studyLog: 'l'
};

const SESSION_KEY_MAP: Record<string, string> = {
  date: 'd',
  minutes: 'm',
  topicId: 't'
};

const SYLLABUS_KEY_MAP: Record<string, string> = {
  id: 'i',
  topic: 't',
  completed: 'c',
  minutesSpent: 'p'
};

const REVERSE_EXAM_MAP = Object.entries(EXAM_KEY_MAP).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {} as Record<string, string>);
const REVERSE_SESSION_MAP = Object.entries(SESSION_KEY_MAP).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {} as Record<string, string>);
const REVERSE_SYLLABUS_MAP = Object.entries(SYLLABUS_KEY_MAP).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {} as Record<string, string>);

const minifyObject = (obj: any, map: Record<string, string>): any => {
  const newObj: any = {};
  for (const key in obj) {
    if (map[key]) {
      newObj[map[key]] = obj[key];
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

const inflateObject = (obj: any, map: Record<string, string>): any => {
  const newObj: any = {};
  for (const key in obj) {
    if (map[key]) {
      newObj[map[key]] = obj[key];
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export const StorageService = {
  saveUserData: (username: string, exams: Exam[]) => {
    try {
      const minifiedExams = exams.map(exam => {
        const minifiedLog = exam.studyLog?.map(log => minifyObject(log, SESSION_KEY_MAP));
        const minifiedSyllabus = exam.syllabus?.map(item => minifyObject(item, SYLLABUS_KEY_MAP));
        
        const examToSave = { 
          ...exam, 
          studyLog: minifiedLog,
          syllabus: minifiedSyllabus
        };
        return minifyObject(examToSave, EXAM_KEY_MAP);
      });
      localStorage.setItem(`aways_data_${username}`, JSON.stringify(minifiedExams));
    } catch (e) {
      console.error("Error saving data", e);
    }
  },

  loadUserData: (username: string): Exam[] => {
    try {
      const data = localStorage.getItem(`aways_data_${username}`);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((minifiedExam: any) => {
        const inflatedExam = inflateObject(minifiedExam, REVERSE_EXAM_MAP);
        if (inflatedExam.studyLog && Array.isArray(inflatedExam.studyLog)) {
          inflatedExam.studyLog = inflatedExam.studyLog.map((l: any) => inflateObject(l, REVERSE_SESSION_MAP));
        } else inflatedExam.studyLog = [];
        if (inflatedExam.syllabus && Array.isArray(inflatedExam.syllabus)) {
          inflatedExam.syllabus = inflatedExam.syllabus.map((s: any) => inflateObject(s, REVERSE_SYLLABUS_MAP));
        } else inflatedExam.syllabus = [];
        return inflatedExam as Exam;
      });
    } catch (e) {
      console.error("Error loading data", e);
      return [];
    }
  },

  exportData: (username: string): string | null => {
      const data = localStorage.getItem(`aways_data_${username}`);
      if (!data) return null;
      return JSON.stringify({
          version: 1,
          user: username,
          timestamp: new Date().toISOString(),
          data: JSON.parse(data)
      }, null, 2);
  },

  importData: (username: string, jsonString: string): boolean => {
      try {
          const payload = JSON.parse(jsonString);
          if (!payload.data || !Array.isArray(payload.data)) throw new Error("Invalid format");
          localStorage.setItem(`aways_data_${username}`, JSON.stringify(payload.data));
          return true;
      } catch (e) {
          console.error("Import error", e);
          return false;
      }
  },

  deleteUserData: (username: string) => {
    localStorage.removeItem(`aways_data_${username}`);
    localStorage.removeItem('aways_current_user');
  },

  setCurrentUser: (username: string) => localStorage.setItem('aways_current_user', username),
  getCurrentUser: () => localStorage.getItem('aways_current_user'),
  logout: () => localStorage.removeItem('aways_current_user')
};
