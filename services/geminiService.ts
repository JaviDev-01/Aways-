

import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlanResponse } from "../types";

// Initialize client with process.env.API_KEY directly as per guidelines
// Fix: Use process.env.API_KEY directly without type assertion
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExamTips = async (subject: string, days: number): Promise<string[]> => {
  // Guidelines suggest assuming the API_KEY is present and valid
  try {
    const prompt = `
      El usuario tiene un examen de "${subject}" en ${days} días.
      Genera una lista de 3 a 5 consejos breves, estratégicos y motivacionales específicamente para estudiar esta materia en este marco de tiempo.
      Devuelve la respuesta en español.
    `;

    // Using gemini-3-flash-preview for Basic Text Tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de consejos de estudio"
            }
          }
        }
      }
    });

    // Access the text property directly (not as a method)
    const jsonText = response.text;
    if (!jsonText) {
      return [
        "Divide el temario en bloques manejables.",
        "Prioriza los temas más difíciles primero.",
        "Asegúrate de descansar bien antes del examen."
      ];
    }

    const parsed: StudyPlanResponse = JSON.parse(jsonText);
    return parsed.tips || [];

  } catch (error) {
    console.error("Error generating study tips:", error);
    return [
      "No pudimos conectar con la IA en este momento.",
      "Asegúrate de descansar bien antes del examen.",
      "Repasa tus notas principales."
    ];
  }
};