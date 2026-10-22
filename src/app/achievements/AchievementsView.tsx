"use client";

import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Award, 
  Medal, 
  Flag, 
  Sparkles, 
  Users, 
  Calendar, 
  ChevronRight, 
  Car as CarIcon,
  Flame,
  Star,
  Maximize2,
  X,
  Image as ImageIcon
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { Partners } from "../../components/Partners";
import {
  DEFAULT_ACHIEVEMENTS,
  CompetitionAchievement,
  AwardItem,
} from "@/src/data/cms_defaults";
import { createClient } from "@/src/lib/supabase/client";

export type { AwardItem, CompetitionAchievement };

const COMPETITION_ACHIEVEMENTS: CompetitionAchievement[] = DEFAULT_ACHIEVEMENTS;

export function AchievementsView() {
  const [items, setItems] = useState<CompetitionAchievement[]>(DEFAULT_ACHIEVEMENTS);
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedPhoto, setSelectedPhoto] = useState<{ image: string; title: string; year: string } | null>(null);

  // Background Scroll-Lock Effect for Photo Lightbox
  useEffect(() => {
    if (selectedPhoto) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [selectedPhoto]);

  useEffect(() => {
    async function loadAchievements() {
      // 1. Try localStorage
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_achievements");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setItems(parsed);
            }
          }
        } catch {}
      }

      // 2. Try Supabase
      try {
        const supabase = createClient();
        const { data: dbData } = await supabase
          .from("custom_databases")
          .select("records")
          .eq("db_name", "Hall of Fame & Achievements")
          .maybeSingle();

        if (dbData && Array.isArray(dbData.records) && dbData.records.length > 0) {
          setItems(dbData.records as CompetitionAchievement[]);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("vr_achievements", JSON.stringify(dbData.records));
            } catch {}
          }
        }
      } catch {}
    }

    loadAchievements();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "vr_achievements") {
        loadAchievements();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
    };
  }, []);

  const years = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.year) set.add(item.year);
    });
    const sorted = Array.from(set).sort((a, b) => b.localeCompare(a));
    return ["ALL", ...sorted];
  }, [items]);

  const filteredAchievements = useMemo(() => {
    if (selectedYear === "ALL") return items;
    return items.filter((item) => item.year === selectedYear);
  }, [selectedYear, items]);

  const getAwardBadgeStyle = (type: AwardItem["type"]) => {
    switch (type) {
      case "champion":
        return "bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-500/25 text-yellow-300 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.25)]";
      case "runner_up":
        return "bg-slate-300/15 text-slate-200 border-slate-300/40 shadow-[0_0_10px_rgba(226,232,240,0.15)]";
      case "podium":
        return "bg-amber-900/30 text-amber-200 border-amber-600/40 shadow-[0_0_10px_rgba(217,119,6,0.15)]";
      case "special":
        return "bg-racing-red/20 text-white border-racing-red/60 shadow-[0_0_15px_rgba(225,6,0,0.25)]";
      default:
        return "bg-white/5 text-white/90 border-white/10 hover:border-white/30";
    }
  };

  const getAwardIcon = (type: AwardItem["type"]) => {
    switch (type) {
      case "champion":
        return <Trophy className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />;
      case "runner_up":
        return <Medal className="w-4 h-4 text-slate-300 shrink-0" />;
      case "podium":
        return <Award className="w-4 h-4 text-amber-400 shrink-0" />;
      case "special":
        return <Sparkles className="w-4 h-4 text-racing-red shrink-0" />;
      default:
        return <Star className="w-3.5 h-3.5 text-white/50 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-[#050505] text-white selection:bg-racing-red selection:text-white">
      
      {/* Hero Header Section */}
      <section className="relative min-h-[35vh] sm:min-h-[42vh] py-12 md:py-16 flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-b border-white/5">
        <div className="absolute inset-0 telemetry-grid opacity-[0.04] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] sm:text-[12rem] md:text-[18rem] font-display font-black text-white/[0.02] uppercase pointer-events-none whitespace-nowrap z-0">
          VICTORY
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-racing-red/10 rounded-full blur-[160px] pointer-events-none z-0"></div>

        <div className="text-center z-10 px-4 max-w-4xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-black uppercase tracking-tight text-white leading-[0.95]">
              OUR ACHIEVEMENTS
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 font-sans text-xs sm:text-sm md:text-base tracking-[0.1em] uppercase mt-3 sm:mt-4 max-w-2xl font-light"
          >
            Every podium, championship title, and national rank achieved across Formula Bharat, Formula Imperial, and SUPRA SAE.
          </motion.p>

          {/* Key Stat Highlights Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-10 w-full max-w-2xl"
          >
            <div className="bg-[#111111]/80 border border-white/10 p-3 sm:p-4 text-center group">
              <span className="font-display font-black text-2xl sm:text-3xl text-racing-red block">12+</span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/50">National Podiums</span>
            </div>

            <div className="bg-[#111111]/80 border border-white/10 p-3 sm:p-4 text-center group">
              <span className="font-display font-black text-2xl sm:text-3xl text-white block">7+</span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/50">National Campaigns</span>
            </div>

            <div className="bg-[#111111]/80 border border-white/10 p-3 sm:p-4 text-center group">
              <span className="font-display font-black text-2xl sm:text-3xl text-racing-red block">2018–26</span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/50">Continuous Legacy</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-16">
        
        {/* Interactive Year Filter Pill Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-racing-red" />
            <span className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-white">
              Filter by Campaign Year
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {years.map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 rounded-none shrink-0 ${
                  selectedYear === yr
                    ? "bg-racing-red text-white shadow-[0_0_15px_rgba(225,6,0,0.4)] border border-racing-red"
                    : "bg-[#111111] text-white/50 hover:text-white hover:bg-white/5 border border-white/10"
                }`}
              >
                {yr === "ALL" ? "All Seasons" : yr}
              </button>
            ))}
          </div>
        </div>

        {/* Competitions Roster Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedYear}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 sm:space-y-12"
          >
            {filteredAchievements.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`group relative bg-[#0A0A0A] border rounded-none overflow-hidden transition-all duration-500 p-6 sm:p-8 md:p-10 ${
                  item.isChampion
                    ? "border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.08)] hover:border-amber-400"
                    : "border-white/10 hover:border-racing-red/50"
                }`}
              >
                {/* Champion Gold Shimmer Ribbon */}
                {item.isChampion && (
                  <div className="absolute top-0 right-0 z-20 overflow-hidden w-40 h-40 pointer-events-none">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-display font-black text-[9px] tracking-widest uppercase py-1 text-center rotate-45 translate-x-12 translate-y-7 shadow-lg">
                      NATIONAL CHAMPION
                    </div>
                  </div>
                )}

                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                    <span className="bg-racing-red text-white text-[11px] font-mono font-bold px-3 py-1 uppercase tracking-wider">
                      SEASON {item.year}
                    </span>
                    {item.carName && (
                      <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/90 text-[11px] font-mono font-bold px-3 py-1 uppercase tracking-wider">
                        <CarIcon className="w-3.5 h-3.5 text-racing-red" />
                        {item.carName}
                      </span>
                    )}
                    <span className="text-racing-red font-mono text-xs font-bold uppercase tracking-widest">
                      {item.tagline}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-white/40 font-mono text-[11px] uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-racing-red" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Main Content Layout: Photo Showcase + Editorial Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start mb-6">
                  
                  {/* Photo Showcase Frame */}
                  <div className="lg:col-span-5 xl:col-span-4 w-full">
                    {item.image ? (
                      <div 
                        onClick={() => setSelectedPhoto({ image: item.image!, title: item.competition, year: item.year })}
                        className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden bg-black/80 border border-white/10 group-hover:border-racing-red/50 transition-all duration-500 shadow-xl cursor-pointer group/photo"
                        title="Click to view full photo"
                      >
                        <img
                          src={item.image}
                          alt={`${item.competition} Ceremony & Podium`}
                          className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

                        {/* Hover Zoom Hint */}
                        <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-white/15 p-1.5 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>

                        {/* Bottom Tag Bar */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono">
                          <span className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/15 px-2 py-0.5 text-white/90 uppercase">
                            <Trophy className="w-3 h-3 text-racing-red" />
                            <span>OFFICIAL ARCHIVE</span>
                          </span>
                          <span className="text-white/60 text-[9px] uppercase tracking-wider hidden sm:inline">
                            EXPAND PHOTO
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Branded Telemetry Placeholder Frame */
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden bg-[#0c0d12] border border-white/10 flex flex-col items-center justify-center p-6 text-center group-hover:border-white/20 transition-colors">
                        <div className="absolute inset-0 telemetry-grid opacity-15 pointer-events-none"></div>
                        <div className="w-12 h-12 rounded-full bg-racing-red/10 border border-racing-red/30 flex items-center justify-center text-racing-red mb-3">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                          VEERRACERSS ARCHIVE
                        </span>
                        <span className="text-[10px] font-mono text-white/40 uppercase mt-1">
                          {item.competition} • {item.year}
                        </span>
                        <span className="mt-3 text-[9px] font-mono uppercase tracking-widest text-racing-red/80 bg-racing-red/10 border border-racing-red/30 px-2 py-0.5">
                          VERIFIED CAMPAIGN
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details Column: Title, Summary & Awards Grid */}
                  <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between w-full">
                    <div>
                      {/* Main Competition Heading */}
                      <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight mb-3 group-hover:text-racing-red transition-colors">
                        {item.competition}
                      </h2>

                      {/* Brief Summary */}
                      <p className="text-white/70 font-sans text-xs sm:text-sm font-light leading-relaxed mb-6">
                        {item.summary}
                      </p>
                    </div>

                    {/* Official Awards Grid */}
                    <div className="space-y-2.5 sm:space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-2 font-bold">
                        OFFICIAL RECOGNITIONS & PODIUM RANKS
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                        {item.awards.map((award, aIdx) => (
                          <div 
                            key={aIdx}
                            className={`flex items-center gap-2.5 px-3 py-2.5 border transition-all duration-300 ${getAwardBadgeStyle(award.type)}`}
                          >
                            {getAwardIcon(award.type)}
                            <div className="flex flex-col min-w-0">
                              <span className="font-display font-bold text-xs uppercase tracking-wide truncate">
                                {award.title}
                              </span>
                              {award.category && (
                                <span className="text-[9px] font-mono uppercase tracking-wider opacity-70">
                                  {award.category}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Status strip */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40 uppercase">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-racing-red"></span>
                    National Formula Student Campaign
                  </span>
                  <span className="text-white/30 tracking-widest">
                    REF #{item.year}-{item.id.split('-')[0].toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Interactive Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-[#0b0c10] border border-white/20 p-4 sm:p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Trophy className="w-4 h-4 text-racing-red shrink-0" />
                <span className="text-white font-bold uppercase truncate">{selectedPhoto.title}</span>
                <span className="text-white/50 shrink-0">({selectedPhoto.year})</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Photo Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Photo Container */}
            <div className="mt-4 flex-1 overflow-hidden flex items-center justify-center bg-black/60 border border-white/5 p-2">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[72vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Official Sponsors & Backers Footer Section */}
      <Partners />
    </div>
  );
}
