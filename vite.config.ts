import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: '/CircuitHarvester/',
    define: {
      // Map GOOGLE_API env var (from GitHub secrets) to process.env.API_KEY
      // This allows the geminiService.ts to use process.env.API_KEY internally
      'process.env.API_KEY': JSON.stringify(env.GOOGLE_API)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});