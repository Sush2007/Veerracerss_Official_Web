"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { Search, Linkedin, Mail, Users, Shield, Award } from "lucide-react";
import { Partners } from "../../components/Partners";
import { 
  FACULTY_ADVISORS, 
  CORE_LEADERSHIP, 
  TEAM_COHORTS, 
} from "@/src/data/team_database";

export function MembersView() {
  const [selectedCohort, setSelectedCohort] = useState<string>("2026");
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get members for selected cohort
  const cohortMembers = useMemo(() => {
    return TEAM_COHORTS[selectedCohort] || [];
  }, [selectedCohort]);

  // Extract unique subgroups for the selected cohort
  const availableSubgroups = useMemo(() => {
    const groups = new Set<string>();
    cohortMembers.forEach(m => {
      if (m.subgroup) groups.add(m.subgroup);
    });
    return ["All", ...Array.from(groups)];
  }, [cohortMembers]);

  // Filtered members by subgroup & search query
  const filteredMembers = useMemo(() => {
    return cohortMembers.filter(m => {
      const matchesSubgroup = selectedSubgroup === "All" || m.subgroup === selectedSubgroup;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        m.name.toLowerCase().includes(query) || 
        m.role.toLowerCase().includes(query) ||
        (m.subgroup && m.subgroup.toLowerCase().includes(query));
      return matchesSubgroup && matchesSearch;
    });
  }, [cohortMembers, selectedSubgroup, searchQuery]);

  return (
    <div className="min-h-screen pt-24 bg-[#050505] text-white selection:bg-racing-red selection:text-white">
      
      {/* Header Hero Section */}
      <section className="relative min-h-[35vh] py-12 md:h-[50vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-b border-white/5">
        <div className="absolute inset-0 telemetry-grid opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[12rem] md:text-[18rem] font-display font-black text-white/[0.02] uppercase pointer-events-none whitespace-nowrap z-0">
          TEAM
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-racing-red/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

        <div className="text-center z-10 px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <span className="text-racing-red font-sans font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase block mb-2 sm:mb-3">
              THE RACING SQUAD
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[100px] font-black uppercase tracking-tight text-white">
              OUR TEAM
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white/60 font-sans text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-3 sm:mt-4 max-w-lg"
          >
            The engineers, drivers, and minds powering Odisha's premier Formula Student EV.
          </motion.p>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 sm:py-20 space-y-16 sm:space-y-24 md:space-y-32">
        
        {/* SECTION 1: FACULTY ADVISORS */}
        <section>
          <div className="flex flex-col mb-8 sm:mb-12">
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
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/40 p-5 sm:p-6 flex flex-col items-center text-center group transition-colors duration-500 rounded-none relative overflow-hidden"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 sm:mb-6 border border-white/10 group-hover:border-racing-red/60 transition-colors duration-500 bg-[#111111] shrink-0">
                  <img 
                    src={advisor.image} 
                    alt={advisor.name} 
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-wide mb-1">
                  {advisor.name}
                </h3>
                <span className="text-racing-red font-sans text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2">
                  {advisor.role}
                </span>
                <span className="text-white/50 font-sans text-xs font-light">
                  {advisor.department}
                </span>
                <span className="text-white/30 font-sans text-[10px] tracking-widest uppercase mt-3 pt-3 border-t border-white/5 w-full">
                  {advisor.tenure}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: CORE LEADERSHIP */}
        <section>
          <div className="flex flex-col mb-8 sm:mb-12">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2">
              EXECUTIVE COUNCIL
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Team Leadership
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
              Captaincy and department leads driving technical execution, sponsor relations, and on-track performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CORE_LEADERSHIP.map((leader, idx) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-[#111111] mb-4 sm:mb-6 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-0 right-0 bg-racing-red px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase text-white">
                    {leader.role}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {leader.name}
                </h3>
                <span className="text-white/40 font-sans text-xs uppercase tracking-wider mb-3 sm:mb-4 font-mono">
                  {leader.subgroup}
                </span>
                <p className="text-white/60 font-sans text-xs font-light leading-relaxed mb-5 sm:mb-6 flex-grow">
                  {leader.description}
                </p>

                {leader.linkedin && (
                  <a 
                    href={leader.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors pt-3 sm:pt-4 border-t border-white/5"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-racing-red" />
                    <span>CONNECT ON LINKEDIN</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 3: FULL ROSTER WITH TABS & FILTERS */}
        <section id="roster" className="pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div>
              <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">
                FULL SQUAD ARCHIVE
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-5xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-racing-red" /> Team Members Roster
              </h2>
            </div>

            {/* Cohort Tabs (2026, 2025, 2024) */}
            <div className="flex items-center gap-1 sm:gap-2 bg-[#0A0A0A] p-1 sm:p-1.5 border border-white/10 rounded-none w-full sm:w-auto">
              {(["2026", "2025", "2024"] as const).map(cohort => (
                <button
                  key={cohort}
                  onClick={() => {
                    setSelectedCohort(cohort);
                    setSelectedSubgroup("All");
                  }}
                  className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-sans font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-300 rounded-none text-center ${
                    selectedCohort === cohort
                      ? "bg-racing-red text-white shadow-[0_0_20px_rgba(210,39,48,0.4)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  COUNCIL {cohort}
                </button>
              ))}
            </div>
          </div>

          {/* Subgroup Filters & Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 justify-between items-stretch lg:items-center bg-[#0A0A0A] border border-white/5 p-3 sm:p-4 mb-8 sm:mb-10">
            {/* Subgroup Filters: Horizontally Scrollable on Mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
              <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase text-white/40 tracking-wider mr-1 shrink-0 hidden sm:inline">
                CATEGORY:
              </span>
              {availableSubgroups.map(subgroup => (
                <button
                  key={subgroup}
                  onClick={() => setSelectedSubgroup(subgroup)}
                  className={`shrink-0 px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider transition-all duration-200 border whitespace-nowrap ${
                    selectedSubgroup === subgroup
                      ? "border-racing-red bg-racing-red/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {subgroup}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full lg:w-auto lg:min-w-[280px]">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search member or role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 focus:border-racing-red pl-10 pr-4 py-2 text-xs font-sans text-white placeholder-white/40 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Member Count Indicator */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/40 font-mono mb-4 sm:mb-6 uppercase tracking-wider">
            <span>SHOWING {filteredMembers.length} ACTIVE PROFILES</span>
            <span className="truncate max-w-[150px] sm:max-w-none text-right">COHORT {selectedCohort} // {selectedSubgroup.toUpperCase()}</span>
          </div>

          {/* Member Profiles Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${selectedCohort}-${selectedSubgroup}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5"
            >
              {filteredMembers.map(member => (
                <div 
                  key={`${member.name}-${member.role}`}
                  className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-3 sm:p-4 flex flex-col group transition-all duration-300 rounded-none relative overflow-hidden"
                >
                  {/* Photo */}
                  <div className="relative aspect-square overflow-hidden bg-[#111111] mb-3 border border-white/5">
                    <img 
                      src={member.image} 
                      alt={`${member.name} - ${member.role} VeerRacerss`} 
                      loading="lazy"
                      className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-0 left-0 bg-black/70 px-2 py-0.5 text-[9px] font-mono tracking-widest text-white/60">
                      {member.subgroup.split(' ')[0]}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-white uppercase tracking-wide group-hover:text-racing-red transition-colors line-clamp-1">
                        {member.name}
                      </h4>
                      <p className="font-sans text-[9px] sm:text-[10px] text-white/50 font-light leading-snug mt-1 line-clamp-2">
                        {member.role}
                      </p>
                    </div>

                    {/* Socials */}
                    {member.socials && Object.keys(member.socials).length > 0 && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                        {member.socials.linkedin && (
                          <a 
                            href={member.socials.linkedin} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-white/40 hover:text-racing-red transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.socials.email && (
                          <a 
                            href={`mailto:${member.socials.email}`} 
                            className="text-white/40 hover:text-racing-red transition-colors"
                            title="Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredMembers.length === 0 && (
            <div className="text-center py-20 bg-[#0A0A0A] border border-white/5">
              <p className="text-white/40 text-sm font-sans uppercase tracking-widest">
                No members found matching your search query.
              </p>
            </div>
          )}
        </section>

      </main>

      <Partners />
    </div>
  );
}
