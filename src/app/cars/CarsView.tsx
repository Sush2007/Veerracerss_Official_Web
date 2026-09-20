"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Zap, Orbit, Trophy } from "lucide-react";
import React, { useRef } from "react";
import { Partners } from "../../components/Partners";
import { CARS_DATA } from "@/src/data/cars";

export function CarsView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen pt-24 bg-[#050505]">
      <main className="relative pb-0">
        {/* Header Hero Section */}
        <section ref={containerRef} className="relative min-h-[35vh] py-12 md:h-[55vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-b border-white/5">
          {/* Background Elements */}
          <div className="absolute inset-0 telemetry-grid opacity-[0.03] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[14rem] md:text-[20rem] font-display font-black text-white/[0.02] uppercase pointer-events-none whitespace-nowrap z-0">
            FLEET
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-racing-red/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

          <motion.div 
            className="text-center z-10 px-4 flex flex-col items-center"
            style={{ opacity, y }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="font-display text-4xl sm:text-7xl md:text-8xl lg:text-[110px] font-black uppercase tracking-tight text-white relative"
            >
              THE FLEET
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-racing-red font-sans font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-3 sm:mt-4"
            >
              FORMULA STUDENT CHASSIS EVOLUTION // 2018 — 2025
            </motion.p>
          </motion.div>
        </section>

        {/* Cars Timeline Section */}
        <section className="py-12 sm:py-20 md:py-24 relative overflow-hidden bg-[#111111]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none translate-x-1/3 z-0"></div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
            <div className="flex flex-col gap-16 sm:gap-24 xl:gap-32">
              {CARS_DATA.map((car, index) => (
                <motion.div 
                  key={car.name}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", damping: 25, stiffness: 80 }}
                  className={`flex flex-col ${index % 2 !== 0 ? 'xl:flex-row-reverse' : 'xl:flex-row'} gap-8 sm:gap-12 xl:gap-20 items-center relative z-10 group`}
                >
                  {/* Left/Right Image Container */}
                  <div className="w-full xl:w-7/12 relative aspect-[16/10] overflow-hidden bg-[#0A0A0A] border border-white/5 group-hover:border-racing-red/40 transition-colors duration-500 rounded-none shadow-2xl">
                    <img 
                      src={car.image} 
                      alt={`VeerRacerss ${car.name} Formula Student Race Car`} 
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out" 
                    />
                    
                    {/* Top Left Badge */}
                    <div className="absolute top-0 left-0 bg-racing-red px-3.5 py-1.5 sm:px-6 sm:py-3 flex gap-3 sm:gap-4 items-center">
                      <span className="text-base sm:text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-white leading-none">
                        {car.name}
                      </span>
                    </div>
                    {/* Category & Year Badge */}
                    <div className="absolute top-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-l border-white/10 px-2.5 py-1 sm:px-4 sm:py-2 flex items-center gap-2 sm:gap-3">
                      <span className={`text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase px-1.5 py-0.5 ${car.category === 'EV' ? 'bg-racing-red text-white' : 'bg-white/10 text-white/70'}`}>
                        {car.category}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/50 font-bold">
                        {car.year} SPEC
                      </span>
                    </div>

                    {/* Competition Banner */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3.5 sm:p-5 pt-8 sm:pt-12 flex items-center gap-2 sm:gap-2.5">
                      <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-racing-red shrink-0" />
                      <span className="text-[11px] sm:text-xs text-white/80 font-sans tracking-wider uppercase font-medium">
                        {car.competition}
                      </span>
                    </div>
                  </div>
                  
                  {/* Stats and Description */}
                  <div className="w-full xl:w-5/12 flex flex-col">
                    <p className="text-white/70 text-sm sm:text-base leading-relaxed font-sans font-light mb-6 sm:mb-10 border-l-2 border-racing-red pl-4 sm:pl-6">
                      {car.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6 mb-6 sm:mb-10">
                       <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:pb-4">
                          <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.15em] font-sans font-bold">Top Speed</p>
                          <p className="text-xl sm:text-2xl font-black font-display tracking-wide text-white group-hover:text-racing-red transition-colors duration-300">{car.stats.speed}</p>
                       </div>
                       <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:pb-4">
                          <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.15em] font-sans font-bold">Acceleration</p>
                          <p className="text-xl sm:text-2xl font-black font-display tracking-wide text-white group-hover:text-racing-red transition-colors duration-300">{car.stats.accel}</p>
                       </div>
                       <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:pb-4">
                          <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.15em] font-sans font-bold">Curb Weight</p>
                          <p className="text-xl sm:text-2xl font-black font-display tracking-wide text-white group-hover:text-racing-red transition-colors duration-300">{car.stats.weight}</p>
                       </div>
                       <div className="flex flex-col gap-1 border-b border-white/5 pb-3 sm:pb-4">
                          <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.15em] font-sans font-bold">Powertrain</p>
                          <p className="text-xl sm:text-2xl font-black font-display tracking-wide text-white group-hover:text-racing-red transition-colors duration-300">{car.stats.power}</p>
                       </div>
                    </div>

                    <div className="bg-[#1A1A1A]/40 backdrop-blur-sm border border-white/5 p-4 sm:p-6 relative overflow-hidden rounded-none">
                      <h4 className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-racing-red mb-3 sm:mb-4 font-sans">
                        <Orbit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Technical Highlights
                      </h4>
                      <ul className="flex flex-col gap-2 sm:gap-2.5 relative z-10">
                        {car.features.map(f => (
                          <li key={f} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-white/70 font-sans font-light">
                            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-racing-red shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <Partners />
      </main>
    </div>
  );
}
