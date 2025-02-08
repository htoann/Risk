import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components/': path.resolve(__dirname, 'src/components/'),
      '@container/': path.resolve(__dirname, 'src/container/'),
      '@context/': path.resolve(__dirname, 'src/context/'),
      '@layout/': path.resolve(__dirname, 'src/layout/'),
      '@service/': path.resolve(__dirname, 'src/service/'),
      '@i18n/': path.resolve(__dirname, 'src/i18n/'),
      '@pages/': path.resolve(__dirname, 'src/pages/'),
      '@routes/': path.resolve(__dirname, 'src/routes/'),
      '@static/': path.resolve(__dirname, 'src/static/'),
      '@utils/': path.resolve(__dirname, 'src/utils/'),
    },
  },
  plugins: [react()],
  server: {
    port: 3000,
  },
});
