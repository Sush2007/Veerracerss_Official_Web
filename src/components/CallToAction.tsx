"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="py-16 sm:py-24 md:py-36 bg-[#0A0A0A] relative z-10 border-y border-white/5 overflow-hidden shadow-[inset_0_20px_50px_rgba(0,0,0,0.8)]">
      
      {/* Texture Background */}
      <div className="absolute inset-0 carbon-weave opacity-40 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10 flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 sm:mb-4 block">READY TO MAKE AN IMPACT?</span>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-8xl uppercase text-white tracking-tight leading-[1.05] mb-4 sm:mb-8">
            JOIN THE <br/> PIT CREW
          </h2>
          
          <p className="font-sans text-white/70 text-sm sm:text-base md:text-lg font-light mb-8 sm:mb-12 max-w-2xl leading-relaxed">
            Whether your passion lies in high-voltage battery architecture, carbon composite aerodynamics, vehicle dynamics, or sponsor relations, join VeerRacerss Electric to push the boundaries of motorsport engineering.
          </p>

          <Link 
            href="/#contact" 
            className="w-full sm:w-auto text-center block sm:inline-block bg-racing-red text-white px-8 sm:px-12 py-3.5 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 rounded-none shadow-[0_0_20px_rgba(210,39,48,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            JOIN US
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
