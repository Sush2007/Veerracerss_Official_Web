"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Battery, Shield, Wind, ArrowRight } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { DEFAULT_FEATURED_MACHINE, FeaturedMachine } from "@/src/data/cms_defaults";

export function CarSpotlight() {
  const [machine, setMachine] = useState<FeaturedMachine>(DEFAULT_FEATURED_MACHINE);
  const [activeTab, setActiveTab] = useState<"render" | "track">("render");
  const [activeSubsystem, setActiveSubsystem] = useState<"powertrain" | "accumulator" | "chassis" | "aero">("powertrain");

  useEffect(() => {
    async function loadMachine() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("featured_machine")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          setMachine({
            car_name: data.car_name || DEFAULT_FEATURED_MACHINE.car_name,
            season_tag: data.season_tag || DEFAULT_FEATURED_MACHINE.season_tag,
            description: data.description || DEFAULT_FEATURED_MACHINE.description,
            cad_image_url: data.cad_image_url || DEFAULT_FEATURED_MACHINE.cad_image_url,
            track_image_url: data.track_image_url || DEFAULT_FEATURED_MACHINE.track_image_url,
            top_speed_val: data.top_speed_val || DEFAULT_FEATURED_MACHINE.top_speed_val,
            accel_val: data.accel_val || DEFAULT_FEATURED_MACHINE.accel_val,
            voltage_val: data.voltage_val || DEFAULT_FEATURED_MACHINE.voltage_val,
            weight_val: data.weight_val || DEFAULT_FEATURED_MACHINE.weight_val,
            powertrain_headline: data.powertrain_headline || DEFAULT_FEATURED_MACHINE.powertrain_headline,
            powertrain_specs: data.powertrain_specs || DEFAULT_FEATURED_MACHINE.powertrain_specs,
            accumulator_headline: data.accumulator_headline || DEFAULT_FEATURED_MACHINE.accumulator_headline,
            accumulator_specs: data.accumulator_specs || DEFAULT_FEATURED_MACHINE.accumulator_specs,
            chassis_headline: data.chassis_headline || DEFAULT_FEATURED_MACHINE.chassis_headline,
            chassis_specs: data.chassis_specs || DEFAULT_FEATURED_MACHINE.chassis_specs,
            aero_headline: data.aero_headline || DEFAULT_FEATURED_MACHINE.aero_headline,
            aero_specs: data.aero_specs || DEFAULT_FEATURED_MACHINE.aero_specs,
          });
        }
      } catch {
        // Fallback remains active
      }
    }
    loadMachine();
  }, []);

  const subsystems = [
    {
      id: "powertrain" as const,
      name: "POWERTRAIN",
      icon: Zap,
      headline: machine.powertrain_headline,
      specs: machine.powertrain_specs,
      accent: "text-amber-400",
      border: "border-amber-400/40",
    },
    {
      id: "accumulator" as const,
      name: "BATTERY PACK",
      icon: Battery,
      headline: machine.accumulator_headline,
      specs: machine.accumulator_specs,
      accent: "text-emerald-400",
      border: "border-emerald-400/40",
    },
    {
      id: "chassis" as const,
      name: "SPACEFRAME",
      icon: Shield,
      headline: machine.chassis_headline,
      specs: machine.chassis_specs,
      accent: "text-cyan-400",
      border: "border-cyan-400/40",
    },
    {
      id: "aero" as const,
      name: "AERODYNAMICS",
      icon: Wind,
      headline: machine.aero_headline,
      specs: machine.aero_specs,
      accent: "text-racing-red",
      border: "border-racing-red/40",
    },
  ];

  const currentSubsystem = subsystems.find((s) => s.id === activeSubsystem) || subsystems[0];
  const SubsystemIcon = currentSubsystem.icon;

  return (
    <section id="car-spotlight" className="py-16 sm:py-24 bg-[#070709] relative z-10 overflow-hidden border-b border-white/10">
      
      {/* Background Watermark & Grid */}
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-display font-black text-white/[0.015] uppercase pointer-events-none select-none whitespace-nowrap">
        {machine.car_name}
      </div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header: Clean & Uncluttered */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-racing-red font-mono text-[11px] uppercase tracking-widest font-bold">
              <span className="w-2 h-0.5 bg-racing-red"></span>
              <span>{machine.season_tag}</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase text-white tracking-tight">
              THE CAR <span className="text-racing-red">//</span> {machine.car_name}
            </h2>
            <p className="font-sans text-white/60 text-xs sm:text-sm md:text-base mt-2 font-light max-w-2xl leading-relaxed">
              {machine.description}
            </p>
          </div>

          {/* View Toggles & Fleet Link */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-[#111115] border border-white/10 p-1">
              <button
                onClick={() => setActiveTab("render")}
                className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  activeTab === "render"
                    ? "bg-racing-red text-white shadow-[0_0_15px_rgba(210,39,48,0.5)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                STUDIO CAD
              </button>
              <button
                onClick={() => setActiveTab("track")}
                className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  activeTab === "track"
                    ? "bg-racing-red text-white shadow-[0_0_15px_rgba(210,39,48,0.5)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                ON-TRACK
              </button>
            </div>

            <Link
              href="/cars"
              className="inline-flex items-center gap-2 text-white/70 hover:text-racing-red font-mono text-xs uppercase tracking-wider font-semibold transition-colors py-2"
            >
              <span>ALL 6 CARS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Central Vehicle Stage: Heroic, Clean & Open */}
        <div className="relative w-full rounded-none border border-white/10 bg-[#09090b] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] mb-8">
          
          {/* Main Visual Frame */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/10] overflow-hidden bg-[#050505] group">
            <img
              src={activeTab === "render" ? machine.cad_image_url : machine.track_image_url}
              alt={`${machine.car_name} Prototype`}
              className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700"
            />
            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none"></div>

            {/* Bottom Status Tag */}
            <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1.5 text-[10px] sm:text-xs font-mono text-white/90 uppercase">
              <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
              <span>{machine.car_name} • RACING SPECIFICATION</span>
            </div>
          </div>

          {/* Interactive Subsystem Dock (Replaces the 4 stacked cards) */}
          <div className="p-4 sm:p-6 lg:p-8 bg-[#0c0d11] border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest mr-2 hidden md:inline">
                SELECT SUBSYSTEM:
              </span>
              {subsystems.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSubsystem(s.id)}
                  className={`px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activeSubsystem === s.id
                      ? "bg-white text-black font-extrabold shadow-md"
                      : "bg-[#14151a] text-white/60 hover:text-white border border-white/5"
                  }`}
                >
                  <s.icon className={`w-3.5 h-3.5 ${activeSubsystem === s.id ? "text-racing-red" : s.accent}`} />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>

            {/* Subsystem Details Card */}
            <motion.div
              key={currentSubsystem.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-4 sm:p-5 bg-black/50 border ${currentSubsystem.border} flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono font-bold tracking-widest ${currentSubsystem.accent} uppercase`}>
                    {currentSubsystem.name} ENGINEERING
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-wide uppercase">
                  {currentSubsystem.headline}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-sans text-white/70 max-w-xl font-light leading-relaxed">
                {currentSubsystem.specs}
              </p>
            </motion.div>
          </div>

        </div>

        {/* 4-Metric Benchmark Bar: Crisp, Horizontal & Minimal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#0b0b0e] border border-white/10 p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">TOP SPEED</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-display font-black text-white">{machine.top_speed_val}</span>
              <span className="text-xs font-mono font-bold text-racing-red">KM/H</span>
            </div>
          </div>
          <div className="bg-[#0b0b0e] border border-white/10 p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">ACCELERATION 0-100</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-display font-black text-white">{machine.accel_val}</span>
              <span className="text-xs font-mono font-bold text-racing-red">SEC</span>
            </div>
          </div>
          <div className="bg-[#0b0b0e] border border-white/10 p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">BATTERY PACK</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-display font-black text-white">{machine.voltage_val}</span>
              <span className="text-xs font-mono font-bold text-racing-red">VOLTS</span>
            </div>
          </div>
          <div className="bg-[#0b0b0e] border border-white/10 p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">CURB WEIGHT</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-display font-black text-white">{machine.weight_val}</span>
              <span className="text-xs font-mono font-bold text-racing-red">KG</span>
            </div>
          </div>
        </div>

        {/* View Full Telemetry Link */}
        <div className="flex justify-center">
          <Link
            href="/cars"
            className="inline-flex items-center gap-3 bg-white/5 border border-white/20 hover:border-racing-red hover:bg-racing-red text-white px-8 py-3.5 font-mono font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-md group"
          >
            <span>VIEW FULL FLEET SPECIFICATIONS</span>
            <ArrowRight className="w-4 h-4 text-racing-red group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

      </div>
    </section>
  );
}
