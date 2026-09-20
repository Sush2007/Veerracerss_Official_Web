"use client";

import { motion } from "motion/react";
import Link from "next/link";

const SPONSORS = [
  "BOSCH", "DANA", "DENSO", "EDAG", 
  "Bibus", "motorsport.com", "SKF", "vector"
];

export function Partners() {
  return (
    <section id="partners" className="py-16 sm:py-24 md:py-32 bg-[#0A0A0A] relative z-10 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-racing-red/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 flex flex-col items-center relative z-10">
        
        <div className="text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 sm:mb-4 block">SUPPORTED BY</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-tight">
              OUR PARTNERS
            </h2>
          </motion.div>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-10 sm:mb-16 relative">
          {/* Subtle grid lines for the logos */}
          <div className="absolute inset-0 border border-white/5 pointer-events-none hidden md:block"></div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 pointer-events-none hidden md:block"></div>
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/5 pointer-events-none hidden md:block"></div>
          <div className="absolute top-0 left-2/4 w-[1px] h-full bg-white/5 pointer-events-none hidden md:block"></div>
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white/5 pointer-events-none hidden md:block"></div>
          
          {SPONSORS.map((sponsor, idx) => (
            <motion.div
              key={sponsor}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="h-20 sm:h-24 flex items-center justify-center group cursor-pointer grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 relative z-10 hover:bg-white/[0.02] border border-white/5 md:border-none"
            >
              <span className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-wider group-hover:scale-110 transition-transform duration-500">
                {sponsor}
              </span>
            </motion.div>
          ))}
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
