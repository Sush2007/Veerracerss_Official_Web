import type { Metadata } from 'next';
import { CarsView } from './CarsView';
import { CARS_DATA } from '@/src/data/cars';

export const metadata: Metadata = {
  title: 'Formula Student Race Cars & Fleet | AETHER, ZEUS, VENTUS',
  description: 'Explore the electric and combustion formula race cars designed, engineered, and fabricated by VeerRacerss at VSSUT Burla. Specifications of AETHER (10 kW PMSM, 72V Li-ion, 115 km/h) and our racing heritage.',
  keywords: [
    'AETHER electric race car',
    'Formula Student EV specifications',
    'VSSUT electric car',
    'ZEUS 1.0 Formula Student',
    'VENTUS race cars',
    'Formula Bharat EV cars',
    '10kW PMSM motor race car',
    '72V battery pack EV racing',
    'Student formula car engineering Odisha'
  ],
  alternates: {
    canonical: 'https://veerracerss-official-web.vercel.app/cars',
  },
  openGraph: {
    title: 'Formula Student Race Cars & Fleet | VeerRacerss Electric',
    description: 'Explore AETHER and our historical Formula Student racing fleet engineered at VSSUT Burla, Odisha.',
    url: 'https://veerracerss-official-web.vercel.app/cars',
    images: [{ url: 'https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=2070&auto=format&fit=crop', width: 1200, height: 630, alt: 'VeerRacerss Fleet' }]
  }
};

export default function CarsPage() {
  const carsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://veerracerss-official-web.vercel.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "The Fleet & Cars",
            "item": "https://veerracerss-official-web.vercel.app/cars"
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "VeerRacerss Electric Formula Student Vehicles",
        "itemListElement": CARS_DATA.map((car, index) => ({
          "@type": "Vehicle",
          "position": index + 1,
          "name": `VeerRacerss ${car.name}`,
          "model": `${car.name} (${car.year})`,
          "speed": car.stats.speed,
          "accelerationTime": car.stats.accel,
          "weight": car.stats.weight,
          "description": car.description
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carsSchema) }}
      />
      <CarsView />
    </>
  );
}
