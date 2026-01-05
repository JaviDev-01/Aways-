import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { App } from "@capacitor/app";

export const OtaService = {
  async checkForUpdates(): Promise<boolean> {
    try {
      // Intentamos descargar la versión 'latest'
      const result = await CapacitorUpdater.download({
        url: "https://github.com/JaviDev-01/Aways-/releases/latest/download/update.zip",
        version: "latest", // Sobreescribimos siempre la versión 'latest' local
      });

      // Si la descarga es exitosa, devolvemos true
      return !!result.version;
    } catch (err) {
      console.log("No update available or checking failed", err);
      return false;
    }
  },

  async applyUpdate() {
    try {
      await CapacitorUpdater.set({ id: "latest" });
      // El reload ocurre automáticamente o podemos forzarlo si es necesario,
      // pero .set() usualmente recarga la app.
    } catch (err) {
      console.error("Error applying update", err);
    }
  },
};
