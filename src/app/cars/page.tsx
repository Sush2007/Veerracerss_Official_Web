"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Zap, Orbit, Shield, Target } from "lucide-react";
import React, { useRef } from "react";
import { Partners } from "../../components/Partners";


const CARS = [
  {
    name: "VRE-05 'Spectre'",
    year: "2025",
    features: ["AWD Torque Vectoring", "Custom Inverters", "Carbon Monocoque", "Active Suspension"],
    stats: { speed: "115 km/h", accel: "2.1s 0-100", weight: "210kg", power: "80kW" },
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl9cwwxKrwpQAzlo95bBhvimUTAqo35f4O40MFvKusyhQe4NqVWbd9vQwz67JiXBY5WY2f6ttTgtCKcAgtSO-yVjVQuQlQ5-GcitAcjWLwO7ScRKuFKxe8sTXcBBsLoh4-VdgBFN7nTCIK9NDTJ86sU4W3pkY6HtJomyu7l0lPxCPebIqWK6pcIovcvCcNCDswqa_kt751xd3JO3znXAAd7T71VZiBQSrlsZGZ9T5okNBWBnNiLNj61Wow3DWff9dT5KJMV0ZHnhc", // Placeholder
    description: "The pinnacle of our engineering evolution. Spectre features a redesigned aero package delivering 30% more downforce, coupled with our first fully custom-developed motor controllers. The chassis is a full carbon fibre monocoque engineered for extreme torsional rigidity while shaving crucial kilograms off the total kerb weight."
  },
  {
    name: "VRE-04 'Valkyrie'",
    year: "2024",
    features: ["Steel Spaceframe", "RWD Dual Motor", "Active Aero"],
    stats: { speed: "105 km/h", accel: "2.4s 0-100", weight: "245kg", power: "60kW" },
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl9cwwxKrwpQAzlo95bBhvimUTAqo35f4O40MFvKusyhQe4NqVWbd9vQwz67JiXBY5WY2f6ttTgtCKcAgtSO-yVjVQuQlQ5-GcitAcjWLwO7ScRKuFKxe8sTXcBBsLoh4-VdgBFN7nTCIK9NDTJ86sU4W3pkY6HtJomyu7l0lPxCPebIqWK6pcIovcvCcNCDswqa_kt751xd3JO3znXAAd7T71VZiBQSrlsZGZ9T5okNBWBnNiLNj61Wow3DWff9dT5KJMV0ZHnhc", // Placeholder
    description: "Valkyrie marked our transition to custom battery management systems and active aerodynamic elements, laying the groundwork for our future success in the EV category. It remains a fan favorite for its aggressive rear-wheel-drive dynamics and reliable mechanical grip."
  }
];

function InteractiveCarCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;
    ref.current.style.transform = `perspective(1200px) rotateY(${xPct * 15}deg) rotateX(${-yPct * 15}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handlePointerLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1200px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`transition-transform duration-500 ease-out will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

export default function CarsPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div className="min-h-screen pt-24">
      
      <main className="relative pb-16">
        {/* Header Hero Section */}
        <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 cinematic-overlay"></div>
          
          <motion.div 
            className="text-center z-10 px-4"
            style={{ opacity, y }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-display text-6xl md:text-8xl lg:text-[140px] font-black uppercase tracking-tighter italic text-transparent bg-clip-text text-gradient relative pr-8 pb-4"
            >
              The Fleet
              <motion.div 
                className="absolute -inset-4 bg-racing-red blur-[100px] rounded-full opacity-20 mix-blend-screen -z-10 pointer-events-none" 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
              />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-racing-red font-mono text-sm md:text-base tracking-[0.4em] uppercase mt-4"
            >
              Evolution of pure speed
            </motion.p>
          </motion.div>
        </section>

        {/* Cars Timeline Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-16 relative">
            
            {/* Timeline line connecting cars */}
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block"></div>

            <div className="flex flex-col gap-40">
              {CARS.map((car, index) => (
                <motion.div 
                  key={car.name}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                  className={`flex flex-col ${index % 2 !== 0 ? 'xl:flex-row-reverse' : 'xl:flex-row'} gap-16 items-center relative z-10`}
                >
                  <div className="w-full xl:w-7/12">
                    <InteractiveCarCard>
                      <div className="aspect-[16/10] glass-panel p-2 rounded-3xl relative overflow-hidden group cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                         <div className="absolute inset-0 bg-gradient-to-br from-racing-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10"></div>
                         
                         <img 
                           src={car.image} 
                           alt={car.name} 
                           className="w-full h-full object-cover rounded-2xl opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out filter contrast-125 group-hover:contrast-100"
                         />
                         
                         <div className="absolute top-8 left-8 z-20 flex gap-4 items-center">
                            <span className="text-2xl md:text-4xl font-display font-black italic uppercase tracking-tighter text-white drop-shadow-lg">
                              {car.name}
                            </span>
                            <span className="glass-pill px-4 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-racing-red border border-racing-red/30">
                              {car.year} Spec
                            </span>
                         </div>
                      </div>
                    </InteractiveCarCard>
                  </div>
                  
                  <div className="w-full xl:w-5/12 flex flex-col gap-10">
                    <div className="relative glass-panel p-8 rounded-3xl">
                      <p className="text-text-muted text-lg leading-relaxed font-sans relative z-10 border-l-2 border-racing-red pl-6">
                        {car.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 relative z-10 glass-panel p-8 rounded-3xl">
                       <div className="flex flex-col gap-1 border-b border-white/5 pb-4 group">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest group-hover:text-racing-red transition-colors">Top Speed</p>
                          <p className="text-2xl font-black font-mono text-white group-hover:text-glow">{car.stats.speed}</p>
                       </div>
                       <div className="flex flex-col gap-1 border-b border-white/5 pb-4 group">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest group-hover:text-racing-red transition-colors">Acceleration</p>
                          <p className="text-2xl font-black font-mono text-white group-hover:text-glow">{car.stats.accel}</p>
                       </div>
                       <div className="flex flex-col gap-1 border-b border-white/5 pb-4 group">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest group-hover:text-racing-red transition-colors">Weight</p>
                          <p className="text-2xl font-black font-mono text-white group-hover:text-glow">{car.stats.weight}</p>
                       </div>
                       <div className="flex flex-col gap-1 border-b border-white/5 pb-4 group">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest group-hover:text-racing-red transition-colors">Peak Power</p>
                          <p className="text-2xl font-black font-mono text-white group-hover:text-glow">{car.stats.power}</p>
                       </div>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl">
                      <h4 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-racing-red mb-6 font-display">
                        <Orbit className="w-4 h-4" /> Technical Highlights
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {car.features.map(f => (
                          <li key={f} className="flex items-start gap-3 text-sm text-text-muted font-sans">
                            <Zap className="w-4 h-4 text-racing-red shrink-0 mt-[2px]" />
                            <span className="font-light">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <Partners />
      </main>
    </div>
  );
}
