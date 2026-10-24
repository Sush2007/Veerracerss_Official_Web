"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Save,
  Eye,
  EyeOff,
  ArrowUpDown,
  CheckCircle,
  HelpCircle,
  Shield,
  Trophy,
  Users,
  Award,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { TeamPageSettings } from "@/src/data/cms_defaults";

interface TeamArrangementsTabProps {
  settings: TeamPageSettings;
  onSaveSettings: (updated: TeamPageSettings) => Promise<void>;
  showToast?: (msg: string) => void;
  showError?: (msg: string) => void;
  memberCounts?: {
    faculty: number;
    finalYears: number;
    preFinal: number;
    secondYears: number;
  };
}

export function TeamArrangementsTab({
  settings,
  onSaveSettings,
  showToast,
  showError,
  memberCounts = { faculty: 2, finalYears: 11, preFinal: 10, secondYears: 20 },
}: TeamArrangementsTabProps) {
  const [formData, setFormData] = useState<TeamPageSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleToggle = (key: keyof TeamPageSettings) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveSettings(formData);
      showToast?.("Team page arrangement settings updated successfully.");
    } catch (err: any) {
      showError?.(err.message || "Failed to update team settings.");
    } finally {
      setSaving(false);
    }
  };

  const sectionDefinitions = [
    {
      id: "faculty",
      name: "Faculty Advisors",
      subtitle: "Academic patron council & institutional guidance",
      count: memberCounts.faculty,
      visible: formData.show_faculty,
      toggleKey: "show_faculty" as const,
      icon: Shield,
    },
    {
      id: "final_years",
      name: "Final Years (4th Year)",
      subtitle: "Captaincy, technical council & domain heads",
      count: memberCounts.finalYears,
      visible: formData.show_final_years,
      toggleKey: "show_final_years" as const,
      icon: Trophy,
    },
    {
      id: "pre_final_years",
      name: "Pre-Final Years (3rd Year)",
      subtitle: "Management, subsystem engineers & domain specialists",
      count: memberCounts.preFinal,
      visible: formData.show_pre_final_years,
      toggleKey: "show_pre_final_years" as const,
      icon: Users,
    },
    {
      id: "second_years",
      name: "Second Years (2nd Year)",
      subtitle: "Junior engineers, designers & fabricators",
      count: memberCounts.secondYears,
      visible: formData.show_second_years,
      toggleKey: "show_second_years" as const,
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b0c10] border border-white/10 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1 text-[10px] font-mono uppercase text-racing-red font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>LAYOUT ARRANGEMENT & PUBLIC ROSTER VISIBILITY CONTROLS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            Team Page Arrangements & Display Rules
          </h2>
          <p className="text-xs font-mono text-white/50">
            Control which sections appear on /members, set sorting strategies, and adjust public layout.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(210,39,48,0.4)] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Arrangement Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Section Visibility Toggles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0b0c10] border border-white/10 p-5">
            <h3 className="text-sm font-bold uppercase font-display text-white mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-racing-red" />
              <span>Section Visibility & Publishing Controls</span>
            </h3>
            <p className="text-xs font-mono text-white/50 mb-5">
              Toggle visibility for individual year cohorts or advisor sections on the live public team page.
            </p>

            <div className="space-y-3">
              {sectionDefinitions.map((sec) => {
                const IconComponent = sec.icon;
                return (
                  <div
                    key={sec.id}
                    className={`p-4 border transition-colors flex items-center justify-between ${
                      sec.visible
                        ? "bg-white/[0.02] border-white/15"
                        : "bg-black/40 border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-none border ${
                          sec.visible
                            ? "bg-racing-red/10 border-racing-red/40 text-racing-red"
                            : "bg-white/5 border-white/10 text-white/30"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold uppercase font-display text-white">
                            {sec.name}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/5 text-white/60">
                            {sec.count} {sec.count === 1 ? "Profile" : "Profiles"}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-white/50">{sec.subtitle}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(sec.toggleKey)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition-all ${
                        sec.visible
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
                          : "bg-white/5 text-white/40 border border-white/10 hover:text-white hover:bg-white/15"
                      }`}
                    >
                      {sec.visible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Member Sorting Mode & Help */}
        <div className="space-y-4">
          <div className="bg-[#0b0c10] border border-white/10 p-5">
            <h3 className="text-sm font-bold uppercase font-display text-white mb-2 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-racing-red" />
              <span>Roster Sorting Strategy</span>
            </h3>
            <p className="text-xs font-mono text-white/50 mb-4">
              Determine how profiles within each year cohort are ordered.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  value: "custom_order",
                  label: "Custom Priority Order",
                  desc: "Order strictly by each member's display priority (order_index). Use Datasheet or Move Up/Down buttons.",
                },
                {
                  value: "domain",
                  label: "Subgroup & Domain Default",
                  desc: "Formula Student hierarchy: Captains & Council first, then domain leads and engineers.",
                },
                {
                  value: "name_asc",
                  label: "Alphabetical Order (A - Z)",
                  desc: "Sort member cards alphabetically by name.",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`block p-3 border cursor-pointer transition-colors ${
                    formData.sort_members_by === opt.value
                      ? "bg-racing-red/10 border-racing-red/40"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="sort_mode"
                      value={opt.value}
                      checked={formData.sort_members_by === opt.value}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          sort_members_by: opt.value as any,
                        }))
                      }
                      className="mt-1 accent-racing-red"
                    />
                    <div>
                      <div className="text-xs font-bold uppercase font-display text-white">
                        {opt.label}
                      </div>
                      <div className="text-[10px] font-mono text-white/50 mt-0.5 leading-relaxed">
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-white/10 p-5">
            <h4 className="text-xs font-mono uppercase text-racing-red font-bold mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Arrangement Guide</span>
            </h4>
            <ul className="text-[11px] font-mono text-white/60 space-y-2 list-disc list-inside">
              <li>
                <strong>Pre-Final & Final Years:</strong> Both cohorts are divided department-wise into technical domain subsections (Chassis & Design, Powertrain & Drivetrain, Suspension & Steering, Brakes & Tyres).
              </li>
              <li>
                <strong>Priority Order:</strong> When editing any member datasheet, specify a lower order index (e.g. 0, 1, 2) to place them first within their domain.
              </li>
              <li>
                <strong>Instant Sync:</strong> Changes save to the cloud and synchronize automatically with all active browser tabs.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
