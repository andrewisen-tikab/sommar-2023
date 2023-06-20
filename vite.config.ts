import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [splitVendorChunkPlugin(), react(), VitePWA({ registerType: 'autoUpdate' })],
});
