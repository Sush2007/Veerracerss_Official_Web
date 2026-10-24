"use client";

import { useState, useEffect } from "react";
import { X, Save, Sparkles, Upload, Image as ImageIcon } from "lucide-react";
import { MemberRecord } from "@/src/data/cms_defaults";
import { createClient } from "@/src/lib/supabase/client";

interface MemberDatasheetModalProps {
  member: MemberRecord;
  onClose: () => void;
  onSave: (updated: MemberRecord) => Promise<void>;
}

export function MemberDatasheetModal({ member, onClose, onSave }: MemberDatasheetModalProps) {
  const [formData, setFormData] = useState<MemberRecord>({
    ...member,
    year_of_study: member.year_of_study || "3rd Year",
    academic_branch: member.academic_branch || "Mechanical Engineering",
    blood_group: member.blood_group || "O+",
    phone: member.phone || "",
    pr_domain_skills: member.pr_domain_skills || "None (Technical Only)",
    joining_year: member.joining_year || "2023",
    order_index: member.order_index ?? 0,
    linkedin: member.linkedin && member.linkedin !== "#" ? member.linkedin : "",
    instagram: member.instagram && member.instagram !== "#" ? member.instagram : "",
  });

  // Photo Upload States
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(member.image_url || "/members/default-avatar.png");
  const [photoSource, setPhotoSource] = useState<"upload" | "url">("upload");
  const [directPhotoUrl, setDirectPhotoUrl] = useState<string>(member.image_url || "");

  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Lock background scrolling while modal is open
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
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

  const prSkills = [
    "None (Technical Only)",
    "Web Development & Site Maintenance",
    "Graphic Designing & Poster Art",
    "Video Editing & Track Reels",
    "Social Media & Content Strategy",
    "3D CAD Rendering & Blender Animation",
    "Corporate Sponsorship Outreach",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("Image file size exceeds maximum 15 MB limit.");
        return;
      }
      setUploadError(null);
      setPhotoFile(file);
      try {
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
      } catch {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUploadError(null);
    try {
      let finalImageUrl = formData.image_url || "/members/default-avatar.png";

      if (photoSource === "upload" && photoFile) {
        try {
          const supabase = createClient();
          const cleanExt = (photoFile.name.split(".").pop() || "png").toLowerCase();
          const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
          const storagePath = `domain-members/${cleanName}`;

          const { error: uploadErr } = await supabase.storage
            .from("member-images")
            .upload(storagePath, photoFile, {
              upsert: true,
              contentType: photoFile.type || "image/png",
            });

          if (!uploadErr) {
            const { data: pub } = supabase.storage.from("member-images").getPublicUrl(storagePath);
            finalImageUrl = pub.publicUrl;
          } else {
            console.warn("Storage upload fallback:", uploadErr.message);
          }
        } catch (uploadException: any) {
          console.warn("Photo upload warning:", uploadException);
        }
      } else if (photoSource === "url" && directPhotoUrl.trim()) {
        finalImageUrl = directPhotoUrl.trim();
      }

      // Format social links safely (auto-prefix http if missing, allow blank)
      const cleanSocial = (link?: string) => {
        if (!link) return "";
        const trimmed = link.trim();
        if (!trimmed || trimmed === "#") return "";
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
          return trimmed;
        }
        return `https://${trimmed}`;
      };

      await onSave({
        ...formData,
        image_url: finalImageUrl,
        linkedin: cleanSocial(formData.linkedin),
        instagram: cleanSocial(formData.instagram),
      });

      onClose();
    } catch (err: any) {
      setUploadError(err.message || "Failed to update member.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-in fade-in"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="bg-[#0b0c10] border border-white/15 w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={photoPreview}
              alt={formData.name}
              className="w-12 h-12 rounded object-cover object-top border border-white/20 bg-[#121318]"
            />
            <div>
              <span className="text-[10px] font-mono uppercase text-racing-red font-bold">
                MEMBER OFFICIAL PROFILE & DATASHEET
              </span>
              <h3 className="text-xl font-display font-black uppercase text-white">{formData.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
            
            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 text-xs font-mono">
                {uploadError}
              </div>
            )}

            {/* Photo Upload Section */}
            <div className="bg-[#121318] border border-white/10 p-3.5 space-y-2.5">
              <label className="text-[11px] font-mono uppercase text-racing-red font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Profile Picture / Headshot</span>
                </span>
                <span className="text-[10px] text-white/40 normal-case font-normal">
                  JPG, PNG or WEBP (Max 15MB)
                </span>
              </label>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 border border-white/20 bg-[#0b0c10] overflow-hidden">
                  <img
                    src={photoPreview}
                    alt="Headshot preview"
                    className="w-full h-full object-cover object-top"
                  />
                  {photoFile && (
                    <span className="absolute bottom-0 inset-x-0 bg-racing-red text-[8px] text-center font-mono font-bold text-white uppercase py-0.5">
                      New
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPhotoSource("upload")}
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 border transition-all ${
                        photoSource === "upload"
                          ? "bg-racing-red text-white border-racing-red font-bold"
                          : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoSource("url")}
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 border transition-all ${
                        photoSource === "url"
                          ? "bg-racing-red text-white border-racing-red font-bold"
                          : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                      }`}
                    >
                      Image URL
                    </button>
                  </div>

                  {photoSource === "upload" ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-xs text-white/70 file:mr-2 file:py-1 file:px-2.5 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer hover:file:bg-white/20"
                      />
                      {photoFile && (
                        <p className="text-[10px] font-mono text-emerald-400 mt-1">
                          Selected: {photoFile.name} ({(photoFile.size / 1024).toFixed(0)} KB)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={directPhotoUrl}
                        onChange={(e) => {
                          setDirectPhotoUrl(e.target.value);
                          if (e.target.value.trim()) setPhotoPreview(e.target.value.trim());
                        }}
                        placeholder="e.g. /members/nrusingha.png or https://..."
                        className="w-full bg-[#0b0c10] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Club Role</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>
            </div>

            {/* Department & Year of Study */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Department / Domain</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Year of Study</label>
                <select
                  value={formData.year_of_study}
                  onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                >
                  <option value="1st Year">1st Year (Freshers)</option>
                  <option value="2nd Year">2nd Year (Sophomores)</option>
                  <option value="3rd Year">3rd Year (Juniors)</option>
                  <option value="4th Year">4th Year (Senior / Final Year)</option>
                </select>
              </div>
            </div>

            {/* Academic Branch & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Academic Branch</label>
                <select
                  value={formData.academic_branch}
                  onChange={(e) => setFormData({ ...formData, academic_branch: e.target.value })}
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Blood Group</label>
                <input
                  type="text"
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  placeholder="O+, B+, A+, AB+"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>
            </div>

            {/* PR Domain & Media Specialization (Optional) */}
            <div className="bg-[#121318] border border-white/10 p-3.5 space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-racing-red font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PR & Media Specialization (Optional Domain Skill)</span>
              </label>
              <p className="text-[10px] text-white/50 font-mono">
                Assign sub-skills to team members to help the PR lead delegate media tasks.
              </p>
              <select
                value={formData.pr_domain_skills}
                onChange={(e) => setFormData({ ...formData, pr_domain_skills: e.target.value })}
                className="w-full bg-[#0b0c10] border border-white/15 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none mt-1"
              >
                {prSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone & Joining Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Phone (WhatsApp)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Joining Year</label>
                <input
                  type="text"
                  value={formData.joining_year}
                  onChange={(e) => setFormData({ ...formData, joining_year: e.target.value })}
                  placeholder="e.g. 2023"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block flex items-center justify-between">
                  <span>Display Priority Order</span>
                  <span className="text-[10px] text-white/30 lowercase">(lower = appears first)</span>
                </label>
                <input
                  type="number"
                  value={formData.order_index ?? 0}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>
            </div>

            {/* LinkedIn & Instagram (Completely Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block flex items-center justify-between">
                  <span>LinkedIn Profile</span>
                  <span className="text-[10px] text-white/30 lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.linkedin || ""}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/... or leave blank"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block flex items-center justify-between">
                  <span>Instagram Profile</span>
                  <span className="text-[10px] text-white/30 lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.instagram || ""}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/... or leave blank"
                  className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Datasheet"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
