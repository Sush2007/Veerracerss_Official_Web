"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";
import {
  LogOut,
  Upload,
  UserPlus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Edit2,
  CheckCircle,
  AlertCircle,
  Car,
  Flag,
  Film,
  GraduationCap,
  Users,
  Save,
  Plus,
  X
} from "lucide-react";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_FEATURED_MACHINE,
  DEFAULT_MEDIA_ITEMS,
  DEFAULT_ALUMNI_RECORDS,
  SiteSettings,
  FeaturedMachine,
  MediaItem,
  AlumniRecord
} from "@/src/data/cms_defaults";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"hero" | "machine" | "media" | "alumni" | "members">("hero");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 1. Hero & Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);

  // 2. Featured Machine State
  const [machine, setMachine] = useState<FeaturedMachine>(DEFAULT_FEATURED_MACHINE);
  const [savingMachine, setSavingMachine] = useState(false);
  const [cadFile, setCadFile] = useState<File | null>(null);
  const [trackFile, setTrackFile] = useState<File | null>(null);

  // 3. Media Items & Gallery State
  const [mediaList, setMediaList] = useState<MediaItem[]>(DEFAULT_MEDIA_ITEMS);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaYear, setMediaYear] = useState(new Date().getFullYear().toString());
  const [mediaFeatured, setMediaFeatured] = useState(true);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  // 4. Alumni State
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(DEFAULT_ALUMNI_RECORDS);
  const [alumniName, setAlumniName] = useState("");
  const [alumniBatch, setAlumniBatch] = useState("Batch 2024");
  const [alumniFormerRole, setAlumniFormerRole] = useState("");
  const [alumniCompany, setAlumniCompany] = useState("");
  const [alumniCurrentRole, setAlumniCurrentRole] = useState("");
  const [alumniLinkedin, setAlumniLinkedin] = useState("https://www.linkedin.com/company/veerracerss-electric/");
  const [alumniMentorshipDomain, setAlumniMentorshipDomain] = useState("");
  const [alumniBio, setAlumniBio] = useState("");
  const [alumniFile, setAlumniFile] = useState<File | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<AlumniRecord | null>(null);

  // 5. Active Squad Members State
  const [members, setMembers] = useState<any[]>([]);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberDepartment, setMemberDepartment] = useState("Leadership");
  const [memberFile, setMemberFile] = useState<File | null>(null);
  const [memberLinkedin, setMemberLinkedin] = useState("");
  const [memberInstagram, setMemberInstagram] = useState("");

  const departments = [
    "Leadership",
    "Chassis & Design",
    "Suspension & Steering",
    "Brakes & Tyres",
    "Powertrain & Drivetrain",
    "Executive Council"
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 6000);
  };

  useEffect(() => {
    checkUser();
    fetchAllData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/admin/login");
    } else {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    // 1. Site Settings
    try {
      const { data: sData } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (sData) setSiteSettings(sData);
    } catch {}

    // 2. Featured Machine
    try {
      const { data: mData } = await supabase.from("featured_machine").select("*").limit(1).maybeSingle();
      if (mData) setMachine(mData);
    } catch {}

    // 3. Media Items
    try {
      const { data: medData } = await supabase.from("media_items").select("*").order("order_index", { ascending: true });
      if (medData && medData.length > 0) setMediaList(medData);
    } catch {}

    // 4. Alumni
    try {
      const { data: aData } = await supabase.from("alumni").select("*").order("order_index", { ascending: true });
      if (aData && aData.length > 0) {
        setAlumniList(
          aData.map((item: any) => ({
            ...item,
            role_name: item.role_name || item.current_role || "",
            current_role: item.role_name || item.current_role || "",
          }))
        );
      }
    } catch {}

    // 5. Members
    try {
      const { data: memData } = await supabase.from("members").select("*").order("created_at", { ascending: false });
      if (memData) setMembers(memData);
    } catch {}
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // Helper: Sanitize & upload file to Supabase storage
  const uploadToStorage = async (file: File, bucket: string, folder: string = ""): Promise<string> => {
    if (file.size > 15 * 1024 * 1024) {
      throw new Error("File exceeds maximum allowed size (15 MB)");
    }
    const cleanExt = (file.name.split('.').pop() || "png").toLowerCase();
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
    const storagePath = folder ? `${folder}/${cleanName}` : cleanName;

    const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
      upsert: true,
      contentType: file.type || "image/png"
    });
    if (error) throw error;

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return pub.publicUrl;
  };

  // 1. Save Hero & Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
      let res;
      if (existing) {
        res = await supabase.from("site_settings").update({
          recruitment_cta_label: siteSettings.recruitment_cta_label,
          recruitment_cta_url: siteSettings.recruitment_cta_url,
          recruitment_cta_enabled: siteSettings.recruitment_cta_enabled,
          announcement_badge_text: siteSettings.announcement_badge_text,
          announcement_badge_enabled: siteSettings.announcement_badge_enabled,
          contact_email: siteSettings.contact_email,
          updated_at: new Date().toISOString()
        }).eq("id", existing.id);
      } else {
        res = await supabase.from("site_settings").insert([siteSettings]);
      }
      if (res.error) throw res.error;
      showToast("Hero and Site Settings updated successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to save settings. If table doesn't exist, execute supabase-cms-setup.sql.");
    } finally {
      setSavingSettings(false);
    }
  };

  // 2. Save Featured Machine
  const handleSaveMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMachine(true);
    try {
      let cadUrl = machine.cad_image_url;
      let trackUrl = machine.track_image_url;

      if (cadFile) {
        cadUrl = await uploadToStorage(cadFile, "member-images", "cars");
      }
      if (trackFile) {
        trackUrl = await uploadToStorage(trackFile, "member-images", "cars");
      }

      const payload = {
        ...machine,
        cad_image_url: cadUrl,
        track_image_url: trackUrl,
        updated_at: new Date().toISOString()
      };

      const { data: existing } = await supabase.from("featured_machine").select("id").limit(1).maybeSingle();
      let res;
      if (existing) {
        res = await supabase.from("featured_machine").update(payload).eq("id", existing.id);
      } else {
        res = await supabase.from("featured_machine").insert([payload]);
      }
      if (res.error) throw res.error;

      setMachine(payload);
      setCadFile(null);
      setTrackFile(null);
      showToast("The Car spotlight specs and photos updated successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to save car details.");
    } finally {
      setSavingMachine(false);
    }
  };

  // 3. Media Items: Add
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) return showError("Please select an image or video file.");
    setUploading(true);
    try {
      const mediaUrl = await uploadToStorage(mediaFile, "reel-media");
      const newItem = {
        title: mediaTitle,
        media_type: mediaType,
        media_url: mediaUrl,
        year: mediaYear,
        featured_on_home: mediaFeatured,
        order_index: mediaList.length + 1
      };

      const { data, error } = await supabase.from("media_items").insert([newItem]).select().single();
      if (error) throw error;

      setMediaList([...mediaList, data]);
      setMediaTitle("");
      setMediaFile(null);
      showToast("Media item added successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to add media item.");
    } finally {
      setUploading(false);
    }
  };

  // 3. Media Items: Edit
  const handleUpdateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    setUploading(true);
    try {
      const { error } = await supabase
        .from("media_items")
        .update({
          title: editingMedia.title,
          year: editingMedia.year,
          featured_on_home: editingMedia.featured_on_home
        })
        .eq("id", editingMedia.id);

      if (error) throw error;
      setMediaList(mediaList.map((m) => (m.id === editingMedia.id ? editingMedia : m)));
      setEditingMedia(null);
      showToast("Media item updated successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to update media item.");
    } finally {
      setUploading(false);
    }
  };

  // 3. Media Items: Delete
  const handleDeleteMedia = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      const { error } = await supabase.from("media_items").delete().eq("id", item.id);
      if (error) throw error;
      setMediaList(mediaList.filter((m) => m.id !== item.id));
      showToast("Media item deleted.");
    } catch (err: any) {
      showError(err.message || "Failed to delete item.");
    }
  };

  // 4. Alumni: Add
  const handleAddAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniFile) return showError("Please select an alumnus photo.");
    setUploading(true);
    try {
      const imgUrl = await uploadToStorage(alumniFile, "alumni-images");
      const newAlumnusPayload: any = {
        name: alumniName,
        batch: alumniBatch,
        former_role: alumniFormerRole,
        current_company: alumniCompany,
        role_name: alumniCurrentRole,
        image_url: imgUrl,
        linkedin_url: alumniLinkedin,
        mentorship_domain: alumniMentorshipDomain,
        bio: alumniBio,
        order_index: alumniList.length + 1
      };

      let { data, error } = await supabase.from("alumni").insert([newAlumnusPayload]).select().single();
      if (error && error.message?.includes("column \"role_name\" does not exist")) {
        const fallback = { ...newAlumnusPayload };
        delete fallback.role_name;
        fallback.current_role = alumniCurrentRole;
        const res = await supabase.from("alumni").insert([fallback]).select().single();
        data = res.data;
        error = res.error;
      }
      if (error) throw error;

      const savedItem: AlumniRecord = {
        ...data,
        role_name: data.role_name || data.current_role || alumniCurrentRole,
        current_role: data.role_name || data.current_role || alumniCurrentRole,
      };

      setAlumniList([...alumniList, savedItem]);
      setAlumniName("");
      setAlumniFormerRole("");
      setAlumniCompany("");
      setAlumniCurrentRole("");
      setAlumniMentorshipDomain("");
      setAlumniBio("");
      setAlumniFile(null);
      showToast("Alumni profile added successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to add alumni.");
    } finally {
      setUploading(false);
    }
  };

  // 4. Alumni: Edit
  const handleUpdateAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlumni) return;
    setUploading(true);
    try {
      const roleVal = editingAlumni.role_name || editingAlumni.current_role || "";
      const updatePayload: any = {
        name: editingAlumni.name,
        batch: editingAlumni.batch,
        former_role: editingAlumni.former_role,
        current_company: editingAlumni.current_company,
        role_name: roleVal,
        linkedin_url: editingAlumni.linkedin_url,
        mentorship_domain: editingAlumni.mentorship_domain,
        bio: editingAlumni.bio
      };

      let { error } = await supabase
        .from("alumni")
        .update(updatePayload)
        .eq("id", editingAlumni.id);

      if (error && error.message?.includes("column \"role_name\" does not exist")) {
        delete updatePayload.role_name;
        updatePayload.current_role = roleVal;
        const res = await supabase
          .from("alumni")
          .update(updatePayload)
          .eq("id", editingAlumni.id);
        error = res.error;
      }

      if (error) throw error;
      setAlumniList(
        alumniList.map((a) =>
          a.id === editingAlumni.id
            ? { ...editingAlumni, role_name: roleVal, current_role: roleVal }
            : a
        )
      );
      setEditingAlumni(null);
      showToast("Alumni profile updated successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to update alumni.");
    } finally {
      setUploading(false);
    }
  };

  // 4. Alumni: Delete
  const handleDeleteAlumni = async (alumnus: AlumniRecord) => {
    if (!confirm(`Are you sure you want to delete alumni profile: "${alumnus.name}"?`)) return;
    try {
      const { error } = await supabase.from("alumni").delete().eq("id", alumnus.id);
      if (error) throw error;
      setAlumniList(alumniList.filter((a) => a.id !== alumnus.id));
      showToast("Alumni profile deleted.");
    } catch (err: any) {
      showError(err.message || "Failed to delete alumni.");
    }
  };

  // 5. Member: Add
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFile) return showError("Please select a profile picture.");
    setUploading(true);
    try {
      const imgUrl = await uploadToStorage(memberFile, "member-images", "domain-members");
      const { error } = await supabase.from("members").insert([{
        name: memberName,
        role: memberRole,
        department: memberDepartment,
        image_url: imgUrl,
        linkedin: memberLinkedin || "#",
        instagram: memberInstagram || "#"
      }]);
      if (error) throw error;

      setMemberName("");
      setMemberRole("");
      setMemberFile(null);
      setMemberLinkedin("");
      setMemberInstagram("");
      fetchAllData();
      showToast("Member added successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to add member.");
    } finally {
      setUploading(false);
    }
  };

  // 5. Member: Delete
  const deleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the active roster?`)) return;
    try {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
      fetchAllData();
      showToast("Member removed.");
    } catch (err: any) {
      showError(err.message || "Failed to delete member.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono text-xs tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse mr-2"></span>
        Authenticating PR Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060709] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-1 px-2.5 py-0.5 bg-racing-red/10 border border-racing-red/30 text-racing-red font-mono text-[10px] uppercase tracking-widest font-bold">
              <span>VEERRACERSS ELECTRIC // PR & MEDIA PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-display text-white">
              Website Command Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 transition-colors uppercase tracking-wider"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3.5 py-2 transition-colors uppercase tracking-wider"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Floating Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0d1f14] border border-emerald-500/50 text-emerald-300 px-4 py-3 shadow-2xl flex items-center gap-3 text-xs font-mono tracking-wider uppercase animate-in slide-in-from-bottom-5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#2b0d10] border border-red-500/50 text-red-300 px-4 py-3 shadow-2xl flex items-center gap-3 text-xs font-mono tracking-wider uppercase animate-in slide-in-from-bottom-5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "hero" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Hero & Recruitment</span>
          </button>

          <button
            onClick={() => setActiveTab("machine")}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "machine" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>The Car (Spotlight)</span>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "media" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Track Moments ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("alumni")}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "alumni" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Alumni Network ({alumniList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "members" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Squad ({members.length})</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: HERO & RECRUITMENT SETTINGS
        ========================================================================= */}
        {activeTab === "hero" && (
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8 max-w-3xl">
            <div className="mb-6 border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold font-display uppercase tracking-wide text-white">
                Hero Section & Recruitment Call-to-Action
              </h2>
              <p className="text-white/50 text-xs mt-1 font-light">
                Manage the secondary hero button (recruitment status) and the top announcement pill without touching code.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Dynamic Recruitment CTA Toggle & Fields */}
              <div className="bg-black/40 border border-white/10 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold uppercase text-white tracking-wider block">
                      Recruitment Call to Action
                    </label>
                    <span className="text-[11px] text-white/50">
                      When enabled, displays the secondary button in the Hero section.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={siteSettings.recruitment_cta_enabled}
                    onChange={(e) => setSiteSettings({ ...siteSettings, recruitment_cta_enabled: e.target.checked })}
                    className="w-5 h-5 accent-racing-red cursor-pointer"
                  />
                </div>

                {siteSettings.recruitment_cta_enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Button Label</label>
                      <input
                        type="text"
                        required
                        value={siteSettings.recruitment_cta_label}
                        onChange={(e) => setSiteSettings({ ...siteSettings, recruitment_cta_label: e.target.value })}
                        placeholder="e.g. RECRUITMENT 2026"
                        className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Destination Link</label>
                      <input
                        type="text"
                        required
                        value={siteSettings.recruitment_cta_url}
                        onChange={(e) => setSiteSettings({ ...siteSettings, recruitment_cta_url: e.target.value })}
                        placeholder="e.g. /members or https://forms.gle/..."
                        className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Announcement Pill */}
              <div className="bg-black/40 border border-white/10 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold uppercase text-white tracking-wider block">
                      Top Announcement Pill
                    </label>
                    <span className="text-[11px] text-white/50">
                      Displays above the hero headline.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={siteSettings.announcement_badge_enabled}
                    onChange={(e) => setSiteSettings({ ...siteSettings, announcement_badge_enabled: e.target.checked })}
                    className="w-5 h-5 accent-racing-red cursor-pointer"
                  />
                </div>

                {siteSettings.announcement_badge_enabled && (
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Announcement Text</label>
                    <input
                      type="text"
                      required
                      value={siteSettings.announcement_badge_text}
                      onChange={(e) => setSiteSettings({ ...siteSettings, announcement_badge_text: e.target.value })}
                      placeholder="e.g. FORMULA STUDENT ELECTRIC // VSSUT BURLA"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Official Contact Email */}
              <div className="bg-black/40 border border-white/10 p-4 sm:p-5">
                <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Club Email Contact</label>
                <input
                  type="email"
                  required
                  value={siteSettings.contact_email}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                  className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 bg-racing-red hover:bg-white hover:text-black text-white px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? "Saving Settings..." : "Save Changes"}</span>
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 2: THE CAR (SPOTLIGHT SPECS & PHOTOS)
        ========================================================================= */}
        {activeTab === "machine" && (
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8 max-w-4xl">
            <div className="mb-6 border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold font-display uppercase tracking-wide text-white">
                Flagship Car Spotlight: Specs, CAD & Track Photos
              </h2>
              <p className="text-white/50 text-xs mt-1 font-light">
                Update the active flagship vehicle name, benchmarks, CAD renders, and subsystem engineering specs.
              </p>
            </div>

            <form onSubmit={handleSaveMachine} className="space-y-6">
              {/* Core Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Car Name</label>
                  <input
                    type="text"
                    required
                    value={machine.car_name}
                    onChange={(e) => setMachine({ ...machine, car_name: e.target.value })}
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Season / Category Tag</label>
                  <input
                    type="text"
                    required
                    value={machine.season_tag}
                    onChange={(e) => setMachine({ ...machine, season_tag: e.target.value })}
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Description / Narrative</label>
                <textarea
                  required
                  rows={3}
                  value={machine.description}
                  onChange={(e) => setMachine({ ...machine, description: e.target.value })}
                  className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              {/* Benchmarks Grid */}
              <div className="bg-black/40 border border-white/10 p-4 sm:p-5">
                <span className="text-xs font-mono uppercase text-white/70 tracking-wider block mb-3 font-bold">
                  4 Performance Benchmarks
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-white/50 mb-1 block font-mono">Top Speed (KM/H)</label>
                    <input
                      type="text"
                      required
                      value={machine.top_speed_val}
                      onChange={(e) => setMachine({ ...machine, top_speed_val: e.target.value })}
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-white/50 mb-1 block font-mono">0-100 Accel (SEC)</label>
                    <input
                      type="text"
                      required
                      value={machine.accel_val}
                      onChange={(e) => setMachine({ ...machine, accel_val: e.target.value })}
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-white/50 mb-1 block font-mono">Battery Voltage (VOLTS)</label>
                    <input
                      type="text"
                      required
                      value={machine.voltage_val}
                      onChange={(e) => setMachine({ ...machine, voltage_val: e.target.value })}
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-white/50 mb-1 block font-mono">Curb Weight (KG)</label>
                    <input
                      type="text"
                      required
                      value={machine.weight_val}
                      onChange={(e) => setMachine({ ...machine, weight_val: e.target.value })}
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/10 p-4">
                  <label className="text-xs uppercase text-white/70 mb-2 block font-mono font-bold">
                    Studio CAD Render Photo
                  </label>
                  <div className="aspect-[16/9] bg-black mb-3 overflow-hidden border border-white/5">
                    <img src={machine.cad_image_url} alt="CAD Render" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCadFile(e.target.files?.[0] || null)}
                    className="text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                  />
                  {cadFile && <span className="text-[11px] text-emerald-400 block mt-1">Ready: {cadFile.name}</span>}
                </div>

                <div className="bg-black/40 border border-white/10 p-4">
                  <label className="text-xs uppercase text-white/70 mb-2 block font-mono font-bold">
                    On-Track Action Photo
                  </label>
                  <div className="aspect-[16/9] bg-black mb-3 overflow-hidden border border-white/5">
                    <img src={machine.track_image_url} alt="Track Photo" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTrackFile(e.target.files?.[0] || null)}
                    className="text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                  />
                  {trackFile && <span className="text-[11px] text-emerald-400 block mt-1">Ready: {trackFile.name}</span>}
                </div>
              </div>

              {/* Subsystems Details */}
              <div className="bg-black/40 border border-white/10 p-4 sm:p-5 space-y-4">
                <span className="text-xs font-mono uppercase text-white/70 tracking-wider block font-bold">
                  Subsystem Technical Specifications
                </span>
                
                {/* Powertrain */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    value={machine.powertrain_headline}
                    onChange={(e) => setMachine({ ...machine, powertrain_headline: e.target.value })}
                    placeholder="Powertrain headline"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={machine.powertrain_specs}
                    onChange={(e) => setMachine({ ...machine, powertrain_specs: e.target.value })}
                    placeholder="Powertrain specs"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                  />
                </div>

                {/* Battery Pack */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    value={machine.accumulator_headline}
                    onChange={(e) => setMachine({ ...machine, accumulator_headline: e.target.value })}
                    placeholder="Battery headline"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={machine.accumulator_specs}
                    onChange={(e) => setMachine({ ...machine, accumulator_specs: e.target.value })}
                    placeholder="Battery specs"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                  />
                </div>

                {/* Chassis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    value={machine.chassis_headline}
                    onChange={(e) => setMachine({ ...machine, chassis_headline: e.target.value })}
                    placeholder="Chassis headline"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={machine.chassis_specs}
                    onChange={(e) => setMachine({ ...machine, chassis_specs: e.target.value })}
                    placeholder="Chassis specs"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                  />
                </div>

                {/* Aero */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    value={machine.aero_headline}
                    onChange={(e) => setMachine({ ...machine, aero_headline: e.target.value })}
                    placeholder="Aero headline"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={machine.aero_specs}
                    onChange={(e) => setMachine({ ...machine, aero_specs: e.target.value })}
                    placeholder="Aero specs"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingMachine}
                className="inline-flex items-center gap-2 bg-racing-red hover:bg-white hover:text-black text-white px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingMachine ? "Saving Vehicle Specs..." : "Save Car Spotlight"}</span>
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 3: TRACK MOMENTS & GALLERY (ADD / EDIT / REMOVE BUTTONS)
        ========================================================================= */}
        {activeTab === "media" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-1">
              <div className="bg-[#0b0c10] border border-white/10 p-6 sticky top-24">
                <h2 className="text-base font-bold uppercase mb-4 flex items-center gap-2 font-display text-white">
                  <Plus className="w-4 h-4 text-racing-red" />
                  <span>{editingMedia ? "Edit Media Item" : "Add Track Moment"}</span>
                </h2>

                <form onSubmit={editingMedia ? handleUpdateMedia : handleAddMedia} className="space-y-4">
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Title / Caption</label>
                    <input
                      type="text"
                      required
                      value={editingMedia ? editingMedia.title : mediaTitle}
                      onChange={(e) =>
                        editingMedia
                          ? setEditingMedia({ ...editingMedia, title: e.target.value })
                          : setMediaTitle(e.target.value)
                      }
                      placeholder="e.g. AETHER Dyno Run"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  {!editingMedia && (
                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Media Type</label>
                      <select
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value as any)}
                        className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                      >
                        <option value="image">Photo (.jpg, .png, .webp)</option>
                        <option value="video">Short Video Loop (.mp4, .webm)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Year</label>
                    <input
                      type="text"
                      required
                      value={editingMedia ? editingMedia.year : mediaYear}
                      onChange={(e) =>
                        editingMedia
                          ? setEditingMedia({ ...editingMedia, year: e.target.value })
                          : setMediaYear(e.target.value)
                      }
                      placeholder="e.g. 2025"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="featHome"
                      checked={editingMedia ? editingMedia.featured_on_home : mediaFeatured}
                      onChange={(e) =>
                        editingMedia
                          ? setEditingMedia({ ...editingMedia, featured_on_home: e.target.checked })
                          : setMediaFeatured(e.target.checked)
                      }
                      className="w-4 h-4 accent-racing-red cursor-pointer"
                    />
                    <label htmlFor="featHome" className="text-xs font-mono text-white/70 cursor-pointer">
                      Feature on Homepage Reel
                    </label>
                  </div>

                  {!editingMedia && (
                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Upload File</label>
                      <input
                        type="file"
                        required
                        accept={mediaType === "video" ? "video/*" : "image/*"}
                        onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all disabled:opacity-50"
                    >
                      {uploading ? "Processing..." : editingMedia ? "Update Item" : "Add to Gallery"}
                    </button>
                    {editingMedia && (
                      <button
                        type="button"
                        onClick={() => setEditingMedia(null)}
                        className="bg-white/10 text-white text-xs font-mono uppercase px-3 py-2 hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2">
              <div className="bg-[#0b0c10] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-base font-bold uppercase font-display text-white">
                    Track Footage & Gallery ({mediaList.length})
                  </h3>
                  <span className="text-[10px] font-mono text-white/40 uppercase">
                    Homepage Reel & Yearwise Archive
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mediaList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-black/50 border border-white/10 overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="relative aspect-[16/10] bg-black">
                        {item.media_type === "video" ? (
                          <video src={item.media_url} muted className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-mono text-white">
                          {item.year}
                        </div>
                        {item.featured_on_home && (
                          <div className="absolute top-2 right-2 bg-racing-red px-2 py-0.5 text-[9px] font-mono text-white font-bold">
                            ON HOME REEL
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-[#0c0d11] flex items-center justify-between gap-2 border-t border-white/5">
                        <div className="truncate">
                          <p className="text-xs font-sans font-bold text-white truncate">{item.title}</p>
                          <span className="text-[10px] font-mono text-white/40 uppercase">{item.media_type}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingMedia(item)}
                            className="p-1.5 bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(item)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ALUMNI NETWORK (ADD / EDIT / REMOVE BUTTONS)
        ========================================================================= */}
        {activeTab === "alumni" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-1">
              <div className="bg-[#0b0c10] border border-white/10 p-6 sticky top-24">
                <h2 className="text-base font-bold uppercase mb-4 flex items-center gap-2 font-display text-white">
                  <Plus className="w-4 h-4 text-racing-red" />
                  <span>{editingAlumni ? "Edit Alumnus" : "Add Alumnus Profile"}</span>
                </h2>

                <form onSubmit={editingAlumni ? handleUpdateAlumni : handleAddAlumni} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editingAlumni ? editingAlumni.name : alumniName}
                      onChange={(e) =>
                        editingAlumni
                          ? setEditingAlumni({ ...editingAlumni, name: e.target.value })
                          : setAlumniName(e.target.value)
                      }
                      className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Batch</label>
                      <input
                        type="text"
                        required
                        value={editingAlumni ? editingAlumni.batch : alumniBatch}
                        onChange={(e) =>
                          editingAlumni
                            ? setEditingAlumni({ ...editingAlumni, batch: e.target.value })
                            : setAlumniBatch(e.target.value)
                        }
                        placeholder="Batch 2023"
                        className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Company</label>
                      <input
                        type="text"
                        required
                        value={editingAlumni ? editingAlumni.current_company : alumniCompany}
                        onChange={(e) =>
                          editingAlumni
                            ? setEditingAlumni({ ...editingAlumni, current_company: e.target.value })
                            : setAlumniCompany(e.target.value)
                        }
                        placeholder="e.g. Ather Energy"
                        className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Current Industry Role</label>
                    <input
                      type="text"
                      required
                      value={editingAlumni ? (editingAlumni.role_name || editingAlumni.current_role || "") : alumniCurrentRole}
                      onChange={(e) =>
                        editingAlumni
                          ? setEditingAlumni({
                              ...editingAlumni,
                              role_name: e.target.value,
                              current_role: e.target.value,
                            })
                          : setAlumniCurrentRole(e.target.value)
                      }
                      placeholder="e.g. Battery Systems Engineer"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Former Club Role</label>
                    <input
                      type="text"
                      required
                      value={editingAlumni ? editingAlumni.former_role : alumniFormerRole}
                      onChange={(e) =>
                        editingAlumni
                          ? setEditingAlumni({ ...editingAlumni, former_role: e.target.value })
                          : setAlumniFormerRole(e.target.value)
                      }
                      placeholder="e.g. Former Powertrain Lead"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Mentorship Domain</label>
                    <input
                      type="text"
                      required
                      value={editingAlumni ? editingAlumni.mentorship_domain : alumniMentorshipDomain}
                      onChange={(e) =>
                        editingAlumni
                          ? setEditingAlumni({ ...editingAlumni, mentorship_domain: e.target.value })
                          : setAlumniMentorshipDomain(e.target.value)
                      }
                      placeholder="e.g. Li-Ion Architecture & BMS"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editingAlumni ? editingAlumni.linkedin_url : alumniLinkedin}
                      onChange={(e) =>
                        editingAlumni
                          ? setEditingAlumni({ ...editingAlumni, linkedin_url: e.target.value })
                          : setAlumniLinkedin(e.target.value)
                      }
                      className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Bio / Impact Summary</label>
                    <textarea
                      rows={2}
                      value={editingAlumni ? editingAlumni.bio || "" : alumniBio}
                      onChange={(e) =>
                        editingAlumni
                          ? setEditingAlumni({ ...editingAlumni, bio: e.target.value })
                          : setAlumniBio(e.target.value)
                      }
                      placeholder="Short career summary"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>

                  {!editingAlumni && (
                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Headshot Photo</label>
                      <input
                        type="file"
                        required
                        accept="image/*"
                        onChange={(e) => setAlumniFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all disabled:opacity-50"
                    >
                      {uploading ? "Saving..." : editingAlumni ? "Update Alumnus" : "Add Alumnus"}
                    </button>
                    {editingAlumni && (
                      <button
                        type="button"
                        onClick={() => setEditingAlumni(null)}
                        className="bg-white/10 text-white text-xs font-mono uppercase px-3 py-2 hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2">
              <div className="bg-[#0b0c10] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-base font-bold uppercase font-display text-white">
                    Alumni Profiles ({alumniList.length})
                  </h3>
                  <Link
                    href="/alumni"
                    target="_blank"
                    className="text-[11px] font-mono text-racing-red hover:underline uppercase flex items-center gap-1"
                  >
                    <span>View Public /alumni Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {alumniList.map((alumnus) => (
                    <div
                      key={alumnus.id}
                      className="bg-black/50 border border-white/10 p-4 flex gap-3 items-start justify-between group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={alumnus.image_url}
                          alt={alumnus.name}
                          className="w-14 h-14 object-cover object-top border border-white/20 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white">{alumnus.name}</h4>
                          <p className="text-[11px] text-racing-red font-mono font-bold">@ {alumnus.current_company}</p>
                          <p className="text-[10px] text-white/50 font-mono">{alumnus.role_name || alumnus.current_role}</p>
                          <span className="text-[9px] bg-white/10 px-1.5 py-0.5 mt-1 inline-block text-white/70 font-mono">
                            {alumnus.batch}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingAlumni(alumnus)}
                          className="p-1.5 bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                          title="Edit Alumnus"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAlumni(alumnus)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Alumnus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: ACTIVE TEAM SQUAD (ORIGINAL ROSTER)
        ========================================================================= */}
        {activeTab === "members" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#0b0c10] border border-white/10 p-6">
                <h2 className="text-base font-bold uppercase mb-4 flex items-center gap-2 font-display text-white">
                  <UserPlus className="w-4 h-4 text-racing-red" />
                  <span>Add Team Member</span>
                </h2>

                <form onSubmit={handleMemberSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Role / Title</label>
                    <input
                      type="text"
                      required
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      placeholder="e.g. Powertrain Engineer"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Department</label>
                    <select
                      value={memberDepartment}
                      onChange={(e) => setMemberDepartment(e.target.value)}
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d} className="bg-black text-white">{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Profile Picture</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => setMemberFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">LinkedIn URL</label>
                      <input
                        type="url"
                        value={memberLinkedin}
                        onChange={(e) => setMemberLinkedin(e.target.value)}
                        className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Instagram URL</label>
                      <input
                        type="url"
                        value={memberInstagram}
                        onChange={(e) => setMemberInstagram(e.target.value)}
                        className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Save Member"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[#0b0c10] border border-white/10 p-6">
                <h3 className="text-base font-bold uppercase font-display text-white mb-4 pb-3 border-b border-white/10">
                  Active Roster ({members.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[650px] overflow-y-auto pr-1">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-black/50 border border-white/10 p-3 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-11 h-11 object-cover border border-white/20 shrink-0"
                        />
                        <div className="truncate">
                          <h4 className="font-bold text-xs text-white truncate">{member.name}</h4>
                          <p className="text-[10px] text-racing-red font-mono uppercase">{member.department}</p>
                          <p className="text-[10px] text-white/50 truncate">{member.role}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteMember(member.id, member.name)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors shrink-0"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
