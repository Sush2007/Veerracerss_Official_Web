"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { Zap, Battery, Shield, Wind, ArrowRight, Gauge, Layers, CheckCircle2 } from "lucide-react";

const SUBSYSTEM_CALLOUTS = [
  {
    id: "powertrain",
    title: "POWERTRAIN",
    headline: "10 kW PMSM Motor",
    specs: "85 Nm Peak Torque • Direct Chain Reduction • Regenerative Braking",
    icon: Zap,
    color: "from-amber-500/20 to-transparent",
    border: "border-amber-500/40",
    accent: "text-amber-400"
  },
  {
    id: "accumulator",
    title: "ACCUMULATOR",
    headline: "72V High-Energy Li-Ion Pack",
    specs: "In-House BMS • Active Thermal Monitoring • IP67 Isolation",
    icon: Battery,
    color: "from-emerald-500/20 to-transparent",
    border: "border-emerald-500/40",
    accent: "text-emerald-400"
  },
  {
    id: "chassis",
    title: "CHASSIS",
    headline: "AISI 4130 Chromoly Spaceframe",
    specs: "182 kg Curb Weight • Torsional Stiffness > 1450 Nm/deg • FIA Egress",
    icon: Shield,
    color: "from-cyan-500/20 to-transparent",
    border: "border-cyan-500/40",
    accent: "text-cyan-400"
  },
  {
    id: "aero",
    title: "AERO PACKAGE",
    headline: "Dual-Element Carbon Wings",
    specs: "CFD Optimised Endplates • Drag Reduction System • High Downforce",
    icon: Wind,
    color: "from-racing-red/20 to-transparent",
    border: "border-racing-red/40",
    accent: "text-racing-red"
  }
];

const BENCHMARKS = [
  { label: "TOP SPEED", value: "115", unit: "KM/H" },
  { label: "ACCELERATION 0-100", value: "3.1", unit: "SEC" },
  { label: "BATTERY VOLTAGE", value: "72", unit: "VOLTS" },
  { label: "CHASSIS WEIGHT", value: "182", unit: "KG" },
];

export function CarSpotlight() {
  const [activeTab, setActiveTab] = useState<"render" | "track">("render");

  return (
    <section id="car-spotlight" className="py-20 sm:py-28 bg-[#070707] relative z-10 overflow-hidden border-b border-white/10">
      
      {/* Background Blueprint Grid Lines & Faded Watermark */}
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-display font-black text-white/[0.015] uppercase pointer-events-none select-none whitespace-nowrap">
        AETHER // EV
      </div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 mb-2 text-racing-red font-mono text-[11px] uppercase tracking-widest font-bold">
              <span className="w-2 h-0.5 bg-racing-red"></span>
              <span>FLAGSHIP PROTOTYPE INSPECTION</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase text-white tracking-tight">
              THE MACHINE <span className="text-racing-red">//</span> AETHER 2024-25
            </h2>
            <p className="font-sans text-white/60 text-xs sm:text-sm md:text-base mt-2 font-light max-w-xl">
              Engineered from the ground up by student engineers at VSSUT Burla. Passing rigorous technical scrutiny at Formula Imperial.
            </p>
          </motion.div>

          {/* View Toggles & Fleet Link */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-[#111114] border border-white/10 p-1">
              <button
                onClick={() => setActiveTab("render")}
                className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  activeTab === "render"
                    ? "bg-racing-red text-white shadow-[0_0_15px_rgba(210,39,48,0.5)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                PADDOCK CAD
              </button>
              <button
                onClick={() => setActiveTab("track")}
                className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  activeTab === "track"
                    ? "bg-racing-red text-white shadow-[0_0_15px_rgba(210,39,48,0.5)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                TRACK PHOTO
              </button>
            </div>

            <Link
              href="/cars"
              className="inline-flex items-center gap-2 text-white/70 hover:text-racing-red font-mono text-xs uppercase tracking-wider font-semibold transition-colors py-2"
            >
              <span>INSPECT ALL 6 CARS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Central Vehicle Stage with 4 Corner Callouts */}
        <div className="relative w-full rounded-none border border-white/10 bg-[#09090b] p-4 sm:p-8 lg:p-12 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-racing-red/10 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Top & Bottom Subsystem Callout Cards for Mobile/Tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {SUBSYSTEM_CALLOUTS.map((callout, index) => {
              const Icon = callout.icon;
              return (
                <motion.div
                  key={callout.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-[#0d0d10] border ${callout.border} p-4 sm:p-5 flex flex-col justify-between group hover:border-white/40 transition-all relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${callout.color} pointer-events-none`}></div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono font-bold tracking-widest ${callout.accent} uppercase`}>
                        {callout.title}
                      </span>
                      <Icon className={`w-4 h-4 ${callout.accent}`} />
                    </div>
                    <h3 className="text-sm sm:text-base font-display font-bold text-white tracking-wide uppercase">
                      {callout.headline}
                    </h3>
                  </div>
                  <p className="text-[11px] font-sans text-white/50 leading-relaxed font-light mt-2 border-t border-white/5 pt-2">
                    {callout.specs}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Main Visual Car Showcase */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/10] overflow-hidden bg-[#050505] border border-white/10 group">
            {activeTab === "render" ? (
              <img
                src="/cars/aether-spotlight.jpg"
                alt="VeerRacerss AETHER Flagship Prototype Telemetry Blueprint"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
            ) : (
              <img
                src="/cars/aether.jpg"
                alt="VeerRacerss AETHER on Buddh International Circuit track"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
            )}

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

            {/* Bottom HUD Overlay on Car Image */}
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-[10px] sm:text-xs font-mono text-white/80 uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-racing-red" />
                <span>FORMULA IMPERIAL NATIONAL PODIUM P3 OVERALL</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase hidden md:inline">
                TELEMETRY VALIDATED AT 10,000 RPM
              </span>
            </div>
          </div>

        </div>

        {/* Quick Benchmarks 4-Col Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {BENCHMARKS.map((item, idx) => (
            <div key={idx} className="bg-[#0b0b0e] border border-white/10 p-4 sm:p-6 flex flex-col justify-between">
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">{item.label}</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-display font-black text-white">{item.value}</span>
                <span className="text-xs font-mono font-bold text-racing-red">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Centered CTA */}
        <div className="flex justify-center">
          <Link
            href="/cars"
            className="inline-flex items-center gap-3 bg-racing-red/10 border border-racing-red/40 hover:border-racing-red hover:bg-racing-red text-white px-8 py-4 font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_20px_rgba(210,39,48,0.2)] hover:shadow-[0_0_30px_rgba(210,39,48,0.6)] group"
          >
            <span>VIEW FULL VEHICLE TELEMETRY & CAR SPECIFICATIONS</span>
            <ArrowRight className="w-4 h-4 text-racing-red group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

      </div>
    </section>
  );
}
