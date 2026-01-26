import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
    server: {
        proxy: {
            '/auth': 'http://localhost:4000',
            '/venues': 'http://localhost:4000',
            '/redeem': 'http://localhost:4000',
            '/admin': 'http://localhost:4000',
            '/subscription': 'http://localhost:4000',
            '/health': 'http://localhost:4000',
            '/summary': 'http://localhost:4000',
            '/recent': 'http://localhost:4000',
        },
    },

    base: '/',
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Pulse Club',
                short_name: 'Pulse Club',
                description: 'Members-only discounts at local venues',
                // theme_color: '#000000',
                // background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {src: '/pwa-192.png', sizes: '192x192', type: 'image/png'},
                    {src: '/pwa-512.png', sizes: '512x512', type: 'image/png'},
                ],
            },
        }),
    ],
});
