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
  Star
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { Partners } from "../../components/Partners";

export interface AwardItem {
  title: string;
  rank?: string;
  category?: string;
  type: "champion" | "runner_up" | "podium" | "top10" | "special";
}

export interface CompetitionAchievement {
  id: string;
  year: string;
  competition: string;
  tagline: string;
  location: string;
  carName?: string;
  image?: string;
  isChampion?: boolean;
  featured?: boolean;
  awards: AwardItem[];
  summary: string;
}

const COMPETITION_ACHIEVEMENTS: CompetitionAchievement[] = [
  {
    id: "supra-sae-2026",
    year: "2026",
    competition: "SUPRA SAE INDIA 2026",
    tagline: "National Top-10 Design & Social Excellence",
    location: "Formula Student India Track",
    featured: true,
    awards: [
      {
        title: "BEST SOCIAL MEDIA AWARD",
        category: "Media & Outreach",
        type: "special"
      },
      {
        title: "AIR-9 IN BUSINESS PRESENTATION",
        rank: "AIR 9",
        category: "Static Event",
        type: "top10"
      },
      {
        title: "AIR-10 IN DESIGN PRESENTATION",
        rank: "AIR 10",
        category: "Engineering Design",
        type: "top10"
      },
      {
        title: "AIR-11 IN COST PRESENTATION",
        rank: "AIR 11",
        category: "Manufacturing & Cost",
        type: "top10"
      }
    ],
    summary: "Delivered standout static engineering evaluations at SUPRA SAE India, penetrating the national top-10 across Business & Design while capturing the Best Social Media honor nationwide."
  },
  {
    id: "formula-imperial-2025",
    year: "2025",
    competition: "FORMULA IMPERIAL 2025",
    tagline: "National Champions in Lightweight Chassis & EV Runner-Up",
    location: "Buddh International Circuit, Greater Noida",
    isChampion: true,
    featured: true,
    awards: [
      {
        title: "AIR-1 IN LIGHTEST WEIGHT",
        rank: "AIR 1",
        category: "Structural Dynamics",
        type: "champion"
      },
      {
        title: "AIR-2 IN EV CATEGORY",
        rank: "AIR 2",
        category: "Overall Electric",
        type: "runner_up"
      },
      {
        title: "AIR-2 IN BUSINESS PLAN",
        rank: "AIR 2",
        category: "Commercial Scalability",
        type: "runner_up"
      },
      {
        title: "BEST WOMEN PARTICIPATION",
        category: "Diversity & Inclusion",
        type: "special"
      }
    ],
    summary: "Dominated Buddh International Circuit with an ultralight carbon-tubular architecture, capturing All India Rank 1 in Lightest Weight alongside 2nd overall in the Electric Vehicle division."
  },
  {
    id: "formula-imperial-2024",
    year: "2024",
    competition: "FORMULA IMPERIAL 2024",
    tagline: "National Podium Finish in Electric Class",
    location: "Buddh International Circuit, Greater Noida",
    carName: "AETHER",
    awards: [
      {
        title: "AIR-3 IN EV CATEGORY",
        rank: "AIR 3",
        category: "Overall Electric",
        type: "podium"
      }
    ],
    summary: "Campaigned AETHER—Odisha's first collegiate Formula Student EV—powered by a custom 72V battery pack and PMSM drive to seize the 3rd place National EV podium at BIC."
  },
  {
    id: "formula-imperial-2023",
    year: "2023",
    competition: "FORMULA IMPERIAL 2023",
    tagline: "Double All India Rank 1 & Endurance Champions",
    location: "Formula Imperial Circuit",
    carName: "ZEUS 1.0",
    isChampion: true,
    featured: true,
    awards: [
      {
        title: "AIR-1 IN EV CATEGORY",
        rank: "AIR 1",
        category: "Championship Winner",
        type: "champion"
      },
      {
        title: "AIR-1 IN ENDURANCE (EV)",
        rank: "AIR 1",
        category: "Dynamic Reliability",
        type: "champion"
      },
      {
        title: "AIR-2 IN ENDURANCE (OVERALL)",
        rank: "AIR 2",
        category: "EV + Combustion Overall",
        type: "runner_up"
      },
      {
        title: "AIR-3 IN OVERALL CHAMPIONSHIP",
        rank: "AIR 3",
        category: "National Grand Total",
        type: "podium"
      }
    ],
    summary: "Historic national breakthrough: vehicle ZEUS 1.0 completed a flawless 22km endurance run, crowning VeerRacerss as the All India Rank 1 Electric Champions and Endurance Champions."
  },
  {
    id: "pi-ev-2022",
    year: "2022",
    competition: "PI-EV 2022",
    tagline: "National Leadership in Team Governance",
    location: "Formula Bharat Virtual",
    awards: [
      {
        title: "AIR-4 IN TEAM MANAGEMENT",
        rank: "AIR 4",
        category: "Project Governance",
        type: "top10"
      }
    ],
    summary: "Awarded 4th in India for executive engineering management, financial allocation, and comprehensive supply chain planning."
  },
  {
    id: "ffs-india-2019",
    year: "2019",
    competition: "FFS INDIA 2019",
    tagline: "National Cost Podium & Top-10 Design",
    location: "Kari Motor Speedway, Coimbatore",
    carName: "VENTUS 5.0",
    awards: [
      {
        title: "AIR-3 IN COST",
        rank: "AIR 3",
        category: "Cost & Manufacturing",
        type: "podium"
      },
      {
        title: "AIR-4 IN DESIGN",
        rank: "AIR 4",
        category: "Engineering Design",
        type: "top10"
      },
      {
        title: "AIR-7 OVERALL",
        rank: "AIR 7",
        category: "National Grand Total",
        type: "top10"
      }
    ],
    summary: "Conquered Kari Motor Speedway with Ventus 5.0, achieving a top-3 podium in manufacturing cost optimization and finishing 7th overall nationally."
  },
  {
    id: "formula-bharat-2019",
    year: "2019",
    competition: "FORMULA BHARAT 2019",
    tagline: "National Contender at Kari Motor Speedway",
    location: "Kari Motor Speedway, Coimbatore",
    awards: [
      {
        title: "SECURED AIR 22/70 TEAMS",
        rank: "AIR 22/70",
        category: "Overall Championship",
        type: "top10"
      }
    ],
    summary: "Competed at Kari Motor Speedway against 70 top engineering collegiate teams across the nation, securing All India Rank 22 overall."
  },
  {
    id: "supra-sae-2018",
    year: "2018",
    competition: "SUPRA SAE INDIA 2018",
    tagline: "AIR 9/112 Teams - Most Successful Season in VSSUT Formula SAE History",
    location: "Madras Motor Race Track (MMRT), Chennai",
    carName: "VENTUS 4.0",
    awards: [
      {
        title: "AIR-9 / 112 TEAMS OVERALL",
        rank: "AIR 9/112",
        category: "Overall Championship",
        type: "top10"
      },
      {
        title: "AIR-7 / 112 IN ENDURANCE EVENT",
        rank: "AIR 7/112",
        category: "Dynamic Endurance",
        type: "top10"
      },
      {
        title: "2ND RUNNERS UP IN ENGINEERING DESIGN",
        rank: "AIR 3",
        category: "Engineering Design",
        type: "podium"
      },
      {
        title: "AIR-7 IN BUSINESS COST EVENT",
        rank: "AIR 7",
        category: "Business Cost",
        type: "top10"
      }
    ],
    summary: "The most successful season ever in the history of VSSUT Formula SAE at MMRT Chennai: captured AIR 9 out of 112 teams overall, finished AIR 7 in Endurance, seized 2nd Runners Up in Engineering Design, and placed AIR 7 in the Business Cost Event."
  },
  {
    id: "formula-bharat-2018",
    year: "2018",
    competition: "FORMULA BHARAT 2018",
    tagline: "National Engineering Design Contender",
    location: "Kari Motor Speedway, Coimbatore",
    awards: [
      {
        title: "SECURED AIR 15/55 IN ENGINEERING DESIGN",
        rank: "AIR 15/55",
        category: "Engineering Design",
        type: "top10"
      }
    ],
    summary: "Evaluated by veteran automotive industry judges in rigorous static design evaluations, capturing All India Rank 15 out of 55 teams in Engineering Design."
  }
];

export function AchievementsView() {
  const [selectedYear, setSelectedYear] = useState<string>("ALL");

  const filteredAchievements = useMemo(() => {
    if (selectedYear === "ALL") return COMPETITION_ACHIEVEMENTS;
    return COMPETITION_ACHIEVEMENTS.filter(item => item.year === selectedYear);
  }, [selectedYear]);

  const years = ["ALL", "2026", "2025", "2024", "2023", "2022", "2019", "2018"];

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

                {/* Main Competition Heading */}
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight mb-3 group-hover:text-racing-red transition-colors">
                  {item.competition}
                </h2>

                {/* Brief Summary */}
                <p className="text-white/60 font-sans text-xs sm:text-sm font-light leading-relaxed mb-6 max-w-4xl">
                  {item.summary}
                </p>

                {/* Official Awards Grid */}
                <div className="space-y-2.5 sm:space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">
                    OFFICIAL RECOGNITIONS & PODIUM RANKS
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {item.awards.map((award, aIdx) => (
                      <div 
                        key={aIdx}
                        className={`flex items-center gap-2.5 px-3.5 py-3 border transition-all duration-300 ${getAwardBadgeStyle(award.type)}`}
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

                {/* Bottom Status strip */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40 uppercase">
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

      {/* Official Sponsors & Backers Footer Section */}
      <Partners />
    </div>
  );
}
