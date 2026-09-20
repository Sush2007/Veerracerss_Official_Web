"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Target, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Partners } from "../../components/Partners";
import { createClient } from "@/src/lib/supabase/client";

export function AboutView() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoments = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('pinnacle_moments').select('*').order('year', { ascending: false }).order('created_at', { ascending: false });
      if (data) setMoments(data);
      setLoading(false);
    };
    fetchMoments();
  }, []);

  const momentsByYear = moments.reduce((acc, moment) => {
    if (!acc[moment.year]) acc[moment.year] = [];
    acc[moment.year].push(moment);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-racing-red selection:text-white pt-24 overflow-x-hidden">
      <main className="relative pb-16">
        {/* Header Hero Section */}
        <section className="relative min-h-[35vh] py-12 md:h-[50vh] flex items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 telemetry-grid opacity-20"></div>
          
          <motion.div 
            className="text-center z-10 px-4"
            style={{ opacity, y }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50"
            >
              The Formula
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-racing-red font-sans font-bold text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-3 sm:mt-4"
            >
              Inside Team VeerRacerss
            </motion.p>
          </motion.div>
        </section>

        {/* Philosophy Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-12 sm:py-20 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 sm:mb-8 leading-none font-display">
                More than <br/><span className="text-racing-red">Engineers</span>
              </h2>
              <div className="space-y-4 sm:space-y-6 text-white/70 font-sans text-xs sm:text-sm md:text-base leading-relaxed font-light">
                <p>
                  Team VeerRacerss is a high-performance collective forged at the intersection of ambition and precision. We don't just build cars; we engineer platforms for innovation to test the boundaries of electric mobility.
                </p>
                <p>
                  Every component is a testament to student-led design. We are affiliated with SAE India, participating and representing VSSUT in SUPRA SAE, Formula Bharat, FFS INDIA, and Formula Imperial. From topology optimization to advanced powertrain control algorithms, we turn theoretical challenges into visceral, track-dominating reality.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-8 mt-8 sm:mt-12">
                <div className="border-l-4 border-racing-red pl-4 sm:pl-6">
                  <div className="text-3xl sm:text-4xl font-black text-white font-display">200+</div>
                  <div className="text-[10px] uppercase tracking-widest text-racing-red mt-1 sm:mt-2 font-bold font-sans">Squad Members</div>
                </div>
                <div className="border-l-4 border-racing-red pl-4 sm:pl-6">
                  <div className="text-3xl sm:text-4xl font-black text-white font-display">03</div>
                  <div className="text-[10px] uppercase tracking-widest text-racing-red mt-1 sm:mt-2 font-bold font-sans">National Podiums</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-auto sm:aspect-square w-full mt-4 sm:mt-0"
            >
              <div className="w-full h-full flex items-center justify-center p-0 sm:p-4 md:p-12">
                <div className="bg-[#0d0d0d] border border-white/10 p-6 sm:p-8 w-full h-full relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none"></div>
                  <Target className="w-10 h-10 sm:w-12 sm:h-12 text-racing-red mb-6 sm:mb-8" />
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mb-3 sm:mb-4 font-display text-white">Our Mission</h3>
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-sans font-light">
                    To pioneer robust electric racing solutions that accelerate the transition to sustainable high-performance vehicles, while forging the next generation of top-tier engineering talent.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Masonry Moments Grid */}
        <section className="relative min-h-[500px] max-w-7xl mx-auto w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 overflow-hidden flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-8 sm:mb-16 tracking-tight z-10 font-display text-center"
          >
            Pinnacle Moments
          </motion.h2>

          {loading ? (
            <div className="flex justify-center items-center py-32 opacity-50">
               <div className="animate-pulse flex items-center gap-4 text-racing-red font-mono tracking-widest uppercase">
                 Loading Memories...
               </div>
            </div>
          ) : moments.length === 0 ? (
            <div className="text-center text-white/50 py-32 font-mono uppercase tracking-widest">
               No pinnacle moments recorded yet.
            </div>
          ) : (
            <div className="w-full flex flex-col gap-24">
              {Object.keys(momentsByYear).sort((a,b) => Number(b) - Number(a)).map(year => (
                <div key={year} className="w-full">
                  <h3 className="text-4xl md:text-6xl font-black text-racing-red font-mono tracking-tighter mb-8 border-b-2 border-white/15 pb-4 uppercase">
                    [ {year} ]
                  </h3>
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 w-full">
                    {momentsByYear[year].map(m => (
                       <motion.div 
                         key={m.id}
                         initial={{ opacity: 0, y: 10 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         onClick={() => setSelectedImage(m)}
                         className="break-inside-avoid overflow-hidden glass-panel group cursor-zoom-in hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_rgba(225,6,0,1)] transition-all duration-300 ease-out border border-white/20"
                       >
                         <div className="overflow-hidden relative bg-white/5">
                           <img 
                              src={m.image_url} 
                              alt={m.label} 
                              loading="lazy" 
                              className="w-full h-auto object-cover grayscale-[30%] contrast-125 group-hover:grayscale-0 transition-all duration-500" 
                           />
                         </div>
                         <div className="p-6 bg-[#0d0d0d] border-t border-white/10">
                           <p className="text-white/80 text-sm md:text-base leading-relaxed font-mono uppercase tracking-wide">{m.label}</p>
                         </div>
                       </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        <Partners />
      </main>

      {/* Expanded Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 cursor-zoom-out backdrop-blur-md"
          >
            <motion.div
              layoutId={selectedImage.id}
              className="relative max-w-7xl w-full max-h-[90vh] overflow-hidden border border-white/20 bg-[#0d0d0d] shadow-[12px_12px_0px_rgba(225,6,0,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.label} 
                loading="lazy" 
                className="w-full h-[60vh] md:h-[75vh] object-contain bg-black/50"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 bg-black hover:bg-racing-red text-white p-3 border border-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-white/20 p-6 md:p-8">
                <div className="flex gap-4 items-center mb-2">
                  <span className="text-racing-red font-mono text-xl font-bold">[{selectedImage.year}]</span>
                </div>
                <p className="text-white/90 max-w-3xl text-sm md:text-lg leading-relaxed font-mono uppercase tracking-wide">{selectedImage.label}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
