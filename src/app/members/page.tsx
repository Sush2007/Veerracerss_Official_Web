import type { Metadata } from 'next';
import { MembersView } from './MembersView';

export const metadata: Metadata = {
  title: 'The Racing Squad & Engineering Team Roster | VeerRacerss Electric',
  description: 'Explore the 200+ student engineers, department heads, and faculty advisors powering VeerRacerss Electric at VSSUT Burla. Discover our councils across 2024, 2025, and 2026.',
  keywords: [
    'VeerRacerss Team Members',
    'VSSUT Formula Student roster',
    'Formula Student team captain VSSUT',
    'VeerRacerss engineering leads',
    'EV racing team members Odisha',
    'VSSUT automotive club members',
    'Formula Bharat team roster'
  ],
  alternates: {
    canonical: 'https://veerracerss-official-web.vercel.app/members',
  },
  openGraph: {
    title: 'The Racing Squad & Team Roster | VeerRacerss Electric VSSUT',
    description: 'Meet the 200+ engineers, drivers, and faculty advisors powering Odisha\'s premier Formula Student EV.',
    url: 'https://veerracerss-official-web.vercel.app/members',
    images: [{ url: 'https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=2070&auto=format&fit=crop', width: 1200, height: 630, alt: 'VeerRacerss Team' }]
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
            "name": "Team Roster",
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
