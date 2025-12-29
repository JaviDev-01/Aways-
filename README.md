<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Aways+ Banner" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin-bottom: 30px;" />

# 🚀 Aways+ (Aways Plus)

**La evolución del estudio: gamificación, organización y alto rendimiento.**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?style=for-the-badge)](https://semver.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&style=for-the-badge&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&style=for-the-badge&logoColor=white)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF?logo=capacitor&style=for-the-badge&logoColor=white)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <a href="#-visión-del-proyecto">Visión</a> •
  <a href="#-características-y-mecánicas">Mecánicas</a> •
  <a href="#-arquitectura-del-proyecto">Arquitectura</a> •
  <a href="#-instalación-y-despliegue">Instalación</a> •
  <a href="#-roadmap--futuro">Roadmap</a>
</p>
</div>

---

## 🎯 Visión del Proyecto

**Aways+** nace de una idea simple pero poderosa:

> **Estudiar puede ser aburrido, pero subir de nivel es adictivo.**

No es solo una app de exámenes o un calendario académico.  
Es un **Sistema de Gestión de Aprendizaje Gamificado (GLMS)** que utiliza principios de **psicología conductual**, **refuerzo positivo** y **feedback inmediato** para convertir el estudio en una experiencia motivadora.

Cada minuto estudiado se transforma en **XP**, niveles, rachas y logros.  
Todo bajo una estética **Neo-Brutalista**, enfocada en claridad, velocidad y alto impacto visual.

---

## ⚡ Características y Mecánicas

### 🧬 El Algoritmo del Éxito (Sistema de Progresión)

Aways+ implementa un sistema de niveles basado en minutos reales de estudio:

| Nivel | Título      | Requisito (minutos totales) | Descripción                             |
|------:|-------------|-----------------------------|-----------------------------------------|
| 1     | Cadete      | 0                           | El inicio del viaje.                    |
| 2     | Estudiante  | 60                          | Tu primera hora real.                   |
| 3     | Analista    | 300                         | La constancia empieza a notarse.        |
| 4     | Estratega   | 1.000                       | Dominas la planificación.               |
| 5     | Maestro     | 3.000                       | Control total de tus hábitos.           |
| 6     | **LEYENDA** | 10.000                      | La excelencia es tu estándar.           |

---

### 🏆 Sistema de Logros Dinámico

Más de **50 logros únicos**, divididos en categorías:

- ⏳ **Tiempo** — Horas acumuladas de estudio.
- 🔥 **Rachas** — Consistencia diaria (streak system).
- 🎯 **Exámenes** — Supervivencia académica.
- 🌟 **Especiales** — Logros ocultos  
  _(ej: “Búho Nocturno” por estudiar a las 3:00 AM)_.

---

### 🧠 Modo Foco Inmersivo

Un entorno diseñado para el **deep work**:

- ⏱️ **Pomodoro personalizable**.
- 📚 **Seguimiento por temas** del syllabus.
- 📊 **Feedback visual en tiempo real**.
- 🎨 Animaciones sutiles que refuerzan progreso y concentración.

---

## 🏛️ Arquitectura del Proyecto

Arquitectura modular basada en **Componentes + Servicios**, priorizando:

- Escalabilidad
- Separación de responsabilidades
- Mantenibilidad a largo plazo

```mermaid
graph TD
    A[App.tsx] --> B[Router / Navigation]
    B --> C[HomeView]
    B --> D[CalendarView]
    B --> E[StatsView]
    B --> F[SettingsView]

    C --> G[ExamCard]
    C --> H[StudySessionModal]

    subgraph Services Layer
        I[StorageService]
        J[NotificationService]
        K[GeminiService]
    end

    A -.-> I
    G -.-> J
    H -.-> I
    I --> L[(Local Storage)]
    J --> M((System Notifications))
````
## 📂 Estructura de Directorios


```
/src
├── components/
├── services/
│ ├── storageService.ts
│ ├── notificationService.ts
│ └── geminiService.ts
├── types.ts
├── App.tsx
└── main.tsx
/android
```


## 🛠️ Instalación y Despliegue


### Requisitos


- Node.js v18+
- Java JDK 17
- Android Studio (opcional)


### Instalación


```bash
git clone https://github.com/tu-usuario/aways-plus.git
cd aways-plus
npm install
```


### Desarrollo


```bash
npm run dev
```


### Build Android


```bash
npm run build
npx cap sync
cd android
./gradlew assembleDebug
```


## 🗺️ Roadmap & Futuro


- ☁️ Sincronización en la nube
- 🧑‍🤝‍🧑 Multijugador y rankings
- 🤖 IA Tutor (Google Gemini)
- 📱 Widgets Android
- 🌙 Temas dinámicos


## 🤝 Contribución


1. Fork del proyecto
2. Crear rama: `feature/NuevaFeature`
3. Hacer commit
4. Push
5. Abrir Pull Request


<div align="center">
<p>Construido con pasión, código y mucha cafeína ☕</p>
<p>© 2025 — Aways+ Project</p>
</div>
