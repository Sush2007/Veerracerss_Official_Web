"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Counter } from "./Counter";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative h-[100dvh] min-h-[600px] w-full flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Cinematic Video Background - Fully Visible */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0 hero-video-container pointer-events-none"
      >
        <video 
          className="w-full h-full object-cover opacity-100" 
          autoPlay 
          loop 
          muted 
          playsInline
          src="/gemini_generated_video_2ab9bd5f.mp4"
        />
        {/* Subtle gradient just to ensure the text stays readable without darkening the whole video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      </motion.div>

      <div className="relative z-10 text-center px-4 md:px-16 flex flex-col items-center mt-12 w-full max-w-[100vw]">
        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="font-hero text-[11vw] sm:text-5xl md:text-[80px] lg:text-[110px] xl:text-[140px] leading-[1.1] tracking-wider uppercase text-white drop-shadow-[0_0_20px_rgba(255,30,0,0.8)] w-full break-words"
          style={{ WebkitTextStroke: '2px white' }}
        >
          TEAM VEERRACERSS
        </motion.h1>

        {/* Subtitle Hashtag */}
        <motion.p 
          className="font-display text-lg sm:text-2xl md:text-4xl text-white tracking-widest mt-4 md:mt-6 drop-shadow-lg" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          #EngineeringTheFuture
        </motion.p>
      </div>
      
      {/* Counters Overlay - 2x2 Grid on Mobile, 4x1 on Desktop */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 md:bottom-8 left-4 right-4 md:left-12 lg:left-24 md:right-auto z-20 pb-safe"
      >
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-y-4 gap-x-2 sm:gap-8 md:gap-16 lg:gap-24 w-full">
          <div className="flex flex-col items-start group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mono text-racing-red font-black tracking-tighter mb-1 drop-shadow-[0_0_15px_rgba(255,30,0,0.6)]">
              <Counter value={11} suffix="+" />
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-sm text-white font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] font-sans">Years of Innovation</div>
          </div>
          <div className="flex flex-col items-start group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mono text-racing-red font-black tracking-tighter mb-1 drop-shadow-[0_0_15px_rgba(255,30,0,0.6)]">
              <Counter value={10} suffix="+" />
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-sm text-white font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] font-sans">Cars Built</div>
          </div>
          <div className="flex flex-col items-start group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mono text-racing-red font-black tracking-tighter mb-1 drop-shadow-[0_0_15px_rgba(255,30,0,0.6)]">
              <Counter value={10} suffix="+" />
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-sm text-white font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] font-sans leading-tight">International Comps</div>
          </div>
          <div className="flex flex-col items-start group">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mono text-racing-red font-black tracking-tighter mb-1 drop-shadow-[0_0_15px_rgba(255,30,0,0.6)]">
              <Counter value={100} suffix="+" />
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-sm text-white font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] font-sans leading-tight">Active Members</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
