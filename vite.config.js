import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      // Bootstrap 3 relies on the old Less math behaviour
      less: { math: 'always' }
    }
  }
});
