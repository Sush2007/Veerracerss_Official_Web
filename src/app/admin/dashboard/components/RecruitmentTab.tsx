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
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Phone,
  X,
  MessageSquare,
  Inbox,
  Check,
  UserCheck,
  UserX,
  ListFilter,
  Plus,
  AlignLeft,
  ChevronDown,
} from "lucide-react";
import {
  RecruitmentApplication,
  SiteSettings,
  RecruitmentCustomQuestion,
  DEFAULT_RECRUITMENT_QUESTIONS,
} from "@/src/data/cms_defaults";
import { exportTableToExcel } from "@/src/lib/exportToExcel";

interface RecruitmentTabProps {
  recruits: RecruitmentApplication[];
  siteSettings: SiteSettings;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  onUpdateStatus: (
    id: string,
    status: "Pending" | "Shortlisted" | "Accepted" | "Declined",
    onboardingEmailSent?: boolean,
    silent?: boolean
  ) => Promise<void>;
  onUpdateScore?: (id: string, score: string) => Promise<void>;
  onDeleteApplication: (id: string, name: string) => Promise<void>;
  showToast?: (msg: string) => void;
  showError?: (msg: string) => void;
}

export function RecruitmentTab({
  recruits,
  siteSettings,
  onUpdateSettings,
  onUpdateStatus,
  onDeleteApplication,
  showToast,
  showError,
}: RecruitmentTabProps) {
  // Workflow Tab: "inbox" (Awaiting Decision), "accepted", "declined", "all"
  const [workflowTab, setWorkflowTab] = useState<"inbox" | "accepted" | "declined" | "all">("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("ALL");
  const [domainFilter, setDomainFilter] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Status Export Modal State
  const [showStatusExportModal, setShowStatusExportModal] = useState(false);

  // Set Questions Modal State
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<RecruitmentCustomQuestion[]>(() => {
    if (siteSettings.recruitment_custom_questions && siteSettings.recruitment_custom_questions.length > 0) {
      return siteSettings.recruitment_custom_questions;
    }
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("vr_recruitment_custom_questions");
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return DEFAULT_RECRUITMENT_QUESTIONS;
  });
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
      showStatusExportModal ||
        showQuestionsModal ||
        showEmailTemplateModal
    );

    if (isAnyModalOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [showStatusExportModal, showQuestionsModal, showEmailTemplateModal]);

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
          "electronics",
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

  const handleAcceptWithEmail = async (candidate: RecruitmentApplication) => {
    setProcessingId(candidate.id);
    try {
      const subject =
        siteSettings.onboarding_email_subject ||
        `Welcome to VeerRacerss Electric // Induction Offer: ${candidate.primary_domain}`;

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

      let emailSentSuccess = false;
      let emailErrorMessage = "";
      try {
        const res = await fetch("/api/recruitment/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: candidate.email,
            candidateName: candidate.full_name,
            subject,
            message: hydrated,
            applicationId: candidate.id,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          emailSentSuccess = true;
        } else {
          emailErrorMessage = data.error || "Email delivery failed.";
        }
      } catch (sendErr: any) {
        emailErrorMessage = sendErr.message || "Network error dispatching email.";
        console.warn("Background automated email dispatch notice:", sendErr);
      }

      await onUpdateStatus(candidate.id, "Accepted", emailSentSuccess, true);
      candidate.onboarding_email_sent = emailSentSuccess;
      if (emailSentSuccess) {
        if (showToast) {
          showToast(`Accepted ${candidate.full_name}! Confirmation letter dispatched to ${candidate.email} via Google SMTP.`);
        }
      } else {
        if (showError) {
          showError(`Accepted ${candidate.full_name}, but email failed: ${emailErrorMessage}`);
        } else if (showToast) {
          showToast(`Accepted ${candidate.full_name} (Email dispatch failed: ${emailErrorMessage})`);
        }
      }
    } catch (err: any) {
      if (showError) showError(err.message || "Failed to accept candidate.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleShortlist = async (candidate: RecruitmentApplication) => {
    setProcessingId(candidate.id);
    try {
      await onUpdateStatus(candidate.id, "Shortlisted");
      if (showToast) showToast(`${candidate.full_name} moved to Shortlist.`);
    } catch (err: any) {
      if (showError) showError(err.message || "Failed to shortlist candidate.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (candidate: RecruitmentApplication) => {
    setProcessingId(candidate.id);
    try {
      await onUpdateStatus(candidate.id, "Declined");
      if (showToast) showToast(`${candidate.full_name} moved to Declined list.`);
    } catch (err: any) {
      if (showError) showError(err.message || "Failed to decline candidate.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestoreToInbox = async (candidate: RecruitmentApplication) => {
    setProcessingId(candidate.id);
    try {
      await onUpdateStatus(candidate.id, "Pending");
      if (showToast) showToast(`${candidate.full_name} restored to Inbox.`);
    } catch (err: any) {
      if (showError) showError(err.message || "Failed to restore candidate.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAddQuestion = () => {
    const newQ: RecruitmentCustomQuestion = {
      id: `q-${Date.now()}`,
      label: "",
      type: "textbox",
      placeholder: "e.g. Describe your experience or tools used...",
      required: true,
    };
    setCustomQuestions((prev) => [...prev, newQ]);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<RecruitmentCustomQuestion>) => {
    setCustomQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const handleRemoveQuestion = (id: string) => {
    if (customQuestions.length <= 1) {
      if (showError) showError("You must retain at least one question.");
      return;
    }
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasEmpty = customQuestions.some((q) => !q.label.trim());
    if (hasEmpty) {
      if (showError) showError("Please enter a title/prompt for all questions.");
      return;
    }
    setSavingQuestions(true);
    try {
      const primaryPrompt =
        customQuestions.find((q) => q.type === "textbox")?.label ||
        customQuestions[0]?.label ||
        "Technical Motivation";
      await onUpdateSettings({
        recruitment_question_prompt: primaryPrompt,
        recruitment_eligibility: eligibilityNote,
        recruitment_form_deadline: deadlineTagline,
        recruitment_custom_questions: customQuestions,
      });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_recruitment_custom_questions", JSON.stringify(customQuestions));
        } catch {}
      }
      setShowQuestionsModal(false);
      if (showToast) showToast("Questions & form fields saved successfully!");
    } catch (err: any) {
      if (showError) showError(err.message || "Failed to save questions.");
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
            onClick={() =>
              onUpdateSettings({
                recruitment_form_enabled: !formActive,
                recruitment_open: !formActive,
                recruitment_cta_enabled: true,
                recruitment_cta_url: "/recruitment",
                recruitment_cta_label: "RECRUITMENT 2026",
              })
            }
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
            <option value="Electronics & Embedded Systems">Electronics & Embedded Systems</option>
            <option value="Vehicle Dynamics & Suspension">Vehicle Dynamics & Suspension</option>
            <option value="Brakes & Thermals">Brakes & Thermals</option>
            <option value="Media & Public Relations">Media & Public Relations</option>
            <option value="Operations & Sponsorship">Operations & Sponsorship</option>
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
                      <div className="text-xs font-sans text-white/70 font-light leading-relaxed bg-black/40 p-3 border border-white/5 mt-2 whitespace-pre-wrap font-mono text-[11px]">
                        <span className="text-white/80 font-mono text-[10px] uppercase font-bold block mb-1 tracking-wider text-racing-red">
                          Application Responses:
                        </span>
                        {candidate.experience_summary}
                      </div>
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
                            : candidate.status === "Shortlisted"
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {isAccepted
                          ? "ACCEPTED"
                          : isDeclined
                          ? "DECLINED"
                          : candidate.status === "Shortlisted"
                          ? "SHORTLISTED"
                          : "AWAITING DECISION"}
                      </span>
                      {candidate.onboarding_email_sent ? (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 font-bold">
                          MAIL SENT
                        </span>
                      ) : isAccepted ? (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 font-bold">
                          MAIL PENDING / FAILED
                        </span>
                      ) : null}
                    </div>

                    {/* Intelligent Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {isAwaiting && (
                        <>
                          {/* 1. Decline */}
                          <button
                            onClick={() => handleDecline(candidate)}
                            disabled={processingId === candidate.id}
                            className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1 disabled:opacity-50"
                            title="Decline candidate and move to Declined list"
                          >
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            <span>Decline</span>
                          </button>

                          {/* 2. Shortlist */}
                          <button
                            onClick={() => handleShortlist(candidate)}
                            disabled={processingId === candidate.id || candidate.status === "Shortlisted"}
                            className={`px-2.5 py-1.5 text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1 disabled:opacity-50 ${
                              candidate.status === "Shortlisted"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-default"
                                : "bg-white/5 hover:bg-cyan-500/20 text-white/80 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30"
                            }`}
                            title="Shortlist candidate for review"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{candidate.status === "Shortlisted" ? "Shortlisted" : "Shortlist"}</span>
                          </button>

                          {/* 3. Accept */}
                          <button
                            onClick={() => handleAcceptWithEmail(candidate)}
                            disabled={processingId === candidate.id}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
                            title="Accept candidate & dispatch confirmation email via Google SMTP"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{processingId === candidate.id ? "Accepting..." : "Accept"}</span>
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <>
                          {/* Resend Confirmation Mail via Google SMTP */}
                          <button
                            onClick={() => handleAcceptWithEmail(candidate)}
                            disabled={processingId === candidate.id}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
                            title="Resend onboarding welcome letter via Google SMTP"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{processingId === candidate.id ? "Sending..." : "Resend Mail"}</span>
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
          MODAL 2: SET APPLICATION QUESTIONS (DYNAMIC TEXTBOX & DROPDOWN BUILDER)
      ========================================================================= */}
      {showQuestionsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setShowQuestionsModal(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-white/15 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-racing-red" />
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl uppercase text-white">
                    Set Application Questions & Custom Fields
                  </h3>
                  <p className="text-[10px] font-mono text-white/50">
                    Easily add textboxes and dropdown selection questions for applicant forms
                  </p>
                </div>
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
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6">
                
                {/* SECTION 1: QUESTION BUILDER */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        Form Questions ({customQuestions.length})
                      </h4>
                      <p className="text-[10px] font-mono text-white/50">
                        Customize question prompts and pick between Textbox (paragraph) or Dropdown (select option).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-3 py-1.5 bg-racing-red/20 hover:bg-racing-red text-racing-red hover:text-white border border-racing-red/40 text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {/* Question Cards */}
                  <div className="space-y-3">
                    {customQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="bg-[#121318] border border-white/10 p-4 space-y-3 relative group hover:border-white/20 transition-all"
                      >
                        {/* Question Top Row: Index, Type Selector & Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-racing-red text-white font-bold px-2 py-0.5 uppercase">
                              Question #{idx + 1}
                            </span>
                            <span className="text-[10px] font-mono uppercase text-white/40">
                              Type: <strong className="text-white uppercase">{q.type}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Type Toggle Pills */}
                            <div className="flex items-center bg-[#0b0c10] border border-white/10 p-0.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuestion(q.id, { type: "textbox" })}
                                className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold flex items-center gap-1 transition-colors ${
                                  q.type === "textbox"
                                    ? "bg-racing-red text-white"
                                    : "text-white/60 hover:text-white"
                                }`}
                              >
                                <AlignLeft className="w-3 h-3" />
                                <span>Textbox</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuestion(q.id, {
                                    type: "dropdown",
                                    options: q.options && q.options.length > 0 ? q.options : ["Option 1", "Option 2"],
                                  })
                                }
                                className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold flex items-center gap-1 transition-colors ${
                                  q.type === "dropdown"
                                    ? "bg-racing-red text-white"
                                    : "text-white/60 hover:text-white"
                                }`}
                              >
                                <ChevronDown className="w-3 h-3" />
                                <span>Dropdown</span>
                              </button>
                            </div>

                            {/* Required Checkbox */}
                            <label className="flex items-center gap-1.5 text-[11px] font-mono text-white/70 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(q.required)}
                                onChange={(e) => handleUpdateQuestion(q.id, { required: e.target.checked })}
                                className="accent-racing-red"
                              />
                              <span>Required</span>
                            </label>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(q.id)}
                              disabled={customQuestions.length <= 1}
                              className="p-1 text-white/40 hover:text-red-400 disabled:opacity-30 transition-colors"
                              title="Delete question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Question Title / Prompt */}
                        <div>
                          <label className="text-[11px] font-mono uppercase text-white/60 mb-1 block">
                            Question Title / Prompt <span className="text-racing-red">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={q.label}
                            onChange={(e) => handleUpdateQuestion(q.id, { label: e.target.value })}
                            placeholder="e.g. Which CAD or simulation software packages have you used?"
                            className="w-full bg-[#0b0c10] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                          />
                        </div>

                        {/* Dropdown Options Configuration */}
                        {q.type === "dropdown" && (
                          <div className="space-y-2 bg-[#0b0c10] p-3 border border-white/5">
                            <label className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                              Dropdown Options (Comma-Separated)
                            </label>
                            <input
                              type="text"
                              value={(q.options || []).join(", ")}
                              onChange={(e) => {
                                const rawOpts = e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean);
                                handleUpdateQuestion(q.id, { options: rawOpts });
                              }}
                              placeholder="e.g. SolidWorks, ANSYS Fluent, Fusion 360, MATLAB, None"
                              className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                            />
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[9px] font-mono text-white/40 uppercase">Preview Options:</span>
                              {(q.options && q.options.length > 0 ? q.options : ["Option 1", "Option 2"]).map(
                                (opt, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-white/10 border border-white/15 text-white/80 text-[10px] font-mono"
                                  >
                                    {opt}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Textbox Placeholder Hint */}
                        {q.type === "textbox" && (
                          <div>
                            <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                              Placeholder / Helper Hint for Students (Optional)
                            </label>
                            <input
                              type="text"
                              value={q.placeholder || ""}
                              onChange={(e) => handleUpdateQuestion(q.id, { placeholder: e.target.value })}
                              placeholder="e.g. Describe your prior technical projects, hands-on tasks, or software..."
                              className="w-full bg-[#0b0c10] border border-white/10 px-3 py-1.5 text-xs font-mono text-white/70 focus:border-racing-red outline-none"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full py-2.5 border border-dashed border-white/20 hover:border-racing-red/60 text-white/60 hover:text-white text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2 bg-[#121318]/50"
                  >
                    <Plus className="w-3.5 h-3.5 text-racing-red" />
                    <span>Add Another Question</span>
                  </button>
                </div>

                {/* SECTION 2: ELIGIBILITY & PHASE TAGLINE */}
                <div className="pt-3 border-t border-white/10 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    General Recruitment Form Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-white/60 mb-1 block font-bold">
                        Eligibility & Year Criteria Note
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={eligibilityNote}
                        onChange={(e) => setEligibilityNote(e.target.value)}
                        placeholder="e.g. Open to 1st Year (Freshers) & 2nd Year (Lateral)..."
                        className="w-full bg-[#121318] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-white/60 mb-1 block font-bold">
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
                  </div>
                </div>

                {/* SECTION 3: LIVE FORM PREVIEW */}
                <div className="bg-black/60 border border-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono uppercase text-racing-red font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Form Preview (What Students See On /recruitment):</span>
                    </span>
                    <span className="text-[9px] font-mono text-white/40 uppercase">Interactive Preview</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {customQuestions.map((q, i) => (
                      <div key={q.id} className="space-y-1">
                        <label className="text-xs font-mono uppercase text-white/80 block font-bold">
                          {q.label || `Untitled Question #${i + 1}`}
                          {q.required && <span className="text-racing-red ml-1">*</span>}
                        </label>
                        {q.type === "dropdown" ? (
                          <div className="w-full bg-[#121318] border border-white/10 p-2 text-white/60 text-xs font-mono flex items-center justify-between">
                            <span>Select an option...</span>
                            <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                          </div>
                        ) : (
                          <div className="w-full bg-[#121318] border border-white/10 p-2.5 text-white/30 text-xs font-mono italic">
                            [{q.placeholder || "Applicant will type their answer and technical details here..."}]
                          </div>
                        )}
                      </div>
                    ))}
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
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setShowEmailTemplateModal(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-white/15 w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
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
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setShowStatusExportModal(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-white/15 w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
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
