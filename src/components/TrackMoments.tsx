"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Film, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { DEFAULT_MEDIA_ITEMS, MediaItem } from "@/src/data/cms_defaults";

export function TrackMoments() {
  const [items, setItems] = useState<MediaItem[]>(DEFAULT_MEDIA_ITEMS);

  useEffect(() => {
    async function loadMedia() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("media_items")
          .select("*")
          .eq("featured_on_home", true)
          .order("order_index", { ascending: true });

        if (data && data.length > 0 && !error) {
          setItems(data);
        }
      } catch {
        // Fallback remains active
      }
    }
    loadMedia();
  }, []);

  // Duplicate items for continuous seamless infinite marquee loop
  const marqueeItems = [...items, ...items];

  return (
    <section className="py-12 sm:py-16 bg-[#070709] border-y border-white/10 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 text-racing-red font-mono text-[11px] uppercase tracking-widest font-bold">
            <span className="w-2 h-0.5 bg-racing-red"></span>
            <span>TRACK & WORKSHOP FOOTAGE</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight">
            TEAM IN ACTION
          </h2>
        </div>

        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-white/70 hover:text-racing-red font-mono text-xs uppercase tracking-wider font-semibold transition-colors group"
        >
          <span>VIEW YEARWISE ARCHIVE</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Infinite Horizontal Autoplay Scroller */}
      <div className="relative w-full overflow-hidden group">
        <div className="animate-marquee-scroll gap-4 sm:gap-6 py-2">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="relative w-[280px] sm:w-[340px] md:w-[380px] aspect-[16/10] bg-[#0c0d11] border border-white/10 overflow-hidden shrink-0 group/card transition-all duration-300 hover:border-racing-red/60"
            >
              {item.media_type === "video" ? (
                <video
                  src={item.media_url}
                  poster={item.thumbnail_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={item.media_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                />
              )}

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

              {/* Top Pill: Year & Type */}
              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                <span className="bg-black/75 backdrop-blur-md border border-white/15 px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                  {item.year}
                </span>
                <span className="bg-black/75 backdrop-blur-md border border-white/15 px-1.5 py-0.5 text-[9px] font-mono text-white/70 flex items-center gap-1">
                  {item.media_type === "video" ? <Film className="w-2.5 h-2.5 text-racing-red" /> : <ImageIcon className="w-2.5 h-2.5 text-cyan-400" />}
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                <p className="text-white font-sans text-xs sm:text-sm font-semibold line-clamp-2 leading-snug drop-shadow-md">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center CTA beneath the cards */}
      <div className="max-w-[1440px] mx-auto px-4 mt-8 sm:mt-10 flex justify-center">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2.5 bg-white/5 border border-white/20 hover:border-racing-red hover:bg-racing-red text-white px-6 sm:px-8 py-3 sm:py-3.5 font-mono font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-md group"
        >
          <span>EXPLORE YEARWISE COLLAGE & VIDEOS</span>
          <ArrowRight className="w-4 h-4 text-racing-red group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </section>
  );
}
