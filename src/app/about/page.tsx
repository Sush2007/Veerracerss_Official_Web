"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Target, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Partners } from "../../components/Partners";
import { createClient } from "@/src/lib/supabase/client";

export default function DetailedAboutPage() {
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
        <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <motion.div 
            className="text-center z-10 px-4"
            style={{ opacity, y }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50"
            >
              The Formula
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-[#FF3E00] font-mono text-sm md:text-base tracking-[0.3em] uppercase mt-4"
            >
              Inside Team VeerRacerss
            </motion.p>
          </motion.div>
        </section>

        {/* Philosophy Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-16 py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
                More than <br/><span className="text-[#FF3E00]">Engineers</span>
              </h2>
              <div className="space-y-6 text-white/60 font-light text-lg leading-relaxed">
                <p>
                  Team VeerRacerss is a high-performance collective forged at the intersection of ambition and precision. We don't just build cars; we engineer platforms for innovation to test the boundaries of electric mobility.
                </p>
                <p>
                  Every component is a testament to student-led design. From topology optimization to advanced powertrain control algorithms, we take theoretical challenges and turn them into visceral, track-dominating reality.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="border-l border-[#FF3E00] pl-6">
                  <div className="text-4xl font-black text-white">40+</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#FF3E00] mt-2">Team Members</div>
                </div>
                <div className="border-l border-[#FF3E00] pl-6">
                  <div className="text-4xl font-black text-white">03</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#FF3E00] mt-2">National Podiums</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square"
            >
              <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_60s_linear_infinite] border-dashed"></div>
              <div className="absolute inset-8 border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
              
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="bg-[#111] border border-white/10 p-8 w-full h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#FF3E00]/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out"></div>
                  <Target className="w-12 h-12 text-[#FF3E00] mb-8" />
                  <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">Our Mission</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    To pioneer robust electric racing solutions that accelerate the transition to sustainable high-performance vehicles, while forging the next generation of top-tier engineering talent.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Masonry Moments Grid */}
        <section className="relative min-h-[500px] max-w-7xl mx-auto w-full py-24 px-4 md:px-16 overflow-hidden flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tight z-10 font-display"
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
                  <h3 className="text-3xl md:text-5xl font-black text-[#FF3E00] font-mono tracking-tighter mb-8 border-b border-white/10 pb-4">
                    {year}
                  </h3>
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 w-full">
                    {momentsByYear[year].map(m => (
                       <motion.div 
                         key={m.id}
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         onClick={() => setSelectedImage(m)}
                         className="break-inside-avoid rounded-2xl overflow-hidden glass-panel border border-white/10 group cursor-zoom-in hover:shadow-[0_0_30px_rgba(255,30,0,0.15)] transition-all duration-500"
                       >
                         <div className="overflow-hidden relative bg-white/5">
                           <img 
                              src={m.image_url} 
                              alt={m.label} 
                              loading="lazy" 
                              className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                           />
                         </div>
                         <div className="p-6 bg-black/60 backdrop-blur-md">
                           <p className="text-white/90 text-sm md:text-base leading-relaxed font-sans">{m.label}</p>
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
              className="relative max-w-7xl w-full max-h-[90vh] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-[#111]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.label} 
                loading="lazy"
                className="w-full h-[60vh] md:h-[75vh] object-contain"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 bg-black/50 hover:bg-[#FF3E00] text-white p-3 rounded-full backdrop-blur-md transition-colors border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 md:p-12">
                <div className="flex gap-4 items-center mb-3">
                  <span className="text-[#FF3E00] font-mono text-xl">{selectedImage.year}</span>
                </div>
                <p className="text-white max-w-3xl text-base md:text-xl leading-relaxed drop-shadow-md">{selectedImage.label}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
