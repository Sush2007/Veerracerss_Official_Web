"use client";

import { useState } from "react";
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
  const currentGradYear = new Date().getFullYear();

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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b0c10] border border-racing-red/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
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

        {/* Audit Summary Warning */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono mb-6 flex items-start gap-3">
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
        <div className="space-y-4 mb-6 text-xs font-mono">
          {/* 1. 4th Years -> Alumni */}
          <div className="bg-black/50 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-racing-red font-bold uppercase flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>4th Years → Graduating into Alumni Directory ({fourthYears.length})</span>
              </span>
              <span className="text-[10px] bg-racing-red/20 text-racing-red px-2 py-0.5 font-bold">
                Batch {currentGradYear}
              </span>
            </div>
            {fourthYears.length === 0 ? (
              <p className="text-white/40 text-[11px] italic">No active members currently marked as 4th Year.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {fourthYears.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 bg-[#121318] p-2 border border-white/5">
                    <img src={m.image_url} alt={m.name} className="w-7 h-7 rounded object-cover" />
                    <div className="truncate">
                      <p className="font-bold text-white truncate">{m.name}</p>
                      <p className="text-[10px] text-white/50">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Lower Years Increment */}
          <div className="bg-black/50 border border-white/10 p-4 space-y-3">
            <div className="text-white/80 font-bold uppercase">Active Students Academic Progression:</div>

            <div className="flex items-center justify-between text-[11px] bg-[#121318] p-2.5 border border-white/5">
              <span>3rd Year Juniors ({thirdYears.length} members)</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>4th Year Seniors</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] bg-[#121318] p-2.5 border border-white/5">
              <span>2nd Year Sophomores ({secondYears.length} members)</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>3rd Year Juniors</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] bg-[#121318] p-2.5 border border-white/5">
              <span>1st Year Freshers ({firstYears.length} members)</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>2nd Year Sophomores</span>
              </div>
            </div>

            {otherMembers.length > 0 && (
              <p className="text-white/40 text-[10px] pt-1">
                * {otherMembers.length} members with unassigned academic year will remain untouched.
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
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
            disabled={executing}
            className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
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
