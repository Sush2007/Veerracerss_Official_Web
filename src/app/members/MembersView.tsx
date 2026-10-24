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

  // 1. Executive Leadership
  if (name.includes("amritanshu") || name.includes("rohit sharma") || name.includes("atmabhu")) {
    return "Executive & Technical Council";
  }

  // 2. Specific Council / Lead member mappings from official records (Exact matching to avoid false positives):
  if (name.includes("suchit")) return "Brakes & Tyres";
  if (name.includes("nrusingha")) return "Suspension & Steering";
  if (name.includes("devi prasad")) return "Chassis & Design";
  if (name.includes("sourav muduly")) return "Powertrain & Drivetrain";
  if (name.includes("bineeta")) return "Powertrain & Drivetrain";
  if (name.includes("tikeshwar")) return "Powertrain & Drivetrain";
  if (name.includes("adyasha")) return "Chassis & Design";
  if (name.includes("debesh")) return "Chassis & Design";
  if (name.includes("darshana") || name.includes("panigrahi") || name.includes("aryean")) return "Chassis & Design";
  if (name.includes("radhashyam")) return "Powertrain & Drivetrain";
  if (name.includes("mittal")) return "Suspension & Steering";
  if (name.includes("subudhi") || name.includes("sethi") || name.includes("abhisek")) return "Brakes & Tyres";

  // Check explicit department field if provided (filtering out legacy flat buckets)
  if (
    dept &&
    dept !== "Team Lead" &&
    dept !== "Final Years" &&
    dept !== "Engineering Domain" &&
    dept !== "Operations & Management" &&
    dept !== "Operations" &&
    dept !== "Leadership"
  ) {
    if (dept.includes("chassis")) return "Chassis & Design";
    if (dept.includes("suspension") || dept.includes("steering")) return "Suspension & Steering";
    if (dept.includes("brake") || dept.includes("tyre")) return "Brakes & Tyres";
    if (dept.includes("powertrain") || dept.includes("drivetrain")) return "Powertrain & Drivetrain";
    return m.department || "Chassis & Design";
  }

  // Fallbacks by role keywords
  if (role.includes("powertrain") || role.includes("drivetrain") || role.includes("battery") || role.includes("hv ")) {
    return "Powertrain & Drivetrain";
  }
  if (
    role.includes("chassis") ||
    role.includes("aero") ||
    role.includes("manufactur") ||
    role.includes("design") ||
    role.includes("procurement") ||
    role.includes("sponsor") ||
    role.includes("treasurer")
  ) {
    return "Chassis & Design";
  }
  if (role.includes("suspension") || role.includes("steering") || role.includes("manager")) {
    return "Suspension & Steering";
  }
  if (role.includes("brake") || role.includes("tyre") || role.includes("event")) {
    return "Brakes & Tyres";
  }

  return "Chassis & Design";
}

// ==========================================
// DOMAIN DEFINITIONS BY YEAR
// (Clean technical domains; operations mapped to respective technical domains)
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
    tagline: "Spaceframe architecture, composite aero elements, precision manufacturing, sponsorships & procurement" 
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
    tagline: "Hydraulic circuit validation, thermal heat dissipation, brake bias, tyre telemetry & event logistics" 
  }
];

export const FINAL_YEAR_FILTER_OPTIONS = [
  "All",
  "Executive & Technical Council",
  "Chassis & Design",
  "Powertrain & Drivetrain",
  "Suspension & Steering",
  "Brakes & Tyres"
];

export const PREFINAL_YEAR_DOMAINS = [
  { 
    id: "chassis", 
    name: "Chassis & Design", 
    tagline: "Spaceframe FEA modeling, cockpit ergonomics, composite aero elements & financial treasury" 
  },
  { 
    id: "powertrain", 
    name: "Powertrain & Drivetrain", 
    tagline: "Cell packaging, tractive wiring harness, transmission assembly, workshop inventory & PR communications" 
  },
  { 
    id: "suspension", 
    name: "Suspension & Steering", 
    tagline: "Upright packaging, geometry simulation, bell-cranks, steering rack validation & team operations" 
  },
  { 
    id: "brakes", 
    name: "Brakes & Tyres", 
    tagline: "Pedal box assembly, master cylinders, caliper mounting & thermal telemetry" 
  }
];

export const PREFINAL_YEAR_FILTER_OPTIONS = [
  "All",
  "Chassis & Design",
  "Powertrain & Drivetrain",
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

/**
 * Sorts profiles inside any domain block:
 * 1. For Executive & Technical Council:
 *    - Team Captain ALWAYS #1
 *    - Vice-Captain ALWAYS #2
 *    - Technical Head ALWAYS #3
 * 2. For all other domains:
 *    - Heads / Leads / Council members ALWAYS at the beginning of that section
 *    - Followed by regular domain engineers
 */
function sortDomainProfiles(profiles: UnifiedMember[], domainName: string): UnifiedMember[] {
  return [...profiles].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    const roleA = (a.role || "").toLowerCase();
    const roleB = (b.role || "").toLowerCase();

    // 1. Executive & Technical Council: Captain ALWAYS #1, Vice-Captain ALWAYS #2, Technical Head ALWAYS #3
    if (domainName.toLowerCase().includes("executive")) {
      const getExecRank = (name: string, role: string) => {
        if (name.includes("amritanshu") || (role.includes("captain") && !role.includes("vice"))) return 1;
        if (name.includes("rohit") || role.includes("vice")) return 2;
        if (name.includes("atmabhu") || role.includes("technical head")) return 3;
        return 10;
      };
      return getExecRank(nameA, roleA) - getExecRank(nameB, roleB);
    }

    // 2. In any other domain: Keep the Head or Council member at the beginning of that section
    const getRank = (m: UnifiedMember, name: string, role: string) => {
      // Primary Domain Heads (Chassis Head, Powertrain Head, Suspension Head, Brakes Head, Team Manager)
      if (role.includes("head") || role.includes("lead") || role.includes("captain") || role.includes("manager")) {
        if (
          role.includes("chassis & design head") ||
          role.includes("powertrain & drivetrain head") ||
          role.includes("suspension & steering head") ||
          role.includes("brakes & tyres head")
        ) {
          return 1;
        }
        if (role.includes("manufacturing head")) return 2;
        if (role.includes("procurement head")) return 3;
        if (role.includes("marketing") || role.includes("sponsorship")) return 4;
        if (role.includes("manager")) return 5;
        return 6;
      }

      // Council Members, Officers, Treasurers
      if (m.is_council || role.includes("treasurer") || role.includes("p.r.o") || role.includes("officer") || role.includes("inventory") || isPrefinalCouncil(name)) {
        if (role.includes("treasurer")) return 7;
        if (role.includes("inventory")) return 8;
        if (role.includes("p.r.o") || role.includes("pr officer")) return 9;
        return 10;
      }

      // Domain Engineers
      return 20;
    };

    const rankA = getRank(a, nameA, roleA);
    const rankB = getRank(b, nameB, roleB);
    if (rankA !== rankB) return rankA - rankB;

    // Within same rank, sort by order_index if defined, else alphabetically
    if (typeof a.order_index === "number" && typeof b.order_index === "number") {
      if (a.order_index !== b.order_index) return a.order_index - b.order_index;
    }

    return a.name.localeCompare(b.name);
  });
}

export function MembersView() {
  const initialMembers = useMemo<UnifiedMember[]>(() => {
    const list: UnifiedMember[] = [];

    CORE_LEADERSHIP.forEach(c => {
      list.push({
        name: c.name,
        role: c.role,
        department: getMemberDepartment(c),
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

  // 1. Final Years (4th Year)
  const finalYearMembers = useMemo(() => {
    const list = members.filter(m => isFourthYear(m.year));
    if (finalYearFilter === "All") return list;
    return list.filter(m => m.department.toLowerCase() === finalYearFilter.toLowerCase());
  }, [members, finalYearFilter]);

  const activeFinalYearDomains = useMemo(() => {
    if (finalYearFilter === "All") return FINAL_YEAR_DOMAINS;
    return FINAL_YEAR_DOMAINS.filter(
      d => d.name.toLowerCase() === finalYearFilter.toLowerCase()
    );
  }, [finalYearFilter]);

  // 2. Pre-Final Years (3rd Year)
  const preFinalMembers = useMemo(() => {
    const list = members.filter(m => isThirdYear(m.year));
    if (preFinalFilter === "All") return list;
    return list.filter(m => m.department.toLowerCase() === preFinalFilter.toLowerCase());
  }, [members, preFinalFilter]);

  const activePrefinalDomains = useMemo(() => {
    if (preFinalFilter === "All") return PREFINAL_YEAR_DOMAINS;
    return PREFINAL_YEAR_DOMAINS.filter(
      d => d.name.toLowerCase() === preFinalFilter.toLowerCase()
    );
  }, [preFinalFilter]);

  // 3. Second Years (2nd Year)
  const secondYearMembers = useMemo(() => {
    const list = members.filter(m => isSecondYear(m.year));
    if (secondYearFilter === "All") return list;
    return list.filter(m => m.department.toLowerCase() === secondYearFilter.toLowerCase());
  }, [members, secondYearFilter]);

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
                        (e.target as HTMLImageElement).src = "/members/default-avatar.svg";
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
                const rawMembers = finalYearMembers.filter(
                  m => m.department.toLowerCase() === domain.name.toLowerCase()
                );
                // Apply strict ordering: Captain & Vice Captain before Technical Head; Heads at beginning
                const domainGroupMembers = sortDomainProfiles(rawMembers, domain.name);
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
                                (e.target as HTMLImageElement).src = "/members/default-avatar.svg";
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
                const rawMembers = preFinalMembers.filter(
                  m => m.department.toLowerCase() === domain.name.toLowerCase()
                );
                // Keep Heads / Council members at beginning of each domain
                const domainGroupMembers = sortDomainProfiles(rawMembers, domain.name);
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
                                (e.target as HTMLImageElement).src = "/members/default-avatar.svg";
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
                const rawMembers = secondYearMembers.filter(
                  m => m.department.toLowerCase() === domain.name.toLowerCase()
                );
                const domainGroupMembers = sortDomainProfiles(rawMembers, domain.name);
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
                                (e.target as HTMLImageElement).src = "/members/default-avatar.svg";
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
