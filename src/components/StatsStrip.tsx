"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Trophy, Award, Users, Cpu, Flame } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { DEFAULT_SITE_SETTINGS } from "@/src/data/cms_defaults";

const DEFAULT_PADDOCK_STATS = [
  {
    icon: Trophy,
    stat: "P3",
    unit: "OVERALL",
    label: "NATIONAL PODIUM",
    detail: "Formula Imperial EV at Buddh International Circuit",
  },
  {
    icon: Award,
    stat: "AIR 1",
    unit: "TROPHY",
    label: "LIGHTEST EV",
    detail: "Lowest curb weight in national formula scrutiny",
  },
  {
    icon: Users,
    stat: "55+",
    unit: "ENGINEERS",
    label: "STUDENT SQUAD",
    detail: "Multi-disciplinary R&D and race crew",
  },
  {
    icon: Cpu,
    stat: "6",
    unit: "GENERATIONS",
    label: "EV FLEET ITERATIONS",
    detail: "Ventus series through flagship Aether",
  },
  {
    icon: Flame,
    stat: "100%",
    unit: "IN-HOUSE",
    label: "FABRICATION & CODE",
    detail: "Spaceframe, BMS, aerodynamics & telemetry",
  },
];

const ICONS = [Trophy, Award, Users, Cpu, Flame];

export function StatsStrip() {
  const [stats, setStats] = useState(DEFAULT_PADDOCK_STATS);

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("site_settings").select("telemetry_stats").limit(1).maybeSingle();

        let localTelemetry: any = null;
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("vr_telemetry_stats");
            if (raw) localTelemetry = JSON.parse(raw);
          } catch {}
        }

        const rawList = data?.telemetry_stats || localTelemetry || DEFAULT_SITE_SETTINGS.telemetry_stats;
        if (Array.isArray(rawList) && rawList.length > 0) {
          const merged = rawList.map((item: any, idx: number) => ({
            icon: ICONS[idx % ICONS.length] || Trophy,
            stat: item.stat || DEFAULT_PADDOCK_STATS[idx]?.stat || "0",
            unit: item.unit || DEFAULT_PADDOCK_STATS[idx]?.unit || "",
            label: item.label || DEFAULT_PADDOCK_STATS[idx]?.label || "TELEMETRY",
            detail: item.detail || DEFAULT_PADDOCK_STATS[idx]?.detail || "",
          }));
          setStats(merged);
        }
      } catch {
        // Fallback already in state
      }
    }

    loadTelemetry();
  }, []);

  return (
    <section className="w-full bg-[#080808] border-b border-white/10 py-8 sm:py-12 relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        
        {/* Subtle Paddock Header Tag */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-6 sm:mb-8 text-[10px] font-mono tracking-widest text-white/40 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-racing-red rounded-none"></span>
            <span>OFFICIAL RACING TRACK RECORD // VSSUT BURLA MOTORSPORT</span>
          </div>
          <span className="hidden sm:inline text-racing-red font-bold">FIA FORMULA STUDENT COMPLIANT</span>
        </div>

        {/* 5-Column Formula Timing Style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={item.label + index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ type: "spring", damping: 18, stiffness: 90, delay: index * 0.08 }}
                className={`flex flex-col justify-between p-4 sm:p-5 lg:px-6 bg-[#0c0c0e] lg:bg-transparent border border-white/5 lg:border-none group hover:bg-white/[0.02] transition-colors rounded-none ${
                  index === 4 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-white/40 uppercase">
                      TELEMETRY 0{index + 1}
                    </span>
                    <Icon className="w-4 h-4 text-racing-red group-hover:scale-110 transition-transform" strokeWidth={1.8} />
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl sm:text-3xl lg:text-4xl text-white font-display font-black tracking-tight uppercase group-hover:text-racing-red transition-colors">
                      {item.stat}
                    </span>
                    <span className="text-[10px] font-mono text-racing-red font-bold tracking-wider uppercase">
                      {item.unit}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-sans font-bold text-white uppercase tracking-wider mb-1.5">
                    {item.label}
                  </h3>
                </div>

                <p className="text-[11px] font-sans text-white/50 leading-relaxed font-light mt-2 border-t border-white/5 pt-2">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
