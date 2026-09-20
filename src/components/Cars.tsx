"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Battery, Zap, ShieldCheck, ArrowRight, Trophy, Box, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import 3D viewer for high performance client-side WebGL
const CarViewer3D = dynamic(() => import("./CarViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] md:h-[650px] bg-[#0A0A0A] border border-white/5 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
        <span className="text-white/60 font-mono text-xs tracking-widest uppercase">
          INITIALIZING 3D ENGINE...
        </span>
      </div>
    </div>
  ),
});

const SPECS = [
  {
    icon: Zap,
    title: "10 KW PMSM Motor",
    description: "High torque and instant power delivery engineered for rapid circuit acceleration.",
  },
  {
    icon: Battery,
    title: "72V Battery Pack",
    description: "In-house engineered high energy density accumulator with custom thermal management.",
  },
  {
    icon: ShieldCheck,
    title: "Endurance Tested",
    description: "Passed driver egress, rain/tilt inspections, and dynamic endurance at Buddh International Circuit.",
  }
];

export function Cars() {
  const [activeView, setActiveView] = useState<"3d" | "photo">("3d");

  return (
    <section id="cars" className="py-24 md:py-32 bg-[#111111] relative z-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-display font-black text-white/[0.02] uppercase pointer-events-none whitespace-nowrap z-0">
        AETHER
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-racing-red/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-3 block">
              FLAGSHIP PROTOTYPE
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase text-white tracking-tight">
              AETHER 2024-25
            </h2>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* View Switcher: 3D CAD vs Track Photo */}
            <div className="flex items-center bg-[#0A0A0A] p-1 border border-white/10">
              <button
                onClick={() => setActiveView("3d")}
                className={`px-4 py-2 text-xs font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                  activeView === "3d"
                    ? "bg-racing-red text-white shadow-[0_0_20px_rgba(210,39,48,0.4)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Interactive CAD</span>
              </button>
              <button
                onClick={() => setActiveView("photo")}
                className={`px-4 py-2 text-xs font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                  activeView === "photo"
                    ? "bg-racing-red text-white shadow-[0_0_20px_rgba(210,39,48,0.4)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Track Photo</span>
              </button>
            </div>

            <Link 
              href="/cars" 
              className="inline-flex items-center gap-2 text-white/50 hover:text-white font-sans font-bold text-xs tracking-[0.15em] uppercase transition-colors"
            >
              <span>ALL 6 CARS</span>
              <ArrowRight className="w-3.5 h-3.5 text-racing-red" />
            </Link>
          </div>
        </div>

        {/* Feature Showcase (3D Model / Track Photo) */}
        <div className="mb-16">
          {activeView === "3d" ? (
            <div className="w-full">
              <CarViewer3D />
            </div>
          ) : (
            <div className="relative w-full h-[550px] md:h-[650px] overflow-hidden bg-[#0A0A0A] border border-white/10 group">
              <img 
                src="/cars/aether.jpg" 
                alt="VeerRacerss Electric AETHER" 
                className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute top-0 left-0 bg-racing-red px-4 py-2 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-sans font-bold tracking-widest uppercase text-white">
                  FORMULA IMPERIAL P3 OVERALL (EV)
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <span className="text-xs font-mono text-white/70 uppercase tracking-wider">
                  First electric formula car engineered by any college in Odisha
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Performance Numbers Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="bg-[#0A0A0A] border border-white/5 p-6 flex flex-col justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Top Track Speed</span>
            <span className="text-3xl font-display font-black text-white mt-2">115 <span className="text-sm font-sans font-normal text-white/40">KM/H</span></span>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 flex flex-col justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">0-100 Acceleration</span>
            <span className="text-3xl font-display font-black text-racing-red mt-2">3.1 <span className="text-sm font-sans font-normal text-white/40">SEC</span></span>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 flex flex-col justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Curb Weight</span>
            <span className="text-3xl font-display font-black text-white mt-2">240 <span className="text-sm font-sans font-normal text-white/40">KG</span></span>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 flex flex-col justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Peak Motor Output</span>
            <span className="text-3xl font-display font-black text-white mt-2">10 <span className="text-sm font-sans font-normal text-white/40">KW</span></span>
          </div>
        </div>

        {/* Technical Highlights 3-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {SPECS.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-[#0A0A0A] border border-white/5 p-8 md:p-10 group hover:border-racing-red/50 transition-colors duration-500 relative overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                  <Icon className="w-32 h-32 text-white" />
                </div>
                
                <Icon className="w-8 h-8 text-racing-red mb-8" strokeWidth={1.5} />
                <h3 className="font-display font-bold text-xl md:text-2xl text-white uppercase tracking-wide mb-4 relative z-10">
                  {spec.title}
                </h3>
                <p className="font-sans text-white/50 text-sm md:text-base leading-relaxed relative z-10 font-light">
                  {spec.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
