"use client";

import { motion } from "motion/react";
import { Car, Calendar, Users, Trophy, Medal } from "lucide-react";

const STATS = [
  { icon: Car, label: "CAR", value: "AETHER" },
  { icon: Calendar, label: "EST.", value: "2018" },
  { icon: Users, label: "TEAM MEMBERS", value: "55+" },
  { icon: Trophy, label: "COMPETITIONS", value: "4+" },
  { icon: Medal, label: "PODIUMS", value: "P3" },
];

export function StatsStrip() {
  return (
    <section className="w-full bg-[#1A1A1A] border-y border-white/5 py-8 sm:py-12 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-white/5">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ type: "spring", damping: 15, stiffness: 100, delay: index * 0.08 }}
                className={`flex flex-col items-center text-center p-3.5 sm:p-5 lg:p-0 bg-[#141414] lg:bg-transparent border border-white/5 lg:border-none space-y-2 sm:space-y-4 group cursor-default rounded-none ${
                  index === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="relative">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-racing-red group-hover:scale-110 transition-transform duration-500 ease-out" strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-racing-red opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                </div>
                <div className="flex flex-col space-y-0.5 sm:space-y-1">
                  <span className="text-[10px] sm:text-[11px] text-white/50 font-bold tracking-[0.18em] uppercase font-sans">{stat.label}</span>
                  <span className="text-xl sm:text-2xl lg:text-3xl text-white font-display font-black tracking-wider uppercase drop-shadow-md">{stat.value}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
