"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Linkedin, Briefcase, Search, ArrowUpRight, Network } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { DEFAULT_ALUMNI_RECORDS, AlumniRecord } from "@/src/data/cms_defaults";

export function AlumniView() {
  const [alumni, setAlumni] = useState<AlumniRecord[]>(DEFAULT_ALUMNI_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("ALL");

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("alumni")
          .select("*")
          .order("order_index", { ascending: true });

        if (data && data.length > 0 && !error) {
          setAlumni(
            data.map((item: any) => ({
              ...item,
              role_name: item.role_name || item.current_role || "",
              current_role: item.role_name || item.current_role || "",
            }))
          );
        }
      } catch {
        // Fallback remains active
      }
    }
    loadData();
  }, []);

  const batches = ["ALL", ...Array.from(new Set(alumni.map((a) => a.batch))).sort().reverse()];

  const filteredAlumni = alumni.filter((a) => {
    const matchesBatch = selectedBatch === "ALL" || a.batch === selectedBatch;
    const query = searchQuery.toLowerCase().trim();
    const roleText = (a.role_name || a.current_role || "").toLowerCase();
    const matchesSearch =
      !query ||
      a.name.toLowerCase().includes(query) ||
      a.current_company.toLowerCase().includes(query) ||
      roleText.includes(query) ||
      a.former_role.toLowerCase().includes(query) ||
      a.mentorship_domain.toLowerCase().includes(query);

    return matchesBatch && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 sm:pt-28 pb-20 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-racing-red text-xs font-mono uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-white/10 pb-8 sm:pb-12 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3 text-racing-red font-mono text-xs uppercase tracking-widest font-bold">
            <Network className="w-4 h-4 text-racing-red" />
            <span>ALUMNI PADDOCK & INDUSTRY DIRECTORY</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            ALUMNI <span className="text-racing-red">NETWORK</span>
          </h1>
          <p className="font-sans text-white/60 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            Our former engineers lead vehicle engineering, battery architectures, kinematics, and telemetry across premier automotive companies in India and globally.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, or domain..."
              className="w-full bg-[#111115] border border-white/10 pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-racing-red transition-colors"
            />
          </div>

          {/* Batch Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider mr-2 hidden sm:inline">BATCH:</span>
            {batches.map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  selectedBatch === batch
                    ? "bg-racing-red text-white shadow-[0_0_15px_rgba(210,39,48,0.5)]"
                    : "bg-[#111115] text-white/60 hover:text-white border border-white/10"
                }`}
              >
                {batch}
              </button>
            ))}
          </div>
        </div>

        {/* Alumni Cards Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 p-8">
            <p className="font-mono text-sm text-white/40 uppercase tracking-widest">
              No alumni found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredAlumni.map((alumnus) => (
              <div
                key={alumnus.id}
                className="group bg-[#0b0b0e] border border-white/10 hover:border-racing-red/60 p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(210,39,48,0.2)]"
              >
                <div>
                  {/* Portrait Photo */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#141416] border border-white/5 mb-4 group-hover:border-racing-red/30 transition-colors">
                    <img
                      src={alumnus.image_url}
                      alt={alumnus.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 border border-white/10 text-[10px] font-mono text-white/80">
                      {alumnus.batch}
                    </div>
                  </div>

                  {/* Name & Roles */}
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

                  {/* Former Club Role */}
                  <p className="text-[11px] font-mono text-white/40 mb-2">
                    {alumnus.former_role}
                  </p>

                  {/* Mentorship Focus */}
                  <p className="text-[11px] font-sans text-white/60 leading-relaxed font-light mb-3">
                    <span className="text-white/80 font-medium">Domain: </span>
                    {alumnus.mentorship_domain}
                  </p>

                  {alumnus.bio && (
                    <p className="text-[11px] font-sans text-white/40 leading-relaxed font-light mb-4 border-t border-white/5 pt-2">
                      {alumnus.bio}
                    </p>
                  )}
                </div>

                {/* LinkedIn Connect Button (Optional) */}
                {alumnus.linkedin_url && alumnus.linkedin_url.trim() && alumnus.linkedin_url !== "#" && (
                  <a
                    href={alumnus.linkedin_url.startsWith("http") ? alumnus.linkedin_url : `https://${alumnus.linkedin_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#121216] border border-white/10 hover:border-racing-red hover:bg-racing-red/20 text-white font-mono text-xs uppercase tracking-wider py-2.5 px-3 transition-colors duration-200 mt-2"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#0077B5] group-hover:text-white" />
                    <span>CONNECT</span>
                    <ArrowUpRight className="w-3 h-3 text-white/50 group-hover:text-white" />
                  </a>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
