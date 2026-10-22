import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VeerRacerss Electric | Formula Student VSSUT Burla',
    short_name: 'VeerRacerss',
    description: "Official portal of VeerRacerss Electric, Odisha's premier Formula Student electric racing team from VSSUT Burla.",
    start_url: '/',
    display: 'standalone',
    background_color: '#070709',
    theme_color: '#E10600',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  };
}
