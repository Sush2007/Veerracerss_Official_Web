"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Trophy, Flag, Medal, Target } from "lucide-react";
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
    icon: <Target className="w-8 h-8 text-accent-cyan" />
  },
  {
    year: "2022",
    title: "Lightweight Design Award",
    category: "Engineering Design",
    description: "Recognized for an innovative carbon-composite hybrid chassis structure that shaved 15% vehicle weight.",
    icon: <Medal className="w-8 h-8 text-white" />
  },
  {
    year: "2021",
    title: "Endurance Masters",
    category: "Dynamic Events",
    description: "Completed the grueling 22km endurance event with the highest energy efficiency rating.",
    icon: <Flag className="w-8 h-8 text-racing-red" />
  }
];

export default function AchievementsPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div className="min-h-screen pt-24 overflow-x-hidden">
      
      <main className="relative block">
        <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 cinematic-overlay"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-racing-red rounded-full blur-[120px] opacity-10 animate-pulse"></div>

          <motion.div 
            className="text-center z-10 px-4"
            style={{ opacity, y }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-[140px] font-black uppercase tracking-tighter italic text-transparent bg-clip-text text-gradient font-display relative pr-8 pb-4"
            >
              Hall of <br className="block md:hidden"/> Fame
              <motion.div 
                className="absolute inset-0 bg-white/5 blur-[80px] rounded-full mix-blend-screen -z-10 pointer-events-none" 
                animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} 
              />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-racing-red font-mono text-sm md:text-base tracking-[0.4em] uppercase mt-6"
            >
              Excellence Engraved in History
            </motion.p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-16 py-12 relative z-10">
          <div className="grid grid-cols-1 gap-8 mb-24">
            {ACHIEVEMENTS.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-racing-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl z-0"></div>
                <div className="relative z-10 glass-panel group-hover:border-racing-red/50 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-8 overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_rgba(255,30,0,0.1)]">
                  
                  {/* Decorative background shape */}
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-racing-red/5 rounded-full blur-[50px] group-hover:bg-racing-red/10 transition-colors duration-500 pointer-events-none"></div>

                  <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-full border border-white/10 glass-panel relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                     {achievement.icon}
                  </div>
                  
                  <div className="flex-grow z-10">
                    <div className="flex items-center gap-4 mb-2">
                       <span className="text-5xl font-black font-display text-white/20 group-hover:text-racing-red/90 transition-colors">
                         {achievement.year}
                       </span>
                       <span className="h-px w-12 bg-white/20"></span>
                       <span className="text-[10px] uppercase font-bold tracking-widest text-racing-red font-mono">
                         {achievement.category}
                       </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white font-display">
                      {achievement.title}
                    </h2>
                    <p className="text-text-muted text-lg font-light max-w-2xl font-sans leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        <Partners />
      </main>
    </div>
  );
}
