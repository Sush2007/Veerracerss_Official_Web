"use client";

import { motion } from "motion/react";
import { Users, Shield, Trophy, Award, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Partners } from "../../components/Partners";
import { createClient } from "@/src/lib/supabase/client";
import { 
  CORE_LEADERSHIP, 
  DOMAIN_MEMBERS 
} from "@/src/data/team_database";
import {
  FacultyAdvisor,
  TeamPageSettings,
  DEFAULT_FACULTY_ADVISORS,
  DEFAULT_TEAM_PAGE_SETTINGS
} from "@/src/data/cms_defaults";

export interface UnifiedMember {
  name: string;
  role: string;
  department: string;
  year: string;
  image: string;
  description?: string;
  is_council?: boolean;
  order_index?: number;
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

const PREFINAL_COUNCIL_NAMES = [
  "nrusingha dalai",
  "p. devi prasad achary",
  "devi prasad achary",
  "sourav muduly",
  "bineeta sinha",
  "tikeshwar pradhan"
];

function isPrefinalCouncil(name: string): boolean {
  const lower = (name || "").toLowerCase();
  return PREFINAL_COUNCIL_NAMES.some(n => lower.includes(n) || n.includes(lower));
}

function getMemberDepartment(m: { name?: string; department?: string; subgroup?: string; role?: string }): string {
  const name = (m.name || "").toLowerCase();
  const role = (m.role || "").toLowerCase();
  const dept = (m.department || "").toLowerCase();
  const sub = (m.subgroup || "").toLowerCase();

  // Known council members department mappings
  if (name.includes("nrusingha")) return "Operations & Management";
  if (name.includes("devi prasad")) return "Operations & Management";
  if (name.includes("sourav muduly") || name.includes("bineeta")) return "Operations & Management";
  if (name.includes("tikeshwar")) return "Operations & Management";
  if (name.includes("amritanshu") || name.includes("rohit sharma") || name.includes("atmabhu")) {
    return "Executive & Technical Council";
  }
  if (name.includes("adyasha") || name.includes("debesh") || name.includes("sethi")) {
    return "Operations & Management";
  }
  if (name.includes("panigrahi") || name.includes("puhan")) {
    return "Chassis & Design";
  }
  if (name.includes("radhashyam")) {
    return "Powertrain & Drivetrain";
  }
  if (name.includes("mittal")) {
    return "Suspension & Steering";
  }
  if (name.includes("subudhi")) {
    return "Brakes & Tyres";
  }

  // Explicit Executive Leadership
  if (role.includes("captain") || (role.includes("technical head") && !role.includes("chassis") && !role.includes("powertrain")) || sub.includes("executive council")) {
    if (role.includes("marketing") || role.includes("procurement") || role.includes("sponsor")) {
      return "Operations & Management";
    }
    return "Executive & Technical Council";
  }

  // Check explicit department field if provided
  if (dept && dept !== "Team Lead" && dept !== "Final Years" && dept !== "Engineering Domain") {
    if (dept.includes("chassis")) return "Chassis & Design";
    if (dept.includes("suspension") || dept.includes("steering")) return "Suspension & Steering";
    if (dept.includes("brake") || dept.includes("tyre")) return "Brakes & Tyres";
    if (dept.includes("powertrain") || dept.includes("drivetrain")) return "Powertrain & Drivetrain";
    if (dept.includes("operations") || dept.includes("management") || dept.includes("leadership") || dept.includes("pr ") || dept.includes("public relations")) {
      return "Operations & Management";
    }
    return m.department || "Engineering Domain";
  }

  // Fallbacks by role keywords
  if (role.includes("powertrain") || role.includes("drivetrain") || role.includes("battery") || role.includes("hv ")) {
    return "Powertrain & Drivetrain";
  }
  if (role.includes("chassis") || role.includes("aero") || role.includes("manufactur") || role.includes("design head")) {
    return "Chassis & Design";
  }
  if (role.includes("suspension") || role.includes("steering")) {
    return "Suspension & Steering";
  }
  if (role.includes("brake") || role.includes("tyre")) {
    return "Brakes & Tyres";
  }
  if (role.includes("manager") || role.includes("pr ") || role.includes("treasurer") || role.includes("inventory") || role.includes("officer") || role.includes("event") || role.includes("sponsor") || role.includes("procurement")) {
    return "Operations & Management";
  }

  return "Engineering Domain";
}

// ==========================================
// DOMAIN DEFINITIONS BY YEAR
// ==========================================

export const FINAL_YEAR_DOMAINS = [
  { 
    id: "executive-council", 
    name: "Executive & Technical Council", 
    tagline: "Captaincy, technical integration, race engineering oversight & institutional command" 
  },
  { 
    id: "chassis-design", 
    name: "Chassis & Design", 
    tagline: "Structural spaceframe dynamics, aerodynamic envelope, workshop tooling & precision manufacturing" 
  },
  { 
    id: "powertrain", 
    name: "Powertrain & Drivetrain", 
    tagline: "High-voltage accumulator tractive safety, BMS telemetry & motor controller integration" 
  },
  { 
    id: "suspension", 
    name: "Suspension & Steering", 
    tagline: "Kinematic suspension geometry, dampers, steering accuracy & dynamic track handling" 
  },
  { 
    id: "brakes", 
    name: "Brakes & Tyres", 
    tagline: "Hydraulic circuit validation, thermal heat dissipation, brake bias & tyre compound telemetry" 
  },
  { 
    id: "operations", 
    name: "Operations & Management", 
    tagline: "Corporate sponsorships, supply-chain procurement logistics, event showcase & PR command" 
  }
];

export const FINAL_YEAR_FILTER_OPTIONS = [
  "All",
  "Executive & Technical Council",
  "Chassis & Design",
  "Powertrain & Drivetrain",
  "Suspension & Steering",
  "Brakes & Tyres",
  "Operations & Management"
];

export const PREFINAL_YEAR_DOMAINS = [
  { 
    id: "operations", 
    name: "Operations & Management", 
    tagline: "Daily workshop workflow, financial treasury, media communications & tool inventory control" 
  },
  { 
    id: "powertrain", 
    name: "Powertrain & Drivetrain", 
    tagline: "Cell packaging, thermal insulation, tractive wiring harness & transmission assembly" 
  },
  { 
    id: "chassis", 
    name: "Chassis & Design", 
    tagline: "Spaceframe FEA modeling, cockpit ergonomics, composite aero elements & jig alignment" 
  },
  { 
    id: "suspension", 
    name: "Suspension & Steering", 
    tagline: "Upright packaging, geometry simulation, bell-cranks & rack validation" 
  },
  { 
    id: "brakes", 
    name: "Brakes & Tyres", 
    tagline: "Pedal box assembly, master cylinders, caliper mounting & thermal profiling" 
  }
];

export const PREFINAL_YEAR_FILTER_OPTIONS = [
  "All",
  "Operations & Management",
  "Powertrain & Drivetrain",
  "Chassis & Design",
  "Suspension & Steering",
  "Brakes & Tyres"
];

export const SECOND_YEAR_DOMAINS = [
  { 
    id: "chassis", 
    name: "Chassis & Design", 
    tagline: "Aerodynamics, structural chassis spaceframe, ergonomics & crash safety" 
  },
  { 
    id: "suspension", 
    name: "Suspension & Steering", 
    tagline: "Double-wishbone kinematics, dampers, steering geometry & track dynamics" 
  },
  { 
    id: "brakes", 
    name: "Brakes & Tyres", 
    tagline: "Hydraulic circuit, rotor thermal dissipation, brake bias & tyre compound telemetry" 
  },
  { 
    id: "powertrain", 
    name: "Powertrain & Drivetrain", 
    tagline: "High-voltage accumulator, motor controller integration, cooling & driveline" 
  }
];

export const SECOND_YEAR_FILTER_OPTIONS = [
  "All",
  "Chassis & Design",
  "Suspension & Steering",
  "Brakes & Tyres",
  "Powertrain & Drivetrain"
];

export function MembersView() {
  const initialMembers = useMemo<UnifiedMember[]>(() => {
    const list: UnifiedMember[] = [];

    CORE_LEADERSHIP.forEach(c => {
      list.push({
        name: c.name,
        role: c.role,
        department: c.department || getMemberDepartment(c),
        year: c.year,
        image: c.image,
        description: c.description,
        is_council: true,
        order_index: 0,
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
          is_council: false,
          order_index: 10,
        });
      }
    });

    return list;
  }, []);

  const [members, setMembers] = useState<UnifiedMember[]>(initialMembers);
  const [facultyAdvisors, setFacultyAdvisors] = useState<FacultyAdvisor[]>(DEFAULT_FACULTY_ADVISORS);
  const [teamSettings, setTeamSettings] = useState<TeamPageSettings>(DEFAULT_TEAM_PAGE_SETTINGS);

  const [finalYearFilter, setFinalYearFilter] = useState<string>("All");
  const [preFinalFilter, setPreFinalFilter] = useState<string>("All");
  const [secondYearFilter, setSecondYearFilter] = useState<string>("All");

  useEffect(() => {
    // 1. Check local cached faculty & settings for fast hydration
    if (typeof window !== "undefined") {
      try {
        const cachedFac = localStorage.getItem("vr_faculty_advisors");
        if (cachedFac) {
          const parsed = JSON.parse(cachedFac);
          if (Array.isArray(parsed) && parsed.length > 0) setFacultyAdvisors(parsed);
        }
        const cachedSet = localStorage.getItem("vr_team_settings");
        if (cachedSet) {
          setTeamSettings(JSON.parse(cachedSet));
        }
      } catch {}
    }

    // 2. Fetch live snapshot from /api/admin/sync
    async function loadLiveData() {
      try {
        const res = await fetch("/api/admin/sync", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.faculty && Array.isArray(json.data.faculty) && json.data.faculty.length > 0) {
            setFacultyAdvisors(json.data.faculty);
            try { localStorage.setItem("vr_faculty_advisors", JSON.stringify(json.data.faculty)); } catch {}
          }
          if (json?.data?.team_settings) {
            setTeamSettings(json.data.team_settings);
            try { localStorage.setItem("vr_team_settings", JSON.stringify(json.data.team_settings)); } catch {}
          }
          if (json?.data?.members && Array.isArray(json.data.members) && json.data.members.length > 0) {
            const formatted: UnifiedMember[] = json.data.members.map((m: any) => ({
              name: m.name,
              role: m.role || "Domain Engineer",
              department: getMemberDepartment({ name: m.name, department: m.department, subgroup: m.subgroup, role: m.role }),
              year: m.year_of_study || m.year || "2nd Year",
              image: m.image_url,
              description: m.description,
              is_council: m.is_council,
              order_index: m.order_index ?? 0,
            }));
            setMembers(formatted);
            return;
          }
        }
      } catch (err) {
        console.warn("Sync fetch error, falling back to direct table read:", err);
      }

      // 3. Fallback direct read to Supabase members
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
            department: getMemberDepartment({ name: m.name, department: m.department, subgroup: m.subgroup, role: m.role }),
            year: m.year_of_study || m.year || "2nd Year",
            image: m.image_url,
            description: m.description,
            is_council: m.is_council,
            order_index: m.order_index ?? 0,
          }));
          setMembers(formatted);
        }
      } catch (err) {
        console.warn("Direct Supabase fetch fallback:", err);
      }
    }

    loadLiveData();
  }, []);

  // Helper for member sorting
  const sortMembers = (list: UnifiedMember[]) => {
    if (teamSettings.sort_members_by === "custom_order") {
      return [...list].sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
    }
    if (teamSettings.sort_members_by === "name_asc") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  };

  // 1. Final Years (4th Year)
  const finalYearMembers = useMemo(() => {
    const list = members.filter(m => isFourthYear(m.year));
    const sorted = sortMembers(list);
    if (finalYearFilter === "All") return sorted;
    return sorted.filter(m => m.department.toLowerCase() === finalYearFilter.toLowerCase());
  }, [members, finalYearFilter, teamSettings.sort_members_by]);

  const activeFinalYearDomains = useMemo(() => {
    if (finalYearFilter === "All") return FINAL_YEAR_DOMAINS;
    return FINAL_YEAR_DOMAINS.filter(
      d => d.name.toLowerCase() === finalYearFilter.toLowerCase()
    );
  }, [finalYearFilter]);

  // 2. Pre-Final Years (3rd Year)
  const preFinalMembers = useMemo(() => {
    const rawList = members.filter(m => isThirdYear(m.year));
    
    // Explicit priority order for pre-final council if not in custom_order mode
    if (teamSettings.sort_members_by !== "custom_order" && teamSettings.sort_members_by !== "name_asc") {
      const leadershipNames = [
        "nrusingha dalai",
        "p. devi prasad achary",
        "devi prasad achary",
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
      const ordered = leaders.length > 0 ? [...leaders, ...others] : rawList;

      if (preFinalFilter === "All") return ordered;
      return ordered.filter(m => m.department.toLowerCase() === preFinalFilter.toLowerCase());
    }

    const sorted = sortMembers(rawList);
    if (preFinalFilter === "All") return sorted;
    return sorted.filter(m => m.department.toLowerCase() === preFinalFilter.toLowerCase());
  }, [members, preFinalFilter, teamSettings.sort_members_by]);

  const activePrefinalDomains = useMemo(() => {
    if (preFinalFilter === "All") return PREFINAL_YEAR_DOMAINS;
    return PREFINAL_YEAR_DOMAINS.filter(
      d => d.name.toLowerCase() === preFinalFilter.toLowerCase()
    );
  }, [preFinalFilter]);

  // 3. Second Years (2nd Year)
  const secondYearMembers = useMemo(() => {
    const list = members.filter(m => isSecondYear(m.year));
    const sorted = sortMembers(list);
    if (secondYearFilter === "All") return sorted;
    return sorted.filter(m => m.department.toLowerCase() === secondYearFilter.toLowerCase());
  }, [members, secondYearFilter, teamSettings.sort_members_by]);

  const activeSecondYearDomains = useMemo(() => {
    if (secondYearFilter === "All") return SECOND_YEAR_DOMAINS;
    return SECOND_YEAR_DOMAINS.filter(
      d => d.name.toLowerCase() === secondYearFilter.toLowerCase()
    );
  }, [secondYearFilter]);

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
            {teamSettings.show_faculty && (
              <div className="bg-[#111111]/70 border border-white/10 p-2.5">
                <span className="font-display font-black text-xl sm:text-2xl text-white block">
                  {facultyAdvisors.length}
                </span>
                <span className="text-[10px] font-mono text-white/50 uppercase">Faculty Advisors</span>
              </div>
            )}
            {teamSettings.show_final_years && (
              <div className="bg-[#111111]/70 border border-white/10 p-2.5">
                <span className="font-display font-black text-xl sm:text-2xl text-racing-red block">
                  {members.filter(m => isFourthYear(m.year)).length}
                </span>
                <span className="text-[10px] font-mono text-white/50 uppercase">Final Years</span>
              </div>
            )}
            {teamSettings.show_pre_final_years && (
              <div className="bg-[#111111]/70 border border-white/10 p-2.5">
                <span className="font-display font-black text-xl sm:text-2xl text-white block">
                  {members.filter(m => isThirdYear(m.year)).length}
                </span>
                <span className="text-[10px] font-mono text-white/50 uppercase">Pre-Final Years</span>
              </div>
            )}
            {teamSettings.show_second_years && (
              <div className="bg-[#111111]/70 border border-white/10 p-2.5">
                <span className="font-display font-black text-xl sm:text-2xl text-white block">
                  {members.filter(m => isSecondYear(m.year)).length}
                </span>
                <span className="text-[10px] font-mono text-white/50 uppercase">Second Years</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 sm:py-20 space-y-20 sm:space-y-28">
        
        {/* SECTION 1: FACULTY ADVISORS */}
        {teamSettings.show_faculty && (
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
                    {facultyAdvisors.length} ADVISORS
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
              {facultyAdvisors.map((advisor, idx) => (
                <motion.div
                  key={advisor.id || advisor.name + idx}
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
        )}

        {/* SECTION 2: FINAL YEARS (4TH YEAR) - GROUPED DEPARTMENT-WISE */}
        {teamSettings.show_final_years && (
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

              {/* Department Filter Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto mt-6 pb-2 scrollbar-none">
                <span className="text-[10px] font-mono uppercase text-white/40 mr-1 shrink-0">DEPARTMENT:</span>
                {FINAL_YEAR_FILTER_OPTIONS.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setFinalYearFilter(dept)}
                    className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all rounded-none shrink-0 ${
                      finalYearFilter === dept
                        ? "bg-racing-red text-white border border-racing-red font-bold"
                        : "bg-[#111111] text-white/50 hover:text-white border border-white/10"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Final Years Profiles Grouped Domain-wise */}
            <div className="space-y-14">
              {activeFinalYearDomains.map((domain, domainIdx) => {
                const domainGroupMembers = finalYearMembers.filter(
                  m => m.department.toLowerCase() === domain.name.toLowerCase()
                );
                if (domainGroupMembers.length === 0) return null;

                return (
                  <div key={domain.id} className="space-y-6">
                    {/* Domain Subgroup Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-racing-red"></div>
                        <div>
                          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wide text-white flex items-center gap-2">
                            <span className="text-racing-red text-sm font-mono font-bold mr-1">0{domainIdx + 1}.</span>
                            {domain.name}
                          </h3>
                          <p className="text-white/40 font-sans text-xs font-light">
                            {domain.tagline}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="bg-racing-red/10 border border-racing-red/30 px-2.5 py-1 text-racing-red font-mono text-[11px] font-bold uppercase tracking-wider">
                          {domainGroupMembers.length} {domainGroupMembers.length === 1 ? "LEADER" : "MEMBERS"}
                        </span>
                      </div>
                    </div>

                    {/* Domain Profiles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {domainGroupMembers.map((member, idx) => (
                        <motion.div
                          key={`4th-${member.name}-${idx}`}
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
                              Final Year
                            </div>
                          </div>

                          <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                            {member.name}
                          </h3>

                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold">
                              {member.role}
                            </p>
                            {member.is_council && (
                              <span className="bg-racing-red/15 border border-racing-red/40 px-1.5 py-0.5 text-[9px] font-mono text-racing-red font-bold uppercase tracking-wider">
                                Council
                              </span>
                            )}
                          </div>

                          {member.description && (
                            <p className="text-white/50 font-sans text-[11px] font-light leading-relaxed mt-2 pt-2 border-t border-white/5">
                              {member.description}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 3: PRE-FINAL YEARS (3RD YEAR) - GROUPED DEPARTMENT-WISE */}
        {teamSettings.show_pre_final_years && (
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
                {PREFINAL_YEAR_FILTER_OPTIONS.map(dept => (
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

            {/* Pre-Final Years Profiles Grouped Domain-wise */}
            <div className="space-y-14">
              {activePrefinalDomains.map((domain, domainIdx) => {
                const domainGroupMembers = preFinalMembers.filter(
                  m => m.department.toLowerCase() === domain.name.toLowerCase()
                );
                if (domainGroupMembers.length === 0) return null;

                return (
                  <div key={domain.id} className="space-y-6">
                    {/* Domain Subgroup Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-racing-red"></div>
                        <div>
                          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wide text-white flex items-center gap-2">
                            <span className="text-racing-red text-sm font-mono font-bold mr-1">0{domainIdx + 1}.</span>
                            {domain.name}
                          </h3>
                          <p className="text-white/40 font-sans text-xs font-light">
                            {domain.tagline}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="bg-racing-red/10 border border-racing-red/30 px-2.5 py-1 text-racing-red font-mono text-[11px] font-bold uppercase tracking-wider">
                          {domainGroupMembers.length} {domainGroupMembers.length === 1 ? "ENGINEER" : "MEMBERS"}
                        </span>
                      </div>
                    </div>

                    {/* Domain Profiles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {domainGroupMembers.map((member, idx) => (
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
                              3rd Year
                            </div>
                          </div>

                          <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                            {member.name}
                          </h3>

                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold">
                              {member.role}
                            </p>
                            {isPrefinalCouncil(member.name) && (
                              <span className="bg-racing-red/15 border border-racing-red/40 px-1.5 py-0.5 text-[9px] font-mono text-racing-red font-bold uppercase tracking-wider">
                                Council
                              </span>
                            )}
                          </div>

                          {isPrefinalCouncil(member.name) && (
                            <div className="text-white/50 font-sans text-xs uppercase tracking-wider font-mono mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
                              <span className="text-white/30 text-[10px] font-semibold">DEPT:</span>
                              <span className="text-white/80 font-bold">{member.department}</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 4: SECOND YEARS (2ND YEAR) - GROUPED DOMAIN-WISE */}
        {teamSettings.show_second_years && (
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
                {SECOND_YEAR_FILTER_OPTIONS.map(dept => (
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

            {/* Second Years Profiles Grouped Domain-wise */}
            <div className="space-y-14">
              {activeSecondYearDomains.map((domain, domainIdx) => {
                const domainGroupMembers = secondYearMembers.filter(
                  m => m.department.toLowerCase() === domain.name.toLowerCase()
                );
                if (domainGroupMembers.length === 0) return null;

                return (
                  <div key={domain.id} className="space-y-6">
                    {/* Domain Subgroup Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-racing-red"></div>
                        <div>
                          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wide text-white flex items-center gap-2">
                            <span className="text-racing-red text-sm font-mono font-bold mr-1">0{domainIdx + 1}.</span>
                            {domain.name}
                          </h3>
                          <p className="text-white/40 font-sans text-xs font-light">
                            {domain.tagline}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="bg-racing-red/10 border border-racing-red/30 px-2.5 py-1 text-racing-red font-mono text-[11px] font-bold uppercase tracking-wider">
                          {domainGroupMembers.length} ENGINEERS
                        </span>
                      </div>
                    </div>

                    {/* Domain Profiles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {domainGroupMembers.map((member, idx) => (
                        <motion.div
                          key={`2nd-${member.name}-${idx}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: (idx % 8) * 0.04 }}
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

                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold">
                              {member.role}
                            </p>
                            {member.is_council && (
                              <span className="bg-racing-red/15 border border-racing-red/40 px-1.5 py-0.5 text-[9px] font-mono text-racing-red font-bold uppercase tracking-wider">
                                Council
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>

      <Partners />
    </div>
  );
}
