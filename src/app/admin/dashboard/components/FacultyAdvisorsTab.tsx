"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  GraduationCap
} from "lucide-react";
import { FacultyAdvisor } from "@/src/data/cms_defaults";

interface FacultyAdvisorsTabProps {
  facultyList: FacultyAdvisor[];
  onSaveFaculty: (advisors: FacultyAdvisor[]) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  showToast?: (msg: string) => void;
  showError?: (msg: string) => void;
}

export function FacultyAdvisorsTab({
  facultyList,
  onSaveFaculty,
  onUploadImage,
  showToast,
  showError,
}: FacultyAdvisorsTabProps) {
  const [list, setList] = useState<FacultyAdvisor[]>(facultyList);
  const [editingItem, setEditingItem] = useState<FacultyAdvisor | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<FacultyAdvisor | null>(null);
  const [photoSource, setPhotoSource] = useState<"upload" | "url">("upload");
  const [directPhotoUrl, setDirectPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setList(facultyList);
  }, [facultyList]);

  // Master Dialog Scroll-Lock Effect
  useEffect(() => {
    if (editingItem || deleteConfirm) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [editingItem, deleteConfirm]);

  const handleStartCreate = () => {
    setIsNew(true);
    setPhotoSource("upload");
    setPhotoFile(null);
    setDirectPhotoUrl("");
    setEditingItem({
      id: `fac-${Date.now()}`,
      name: "",
      role: "Faculty Advisor",
      department: "Mechanical Engineering",
      tenure: "Present",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      profileUrl: "https://www.vssut.ac.in",
      order_index: list.length,
    });
  };

  const handleStartEdit = (advisor: FacultyAdvisor) => {
    setIsNew(false);
    setPhotoSource(advisor.image?.startsWith("http") ? "url" : "upload");
    setPhotoFile(null);
    setDirectPhotoUrl(advisor.image || "");
    setEditingItem(JSON.parse(JSON.stringify(advisor)));
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const updated = [...list];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const reindexed = updated.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    setList(reindexed);
    try {
      await onSaveFaculty(reindexed);
      showToast?.(`Reordered "${moved.name}" successfully.`);
    } catch (e: any) {
      showError?.(e.message || "Failed to update order.");
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.name.trim()) {
      showError?.("Please enter the Faculty Advisor's full name.");
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = editingItem.image;

      if (photoSource === "upload" && photoFile) {
        setUploading(true);
        finalImageUrl = await onUploadImage(photoFile);
        setUploading(false);
      } else if (photoSource === "url" && directPhotoUrl.trim()) {
        finalImageUrl = directPhotoUrl.trim();
      }

      const preparedItem: FacultyAdvisor = {
        ...editingItem,
        image: finalImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      };

      let updatedList: FacultyAdvisor[];
      if (isNew) {
        updatedList = [...list, preparedItem];
      } else {
        updatedList = list.map((item) =>
          (item.id && item.id === preparedItem.id) || item.name === preparedItem.name ? preparedItem : item
        );
      }

      setList(updatedList);
      await onSaveFaculty(updatedList);
      setEditingItem(null);
      showToast?.(isNew ? "Faculty advisor added successfully." : "Faculty advisor updated successfully.");
    } catch (err: any) {
      showError?.(err.message || "Failed to save faculty advisor.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const updatedList = list.filter(
        (item) => (item.id && item.id !== deleteConfirm.id) || item.name !== deleteConfirm.name
      );
      setList(updatedList);
      await onSaveFaculty(updatedList);
      setDeleteConfirm(null);
      showToast?.(`Removed faculty advisor "${deleteConfirm.name}".`);
    } catch (err: any) {
      showError?.(err.message || "Failed to remove faculty advisor.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b0c10] border border-white/10 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1 text-[10px] font-mono uppercase text-racing-red font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>ACADEMIC PATRONAGE & INSTITUTIONAL MENTORSHIP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            Academic Faculty Advisors
          </h2>
          <p className="text-xs font-mono text-white/50">
            {list.length} Faculty Advisors • Displayed on the Public Team Page and About Institutional sections
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(210,39,48,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Advisor</span>
        </button>
      </div>

      {/* Advisors Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((advisor, index) => (
          <div
            key={advisor.id || advisor.name + index}
            className="bg-[#0b0c10] border border-white/10 hover:border-racing-red/50 p-5 flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border border-white/15 shrink-0">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-racing-red/10 border border-racing-red/30 text-racing-red font-bold">
                      {advisor.role || "Faculty Advisor"}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      #{index + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold uppercase font-display text-white mt-1 truncate">
                    {advisor.name}
                  </h3>
                  <p className="text-[11px] font-mono text-white/60 truncate">
                    {advisor.department}
                  </p>
                  <p className="text-[10px] font-mono text-white/40 mt-0.5">
                    Tenure: {advisor.tenure || "Present"}
                  </p>
                </div>
              </div>

              {advisor.profileUrl && (
                <a
                  href={advisor.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono text-racing-red hover:underline mb-3"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Institutional Profile Page</span>
                </a>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveOrder(index, "up")}
                  className="p-1.5 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === list.length - 1}
                  onClick={() => handleMoveOrder(index, "down")}
                  className="p-1.5 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStartEdit(advisor)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/20 text-white text-xs font-mono uppercase flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3 h-3 text-racing-red" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(advisor)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  title="Remove Advisor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          ADD / EDIT FACULTY ADVISOR MODAL
      ========================================================================= */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => !saving && setEditingItem(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0b0c10] border border-white/20 w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex justify-between items-center bg-[#0e0f14]">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-racing-red" />
                <h3 className="text-base sm:text-lg font-display font-black uppercase text-white">
                  {isNew ? "Add Academic Faculty Advisor" : "Edit Faculty Advisor"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain">
              <div>
                <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                  Full Name & Title <span className="text-racing-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Dr. Debasish Tripathy"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                    Advisory Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Faculty Advisor"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                    Academic Department
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.department}
                    onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                    placeholder="e.g. Mechanical Engineering"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                    Tenure / Term
                  </label>
                  <input
                    type="text"
                    value={editingItem.tenure}
                    onChange={(e) => setEditingItem({ ...editingItem, tenure: e.target.value })}
                    placeholder="e.g. 2022 - Present / Present"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    value={editingItem.order_index ?? 0}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase text-white/60 mb-1 block font-mono">
                  Institutional Profile URL
                </label>
                <input
                  type="url"
                  value={editingItem.profileUrl || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, profileUrl: e.target.value })}
                  placeholder="https://www.vssut.ac.in/faculty-profile.php?furl=..."
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              {/* Photo Upload / URL Selector */}
              <div className="bg-[#121318] border border-white/10 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-white/70 font-bold">
                    Faculty Portrait Photo
                  </span>
                  <div className="flex gap-1 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setPhotoSource("upload")}
                      className={`px-2 py-0.5 uppercase ${
                        photoSource === "upload" ? "bg-racing-red text-white" : "bg-white/5 text-white/50"
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoSource("url")}
                      className={`px-2 py-0.5 uppercase ${
                        photoSource === "url" ? "bg-racing-red text-white" : "bg-white/5 text-white/50"
                      }`}
                    >
                      Direct Image URL
                    </button>
                  </div>
                </div>

                {photoSource === "upload" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotoFile(file);
                          setEditingItem({
                            ...editingItem,
                            image: URL.createObjectURL(file),
                          });
                        }
                      }}
                      className="w-full text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={directPhotoUrl}
                      onChange={(e) => {
                        setDirectPhotoUrl(e.target.value);
                        setEditingItem({ ...editingItem, image: e.target.value });
                      }}
                      placeholder="https://... photo url"
                      className="w-full bg-[#0b0c10] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                )}

                {editingItem.image && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-black shrink-0">
                      <img
                        src={editingItem.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/40">
                      Portrait preview (renders in circular frames across advisors view)
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving || uploading ? "Saving..." : isNew ? "Add Advisor" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
      ========================================================================= */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setDeleteConfirm(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#120d0e] border border-red-500/40 w-full max-w-md p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold uppercase font-display text-white">
                Remove Faculty Advisor
              </h3>
            </div>
            <p className="text-white/70 text-xs font-sans leading-relaxed mb-6">
              Are you sure you want to remove <strong className="text-white font-bold">&quot;{deleteConfirm.name}&quot;</strong> ({deleteConfirm.role} • {deleteConfirm.department})?
              This action will take effect immediately across all connected client tabs.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-mono font-bold uppercase bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
