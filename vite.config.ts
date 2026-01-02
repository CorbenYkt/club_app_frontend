import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {VitePWA} from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Pulse Club',
                short_name: 'Pulse Club',
                description: 'Members-only discounts for coffee, food & drinks',
                theme_color: '#000000',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {src: '/pwa-192.png', sizes: '192x192', type: 'image/png'},
                    {src: '/pwa-512.png', sizes: '512x512', type: 'image/png'},
                ],
            },
        }),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://api.pulseclub.co.nz',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
