"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface Sponsor {
  name: string;
  category: string;
  logo: string;
  url: string;
  tier?: "title" | "partner";
}

const TITLE_SPONSORS: Sponsor[] = [
  {
    name: "KTM",
    category: "Title Sponsor & Powertrain",
    logo: "/sponsors/ktm.svg",
    url: "https://www.ktm.com",
    tier: "title"
  },
  {
    name: "CrossHead Engineering",
    category: "Title Sponsor & Precision Engineering",
    logo: "/sponsors/crosshead.svg",
    url: "https://veerracersselectric.netlify.app/sponsor",
    tier: "title"
  }
];

const TECHNICAL_SPONSORS: Sponsor[] = [
  {
    name: "SolidWorks",
    category: "3D CAD & Digital Twin",
    logo: "/sponsors/solidworks.svg",
    url: "https://www.solidworks.com",
    tier: "partner"
  },
  {
    name: "Ansys",
    category: "Simulation & FEA/CFD",
    logo: "/sponsors/ansys.svg",
    url: "https://www.ansys.com",
    tier: "partner"
  },
  {
    name: "Snap-on",
    category: "Precision Workshop Tools",
    logo: "/sponsors/snapon.svg",
    url: "https://www.snapon.com",
    tier: "partner"
  },
  {
    name: "Bender",
    category: "Electrical Safety & IMD",
    logo: "/sponsors/bender.svg",
    url: "https://www.bender.de",
    tier: "partner"
  },
  {
    name: "AMEC Mobility",
    category: "EV Lithium Battery & Powertrain",
    logo: "/sponsors/amec.svg",
    url: "https://veerracersselectric.netlify.app/sponsor",
    tier: "partner"
  },
  {
    name: "Burnout by 3 Brothers",
    category: "CNC Machining & Drivetrain",
    logo: "/sponsors/burnout3brothers.svg",
    url: "https://www.facebook.com/3BrothersAhmedabad/",
    tier: "partner"
  },
  {
    name: "My Pit Crew",
    category: "Trackside & Engineering Solutions",
    logo: "/sponsors/mypitcrew.svg",
    url: "https://veerracersselectric.netlify.app/sponsor",
    tier: "partner"
  },
  {
    name: "MCL",
    category: "Public Sector Patron",
    logo: "/sponsors/mcl.svg",
    url: "https://www.mahanadicoal.in",
    tier: "partner"
  },
  {
    name: "Morphine Motorsports",
    category: "Motorsport & Racing Equipment",
    logo: "/sponsors/morphine.svg",
    url: "https://www.gomorphine.com",
    tier: "partner"
  }
];

export function Partners() {
  return (
    <section id="partners" className="py-16 sm:py-24 md:py-32 bg-[#0A0A0A] relative z-10 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-racing-red/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 flex flex-col items-center relative z-10">
        
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 sm:mb-4 block">SUPPORTED BY INDUSTRY LEADERS</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-tight">
              OUR SPONSORS & PARTNERS
            </h2>
            <p className="mt-3 text-neutral-400 text-sm max-w-2xl mx-auto">
              Empowering next-generation collegiate electric motorsport through cutting-edge hardware, simulation software, precision machining, and industry patronage.
            </p>
          </motion.div>
        </div>

        {/* Title Sponsors */}
        <div className="w-full mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-6 bg-racing-red"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300">TITLE SPONSORS</span>
            <span className="h-[1px] flex-grow bg-white/10"></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {TITLE_SPONSORS.map((sponsor, idx) => (
              <motion.a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col items-center justify-center p-8 rounded-sm bg-[#111111]/90 backdrop-blur-sm border border-racing-red/30 hover:border-racing-red transition-all duration-300 hover:shadow-[0_0_35px_rgba(210,39,48,0.25)] hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-2 right-3 text-[9px] font-mono font-bold tracking-widest text-racing-red/80 uppercase">
                  TITLE PARTNER
                </div>
                <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-4 px-4">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="max-h-full max-w-[80%] object-contain filter brightness-100 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <span className="text-xs font-mono tracking-widest text-neutral-300 uppercase text-center group-hover:text-racing-red transition-colors duration-300 font-semibold">
                  {sponsor.name}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase text-center mt-1">
                  {sponsor.category}
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Technical & Associate Partners */}
        <div className="w-full mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[2px] w-6 bg-racing-red"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300">TECHNICAL & CORPORATE PARTNERS</span>
            <span className="h-[1px] flex-grow bg-white/10"></span>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {TECHNICAL_SPONSORS.map((sponsor, idx) => (
              <motion.a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group flex flex-col items-center justify-center p-6 rounded-sm bg-[#111111]/80 backdrop-blur-sm border border-white/10 hover:border-racing-red/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(210,39,48,0.2)] hover:-translate-y-1"
              >
                <div className="h-16 sm:h-20 w-full flex items-center justify-center mb-3 px-4">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="max-h-full max-w-[85%] object-contain filter brightness-95 contrast-105 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase text-center group-hover:text-racing-red transition-colors duration-300 font-medium">
                  {sponsor.category}
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full sm:w-auto text-center"
        >
          <Link 
            href="/#contact" 
            className="w-full sm:w-auto inline-block bg-transparent border border-white/30 text-white px-8 sm:px-10 py-3.5 sm:py-4 font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-none shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] text-center"
          >
            BECOME A PARTNER
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
