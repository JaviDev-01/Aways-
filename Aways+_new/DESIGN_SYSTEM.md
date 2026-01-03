# 🎨 Neo-Brutalism Gamified: Global Design System

**Propósito:** Guía de estilos universal para aplicar la estética de "Aways+" a cualquier nueva aplicación.
**Concepto:** "Juguete Industrial". Una interfaz que se siente sólida y cruda como una herramienta, pero divertida y táctil como un videojuego.

---

## 1. Los 3 Mandamientos Visuales

Si vas a aplicar este estilo a otra app, debes respetar estas tres reglas de oro:

1.  **Sin Suavidad (No Blur):** Las sombras y bordes deben ser sólidos. Si usas _blur_, rompes la estética.
2.  **Bordes como Estructura:** Todo elemento interactivo o contenedor tiene un borde negro de al menos 2px. El borde define el límite físico del objeto.
3.  **Honestidad Digital:** No intentamos imitar cristal (glassmorphism) ni papel (material). Los botones parecen botones físicos de una máquina arcade.

---

## 2. Reglas de Construcción (The Blueprint)

### A. Bordes y Contornos

- **Grosor Base:** `2px solid #000000` (Modo Luz) o `#FFFFFF` (Modo Oscuro).
- **Bordes Decorativos:** Para elementos destacados (tarjetas "Hero"), subir a `3px` o `4px`.
- **Radio (Radius):**
  - _Botones:_ `8px` a `12px` (ligeramente redondeados, pero sólidos).
  - _Modales/Tarjetas:_ `16px` (amigables pero robustos).
  - _Inputs:_ `0px` o `4px` (más cuadrados para denotar "datos").

### B. Sombras Duras (The Hard Shadow)

La firma del estilo. Crea la ilusión de que la interfaz son capas de cartón recortado.

- **Sombra Estándar:** `box-shadow: 4px 4px 0px 0px currentColor`.
- **Sombra Hover:** `box-shadow: 6px 6px 0px 0px currentColor`.
- **Sombra Active (Click):** `box-shadow: 0px 0px 0px 0px` + `transform: translate(4px, 4px)`.
  - _Efecto:_ El botón se "hunde" físicamente en la pantalla.

---

## 3. Sistema de Color (High Voltage)

No uses colores pasteles ni degradados sutiles. Usa colores "puros" y saturados.

### La Tríada Base

1.  **Canvas (Fondo):** Blanco Absoluto (`#FFF`) o Negro Absoluto (`#111`). Nada de grises medios de fondo.
2.  **Estructura (Tinta):** Contraste máximo. Negro sobre blanco / Blanco sobre negro.
3.  **Acento (Energía):** Un color principal hiper-saturado (Neon Blue, Acid Green) que guía la acción principal.

### Uso Funcional del Color

- **No decores, codifica:** Si algo es rojo, es peligroso o urgente. Si es verde, es éxito.
- **Fondos Tenues:** Para jerarquía secundaria, usa el color de acento al 10-15% de opacidad (`bg-primary/10`), pero mantén el borde sólido al 100%.

---

## 4. Tipografía "Loud & Clear"

El texto no se lee, se escanea.

- **Títulos (Display):** Sans-Serif, Negrita (Bold/Black), Tracking apretado (`-0.02em`).
  - _Uso:_ Títulos de sección que parecen gritar o anunciar algo.
- **Cuerpo (Body):** Sans-Serif geométrica (ej. Inter, DM Sans) con alto peso (Medium/SemiBold).
  - _Regla:_ Evita los pesos "Light". La delgadez no encaja con la robustez del neo-brutalismo.
- **Datos (Mono):** Para números, fechas o códigos, usa fuentes Monospaced. Refuerza la sensación de "herramienta tecnológica".

---

## 5. Principios de Animación (Motion Physics)

Las cosas no aparecen ni se desvanecen (fade); se mueven y rebotan.

- **Snappy (Rápido):** Las transiciones deben durar entre 0.2s y 0.3s. Nada lento.
- **Spring (Resorte):** Al abrir un modal o agrandar un elemento, usa curvas de resorte (`type: "spring", stiffness: 300, damping: 20`). Debe sentirse que tiene masa y rebota ligeramente al detenerse.
- **Stagger (Cascada):** Si muestras una lista, anima los elementos uno por uno con un retraso de 0.05s entre ellos. Da sensación de orden y progresión.

---

## 6. Layout y Espaciado

- **Densidad:** "Cozy". No tengas miedo a los espacios en blanco, pero delimítalos siempre con bordes o contenedores.
- **Grid Visible:** A veces, mostrar las líneas de la retícula (grid) como bordes tenues ayuda a reforzar la estética técnica.
- **Márgenes:** Generosos en los contenedores principales (`p-6` o `p-8`), compactos dentro de las tarjetas.

---

## Resumen para Desarrolladores (Cheat Sheet)

Si vas a maquetar esto en CSS/Tailwind:

1.  **Bordes:** `border-2 border-black`
2.  **Sombra:** `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
3.  **Click:** `active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`
4.  **Colores:** Saturación > 80%.
5.  **Fuente:** `font-bold` o `font-black` para casi todo.
