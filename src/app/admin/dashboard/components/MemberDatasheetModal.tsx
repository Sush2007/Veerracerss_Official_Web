"use client";

import { useState, useEffect } from "react";
import { X, Save, Sparkles, BookOpen } from "lucide-react";
import { MemberRecord } from "@/src/data/cms_defaults";

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
  });
  const [saving, setSaving] = useState(false);

  // Lock background scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-start sm:items-center justify-center overscroll-contain">
      <div className="bg-[#0b0c10] border border-white/15 w-full max-w-xl my-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <img
              src={formData.image_url || "/members/default-avatar.png"}
              alt={formData.name}
              className="w-12 h-12 rounded object-cover object-top border border-white/20"
            />
            <div>
              <span className="text-[10px] font-mono uppercase text-racing-red font-bold">
                MEMBER OFFICIAL PROFILE & DATASHEET
              </span>
              <h3 className="text-xl font-display font-black uppercase text-white">{formData.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">LinkedIn Profile URL</label>
            <input
              type="url"
              value={formData.linkedin || ""}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
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
