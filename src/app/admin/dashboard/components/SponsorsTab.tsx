"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  X,
  AlertTriangle,
  Award,
  Globe,
  Sparkles
} from "lucide-react";
import { SponsorRecord } from "@/src/data/cms_defaults";

interface SponsorsTabProps {
  sponsors: SponsorRecord[];
  onSaveSponsors: (updatedSponsors: SponsorRecord[]) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  showToast: (msg: string) => void;
  showError: (msg: string) => void;
}

export function SponsorsTab({
  sponsors,
  onSaveSponsors,
  onUploadImage,
  showToast,
  showError,
}: SponsorsTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<SponsorRecord | null>(null);
  const [deleteConfirmSponsor, setDeleteConfirmSponsor] = useState<SponsorRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [logo, setLogo] = useState("");
  const [url, setUrl] = useState("");
  const [tier, setTier] = useState<"title" | "partner">("partner");

  // Lock background scroll when modals are open
  useEffect(() => {
    if (modalOpen || deleteConfirmSponsor) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [modalOpen, deleteConfirmSponsor]);

  const openAddModal = (defaultTier: "title" | "partner" = "partner") => {
    setEditingSponsor(null);
    setName("");
    setCategory("");
    setLogo("");
    setUrl("https://");
    setTier(defaultTier);
    setModalOpen(true);
  };

  const openEditModal = (sponsor: SponsorRecord) => {
    setEditingSponsor(sponsor);
    setName(sponsor.name || "");
    setCategory(sponsor.category || "");
    setLogo(sponsor.logo || "");
    setUrl(sponsor.url || "https://");
    setTier(sponsor.tier || "partner");
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const uploadedUrl = await onUploadImage(file);
      setLogo(uploadedUrl);
      showToast("Sponsor logo uploaded successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to upload logo PNG.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Please enter the sponsor company name.");
      return;
    }
    if (!logo.trim()) {
      showError("Please provide a sponsor logo PNG or upload a logo file.");
      return;
    }

    try {
      setSaving(true);
      const sponsorData: SponsorRecord = {
        id: editingSponsor ? editingSponsor.id : `sp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        category: category.trim(),
        logo: logo.trim(),
        url: url.trim() || "#",
        tier,
        order_index: editingSponsor?.order_index ?? (sponsors.length + 1),
      };

      let updatedList: SponsorRecord[];
      if (editingSponsor) {
        updatedList = sponsors.map((s) => (s.id === editingSponsor.id ? sponsorData : s));
      } else {
        updatedList = [...sponsors, sponsorData];
      }

      await onSaveSponsors(updatedList);
      setModalOpen(false);
      showToast(editingSponsor ? `Sponsor "${name}" updated!` : `Sponsor "${name}" added successfully!`);
    } catch (err: any) {
      showError(err.message || "Failed to save sponsor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmSponsor) return;
    try {
      const updated = sponsors.filter((s) => s.id !== deleteConfirmSponsor.id);
      await onSaveSponsors(updated);
      setDeleteConfirmSponsor(null);
      showToast(`Sponsor "${deleteConfirmSponsor.name}" removed.`);
    } catch (err: any) {
      showError(err.message || "Failed to remove sponsor.");
    }
  };

  const titleSponsors = sponsors.filter((s) => s.tier === "title");
  const partnerSponsors = sponsors.filter((s) => s.tier !== "title");

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#0b0c10] border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-racing-red" />
              <h2 className="text-xl font-bold font-display uppercase tracking-wide text-white">
                Sponsors & Corporate Partners
              </h2>
            </div>
            <p className="text-white/60 text-xs mt-1">
              Manage title sponsors, precision fabrication partners, and CAD simulation providers displayed on the public website.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => openAddModal("partner")}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Partner</span>
            </button>
            <button
              onClick={() => openAddModal("title")}
              className="flex items-center gap-1.5 bg-racing-red hover:bg-racing-red/80 text-white px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-lg shadow-racing-red/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add Title Sponsor</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: TITLE SPONSORS */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-6 bg-racing-red"></span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
            TITLE SPONSORS ({titleSponsors.length})
          </h3>
          <span className="h-[1px] flex-grow bg-white/10"></span>
        </div>

        {titleSponsors.length === 0 ? (
          <div className="bg-[#0b0c10] border border-white/5 p-8 text-center text-white/40 text-xs font-mono">
            No title sponsors configured yet. Click "Add Title Sponsor" to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {titleSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-[#111111]/90 border border-racing-red/40 hover:border-racing-red p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-2 right-3 text-[9px] font-mono font-bold tracking-widest text-racing-red uppercase">
                  TITLE PARTNER
                </div>

                {/* Logo Canvas */}
                <div className="h-24 w-full flex items-center justify-center p-4 bg-black/40 border border-white/5 mb-4">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-full max-w-[85%] object-contain filter brightness-100 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-mono font-bold tracking-wider uppercase text-white group-hover:text-racing-red transition-colors">
                    {sponsor.name}
                  </h4>
                  <p className="text-xs text-white/50 font-mono mt-0.5">
                    {sponsor.category}
                  </p>
                </div>

                {/* Actions & Website Link */}
                <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-white/10">
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] font-mono text-white/60 hover:text-white transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-racing-red" />
                    <span className="truncate max-w-[150px]">{sponsor.url.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditModal(sponsor)}
                      className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      title="Edit Sponsor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmSponsor(sponsor)}
                      className="p-1.5 text-red-400/80 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                      title="Remove Sponsor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: TECHNICAL & CORPORATE PARTNERS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-6 bg-racing-red"></span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
            TECHNICAL & CORPORATE PARTNERS ({partnerSponsors.length})
          </h3>
          <span className="h-[1px] flex-grow bg-white/10"></span>
        </div>

        {partnerSponsors.length === 0 ? (
          <div className="bg-[#0b0c10] border border-white/5 p-8 text-center text-white/40 text-xs font-mono">
            No technical partners configured yet. Click "Add Partner" to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {partnerSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-[#111111]/80 border border-white/10 hover:border-racing-red/50 p-5 flex flex-col justify-between group transition-all duration-300 relative"
              >
                {/* Logo Canvas */}
                <div className="h-20 w-full flex items-center justify-center p-3 bg-black/40 border border-white/5 mb-3">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-full max-w-[85%] object-contain filter brightness-95 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-white group-hover:text-racing-red transition-colors">
                    {sponsor.name}
                  </h4>
                  <p className="text-[11px] text-white/50 font-mono mt-0.5 line-clamp-1">
                    {sponsor.category}
                  </p>
                </div>

                {/* Actions & Link */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/10">
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 hover:text-white transition-colors"
                  >
                    <Globe className="w-3 h-3 text-racing-red/80" />
                    <span className="truncate max-w-[120px]">{sponsor.url.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(sponsor)}
                      className="p-1 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      title="Edit Sponsor"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmSponsor(sponsor)}
                      className="p-1 text-red-400/80 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                      title="Remove Sponsor"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          ADD / EDIT SPONSOR MODAL
      ========================================================================= */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
          onClick={() => setModalOpen(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-white/20 w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden rounded-none"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed) */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0 bg-[#0b0c10] z-20">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-racing-red" />
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  {editingSponsor ? `Edit Sponsor: ${editingSponsor.name}` : "Add New Sponsor / Partner"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/50 hover:text-white p-1 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4"
              onWheel={(e) => e.stopPropagation()}
            >
              <form id="sponsor-editor-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    Sponsor / Organization Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. SolidWorks / Ansys / KTM"
                    required
                    className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    Partnership Category / Role *
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. 3D CAD & Digital Twin / Title Sponsor & Powertrain"
                    required
                    className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    Sponsorship Tier *
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as "title" | "partner")}
                    className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:border-racing-red focus:outline-none"
                  >
                    <option value="partner">Technical & Corporate Partner (Grid Display)</option>
                    <option value="title">Title Sponsor (Prominent Top Banner Card)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    Logo PNG / SVG File or Path *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="/sponsors/company.svg or https://..."
                      required
                      className="flex-1 bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                    />
                    <label className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/webp"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploadingLogo}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 font-mono">
                    Transparent PNG or SVG recommended for best presentation on dark backgrounds.
                  </p>
                </div>

                {/* Logo Preview */}
                {logo && (
                  <div className="bg-black/50 border border-white/10 p-3 flex items-center justify-center h-20">
                    <img src={logo} alt="Preview" className="max-h-full max-w-[80%] object-contain" />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1">
                    Website / Social URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.example.com"
                    className="w-full bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white font-mono focus:border-racing-red focus:outline-none"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer (Fixed) */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 shrink-0 bg-[#0b0c10] z-20">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="sponsor-editor-form"
                disabled={saving || uploadingLogo}
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-bold bg-racing-red hover:bg-racing-red/80 text-white transition-colors disabled:opacity-50 shadow-lg shadow-racing-red/20"
              >
                {saving ? "Saving..." : editingSponsor ? "Save Changes" : "Add Sponsor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
      ========================================================================= */}
      {deleteConfirmSponsor && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmSponsor(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-red-500/40 p-6 max-w-sm w-full relative shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                Remove Sponsor
              </h3>
            </div>

            <p className="text-xs text-white/70 font-mono">
              Are you sure you want to remove <span className="text-white font-bold">{deleteConfirmSponsor.name}</span> from the website partners section?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteConfirmSponsor(null)}
                className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-1.5 text-xs font-mono uppercase tracking-wider font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg shadow-red-600/30"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
