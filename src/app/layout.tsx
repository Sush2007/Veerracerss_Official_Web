import type { Metadata } from 'next';
import { Layout } from '../components/Layout';
import './globals.css';
import { SEO_KEYWORDS, FAQ_AEO_ITEMS, GEO_COORDINATES } from '@/src/data/seo_data';

export const metadata: Metadata = {
  metadataBase: new URL('https://veerracerss-official-web.vercel.app'),
  title: {
    default: 'VeerRacerss Electric | Formula Student Team VSSUT Burla | EV Racing India',
    template: '%s | VeerRacerss Electric'
  },
  description: 'Official Formula Student electric racing team of VSSUT Burla, Odisha. Designers and fabricators of AETHER, Odisha\'s first collegiate electric formula race car competing in Formula Bharat and Formula Imperial.',
  keywords: SEO_KEYWORDS,
  authors: [{ name: 'Team VeerRacerss Electric', url: 'https://veerracerss-official-web.vercel.app' }],
  creator: 'VeerRacerss Electric Engineering Team',
  publisher: 'Veer Surendra Sai University of Technology (VSSUT), Burla',
  category: 'Motorsport & Electric Vehicle Engineering',
  applicationName: 'VeerRacerss Electric Official Portal',
  generator: 'Next.js',
  alternates: {
    canonical: 'https://veerracerss-official-web.vercel.app',
    languages: {
      'en-IN': 'https://veerracerss-official-web.vercel.app',
      'en-US': 'https://veerracerss-official-web.vercel.app',
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://veerracerss-official-web.vercel.app',
    title: 'VeerRacerss Electric | VSSUT Formula Student Team | EV Racing India',
    description: 'Official Formula Student team of VSSUT, Burla. Builders of AETHER - the first EV built by an engineering college in Odisha. Formula Bharat & Formula Imperial contenders.',
    siteName: 'VeerRacerss Electric',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=2070&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'VeerRacerss Electric Formula Student Car AETHER',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VeerRacerss Electric | Formula Student Team VSSUT Burla',
    description: 'Official Formula Student team of VSSUT Burla. Builders of AETHER - Odisha\'s first collegiate electric formula race car.',
    images: ['https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=2070&auto=format&fit=crop'],
    site: '@veerracerss',
    creator: '@veerracerss',
  },
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
  verification: {
    google: '4utN8IareDBUNPzl05SNbzh5iO6zjeeo1AOwMth2vhs',
  },
  other: {
    'geo.region': GEO_COORDINATES.region,
    'geo.placename': GEO_COORDINATES.placename,
    'geo.position': `${GEO_COORDINATES.latitude};${GEO_COORDINATES.longitude}`,
    'ICBM': `${GEO_COORDINATES.latitude}, ${GEO_COORDINATES.longitude}`,
    'revisit-after': '3 days',
    'rating': 'General',
    'distribution': 'Global',
    'classification': 'Formula Student, Electric Vehicle, Motorsport Engineering, Collegiate Racing'
  }
};

// Comprehensive Schema.org Graph for SEO, GEO, and AEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsTeam",
      "@id": "https://veerracerss-official-web.vercel.app/#team",
      "name": "VeerRacerss Electric",
      "alternateName": ["VRE", "VeerRacerss", "Team VeerRacerss", "VSSUT Formula Student Team"],
      "sport": "Formula Student Electric Racing",
      "url": "https://veerracerss-official-web.vercel.app",
      "logo": "https://veerracerss-official-web.vercel.app/VRE%20Logo.png",
      "foundingDate": "2018",
      "description": "VeerRacerss Electric is the official Formula Student electric racing team of Veer Surendra Sai University of Technology (VSSUT), Burla, Odisha. Engineers and builders of AETHER, Odisha's first electric formula race car.",
      "memberOf": {
        "@type": "CollegeOrUniversity",
        "@id": "https://veerracerss-official-web.vercel.app/#vssut",
        "name": "Veer Surendra Sai University of Technology (VSSUT)",
        "alternateName": "VSSUT Burla",
        "url": "https://www.vssut.ac.in",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Veer Surendra Sai University of Technology",
          "addressLocality": "Burla",
          "addressRegion": "Odisha",
          "postalCode": "768018",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": GEO_COORDINATES.latitude,
          "longitude": GEO_COORDINATES.longitude
        }
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Central Workshop, VSSUT Campus",
        "addressLocality": "Burla, Sambalpur",
        "addressRegion": "Odisha",
        "postalCode": "768018",
        "addressCountry": "IN"
      },
      "award": [
        "Formula Imperial Buddh International Circuit - P3 Overall Podium (Electric Category)",
        "Formula Bharat - National Best Business Plan Presentation Award",
        "Engineering Design Event - Lightweight Design Award",
        "Endurance Event - Maximum Energy Efficiency Finish"
      ],
      "knowsAbout": [
        "Formula Student",
        "Formula Bharat",
        "Electric Vehicle Powertrain Engineering",
        "High Voltage Battery Management Systems (BMS)",
        "Permanent Magnet Synchronous Motors (PMSM)",
        "Carbon Composite Aerodynamics",
        "Pushrod Suspension Kinematics",
        "CAN-bus Vehicle Telemetry"
      ],
      "sameAs": [
        "https://www.linkedin.com/company/veerracerss",
        "https://instagram.com/veerracerss",
        "https://facebook.com/veerracerss",
        "https://youtube.com/@veerracerss"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Technical & Sponsorship Inquiries",
        "email": "tech@veerracerss.org",
        "telephone": "+91-9967624731"
      }
    },
    {
      "@type": "Vehicle",
      "@id": "https://veerracerss-official-web.vercel.app/#aether",
      "name": "AETHER (Formula Student Electric Race Car)",
      "model": "AETHER 2024-25",
      "vehicleConfiguration": "Open-wheel Single Seater Formula Student EV",
      "speed": "115 km/h",
      "accelerationTime": "3.8 seconds (0-100 km/h)",
      "vehicleEngine": {
        "@type": "EngineSpecification",
        "name": "10 kW Continuous PMSM High-Torque Electric Motor"
      },
      "weight": "195 kg",
      "manufacturer": {
        "@id": "https://veerracerss-official-web.vercel.app/#team"
      },
      "description": "First collegiate electric formula race vehicle engineered and built in Odisha, featuring a 72V custom high-density battery pack, in-house BMS, carbon composite wings, and pushrod suspension."
    },
    {
      "@type": "FAQPage",
      "@id": "https://veerracerss-official-web.vercel.app/#faq",
      "mainEntity": FAQ_AEO_ITEMS.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    },
    {
      "@type": "WebSite",
      "@id": "https://veerracerss-official-web.vercel.app/#website",
      "url": "https://veerracerss-official-web.vercel.app",
      "name": "VeerRacerss Electric Official Website",
      "description": "Official online portal, fleet showcase, squad roster, and telemetry archive of Team VeerRacerss Electric VSSUT Burla.",
      "publisher": {
        "@id": "https://veerracerss-official-web.vercel.app/#team"
      },
      "inLanguage": "en-IN"
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="4utN8IareDBUNPzl05SNbzh5iO6zjeeo1AOwMth2vhs" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="author" href="https://veerracerss-official-web.vercel.app" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="help" href="/llms.txt" />
      </head>
      <body suppressHydrationWarning>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
