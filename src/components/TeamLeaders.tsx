"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Linkedin } from "lucide-react";
import { CORE_LEADERSHIP } from "@/src/data/team_database";

export function TeamLeaders() {
  return (
    <section className="py-16 sm:py-24 bg-[#111111] relative z-10 border-t border-white/5 overflow-hidden" id="leadership">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] md:text-[20rem] font-display font-black text-white/[0.015] uppercase pointer-events-none whitespace-nowrap z-0">
        COMMAND
      </div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 sm:mb-3 block">
              EXECUTIVE DESK
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-tight">
              TEAM LEADERSHIP
            </h2>
          </motion.div>

          <Link 
            href="/members" 
            className="inline-flex items-center gap-2.5 sm:gap-3 text-racing-red hover:text-white font-sans font-bold text-[11px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors group"
          >
            <span>EXPLORE FULL ROSTER (200+ PROFILES)</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {CORE_LEADERSHIP.map((leader, index) => (
            <motion.div 
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col rounded-none transition-all duration-500 relative overflow-hidden"
            >
              <div className="aspect-[4/5] overflow-hidden relative mb-5 sm:mb-6 border border-white/5 bg-[#111111]">
                <img 
                  src={leader.image} 
                  alt={leader.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out" 
                />
                <div className="absolute top-0 right-0 bg-racing-red px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase text-white">
                  {leader.role.split(' ')[0]}
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide mb-1 font-display text-white group-hover:text-racing-red transition-colors">
                {leader.name}
              </h3>
              <p className="text-racing-red font-sans text-xs uppercase tracking-wider mb-1.5 sm:mb-2 font-bold">
                {leader.role}
              </p>
              <p className="text-white/40 font-sans text-[11px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4 font-mono">
                {leader.subgroup}
              </p>
              <p className="text-white/60 font-sans text-xs font-light leading-relaxed mb-5 sm:mb-6 flex-grow">
                {leader.description}
              </p>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                {leader.linkedin && (
                  <a 
                    href={leader.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/50 hover:text-white inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-racing-red" />
                    <span>LINKEDIN</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/members" 
            className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-6 sm:px-10 py-3.5 sm:py-4 font-sans font-bold text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-none shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] inline-block text-center"
          >
            VIEW ALL SQUAD MEMBERS & ARCHIVES
          </Link>
        </div>
      </div>
    </section>
  );
}
