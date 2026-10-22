"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  Calendar,
  MapPin,
  Car,
  Star,
  Award,
  Medal,
  CheckCircle,
} from "lucide-react";
import { CompetitionAchievement, AwardItem } from "@/src/data/cms_defaults";

interface AchievementsTabProps {
  achievements: CompetitionAchievement[];
  onSaveAchievements: (achievements: CompetitionAchievement[]) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  showToast?: (msg: string) => void;
  showError?: (msg: string) => void;
}

export function AchievementsTab({
  achievements,
  onSaveAchievements,
  onUploadImage,
  showToast,
  showError,
}: AchievementsTabProps) {
  const [list, setList] = useState<CompetitionAchievement[]>(achievements);
  const [editingItem, setEditingItem] = useState<CompetitionAchievement | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Award draft within modal
  const [awardDraftTitle, setAwardDraftTitle] = useState("");
  const [awardDraftRank, setAwardDraftRank] = useState("");
  const [awardDraftCategory, setAwardDraftCategory] = useState("");
  const [awardDraftType, setAwardDraftType] = useState<AwardItem["type"]>("top10");

  // Master Dialog Scroll-Lock Effect
  useEffect(() => {
    if (editingItem) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [editingItem]);

  const handleStartCreate = () => {
    setIsNew(true);
    setEditingItem({
      id: `ach-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      competition: "",
      tagline: "",
      location: "",
      carName: "",
      image: "",
      isChampion: false,
      featured: false,
      awards: [],
      summary: "",
    });
    setAwardDraftTitle("");
    setAwardDraftRank("");
    setAwardDraftCategory("");
    setAwardDraftType("top10");
  };

  const handleStartEdit = (item: CompetitionAchievement) => {
    setIsNew(false);
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setAwardDraftTitle("");
    setAwardDraftRank("");
    setAwardDraftCategory("");
    setAwardDraftType("top10");
  };

  const handleAddAward = () => {
    if (!awardDraftTitle.trim()) return;
    if (!editingItem) return;
    const newAward: AwardItem = {
      title: awardDraftTitle.trim(),
      rank: awardDraftRank.trim() || undefined,
      category: awardDraftCategory.trim() || undefined,
      type: awardDraftType,
    };
    setEditingItem({
      ...editingItem,
      awards: [...(editingItem.awards || []), newAward],
    });
    setAwardDraftTitle("");
    setAwardDraftRank("");
    setAwardDraftCategory("");
    setAwardDraftType("top10");
  };

  const handleRemoveAward = (idx: number) => {
    if (!editingItem) return;
    const updated = [...editingItem.awards];
    updated.splice(idx, 1);
    setEditingItem({
      ...editingItem,
      awards: updated,
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.competition.trim() || !editingItem.year.trim()) {
      if (showError) showError("Competition name and year are required.");
      return;
    }

    setSaving(true);
    try {
      let updated: CompetitionAchievement[];
      if (isNew) {
        updated = [editingItem, ...list];
      } else {
        updated = list.map((item) => (item.id === editingItem.id ? editingItem : item));
      }
      setList(updated);
      await onSaveAchievements(updated);
      setEditingItem(null);
      if (showToast) {
        showToast(isNew ? "Achievement entry added!" : "Achievement updated successfully!");
      }
    } catch (err: any) {
      if (showError) showError(err.message || "Failed to save achievement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the Hall of Fame?`)) return;
    const updated = list.filter((i) => i.id !== id);
    setList(updated);
    try {
      await onSaveAchievements(updated);
      if (showToast) showToast(`Deleted "${name}"`);
    } catch (err: any) {
      if (showError) showError(err.message || "Failed to delete.");
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setUploading(true);
    try {
      const url = await onUploadImage(file);
      setEditingItem({ ...editingItem, image: url });
      if (showToast) showToast("Photo uploaded successfully!");
    } catch (err: any) {
      if (showError) showError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const getAwardBadgeStyle = (type: AwardItem["type"]) => {
    switch (type) {
      case "champion":
        return "bg-amber-500/20 text-yellow-300 border-amber-500/40";
      case "runner_up":
        return "bg-slate-300/15 text-slate-200 border-slate-300/30";
      case "podium":
        return "bg-amber-900/30 text-amber-200 border-amber-600/40";
      case "special":
        return "bg-racing-red/20 text-red-300 border-racing-red/40";
      default:
        return "bg-white/5 text-white/80 border-white/10";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0b0c10] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1 text-[10px] font-mono uppercase text-racing-red font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>HALL OF FAME & RACING PODIUMS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            Competitive Achievements ({list.length})
          </h2>
          <p className="text-xs font-mono text-white/50">
            Manage awards, national podiums, and static/dynamic event finishes across seasons.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Achievement</span>
        </button>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-[#0e0f14] border border-white/10 p-5 flex flex-col justify-between relative group hover:border-white/20 transition-all"
          >
            <div>
              {/* Top Meta Bar */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/10 text-white font-mono text-[11px] font-bold px-2.5 py-0.5 border border-white/15">
                    {item.year}
                  </span>
                  {item.isChampion && (
                    <span className="bg-amber-500/20 text-yellow-300 font-mono text-[10px] font-bold px-2 py-0.5 border border-amber-500/40 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-yellow-400" />
                      <span>CHAMPION</span>
                    </span>
                  )}
                  {item.featured && (
                    <span className="bg-racing-red/20 text-white font-mono text-[10px] font-bold px-2 py-0.5 border border-racing-red/40 flex items-center gap-1">
                      <Star className="w-3 h-3 text-racing-red" />
                      <span>FEATURED</span>
                    </span>
                  )}
                  {item.carName && (
                    <span className="bg-white/5 text-white/70 font-mono text-[10px] px-2 py-0.5 border border-white/10 flex items-center gap-1">
                      <Car className="w-3 h-3 text-white/40" />
                      <span>{item.carName}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                    title="Edit Achievement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.competition)}
                    className="p-1.5 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                    title="Delete Achievement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-display font-black text-lg text-white uppercase tracking-wide mt-1">
                {item.competition}
              </h3>
              <p className="text-xs font-mono text-racing-red font-semibold mb-2">
                {item.tagline}
              </p>

              {item.location && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/40 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
              )}

              {/* Awards List Badges */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider block font-bold">
                  Awards ({item.awards?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(item.awards || []).map((aw, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] font-mono px-2 py-0.5 border flex items-center gap-1 ${getAwardBadgeStyle(
                        aw.type
                      )}`}
                    >
                      <Medal className="w-2.5 h-2.5 opacity-70" />
                      <strong className="font-bold">{aw.title}</strong>
                      {aw.category && <span className="text-white/40">({aw.category})</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary Text */}
              {item.summary && (
                <p className="text-xs font-sans text-white/60 font-light leading-relaxed bg-black/40 p-2.5 border border-white/5 line-clamp-3">
                  {item.summary}
                </p>
              )}
            </div>

            {/* Optional Photo Thumbnail */}
            {item.image && (
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.competition}
                  className="w-16 h-10 object-cover border border-white/10 shrink-0"
                />
                <span className="text-[10px] font-mono text-white/40 truncate">
                  {item.image}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* EDIT / CREATE MODAL */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
          onClick={() => setEditingItem(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-white/20 w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed, Always Visible) */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0 bg-[#0b0c10] z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-racing-red/10 border border-racing-red/30 flex items-center justify-center text-racing-red">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase text-white">
                    {isNew ? "Add Competition Achievement" : "Edit Achievement"}
                  </h3>
                  <p className="text-[10px] font-mono text-white/50">
                    Formula Student Hall of Fame Registry
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-white/50 hover:text-white p-1 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dedicated Scrollable Form Body */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4"
              onWheel={(e) => e.stopPropagation()}
            >
              <form id="achievement-editor-form" onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                    Competition Name <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.competition}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, competition: e.target.value })
                    }
                    placeholder="e.g. FORMULA IMPERIAL 2025"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                    Season Year <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.year}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, year: e.target.value })
                    }
                    placeholder="e.g. 2025"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                  Tagline / Headline Highlight
                </label>
                <input
                  type="text"
                  value={editingItem.tagline}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, tagline: e.target.value })
                  }
                  placeholder="e.g. National Champions in Lightweight Chassis & EV Runner-Up"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                    Track / Location
                  </label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, location: e.target.value })
                    }
                    placeholder="e.g. Buddh International Circuit, Greater Noida"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                    Car Campaign Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.carName || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, carName: e.target.value })
                    }
                    placeholder="e.g. AETHER or ZEUS 1.0"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.isChampion)}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isChampion: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-xs font-mono text-white/80">Overall Champion / Winner</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.featured)}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-racing-red"
                  />
                  <span className="text-xs font-mono text-white/80">Featured Showcase</span>
                </label>
              </div>

              {/* Summary */}
              <div>
                <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                  Achievement Summary / Editorial
                </label>
                <textarea
                  rows={3}
                  value={editingItem.summary}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, summary: e.target.value })
                  }
                  placeholder="Describe the vehicle's dynamic achievements, static presentations, and national significance..."
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                  Ceremony / Trackside Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingItem.image || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, image: e.target.value })
                    }
                    placeholder="/achievements/formula-imperial-2025.jpg or CDN URL"
                    className="flex-1 bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                  <label className="bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold px-3 py-2 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* AWARDS SUITE BUILDER */}
              <div className="bg-black/50 border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
                    <Medal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Awards & Medals ({editingItem.awards?.length || 0})</span>
                  </span>
                </div>

                {/* Existing Awards List */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {(editingItem.awards || []).map((aw, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-[#121318] border border-white/10 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 border font-bold ${getAwardBadgeStyle(
                            aw.type
                          )}`}
                        >
                          {aw.type}
                        </span>
                        <span className="text-white font-bold truncate">{aw.title}</span>
                        {aw.rank && <span className="text-amber-400">[{aw.rank}]</span>}
                        {aw.category && <span className="text-white/40">({aw.category})</span>}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAward(idx)}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(editingItem.awards || []).length === 0 && (
                    <p className="text-[11px] font-mono text-white/40 italic">
                      No awards logged yet. Add medals/podiums below.
                    </p>
                  )}
                </div>

                {/* Add Award Subform */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={awardDraftTitle}
                      onChange={(e) => setAwardDraftTitle(e.target.value)}
                      placeholder="Award title (e.g. AIR-1 IN LIGHTEST WEIGHT)"
                      className="w-full bg-[#16171d] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={awardDraftCategory}
                      onChange={(e) => setAwardDraftCategory(e.target.value)}
                      placeholder="Category (e.g. Design)"
                      className="w-full bg-[#16171d] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    <select
                      value={awardDraftType}
                      onChange={(e) => setAwardDraftType(e.target.value as any)}
                      className="flex-1 bg-[#16171d] border border-white/10 px-2 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    >
                      <option value="champion">Champion (Gold)</option>
                      <option value="runner_up">Runner-Up (Silver)</option>
                      <option value="podium">Podium (Bronze)</option>
                      <option value="top10">Top 10</option>
                      <option value="special">Special Award</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleAddAward}
                      className="bg-white/10 hover:bg-racing-red text-white px-2.5 py-1.5 text-xs font-mono font-bold transition-colors shrink-0"
                      title="Add Award"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              </form>
            </div>

            {/* Modal Footer (Fixed, Always Visible) */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#0b0c10] shrink-0 z-20">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                form="achievement-editor-form"
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Achievement"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
