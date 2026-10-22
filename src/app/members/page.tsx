import type { Metadata } from 'next';
import { MembersView } from './MembersView';

export const metadata: Metadata = {
  title: 'The Racing Squad & Council Leadership | VeerRacerss Electric',
  description: 'Explore the official student council, department heads, and faculty advisors powering VeerRacerss Electric at VSSUT Burla.',
  keywords: [
    'VeerRacerss Team Members',
    'VSSUT Formula Student council',
    'Formula Student team captain VSSUT',
    'VeerRacerss engineering leads',
    'EV racing team members Odisha',
    'VSSUT automotive club members'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://veerracerss-official-web.vercel.app/members',
  },
  openGraph: {
    title: 'The Racing Squad & Council Leadership | VeerRacerss Electric VSSUT',
    description: 'Meet the official student council, executive heads, and faculty advisors powering Odisha\'s premier Formula Student EV.',
    url: 'https://veerracerss-official-web.vercel.app/members',
    images: [{ url: 'https://veerracerss-official-web.vercel.app/og-image.png', width: 1200, height: 630, alt: 'VeerRacerss Team' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Racing Squad & Council Leadership | VeerRacerss Electric VSSUT',
    description: 'Meet the official student council, executive heads, and faculty advisors powering Odisha\'s premier Formula Student EV.',
    images: ['https://veerracerss-official-web.vercel.app/og-image.png'],
  }
};

export default function MembersPage() {
  const membersSchema = {
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
            "name": "Team Leadership",
            "item": "https://veerracerss-official-web.vercel.app/members"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(membersSchema) }}
      />
      <MembersView />
    </>
  );
}
