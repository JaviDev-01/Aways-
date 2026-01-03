import { LocalNotifications } from "@capacitor/local-notifications";
import { Exam } from "../types";

export const NotificationService = {
  async requestPermissions() {
    try {
      const perm = await LocalNotifications.requestPermissions();
      return perm.display === "granted";
    } catch (e) {
      console.error("Error requesting notification permissions", e);
      return false;
    }
  },

  async scheduleExamNotifications(exams: Exam[]) {
    try {
      // Clean up old pending notifications to avoid duplicates/stale data
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications,
        });
      }

      const notifications: any[] = [];
      let idCounter = 1;
      const now = new Date();

      exams.forEach((exam) => {
        const examDate = new Date(exam.examDate);
        if (isNaN(examDate.getTime())) return;

        // 1. Exam Day Notification (8:00 AM)
        const examDayMorning = new Date(examDate);
        examDayMorning.setHours(8, 0, 0, 0);

        if (examDayMorning > now) {
          notifications.push({
            id: idCounter++,
            title: "¡Día del Examen! 🎯",
            body: `Hoy es el examen de ${exam.name}. ¡Mucha suerte, lo vas a bordar!`,
            schedule: { at: examDayMorning },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: null,
          });
        }

        // 2. Daily Reminders (leading up to exam)
        // "que cada día me diga que cosas tengo que estudiar" -> We'll verify remaining topics
        const pendingTopics =
          exam.syllabus?.filter((t) => !t.completed).length || 0;
        const totalTopics = exam.syllabus?.length || 0;

        if (exam.studyDurationDays > 0) {
          for (let i = 1; i <= exam.studyDurationDays; i++) {
            // Calculate date: ExamDate - i days
            const studyDate = new Date(examDate);
            studyDate.setDate(examDate.getDate() - i);
            studyDate.setHours(17, 0, 0, 0); // 5:00 PM study reminder

            if (studyDate > now) {
              const daysLeft = i;
              let bodyText = `Faltan ${daysLeft} días para ${exam.name}.`;
              if (pendingTopics > 0) {
                bodyText += ` Te quedan ${pendingTopics} temas por repasar.`;
              } else {
                bodyText += ` ¡Sigue repasando para asegurar el 10!`;
              }

              notifications.push({
                id: idCounter++,
                title: "Hora de Estudiar 📚",
                body: bodyText,
                schedule: { at: studyDate },
                sound: undefined,
                attachments: undefined,
                actionTypeId: "",
                extra: null,
              });
            }
          }
        }
      });

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(
          `[NotificationService] Scheduled ${notifications.length} notifications`
        );
      }
    } catch (e) {
      console.error("[NotificationService] Error scheduling notifications", e);
    }
  },
};
