import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aura Archives',
    short_name: 'Aura',
    description: 'Timeless jewelry and clothing',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf9f9',
    theme_color: '#000000',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
