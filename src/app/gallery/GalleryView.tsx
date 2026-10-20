"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Film, Image as ImageIcon, X, Play } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { DEFAULT_MEDIA_ITEMS, MediaItem } from "@/src/data/cms_defaults";

export function GalleryView() {
  const [items, setItems] = useState<MediaItem[]>(DEFAULT_MEDIA_ITEMS);
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<"ALL" | "image" | "video">("ALL");
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("media_items")
          .select("*")
          .order("order_index", { ascending: true });

        if (data && data.length > 0 && !error) {
          setItems(data);
        }
      } catch {
        // Fallback remains active
      }
    }
    loadData();
  }, []);

  const years = ["ALL", ...Array.from(new Set(items.map((i) => i.year))).sort().reverse()];

  const filteredItems = items.filter((item) => {
    const matchesYear = selectedYear === "ALL" || item.year === selectedYear;
    const matchesType = selectedType === "ALL" || item.media_type === selectedType;
    return matchesYear && matchesType;
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
            <span className="w-2 h-0.5 bg-racing-red"></span>
            <span>VISUAL HERITAGE ARCHIVE</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            TRACK & WORKSHOP <span className="text-racing-red">GALLERY</span>
          </h1>
          <p className="font-sans text-white/60 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            A year-by-year visual archive of VeerRacerss Electric on track at Formula Imperial and Formula Bharat, alongside testing and fabrication in our VSSUT Burla workshop.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
          {/* Year Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider mr-2 hidden sm:inline">YEAR:</span>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  selectedYear === year
                    ? "bg-racing-red text-white shadow-[0_0_15px_rgba(210,39,48,0.5)]"
                    : "bg-[#111115] text-white/60 hover:text-white border border-white/10"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Media Type Toggle */}
          <div className="flex items-center bg-[#111115] border border-white/10 p-1">
            <button
              onClick={() => setSelectedType("ALL")}
              className={`px-3 py-1 text-xs font-mono font-semibold tracking-wider uppercase transition-all ${
                selectedType === "ALL" ? "bg-white text-black font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              ALL ({items.length})
            </button>
            <button
              onClick={() => setSelectedType("image")}
              className={`px-3 py-1 text-xs font-mono font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                selectedType === "image" ? "bg-white text-black font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>PHOTOS</span>
            </button>
            <button
              onClick={() => setSelectedType("video")}
              className={`px-3 py-1 text-xs font-mono font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                selectedType === "video" ? "bg-white text-black font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              <Film className="w-3 h-3" />
              <span>VIDEOS</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 p-8">
            <p className="font-mono text-sm text-white/40 uppercase tracking-widest">
              No media items found for this selection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group relative bg-[#0d0e12] border border-white/10 overflow-hidden cursor-pointer hover:border-racing-red transition-all duration-300 flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  {item.media_type === "video" ? (
                    <>
                      <video
                        src={item.media_url}
                        poster={item.thumbnail_url}
                        muted
                        playsInline
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-racing-red/90 flex items-center justify-center text-white shadow-lg">
                          <Play className="w-4 h-4 ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.media_url}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  )}

                  {/* Year Tag */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    {item.year}
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="p-4 sm:p-5 bg-[#0a0a0d] border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1.5">
                    {item.media_type === "video" ? (
                      <span className="text-racing-red font-bold flex items-center gap-1">
                        <Film className="w-3 h-3" /> VIDEO REEL
                      </span>
                    ) : (
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> PHOTOGRAPHY
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-sans font-bold text-white group-hover:text-racing-red transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-[#0b0c10] border border-white/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
              <div className="flex items-center gap-3">
                <span className="bg-racing-red text-white text-[10px] font-mono font-bold px-2.5 py-0.5 uppercase tracking-wider">
                  {lightboxItem.year}
                </span>
                <span className="text-sm font-sans font-semibold text-white truncate max-w-md">
                  {lightboxItem.title}
                </span>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="text-white/60 hover:text-white p-1 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4 bg-black">
              {lightboxItem.media_type === "video" ? (
                <video
                  src={lightboxItem.media_url}
                  controls
                  autoPlay
                  className="max-h-[75vh] w-auto max-w-full"
                />
              ) : (
                <img
                  src={lightboxItem.media_url}
                  alt={lightboxItem.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
