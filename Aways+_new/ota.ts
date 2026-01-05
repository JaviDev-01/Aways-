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
  async checkForUpdates(): Promise<boolean> {
    try {
      // 1. Obtener versión local del bundle JS (no la nativa)
      const localVersion = pkg.version;
      
      // 2. Obtener versión remota desde GitHub
      const response = await fetch('https://raw.githubusercontent.com/JaviDev-01/Aways-/main/package.json');
      if (!response.ok) {
        console.warn('Failed to fetch remote version info');
        return false;
      }
      const remotePkg = await response.json();
      const remoteVersion = remotePkg.version;

      console.log(`[OTA] Local: ${localVersion} | Remote: ${remoteVersion}`);

      // 3. Comparar
      if (isNewerVersion(localVersion, remoteVersion)) {
        console.log('[OTA] Update found! Downloading...');
        
        // Descargamos usando siempre el tag 'latest' para simplificar,
        // pero solo cuando sabemos que hay una versión superior.
        const result = await CapacitorUpdater.download({
          url: 'https://github.com/JaviDev-01/Aways-/releases/latest/download/update.zip',
          version: 'latest', 
        });

        return !!result.version;
      }

      console.log('[OTA] App is up to date.');
      return false;

    } catch (err) {
      console.log('[OTA] No update available or check failed', err);
      return false;
    }
  },

  async applyUpdate() {
    try {
      await CapacitorUpdater.set({ id: 'latest' });
    } catch (err) {
      console.error('[OTA] Error applying update', err);
    }
  }
};
