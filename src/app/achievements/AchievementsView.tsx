"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Trophy, Flag, Medal, Target } from "lucide-react";
import React, { useRef } from "react";
import { Partners } from "../../components/Partners";

const ACHIEVEMENTS = [
  {
    year: "2024",
    title: "Formula Bharat EV Podium",
    category: "Overall Performance",
    description: "Secured runner-up overall in the EV category by passing rigorous technical inspections and excelling in dynamic events.",
    icon: <Trophy className="w-8 h-8 text-racing-red" />
  },
  {
    year: "2023",
    title: "Best Business Plan",
    category: "Static Events",
    description: "Awarded top honors for a sustainable, market-ready manufacturing scaling strategy.",
    icon: <Target className="w-8 h-8 text-racing-red" />
  },
  {
    year: "2022",
    title: "Lightweight Design Award",
    category: "Engineering Design",
    description: "Recognized for an innovative carbon-composite hybrid chassis structure that shaved 15% vehicle weight.",
    icon: <Medal className="w-8 h-8 text-racing-red" />
  },
  {
    year: "2021",
    title: "Endurance Masters",
    category: "Dynamic Events",
    description: "Completed the grueling 22km endurance event with the highest energy efficiency rating.",
    icon: <Flag className="w-8 h-8 text-racing-red" />
  }
];

export function AchievementsView() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen pt-24 bg-[#050505]">
      <main className="relative pb-0">
        <section ref={containerRef} className="relative min-h-[35vh] py-12 md:h-[55vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-b border-white/5">
          {/* Background Elements */}
          <div className="absolute inset-0 telemetry-grid opacity-[0.03] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[14rem] md:text-[20rem] font-display font-black text-white/[0.02] uppercase pointer-events-none whitespace-nowrap z-0">
            TROPHIES
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
              className="font-display text-4xl sm:text-7xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tight text-white relative"
            >
              HALL OF FAME
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-racing-red font-sans font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-3 sm:mt-4"
            >
              EXCELLENCE ENGRAVED IN HISTORY
            </motion.p>
          </motion.div>
        </section>

        <section className="py-12 sm:py-20 md:py-24 relative overflow-hidden bg-[#111111]">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/3 z-0"></div>
          
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
            <div className="grid grid-cols-1 gap-6 sm:gap-10 md:gap-12">
              {ACHIEVEMENTS.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", damping: 25, stiffness: 80, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative z-10 bg-[#0A0A0A] border border-white/5 group-hover:border-racing-red/50 p-5 sm:p-8 md:p-12 flex flex-col md:flex-row items-start gap-5 sm:gap-8 md:gap-12 transition-colors duration-500 rounded-none">
                    
                    {/* Year & Icon block */}
                    <div className="shrink-0 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start w-full md:w-48 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-12 gap-3 md:gap-0">
                      <div className="mb-0 md:mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 origin-left">
                         {achievement.icon}
                      </div>
                      <div className="flex flex-col items-end md:items-start">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white group-hover:text-racing-red transition-colors duration-300">
                          {achievement.year}
                        </span>
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.18em] text-white/50 font-sans mt-0.5 md:mt-2">
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Block */}
                    <div className="flex-grow flex flex-col justify-center">
                      <h2 className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wide mb-2 sm:mb-4 md:mb-6 text-white font-display">
                        {achievement.title}
                      </h2>
                      <p className="text-white/60 text-xs sm:text-sm md:text-base font-light font-sans leading-relaxed max-w-2xl">
                        {achievement.description}
                      </p>
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
