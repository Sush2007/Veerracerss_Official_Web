"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Linkedin, Briefcase, ArrowUpRight, MessageSquare, Network, ArrowRight } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { DEFAULT_ALUMNI_RECORDS, AlumniRecord } from "@/src/data/cms_defaults";

export function AlumniNetwork() {
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(DEFAULT_ALUMNI_RECORDS);

  useEffect(() => {
    async function loadAlumni() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("alumni")
          .select("*")
          .order("order_index", { ascending: true })
          .limit(4);

        if (data && data.length > 0 && !error) {
          setAlumniList(
            data.map((item: any) => ({
              ...item,
              role_name: item.role_name || item.current_role || "",
              current_role: item.role_name || item.current_role || "",
            }))
          );
        }
      } catch {
        // Safe fallback active
      }
    }
    loadAlumni();
  }, []);

  return (
    <section id="alumni" className="py-20 sm:py-28 bg-[#070709] relative z-10 overflow-hidden border-b border-white/10">
      
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 telemetry-grid opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-racing-red/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-white/5 border border-white/10 text-white/80 font-mono text-xs uppercase tracking-widest font-semibold">
              <Network className="w-3.5 h-3.5 text-racing-red" />
              <span>GLOBAL AUTOMOTIVE & EV ALUMNI NETWORK</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase text-white tracking-tight leading-[1.05]">
              ALUMNI <span className="text-racing-red">//</span> FROM WORKSHOP TO INDUSTRY
            </h2>

            <p className="font-sans text-white/60 text-xs sm:text-sm md:text-base mt-3 font-light max-w-2xl leading-relaxed">
              Our engineers lead innovation across top automotive, EV, and tech giants. From early chassis design in Burla to developing production electric mobility across India.
            </p>
          </div>

          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 bg-racing-red text-white hover:bg-white hover:text-black px-6 py-3.5 font-sans font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-md group shrink-0"
          >
            <span>VIEW ALL ALUMNI</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Alumni Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {alumniList.slice(0, 4).map((alumnus, index) => (
            <motion.div
              key={alumnus.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-[#0b0b0e] border border-white/10 hover:border-racing-red/60 p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(210,39,48,0.2)]"
            >
              <div>
                {/* Portrait Card */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#141416] border border-white/5 mb-4 group-hover:border-racing-red/30 transition-colors">
                  <img
                    src={alumnus.image_url}
                    alt={alumnus.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                  {/* Batch Pill */}
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 border border-white/10 text-[10px] font-mono text-white/80">
                    {alumnus.batch}
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-racing-red transition-colors">
                  {alumnus.name}
                </h3>
                
                <div className="flex items-center gap-1.5 text-racing-red text-[11px] font-mono font-semibold tracking-wider uppercase mt-1 mb-2">
                  <Briefcase className="w-3 h-3" />
                  <span>{alumnus.role_name || alumnus.current_role}</span>
                </div>

                {/* Company Tag */}
                <div className="bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-mono text-white/90 font-bold inline-block mb-3">
                  @ {alumnus.current_company}
                </div>

                {/* Mentorship Focus */}
                <p className="text-[11px] font-sans text-white/50 leading-relaxed font-light mb-4">
                  <span className="text-white/70 font-medium">Domain: </span>
                  {alumnus.mentorship_domain}
                </p>
              </div>

              {/* LinkedIn Connect Button */}
              <a
                href={alumnus.linkedin_url || "https://www.linkedin.com/company/veerracerss-electric/"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#121216] border border-white/10 hover:border-racing-red hover:bg-racing-red/20 text-white font-mono text-xs uppercase tracking-wider py-2.5 px-3 transition-colors duration-200"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0077B5] group-hover:text-white" />
                <span>CONNECT</span>
                <ArrowUpRight className="w-3 h-3 text-white/50 group-hover:text-white" />
              </a>

            </motion.div>
          ))}
        </div>

        {/* Mentorship Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full bg-gradient-to-r from-[#0d0d10] via-[#141418] to-[#0d0d10] border border-white/15 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-racing-red/10 border border-racing-red/30 flex items-center justify-center shrink-0 hidden sm:flex">
              <MessageSquare className="w-5 h-5 text-racing-red" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                Seeking mentorship or industry guidance? <span className="text-racing-red">[ CONNECT WITH ALUMNI MENTORS ]</span>
              </h4>
              <p className="font-sans text-white/60 text-xs sm:text-sm mt-1 font-light">
                Our senior alumni mentor club members on vehicle dynamics, battery chemistry, CAD modeling, and automotive career paths.
              </p>
            </div>
          </div>

          <a
            href="mailto:veerracersselectric.database@gmail.com?subject=Alumni%20Mentorship%20Inquiry%20-%20VeerRacerss%20Electric"
            className="shrink-0 bg-racing-red hover:bg-racing-red/90 text-white font-sans font-bold text-xs uppercase tracking-[0.18em] px-6 py-3.5 shadow-[0_0_25px_rgba(210,39,48,0.4)] transition-all hover:scale-105"
          >
            CONNECT MENTORSHIP
          </a>
        </motion.div>

      </div>
    </section>
  );
}
