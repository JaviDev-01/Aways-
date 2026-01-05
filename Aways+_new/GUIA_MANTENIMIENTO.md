# 📘 Guía de Mantenimiento y Actualizaciones OTA (Aways+)

Esta guía detalla cómo generar la **APK Base** y cómo lanzar **Actualizaciones Automáticas (OTA)** sin necesidad de que el usuario reinstale la app.

---

## 🚀 1. Flujo de Actualizaciones Automáticas (OTA)

El sistema está configurado para que **cualquier cambio en el código** que subas a GitHub se convierta automáticamente en una actualización para los usuarios.

### Pasos para lanzar una actualización:

1.  **Haz tus cambios** en el código (HTML, CSS, JS, componentes React, etc.).
2.  **Sube los cambios** a la rama `main` de GitHub:
    ```bash
    git add .
    git commit -m "Descripción de la mejora: Nuevo modo oscuro y corrección de bugs"
    git push origin main
    ```
3.  **¡Listo!**
    - GitHub Actions compilará tu proyecto automáticamente.
    - Generará un archivo `update.zip` y lo subirá a la "Release" llamada `latest`.
    - Cuando los usuarios abran la app, verán el aviso "Actualización disponible" y podrán instalarla al instante.

---

## 🏗️ 2. Generar la APK Base (Primera Vez o Cambios Nativos)

Solo necesitas generar una nueva APK (`.apk`) e instalarla manualmente si:

- Es la primera vez que instalas la app.
- Has añadido **nuevas librerías nativas** (plugins de Capacitor que tocan hardware, como Cámara, Geolocalización, etc.).
- Has cambiado el icono o el nombre de la app.

### Cómo generar la APK Firmada (Release):

El proyecto ya tiene la firma configurada (`release-key.jks` en `android/app`).

**Opción A: Usando Android Studio (Recomendado)**

1.  Abre la carpeta `android` en Android Studio (`npx cap open android`).
2.  Ve al menú **Build** -> **Generate Signed Bundle / APK**.
3.  Selecciona **APK**.
4.  Elige la configuración `release` (la contraseña ya está en el archivo `build.gradle`, así que debería ser automático o puedes usar `awaysplus123` si te la pide).
5.  La APK se guardará en `android/app/release/app-release.apk`.

**Opción B: Desde Terminal (Rápido)**
Si tienes Java configurado:

```powershell
cd android
./gradlew assembleRelease
```

La APK estará en `android/app/build/outputs/apk/release/app-release.apk`.

---

## ⚠️ Solución de Problemas Comunes

### La app no detecta la actualización

- Asegúrate de haber hecho el `git push origin main`.
- Comprueba en la pestaña **Actions** de tu repositorio en GitHub si el proceso "OTA Update" ha terminado en verde (✅).
- Verifica que la versión en `ota.ts` apunta correctamente a:
  `https://github.com/JaviDev-01/Aways-/releases/latest/download/update.zip`

### Error al sincronizar plugins (`npx cap sync`)

Si añades plugins nuevos y da error:

1.  Borra la carpeta `android`.
2.  Ejecuta `npx cap add android`.
3.  Ejecuta `npx cap sync`.
4.  (Nota: Tendrás que volver a copiar el archivo `release-key.jks` dentro de `android/app` si borras la carpeta).

---

**Resumen:**

- **Código (React/TS/CSS):** `git push` -> Se actualiza sola.
- **Plugins/Nativo:** Generar APK nueva en Android Studio.
