import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NiaTma',
    short_name: 'NiaTma',
    description: 'Telegram Mini App playground with browser application diagnostics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#17212b',
    theme_color: '#17212b',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}