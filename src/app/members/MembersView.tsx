"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { Search, Linkedin, Mail, Users, Shield } from "lucide-react";
import { Partners } from "../../components/Partners";
import { 
  FACULTY_ADVISORS, 
  CORE_LEADERSHIP, 
  ACTIVE_MEMBERS,
  TEAM_DEPARTMENTS,
  TeamMemberProfile
} from "@/src/data/team_database";

const YEAR_ORDER: Record<string, number> = {
  "Final Year (4th Year)": 1,
  "3rd Year (Pre-Final)": 2,
  "2nd Year": 3,
};

export function MembersView() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter & Sort Members by Department, Year, and Search
  const filteredMembers = useMemo(() => {
    return ACTIVE_MEMBERS.filter(m => {
      const matchesDept = selectedDept === "All" || m.department === selectedDept;
      const matchesYear = selectedYear === "All" || m.year === selectedYear;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        m.name.toLowerCase().includes(query) || 
        m.role.toLowerCase().includes(query) ||
        m.department.toLowerCase().includes(query) ||
        (m.regdNo && m.regdNo.includes(query));
      return matchesDept && matchesYear && matchesSearch;
    }).sort((a, b) => {
      const orderA = YEAR_ORDER[a.year] || 99;
      const orderB = YEAR_ORDER[b.year] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }, [selectedDept, selectedYear, searchQuery]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-[#050505] text-white selection:bg-racing-red selection:text-white">
      
      {/* Header Hero Section */}
      <section className="relative min-h-[30vh] sm:min-h-[35vh] py-12 md:h-[45vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-b border-white/5">
        <div className="absolute inset-0 telemetry-grid opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] sm:text-[11rem] md:text-[16rem] font-display font-black text-white/[0.02] uppercase pointer-events-none whitespace-nowrap z-0">
          TEAM
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-racing-red/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

        <div className="text-center z-10 px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <span className="text-racing-red font-sans font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase block mb-2 sm:mb-3">
              THE RACING SQUAD
            </span>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[80px] font-black uppercase tracking-tight text-white">
              OUR TEAM
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white/60 font-sans text-xs sm:text-sm tracking-[0.12em] sm:tracking-[0.16em] uppercase mt-2 sm:mt-3 max-w-lg"
          >
            The engineers, builders, and drivers powering Odisha's premier Formula Student EV.
          </motion.p>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-10 sm:py-16 space-y-14 sm:space-y-20 md:space-y-28">
        
        {/* SECTION 1: FACULTY ADVISORS */}
        <section>
          <div className="flex flex-col mb-6 sm:mb-10">
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
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                  <img 
                    src={advisor.image} 
                    alt={advisor.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                  <div className="absolute top-0 right-0 bg-racing-red px-2.5 py-1 text-[9px] font-sans font-bold tracking-widest uppercase text-white">
                    {advisor.tenure}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {advisor.name}
                </h3>
                <p className="text-racing-red font-sans text-xs uppercase tracking-wider mb-2 font-bold">
                  {advisor.role}
                </p>
                <p className="text-white/40 font-sans text-xs uppercase tracking-wider mb-4 font-mono">
                  {advisor.department}
                </p>

                <a 
                  href={advisor.profileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors pt-3 border-t border-white/5 mt-auto"
                >
                  <span>OFFICIAL VSSUT PROFILE</span>
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: CORE LEADERSHIP */}
        <section>
          <div className="flex flex-col mb-6 sm:mb-10">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2">
              EXECUTIVE DESK
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Team Leadership
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
              Executive captains, managers, and operational heads steering VeerRacerss into national competitions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CORE_LEADERSHIP.map((leader, idx) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                  <div className="absolute top-0 right-0 bg-racing-red px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase text-white">
                    {leader.role}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {leader.name}
                </h3>
                <span className="text-white/40 font-sans text-xs uppercase tracking-wider mb-2 font-mono">
                  {leader.subgroup}
                </span>
                <p className="text-white/60 font-sans text-xs font-light leading-relaxed mb-4 flex-grow">
                  {leader.description}
                </p>

                {leader.linkedin && (
                  <a 
                    href={leader.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors pt-3 border-t border-white/5"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-racing-red" />
                    <span>CONNECT ON LINKEDIN</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 3: FULL ROSTER ORGANIZED BY DEPARTMENT & SORTED BY YEAR */}
        <section id="roster" className="pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col mb-6 sm:mb-8">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">
              ENGINEERING & OPERATIONAL DOMAINS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-5xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-racing-red" /> Department Roster
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
              Profiles organized by domain and sorted hierarchically: Final Years (Leads), 3rd Years (Pre-Finals), and 2nd Years.
            </p>
          </div>

          {/* Department Selection Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
            <button
              onClick={() => setSelectedDept("All")}
              className={`shrink-0 px-3.5 sm:px-5 py-2 text-[11px] sm:text-xs font-sans font-bold tracking-wider uppercase transition-all duration-200 border whitespace-nowrap ${
                selectedDept === "All"
                  ? "bg-racing-red text-white border-racing-red shadow-[0_0_15px_rgba(210,39,48,0.4)]"
                  : "bg-[#0A0A0A] border-white/10 text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              ALL DEPARTMENTS ({ACTIVE_MEMBERS.length})
            </button>
            {TEAM_DEPARTMENTS.map(dept => {
              const count = ACTIVE_MEMBERS.filter(m => m.department === dept).length;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`shrink-0 px-3.5 sm:px-5 py-2 text-[11px] sm:text-xs font-sans font-bold tracking-wider uppercase transition-all duration-200 border whitespace-nowrap ${
                    selectedDept === dept
                      ? "bg-racing-red text-white border-racing-red shadow-[0_0_15px_rgba(210,39,48,0.4)]"
                      : "bg-[#0A0A0A] border-white/10 text-white/60 hover:text-white hover:border-white/30"
                  }`}
                >
                  {dept.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Strip: Year Selector & Search Input */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center bg-[#0A0A0A] border border-white/5 p-3 sm:p-4 mb-6 sm:mb-8">
            {/* Year Filter Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
              <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase text-white/40 tracking-wider mr-1 shrink-0 hidden sm:inline">
                YEAR:
              </span>
              {["All", "Final Year (4th Year)", "3rd Year (Pre-Final)", "2nd Year"].map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`shrink-0 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider transition-all duration-200 border whitespace-nowrap ${
                    selectedYear === yr
                      ? "border-racing-red bg-racing-red/15 text-white"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {yr === "All" ? "ALL YEARS" : yr.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-auto sm:min-w-[280px]">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search member, role, regd no..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 focus:border-racing-red pl-10 pr-4 py-2 text-xs font-sans text-white placeholder-white/40 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Member Count Telemetry Bar */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/40 font-mono mb-4 sm:mb-6 uppercase tracking-wider">
            <span>SHOWING {filteredMembers.length} ACTIVE MEMBERS</span>
            <span className="truncate max-w-[180px] sm:max-w-none text-right">
              {selectedDept.toUpperCase()} // {selectedYear.toUpperCase()}
            </span>
          </div>

          {/* Member Profiles Grid: Full Color by Default */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${selectedDept}-${selectedYear}-${searchQuery}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5"
            >
              {filteredMembers.map((member: TeamMemberProfile) => (
                <div 
                  key={`${member.name}-${member.role}`}
                  className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-3 sm:p-4 flex flex-col group transition-all duration-300 rounded-none relative overflow-hidden"
                >
                  {/* Photo: Full Color by Default */}
                  <div className="relative aspect-square overflow-hidden bg-[#111111] mb-3 border border-white/5">
                    <img 
                      src={member.image} 
                      alt={`${member.name} - ${member.role} VeerRacerss`} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                      onError={(e) => {
                        // Fallback avatar
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                      }}
                    />
                    {/* Year / Rank Badge */}
                    <div className="absolute top-0 right-0 bg-racing-red/90 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-mono tracking-widest text-white uppercase font-bold">
                      {member.year.includes("4th") ? "4TH YR" : member.year.includes("3rd") ? "3RD YR" : "2ND YR"}
                    </div>

                    {/* Department Tag */}
                    <div className="absolute bottom-0 left-0 bg-black/80 px-1.5 py-0.5 text-[8px] font-mono tracking-wider text-white/70 uppercase">
                      {member.department.split(" ")[0]}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-white uppercase tracking-wide group-hover:text-racing-red transition-colors line-clamp-1">
                        {member.name}
                      </h4>
                      <p className="font-sans text-[9px] sm:text-[10px] text-white/60 font-light leading-snug mt-1 line-clamp-2">
                        {member.role}
                      </p>
                      {member.regdNo && (
                        <p className="font-mono text-[8px] text-white/30 mt-1 uppercase">
                          REG: {member.regdNo}
                        </p>
                      )}
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
            <div className="text-center py-16 bg-[#0A0A0A] border border-white/5">
              <p className="text-white/40 text-xs sm:text-sm font-sans uppercase tracking-widest">
                No members found matching your search or filter criteria.
              </p>
            </div>
          )}
        </section>

      </main>

      <Partners />
    </div>
  );
}
