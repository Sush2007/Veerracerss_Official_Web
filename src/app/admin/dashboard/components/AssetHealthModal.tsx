"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Wrench,
  CheckCircle2,
  X,
  FileCheck,
  FolderSync,
  ExternalLink,
  Layers,
  Database,
  Image as ImageIcon
} from "lucide-react";
import { AssetAuditReport } from "@/src/lib/assetSync";

interface AssetHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  showError: (msg: string) => void;
}

export function AssetHealthModal({
  isOpen,
  onClose,
  showToast,
  showError,
}: AssetHealthModalProps) {
  const [report, setReport] = useState<AssetAuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [healing, setHealing] = useState(false);

  const fetchAudit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/assets?audit=true", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to run asset audit");
      }
      setReport(data.report);
    } catch (err: any) {
      showError(err.message || "Failed to audit assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAudit();
    }
  }, [isOpen]);

  const handleAutoHeal = async () => {
    try {
      setHealing(true);
      const res = await fetch("/api/admin/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "heal" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Auto-heal execution failed");
      }
      showToast(data.message || "All broken asset references repaired successfully!");
      // Re-run audit
      await fetchAudit();
    } catch (err: any) {
      showError(err.message || "Failed to auto-heal assets.");
    } finally {
      setHealing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0c10] border border-white/15 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FolderSync className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-tight font-display flex items-center gap-2">
                <span>File Sync & Asset Integrity Guard</span>
                <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5">
                  SYSTEM ACTIVE
                </span>
              </h3>
              <p className="text-xs text-white/50 font-mono">
                Continuous cross-validation between database records and static assets on disk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#121318] border border-white/10 p-3.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>Total Assets Tracked</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {report ? report.totalChecked : "..."}
              </div>
            </div>

            <div className="bg-[#121318] border border-white/10 p-3.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified Healthy</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {report ? report.healthy : "..."}
              </div>
            </div>

            <div className="bg-[#121318] border border-white/10 p-3.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Broken / Desynced</span>
              </div>
              <div
                className={`text-2xl font-bold font-mono ${
                  report && report.brokenCount > 0 ? "text-amber-400 animate-pulse" : "text-white/60"
                }`}
              >
                {report ? report.brokenCount : 0}
              </div>
            </div>
          </div>

          {/* Health Status Banner */}
          {loading ? (
            <div className="p-6 bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mb-2" />
              <p className="text-xs font-mono text-white/70">Auditing database records against filesystem...</p>
            </div>
          ) : report && report.brokenCount === 0 ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold font-mono uppercase text-emerald-300">
                  All Files & Assets Perfectly Synchronized
                </h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Every vehicle blueprint, CAD schematic, member avatar, faculty advisor photograph, and sponsor logo referenced in the database exists and loads successfully. Zero 404 links detected.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold font-mono uppercase text-amber-300">
                    File Sync Issues Detected ({report?.brokenCount})
                  </h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    The following assets are referenced in the database but could not be located on disk. You can auto-repair them immediately with the verified fallback files.
                  </p>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-2 mt-3 max-h-48 overflow-y-auto">
                {report?.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-black/40 border border-white/10 p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-[10px] text-white/50 uppercase">{issue.location} &bull; {issue.field}</div>
                      <div className="text-red-400 line-through truncate max-w-sm">{issue.currentValue}</div>
                      <div className="text-[11px] text-white/70 mt-0.5">{issue.reason}</div>
                    </div>
                    {issue.suggestedFix && (
                      <div className="sm:text-right shrink-0">
                        <div className="text-[10px] text-white/50 uppercase">Suggested Fix</div>
                        <div className="text-emerald-400 font-bold">{issue.suggestedFix}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleAutoHeal}
                  disabled={healing}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase px-4 py-2 shadow-lg transition-colors"
                >
                  {healing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wrench className="w-3.5 h-3.5" />}
                  <span>{healing ? "Auto-Healing Database..." : "Auto-Heal All Broken Links"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Explanatory Architecture Strip */}
          <div className="border border-white/10 bg-[#0e0f14] p-4 space-y-2">
            <h5 className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>How The File Sync Protection Guard Works</span>
            </h5>
            <ul className="text-xs text-white/60 space-y-1.5 font-mono list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-white/80">Real-Time Input Validation:</strong> Whenever a blueprint, image, or CAD path is edited in the admin console, the system validates the file against local storage before allowing it to be saved.
              </li>
              <li>
                <strong className="text-white/80">Smart Extension Healing:</strong> If an admin enters a path with <code className="text-cyan-300">.png</code> while only <code className="text-cyan-300">.jpg</code> exists (or vice versa), the system auto-resolves the matching file.
              </li>
              <li>
                <strong className="text-white/80">Resilient Universal Fallbacks:</strong> The client components use safe multi-stage fallbacks so that user browsers never display broken image icons or blank viewports.
              </li>
              <li>
                <strong className="text-white/80">Build-Time Guard:</strong> Static assets in defaults are checked during <code className="text-cyan-300">npm run build</code>, preventing accidental regressions before deployment.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="text-[11px] font-mono text-white/40">
            {report?.timestamp ? `Last audit: ${new Date(report.timestamp).toLocaleTimeString()}` : "Not audited"}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAudit}
              disabled={loading}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono uppercase px-3 py-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Re-Scan System</span>
            </button>
            <button
              onClick={onClose}
              className="bg-racing-red hover:bg-red-600 text-white text-xs font-mono uppercase px-4 py-1.5 font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
