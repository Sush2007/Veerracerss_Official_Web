"use client";

import { motion } from "motion/react";
import { Cpu, Wrench, Flag } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 bg-[#0A0A0A] relative z-10 overflow-hidden border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">
          
          {/* Left: Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", damping: 20, stiffness: 60 }}
            className="relative aspect-video lg:aspect-[4/3] w-full bg-[#111111] overflow-hidden rounded-none group"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop')] bg-cover bg-center opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out"></div>
            
            {/* Minimalist Accents matching video */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-racing-red pointer-events-none transition-all duration-500 group-hover:w-16 group-hover:h-16 group-hover:border-white"></div>
          </motion.div>

          {/* Right: Text & Grid */}
          <div className="flex flex-col justify-center space-y-8 sm:space-y-12">
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", damping: 25, stiffness: 80, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px]">ABOUT US</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight">
                WHO WE ARE
              </h2>
              <p className="font-sans text-white/70 text-sm sm:text-base md:text-lg leading-relaxed font-light">
                We are VeerRacerss Electric, the official Formula Student EV team of VSSUT Burla. We design, fabricate, and race high-performance electric race cars from the ground up, pushing the limits of lightweight composites, battery thermal safety, and dynamic vehicle telemetry.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 border-t border-white/10">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col group p-4 sm:p-0 bg-[#111111]/50 sm:bg-transparent border border-white/5 sm:border-none"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-racing-red transition-colors duration-300">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-racing-red group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-[12px] sm:text-[13px] text-white uppercase tracking-wider mb-1.5 sm:mb-2">INNOVATIVE DESIGN</h3>
                <p className="font-sans text-xs sm:text-[13px] text-white/50 leading-relaxed font-light">Aero & CAD focused precision engineering for perfect dynamics.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="flex flex-col group p-4 sm:p-0 bg-[#111111]/50 sm:bg-transparent border border-white/5 sm:border-none"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-racing-red transition-colors duration-300">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-racing-red group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-[12px] sm:text-[13px] text-white uppercase tracking-wider mb-1.5 sm:mb-2">BUILT IN-HOUSE</h3>
                <p className="font-sans text-xs sm:text-[13px] text-white/50 leading-relaxed font-light">Featuring a custom high-density 72V battery pack and custom BMS.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col group p-4 sm:p-0 bg-[#111111]/50 sm:bg-transparent border border-white/5 sm:border-none"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-racing-red transition-colors duration-300">
                  <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-racing-red group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-[12px] sm:text-[13px] text-white uppercase tracking-wider mb-1.5 sm:mb-2">RACE TO WIN</h3>
                <p className="font-sans text-xs sm:text-[13px] text-white/50 leading-relaxed font-light">P3 at Buddh International Circuit (Formula Imperial) & Formula Bharat.</p>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
