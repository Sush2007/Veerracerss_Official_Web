"use client";

import { useState, useEffect } from "react";
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
  HelpCircle,
  Copy,
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
  const [emailFeedback, setEmailFeedback] = useState<{
    type: "success" | "error";
    message: string;
    isDomainRestriction?: boolean;
  } | null>(null);

  // Status Export Modal State
  const [showStatusExportModal, setShowStatusExportModal] = useState(false);

  // Set Questions Modal State
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [questionPrompt, setQuestionPrompt] = useState(
    siteSettings.recruitment_question_prompt ||
      "Why VeerRacerss Electric & Prior Technical Experience / Hands-on Projects"
  );
  const [eligibilityNote, setEligibilityNote] = useState(
    siteSettings.recruitment_eligibility ||
      "Open to 1st Year (Freshers) & 2nd Year (Lateral) B.Tech students across all engineering branches of VSSUT Burla."
  );
  const [deadlineTagline, setDeadlineTagline] = useState(
    siteSettings.recruitment_form_deadline || "Season 2026 Phase 1 Induction"
  );
  const [savingQuestions, setSavingQuestions] = useState(false);

  // Edit Confirmation Email Template Modal State
  const [showEmailTemplateModal, setShowEmailTemplateModal] = useState(false);
  const [templateSubject, setTemplateSubject] = useState(
    siteSettings.onboarding_email_subject || "Welcome to VeerRacerss Electric // Application Accepted"
  );
  const [templateBody, setTemplateBody] = useState(
    siteSettings.onboarding_email_template ||
      `Dear {candidate_name},

Congratulations! We are pleased to inform you that following the review of your induction application, you have been accepted into VeerRacerss Electric for the 2026 Season under the {primary_domain} division.

Next Steps:
1. Join our official recruitment WhatsApp group: {whatsapp_link}
2. Attend our induction briefing at the Central Workshop Block, VSSUT Burla.
3. Bring your college student ID card.

Welcome to the team!

Warm regards,
Team VeerRacerss Electric
VSSUT Burla`
  );
  const [whatsappLink, setWhatsappLink] = useState(
    siteSettings.whatsapp_recruit_link || "https://chat.whatsapp.com/veerracerss-recruits-2026"
  );
  const [savingEmailTemplate, setSavingEmailTemplate] = useState(false);

  // Fix dialog scrolling: lock body scroll whenever any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      emailModalCandidate ||
        showStatusExportModal ||
        showQuestionsModal ||
        showEmailTemplateModal
    );

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [emailModalCandidate, showStatusExportModal, showQuestionsModal, showEmailTemplateModal]);

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
        "suspension",
        "dynamics",
        "brakes",
        "web",
        "graphic",
        "video",
        "pr",
        "sponsorship",
        "media",
      ].some((kw) => {
        if (kw === "dynamics") {
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
      (r.secondary_domain && r.secondary_domain.toLowerCase().includes(query)) ||
      (r.notes && r.notes.toLowerCase().includes(query));

    return matchesStatus && matchesYear && matchesDomain && matchesSearch;
  });

  const handleOpenEmailModal = (candidate: RecruitmentApplication) => {
    setEmailModalCandidate(candidate);

    const subject =
      siteSettings.onboarding_email_subject ||
      `Welcome to VeerRacerss Electric // Induction Offer: ${candidate.primary_domain}`;
    setEmailSubject(subject);

    const baseTemplate =
      siteSettings.onboarding_email_template ||
      `Dear {candidate_name},

Congratulations! We are pleased to inform you that following the review of your induction application, you have been accepted into VeerRacerss Electric for the 2026 Season under the {primary_domain} division.

Next Steps:
1. Join our official recruitment WhatsApp group: {whatsapp_link}
2. Attend our induction briefing at the Central Workshop Block, VSSUT Burla.
3. Bring your college student ID card.

Welcome to the team!

Warm regards,
Team VeerRacerss Electric
VSSUT Burla`;

    const hydrated = baseTemplate
      .replace(/\{candidate_name\}/g, candidate.full_name)
      .replace(/\{\{name\}\}/g, candidate.full_name)
      .replace(/\{primary_domain\}/g, candidate.primary_domain)
      .replace(/\{\{domain\}\}/g, candidate.primary_domain)
      .replace(
        /\{whatsapp_link\}/g,
        siteSettings.whatsapp_recruit_link || "https://chat.whatsapp.com/veerracerss-recruits-2026"
      )
      .replace(
        /\{\{whatsapp_link\}\}/g,
        siteSettings.whatsapp_recruit_link || "https://chat.whatsapp.com/veerracerss-recruits-2026"
      );

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

      if (data.isDomainRestriction) {
        setEmailFeedback({
          type: "error",
          message: data.error,
          isDomainRestriction: true,
        });
        return;
      }

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

  const handleExecuteExport = (targetStatus: string) => {
    const list =
      targetStatus === "ALL" ? recruits : recruits.filter((r) => r.status === targetStatus);

    exportTableToExcel(
      list.map((r) => ({
        "Full Name": r.full_name,
        Email: r.email,
        "WhatsApp Phone": r.phone,
        "Roll Number": r.roll_no,
        "Academic Branch": r.branch,
        "Year of Study": r.year_of_study,
        "Primary Domain": r.primary_domain,
        "Secondary Domain": r.secondary_domain || "None",
        "PR Domain / Specialization": r.notes || "Technical Only",
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

  const handleSaveQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingQuestions(true);
    try {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "vr_recruitment_questions",
            JSON.stringify({ question_prompt: questionPrompt })
          );
        } catch {}
      }
      await onUpdateSettings({
        recruitment_question_prompt: questionPrompt,
        recruitment_eligibility: eligibilityNote,
        recruitment_form_deadline: deadlineTagline,
      });
      setShowQuestionsModal(false);
    } finally {
      setSavingQuestions(false);
    }
  };

  const handleSaveEmailTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmailTemplate(true);
    try {
      await onUpdateSettings({
        onboarding_email_subject: templateSubject,
        onboarding_email_template: templateBody,
        whatsapp_recruit_link: whatsappLink,
      });
      setShowEmailTemplateModal(false);
    } finally {
      setSavingEmailTemplate(false);
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
            <span>RECRUITMENT & INDUCTION CONTROL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            Applicant Checklist & Onboarding
          </h2>
          <p className="text-xs font-mono text-white/50">
            {recruits.length} Total Submissions • {recruits.filter((r) => r.status === "Accepted").length} Accepted
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Master Form Toggle */}
          <button
            onClick={() => onUpdateSettings({ recruitment_form_enabled: !formActive, recruitment_open: !formActive })}
            className={`px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
              formActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
            }`}
          >
            {formActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-red-400" />}
            <span>{formActive ? "Form: ACTIVE" : "Form: PAUSED"}</span>
          </button>

          {/* Set Questions Button */}
          <button
            onClick={() => setShowQuestionsModal(true)}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
            title="Set the questions and technical prompts asked to applicants"
          >
            <MessageSquare className="w-4 h-4 text-racing-red" />
            <span>Set Questions</span>
          </button>

          {/* Edit Confirmation Email Button */}
          <button
            onClick={() => setShowEmailTemplateModal(true)}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
            title="Edit the confirmation email received by the student"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Confirmation Mail</span>
          </button>

          {/* Excel Export Button */}
          <button
            onClick={() => setShowStatusExportModal(true)}
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
            <option value="Suspension & Kinematics (Double-Wishbone & Steering)">Suspension & Kinematics</option>
            <option value="Brakes & Vehicle Dynamics (Hydraulics & AP Racing)">Brakes & Vehicle Dynamics</option>
            <option value="pr">PR / Media / Sponsorship</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      {filteredRecruits.length === 0 ? (
        <div className="bg-[#0b0c10] border border-white/10 p-12 text-center text-white/50 font-mono text-xs">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
          No recruitment applications found matching the current filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecruits.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-[#0b0c10] border p-4 sm:p-5 transition-all ${
                candidate.status === "Accepted"
                  ? "border-emerald-500/40 bg-emerald-950/10"
                  : candidate.status === "Declined"
                  ? "border-red-500/30 opacity-70"
                  : candidate.status === "Shortlisted"
                  ? "border-blue-500/40"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Left: Candidate Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-black text-base uppercase text-white tracking-wide">
                      {candidate.full_name}
                    </h3>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 text-white/70">
                      {candidate.year_of_study} • {candidate.branch}
                    </span>
                    <span className="text-[10px] font-mono text-white/50">Roll: {candidate.roll_no}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/60">
                    <span className="flex items-center gap-1 text-white/80">
                      <Mail className="w-3.5 h-3.5 text-white/40" />
                      {candidate.email}
                    </span>
                    <a
                      href={`https://wa.me/${candidate.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {candidate.phone}
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
                    <span className="text-white/40">Technical Domains:</span>
                    <span className="bg-[#171820] text-racing-red font-semibold px-2 py-0.5 border border-white/10">
                      1. {candidate.primary_domain}
                    </span>
                    {candidate.secondary_domain && (
                      <span className="bg-[#171820] text-white/70 px-2 py-0.5 border border-white/10">
                        2. {candidate.secondary_domain}
                      </span>
                    )}
                  </div>

                  {/* PR Domain Interest Tag */}
                  {candidate.notes && candidate.notes.includes("PR") && (
                    <div className="pt-0.5">
                      <span className="inline-block bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                        {candidate.notes}
                      </span>
                    </div>
                  )}

                  {candidate.experience_summary && (
                    <p className="text-xs font-sans text-white/60 font-light leading-relaxed bg-black/40 p-2.5 border border-white/5 mt-2">
                      <span className="text-white/80 font-mono text-[10px] uppercase font-bold block mb-0.5">
                        Technical Experience / Motivation Statement:
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
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 font-bold">
                        MAIL DISPATCHED
                      </span>
                    )}
                  </div>

                  {/* Interview Score Input */}
                  <div className="flex flex-col items-start lg:items-end gap-1 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40 text-[10px] uppercase">Score:</span>
                      <input
                        type="text"
                        value={
                          scoreDrafts[candidate.id] !== undefined
                            ? scoreDrafts[candidate.id]
                            : candidate.interview_score || ""
                        }
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
                          const currentVal =
                            scoreDrafts[candidate.id] !== undefined
                              ? scoreDrafts[candidate.id]
                              : candidate.interview_score || "";
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
                        title="Reset to Pending"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    {candidate.status !== "Shortlisted" && (
                      <button
                        onClick={() => onUpdateStatus(candidate.id, "Shortlisted")}
                        className="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1"
                        title="Shortlist for Interview"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Shortlist</span>
                      </button>
                    )}

                    {candidate.status !== "Declined" && (
                      <button
                        onClick={() => onUpdateStatus(candidate.id, "Declined")}
                        className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1"
                        title="Decline Candidate"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Decline</span>
                      </button>
                    )}

                    {/* Accept & Send Onboarding Email */}
                    <button
                      onClick={() => handleOpenEmailModal(candidate)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
                      title="Accept recruit & open customized onboarding email composer"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>{candidate.status === "Accepted" ? "Email Letter" : "Accept & Mail"}</span>
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
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ONBOARDING EMAIL COMPOSER (With 1-Click Gmail & Resend Handling)
      ========================================================================= */}
      {emailModalCandidate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#0b0c10] border border-racing-red/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain my-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-racing-red/10 border border-racing-red/40 flex items-center justify-center text-racing-red">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-racing-red font-bold">
                    ONBOARDING LETTER DISPATCHER
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
                  Email Message Body (Customize any details before sending)
                </label>
                <textarea
                  rows={10}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                />
              </div>

              {/* Feedback Alert */}
              {emailFeedback && (
                <div
                  className={`p-3 text-xs font-mono flex items-start gap-2 border ${
                    emailFeedback.type === "error"
                      ? "bg-red-500/10 border-red-500/40 text-red-300"
                      : "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                  }`}
                >
                  {emailFeedback.type === "error" ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <span className="font-bold block">
                      {emailFeedback.isDomainRestriction ? "Resend Testing Domain Restriction" : "Delivery Notice"}
                    </span>
                    <span className="leading-relaxed">{emailFeedback.message}</span>
                  </div>
                </div>
              )}

              {/* Direct Gmail Fallback Notice */}
              <div className="p-3 bg-white/5 border border-white/10 text-white/70 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <span className="text-[11px]">
                  💡 <strong>Tip:</strong> If Resend domain is in test mode, you can immediately 1-click open this pre-filled message in Gmail.
                </span>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    emailModalCandidate.email
                  )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async () => {
                    await onUpdateStatus(emailModalCandidate.id, "Accepted", true);
                    emailModalCandidate.onboarding_email_sent = true;
                  }}
                  className="px-3.5 py-1.5 bg-white text-black font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-racing-red hover:text-white transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Gmail</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailMessage}`);
                      alert("Email text copied to clipboard!");
                    }}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono uppercase flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </button>

                  <a
                    href={`mailto:${encodeURIComponent(emailModalCandidate.email)}?subject=${encodeURIComponent(
                      emailSubject
                    )}&body=${encodeURIComponent(emailMessage)}`}
                    onClick={async () => {
                      await onUpdateStatus(emailModalCandidate.id, "Accepted", true);
                      emailModalCandidate.onboarding_email_sent = true;
                    }}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono uppercase flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Mail Client</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
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
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send via Resend API</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SET APPLICATION QUESTIONS
      ========================================================================= */}
      {showQuestionsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/15 w-full max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain my-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-racing-red" />
                <h3 className="font-display font-black text-xl uppercase text-white">
                  Set Application Questions & Prompts
                </h3>
              </div>
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="p-1 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestions} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block font-bold">
                  Technical Experience Question Prompt (Shown to Students)
                </label>
                <textarea
                  rows={3}
                  required
                  value={questionPrompt}
                  onChange={(e) => setQuestionPrompt(e.target.value)}
                  placeholder="e.g. Why VeerRacerss Electric & Prior Technical Experience / Hands-on Projects"
                  className="w-full bg-[#121318] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                />
                <span className="text-[10px] text-white/40 block mt-1 font-mono">
                  This exact prompt is displayed above the main statement textarea on <code>/recruitment</code>.
                </span>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block font-bold">
                  Eligibility & Year Criteria Note
                </label>
                <textarea
                  rows={2}
                  required
                  value={eligibilityNote}
                  onChange={(e) => setEligibilityNote(e.target.value)}
                  placeholder="e.g. Open to 1st Year (Freshers) & 2nd Year (Lateral) B.Tech students..."
                  className="w-full bg-[#121318] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block font-bold">
                  Application Phase Tagline
                </label>
                <input
                  type="text"
                  required
                  value={deadlineTagline}
                  onChange={(e) => setDeadlineTagline(e.target.value)}
                  placeholder="e.g. Season 2026 Phase 1 Induction"
                  className="w-full bg-[#121318] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              {/* Live Preview Box */}
              <div className="bg-black/50 border border-white/10 p-3.5 mt-2">
                <span className="text-[10px] font-mono uppercase text-racing-red font-bold block mb-1.5">
                  Live Form Preview (What Students See):
                </span>
                <label className="text-xs font-mono uppercase text-white/80 block font-bold mb-1">
                  {questionPrompt} <span className="text-racing-red">*</span>
                </label>
                <div className="bg-[#121318] border border-white/10 p-2 text-white/30 text-xs font-mono italic">
                  [Applicant will type their answer and technical details here...]
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowQuestionsModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingQuestions}
                  className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase transition-all disabled:opacity-50"
                >
                  {savingQuestions ? "Saving Questions..." : "Save Questions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: EDIT CONFIRMATION EMAIL TEMPLATE
      ========================================================================= */}
      {showEmailTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain my-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-black text-xl uppercase text-white">
                  Edit Confirmation & Onboarding Email Content
                </h3>
              </div>
              <button
                onClick={() => setShowEmailTemplateModal(false)}
                className="p-1 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmailTemplate} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block font-bold">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  placeholder="e.g. Welcome to VeerRacerss Electric // Application Accepted"
                  className="w-full bg-[#121318] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase text-white/60 font-bold block">
                    Email Body Content (Template)
                  </label>
                  <span className="text-[10px] font-mono text-white/40">
                    Supports: <code>{'{candidate_name}'}</code>, <code>{'{primary_domain}'}</code>, <code>{'{whatsapp_link}'}</code>
                  </span>
                </div>
                <textarea
                  rows={10}
                  required
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  placeholder="Enter the onboarding text received by accepted recruits..."
                  className="w-full bg-[#121318] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block font-bold">
                  Official WhatsApp Recruits Group Link
                </label>
                <input
                  type="url"
                  required
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-[#121318] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
                <span className="text-[10px] text-white/40 block mt-1 font-mono">
                  This link automatically replaces <code>{'{whatsapp_link}'}</code> in the email.
                </span>
              </div>

              {/* Live Preview */}
              <div className="bg-black/50 border border-white/10 p-4">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-2">
                  Live Email Preview (With Sample Student Data):
                </span>
                <div className="bg-[#14151b] border border-white/10 p-3 text-white/80 text-xs font-sans whitespace-pre-wrap leading-relaxed">
                  <strong className="text-white block pb-1 border-b border-white/10 mb-2">
                    Subject: {templateSubject}
                  </strong>
                  {templateBody
                    .replace(/\{candidate_name\}/g, "Rahul Sharma")
                    .replace(/\{primary_domain\}/g, "Powertrain & High Voltage")
                    .replace(/\{whatsapp_link\}/g, whatsappLink || "https://chat.whatsapp.com/...")}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEmailTemplateModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEmailTemplate}
                  className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase transition-all disabled:opacity-50"
                >
                  {savingEmailTemplate ? "Saving Template..." : "Save Email Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: STATUS SELECTION MODAL FOR EXCEL EXPORT
      ========================================================================= */}
      {showStatusExportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/15 w-full max-w-md max-h-[90vh] overflow-y-auto overscroll-contain my-auto p-6 shadow-2xl relative">
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
                <span className="bg-emerald-500/20 px-2 py-0.5 text-[10px] rounded">
                  {recruits.filter((r) => r.status === "Accepted").length}
                </span>
              </button>

              <button
                onClick={() => handleExecuteExport("Shortlisted")}
                className="w-full text-left px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Shortlisted Candidates (For Round 2 Interviews)</span>
                <span className="bg-blue-500/20 px-2 py-0.5 text-[10px] rounded">
                  {recruits.filter((r) => r.status === "Shortlisted").length}
                </span>
              </button>

              <button
                onClick={() => handleExecuteExport("Pending")}
                className="w-full text-left px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Pending Review Applications</span>
                <span className="bg-amber-500/20 px-2 py-0.5 text-[10px] rounded">
                  {recruits.filter((r) => r.status === "Pending").length}
                </span>
              </button>

              <button
                onClick={() => handleExecuteExport("Declined")}
                className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Declined Applications</span>
                <span className="bg-red-500/20 px-2 py-0.5 text-[10px] rounded">
                  {recruits.filter((r) => r.status === "Declined").length}
                </span>
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
    </div>
  );
}
