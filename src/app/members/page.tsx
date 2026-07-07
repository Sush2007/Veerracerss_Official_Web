"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Linkedin, Instagram } from "lucide-react";
import React, { useRef } from "react";
import { Footer } from "../../components/Footer";
import { Partners } from "../../components/Partners";


import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  "Leadership": "Guiding the vision and execution of Team VeerRacerss.",
  "Powertrain & Drivetrain": "Designing the high-voltage heart and sheer power delivery.",
  "Chassis": "Engineering the lightweight structural foundation.",
  "Suspension": "Maximizing mechanical grip and vehicle dynamics.",
  "Brakes": "Engineering precision deceleration and control.",
};

function MemberCard3D({ member }: { member: any }) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateY(${xPct * 15}deg) rotateX(${-yPct * 15}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handlePointerLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative transition-transform duration-300 ease-out will-change-transform w-full"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3E00] to-[#FF3E00]/50 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500 ease-out z-0"></div>
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden relative z-10 flex flex-col items-center p-6 gap-4">
        
        {/* Animated Racing Line Background */}
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-white/[0.02] skew-x-[-20deg] translate-x-[150%] group-hover:translate-x-[-150%] transition-transform duration-700 ease-in-out pointer-events-none"></div>

        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FF3E00] transition-colors duration-300 relative shadow-lg">
          <div className="absolute inset-0 bg-[#FF3E00]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay z-10 pointer-events-none"></div>
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>

        <div className="text-center z-20">
          <h3 className="text-xl font-bold uppercase tracking-wider text-white group-hover:text-[#FF3E00] transition-colors">{member.name}</h3>
          <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1 font-mono">{member.role}</p>
        </div>

        {/* Social Links (Revealed on Hover) */}
        <div className="flex gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out mt-2 z-20">
          <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#FF3E00] border border-white/10 hover:border-[#FF3E00] flex items-center justify-center text-white/70 hover:text-white transition-all">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href={member.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#FF3E00] border border-white/10 hover:border-[#FF3E00] flex items-center justify-center text-white/70 hover:text-white transition-all">
             <Instagram className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}

export default function MembersPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('members').select('*').order('created_at', { ascending: true });
      
      if (data && data.length > 0) {
        const grouped = data.reduce((acc, member) => {
          if (!acc[member.department]) acc[member.department] = [];
          acc[member.department].push(member);
          return acc;
        }, {} as Record<string, any[]>);

        const formattedDomains = Object.keys(DOMAIN_DESCRIPTIONS).map(dept => ({
          name: dept,
          description: DOMAIN_DESCRIPTIONS[dept],
          members: grouped[dept] || []
        })).filter(d => d.members.length > 0);

        setDomains(formattedDomains);
      }
      setLoading(false);
    };
    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-racing-red selection:text-white pb-0 pt-24 overflow-x-hidden">
      
      <main className="relative block">
        {/* Header Hero Section */}
        <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
          {/* Subtle noise and circuit texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] opacity-80"></div>

          <motion.div 
            className="text-center z-10 px-4"
            style={{ opacity, y }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 pr-8 pb-4 relative"
            >
              The Crew
              <motion.div 
                className="absolute inset-0 bg-white/10 blur-[80px] rounded-full mix-blend-screen -z-10 pointer-events-none" 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
              />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-[#FF3E00] font-mono text-sm md:text-base tracking-[0.3em] uppercase mt-6"
            >
              Minds Behind The Machines
            </motion.p>
          </motion.div>
        </section>

        {/* Domains Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-16 py-12 relative z-10 flex flex-col gap-32 mb-24 min-h-[50vh]">
          {loading ? (
            <div className="flex justify-center items-center py-32 opacity-50">
               <div className="animate-pulse flex items-center gap-4 text-racing-red font-mono tracking-widest uppercase">
                 Fetching Active Roster...
               </div>
            </div>
          ) : domains.length === 0 ? (
            <div className="text-center text-white/50 py-32 font-mono uppercase tracking-widest">
               No members currently assigned to the team.
            </div>
          ) : domains.map((domain, index) => (
            <div key={domain.name} className="flex flex-col gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="border-b border-white/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
              >
                <div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                    {domain.name}
                  </h2>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#FF3E00] md:text-right max-w-sm">
                  {domain.description}
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {domain.members.map((member, mIndex) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: mIndex * 0.1 }}
                  >
                    <MemberCard3D member={member} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </section>
        <Partners />
      </main>
    </div>
  );
}



