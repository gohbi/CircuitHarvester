import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: '/CircuitHarvester/',
    define: {
      // Safely expose the GOOGLE_API from build environment to the code
      'process.env.API_KEY': JSON.stringify(env.GOOGLE_API)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});