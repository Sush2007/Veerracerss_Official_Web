"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const NEWS_ITEMS = [
  {
    date: "16 APR 2025",
    title: "CAR REVEAL 2025",
    desc: "Official roll-out of our next-gen Formula Student EV prototype featuring an all-carbon aerodynamic package and high-voltage battery architecture.",
    image: "https://images.unsplash.com/photo-1532981504936-39f80164cda7?q=80&w=2069&auto=format&fit=crop"
  },
  {
    date: "12 MAY 2025",
    title: "TESTING COMPLETED",
    desc: "Extensive track telemetry and endurance trial runs completed at full throttle, validating inverter thermal limits and regenerative braking response.",
    image: "https://images.unsplash.com/photo-1541447237128-f4cac6138fbe?q=80&w=2004&auto=format&fit=crop"
  },
  {
    date: "18 FEB 2025",
    title: "THANK YOU PARTNERS!",
    desc: "Gratitude to our technical sponsors and academic patrons whose materials, manufacturing support, and mentorship power our electric racing vision.",
    image: "https://images.unsplash.com/photo-1517409277051-576206689859?q=80&w=2069&auto=format&fit=crop"
  }
];

export function News() {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-[#111111] relative z-10 overflow-hidden">
      {/* Background Elements to fill empty space */}
      <div className="absolute inset-0 telemetry-grid opacity-[0.03] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/4 z-0"></div>
      <div className="absolute top-1/4 -right-20 text-[10rem] font-display font-black text-white/[0.015] uppercase pointer-events-none rotate-90 z-0">
        UPDATES
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 sm:mb-3 block">LATEST NEWS</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-tight">
              STAY UP TO SPEED
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {NEWS_ITEMS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="flex flex-col group cursor-pointer bg-[#1A1A1A]/40 backdrop-blur-md p-4 sm:p-5 rounded-none border border-white/5 hover:border-racing-red/30 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black mb-5 sm:mb-6">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                />
                <div className="absolute top-0 right-0 bg-racing-red px-3.5 py-1.5 sm:px-4 sm:py-2">
                  <span className="text-white font-sans font-bold text-[9px] sm:text-[10px] tracking-widest">{item.date}</span>
                </div>
              </div>
              
              <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide mb-2 sm:mb-3 group-hover:text-racing-red transition-colors duration-300">
                {item.title}
              </h3>
              
              <p className="font-sans text-xs sm:text-sm text-white/50 leading-relaxed font-light mb-5 sm:mb-6 flex-grow">
                {item.desc}
              </p>
              
              <div className="flex items-center gap-2 text-racing-red font-sans font-bold text-[11px] tracking-[0.15em] uppercase">
                READ MORE 
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" strokeWidth={2} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
