"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DEFAULT_FACULTY_ADVISORS, FacultyAdvisor } from "@/src/data/cms_defaults";

export function Faculty({ initialAdvisors }: { initialAdvisors?: FacultyAdvisor[] }) {
  const [advisors, setAdvisors] = useState<FacultyAdvisor[]>(() => {
    if (initialAdvisors && initialAdvisors.length > 0) return initialAdvisors;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("vr_faculty_advisors");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_FACULTY_ADVISORS;
  });

  useEffect(() => {
    async function loadFaculty() {
      try {
        const res = await fetch("/api/admin/sync", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.faculty && Array.isArray(json.data.faculty) && json.data.faculty.length > 0) {
            setAdvisors(json.data.faculty);
            try {
              localStorage.setItem("vr_faculty_advisors", JSON.stringify(json.data.faculty));
            } catch {}
          }
        }
      } catch (e) {
        // Fallback to static advisors on network failure
      }
    }
    loadFaculty();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A] relative z-10 border-t border-white/5 overflow-hidden" id="faculty">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] md:text-[20rem] font-display font-black text-white/[0.015] uppercase pointer-events-none whitespace-nowrap z-0">
        ADVISORS
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-racing-red/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px] mb-2 sm:mb-3 block">
              ACADEMIC COUNCIL
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-tight">
              FACULTY ADVISORS
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {advisors.map((faculty, index) => (
            <motion.div 
              key={faculty.name + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-[#111111] border border-white/5 hover:border-racing-red/40 p-5 sm:p-6 flex flex-col items-center text-center group transition-colors duration-500 rounded-none relative overflow-hidden"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-5 sm:mb-6 border border-white/10 group-hover:border-racing-red/60 transition-colors duration-500 bg-[#0A0A0A] shrink-0">
                <img 
                  src={faculty.image} 
                  alt={faculty.name} 
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                  }}
                />
              </div>
              
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide mb-1">
                {faculty.name}
              </h3>
              <p className="text-racing-red font-sans text-xs font-bold uppercase tracking-wider mb-2">
                {faculty.role}
              </p>
              <p className="text-white/50 font-sans text-xs font-light mb-4">
                {faculty.department}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/5 w-full flex items-center justify-center">
                <span className="text-white/30 font-sans text-[10px] tracking-widest uppercase">
                  {faculty.tenure}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
