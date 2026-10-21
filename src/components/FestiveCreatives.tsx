"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Eye, Tag, Palette, Calendar } from "lucide-react";
import { CREATIVE_ARTWORKS, CreativeArtwork } from "../data/creatives_data";

type CategoryFilter = "all" | "festivals" | "racedays" | "fests";

export function FestiveCreatives() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const [selectedArtwork, setSelectedArtwork] = useState<CreativeArtwork | null>(null);

  const filteredArtworks = CREATIVE_ARTWORKS.filter((art) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "festivals") return art.category === "festivals";
    if (activeFilter === "racedays") return art.category === "racedays";
    if (activeFilter === "fests") return art.tags.some(t => t.toLowerCase().includes("fest") || t.toLowerCase().includes("induction"));
    return true;
  });

  return (
    <section id="creatives" className="py-20 sm:py-28 bg-[#050505] relative z-10 overflow-hidden border-b border-white/10">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-racing-red/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 bg-racing-red/10 border border-racing-red/30 text-racing-red font-mono text-xs uppercase tracking-widest font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>STUDENT MEDIA & GRAPHIC DESIGN STUDIO</span>
          </motion.div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase text-white tracking-tight leading-[1.05]">
            CREATIVE GALLERY <span className="text-racing-red">//</span> FESTIVE & SEASONAL DESIGNS
          </h2>

          <p className="font-sans text-white/60 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 font-light leading-relaxed">
            Showcasing custom posters and automotive visual art crafted by the VeerRacerss Creative Wing for cultural festivals, track milestones, and club occasions.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            {[
              { id: "all", label: "[ All ]" },
              { id: "festivals", label: "[ Festivals ]" },
              { id: "racedays", label: "[ Race Days ]" },
              { id: "fests", label: "[ Induction & Fests ]" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as CategoryFilter)}
                className={`px-4 sm:px-5 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeFilter === tab.id
                    ? "bg-racing-red text-white shadow-[0_0_20px_rgba(210,39,48,0.5)] border border-racing-red"
                    : "bg-[#0f0f12] text-white/60 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Artwork Grid: 4 Columns on Desktop */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-6"
        >
          <AnimatePresence>
            {filteredArtworks.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setSelectedArtwork(item)}
                className="group relative bg-[#0a0a0d] border border-white/10 hover:border-racing-red/80 p-3 sm:p-3.5 transition-all duration-500 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(210,39,48,0.3)] flex flex-col justify-between"
              >
                {/* Poster Artwork Image Viewport */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050505] border border-white/5 mb-3.5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Subtle Inner Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>

                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 bg-racing-red text-white px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(210,39,48,0.8)]">
                      <Eye className="w-3.5 h-3.5" />
                      <span>EXPAND ARTWORK</span>
                    </div>
                  </div>

                  {/* Corner Brand Watermark */}
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 border border-white/10 text-[9px] font-mono text-white/70 tracking-widest uppercase">
                    VRE CREATIVE
                  </div>
                </div>

                {/* Card Meta Content */}
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-wide uppercase group-hover:text-racing-red transition-colors mb-2">
                    {item.title}
                  </h3>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-white/60 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Attribution */}
                <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3 h-3 text-racing-red" />
                    <span>Designed by {item.designedBy}</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Full-Screen Interactive Lightbox Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtwork(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#0d0d10] border border-racing-red/50 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 shadow-[0_0_60px_rgba(210,39,48,0.4)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-racing-red text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Poster View */}
              <div className="w-full md:w-1/2 aspect-[3/4] bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Detail Breakdown */}
              <div className="w-full md:w-1/2 flex flex-col justify-between py-2">
                <div>
                  <div className="inline-flex items-center gap-2 text-racing-red font-mono text-[10px] tracking-widest uppercase mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedArtwork.date}</span>
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
                    {selectedArtwork.title}
                  </h3>
                  
                  <p className="font-mono text-xs text-racing-red tracking-wider uppercase mb-4">
                    {selectedArtwork.subtitle}
                  </p>

                  <p className="font-sans text-white/70 text-xs sm:text-sm leading-relaxed font-light mb-6">
                    {selectedArtwork.description}
                  </p>

                  {/* Tags */}
                  <div className="mb-6">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                      Categories & Subsystems:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedArtwork.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2.5 py-1 bg-white/5 border border-white/10 text-white/80 uppercase"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-white/50">
                    Produced by <span className="text-white font-bold">{selectedArtwork.designedBy}</span>
                  </div>
                  <button
                    onClick={() => setSelectedArtwork(null)}
                    className="px-4 py-2 bg-racing-red text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-colors"
                  >
                    CLOSE
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
