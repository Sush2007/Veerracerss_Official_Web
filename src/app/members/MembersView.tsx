"use client";

import { motion } from "motion/react";
import { Users, Shield, Zap, Car, Sliders, Disc, Trophy } from "lucide-react";
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

interface DepartmentSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
}

// Exactly the 4 core engineering departments for Pre-Final & 2nd Years
const DEPARTMENTS: DepartmentSection[] = [
  {
    id: "Powertrain & Drivetrain",
    title: "Powertrain & Drivetrain",
    subtitle: "High Voltage & Tractive Power Subsystem",
    description: "High-voltage accumulator systems, BMS integration, motor controller mapping, inventory, and tractive validation.",
    icon: Zap
  },
  {
    id: "Chassis & Design",
    title: "Chassis & Aerodynamics",
    subtitle: "Spaceframe & Structural Dynamics Subsystem",
    description: "Lightweight tubular spaceframe chassis, torsional rigidity, financial allocation, and aerodynamic envelope.",
    icon: Car
  },
  {
    id: "Suspension & Steering",
    title: "Suspension & Steering",
    subtitle: "Vehicle Kinematics & Handling Subsystem",
    description: "Double wishbone kinematics, bell crank dampers, workshop management, and track handling response.",
    icon: Sliders
  },
  {
    id: "Brakes & Tyres",
    title: "Brakes & Tyres",
    subtitle: "Hydraulic Deceleration & Contact Patch Subsystem",
    description: "Dual-circuit hydraulic braking circuits, brake bias balance, rotor cooling, and tyre thermal grip.",
    icon: Disc
  }
];

function isFourthYear(yearStr?: string): boolean {
  if (!yearStr) return false;
  const lower = yearStr.toLowerCase();
  if (lower.includes("pre-final") || lower.includes("3rd") || lower.includes("2nd") || lower.includes("second")) {
    return false;
  }
  return lower.includes("4th") || lower.includes("final");
}

function getDepartmentForJuniorMember(m: { name?: string; department?: string; subgroup?: string; role?: string }): string {
  const name = (m.name || "").toLowerCase();

  // Merge operations & communications members directly into their engineering departments:
  if (name.includes("devi prasad") || name.includes("achary")) return "Chassis & Design";
  if (name.includes("nrusingha") || name.includes("dalai")) return "Suspension & Steering";
  if (name.includes("tikeshwar") || name.includes("sourav muduly") || name.includes("bineeta")) return "Powertrain & Drivetrain";

  const dept = (m.department || "").toLowerCase();
  const role = (m.role || "").toLowerCase();

  if (role.includes("powertrain") || dept.includes("powertrain")) return "Powertrain & Drivetrain";
  if (role.includes("chassis") || dept.includes("chassis")) return "Chassis & Design";
  if (role.includes("suspension") || dept.includes("suspension")) return "Suspension & Steering";
  if (role.includes("brake") || dept.includes("brake") || dept.includes("tyre")) return "Brakes & Tyres";

  return "Powertrain & Drivetrain";
}

export function MembersView() {
  const initialMembers = useMemo<UnifiedMember[]>(() => {
    const list: UnifiedMember[] = [];

    CORE_LEADERSHIP.forEach(c => {
      list.push({
        name: c.name,
        role: c.role,
        department: isFourthYear(c.year) ? "Final Years" : getDepartmentForJuniorMember(c),
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
          department: getDepartmentForJuniorMember(d),
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
              : getDepartmentForJuniorMember({ name: m.name, department: m.department, subgroup: m.subgroup, role: m.role }),
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

  // 1. All 4th Year leaders kept TOGETHER at the top
  const fourthYearLeaders = useMemo(() => {
    return members.filter(m => isFourthYear(m.year));
  }, [members]);

  // 2. Pre-Final (3rd Year) and 2nd Year members grouped by Department
  const getDeptJuniorMembers = (deptId: string): UnifiedMember[] => {
    const juniors = members.filter(m => !isFourthYear(m.year));
    return juniors
      .filter(m => m.department.toLowerCase() === deptId.toLowerCase())
      .sort((a, b) => {
        // Pre-Final (3rd) first, then 2nd year
        const isPreFinalA = a.year.toLowerCase().includes("pre-final") || a.year.includes("3rd");
        const isPreFinalB = b.year.toLowerCase().includes("pre-final") || b.year.includes("3rd");
        if (isPreFinalA && !isPreFinalB) return -1;
        if (!isPreFinalA && isPreFinalB) return 1;
        return a.name.localeCompare(b.name);
      });
  };

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

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-10 sm:py-16 space-y-14 sm:space-y-20 md:space-y-24">
        
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
                <p className="text-white/30 font-sans text-[11px] uppercase tracking-wider font-mono mt-auto">
                  Tenure: {advisor.tenure}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: 4TH YEARS (FINAL YEARS) KEPT TOGETHER AT THE TOP */}
        <section className="pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col mb-8 sm:mb-12">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">
              COUNCIL & TECHNICAL HEADS (2026–27)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 gap-3">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Final Years &bull; Team Leadership
                </h2>
                <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
                  Executive captains, department heads, and operational directors steering VeerRacerss into national competition.
                </p>
              </div>
              <div className="shrink-0">
                <span className="bg-white/5 border border-white/10 px-3 py-1 text-white/50 font-mono text-xs uppercase tracking-widest">
                  {fourthYearLeaders.length} MEMBERS
                </span>
              </div>
            </div>
          </div>

          {/* 4th Years Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fourthYearLeaders.map((member, idx) => (
              <motion.div
                key={`4th-${member.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.05 }}
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
                </div>

                {/* Member Name */}
                <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold mb-1">
                  {member.role}
                </p>

                {/* Year */}
                <p className="text-white/40 font-sans text-xs uppercase tracking-wider mb-2 font-mono">
                  {member.year}
                </p>

                {/* Description if present */}
                {member.description && (
                  <p className="text-white/60 font-sans text-xs font-light leading-relaxed mt-1">
                    {member.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 3: PRE-FINAL & 2ND YEARS DIVIDED INTO THE 4 ENGINEERING DEPARTMENTS */}
        <section className="pt-6 sm:pt-8 border-t border-white/5 space-y-16 sm:space-y-20">
          <div className="flex flex-col mb-4">
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">
              ENGINEERING SQUADS & SUBSYSTEMS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-racing-red" /> Department Roster (Pre-Final & 2nd Years)
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-2xl font-light">
              Subsystem engineers, junior fabricators, managers, and officers organized by their core engineering department.
            </p>
          </div>

          {DEPARTMENTS.map((dept) => {
            const deptMembers = getDeptJuniorMembers(dept.id);
            if (deptMembers.length === 0) return null;

            const IconComponent = dept.icon;

            return (
              <div key={dept.id} className="scroll-mt-28">
                {/* Department Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 mb-8 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2.5 h-2.5 bg-racing-red rounded-full"></span>
                      <span className="text-racing-red font-mono text-[11px] font-bold uppercase tracking-widest">
                        {dept.subtitle}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-wider text-white flex items-center gap-3">
                      <IconComponent className="w-6 h-6 text-racing-red/80" /> {dept.title}
                    </h3>
                    <p className="text-white/50 font-sans text-xs sm:text-sm mt-1 max-w-2xl font-light">
                      {dept.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <span className="bg-white/5 border border-white/10 px-3 py-1 text-white/50 font-mono text-xs uppercase tracking-widest">
                      {deptMembers.length} {deptMembers.length === 1 ? 'MEMBER' : 'MEMBERS'}
                    </span>
                  </div>
                </div>

                {/* Unified Profiles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deptMembers.map((member, idx) => (
                    <motion.div
                      key={`${dept.id}-${member.name}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (idx % 6) * 0.05 }}
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
                      </div>

                      {/* Member Name */}
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors mb-1">
                        {member.name}
                      </h3>

                      {/* Role */}
                      <p className="text-racing-red font-sans text-xs uppercase tracking-wider font-bold mb-1">
                        {member.role}
                      </p>

                      {/* Year */}
                      <p className="text-white/40 font-sans text-xs uppercase tracking-wider mb-2 font-mono">
                        {member.year}
                      </p>

                      {/* Description if present */}
                      {member.description && (
                        <p className="text-white/60 font-sans text-xs font-light leading-relaxed mt-1">
                          {member.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

      </main>

      <Partners />
    </div>
  );
}
