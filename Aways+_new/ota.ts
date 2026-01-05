import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { App } from '@capacitor/app';
import pkg from './package.json';

// Helper: Compara versiones semánticas (ej: "0.0.2" > "0.0.1")
const isNewerVersion = (local: string, remote: string) => {
  const v1 = local.split('.').map(Number);
  const v2 = remote.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;
    if (num2 > num1) return true;
    if (num1 > num2) return false;
  }
  return false;
};

export const OtaService = {
  // Solo comprueba si hay nueva versión, NO descarga nada.
  async checkRemoteVersion(): Promise<string | null> {
    try {
      const localVersion = pkg.version;
      const response = await fetch('https://raw.githubusercontent.com/JaviDev-01/Aways-/main/Aways%2B_new/package.json');
      
      if (!response.ok) return null;
      
      const remotePkg = await response.json();
      const remoteVersion = remotePkg.version;
      
      console.log(`[OTA] Local: ${localVersion} | Remote: ${remoteVersion}`);

      if (isNewerVersion(localVersion, remoteVersion)) {
        return remoteVersion;
      }
      return null;
    } catch (err) {
      console.log('[OTA] Check failed', err);
      return null;
    }
  },

  // Descarga e instala
  async download(version: string) {
    try {
      console.log(`[OTA] Starting download for v${version}...`);
      
      // 1. Descargar usando la versión específica
      const result = await CapacitorUpdater.download({
        url: 'https://github.com/JaviDev-01/Aways-/releases/latest/download/update.zip',
        version: version, // Usamos el ID de versión real (ej: "2.5.0")
      });
      
      console.log('[OTA] Download complete. Installing...');
      
      // 2. Instalar (Reload)
      if (result.version) {
        await CapacitorUpdater.set({ id: result.version });
      }
    } catch (err) {
      console.error('[OTA] Error applying update', err);
      throw err;
    }
  }
};
