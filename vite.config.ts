import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely expose the API_KEY from build environment to the code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx']
    }
  };
});