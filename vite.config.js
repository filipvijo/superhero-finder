import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/search': {
          target: 'https://superheroapi.com',
          changeOrigin: true,
          rewrite: (path) => {
            const query = path.split('?query=')[1];
            if (!query) return path;
            return `/api/${env.VITE_SUPERHERO_API_KEY}/search/${decodeURIComponent(query)}`;
          },
        },
        // Dev-time image proxy to local express server (server.cjs)
        '/api/image-proxy': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/image-proxy/, '/image-proxy'),
        },
      },
    },
  };
});
