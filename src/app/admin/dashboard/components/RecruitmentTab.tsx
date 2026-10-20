"use client";

import { useState } from "react";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Trash2,
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
  onUpdateStatus: (
    id: string,
    status: "Pending" | "Shortlisted" | "Accepted" | "Declined",
    onboardingEmailSent?: boolean
  ) => Promise<void>;
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

  // Controlled score inputs and error feedback
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, string>>({});
  const [scoreErrors, setScoreErrors] = useState<Record<string, string>>({});
  const [savingScoreId, setSavingScoreId] = useState<string | null>(null);

  // Onboarding Email Modal State
  const [emailModalCandidate, setEmailModalCandidate] = useState<RecruitmentApplication | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Status Export Modal State
  const [showStatusExportModal, setShowStatusExportModal] = useState(false);

  // Edit Portal Modal State
  const [showEditPortalModal, setShowEditPortalModal] = useState(false);
  const [portalTitle, setPortalTitle] = useState(siteSettings.recruitment_form_title || "Formula Student Electric 2026 - Official Recruitment");
  const [portalDeadline, setPortalDeadline] = useState(siteSettings.recruitment_form_deadline || "Season 2026 Phase 1 Induction");
  const [portalInstructions, setPortalInstructions] = useState(siteSettings.recruitment_instructions || "Complete all fields accurately. Shortlisted candidates will be contacted via WhatsApp/Email for the technical discussion and workshop induction.");
  const [portalEligibility, setPortalEligibility] = useState(siteSettings.recruitment_eligibility || "Open to 1st Year (Freshers) & 2nd Year (Lateral) B.Tech students across all engineering branches of VSSUT Burla.");
  const [portalWhatsapp, setPortalWhatsapp] = useState(siteSettings.whatsapp_recruit_link || "https://chat.whatsapp.com/veerracerss-recruits-2026");
  const [savingPortal, setSavingPortal] = useState(false);

  // Filter calculations
  const filteredRecruits = recruits.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesYear = yearFilter === "ALL" || r.year_of_study === yearFilter;

    const filterLower = domainFilter.toLowerCase().trim();
    const primaryLower = (r.primary_domain || "").toLowerCase();
    const secondaryLower = (r.secondary_domain || "").toLowerCase();

    const matchesDomain =
      domainFilter === "ALL" ||
      (primaryLower && (primaryLower.includes(filterLower) || filterLower.includes(primaryLower))) ||
      (secondaryLower && (secondaryLower.includes(filterLower) || filterLower.includes(secondaryLower))) ||
      [
        "powertrain",
        "chassis",
        "electronics",
        "embedded",
        "suspension",
        "dynamics",
        "brakes",
        "thermal",
        "media",
        "relations",
        "pr",
        "sponsorship",
        "operations",
      ].some((kw) => {
        if (kw === "dynamics") {
          // Disallow matching 'dynamics' when part of 'aerodynamics' to prevent cross-domain collision
          const filterHasDynamics = filterLower.replace(/aerodynamics/g, "").includes("dynamics");
          const primaryHasDynamics = primaryLower.replace(/aerodynamics/g, "").includes("dynamics");
          const secondaryHasDynamics = secondaryLower ? secondaryLower.replace(/aerodynamics/g, "").includes("dynamics") : false;
          return filterHasDynamics && (primaryHasDynamics || secondaryHasDynamics);
        }
        return (
          filterLower.includes(kw) &&
          ((primaryLower && primaryLower.includes(kw)) || (secondaryLower && secondaryLower.includes(kw)))
        );
      });

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (r.full_name || "").toLowerCase().includes(query) ||
      (r.email || "").toLowerCase().includes(query) ||
      (r.roll_no || "").toLowerCase().includes(query) ||
      (r.branch || "").toLowerCase().includes(query) ||
      (r.primary_domain || "").toLowerCase().includes(query) ||
      (r.secondary_domain && r.secondary_domain.toLowerCase().includes(query));

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

      setEmailFeedback({
        type: "success",
        message: data.message || "Onboarding email dispatched successfully!",
      });

      // Update candidate status to Accepted and persist onboarding_email_sent: true
      await onUpdateStatus(emailModalCandidate.id, "Accepted", true);
      emailModalCandidate.onboarding_email_sent = true;

      setTimeout(() => {
        setEmailModalCandidate(null);
      }, 1800);
    } catch (err: any) {
      setEmailFeedback({
        type: "error",
        message: err.message || "Failed to dispatch email.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleExport = () => {
    setShowStatusExportModal(true);
  };

  const handleExecuteExport = (targetStatus: string) => {
    const list = targetStatus === "ALL" 
      ? recruits 
      : recruits.filter(r => r.status === targetStatus);

    exportTableToExcel(
      list.map((r) => ({
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
        "Onboard Email Dispatched": r.onboarding_email_sent ? "Yes" : "No",
        "Submission Date": r.created_at || "Recent",
      })),
      `veerracerss-recruitment-${targetStatus.toLowerCase()}-${new Date().toISOString().split("T")[0]}`,
      `${targetStatus} Candidates`
    );
    setShowStatusExportModal(false);
  };

  const handleSavePortalDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPortal(true);
    try {
      await onUpdateSettings({
        recruitment_form_title: portalTitle,
        recruitment_form_deadline: portalDeadline,
        recruitment_instructions: portalInstructions,
        recruitment_eligibility: portalEligibility,
        whatsapp_recruit_link: portalWhatsapp,
      });
      setShowEditPortalModal(false);
    } finally {
      setSavingPortal(false);
    }
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
            onClick={() => onUpdateSettings({ recruitment_form_enabled: !formActive, recruitment_open: !formActive })}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
              formActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
            }`}
          >
            {formActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-red-400" />}
            <span>{formActive ? "Applications: ACTIVE (OPEN)" : "Applications: PAUSED (CLOSED)"}</span>
          </button>

          {/* Edit Portal Content */}
          <button
            onClick={() => setShowEditPortalModal(true)}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
            title="Edit Recruitment Form Headline, Deadline, Instructions & Links"
          >
            <Edit3 className="w-4 h-4 text-racing-red" />
            <span>Edit Portal Details</span>
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

          {/* Domain Filter */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-[#111115] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white/80 focus:border-racing-red outline-none uppercase"
          >
            <option value="ALL">All Domains</option>
            <option value="Powertrain & High Voltage (Battery & Inverters)">Powertrain & High Voltage</option>
            <option value="Chassis & Aerodynamics (Spaceframe & Carbon Aero)">Chassis & Aerodynamics</option>
            <option value="Electronics & Embedded Systems">Electronics & Embedded Systems</option>
            <option value="Vehicle Dynamics & Suspension">Vehicle Dynamics & Suspension</option>
            <option value="Brakes & Thermals">Brakes & Thermals</option>
            <option value="Media & Public Relations">Media & Public Relations</option>
            <option value="Operations & Sponsorship">Operations & Sponsorship</option>
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
                <div className="flex flex-col items-start lg:items-end gap-1 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/40 text-[10px] uppercase">Score:</span>
                    <input
                      type="text"
                      value={scoreDrafts[candidate.id] !== undefined ? scoreDrafts[candidate.id] : (candidate.interview_score || "")}
                      placeholder="e.g. 8.5 / 10"
                      onChange={(e) => {
                        const val = e.target.value;
                        setScoreDrafts((prev) => ({ ...prev, [candidate.id]: val }));
                        if (scoreErrors[candidate.id]) {
                          setScoreErrors((prev) => {
                            const copy = { ...prev };
                            delete copy[candidate.id];
                            return copy;
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      onBlur={async () => {
                        const currentVal = scoreDrafts[candidate.id] !== undefined
                          ? scoreDrafts[candidate.id]
                          : (candidate.interview_score || "");
                        if (currentVal.trim() !== (candidate.interview_score || "").trim()) {
                          setSavingScoreId(candidate.id);
                          try {
                            await onUpdateScore(candidate.id, currentVal.trim());
                          } catch (err: any) {
                            setScoreErrors((prev) => ({
                              ...prev,
                              [candidate.id]: err.message || "Failed to update review score",
                            }));
                          } finally {
                            setSavingScoreId(null);
                          }
                        }
                      }}
                      disabled={savingScoreId === candidate.id}
                      className={`w-28 bg-[#111115] border px-2 py-0.5 text-[11px] font-mono text-white text-center outline-none transition-colors ${
                        scoreErrors[candidate.id]
                          ? "border-red-500/80 text-red-300"
                          : "border-white/10 focus:border-racing-red"
                      } ${savingScoreId === candidate.id ? "opacity-50" : ""}`}
                    />
                  </div>
                  {scoreErrors[candidate.id] && (
                    <span className="text-[10px] font-mono text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{scoreErrors[candidate.id]}</span>
                    </span>
                  )}
                </div>

                {/* Decision Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {candidate.status !== "Pending" && (
                    <button
                      onClick={() => onUpdateStatus(candidate.id, "Pending")}
                      className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1"
                      title="Reset candidate status back to Pending Review"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Pending</span>
                    </button>
                  )}

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

                  <button
                    onClick={() => onDeleteApplication(candidate.id, candidate.full_name)}
                    className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
                    title={`Delete application of ${candidate.full_name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
                <div
                  className={`p-3 text-xs font-mono flex items-center gap-2 border ${
                    emailFeedback.type === "error"
                      ? "bg-red-500/10 border-red-500/40 text-red-300"
                      : "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                  }`}
                >
                  {emailFeedback.type === "error" ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  )}
                  <span>{emailFeedback.message}</span>
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

      {/* Status Selection Modal for Excel Export */}
      {showStatusExportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-white/15 w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-black text-lg uppercase text-white">Export Candidates</h3>
              </div>
              <button
                onClick={() => setShowStatusExportModal(false)}
                className="p-1 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-white/60 mb-5 leading-relaxed">
              Select which candidate cohort the senior council needs for this download:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleExecuteExport("ALL")}
                className="w-full text-left px-4 py-3 bg-[#121318] hover:bg-white/10 border border-white/10 text-white font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">All Candidates (Complete Database)</span>
                <span className="bg-white/10 px-2 py-0.5 text-[10px] rounded">{recruits.length}</span>
              </button>

              <button
                onClick={() => handleExecuteExport("Accepted")}
                className="w-full text-left px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Accepted Recruits Only (For Onboarding Roster)</span>
                <span className="bg-emerald-500/20 px-2 py-0.5 text-[10px] rounded">{recruits.filter(r => r.status === "Accepted").length}</span>
              </button>

              <button
                onClick={() => handleExecuteExport("Shortlisted")}
                className="w-full text-left px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Shortlisted Candidates (For Round 2 Interviews)</span>
                <span className="bg-blue-500/20 px-2 py-0.5 text-[10px] rounded">{recruits.filter(r => r.status === "Shortlisted").length}</span>
              </button>

              <button
                onClick={() => handleExecuteExport("Pending")}
                className="w-full text-left px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Pending Review Applications</span>
                <span className="bg-amber-500/20 px-2 py-0.5 text-[10px] rounded">{recruits.filter(r => r.status === "Pending").length}</span>
              </button>

              <button
                onClick={() => handleExecuteExport("Declined")}
                className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Declined Applications</span>
                <span className="bg-red-500/20 px-2 py-0.5 text-[10px] rounded">{recruits.filter(r => r.status === "Declined").length}</span>
              </button>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-white/10">
              <button
                onClick={() => setShowStatusExportModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Recruitment Portal Details Modal */}
      {showEditPortalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-[#0b0c10] border border-white/15 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-racing-red" />
                <h3 className="font-display font-black text-xl uppercase text-white">Edit Recruitment Portal Content</h3>
              </div>
              <button
                onClick={() => setShowEditPortalModal(false)}
                className="p-1 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortalDetails} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Portal Headline / Title</label>
                <input
                  type="text"
                  required
                  value={portalTitle}
                  onChange={(e) => setPortalTitle(e.target.value)}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Deadline / Induction Phase Tagline</label>
                <input
                  type="text"
                  required
                  value={portalDeadline}
                  onChange={(e) => setPortalDeadline(e.target.value)}
                  placeholder="e.g. Season 2026 Phase 1 Induction • Closes Sunday 11:59 PM"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Eligibility Note</label>
                <textarea
                  rows={2}
                  value={portalEligibility}
                  onChange={(e) => setPortalEligibility(e.target.value)}
                  placeholder="e.g. Open to all 1st and 2nd year B.Tech students of VSSUT Burla across all branches..."
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">General Instructions & Safety Guidelines</label>
                <textarea
                  rows={3}
                  value={portalInstructions}
                  onChange={(e) => setPortalInstructions(e.target.value)}
                  placeholder="Instructions shown to candidates above the form..."
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">WhatsApp Group Link for Accepted Recruits</label>
                <input
                  type="url"
                  value={portalWhatsapp}
                  onChange={(e) => setPortalWhatsapp(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditPortalModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPortal}
                  className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {savingPortal ? "Saving..." : "Save Portal Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
