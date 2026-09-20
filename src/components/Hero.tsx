"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroCar3D = dynamic(() => import("./HeroCar3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center gap-2 text-white/50 font-mono text-xs tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
        LOADING 3D CAR...
      </div>
    </div>
  ),
});

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-[100dvh] w-full flex items-center overflow-hidden bg-[#050505]"
    >
      {/* Background Grid & Subtle Parallax Texture */}
      <motion.div style={{ y }} className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none z-0"></motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-racing-red/10 via-transparent to-transparent z-0 pointer-events-none"></div>
      
      {/* Clean Subtle Red Accent Line on Left Edge */}
      <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-racing-red shadow-[0_0_30px_rgba(210,39,48,0.8)] z-0 pointer-events-none"></div>

      {/* 
        3D Vehicle Canvas: Positioned with ample width across the hero stage
        so the full length of the car is displayed edge-to-edge without being clipped.
      */}
      <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center lg:justify-end overflow-hidden pointer-events-auto">
        <div className="w-full lg:w-[68%] xl:w-[65%] h-full flex items-center justify-center pt-20 lg:pt-0">
          <HeroCar3D />
        </div>
      </div>

      {/* 
        Foreground Hero Text: Completely transparent background (bg-transparent)
        so the complete 3D model is visible behind and beside the text.
      */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 pointer-events-none flex flex-col justify-center min-h-[100dvh] pt-20 sm:pt-24 lg:pt-0">
        
        {/* Left Side: Transparent Text Block */}
        <div className="w-full max-w-xl flex flex-col items-start bg-transparent">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.2 }}
            className="bg-transparent"
          >
            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] leading-[1.05] tracking-tight uppercase text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
              ENGINEERED <br /> TO COMPETE. <br />
              <span className="text-racing-red">BUILT TO WIN.</span>
            </h1>
          </motion.div>

          {/* Description Paragraph */}
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.5 }}
            className="font-sans text-white/80 text-xs sm:text-sm md:text-base mt-4 sm:mt-6 md:mt-8 max-w-lg font-light leading-relaxed border-l-2 border-racing-red pl-3.5 sm:pl-5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] bg-transparent"
          >
            Pushing the frontiers of electric motorsport at VSSUT Burla. 
            Precision aerodynamics, high-voltage battery architecture, and race-proven vehicle dynamics.
          </motion.p>

          {/* Interactive CTA Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.7 }}
            className="pointer-events-auto flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 w-full sm:w-auto"
          >
            <Link href="/cars" className="bg-racing-red text-white px-6 py-3.5 sm:px-9 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.16em] sm:tracking-[0.18em] hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 text-center rounded-none relative overflow-hidden group">
              <span className="relative z-10">DISCOVER THE CAR</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
            </Link>
            <Link href="/members" className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 sm:px-9 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.16em] sm:tracking-[0.18em] hover:border-white hover:bg-white/10 transition-all duration-300 text-center rounded-none relative overflow-hidden group">
              <span className="relative z-10">MEET THE TEAM</span>
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 origin-left"></div>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
