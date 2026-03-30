import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'soto-webp-converter.zip'],
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024 // 50 MB
      },
      manifest: {
        name: 'Soto Converter',
        short_name: 'SotoConv',
        description: 'Image Converter Offline Tercepat Pilihan Bangsa',
        theme_color: '#3b82f6',
        background_color: '#f0fdf4',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-berjuang.ghasali.id/wp-content/uploads/2026/03/sotoconvert_Soto-Converter-Logo.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'https://cdn-berjuang.ghasali.id/wp-content/uploads/2026/03/sotoconvert_Soto-Converter-Logo.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      }
    })
  ],
});
