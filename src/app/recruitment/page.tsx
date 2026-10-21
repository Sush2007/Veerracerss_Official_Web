import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Zap, Shield, Users, Trophy } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { DEFAULT_SITE_SETTINGS } from "@/src/data/cms_defaults";
import { RecruitmentForm } from "./RecruitmentForm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Recruitment 2026 // VeerRacerss Electric",
  description: "Official Formula Student induction application portal for VeerRacerss Electric, VSSUT Burla.",
};

export default async function RecruitmentPage() {
  let formEnabled = DEFAULT_SITE_SETTINGS.recruitment_form_enabled ?? true;
  let formTitle = DEFAULT_SITE_SETTINGS.recruitment_form_title ?? "Formula Student Electric 2026 - Official Recruitment";
  let formDeadline = DEFAULT_SITE_SETTINGS.recruitment_form_deadline ?? "Season 2026 Phase 1 Induction";
  let contactEmail = DEFAULT_SITE_SETTINGS.contact_email;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (data) {
      const isOpen = data.recruitment_form_enabled !== false && (data as any).recruitment_open !== false;
      formEnabled = isOpen;
      if (data.recruitment_form_title) formTitle = data.recruitment_form_title;
      if (data.recruitment_form_deadline) formDeadline = data.recruitment_form_deadline;
      if (data.contact_email) contactEmail = data.contact_email;
    }
  } catch {
    // Fallback active
  }

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 sm:pt-28 pb-20 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        {/* Back Link */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-racing-red text-xs font-mono uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Page Hero Header */}
        <div className="border-b border-white/10 pb-8 sm:pb-12 mb-10">
          <div className="inline-flex items-center gap-2 mb-3 text-racing-red font-mono text-xs uppercase tracking-widest font-bold">
            <Zap className="w-4 h-4 text-racing-red" />
            <span>VSSUT BURLA // FORMULA STUDENT RECRUITMENT</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            JOIN <span className="text-racing-red">VEERRACERSS</span> ELECTRIC
          </h1>

          <p className="font-sans text-white/60 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            We are looking for motivated 1st and 2nd year student engineers eager to build high-voltage electric racecars, design aerodynamic wings, fabricate chromoly spaceframes, and represent VSSUT at national Formula Student competitions.
          </p>

          {/* 3 Quick Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5 font-mono text-xs text-white/70">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-racing-red shrink-0" />
              <span>High-Voltage Battery & Inverter Lab</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-racing-red shrink-0" />
              <span>Mentorship from Top EV Alumni</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-racing-red shrink-0" />
              <span>Buddh International Circuit Testing</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <RecruitmentForm
          formEnabled={formEnabled}
          formTitle={formTitle}
          formDeadline={formDeadline}
          contactEmail={contactEmail}
        />

      </div>
    </div>
  );
}
