"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { DEFAULT_SITE_SETTINGS, SiteSettings } from "@/src/data/cms_defaults";

const HeroCar3D = dynamic(() => import("./HeroCar3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[320px] flex items-center justify-center">
      <div className="flex items-center gap-2 text-white/50 font-mono text-xs tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
        LOADING 3D FORMULA CAD...
      </div>
    </div>
  ),
});

export interface HeroProps {
  title?: string;
  subtitle?: string;
  modelUrl?: string;
}

export function Hero({ title, subtitle, modelUrl }: HeroProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [cadModelUrl, setCadModelUrl] = useState<string>("/car-raw.glb");
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState<boolean>(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        // Local cache fallback if columns haven't been migrated
        let localExt: any = {};
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("vr_site_settings_extended");
            if (raw) localExt = JSON.parse(raw);
          } catch {}
        }

        if (data && !error) {
          const recOpen = data.recruitment_open !== false && data.recruitment_form_enabled !== false;
          setIsRecruitmentOpen(recOpen);
          setSettings({
            hero_title: data.hero_title || localExt.hero_title || DEFAULT_SITE_SETTINGS.hero_title,
            hero_subtitle: data.hero_subtitle || localExt.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle,
            recruitment_cta_label: data.recruitment_cta_label || DEFAULT_SITE_SETTINGS.recruitment_cta_label,
            recruitment_cta_url: data.recruitment_cta_url || DEFAULT_SITE_SETTINGS.recruitment_cta_url,
            recruitment_cta_enabled: data.recruitment_cta_enabled !== false,
            announcement_badge_text: data.announcement_badge_text || DEFAULT_SITE_SETTINGS.announcement_badge_text,
            announcement_badge_enabled: data.announcement_badge_enabled !== false,
            contact_email: data.contact_email || DEFAULT_SITE_SETTINGS.contact_email,
            recruitment_open: recOpen,
          });
        } else {
          const recOpen = localExt.recruitment_open !== false;
          setIsRecruitmentOpen(recOpen);
          if (localExt.hero_title || localExt.hero_subtitle) {
            setSettings((prev) => ({
              ...prev,
              hero_title: localExt.hero_title || prev.hero_title,
              hero_subtitle: localExt.hero_subtitle || prev.hero_subtitle,
              recruitment_open: recOpen,
            }));
          }
        }

        // Also check featured_machine for dynamic cad_model_url
        const { data: macData } = await supabase
          .from("featured_machine")
          .select("cad_model_url")
          .limit(1)
          .maybeSingle();
        if (macData?.cad_model_url) {
          setCadModelUrl(macData.cad_model_url);
        } else if (typeof window !== "undefined") {
          try {
            const mRaw = localStorage.getItem("vr_machine_extended");
            if (mRaw) {
              const parsed = JSON.parse(mRaw);
              if (parsed.cad_model_url) setCadModelUrl(parsed.cad_model_url);
            }
          } catch {}
        }
      } catch {
        // Safe fallback already active
      }
    }
    loadSettings();
  }, []);

  const activeTitle = title || settings.hero_title || DEFAULT_SITE_SETTINGS.hero_title || "VEERRACERSS ELECTRIC";
  const activeSubtitle = subtitle || settings.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle || "Odisha’s Premier Formula Student EV Racing Team | VSSUT Burla • Est. 2018.\nEngineered from raw CAD into high-voltage, track-dominating electric formula racecars.";
  const activeModelUrl = modelUrl || cadModelUrl || "/car-raw.glb";

  const renderTitleSegment = (segment: string) => {
    const upper = segment.toUpperCase();
    const electricIdx = upper.indexOf("ELECTRIC");
    if (electricIdx !== -1) {
      const before = segment.substring(0, electricIdx);
      const highlighted = segment.substring(electricIdx, electricIdx + 8);
      const after = segment.substring(electricIdx + 8);
      return (
        <>
          {before}
          {before.trim() ? <br /> : null}
          <span className="text-racing-red">{highlighted}</span>
          {after}
        </>
      );
    }
    const words = segment.trim().split(/\s+/);
    if (words.length > 1) {
      const lastWord = words.pop();
      return (
        <>
          {words.join(" ")} <br />
          <span className="text-racing-red">{lastWord}</span>
        </>
      );
    }
    return segment;
  };

  const renderTitle = (rawText: string) => {
    if (rawText.includes("\n")) {
      const lines = rawText.split("\n");
      return lines.map((line, idx) => (
        <span key={idx} className="block">
          {renderTitleSegment(line)}
        </span>
      ));
    }
    return renderTitleSegment(rawText);
  };

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-[92dvh] lg:min-h-[96dvh] w-full flex flex-col justify-center overflow-hidden bg-[#050505] pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16"
    >
      {/* Background Grid & Subtle Parallax Texture */}
      <motion.div style={{ y }} className="absolute inset-0 telemetry-grid opacity-15 pointer-events-none z-0"></motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-racing-red/15 via-transparent to-transparent z-0 pointer-events-none"></div>
      
      {/* Technical Red Laser Accent Line on Left Edge */}
      <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-racing-red shadow-[0_0_35px_rgba(210,39,48,0.9)] z-10 pointer-events-none"></div>

      {/* Main Responsive Hero Grid */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12">
        
        {/* Left Column: Headline, Engineering Tagline & CTAs */}
        <div className="w-full lg:w-[48%] xl:w-[46%] flex flex-col items-start z-20 pointer-events-auto">
          
          {/* Optional Announcement Pill */}
          {settings.announcement_badge_enabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full mb-4 sm:mb-5 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-white/70"
            >
              <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
              <span>{settings.announcement_badge_text}</span>
            </motion.div>
          )}

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.1 }}
          >
            <h1 className="font-display font-black text-4xl min-[380px]:text-5xl sm:text-6xl md:text-7xl lg:text-[72px] xl:text-[80px] leading-[0.98] tracking-tight uppercase text-white drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]">
              {renderTitle(activeTitle)}
            </h1>
          </motion.div>

          {/* Subtitle / Description */}
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.25 }}
            className="font-sans text-white/80 text-xs sm:text-sm md:text-base mt-4 sm:mt-5 max-w-xl font-light leading-relaxed border-l-2 border-racing-red pl-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] whitespace-pre-line"
          >
            {activeSubtitle}
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.4 }}
            className="flex flex-row flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto"
          >
            {/* Primary Static CTA: Always navigates to the car section */}
            <a 
              href="#car-spotlight" 
              className="flex-1 sm:flex-none bg-racing-red text-white px-6 py-3.5 sm:px-8 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.18em] hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 text-center relative overflow-hidden group flex items-center justify-center gap-2"
            >
              <span className="relative z-10">EXPLORE FLEET</span>
              <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
            </a>
            
            {/* Secondary Dynamic CTA: When recruitment is open, it automatically overwrites settings and appears right here */}
            {isRecruitmentOpen ? (
              <Link 
                href="/recruitment"
                className="flex-1 sm:flex-none bg-black/70 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 sm:px-8 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.18em] hover:border-racing-red hover:text-racing-red hover:bg-racing-red/10 transition-all duration-300 text-center relative overflow-hidden group flex items-center justify-center gap-1.5"
              >
                <span className="relative z-10">RECRUITMENT 2026</span>
                <ArrowUpRight className="w-3.5 h-3.5 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Link>
            ) : settings.recruitment_cta_enabled ? (
              settings.recruitment_cta_url.startsWith("http") ? (
                <a
                  href={settings.recruitment_cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none bg-black/70 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 sm:px-8 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.18em] hover:border-racing-red hover:text-racing-red hover:bg-racing-red/10 transition-all duration-300 text-center relative overflow-hidden group flex items-center justify-center gap-1.5"
                >
                  <span className="relative z-10">{settings.recruitment_cta_label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <Link 
                  href={settings.recruitment_cta_url}
                  className="flex-1 sm:flex-none bg-black/70 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 sm:px-8 sm:py-4 font-sans font-bold text-xs sm:text-[13px] uppercase tracking-[0.18em] hover:border-racing-red hover:text-racing-red hover:bg-racing-red/10 transition-all duration-300 text-center relative overflow-hidden group flex items-center justify-center gap-1.5"
                >
                  <span className="relative z-10">{settings.recruitment_cta_label}</span>
                </Link>
              )
            ) : null}
          </motion.div>

          {/* Minimal Key Benchmark Line (Clean, unstacked, non-repetitive) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 sm:mt-10 pt-4 border-t border-white/10 text-white/50 text-[11px] font-mono tracking-wider uppercase"
          >
            <div><span className="text-white/30">0-100:</span> <strong className="text-white font-bold">3.1s</strong></div>
            <div className="hidden sm:inline text-white/20">•</div>
            <div><span className="text-white/30">TOP SPEED:</span> <strong className="text-white font-bold">115 KM/H</strong></div>
            <div className="hidden sm:inline text-white/20">•</div>
            <div><span className="text-white/30">WEIGHT:</span> <strong className="text-white font-bold">182 KG</strong></div>
            <div className="hidden sm:inline text-white/20">•</div>
            <div><span className="text-white/30">ACCUMULATOR:</span> <strong className="text-racing-red font-bold">72V LI-ION</strong></div>
          </motion.div>

        </div>

        {/* Right Column: 3D Vehicle Interactive Model with generous breathing room */}
        <div className="w-full lg:w-[52%] xl:w-[54%] flex items-center justify-center z-10 mt-2 sm:mt-4 lg:mt-0 pointer-events-auto">
          <HeroCar3D modelUrl={activeModelUrl} />
        </div>

      </div>
    </section>
  );
}
