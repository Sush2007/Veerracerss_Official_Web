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
  Mail,
  Send,
  FileSpreadsheet,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Phone,
  X,
  MessageSquare,
  Copy,
  Inbox,
  Check,
  UserCheck,
  UserX,
  ListFilter,
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
  onUpdateScore?: (id: string, score: string) => Promise<void>;
  onDeleteApplication: (id: string, name: string) => Promise<void>;
}

export function RecruitmentTab({
  recruits,
  siteSettings,
  onUpdateSettings,
  onUpdateStatus,
  onDeleteApplication,
}: RecruitmentTabProps) {
  // Workflow Tab: "inbox" (Awaiting Decision), "accepted", "declined", "all"
  const [workflowTab, setWorkflowTab] = useState<"inbox" | "accepted" | "declined" | "all">("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("ALL");
  const [domainFilter, setDomainFilter] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  // Candidate Counts
  const inboxCount = recruits.filter((r) => r.status !== "Accepted" && r.status !== "Declined").length;
  const acceptedCount = recruits.filter((r) => r.status === "Accepted").length;
  const declinedCount = recruits.filter((r) => r.status === "Declined").length;
  const totalCount = recruits.length;

  // Strict modal body scroll-locking: Prevents background scrolling 100% of the time
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      emailModalCandidate ||
        showStatusExportModal ||
        showQuestionsModal ||
        showEmailTemplateModal
    );

    if (isAnyModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [emailModalCandidate, showStatusExportModal, showQuestionsModal, showEmailTemplateModal]);

  // Filter & Smart Sorting Calculations
  const filteredRecruits = recruits
    .filter((r) => {
      // Workflow stage filter
      if (workflowTab === "inbox") {
        if (r.status === "Accepted" || r.status === "Declined") return false;
      } else if (workflowTab === "accepted") {
        if (r.status !== "Accepted") return false;
      } else if (workflowTab === "declined") {
        if (r.status !== "Declined") return false;
      }

      // Year Filter
      const matchesYear = yearFilter === "ALL" || r.year_of_study === yearFilter;

      // Domain Filter
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

      // Search Query Filter
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

      return matchesYear && matchesDomain && matchesSearch;
    })
    .sort((a, b) => {
      // In "All" view: Unreviewed applications appear at the TOP, Accepted in middle, Declined at the BOTTOM
      if (workflowTab === "all") {
        const getRank = (status: string) => {
          if (status !== "Accepted" && status !== "Declined") return 0; // Inbox / Top
          if (status === "Accepted") return 1; // Accepted / Middle
          return 2; // Declined / Bottom
        };
        return getRank(a.status) - getRank(b.status);
      }
      return 0;
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

  const handleQuickAccept = async (candidate: RecruitmentApplication) => {
    setProcessingId(candidate.id);
    try {
      await onUpdateStatus(candidate.id, "Accepted");
    } finally {
      setProcessingId(null);
    }
  };

  const handleQuickDecline = async (candidate: RecruitmentApplication) => {
    setProcessingId(candidate.id);
    try {
      await onUpdateStatus(candidate.id, "Declined");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestoreToInbox = async (candidate: RecruitmentApplication) => {
    setProcessingId(candidate.id);
    try {
      await onUpdateStatus(candidate.id, "Pending");
    } finally {
      setProcessingId(null);
    }
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

      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch email via Resend.");
      }

      await onUpdateStatus(emailModalCandidate.id, "Accepted", true);
      emailModalCandidate.onboarding_email_sent = true;
      setEmailFeedback({
        type: "success",
        message: "Onboarding letter successfully delivered to candidate's inbox!",
      });

      setTimeout(() => {
        setEmailModalCandidate(null);
      }, 1500);
    } catch (err: any) {
      setEmailFeedback({
        type: "error",
        message: err.message || "Failed to deliver email. Use the direct Gmail button below.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSaveQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingQuestions(true);
    try {
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

  const handleExecuteExport = (selectedCohort: "ALL" | "Inbox" | "Accepted" | "Declined") => {
    let listToExport = recruits;
    let fileName = "VeerRacerss_Recruitment_Candidates.xlsx";

    if (selectedCohort === "Inbox") {
      listToExport = recruits.filter((r) => r.status !== "Accepted" && r.status !== "Declined");
      fileName = "VeerRacerss_Recruits_Awaiting_Decision.xlsx";
    } else if (selectedCohort === "Accepted") {
      listToExport = recruits.filter((r) => r.status === "Accepted");
      fileName = "VeerRacerss_Accepted_Recruits_2026.xlsx";
    } else if (selectedCohort === "Declined") {
      listToExport = recruits.filter((r) => r.status === "Declined");
      fileName = "VeerRacerss_Declined_Applications.xlsx";
    }

    const exportRows = listToExport.map((r, i) => ({
      "S.No": i + 1,
      "Full Name": r.full_name,
      "Email Address": r.email,
      "WhatsApp / Phone": r.phone,
      "Roll Number": r.roll_no,
      "Year of Study": r.year_of_study,
      "Branch / Dept": r.branch,
      "Primary Domain": r.primary_domain,
      "Secondary Domain": r.secondary_domain || "None",
      "PR Specialization": r.notes || "None (Technical Only)",
      "Technical Experience / Statement": r.experience_summary || "",
      Status: r.status === "Pending" ? "Awaiting Decision" : r.status,
      "Onboarding Letter Sent": r.onboarding_email_sent ? "Yes" : "No",
      "Application Date": r.created_at ? new Date(r.created_at).toLocaleDateString() : "",
    }));

    exportTableToExcel(exportRows, fileName.replace(".xlsx", ""), "Recruits");
    setShowStatusExportModal(false);
  };

  const formActive = siteSettings.recruitment_form_enabled !== false;

  return (
    <div className="space-y-6 pb-20">
      {/* Master Toggle & Header Banner */}
      <div className="bg-[#0b0c10] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1 text-[10px] font-mono uppercase text-racing-red font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RECRUITMENT & INDUCTION CONTROL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            Applicant Triage & Onboarding
          </h2>
          <p className="text-xs font-mono text-white/50">
            {totalCount} Total Applications • {inboxCount} Awaiting Decision • {acceptedCount} Accepted
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

      {/* Prominent Smart Workflow Tabs (Inbox vs Accepted vs Declined vs All) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setWorkflowTab("inbox")}
          className={`p-3 sm:p-4 border transition-all text-left flex flex-col justify-between ${
            workflowTab === "inbox"
              ? "bg-amber-500/15 border-amber-500 text-white shadow-lg"
              : "bg-[#0b0c10] border-white/10 text-white/60 hover:text-white hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5" />
              <span>To Review (Inbox)</span>
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 font-bold ${
                inboxCount > 0
                  ? "bg-amber-500 text-black rounded-full"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {inboxCount}
            </span>
          </div>
          <div className="text-sm font-display font-black uppercase text-white truncate">
            Action Needed
          </div>
        </button>

        <button
          onClick={() => setWorkflowTab("accepted")}
          className={`p-3 sm:p-4 border transition-all text-left flex flex-col justify-between ${
            workflowTab === "accepted"
              ? "bg-emerald-500/15 border-emerald-500 text-white shadow-lg"
              : "bg-[#0b0c10] border-white/10 text-white/60 hover:text-white hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Accepted Squad</span>
            </span>
            <span className="text-xs font-mono px-2 py-0.5 font-bold bg-emerald-500/20 text-emerald-300">
              {acceptedCount}
            </span>
          </div>
          <div className="text-sm font-display font-black uppercase text-white truncate">
            Accepted
          </div>
        </button>

        <button
          onClick={() => setWorkflowTab("declined")}
          className={`p-3 sm:p-4 border transition-all text-left flex flex-col justify-between ${
            workflowTab === "declined"
              ? "bg-red-500/15 border-red-500 text-white shadow-lg"
              : "bg-[#0b0c10] border-white/10 text-white/60 hover:text-white hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5">
              <UserX className="w-3.5 h-3.5" />
              <span>Declined List</span>
            </span>
            <span className="text-xs font-mono px-2 py-0.5 font-bold bg-red-500/20 text-red-300">
              {declinedCount}
            </span>
          </div>
          <div className="text-sm font-display font-black uppercase text-white truncate">
            Declined
          </div>
        </button>

        <button
          onClick={() => setWorkflowTab("all")}
          className={`p-3 sm:p-4 border transition-all text-left flex flex-col justify-between ${
            workflowTab === "all"
              ? "bg-white/15 border-white text-white shadow-lg"
              : "bg-[#0b0c10] border-white/10 text-white/60 hover:text-white hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-white/70 flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5" />
              <span>Master Roster</span>
            </span>
            <span className="text-xs font-mono px-2 py-0.5 font-bold bg-white/10 text-white">
              {totalCount}
            </span>
          </div>
          <div className="text-sm font-display font-black uppercase text-white truncate">
            All Applicants
          </div>
        </button>
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
            <option value="Powertrain & High Voltage">Powertrain & High Voltage</option>
            <option value="Chassis & Aerodynamics">Chassis & Aerodynamics</option>
            <option value="Suspension & Kinematics">Suspension & Kinematics</option>
            <option value="Brakes & Vehicle Dynamics">Brakes & Vehicle Dynamics</option>
            <option value="pr">PR / Media / Sponsorship</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      {filteredRecruits.length === 0 ? (
        <div className="bg-[#0b0c10] border border-white/10 p-12 text-center text-white/50 font-mono text-xs">
          {workflowTab === "inbox" ? (
            <div className="space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-400 opacity-60" />
              <p className="text-white text-sm font-display uppercase font-bold">Inbox Zero!</p>
              <p className="text-white/40">All recruitment applications have been reviewed and processed.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Users className="w-8 h-8 mx-auto opacity-30" />
              <p>No candidates found matching the current filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecruits.map((candidate) => {
            const isAccepted = candidate.status === "Accepted";
            const isDeclined = candidate.status === "Declined";
            const isAwaiting = !isAccepted && !isDeclined;

            return (
              <div
                key={candidate.id}
                className={`bg-[#0b0c10] border p-4 sm:p-5 transition-all ${
                  isAccepted
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : isDeclined
                    ? "border-red-500/20 bg-red-950/5 opacity-75"
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
                        title="Chat with candidate on WhatsApp"
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
                    {candidate.notes && (
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

                  {/* Right: Smart Workflow Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-start lg:items-end gap-3 shrink-0 lg:border-l lg:border-white/10 lg:pl-5">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-white/50">Status:</span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 border ${
                          isAccepted
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : isDeclined
                            ? "bg-red-500/20 text-red-400 border-red-500/40"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {isAccepted ? "ACCEPTED" : isDeclined ? "DECLINED" : "AWAITING DECISION"}
                      </span>
                      {candidate.onboarding_email_sent && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 font-bold">
                          MAIL SENT
                        </span>
                      )}
                    </div>

                    {/* Intelligent Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {isAwaiting && (
                        <>
                          {/* 1-Click Decline */}
                          <button
                            onClick={() => handleQuickDecline(candidate)}
                            disabled={processingId === candidate.id}
                            className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1 disabled:opacity-50"
                            title="Decline candidate and move to Declined list"
                          >
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            <span>Decline</span>
                          </button>

                          {/* Quick Accept (Without Email) */}
                          <button
                            onClick={() => handleQuickAccept(candidate)}
                            disabled={processingId === candidate.id}
                            className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1 disabled:opacity-50"
                            title="Accept candidate directly"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Accept</span>
                          </button>

                          {/* Accept & Open Email Dispatcher */}
                          <button
                            onClick={() => handleOpenEmailModal(candidate)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
                            title="Accept recruit & open customized onboarding email composer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Accept & Mail</span>
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <>
                          {/* Send / Resend Onboarding Letter */}
                          <button
                            onClick={() => handleOpenEmailModal(candidate)}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                            title="Dispatch or resend onboarding welcome letter"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{candidate.onboarding_email_sent ? "Resend Mail" : "Dispatch Mail"}</span>
                          </button>

                          {/* Direct WhatsApp Contact */}
                          <a
                            href={`https://wa.me/${candidate.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hello ${candidate.full_name}, this is VeerRacerss Electric regarding your induction.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/10 text-[11px] font-mono uppercase flex items-center gap-1 transition-colors"
                            title="Open WhatsApp chat with candidate"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Restore to Inbox */}
                          <button
                            onClick={() => handleRestoreToInbox(candidate)}
                            disabled={processingId === candidate.id}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-[11px] font-mono uppercase flex items-center gap-1 transition-colors"
                            title="Undo acceptance and move back to Inbox"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Move to Inbox</span>
                          </button>
                        </>
                      )}

                      {isDeclined && (
                        <button
                          onClick={() => handleRestoreToInbox(candidate)}
                          disabled={processingId === candidate.id}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-[11px] font-mono uppercase flex items-center gap-1.5 transition-colors"
                          title="Reconsider candidate and restore to Inbox"
                        >
                          <RotateCcw className="w-3 h-3 text-cyan-400" />
                          <span>Reconsider / Restore</span>
                        </button>
                      )}

                      {/* Delete */}
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
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ONBOARDING EMAIL COMPOSER (With 1-Click Gmail & Resend Handling)
      ========================================================================= */}
      {emailModalCandidate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#0b0c10] border border-racing-red/50 w-full max-w-2xl max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            {/* Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
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

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
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
                  rows={8}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed font-sans"
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
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0b0c10]">
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
      )}

      {/* =========================================================================
          MODAL 2: SET APPLICATION QUESTIONS
      ========================================================================= */}
      {showQuestionsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/15 w-full max-w-xl max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            {/* Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
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

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveQuestions} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
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
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
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
          <div className="bg-[#0b0c10] border border-white/15 w-full max-w-2xl max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            {/* Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
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

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveEmailTemplate} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
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
                    rows={8}
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
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
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
          <div className="bg-[#0b0c10] border border-white/15 w-full max-w-md max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            {/* Modal Header */}
            <div className="shrink-0 p-5 pb-3 border-b border-white/10 flex items-center justify-between">
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

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-2.5">
              <p className="text-xs font-mono text-white/60 mb-3 leading-relaxed">
                Select which candidate cohort the senior council needs for this download:
              </p>

              <button
                onClick={() => handleExecuteExport("ALL")}
                className="w-full text-left px-4 py-3 bg-[#121318] hover:bg-white/10 border border-white/10 text-white font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">All Candidates (Complete Database)</span>
                <span className="bg-white/10 px-2 py-0.5 text-[10px] rounded">{totalCount}</span>
              </button>

              <button
                onClick={() => handleExecuteExport("Inbox")}
                className="w-full text-left px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Awaiting Decision (Inbox Only)</span>
                <span className="bg-amber-500/20 px-2 py-0.5 text-[10px] rounded">{inboxCount}</span>
              </button>

              <button
                onClick={() => handleExecuteExport("Accepted")}
                className="w-full text-left px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Accepted Recruits Only (For Onboarding Roster)</span>
                <span className="bg-emerald-500/20 px-2 py-0.5 text-[10px] rounded">{acceptedCount}</span>
              </button>

              <button
                onClick={() => handleExecuteExport("Declined")}
                className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-xs flex items-center justify-between transition-colors"
              >
                <span className="font-bold uppercase">Declined Applications</span>
                <span className="bg-red-500/20 px-2 py-0.5 text-[10px] rounded">{declinedCount}</span>
              </button>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-4 border-t border-white/10 flex justify-end bg-[#0b0c10]">
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
