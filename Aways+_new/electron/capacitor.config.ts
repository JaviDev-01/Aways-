import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.Aways.com',
  appName: 'Aways+',
  webDir: 'dist', // <--- Comma added here
  plugins: {
    CapacitorUpdater: {
      autoUpdate: false
    }
  }
};

export default config;
