"use client";

import { motion, AnimatePresence } from "motion/react";
import { Users, Shield, Trophy, Award, Sparkles, Filter, Briefcase } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Partners } from "../../components/Partners";
import { createClient } from "@/src/lib/supabase/client";
import { 
  FACULTY_ADVISORS, 
  CORE_LEADERSHIP, 
  DOMAIN_MEMBERS 
} from "@/src/data/team_database";

export interface UnifiedMember {
  name: string;
  role: string;
  department: string;
  year: string;
  image: string;
  description?: string;
  is_council?: boolean;
}

function isFourthYear(yearStr?: string): boolean {
  if (!yearStr) return false;
  const lower = yearStr.toLowerCase();
  if (lower.includes("pre-final") || lower.includes("3rd") || lower.includes("2nd") || lower.includes("second")) {
    return false;
  }
  return lower.includes("4th") || lower.includes("final");
}

function isThirdYear(yearStr?: string): boolean {
  if (!yearStr) return false;
  const lower = yearStr.toLowerCase();
  return lower.includes("pre-final") || lower.includes("3rd") || lower.includes("third");
}

function isSecondYear(yearStr?: string): boolean {
  if (!yearStr) return false;
  const lower = yearStr.toLowerCase();
  return lower.includes("2nd") || lower.includes("second");
}

function getMemberDepartment(m: { name?: string; department?: string; subgroup?: string; role?: string }): string {
  const role = (m.role || "").toLowerCase();
  const dept = (m.department || "").toLowerCase();

  if (role.includes("powertrain") || dept.includes("powertrain") || role.includes("drivetrain") || dept.includes("drivetrain")) {
    return "Powertrain & Drivetrain";
  }
  if (role.includes("chassis") || dept.includes("chassis") || role.includes("aero") || dept.includes("aero")) {
    return "Chassis & Design";
  }
  if (role.includes("suspension") || dept.includes("suspension") || role.includes("steering") || dept.includes("steering")) {
    return "Suspension & Steering";
  }
  if (role.includes("brake") || dept.includes("brake") || role.includes("tyre") || dept.includes("tyre")) {
    return "Brakes & Tyres";
  }
  if (role.includes("manager") || role.includes("pr ") || role.includes("treasurer") || role.includes("inventory") || role.includes("officer")) {
    return "Operations & Management";
  }

  return "Engineering Domain";
}

export function MembersView() {
  const initialMembers = useMemo<UnifiedMember[]>(() => {
    const list: UnifiedMember[] = [];

    CORE_LEADERSHIP.forEach(c => {
      list.push({
        name: c.name,
        role: c.role,
        department: isFourthYear(c.year) ? "Final Years" : getMemberDepartment(c),
        year: c.year,
        image: c.image,
        description: c.description,
        is_council: true
      });
    });

    DOMAIN_MEMBERS.forEach(d => {
      if (!list.some(m => m.name.toLowerCase() === d.name.toLowerCase())) {
        list.push({
          name: d.name,
          role: d.role,
          department: getMemberDepartment(d),
          year: d.year,
          image: d.image,
          description: undefined,
          is_council: false
        });
      }
    });

    return list;
  }, []);

  const [members, setMembers] = useState<UnifiedMember[]>(initialMembers);
  const [preFinalFilter, setPreFinalFilter] = useState<string>("All");
  const [secondYearFilter, setSecondYearFilter] = useState<string>("All");

  useEffect(() => {
    async function loadMembersFromSupabase() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted: UnifiedMember[] = data.map((m: any) => ({
            name: m.name,
            role: m.role || "Domain Engineer",
            department: isFourthYear(m.year) 
              ? "Final Years" 
              : getMemberDepartment({ name: m.name, department: m.department, subgroup: m.subgroup, role: m.role }),
            year: m.year || "2nd Year",
            image: m.image_url,
            description: m.description,
            is_council: m.is_council
          }));
          setMembers(formatted);
        }
      } catch (err) {
        console.warn("Supabase fetch fallback to static data:", err);
      }
    }
    loadMembersFromSupabase();
  }, []);

  // 1. Final Years (4th Year)
  const finalYearMembers = useMemo(() => {
    return members.filter(m => isFourthYear(m.year));
  }, [members]);

  // 2. Pre-Final Years (3rd Year) - Team Manager, Treasurer (second), PR Officers, Inventory Head, then Domain Engineers
  const preFinalMembers = useMemo(() => {
    const rawList = members.filter(m => isThirdYear(m.year));
    
    // Explicit priority order: Team Manager first, Treasurer second, PR Officers, Inventory Head
    const leadershipNames = [
      "nrusingha dalai",
      "p. devi prasad achary",
      "sourav muduly",
      "bineeta sinha",
      "tikeshwar pradhan"
    ];

    const getLeaderIndex = (name: string) => {
      const lower = name.toLowerCase();
      return leadershipNames.findIndex(n => lower.includes(n) || n.includes(lower));
    };

    const leaders = rawList
      .filter(m => getLeaderIndex(m.name) !== -1)
      .sort((a, b) => getLeaderIndex(a.name) - getLeaderIndex(b.name));

    const others = rawList.filter(m => getLeaderIndex(m.name) === -1);

    const orderedList = leaders.length > 0
      ? [...leaders, ...others]
      : rawList;

    if (preFinalFilter === "All") return orderedList;
    return orderedList.filter(m => m.department.toLowerCase() === preFinalFilter.toLowerCase());
  }, [members, preFinalFilter]);

  // 3. Second Years (2nd Year)
  const secondYearMembers = useMemo(() => {
    const list = members.filter(m => isSecondYear(m.year));
    if (secondYearFilter === "All") return list;
    return list.filter(m => m.department.toLowerCase() === secondYearFilter.toLowerCase());
  }, [members, secondYearFilter]);

  const departmentFilterOptions = [
    "All",
    "Powertrain & Drivetrain",
    "Chassis & Design",
    "Suspension & Steering",
    "Brakes & Tyres",
    "Operations & Management"
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-[#050505] text-white selection:bg-racing-red selection:text-white">
      
      {/* Header Hero Section */}
      <section className="relative min-h-[30vh] sm:min-h-[38vh] py-12 md:py-16 flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-b border-white/5">
        <div className="absolute inset-0 telemetry-grid opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] sm:text-[11rem] md:text-[16rem] font-display font-black text-white/[0.02] uppercase pointer-events-none whitespace-nowrap z-0">
          TEAM
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-racing-red/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

        <div className="text-center z-10 px-4 max-w-4xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-racing-red/10 border border-racing-red/30 mb-3">
              <Sparkles className="w-3 h-3 text-racing-red" />
              <span className="text-racing-red font-mono font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase">
                THE ACTIVE ROSTER
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black uppercase tracking-tight text-white leading-none">
              OUR TEAM
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 font-sans text-xs sm:text-sm tracking-[0.12em] uppercase mt-3 sm:mt-4 max-w-xl font-light"
          >
            The engineers, builders, and drivers powering Odisha's premier Formula Student electric racing team.
          </motion.p>

          {/* Quick Roster Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 w-full max-w-2xl text-center"
          >
            <div className="bg-[#111111]/70 border border-white/10 p-2.5">
              <span className="font-display font-black text-xl sm:text-2xl text-white block">
                {FACULTY_ADVISORS.length}
              </span>
              <span className="text-[10px] font-mono text-white/50 uppercase">Faculty Advisors</span>
            </div>
            <div className="bg-[#111111]/70 border border-white/10 p-2.5">
              <span className="font-display font-black text-xl sm:text-2xl text-racing-red block">
                {finalYearMembers.length}
              </span>
              <span className="text-[10px] font-mono text-white/50 uppercase">Final Years</span>
            </div>
            <div className="bg-[#111111]/70 border border-white/10 p-2.5">
              <span className="font-display font-black text-xl sm:text-2xl text-white block">
                {members.filter(m => isThirdYear(m.year)).length}
              </span>
              <span className="text-[10px] font-mono text-white/50 uppercase">Pre-Final Years</span>
            </div>
            <div className="bg-[#111111]/70 border border-white/10 p-2.5">
              <span className="font-display font-black text-xl sm:text-2xl text-white block">
                {members.filter(m => isSecondYear(m.year)).length}
              </span>
              <span className="text-[10px] font-mono text-white/50 uppercase">Second Years</span>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 sm:py-20 space-y-20 sm:space-y-28">
        
        {/* SECTION 1: FACULTY ADVISORS */}
        <section id="faculty">
          <div className="flex flex-col mb-8 sm:mb-12">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">
              ACADEMIC PATRONAGE
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 gap-3">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Faculty Advisors
                </h2>
                <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
                  Distinguished professors and faculty members of VSSUT Burla providing strategic counsel, institutional backing, and technical oversight.
                </p>
              </div>
              <div className="shrink-0">
                <span className="bg-white/5 border border-white/10 px-3 py-1 text-white/50 font-mono text-xs uppercase tracking-widest">
                  {FACULTY_ADVISORS.length} ADVISORS
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACULTY_ADVISORS.map((advisor, idx) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                  <img 
                    src={advisor.image} 
                    alt={advisor.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {advisor.name}
                </h3>
                <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold mb-1">
                  {advisor.role}
                </p>
                <p className="text-white/40 font-sans text-xs uppercase tracking-wider mb-2 font-mono">
                  {advisor.department}
                </p>
                <p className="text-white/30 font-sans text-[11px] uppercase tracking-wider font-mono mt-auto pt-2 border-t border-white/5">
                  Tenure: {advisor.tenure}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: FINAL YEARS (4TH YEAR) */}
        <section id="final-years" className="pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col mb-8 sm:mb-12">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">
              COUNCIL & TECHNICAL HEADS
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 gap-3">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Final Years
                </h2>
                <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
                  Executive captains, department heads, and operational directors steering VeerRacerss into national competition.
                </p>
              </div>
              <div className="shrink-0">
                <span className="bg-white/5 border border-white/10 px-3 py-1 text-white/50 font-mono text-xs uppercase tracking-widest">
                  {finalYearMembers.length} MEMBERS
                </span>
              </div>
            </div>
          </div>

          {/* 4th Years Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {finalYearMembers.map((member, idx) => (
              <motion.div
                key={`4th-${member.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 8) * 0.05 }}
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
              >
                {/* Profile Image with Square Dimension */}
                <div className="relative aspect-square overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 border border-white/10 text-[9px] font-mono uppercase text-white/70 tracking-wider">
                    Final Year
                  </div>
                </div>

                {/* Member Name */}
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold mb-1">
                  {member.role}
                </p>

                {/* Description if present */}
                {member.description && (
                  <p className="text-white/50 font-sans text-[11px] font-light leading-relaxed mt-2 pt-2 border-t border-white/5">
                    {member.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 3: PRE-FINAL YEARS (3RD YEAR) */}
        <section id="pre-final-years" className="pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col mb-8 sm:mb-12">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">
              MANAGEMENT & TECHNICAL SUBSYSTEMS
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 gap-3">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Pre-Final Years
                </h2>
                <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
                  Team managers, officers, treasurers, and subsystem engineers driving design execution and testing.
                </p>
              </div>
              <div className="shrink-0">
                <span className="bg-white/5 border border-white/10 px-3 py-1 text-white/50 font-mono text-xs uppercase tracking-widest">
                  {preFinalMembers.length} MEMBERS
                </span>
              </div>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto mt-6 pb-2 scrollbar-none">
              <span className="text-[10px] font-mono uppercase text-white/40 mr-1 shrink-0">DEPARTMENT:</span>
              {departmentFilterOptions.map(dept => (
                <button
                  key={dept}
                  onClick={() => setPreFinalFilter(dept)}
                  className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all rounded-none shrink-0 ${
                    preFinalFilter === dept
                      ? "bg-racing-red text-white border border-racing-red font-bold"
                      : "bg-[#111111] text-white/50 hover:text-white border border-white/10"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Pre-Final Years Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {preFinalMembers.map((member, idx) => (
              <motion.div
                key={`3rd-${member.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 8) * 0.05 }}
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 border border-white/10 text-[9px] font-mono uppercase text-white/70 tracking-wider">
                    3rd Year (Pre-Final)
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {member.name}
                </h3>

                <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold mb-1">
                  {member.role}
                </p>

                <p className="text-white/40 font-sans text-xs uppercase tracking-wider font-mono mt-auto pt-2 border-t border-white/5">
                  {member.department}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 4: SECOND YEARS (2ND YEAR) */}
        <section id="second-years" className="pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col mb-8 sm:mb-12">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">
              JUNIOR ENGINEERING ROSTER
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 gap-3">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Second Years
                </h2>
                <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
                  Junior engineers, fabricators, and subsystem designers working across powertrain, chassis, suspension, and brakes.
                </p>
              </div>
              <div className="shrink-0">
                <span className="bg-white/5 border border-white/10 px-3 py-1 text-white/50 font-mono text-xs uppercase tracking-widest">
                  {secondYearMembers.length} MEMBERS
                </span>
              </div>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto mt-6 pb-2 scrollbar-none">
              <span className="text-[10px] font-mono uppercase text-white/40 mr-1 shrink-0">DEPARTMENT:</span>
              {departmentFilterOptions.filter(d => d !== "Operations & Management").map(dept => (
                <button
                  key={dept}
                  onClick={() => setSecondYearFilter(dept)}
                  className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all rounded-none shrink-0 ${
                    secondYearFilter === dept
                      ? "bg-racing-red text-white border border-racing-red font-bold"
                      : "bg-[#111111] text-white/50 hover:text-white border border-white/10"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Second Years Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {secondYearMembers.map((member, idx) => (
              <motion.div
                key={`2nd-${member.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 8) * 0.05 }}
                className="bg-[#0A0A0A] border border-white/5 hover:border-racing-red/50 p-5 sm:p-6 flex flex-col group transition-all duration-500 rounded-none relative overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-[#111111] mb-4 sm:mb-5 border border-white/5 group-hover:border-racing-red/30 transition-colors">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 border border-white/10 text-[9px] font-mono uppercase text-white/70 tracking-wider">
                    2nd Year
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {member.name}
                </h3>

                <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold mb-1">
                  {member.role}
                </p>

                <p className="text-white/40 font-sans text-xs uppercase tracking-wider font-mono mt-auto pt-2 border-t border-white/5">
                  {member.department}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      <Partners />
    </div>
  );
}
