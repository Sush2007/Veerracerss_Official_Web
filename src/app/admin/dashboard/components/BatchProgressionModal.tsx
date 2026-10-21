"use client";

import { useState, useEffect } from "react";
import { X, GraduationCap, ArrowRight, AlertTriangle, Check, RefreshCw } from "lucide-react";
import { MemberRecord } from "@/src/data/cms_defaults";

interface BatchProgressionModalProps {
  members: MemberRecord[];
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function BatchProgressionModal({
  members,
  onClose,
  onConfirm,
}: BatchProgressionModalProps) {
  const [executing, setExecuting] = useState(false);
  const [hasUnderstood, setHasUnderstood] = useState(false);
  const currentGradYear = new Date().getFullYear();

  // Lock background body scroll completely while modal is open
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  // Filter members by year (resilient to both year_of_study and legacy year strings)
  const fourthYears = members.filter(
    (m) =>
      (m.year_of_study || "").includes("4th") ||
      (m.year || "").includes("4th") ||
      ((m.year || "").includes("Final") && !(m.year || "").includes("Pre-Final"))
  );
  const thirdYears = members.filter(
    (m) =>
      !fourthYears.some((f) => f.id === m.id) &&
      ((m.year_of_study || "").includes("3rd") ||
        (m.year || "").includes("3rd") ||
        (m.year || "").includes("Pre-Final"))
  );
  const secondYears = members.filter(
    (m) =>
      !fourthYears.some((f) => f.id === m.id) &&
      !thirdYears.some((t) => t.id === m.id) &&
      ((m.year_of_study || "").includes("2nd") || (m.year || "").includes("2nd"))
  );
  const firstYears = members.filter(
    (m) =>
      !fourthYears.some((f) => f.id === m.id) &&
      !thirdYears.some((t) => t.id === m.id) &&
      !secondYears.some((s) => s.id === m.id) &&
      ((m.year_of_study || "").includes("1st") || (m.year || "").includes("1st"))
  );
  const otherMembers = members.filter(
    (m) =>
      !fourthYears.some((f) => f.id === m.id) &&
      !thirdYears.some((t) => t.id === m.id) &&
      !secondYears.some((s) => s.id === m.id) &&
      !firstYears.some((fi) => fi.id === m.id)
  );

  const handleExecute = async () => {
    setExecuting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="bg-[#0b0c10] border border-racing-red/40 w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-racing-red/10 border border-racing-red/40 flex items-center justify-center text-racing-red">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-racing-red font-bold">
                ANNUAL ACADEMIC BATCH PROGRESSION
              </span>
              <h3 className="text-xl font-display font-black uppercase text-white">
                Roster Roll-Forward Engine
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-5">
          {/* Audit Summary Warning */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider mb-1">Audit Preview Before Execution:</p>
              <p className="text-white/70 leading-relaxed font-sans text-xs">
                This automation performs an irreversible annual roster roll-forward for season {currentGradYear}.
                Please inspect the preview breakdown below before proceeding.
              </p>
            </div>
          </div>

          {/* Progression Steps Breakdown */}
          <div className="space-y-4 text-xs font-mono">
            {/* 1. 4th Years -> Alumni */}
            <div className="bg-black/50 border border-white/10 p-4">
              <div className="flex items-center justify-between font-bold text-white mb-2">
                <span className="flex items-center gap-2 text-racing-red uppercase">
                  <span>Graduation Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="text-white">Alumni Archives</span>
                </span>
                <span className="bg-racing-red/20 text-racing-red px-2 py-0.5 text-[11px]">
                  {fourthYears.length} Members
                </span>
              </div>
              <p className="text-white/60 mb-2 leading-relaxed">
                All 4th year members will be safely migrated into the Alumni Hall of Fame (Batch {currentGradYear}) and removed from the active racing squad.
              </p>
              {fourthYears.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {fourthYears.map((m) => (
                    <span key={m.id} className="bg-white/10 text-white/90 px-2 py-0.5 text-[11px]">
                      {m.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-white/30 italic text-[11px]">No 4th year members found.</span>
              )}
            </div>

            {/* 2. 3rd Years -> 4th Years */}
            <div className="bg-black/50 border border-white/10 p-4">
              <div className="flex items-center justify-between font-bold text-white mb-2">
                <span className="flex items-center gap-2 text-white/80 uppercase">
                  <span>3rd Year (Pre-Final)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-racing-red" />
                  <span className="text-white font-bold">4th Year (Final Year)</span>
                </span>
                <span className="bg-white/10 text-white/80 px-2 py-0.5 text-[11px]">
                  {thirdYears.length} Members
                </span>
              </div>
              <p className="text-white/60 mb-2 leading-relaxed">
                Will be promoted to 4th Year Senior Council for season {currentGradYear + 1}.
              </p>
              {thirdYears.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {thirdYears.map((m) => (
                    <span key={m.id} className="bg-white/10 text-white/90 px-2 py-0.5 text-[11px]">
                      {m.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-white/30 italic text-[11px]">No 3rd year members found.</span>
              )}
            </div>

            {/* 3. 2nd Years -> 3rd Years */}
            <div className="bg-black/50 border border-white/10 p-4">
              <div className="flex items-center justify-between font-bold text-white mb-2">
                <span className="flex items-center gap-2 text-white/80 uppercase">
                  <span>2nd Year (Sophomore)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-racing-red" />
                  <span className="text-white font-bold">3rd Year (Pre-Final)</span>
                </span>
                <span className="bg-white/10 text-white/80 px-2 py-0.5 text-[11px]">
                  {secondYears.length} Members
                </span>
              </div>
              <p className="text-white/60 mb-2 leading-relaxed">
                Will step into department subsystem leads and pre-final council roles.
              </p>
              {secondYears.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {secondYears.map((m) => (
                    <span key={m.id} className="bg-white/10 text-white/90 px-2 py-0.5 text-[11px]">
                      {m.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-white/30 italic text-[11px]">No 2nd year members found.</span>
              )}
            </div>

            {/* 4. 1st Years -> 2nd Years */}
            <div className="bg-black/50 border border-white/10 p-4">
              <div className="flex items-center justify-between font-bold text-white mb-2">
                <span className="flex items-center gap-2 text-white/80 uppercase">
                  <span>1st Year (Freshers)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-racing-red" />
                  <span className="text-white font-bold">2nd Year (Subsystem Eng.)</span>
                </span>
                <span className="bg-white/10 text-white/80 px-2 py-0.5 text-[11px]">
                  {firstYears.length} Members
                </span>
              </div>
              <p className="text-white/60 mb-2 leading-relaxed">
                Will be promoted to junior engineers ready for fabrication.
              </p>
              {firstYears.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {firstYears.map((m) => (
                    <span key={m.id} className="bg-white/10 text-white/90 px-2 py-0.5 text-[11px]">
                      {m.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-white/30 italic text-[11px]">No 1st year members found.</span>
              )}
            </div>

            {/* Other / Unclassified Members Note */}
            {otherMembers.length > 0 && (
              <div className="bg-white/5 border border-white/10 p-3 text-white/50 text-[11px]">
                ℹ️ {otherMembers.length} members with custom designations (e.g. Faculty Advisors / Captain) will remain preserved without alteration.
              </div>
            )}
          </div>

          {/* Confirmation Checkbox */}
          <div className="p-4 bg-white/5 border border-white/10 flex items-start gap-3">
            <input
              type="checkbox"
              id="confirmProgression"
              checked={hasUnderstood}
              onChange={(e) => setHasUnderstood(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-racing-red cursor-pointer"
            />
            <label htmlFor="confirmProgression" className="text-xs text-white/80 font-mono cursor-pointer leading-relaxed">
              I have verified the above batch progression preview. I understand this will graduate {fourthYears.length} members to Alumni and promote lower batches.
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
          <button
            type="button"
            onClick={onClose}
            disabled={executing}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={executing || !hasUnderstood}
            className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {executing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Progressing Batches...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Execute Batch Progression</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
