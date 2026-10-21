"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Send, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import {
  RecruitmentCustomQuestion,
  DEFAULT_RECRUITMENT_QUESTIONS,
} from "@/src/data/cms_defaults";

interface RecruitmentFormProps {
  formEnabled: boolean;
  formTitle: string;
  formDeadline: string;
  contactEmail: string;
}

export function RecruitmentForm({
  formEnabled,
  formTitle,
  formDeadline,
  contactEmail,
}: RecruitmentFormProps) {
  const [isFormActive, setIsFormActive] = useState<boolean>(formEnabled);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("Mechanical Engineering");
  const [yearOfStudy, setYearOfStudy] = useState("1st Year");
  const [primaryDomain, setPrimaryDomain] = useState("Powertrain and Drivetrain");
  const [secondaryDomain, setSecondaryDomain] = useState("Chassis and Design");
  const [prDomain, setPrDomain] = useState("None (Technical Only)");
  const [customQuestions, setCustomQuestions] = useState<RecruitmentCustomQuestion[]>(
    DEFAULT_RECRUITMENT_QUESTIONS
  );
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsFormActive(formEnabled);
  }, [formEnabled]);

  useEffect(() => {
    async function loadFormSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
        if (data) {
          const active = data.recruitment_form_enabled !== false && (data as any).recruitment_open !== false;
          setIsFormActive(active);
        } else if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("vr_site_settings_extended");
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.recruitment_form_enabled !== undefined || parsed.recruitment_open !== undefined) {
                setIsFormActive(parsed.recruitment_form_enabled !== false && parsed.recruitment_open !== false);
              }
            }
          } catch {}
        }

        let loadedQs: RecruitmentCustomQuestion[] | null = null;
        if (
          data?.recruitment_custom_questions &&
          Array.isArray(data.recruitment_custom_questions) &&
          data.recruitment_custom_questions.length > 0
        ) {
          loadedQs = data.recruitment_custom_questions;
        } else if (typeof window !== "undefined") {
          const raw = localStorage.getItem("vr_recruitment_custom_questions");
          if (raw) {
            try {
              loadedQs = JSON.parse(raw);
            } catch {}
          }
        }
        if (loadedQs && loadedQs.length > 0) {
          setCustomQuestions(loadedQs);
        } else if (data?.recruitment_question_prompt) {
          setCustomQuestions([
            {
              id: "q-1",
              label: data.recruitment_question_prompt,
              type: "textbox",
              required: true,
            },
          ]);
        }
      } catch {}
    }
    loadFormSettings();
  }, []);

  const branches = [
    "Mechanical Engineering",
    "Electrical Engineering",
    "Electronics & TC Engineering",
    "Computer Science & Engineering",
    "Information Technology",
    "Electrical & Electronics Engineering (EEE)",
    "Production Engineering",
    "Metallurgical & Materials Engineering",
    "Chemical Engineering",
    "Civil Engineering",
  ];

  // Technical engineering domains
  const domains = [
    "Powertrain and Drivetrain",
    "Chassis and Design",
    "Suspension and Steering",
    "Brakes and Tires",
  ];

  const prDomains = [
    "None (Technical Only)",
    "Web Development & Coding",
    "Graphic Designing & 3D Visuals",
    "Video Editing & Content Creation",
    "Corporate Sponsorship & Public Relations",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      // Compile dynamic custom question answers into structured summary
      const answersSummary =
        customQuestions.length > 0
          ? customQuestions
              .map((q) => {
                const val = (questionAnswers[q.id] || "").trim();
                return `${q.label}:\n${val || "(Not answered)"}`;
              })
              .join("\n\n")
          : "";

      const res = await fetch("/api/recruitment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          roll_no: rollNo,
          branch,
          year_of_study: yearOfStudy,
          primary_domain: primaryDomain,
          secondary_domain: secondaryDomain,
          pr_domain: prDomain,
          experience_summary: answersSummary,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please check your network and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isFormActive) {
    return (
      <div className="bg-[#0c0d12] border border-white/10 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-racing-red">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white mb-2">
          Applications Closed for this Window
        </h2>
        <p className="text-white/60 text-xs sm:text-sm font-sans mb-6 font-light">
          Official recruitment for this induction phase has completed. Stay tuned to our official Instagram and LinkedIn handles for announcements on upcoming lateral intakes.
        </p>
        <a
          href={`mailto:${contactEmail}?subject=Recruitment%20Query%20-%20VeerRacerss%20Electric`}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-racing-red text-white text-xs font-mono font-bold px-6 py-3 transition-colors uppercase tracking-wider"
        >
          <span>Contact Recruitment Desk</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-[#0b1710] border border-emerald-500/40 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase tracking-widest font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>APPLICATION SUBMITTED SUCCESSFULLY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-white mb-3">
          Application Received, {fullName}!
        </h2>
        <p className="text-white/70 text-xs sm:text-sm font-sans mb-6 font-light leading-relaxed">
          Your profile has been logged with the VeerRacerss Electric technical leads. Shortlisted candidates will receive an official onboarding and interview invitation via email at <span className="text-emerald-400 font-mono">{email}</span>.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFullName("");
            setEmail("");
            setPhone("");
            setRollNo("");
            setQuestionAnswers({});
            setPrDomain("None (Technical Only)");
          }}
          className="bg-white/10 hover:bg-white hover:text-black text-white text-xs font-mono font-bold px-6 py-3 transition-all uppercase tracking-wider"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Top Banner */}
      <div className="border-b border-white/10 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-racing-red/10 border border-racing-red/30 text-racing-red font-mono text-[10px] uppercase tracking-widest font-bold mb-2">
            <Zap className="w-3 h-3" />
            <span>OFFICIAL RECRUITMENT PORTAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            {formTitle}
          </h2>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] font-mono text-white/70 uppercase">
          <span className="text-racing-red font-bold">STATUS: </span>
          {formDeadline}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
              Full Name <span className="text-racing-red">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
              Email Address <span className="text-racing-red">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul.sharma@vssut.ac.in"
              className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Contact & Roll No */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
              WhatsApp Phone Number <span className="text-racing-red">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
              University Roll / Registration No <span className="text-racing-red">*</span>
            </label>
            <input
              type="text"
              required
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. 2502040019"
              className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
            />
          </div>
        </div>

        {/* Row 3: Academic Branch & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
              Academic Department / Branch <span className="text-racing-red">*</span>
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
              Current Year of Study <span className="text-racing-red">*</span>
            </label>
            <select
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
            >
              <option value="1st Year">1st Year (Freshers Induction)</option>
              <option value="2nd Year">2nd Year (Lateral Phase 2 Intake)</option>
            </select>
          </div>
        </div>

        {/* Row 4: Technical Domain Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
              Primary Technical Domain <span className="text-racing-red">*</span>
            </label>
            <select
              value={primaryDomain}
              onChange={(e) => setPrimaryDomain(e.target.value)}
              className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
              Secondary Technical Domain (Optional)
            </label>
            <select
              value={secondaryDomain}
              onChange={(e) => setSecondaryDomain(e.target.value)}
              className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: PR / Media / Non-Technical Preference (Optional) */}
        <div>
          <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
            Interested in PR / Media / Non-Technical Domain? (Optional)
          </label>
          <select
            value={prDomain}
            onChange={(e) => setPrDomain(e.target.value)}
            className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
          >
            {prDomains.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-white/40 block mt-1 font-mono">
            If you also possess skills in web development, graphic design, video editing, or sponsorship, select your choice above.
          </span>
        </div>

        {/* Senior / Admin Configured Questions (Textbox or Dropdown) */}
        {customQuestions.map((q, idx) => {
          const val = questionAnswers[q.id] || "";
          return (
            <div key={q.id || idx}>
              <label className="text-xs font-mono uppercase text-white/60 mb-1.5 block">
                {q.label} {q.required && <span className="text-racing-red">*</span>}
              </label>
              {q.type === "dropdown" ? (
                <select
                  required={Boolean(q.required)}
                  value={val}
                  onChange={(e) =>
                    setQuestionAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
                >
                  <option value="">-- Select an option --</option>
                  {(q.options && q.options.length > 0 ? q.options : ["Yes", "No"]).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <textarea
                  required={Boolean(q.required)}
                  rows={4}
                  value={val}
                  onChange={(e) =>
                    setQuestionAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder={q.placeholder || "Describe your response in detail..."}
                  className="w-full bg-[#121318] border border-white/10 focus:border-racing-red px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
                />
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-[0.2em] px-8 py-3.5 transition-all shadow-[0_0_20px_rgba(210,39,48,0.4)] disabled:opacity-50"
          >
            {submitting ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>Submit Induction Application</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
