"use client";

import { useState } from "react";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Send,
  FileSpreadsheet,
  ExternalLink,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Phone,
  BookOpen,
  X,
  MessageSquare,
} from "lucide-react";
import { RecruitmentApplication, SiteSettings } from "@/src/data/cms_defaults";
import { exportTableToExcel } from "@/src/lib/exportToExcel";

interface RecruitmentTabProps {
  recruits: RecruitmentApplication[];
  siteSettings: SiteSettings;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  onUpdateStatus: (id: string, status: "Pending" | "Shortlisted" | "Accepted" | "Declined") => Promise<void>;
  onUpdateScore: (id: string, score: string) => Promise<void>;
  onDeleteApplication: (id: string, name: string) => Promise<void>;
}

export function RecruitmentTab({
  recruits,
  siteSettings,
  onUpdateSettings,
  onUpdateStatus,
  onUpdateScore,
  onDeleteApplication,
}: RecruitmentTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");
  const [domainFilter, setDomainFilter] = useState<string>("ALL");

  // Onboarding Email Modal State
  const [emailModalCandidate, setEmailModalCandidate] = useState<RecruitmentApplication | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);

  // Filter calculations
  const filteredRecruits = recruits.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesYear = yearFilter === "ALL" || r.year_of_study === yearFilter;
    const matchesDomain =
      domainFilter === "ALL" ||
      r.primary_domain.toLowerCase().includes(domainFilter.toLowerCase()) ||
      (r.secondary_domain && r.secondary_domain.toLowerCase().includes(domainFilter.toLowerCase()));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.full_name.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query) ||
      r.roll_no.toLowerCase().includes(query) ||
      r.branch.toLowerCase().includes(query) ||
      r.primary_domain.toLowerCase().includes(query);

    return matchesStatus && matchesYear && matchesDomain && matchesSearch;
  });

  const handleOpenEmailModal = (candidate: RecruitmentApplication) => {
    setEmailModalCandidate(candidate);
    setEmailSubject(`Welcome to VeerRacerss Electric // Induction Offer: ${candidate.primary_domain}`);
    
    const baseTemplate =
      siteSettings.onboarding_email_template ||
      `Dear {{name}},

Congratulations! On behalf of VeerRacerss Electric, we are thrilled to formally welcome you to the official Formula Student team of VSSUT Burla for Season 2026.

Based on your technical evaluation and domain interviews, you have been selected for the {{domain}} engineering division.

ORIENTATION DETAILS:
• Date & Time: Saturday at 5:00 PM
• Venue: Formula Student Research Workshop, Mechanical Block, VSSUT Burla
• Agenda: Safety briefing, CAD/CAE tools setup, high-voltage battery safety protocol, and sub-team allocation.

OFFICIAL RECRUITS WHATSAPP GROUP:
Please join the official team communication channel here: {{whatsapp_link}}

Wear comfortable footwear and bring a notebook. We look forward to engineering our next electric racecar together with you!

Warm regards,
Team Captain & Executive Council
VeerRacerss Electric // VSSUT Burla
veerracersselectric.database@gmail.com`;

    const hydrated = baseTemplate
      .replace(/{{name}}/g, candidate.full_name)
      .replace(/{{domain}}/g, candidate.primary_domain)
      .replace(/{{whatsapp_link}}/g, siteSettings.whatsapp_recruit_link || "https://chat.whatsapp.com/veerracerss-recruits-2026");

    setEmailMessage(hydrated);
    setEmailFeedback(null);
  };

  const handleSendEmail = async () => {
    if (!emailModalCandidate) return;
    setSendingEmail(true);
    setEmailFeedback(null);

    try {
      const res = await fetch("/api/recruitment/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailModalCandidate.email,
          candidateName: emailModalCandidate.full_name,
          subject: emailSubject,
          message: emailMessage,
          applicationId: emailModalCandidate.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to dispatch email.");

      setEmailFeedback(data.message || "Onboarding email dispatched successfully!");
      await onUpdateStatus(emailModalCandidate.id, "Accepted");

      setTimeout(() => {
        setEmailModalCandidate(null);
      }, 1800);
    } catch (err: any) {
      setEmailFeedback(`Error: ${err.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleExport = () => {
    exportTableToExcel(
      filteredRecruits.map((r) => ({
        "Full Name": r.full_name,
        "Email": r.email,
        "WhatsApp Phone": r.phone,
        "Roll Number": r.roll_no,
        "Academic Branch": r.branch,
        "Year of Study": r.year_of_study,
        "Primary Domain": r.primary_domain,
        "Secondary Domain": r.secondary_domain || "None",
        "Application Status": r.status,
        "Interview Score": r.interview_score || "Pending",
        "Technical Experience": r.experience_summary || "",
        "Portfolio URL": r.portfolio_url || "",
        "Onboard Email Dispatched": r.onboarding_email_sent ? "Yes" : "No",
        "Submission Date": r.created_at || "Recent",
      })),
      "veerracerss-recruitment-applications",
      "Recruits Checklist"
    );
  };

  const formActive = siteSettings.recruitment_form_enabled !== false;

  return (
    <div className="space-y-6">
      
      {/* Master Toggle & Header Banner */}
      <div className="bg-[#0b0c10] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1 text-[10px] font-mono uppercase text-racing-red font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RECRUITMENT & INDUCTION CONTROL CENTER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            Applicant Checklist & Onboarding
          </h2>
          <p className="text-xs font-mono text-white/50">
            {recruits.length} Total Submissions • {recruits.filter((r) => r.status === "Accepted").length} Accepted
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Master Form Toggle */}
          <button
            onClick={() => onUpdateSettings({ recruitment_form_enabled: !formActive })}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
              formActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
            }`}
          >
            {formActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-red-400" />}
            <span>{formActive ? "Applications: ACTIVE (OPEN)" : "Applications: PAUSED (CLOSED)"}</span>
          </button>

          {/* Excel Export */}
          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0b0c10] border border-white/10 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, roll no, email, or domain..."
            className="w-full bg-[#111115] border border-white/10 pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder:text-white/30 focus:border-racing-red outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111115] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white/80 focus:border-racing-red outline-none uppercase"
          >
            <option value="ALL">All Status</option>
            <option value="Pending">Pending Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
          </select>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-[#111115] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white/80 focus:border-racing-red outline-none uppercase"
          >
            <option value="ALL">All Years</option>
            <option value="1st Year">1st Year (Induction)</option>
            <option value="2nd Year">2nd Year (Lateral)</option>
          </select>
        </div>
      </div>

      {/* Candidates Checklist Grid */}
      {filteredRecruits.length === 0 ? (
        <div className="text-center py-16 bg-[#0b0c10] border border-white/10 p-8">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
            No applicant submissions found matching the criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecruits.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-[#0b0c10] border border-white/10 hover:border-white/20 p-5 transition-all shadow-md flex flex-col lg:flex-row justify-between gap-5"
            >
              {/* Left Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-display font-black text-lg text-white uppercase">{candidate.full_name}</h3>
                  <span className="text-[10px] font-mono bg-racing-red/10 text-racing-red border border-racing-red/30 px-2 py-0.5 font-bold uppercase">
                    {candidate.year_of_study}
                  </span>
                  <span className="text-[10px] font-mono bg-white/10 text-white/80 px-2 py-0.5 uppercase">
                    {candidate.branch}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">Roll: {candidate.roll_no}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-white/40" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-white/40" />
                    <span>{candidate.phone}</span>
                  </div>
                  {candidate.portfolio_url && (
                    <a
                      href={candidate.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-racing-red hover:underline flex items-center gap-1"
                    >
                      <span>Portfolio / CV</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                  <span className="text-white/40">Preferences:</span>
                  <span className="bg-[#171820] text-racing-red font-semibold px-2 py-0.5 border border-white/10">
                    1. {candidate.primary_domain}
                  </span>
                  {candidate.secondary_domain && (
                    <span className="bg-[#171820] text-white/70 px-2 py-0.5 border border-white/10">
                      2. {candidate.secondary_domain}
                    </span>
                  )}
                </div>

                {candidate.experience_summary && (
                  <p className="text-xs font-sans text-white/60 font-light leading-relaxed bg-black/40 p-2.5 border border-white/5 mt-2">
                    <span className="text-white/80 font-mono text-[10px] uppercase font-bold block mb-0.5">
                      Technical Experience & Motivation:
                    </span>
                    {candidate.experience_summary}
                  </p>
                )}
              </div>

              {/* Right: Actions, Score & Status */}
              <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-start lg:items-end gap-3 shrink-0 lg:border-l lg:border-white/10 lg:pl-5">
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-white/50">Status:</span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 border ${
                      candidate.status === "Accepted"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : candidate.status === "Declined"
                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                        : candidate.status === "Shortlisted"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    }`}
                  >
                    {candidate.status}
                  </span>
                  {candidate.onboarding_email_sent && (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5">
                      MAIL SENT
                    </span>
                  )}
                </div>

                {/* Interview Score Input */}
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-white/40 text-[10px] uppercase">Score:</span>
                  <input
                    type="text"
                    defaultValue={candidate.interview_score || "Pending"}
                    onBlur={(e) => onUpdateScore(candidate.id, e.target.value)}
                    className="w-24 bg-[#111115] border border-white/10 px-2 py-0.5 text-[11px] font-mono text-white text-center focus:border-racing-red outline-none"
                  />
                </div>

                {/* Decision Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => onUpdateStatus(candidate.id, "Shortlisted")}
                    className="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-mono font-bold uppercase transition-colors"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => handleOpenEmailModal(candidate)}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-mono font-bold uppercase flex items-center gap-1 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Accept & Onboard</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(candidate.id, "Declined")}
                    className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-mono font-bold uppercase transition-colors"
                  >
                    Decline
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onboarding Email Composer Modal */}
      {emailModalCandidate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b0c10] border border-racing-red/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-racing-red/10 border border-racing-red/40 flex items-center justify-center text-racing-red">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-racing-red font-bold">
                    CUSTOM ONBOARDING LETTER COMPOSER
                  </span>
                  <h3 className="text-base font-display font-black uppercase text-white">
                    Send Acceptance to {emailModalCandidate.full_name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setEmailModalCandidate(null)}
                className="p-1 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Recipient</label>
                <input
                  type="text"
                  disabled
                  value={`${emailModalCandidate.full_name} <${emailModalCandidate.email}>`}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white/70 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                  Email Message Body (Customize any paragraphs, timings, or links)
                </label>
                <textarea
                  rows={12}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                />
              </div>

              {emailFeedback && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{emailFeedback}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEmailModalCandidate(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sendingEmail}
                  onClick={handleSendEmail}
                  className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {sendingEmail ? (
                    <span>Dispatching Letter...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Onboarding Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
