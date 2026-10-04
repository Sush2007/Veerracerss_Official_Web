"use client";

import { motion } from "motion/react";
import { Users, Shield } from "lucide-react";
import { Partners } from "../../components/Partners";
import { 
  FACULTY_ADVISORS, 
  FINAL_YEAR_LEADERS,
  PREFINAL_YEAR_LEADERS
} from "@/src/data/team_database";

export function MembersView() {
  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-[#050505] text-white selection:bg-racing-red selection:text-white">
      
      {/* Header Hero Section */}
      <section className="relative min-h-[30vh] sm:min-h-[35vh] py-12 md:h-[45vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-b border-white/5">
        <div className="absolute inset-0 telemetry-grid opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] sm:text-[11rem] md:text-[16rem] font-display font-black text-white/[0.02] uppercase pointer-events-none whitespace-nowrap z-0">
          TEAM
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-racing-red/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

        <div className="text-center z-10 px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <span className="text-racing-red font-sans font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase block mb-2 sm:mb-3">
              THE RACING SQUAD
            </span>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[80px] font-black uppercase tracking-tight text-white">
              OUR TEAM
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white/60 font-sans text-xs sm:text-sm tracking-[0.12em] sm:tracking-[0.16em] uppercase mt-2 sm:mt-3 max-w-lg"
          >
            The engineers, builders, and drivers powering Odisha's premier Formula Student EV.
          </motion.p>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-10 sm:py-16 space-y-14 sm:space-y-20 md:space-y-28">
        
        {/* SECTION 1: FACULTY ADVISORS */}
        <section>
          <div className="flex flex-col mb-6 sm:mb-10">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2">
              ACADEMIC PATRONAGE
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Faculty Advisors
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
              Distinguished professors and faculty members of VSSUT Burla providing strategic counsel, institutional backing, and technical oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FACULTY_ADVISORS.map((advisor, idx) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                  <img 
                    src={advisor.image} 
                    alt={advisor.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-racing-red px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase text-white">
                    {advisor.tenure}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {advisor.name}
                </h3>
                <p className="text-racing-red font-sans text-xs uppercase tracking-wider mb-2 font-bold">
                  {advisor.role}
                </p>
                <p className="text-white/40 font-sans text-xs uppercase tracking-wider font-mono mt-auto">
                  {advisor.department}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: TEAM LEADERSHIP & COUNCIL */}
        <section>
          <div className="flex flex-col mb-8 sm:mb-12">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2">
              EXECUTIVE & TECHNICAL SQUAD (2026–27)
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Team Leadership
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
              Executive captains, managers, and operational heads steering VeerRacerss into national competitions.
            </p>
          </div>

          {/* FINAL YEARS SUBSECTION */}
          <div className="mb-14 sm:mb-16">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
              <span className="w-2.5 h-2.5 bg-racing-red rounded-full"></span>
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white">
                  Final Years
                </h3>
                <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest">
                  4th Year &bull; Council & Technical Heads
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {FINAL_YEAR_LEADERS.map((leader, idx) => (
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                    <div className="absolute top-0 right-0 bg-racing-red px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase text-white">
                      {leader.role}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                    {leader.name}
                  </h3>
                  <span className="text-white/40 font-sans text-xs uppercase tracking-wider mb-2 font-mono">
                    {leader.subgroup}
                  </span>
                  <p className="text-white/60 font-sans text-xs font-light leading-relaxed">
                    {leader.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* PRE-FINAL YEARS SUBSECTION */}
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
              <span className="w-2.5 h-2.5 bg-racing-red rounded-full"></span>
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white">
                  Pre-Final Years
                </h3>
                <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest">
                  3rd Year &bull; Management & Operations Council
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {PREFINAL_YEAR_LEADERS.map((leader, idx) => (
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                    <div className="absolute top-0 right-0 bg-racing-red px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase text-white">
                      {leader.role}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                    {leader.name}
                  </h3>
                  <span className="text-white/40 font-sans text-xs uppercase tracking-wider mb-2 font-mono">
                    {leader.subgroup}
                  </span>
                  <p className="text-white/60 font-sans text-xs font-light leading-relaxed">
                    {leader.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Partners />
    </div>
  );
}
