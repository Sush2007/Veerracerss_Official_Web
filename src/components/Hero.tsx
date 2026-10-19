"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronRight, Gauge, Zap, Weight, Trophy, Activity } from "lucide-react";

const HeroCar3D = dynamic(() => import("./HeroCar3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="flex items-center gap-2 text-white/50 font-mono text-xs tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
        LOADING 3D FORMULA CAD...
      </div>
    </div>
  ),
});

const HERO_TELEMETRY = [
  { label: "0-100 KM/H", value: "3.1s", icon: Gauge },
  { label: "ACCUMULATOR", value: "72V CUSTOM", icon: Zap },
  { label: "CURB WEIGHT", value: "182 KG", icon: Weight },
  { label: "NATIONAL RANK", value: "AIR 1 LIGHTWEIGHT", icon: Trophy },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#050505] pt-20 sm:pt-24 lg:pt-28"
    >
      {/* Background Grid & Subtle Parallax Texture */}
      <motion.div style={{ y }} className="absolute inset-0 telemetry-grid opacity-15 pointer-events-none z-0"></motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-racing-red/15 via-transparent to-transparent z-0 pointer-events-none"></div>
      
      {/* Technical Red Laser Accent Line on Left Edge */}
      <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-racing-red shadow-[0_0_35px_rgba(210,39,48,0.9)] z-10 pointer-events-none"></div>

      {/* Main Responsive Hero Grid */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-8">
        
        {/* Left Column: Hero Cockpit HUD Typography & CTAs */}
        <div className="w-full lg:w-[48%] xl:w-[46%] flex flex-col items-start z-20 pointer-events-auto">
          


          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.1 }}
          >
            <h1 className="font-display font-black text-4xl min-[380px]:text-5xl sm:text-6xl md:text-7xl lg:text-[72px] xl:text-[82px] leading-[0.98] tracking-tight uppercase text-white drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]">
              VEERRACERSS <br />
              <span className="text-racing-red">ELECTRIC</span>
            </h1>
          </motion.div>

          {/* Subtitle / Description */}
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.25 }}
            className="font-sans text-white/80 text-xs sm:text-sm md:text-base mt-4 sm:mt-5 max-w-xl font-light leading-relaxed border-l-2 border-racing-red pl-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
          >
            Odisha’s Premier Formula Student EV Racing Team | VSSUT Burla • Est. 2018. 
            Engineered from raw CAD into high-voltage, track-dominating electric formula racecars.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.4 }}
            className="flex flex-row flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto"
          >
            <a 
              href="#car-spotlight" 
              className="flex-1 sm:flex-none bg-racing-red text-white px-5 py-3.5 sm:px-8 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.18em] hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 text-center relative overflow-hidden group flex items-center justify-center gap-2"
            >
              <span className="relative z-10">EXPLORE FLEET</span>
              <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
            </a>
            
            <Link 
              href="/members" 
              className="flex-1 sm:flex-none bg-black/70 backdrop-blur-md border border-white/20 text-white px-5 py-3.5 sm:px-8 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.18em] hover:border-racing-red hover:text-racing-red hover:bg-racing-red/10 transition-all duration-300 text-center relative overflow-hidden group"
            >
              <span className="relative z-10">RECRUITMENT 2026</span>
            </Link>
          </motion.div>

          {/* Quick HUD Metrics Strip (Mobile/Compact) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 min-[440px]:grid-cols-4 gap-2 sm:gap-3 mt-6 sm:mt-8 w-full border-t border-white/10 pt-4"
          >
            {HERO_TELEMETRY.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white/[0.03] border border-white/5 p-2 sm:p-2.5 flex flex-col">
                  <div className="flex items-center gap-1.5 text-white/40 mb-1">
                    <Icon className="w-3 h-3 text-racing-red" />
                    <span className="text-[9px] font-mono tracking-wider uppercase">{item.label}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-display font-bold text-white tracking-wide">{item.value}</span>
                </div>
              );
            })}
          </motion.div>

        </div>

        {/* Right Column: 3D Vehicle Interactive Canvas (Preserved with high fidelity) */}
        <div className="w-full lg:w-[52%] xl:w-[54%] flex items-center justify-center z-10 mt-2 sm:mt-4 lg:mt-0 pointer-events-auto">
          <HeroCar3D />
        </div>

      </div>

      {/* Paddock Telemetry Strip (Footer HUD Ticker) */}
      <div className="relative z-20 w-full bg-[#0a0a0a] border-t border-white/10 py-3 px-4 sm:px-6 md:px-16 overflow-x-auto no-scrollbar">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6 sm:gap-10 text-[10px] sm:text-xs font-mono text-white/60 uppercase tracking-widest whitespace-nowrap">
          <div className="flex items-center gap-2 text-racing-red font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE TELEMETRY:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">ACCELERATION:</span>
            <span className="text-white font-bold">0-100 IN 3.1s</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">BATTERY:</span>
            <span className="text-white font-bold">72V CUSTOM ACCUMULATOR</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">CHASSIS:</span>
            <span className="text-white font-bold">182 KG CURB WEIGHT</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">ENGINEERING:</span>
            <span className="text-racing-red font-bold">AIR 11 DESIGN TROPHY</span>
          </div>
        </div>
      </div>

    </section>
  );
}
