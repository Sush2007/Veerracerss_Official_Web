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
  X,
  FileSpreadsheet,
  DollarSign,
  Layers,
  Sparkles,
  BookOpen,
  Filter,
  HardDrive,
  Shield,
  Award,
} from "lucide-react";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_FEATURED_MACHINE,
  DEFAULT_MEDIA_ITEMS,
  DEFAULT_ALUMNI_RECORDS,
  DEFAULT_EXPENSES,
  DEFAULT_RECRUITS,
  DEFAULT_CUSTOM_DATABASES,
  DEFAULT_VEHICLES,
  DEFAULT_SPONSORS,
  SiteSettings,
  FeaturedMachine,
  MediaItem,
  AlumniRecord,
  MemberRecord,
  ClubExpense,
  RecruitmentApplication,
  CustomDatabaseRecord,
  VehicleRecord,
  SponsorRecord,
  extractSpotlightFromVehicles,
} from "@/src/data/cms_defaults";
import { exportTableToExcel, exportMultiSheetExcel } from "@/src/lib/exportToExcel";
import { MemberDatasheetModal } from "./components/MemberDatasheetModal";
import { BatchProgressionModal } from "./components/BatchProgressionModal";
import { ExpensesTab } from "./components/ExpensesTab";
import { RecruitmentTab } from "./components/RecruitmentTab";
import { CustomDbsTab } from "./components/CustomDbsTab";
import { AdminSecurityModal } from "./components/AdminSecurityModal";
import { VehiclesTab } from "./components/VehiclesTab";
import { SponsorsTab } from "./components/SponsorsTab";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "hero" | "vehicles" | "sponsors" | "machine" | "media" | "alumni" | "members" | "expenses" | "recruitment" | "custom_dbs"
  >("hero");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 1. Hero & Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);

  // 2. Vehicles Fleet & Auto-Spotlight Sync State
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(DEFAULT_VEHICLES);
  const [sponsors, setSponsors] = useState<SponsorRecord[]>(DEFAULT_SPONSORS);

  // 2b. Featured Machine State
  const [machine, setMachine] = useState<FeaturedMachine>(DEFAULT_FEATURED_MACHINE);
  const [savingMachine, setSavingMachine] = useState(false);
  const [cadFile, setCadFile] = useState<File | null>(null);
  const [cadModelFile, setCadModelFile] = useState<File | null>(null);
  const [trackFile, setTrackFile] = useState<File | null>(null);

  // 3. Media Items & Gallery State
  const [mediaList, setMediaList] = useState<MediaItem[]>(DEFAULT_MEDIA_ITEMS);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaYear, setMediaYear] = useState(new Date().getFullYear().toString());
  const [mediaFeatured, setMediaFeatured] = useState(true);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaSourceType, setMediaSourceType] = useState<"upload" | "url">("upload");
  const [mediaDirectUrl, setMediaDirectUrl] = useState("");
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [deleteConfirmMedia, setDeleteConfirmMedia] = useState<MediaItem | null>(null);
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
  const [alumniPhotoSource, setAlumniPhotoSource] = useState<"upload" | "url">("upload");
  const [alumniDirectUrl, setAlumniDirectUrl] = useState("");
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [deleteConfirmAlumni, setDeleteConfirmAlumni] = useState<AlumniRecord | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<AlumniRecord | null>(null);

  // 5. Active Squad Members State
  const [members, setMembers] = useState<MemberRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("vr_members");
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<MemberRecord | null>(null);
  const [uploadingAboutImg, setUploadingAboutImg] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberDepartment, setMemberDepartment] = useState("Leadership");
  const [memberYearOfStudy, setMemberYearOfStudy] = useState("3rd Year");
  const [memberPrSkills, setMemberPrSkills] = useState("None (Technical Only)");
  const [memberBranch, setMemberBranch] = useState("Mechanical Engineering");
  const [memberBloodGroup, setMemberBloodGroup] = useState("O+");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberFile, setMemberFile] = useState<File | null>(null);
  const [memberLinkedin, setMemberLinkedin] = useState("");
  const [memberInstagram, setMemberInstagram] = useState("");
  const [memberYearFilter, setMemberYearFilter] = useState("ALL");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedMemberForDatasheet, setSelectedMemberForDatasheet] = useState<MemberRecord | null>(null);
  const [showProgressionModal, setShowProgressionModal] = useState(false);

  // 6. Club Expenses State
  const [expenses, setExpenses] = useState<ClubExpense[]>(DEFAULT_EXPENSES);

  // 7. Recruitment Applications State
  const [recruits, setRecruits] = useState<RecruitmentApplication[]>(DEFAULT_RECRUITS);

  // 8. Custom Databases State
  const [customDbs, setCustomDbs] = useState<CustomDatabaseRecord[]>(DEFAULT_CUSTOM_DATABASES);

  // 9. Utilities & Modals State
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Master Dialog Scroll-Lock Effect: Prevents background scrolling whenever ANY modal is active
  const isAnyDashboardModalOpen = Boolean(
    showMediaModal ||
    showAlumniModal ||
    deleteConfirmMedia ||
    deleteConfirmAlumni ||
    deleteConfirmMember ||
    selectedMemberForDatasheet ||
    showProgressionModal ||
    showSecurityModal
  );

  useEffect(() => {
    if (isAnyDashboardModalOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isAnyDashboardModalOpen]);

  const departments = [
    "Leadership",
    "Chassis and Design",
    "Suspension and Steering",
    "Brakes and Tires",
    "Powertrain and Drivetrain",
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
      let localExt: any = {};
      let localAbout: any = {};
      let localTelemetry: any = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_site_settings_extended");
          if (raw) localExt = JSON.parse(raw);
          const rawAbout = localStorage.getItem("vr_about_settings");
          if (rawAbout) localAbout = JSON.parse(rawAbout);
          const rawTel = localStorage.getItem("vr_telemetry_stats");
          if (rawTel) localTelemetry = JSON.parse(rawTel);
        } catch {}
      }
      if (sData) {
        setSiteSettings({
          ...DEFAULT_SITE_SETTINGS,
          ...sData,
          ...localExt,
          about_image_url: sData.about_image_url || localAbout.about_image_url || DEFAULT_SITE_SETTINGS.about_image_url,
          about_title: sData.about_title || localAbout.about_title || DEFAULT_SITE_SETTINGS.about_title,
          about_subtitle: sData.about_subtitle || localAbout.about_subtitle || DEFAULT_SITE_SETTINGS.about_subtitle,
          about_description: sData.about_description || localAbout.about_description || DEFAULT_SITE_SETTINGS.about_description,
          telemetry_stats: (sData.telemetry_stats && sData.telemetry_stats.length > 0)
            ? sData.telemetry_stats
            : (localTelemetry && localTelemetry.length > 0)
            ? localTelemetry
            : DEFAULT_SITE_SETTINGS.telemetry_stats,
        });
      } else {
        setSiteSettings((prev) => ({
          ...DEFAULT_SITE_SETTINGS,
          ...prev,
          ...localExt,
          about_image_url: localAbout.about_image_url || DEFAULT_SITE_SETTINGS.about_image_url,
          about_title: localAbout.about_title || DEFAULT_SITE_SETTINGS.about_title,
          about_subtitle: localAbout.about_subtitle || DEFAULT_SITE_SETTINGS.about_subtitle,
          about_description: localAbout.about_description || DEFAULT_SITE_SETTINGS.about_description,
          telemetry_stats: (localTelemetry && localTelemetry.length > 0) ? localTelemetry : DEFAULT_SITE_SETTINGS.telemetry_stats,
        }));
      }
    } catch {}

    // 2. Featured Machine & Vehicles Fleet
    try {
      const { data: mData } = await supabase.from("featured_machine").select("*").limit(1).maybeSingle();
      let localExt: any = {};
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_machine_extended");
          if (raw) localExt = JSON.parse(raw);
        } catch {}
      }
      if (mData) {
        setMachine({
          ...DEFAULT_FEATURED_MACHINE,
          ...localExt,
          ...mData,
        });
      } else if (localExt.cad_model_url) {
        setMachine((prev) => ({ ...prev, ...localExt }));
      }
    } catch {}

    // 2b. Vehicles Fleet
    try {
      const { data: vData } = await supabase.from("vehicles").select("*").order("year", { ascending: false });
      let localVehicles: VehicleRecord[] | null = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_vehicles");
          if (raw) localVehicles = JSON.parse(raw);
        } catch {}
      }
      if (vData && vData.length > 0) {
        setVehicles(vData);
      } else if (localVehicles && localVehicles.length > 0) {
        setVehicles(localVehicles);
      } else {
        setVehicles(DEFAULT_VEHICLES);
      }
    } catch {}

    // 2c. Sponsors & Corporate Partners
    try {
      const { data: spData } = await supabase.from("sponsors").select("*").order("order_index", { ascending: true });
      let localSponsors: SponsorRecord[] | null = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_sponsors");
          if (raw) localSponsors = JSON.parse(raw);
        } catch {}
      }
      if (spData && spData.length > 0) {
        setSponsors(spData);
      } else if (localSponsors && localSponsors.length > 0) {
        setSponsors(localSponsors);
      } else {
        setSponsors(DEFAULT_SPONSORS);
      }
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
      if (memData && memData.length > 0) {
        const formatted = memData.map((m: any) => {
          let yearOfStudy = m.year_of_study;
          if (!yearOfStudy && m.year) {
            if (m.year.includes("4th") || (m.year.includes("Final") && !m.year.includes("Pre-Final"))) yearOfStudy = "4th Year";
            else if (m.year.includes("3rd") || m.year.includes("Pre-Final")) yearOfStudy = "3rd Year";
            else if (m.year.includes("2nd")) yearOfStudy = "2nd Year";
            else if (m.year.includes("1st")) yearOfStudy = "1st Year";
            else yearOfStudy = m.year;
          }
          return {
            ...m,
            year_of_study: yearOfStudy || "3rd Year",
          };
        });
        setMembers(formatted);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("vr_members", JSON.stringify(formatted));
          } catch {}
        }
      }
    } catch {}

    // 6. Club Expenses
    try {
      const { data: expData } = await supabase.from("club_expenses").select("*").order("expense_date", { ascending: false });
      let localExp: ClubExpense[] | null = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_club_expenses");
          if (raw) localExp = JSON.parse(raw);
        } catch {}
      }
      if (expData && expData.length > 0) {
        setExpenses(expData);
      } else if (localExp !== null) {
        setExpenses(localExp);
      }
    } catch {}

    // 7. Recruitment Applications
    try {
      const { data: recData } = await supabase.from("recruitment_applications").select("*").order("created_at", { ascending: false });
      let localRec: RecruitmentApplication[] | null = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_recruitment_applications");
          if (raw) localRec = JSON.parse(raw);
        } catch {}
      }
      if (recData && recData.length > 0) {
        setRecruits(recData);
      } else if (localRec !== null) {
        setRecruits(localRec);
      }
    } catch {}

    // 8. Custom Databases
    try {
      const { data: cdbData } = await supabase.from("custom_databases").select("*").order("created_at", { ascending: true });
      let localCdbs: CustomDatabaseRecord[] | null = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_custom_databases");
          if (raw) localCdbs = JSON.parse(raw);
        } catch {}
      }
      if (cdbData && cdbData.length > 0) {
        setCustomDbs(cdbData);
      } else if (localCdbs !== null) {
        setCustomDbs(localCdbs);
      }
    } catch {}
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // Helper: Verify if ID conforms to standard PostgreSQL UUID format
  const isValidUUID = (id?: string | null): boolean => {
    if (!id) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
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
      const settingsPayload: any = {
        hero_title: siteSettings.hero_title || DEFAULT_SITE_SETTINGS.hero_title,
        hero_subtitle: siteSettings.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle,
        recruitment_cta_label: siteSettings.recruitment_cta_label,
        recruitment_cta_url: siteSettings.recruitment_cta_url,
        recruitment_cta_enabled: siteSettings.recruitment_cta_enabled,
        announcement_badge_text: siteSettings.announcement_badge_text,
        announcement_badge_enabled: siteSettings.announcement_badge_enabled,
        contact_email: siteSettings.contact_email,
        recruitment_open: siteSettings.recruitment_open !== false,
        recruitment_form_enabled: siteSettings.recruitment_form_enabled !== false,
        recruitment_form_title: siteSettings.recruitment_form_title || "Formula Student Electric 2026 - Official Recruitment",
        recruitment_form_deadline: siteSettings.recruitment_form_deadline || "Season 2026 Phase 1 Induction",
        recruitment_instructions: siteSettings.recruitment_instructions || DEFAULT_SITE_SETTINGS.recruitment_instructions,
        recruitment_eligibility: siteSettings.recruitment_eligibility || DEFAULT_SITE_SETTINGS.recruitment_eligibility,
        recruitment_question_prompt: siteSettings.recruitment_question_prompt || DEFAULT_SITE_SETTINGS.recruitment_question_prompt,
        onboarding_email_subject: siteSettings.onboarding_email_subject || DEFAULT_SITE_SETTINGS.onboarding_email_subject,
        whatsapp_recruit_link: siteSettings.whatsapp_recruit_link || "https://chat.whatsapp.com/veerracerss-recruits-2026",
        onboarding_email_template: siteSettings.onboarding_email_template,
        about_image_url: siteSettings.about_image_url || DEFAULT_SITE_SETTINGS.about_image_url,
        about_title: siteSettings.about_title || DEFAULT_SITE_SETTINGS.about_title,
        about_subtitle: siteSettings.about_subtitle || DEFAULT_SITE_SETTINGS.about_subtitle,
        about_description: siteSettings.about_description || DEFAULT_SITE_SETTINGS.about_description,
        telemetry_stats: siteSettings.telemetry_stats || DEFAULT_SITE_SETTINGS.telemetry_stats,
        updated_at: new Date().toISOString()
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_site_settings_extended", JSON.stringify({
            hero_title: siteSettings.hero_title || DEFAULT_SITE_SETTINGS.hero_title,
            hero_subtitle: siteSettings.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle,
            recruitment_open: siteSettings.recruitment_open,
          }));
          localStorage.setItem("vr_about_settings", JSON.stringify({
            about_image_url: siteSettings.about_image_url || DEFAULT_SITE_SETTINGS.about_image_url,
            about_title: siteSettings.about_title || DEFAULT_SITE_SETTINGS.about_title,
            about_subtitle: siteSettings.about_subtitle || DEFAULT_SITE_SETTINGS.about_subtitle,
            about_description: siteSettings.about_description || DEFAULT_SITE_SETTINGS.about_description,
          }));
          if (siteSettings.telemetry_stats) {
            localStorage.setItem("vr_telemetry_stats", JSON.stringify(siteSettings.telemetry_stats));
          }
        } catch {}
      }

      const stripExtended = (payload: any) => {
        const clean = { ...payload };
        delete clean.hero_title;
        delete clean.hero_subtitle;
        delete clean.recruitment_open;
        delete clean.recruitment_form_enabled;
        delete clean.recruitment_form_title;
        delete clean.recruitment_form_deadline;
        delete clean.recruitment_instructions;
        delete clean.recruitment_eligibility;
        delete clean.recruitment_question_prompt;
        delete clean.onboarding_email_subject;
        delete clean.whatsapp_recruit_link;
        delete clean.onboarding_email_template;
        delete clean.about_image_url;
        delete clean.about_title;
        delete clean.about_subtitle;
        delete clean.about_description;
        delete clean.telemetry_stats;
        return clean;
      };

      let res;
      if (existing) {
        res = await supabase.from("site_settings").update(settingsPayload).eq("id", existing.id);
        if (res.error && res.error.message?.includes("column")) {
          // Fallback if extended columns not yet run in supabase
          res = await supabase.from("site_settings").update(stripExtended(settingsPayload)).eq("id", existing.id);
        }
      } else {
        res = await supabase.from("site_settings").insert([settingsPayload]);
        if (res.error && res.error.message?.includes("column")) {
          res = await supabase.from("site_settings").insert([stripExtended(settingsPayload)]);
        }
      }
      if (res.error) throw res.error;
      showToast("Hero, About & Telemetry Settings updated successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to save settings. If table doesn't exist, execute supabase-cms-setup.sql.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAboutImg(true);
    try {
      const url = await uploadToStorage(file, "member-images", "about");
      setSiteSettings((prev) => ({ ...prev, about_image_url: url }));
      showToast("Who We Are image uploaded! Click 'Save Changes' to apply.");
    } catch (err: any) {
      showError(err.message || "Failed to upload image.");
    } finally {
      setUploadingAboutImg(false);
    }
  };

  const handleUpdateTelemetryCard = (index: number, field: string, val: string) => {
    const current = siteSettings.telemetry_stats
      ? [...siteSettings.telemetry_stats]
      : [...(DEFAULT_SITE_SETTINGS.telemetry_stats || [])];
    current[index] = { ...current[index], [field]: val };
    setSiteSettings({ ...siteSettings, telemetry_stats: current });
  };

  // 2. Save Featured Machine
  const handleSaveMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMachine(true);
    try {
      let cadUrl = machine.cad_image_url;
      let trackUrl = machine.track_image_url;
      let cadModelUrl = machine.cad_model_url || DEFAULT_FEATURED_MACHINE.cad_model_url || "/car-raw.glb";

      if (cadFile) {
        cadUrl = await uploadToStorage(cadFile, "member-images", "cars");
      }
      if (trackFile) {
        trackUrl = await uploadToStorage(trackFile, "member-images", "cars");
      }
      if (cadModelFile) {
        cadModelUrl = await uploadToStorage(cadModelFile, "member-images", "cars");
      }

      const payload = {
        ...machine,
        cad_model_url: cadModelUrl,
        cad_image_url: cadUrl,
        track_image_url: trackUrl,
        updated_at: new Date().toISOString()
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_machine_extended", JSON.stringify({
            cad_model_url: cadModelUrl,
          }));
        } catch {}
      }

      const { data: existing } = await supabase.from("featured_machine").select("id").limit(1).maybeSingle();
      let res;
      if (existing) {
        res = await supabase.from("featured_machine").update(payload).eq("id", existing.id);
        if (res.error && res.error.message?.includes("column")) {
          const fallback = { ...payload };
          delete (fallback as any).cad_model_url;
          res = await supabase.from("featured_machine").update(fallback).eq("id", existing.id);
        }
      } else {
        res = await supabase.from("featured_machine").insert([payload]);
        if (res.error && res.error.message?.includes("column")) {
          const fallback = { ...payload };
          delete (fallback as any).cad_model_url;
          res = await supabase.from("featured_machine").insert([fallback]);
        }
      }
      if (res.error) throw res.error;

      setMachine(payload);
      setCadFile(null);
      setTrackFile(null);
      setCadModelFile(null);
      showToast("The Car spotlight specs and photos updated successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to save car details.");
    } finally {
      setSavingMachine(false);
    }
  };

  // 2c. Vehicles Fleet & Auto-Spotlight Sync Handlers
  const handleSaveVehicles = async (updatedVehicles: VehicleRecord[]) => {
    const deletedVehicles = vehicles.filter((v) => !updatedVehicles.some((u) => u.id === v.id));
    setVehicles(updatedVehicles);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vr_vehicles", JSON.stringify(updatedVehicles));
      } catch {}
    }

    try {
      for (const del of deletedVehicles) {
        if (isValidUUID(del.id)) {
          await supabase.from("vehicles").delete().eq("id", del.id);
        }
      }
      for (const v of updatedVehicles) {
        await supabase.from("vehicles").upsert(v);
      }
    } catch (e) {
      console.warn("Supabase vehicles upsert notice:", e);
    }

    // Automatically sync newest / spotlight car into Homepage Featured Machine
    const extractedSpotlight = extractSpotlightFromVehicles(updatedVehicles);
    setMachine(extractedSpotlight);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vr_machine_extended", JSON.stringify(extractedSpotlight));
      } catch {}
    }
    try {
      const { data: existing } = await supabase.from("featured_machine").select("id").limit(1).maybeSingle();
      if (existing) {
        await supabase.from("featured_machine").update({
          ...extractedSpotlight,
          updated_at: new Date().toISOString(),
        }).eq("id", existing.id);
      } else {
        await supabase.from("featured_machine").insert([{
          ...extractedSpotlight,
          updated_at: new Date().toISOString(),
        }]);
      }
    } catch (e) {
      console.warn("Supabase featured_machine sync notice:", e);
    }
  };

  const handleSaveSponsors = async (updatedSponsors: SponsorRecord[]) => {
    const deletedSponsors = sponsors.filter((s) => !updatedSponsors.some((u) => u.id === s.id));
    setSponsors(updatedSponsors);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vr_sponsors", JSON.stringify(updatedSponsors));
      } catch {}
    }
    try {
      for (const del of deletedSponsors) {
        if (isValidUUID(del.id)) {
          await supabase.from("sponsors").delete().eq("id", del.id);
        }
      }
      for (const sp of updatedSponsors) {
        await supabase.from("sponsors").upsert(sp);
      }
    } catch (e) {
      console.warn("Supabase sponsors upsert notice:", e);
    }
  };

  // 3. Media Items: Open Modals
  const handleOpenAddMedia = () => {
    setEditingMedia(null);
    setMediaTitle("");
    setMediaType("image");
    setMediaYear(new Date().getFullYear().toString());
    setMediaFeatured(true);
    setMediaFile(null);
    setMediaDirectUrl("");
    setMediaSourceType("upload");
    setShowMediaModal(true);
  };

  const handleOpenEditMedia = (item: MediaItem) => {
    setEditingMedia(item);
    setMediaTitle(item.title);
    setMediaType(item.media_type);
    setMediaYear(item.year);
    setMediaFeatured(item.featured_on_home);
    setMediaFile(null);
    setMediaDirectUrl(item.media_url);
    setMediaSourceType(item.media_url.startsWith("http") ? "url" : "upload");
    setShowMediaModal(true);
  };

  // 3. Media Items: Add or Update Submit
  const handleSaveMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalUrl = editingMedia?.media_url || "";
      if (mediaSourceType === "upload" && mediaFile) {
        finalUrl = await uploadToStorage(mediaFile, "reel-media");
      } else if (mediaSourceType === "url") {
        if (!mediaDirectUrl.trim()) return showError("Please provide a valid photo/video URL.");
        finalUrl = mediaDirectUrl.trim();
      }

      if (!finalUrl && !editingMedia) {
        return showError("Please select a file or enter a media URL.");
      }

      if (editingMedia) {
        const updatedItem: MediaItem = {
          ...editingMedia,
          title: mediaTitle,
          year: mediaYear,
          media_type: mediaType,
          media_url: finalUrl || editingMedia.media_url,
          featured_on_home: mediaFeatured,
        };

        const { error } = await supabase
          .from("media_items")
          .update({
            title: updatedItem.title,
            year: updatedItem.year,
            media_type: updatedItem.media_type,
            media_url: updatedItem.media_url,
            featured_on_home: updatedItem.featured_on_home,
          })
          .eq("id", editingMedia.id);

        if (error) throw error;
        setMediaList(mediaList.map((m) => (m.id === editingMedia.id ? updatedItem : m)));
        setShowMediaModal(false);
        setEditingMedia(null);
        showToast("Media item updated successfully!");
      } else {
        const newItem = {
          title: mediaTitle,
          media_type: mediaType,
          media_url: finalUrl,
          year: mediaYear,
          featured_on_home: mediaFeatured,
          order_index: mediaList.length + 1,
        };

        const { data, error } = await supabase.from("media_items").insert([newItem]).select().single();
        if (error) throw error;

        setMediaList([...mediaList, data]);
        setShowMediaModal(false);
        setMediaTitle("");
        setMediaFile(null);
        setMediaDirectUrl("");
        showToast("Media item added successfully!");
      }
    } catch (err: any) {
      showError(err.message || "Failed to save media item.");
    } finally {
      setUploading(false);
    }
  };

  // 3. Media Items: Delete Confirmation
  const handleDeleteMedia = (item: MediaItem) => {
    setDeleteConfirmMedia(item);
  };

  const handleConfirmDeleteMedia = async () => {
    if (!deleteConfirmMedia) return;
    try {
      if (isValidUUID(deleteConfirmMedia.id)) {
        const { error } = await supabase.from("media_items").delete().eq("id", deleteConfirmMedia.id);
        if (error && error.code !== "22P02" && !error.message?.includes("invalid input syntax")) {
          console.warn("Supabase media delete note:", error.message);
        }
      }
      const updated = mediaList.filter((m) => m.id !== deleteConfirmMedia.id);
      setMediaList(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_media_items", JSON.stringify(updated));
        } catch {}
      }
      showToast("Media item deleted.");
    } catch (err: any) {
      showError(err.message || "Failed to delete item.");
    } finally {
      setDeleteConfirmMedia(null);
    }
  };

  // 4. Alumni: Open Modals
  const handleOpenAddAlumni = () => {
    setEditingAlumni(null);
    setAlumniName("");
    setAlumniBatch("Batch 2024");
    setAlumniFormerRole("");
    setAlumniCompany("");
    setAlumniCurrentRole("");
    setAlumniLinkedin("https://www.linkedin.com/company/veerracerss-electric/");
    setAlumniMentorshipDomain("");
    setAlumniBio("");
    setAlumniFile(null);
    setAlumniDirectUrl("");
    setAlumniPhotoSource("upload");
    setShowAlumniModal(true);
  };

  const handleOpenEditAlumni = (item: AlumniRecord) => {
    setEditingAlumni(item);
    setAlumniName(item.name);
    setAlumniBatch(item.batch);
    setAlumniFormerRole(item.former_role);
    setAlumniCompany(item.current_company);
    setAlumniCurrentRole(item.role_name || item.current_role || "");
    setAlumniLinkedin(item.linkedin_url);
    setAlumniMentorshipDomain(item.mentorship_domain);
    setAlumniBio(item.bio || "");
    setAlumniFile(null);
    setAlumniDirectUrl(item.image_url);
    setAlumniPhotoSource(item.image_url.startsWith("http") ? "url" : "upload");
    setShowAlumniModal(true);
  };

  // 4. Alumni: Add or Update Submit
  const handleSaveAlumniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imgUrl = editingAlumni?.image_url || "/alumni/default-alumni.jpg";
      if (alumniPhotoSource === "upload" && alumniFile) {
        imgUrl = await uploadToStorage(alumniFile, "alumni-images");
      } else if (alumniPhotoSource === "url" && alumniDirectUrl.trim()) {
        imgUrl = alumniDirectUrl.trim();
      }

      const roleVal = alumniCurrentRole;

      if (editingAlumni) {
        const updatePayload: any = {
          name: alumniName,
          batch: alumniBatch,
          former_role: alumniFormerRole,
          current_company: alumniCompany,
          role_name: roleVal,
          image_url: imgUrl,
          linkedin_url: alumniLinkedin,
          mentorship_domain: alumniMentorshipDomain,
          bio: alumniBio,
        };

        let { error } = await supabase
          .from("alumni")
          .update(updatePayload)
          .eq("id", editingAlumni.id);

        if (error && error.message?.includes("column \"role_name\" does not exist")) {
          delete updatePayload.role_name;
          updatePayload.current_role = roleVal;
          const res = await supabase.from("alumni").update(updatePayload).eq("id", editingAlumni.id);
          error = res.error;
        }

        if (error) throw error;

        const updatedItem: AlumniRecord = {
          ...editingAlumni,
          ...updatePayload,
          role_name: roleVal,
          current_role: roleVal,
        };

        setAlumniList(alumniList.map((a) => (a.id === editingAlumni.id ? updatedItem : a)));
        setShowAlumniModal(false);
        setEditingAlumni(null);
        showToast("Alumni profile updated successfully!");
      } else {
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
          order_index: alumniList.length + 1,
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
        setShowAlumniModal(false);
        setAlumniName("");
        setAlumniFormerRole("");
        setAlumniCompany("");
        setAlumniCurrentRole("");
        setAlumniMentorshipDomain("");
        setAlumniBio("");
        setAlumniFile(null);
        setAlumniDirectUrl("");
        showToast("Alumni profile added successfully!");
      }
    } catch (err: any) {
      showError(err.message || "Failed to save alumni profile.");
    } finally {
      setUploading(false);
    }
  };

  // 4. Alumni: Delete Confirmation
  const handleDeleteAlumni = (alumnus: AlumniRecord) => {
    setDeleteConfirmAlumni(alumnus);
  };

  const handleConfirmDeleteAlumni = async () => {
    if (!deleteConfirmAlumni) return;
    try {
      if (isValidUUID(deleteConfirmAlumni.id)) {
        const { error } = await supabase.from("alumni").delete().eq("id", deleteConfirmAlumni.id);
        if (error && error.code !== "22P02" && !error.message?.includes("invalid input syntax")) {
          console.warn("Supabase alumni delete note:", error.message);
        }
      }
      const updated = alumniList.filter((a) => a.id !== deleteConfirmAlumni.id);
      setAlumniList(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_alumni_records", JSON.stringify(updated));
        } catch {}
      }
      showToast("Alumni profile deleted.");
    } catch (err: any) {
      showError(err.message || "Failed to delete alumni.");
    } finally {
      setDeleteConfirmAlumni(null);
    }
  };

  // 5. Member: Add
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFile) return showError("Please select a profile picture.");
    setUploading(true);
    try {
      const imgUrl = await uploadToStorage(memberFile, "member-images", "domain-members");
      const newMemberPayload: any = {
        name: memberName,
        role: memberRole,
        department: memberDepartment,
        image_url: imgUrl,
        linkedin: memberLinkedin || "#",
        instagram: memberInstagram || "#",
        year_of_study: memberYearOfStudy,
        academic_branch: memberBranch,
        blood_group: memberBloodGroup,
        phone: memberPhone,
        phone_number: memberPhone,
        pr_domain_skills: memberPrSkills,
        joining_year: new Date().getFullYear().toString(),
      };

      let { error } = await supabase.from("members").insert([newMemberPayload]);
      if (error && (error.message?.includes("phone_number") || error.code === "PGRST204")) {
        // Fallback for live database schema which defines column 'phone'
        delete newMemberPayload.phone_number;
        const retryRes = await supabase.from("members").insert([newMemberPayload]);
        error = retryRes.error;
      }
      if (error && error.message?.includes("column")) {
        // Fallback without extended fields if table not altered yet
        const simplePayload = {
          name: memberName,
          role: memberRole,
          department: memberDepartment,
          image_url: imgUrl,
          linkedin: memberLinkedin || "#",
          instagram: memberInstagram || "#",
        };
        const res = await supabase.from("members").insert([simplePayload]);
        error = res.error;
      }
      if (error) throw error;

      setMemberName("");
      setMemberRole("");
      setMemberPhone("");
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

  // 5. Member: Delete (Soft check modal)
  const handleDeleteMember = (member: MemberRecord) => {
    setDeleteConfirmMember(member);
  };

  const handleConfirmDeleteMember = async () => {
    if (!deleteConfirmMember) return;
    try {
      if (isValidUUID(deleteConfirmMember.id)) {
        const { error } = await supabase.from("members").delete().eq("id", deleteConfirmMember.id);
        if (error && error.code !== "22P02" && !error.message?.includes("invalid input syntax")) {
          console.warn("Supabase member delete note:", error.message);
        }
      }
      const updated = members.filter((m) => m.id !== deleteConfirmMember.id);
      setMembers(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_members", JSON.stringify(updated));
        } catch {}
      }
      showToast(`Member "${deleteConfirmMember.name}" removed.`);
    } catch (err: any) {
      showError(err.message || "Failed to delete member.");
    } finally {
      setDeleteConfirmMember(null);
    }
  };

  // 5. Member: Save Datasheet
  const handleSaveMemberDatasheet = async (updated: MemberRecord) => {
    try {
      let { error } = await supabase
        .from("members")
        .update({
          name: updated.name,
          role: updated.role,
          department: updated.department,
          year_of_study: updated.year_of_study,
          academic_branch: updated.academic_branch,
          blood_group: updated.blood_group,
          phone: updated.phone,
          pr_domain_skills: updated.pr_domain_skills,
          joining_year: updated.joining_year,
          linkedin: updated.linkedin,
        })
        .eq("id", updated.id);

      if (error && error.message?.includes("column")) {
        const { error: basicErr } = await supabase
          .from("members")
          .update({
            name: updated.name,
            role: updated.role,
            department: updated.department,
            linkedin: updated.linkedin,
          })
          .eq("id", updated.id);
        if (basicErr) throw basicErr;
      } else if (error) {
        throw error;
      }

      const updatedList = members.map((m) => (m.id === updated.id ? updated : m));
      setMembers(updatedList);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_members", JSON.stringify(updatedList));
        } catch {}
      }
      showToast(`Datasheet for ${updated.name} updated successfully!`);
    } catch (err: any) {
      showError(err.message || "Failed to update member datasheet.");
    }
  };

  // 5. Member: 1-Click Annual Batch Progression
  const handleExecuteProgression = async () => {
    try {
      const gradYear = new Date().getFullYear();
      const fourthYears = members.filter(
        (m) =>
          (m.year_of_study || "").includes("4th") ||
          (m.year || "").includes("4th") ||
          ((m.year || "").includes("Final") && !(m.year || "").includes("Pre-Final"))
      );

      // Duplicate prevention: track existing alumni names
      const existingAlumniNames = new Set(alumniList.map((a) => a.name.trim().toLowerCase()));
      try {
        const { data: dbAlumni } = await supabase.from("alumni").select("name");
        if (dbAlumni) {
          dbAlumni.forEach((a: any) => {
            if (a.name) existingAlumniNames.add(a.name.trim().toLowerCase());
          });
        }
      } catch {}

      // 1. Prepare batch alumni payloads for non-duplicate 4th years
      const toMigrate = fourthYears.filter((m) => !existingAlumniNames.has(m.name.trim().toLowerCase()));
      const alumniPayloads = toMigrate.map((m, idx) => ({
        name: m.name,
        batch: `Batch ${gradYear}`,
        former_role: m.role || "Club Engineer",
        current_company: "VSSUT Burla / Graduate Placement",
        role_name: "Graduate Engineer",
        image_url: m.image_url || "/members/default-avatar.png",
        linkedin_url: m.linkedin || "https://www.linkedin.com/company/veerracerss-electric/",
        mentorship_domain: m.department || "Vehicle Engineering",
        bio: `Graduated former ${m.role} of VeerRacerss Electric (${m.department}). Mentoring new recruits for Formula Student competitions.`,
        order_index: alumniList.length + idx + 1,
      }));

      let insertSuccess = true;
      if (alumniPayloads.length > 0) {
        let { error: alErr } = await supabase.from("alumni").insert(alumniPayloads);
        if (alErr && (alErr.message?.includes("role_name") || alErr.message?.includes("current_role"))) {
          const fallbackPayloads = alumniPayloads.map((p) => {
            const fb: any = { ...p };
            delete fb.role_name;
            fb.current_role = "Graduate Engineer";
            return fb;
          });
          const { error: fbErr } = await supabase.from("alumni").insert(fallbackPayloads);
          if (fbErr) {
            insertSuccess = false;
            console.error("Batch alumni fallback insert failed:", fbErr);
          }
        } else if (alErr) {
          insertSuccess = false;
          console.error("Batch alumni insert failed:", alErr);
        }
      }

      // Batch delete graduated 4th years from active members
      if (insertSuccess && fourthYears.length > 0) {
        const fourthYearIds = fourthYears.map((m) => m.id);
        const { error: delErr } = await supabase.from("members").delete().in("id", fourthYearIds);
        if (delErr) {
          console.error("Batch delete graduated members failed:", delErr);
        }
      } else if (!insertSuccess) {
        showError("Could not batch transfer some members to Alumni. Graduated records retained in members table.");
      }

      // 2. Batch increment active lower year students (in parallel cohorts)
      const thirdYearIds: string[] = [];
      const secondYearIds: string[] = [];
      const firstYearIds: string[] = [];

      for (const m of members) {
        if (fourthYears.some((f) => f.id === m.id)) continue;
        const currentY = m.year_of_study || m.year || "";
        if (currentY.includes("3rd") || currentY.includes("Pre-Final")) {
          thirdYearIds.push(m.id);
        } else if (currentY.includes("2nd")) {
          secondYearIds.push(m.id);
        } else if (currentY.includes("1st")) {
          firstYearIds.push(m.id);
        }
      }

      const updateBatchPromises: Promise<any>[] = [];
      if (thirdYearIds.length > 0) {
        updateBatchPromises.push(
          Promise.resolve(
            supabase
              .from("members")
              .update({
                year_of_study: "4th Year",
                year: "Final Year (4th Year)",
              })
              .in("id", thirdYearIds)
          )
        );
      }
      if (secondYearIds.length > 0) {
        updateBatchPromises.push(
          Promise.resolve(
            supabase
              .from("members")
              .update({
                year_of_study: "3rd Year",
                year: "3rd Year (Pre-Final)",
              })
              .in("id", secondYearIds)
          )
        );
      }
      if (firstYearIds.length > 0) {
        updateBatchPromises.push(
          Promise.resolve(
            supabase
              .from("members")
              .update({
                year_of_study: "2nd Year",
                year: "2nd Year",
              })
              .in("id", firstYearIds)
          )
        );
      }

      if (updateBatchPromises.length > 0) {
        await Promise.all(updateBatchPromises);
      }

      await fetchAllData();
      setShowProgressionModal(false);
      showToast(
        `Annual progression complete! ${fourthYears.length} members graduated to Alumni, active squads promoted.`
      );
    } catch (err: any) {
      showError(err.message || "Failed to execute batch progression.");
    }
  };

  // 5. Member: Export Squad to Excel
  const handleExportMembersExcel = () => {
    if (members.length === 0) return showError("No members in roster to export.");
    exportTableToExcel(
      members.map((m) => ({
        "Full Name": m.name,
        "Club Role": m.role,
        "Domain / Department": m.department,
        "Year of Study": m.year_of_study || "3rd Year",
        "Academic Branch": m.academic_branch || "Mechanical Engineering",
        "Blood Group": m.blood_group || "O+",
        "Phone (WhatsApp)": m.phone || "N/A",
        "PR Specialization": m.pr_domain_skills || "None",
        "Joining Year": m.joining_year || "2023",
        "LinkedIn": m.linkedin || "N/A",
      })),
      "veerracerss-active-squad-datasheet",
      "Active Members"
    );
  };

  // Master: Export All Databases to One Multi-Sheet Excel Workbook
  const handleExportMasterBackup = () => {
    const sheets: Array<{ sheetName: string; data: Record<string, any>[] }> = [
      {
        sheetName: "Active Squad",
        data: members.map((m) => ({
          Name: m.name,
          Role: m.role,
          Department: m.department,
          "Year of Study": m.year_of_study || "3rd Year",
          Branch: m.academic_branch || "",
          "Blood Group": m.blood_group || "",
          Phone: m.phone || "",
          "PR Specialization": m.pr_domain_skills || "None",
        })),
      },
      {
        sheetName: "Alumni Directory",
        data: alumniList.map((a) => ({
          Name: a.name,
          Batch: a.batch,
          "Former Role": a.former_role,
          "Current Company": a.current_company,
          "Role Name": a.role_name || a.current_role,
          "Mentorship Domain": a.mentorship_domain,
          LinkedIn: a.linkedin_url,
        })),
      },
      {
        sheetName: "Expenses & Bills",
        data: expenses.map((e) => ({
          Item: e.title,
          Category: e.category,
          "Amount (INR)": e.amount,
          Vendor: e.vendor || "",
          Date: e.expense_date,
          "Paid By": e.paid_by || "",
          Notes: e.notes || "",
        })),
      },
      {
        sheetName: "Recruitment Applications",
        data: recruits.map((r) => ({
          Name: r.full_name,
          Email: r.email,
          Phone: r.phone,
          "Roll No": r.roll_no,
          Branch: r.branch,
          "Year of Study": r.year_of_study,
          "Primary Domain": r.primary_domain,
          "Secondary Domain": r.secondary_domain || "",
          Status: r.status,
          Score: r.interview_score || "",
        })),
      },
      {
        sheetName: "CMS & Telemetry Settings",
        data: [
          { Setting: "Hero Headline", Value: siteSettings.hero_title || DEFAULT_SITE_SETTINGS.hero_title },
          { Setting: "Hero Subtitle Narrative", Value: siteSettings.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle },
          { Setting: "Top Announcement Badge", Value: siteSettings.announcement_badge_text || DEFAULT_SITE_SETTINGS.announcement_badge_text },
          { Setting: "Announcement Enabled", Value: siteSettings.announcement_badge_enabled ? "Yes" : "No" },
          { Setting: "Recruitment CTA Label", Value: siteSettings.recruitment_cta_label || DEFAULT_SITE_SETTINGS.recruitment_cta_label },
          { Setting: "Recruitment CTA URL", Value: siteSettings.recruitment_cta_url || DEFAULT_SITE_SETTINGS.recruitment_cta_url },
          { Setting: "Recruitment Open Status", Value: siteSettings.recruitment_open !== false ? "Open" : "Closed" },
          { Setting: "Recruitment Form Title", Value: siteSettings.recruitment_form_title || DEFAULT_SITE_SETTINGS.recruitment_form_title },
          { Setting: "Recruitment Deadline", Value: siteSettings.recruitment_form_deadline || DEFAULT_SITE_SETTINGS.recruitment_form_deadline },
          { Setting: "WhatsApp Community Link", Value: siteSettings.whatsapp_recruit_link || DEFAULT_SITE_SETTINGS.whatsapp_recruit_link },
          { Setting: "Official Contact Email", Value: siteSettings.contact_email || DEFAULT_SITE_SETTINGS.contact_email },
          { Setting: "About Section Headline", Value: siteSettings.about_title || DEFAULT_SITE_SETTINGS.about_title },
          { Setting: "About Section Subtitle", Value: siteSettings.about_subtitle || DEFAULT_SITE_SETTINGS.about_subtitle },
          { Setting: "About Section Image URL", Value: siteSettings.about_image_url || DEFAULT_SITE_SETTINGS.about_image_url },
          { Setting: "About Section Description", Value: siteSettings.about_description || DEFAULT_SITE_SETTINGS.about_description },
          ...(siteSettings.telemetry_stats || DEFAULT_SITE_SETTINGS.telemetry_stats || []).map((t, idx) => ({
            Setting: `Telemetry Metric #${idx + 1} (${t.label})`,
            Value: `${t.stat} ${t.unit} - ${t.detail}`,
          })),
          { Setting: "Backup Generated At", Value: new Date().toISOString() },
        ],
      },
    ];

    // Include all custom databases as individual worksheets
    const usedSheetNames = new Set(sheets.map((s) => s.sheetName.toLowerCase()));
    customDbs.forEach((db, i) => {
      const dbRows = (db.records || []).map((row) => {
        const cleanRow: Record<string, any> = {};
        (db.schema_definition || []).forEach((col) => {
          cleanRow[col.label] = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : "";
        });
        return cleanRow;
      });

      let safeSheetName = (db.db_name || `Custom DB ${i + 1}`)
        .replace(/[\\/?*:[\]]/g, "")
        .trim()
        .substring(0, 31) || `Custom DB ${i + 1}`;

      if (usedSheetNames.has(safeSheetName.toLowerCase())) {
        safeSheetName = safeSheetName.substring(0, 27) + ` (${i + 1})`;
      }
      usedSheetNames.add(safeSheetName.toLowerCase());

      sheets.push({
        sheetName: safeSheetName,
        data: dbRows,
      });
    });

    exportMultiSheetExcel(sheets, "veerracerss-master-club-backup");
  };

  // 6. Expenses Handlers
  const handleAddExpense = async (newExp: Omit<ClubExpense, "id" | "created_at">, receiptFile: File | null) => {
    setUploading(true);
    try {
      let receiptUrl = "";
      if (receiptFile) {
        try {
          receiptUrl = await uploadToStorage(receiptFile, "expenses-receipts");
        } catch {
          try {
            receiptUrl = await uploadToStorage(receiptFile, "member-images", "bills-receipts");
          } catch {
            // If storage bucket isn't created yet, continue with empty receipt
          }
        }
      }

      const payload = { ...newExp, receipt_url: receiptUrl };
      let savedRecord: ClubExpense;
      try {
        const { data, error } = await supabase.from("club_expenses").insert([payload]).select().single();
        if (error) throw error;
        savedRecord = data;
      } catch (dbErr: any) {
        console.warn("Supabase club_expenses insert fallback to local:", dbErr.message);
        savedRecord = {
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString()
        };
      }

      const updated = [savedRecord, ...expenses];
      setExpenses(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_club_expenses", JSON.stringify(updated));
        } catch {}
      }
      showToast("Expense voucher recorded successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to log expense voucher. Ensure supabase-operations-setup.sql is executed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteExpense = async (id: string, title: string) => {
    if (!confirm(`Delete expense record "${title}"?`)) return;
    try {
      if (isValidUUID(id)) {
        const { error } = await supabase.from("club_expenses").delete().eq("id", id);
        if (error && error.code !== "22P02" && !error.message?.includes("invalid input syntax")) {
          console.warn("Supabase expense delete note:", error.message);
        }
      }
      const updated = expenses.filter((e) => e.id !== id);
      setExpenses(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_club_expenses", JSON.stringify(updated));
        } catch {}
      }
      showToast("Expense voucher deleted.");
    } catch (err: any) {
      showError(err.message || "Failed to delete expense.");
    }
  };

  const handleUpdateExpenseStatus = async (id: string, newStatus: string) => {
    try {
      if (isValidUUID(id)) {
        await supabase.from("club_expenses").update({ status: newStatus }).eq("id", id);
      }
      const updated = expenses.map((e) => (e.id === id ? { ...e, status: newStatus } : e));
      setExpenses(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_club_expenses", JSON.stringify(updated));
        } catch {}
      }
      showToast("Status updated.");
    } catch (err: any) {
      showError(err.message || "Failed to update status.");
    }
  };

  // 7. Recruitment Handlers
  const handleUpdateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("vr_site_settings_extended");
          const existingLocal = raw ? JSON.parse(raw) : {};
          localStorage.setItem("vr_site_settings_extended", JSON.stringify({ ...existingLocal, ...newSettings }));
        } catch {}
      }
      const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
      if (existing) {
        await supabase.from("site_settings").update(newSettings).eq("id", existing.id);
      }
      setSiteSettings((prev) => ({ ...prev, ...newSettings }));
      showToast("Settings updated!");
    } catch (err: any) {
      showError(err.message || "Failed to update settings.");
    }
  };

  const handleUpdateRecruitStatus = async (
    id: string,
    newStatus: "Pending" | "Shortlisted" | "Accepted" | "Declined",
    onboardingEmailSent?: boolean
  ) => {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        const { data: existing } = await supabase
          .from("recruitment_applications")
          .select("id")
          .eq("id", id)
          .maybeSingle();

        if (existing) {
          const updatePayload: Record<string, any> = { status: newStatus };
          if (onboardingEmailSent !== undefined) {
            updatePayload.onboarding_email_sent = onboardingEmailSent;
          }
          const { error } = await supabase.from("recruitment_applications").update(updatePayload).eq("id", id);
          if (error && error.code !== "22P02") {
            throw error;
          }
        }
      }

      setRecruits((prev) => {
        const next = prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: newStatus,
                ...(onboardingEmailSent !== undefined ? { onboarding_email_sent: onboardingEmailSent } : {}),
              }
            : r
        );
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("vr_recruitment_applications", JSON.stringify(next));
          } catch {}
        }
        return next;
      });
      showToast(`Applicant marked as ${newStatus}.`);
    } catch (err: any) {
      showError(err.message || "Failed to update candidate status.");
    }
  };

  const handleUpdateRecruitScore = async (id: string, score: string) => {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        const { data: existing } = await supabase
          .from("recruitment_applications")
          .select("id")
          .eq("id", id)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase.from("recruitment_applications").update({ interview_score: score }).eq("id", id);
          if (error && error.code !== "22P02") {
            throw error;
          }
        }
      }
      setRecruits((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, interview_score: score } : r));
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("vr_recruitment_applications", JSON.stringify(next));
          } catch {}
        }
        return next;
      });
      showToast("Candidate evaluation score updated.");
    } catch (err: any) {
      showError(err.message || "Failed to update review score.");
      throw err;
    }
  };

  const handleDeleteApplication = async (id: string, name: string) => {
    if (!confirm(`Delete application for "${name}"?`)) return;
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        const { data: existing } = await supabase
          .from("recruitment_applications")
          .select("id")
          .eq("id", id)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase.from("recruitment_applications").delete().eq("id", id);
          if (error && error.code !== "22P02") {
            throw error;
          }
        }
      }
      setRecruits((prev) => {
        const next = prev.filter((r) => r.id !== id);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("vr_recruitment_applications", JSON.stringify(next));
          } catch {}
        }
        return next;
      });
      showToast("Application deleted.");
    } catch (err: any) {
      showError(err.message || "Failed to delete application.");
    }
  };

  // 8. Custom Databases Handlers
  const handleCreateDatabase = async (newDb: Omit<CustomDatabaseRecord, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase.from("custom_databases").insert([newDb]).select().single();
      if (error) throw error;
      const updated = [...customDbs, data];
      setCustomDbs(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_custom_databases", JSON.stringify(updated));
        } catch {}
      }
      showToast(`Database "${newDb.db_name}" created!`);
    } catch (err: any) {
      showError(err.message || "Failed to create database. Ensure supabase-operations-setup.sql is executed.");
    }
  };

  const handleDeleteDatabase = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete entire database "${name}" and all its records?`)) return;
    try {
      if (isValidUUID(id)) {
        const { error } = await supabase.from("custom_databases").delete().eq("id", id);
        if (error && error.code !== "22P02" && !error.message?.includes("invalid input syntax")) {
          console.warn("Supabase db delete note:", error.message);
        }
      }
      const updated = customDbs.filter((db) => db.id !== id);
      setCustomDbs(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_custom_databases", JSON.stringify(updated));
        } catch {}
      }
      showToast(`Database "${name}" deleted.`);
    } catch (err: any) {
      showError(err.message || "Failed to delete database.");
    }
  };

  const handleAddCustomDbRecord = async (dbId: string, record: Record<string, any>) => {
    try {
      const targetDb = customDbs.find((db) => db.id === dbId);
      if (!targetDb) return;
      const updatedRecords = [...(targetDb.records || []), record];
      if (isValidUUID(dbId)) {
        const { error } = await supabase
          .from("custom_databases")
          .update({ records: updatedRecords, updated_at: new Date().toISOString() })
          .eq("id", dbId);
        if (error && error.code !== "22P02" && !error.message?.includes("invalid input syntax")) {
          console.warn("Supabase update db records note:", error.message);
        }
      }

      const updated = customDbs.map((db) => (db.id === dbId ? { ...db, records: updatedRecords } : db));
      setCustomDbs(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_custom_databases", JSON.stringify(updated));
        } catch {}
      }
      showToast("Record added to database.");
    } catch (err: any) {
      showError(err.message || "Failed to add record.");
    }
  };

  const handleDeleteCustomDbRecord = async (dbId: string, recordId: string) => {
    try {
      const targetDb = customDbs.find((db) => db.id === dbId);
      if (!targetDb) return;
      const updatedRecords = (targetDb.records || []).filter((r) => r.id !== recordId);
      if (isValidUUID(dbId)) {
        const { error } = await supabase
          .from("custom_databases")
          .update({ records: updatedRecords, updated_at: new Date().toISOString() })
          .eq("id", dbId);
        if (error && error.code !== "22P02" && !error.message?.includes("invalid input syntax")) {
          console.warn("Supabase delete db record note:", error.message);
        }
      }

      const updated = customDbs.map((db) => (db.id === dbId ? { ...db, records: updatedRecords } : db));
      setCustomDbs(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_custom_databases", JSON.stringify(updated));
        } catch {}
      }
      showToast("Record deleted.");
    } catch (err: any) {
      showError(err.message || "Failed to delete record.");
    }
  };

  const handleUpdateCustomDbRecord = async (dbId: string, recordId: string, updatedRecord: Record<string, any>) => {
    try {
      const targetDb = customDbs.find((db) => db.id === dbId);
      if (!targetDb) return;
      const updatedRecords = (targetDb.records || []).map((r) =>
        r.id === recordId ? { ...r, ...updatedRecord, id: recordId } : r
      );
      if (isValidUUID(dbId)) {
        const { error } = await supabase
          .from("custom_databases")
          .update({ records: updatedRecords, updated_at: new Date().toISOString() })
          .eq("id", dbId);
        if (error && error.code !== "22P02" && !error.message?.includes("invalid input syntax")) {
          console.warn("Supabase update db record note:", error.message);
        }
      }

      const updated = customDbs.map((db) => (db.id === dbId ? { ...db, records: updatedRecords } : db));
      setCustomDbs(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vr_custom_databases", JSON.stringify(updated));
        } catch {}
      }
      showToast("Record updated successfully!");
    } catch (err: any) {
      showError(err.message || "Failed to update record.");
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

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowSecurityModal(true)}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3.5 py-2 transition-colors uppercase tracking-wider"
              title="Update admin password with email OTP verification"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Security</span>
            </button>

            <button
              onClick={handleExportMasterBackup}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 transition-colors uppercase tracking-wider"
              title="Download entire club database (Members, Alumni, Expenses, Recruits) into a single multi-sheet Excel file"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Master Backup (.xlsx)</span>
            </button>

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

        {/* Section Tabs - Responsive Horizontal Scrollable Bar on Mobile, Clean Grid on Desktop */}
        <div className="flex overflow-x-auto no-scrollbar scroll-smooth gap-2 pb-3 mb-8 border-b border-white/10 sm:flex-wrap items-center">
          <button
            onClick={() => setActiveTab("hero")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "hero" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Hero & Announcement</span>
          </button>

          <button
            onClick={() => setActiveTab("vehicles")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "vehicles" || activeTab === "machine" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Fleet & Spotlight ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("sponsors")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "sponsors" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Sponsors ({sponsors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "media" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Track Moments ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("alumni")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "alumni" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Alumni ({alumniList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "members" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Squad & Datasheets ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("expenses")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "expenses" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Costs & Bills ({expenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("recruitment")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "recruitment" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
            title={`${recruits.filter((r) => r.status !== "Accepted" && r.status !== "Declined").length} pending review • ${recruits.length} total applications`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Recruitment ({recruits.filter((r) => r.status !== "Accepted" && r.status !== "Declined").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("custom_dbs")}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "custom_dbs" ? "bg-racing-red text-white shadow-md" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Custom DBs ({customDbs.length})</span>
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
              {/* Dynamic Hero Headline & Subtitle (F07 / D-05) */}
              <div className="bg-black/40 border border-white/10 p-4 sm:p-5 space-y-4">
                <span className="text-xs font-mono uppercase text-white/70 tracking-wider block font-bold">
                  Hero Headline & Description
                </span>
                <div>
                  <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Hero Headline / Title</label>
                  <input
                    type="text"
                    required
                    value={siteSettings.hero_title || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
                    placeholder="e.g. VEERRACERSS ELECTRIC"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                  <span className="text-[10px] text-white/40 block mt-1 font-mono">
                    Note: The word &quot;ELECTRIC&quot; or line breaks will automatically receive signature red styling.
                  </span>
                </div>
                <div>
                  <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Hero Subtitle Narrative</label>
                  <textarea
                    required
                    rows={3}
                    value={siteSettings.hero_subtitle || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                    placeholder="e.g. Odisha’s Premier Formula Student EV Racing Team | VSSUT Burla • Est. 2018..."
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                  />
                </div>
              </div>

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

              {/* "Who We Are" Section: Team Photo, Headline & Narrative */}
              <div className="bg-black/40 border border-white/10 p-4 sm:p-5 space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
                    <label className="text-sm font-bold uppercase text-white tracking-wider">
                      Homepage &quot;Who We Are&quot; Story & Photo
                    </label>
                  </div>
                  <p className="text-[11px] text-white/50 mt-1">
                    Manage the main team introduction photo, subtitle bar, and mission narrative beneath the hero section.
                  </p>
                </div>

                {/* Dimension Recommendation Alert */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold shrink-0">ℹ RECOMMENDED DIMENSIONS:</span>
                  <span>
                    <strong>800 × 1000 px</strong> (4:5 or 3:4 portrait ratio), max 2MB (WebP or JPG recommended). High-res team photos with the formula car yield the best visual framing.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Section Headline / Title</label>
                    <input
                      type="text"
                      value={siteSettings.about_title || "WHO WE ARE"}
                      onChange={(e) => setSiteSettings({ ...siteSettings, about_title: e.target.value })}
                      placeholder="e.g. WHO WE ARE"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Subtitle / Tagline Bar</label>
                    <input
                      type="text"
                      value={siteSettings.about_subtitle || "THE OFFICIAL STUDENT FORMULA RACING CLUB"}
                      onChange={(e) => setSiteSettings({ ...siteSettings, about_subtitle: e.target.value })}
                      placeholder="e.g. THE OFFICIAL STUDENT FORMULA RACING CLUB"
                      className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-white/50 mb-1 block font-mono">About Narrative Description</label>
                  <textarea
                    rows={4}
                    value={siteSettings.about_description || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, about_description: e.target.value })}
                    placeholder="Describe the club mission, electric car fabrication, and engineering achievements..."
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase text-white/50 mb-2 block font-mono">Team Photo</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative w-36 aspect-[3/4] bg-black/60 border border-white/20 shrink-0 overflow-hidden flex items-center justify-center">
                      {siteSettings.about_image_url ? (
                        <img
                          src={siteSettings.about_image_url}
                          alt="Who We Are Preview"
                          className="w-full h-full object-cover object-bottom"
                        />
                      ) : (
                        <span className="text-[10px] text-white/40 font-mono text-center p-2">No photo assigned</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <div>
                        <span className="text-[11px] text-white/60 block mb-1 font-mono">Option A: Upload New Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingAboutImg}
                          onChange={handleAboutImageUpload}
                          className="text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-mono file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                        />
                        {uploadingAboutImg && (
                          <span className="text-xs text-racing-red font-mono block mt-1 animate-pulse">Uploading photo to storage...</span>
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] text-white/60 block mb-1 font-mono">Option B: Direct Image URL or Relative Path</span>
                        <input
                          type="text"
                          value={siteSettings.about_image_url || ""}
                          onChange={(e) => setSiteSettings({ ...siteSettings, about_image_url: e.target.value })}
                          placeholder="e.g. /team/who-we-are.jpg or https://..."
                          className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Homepage Dynamic Telemetry Ticker (5 Metrics) */}
              <div className="bg-black/40 border border-white/10 p-4 sm:p-5 space-y-4">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold uppercase text-white tracking-wider block">
                      Homepage Dynamic Telemetry Ticker (5 Benchmarks)
                    </label>
                    <span className="text-[11px] text-white/50">
                      These 5 cards form the signature telemetry strip beneath the hero section. Update any benchmark in real-time.
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-racing-red border border-racing-red/30 px-2.5 py-1 bg-racing-red/10">
                    5 Active Cards
                  </span>
                </div>

                <div className="space-y-3">
                  {(siteSettings.telemetry_stats || DEFAULT_SITE_SETTINGS.telemetry_stats || []).map((card, idx) => (
                    <div key={idx} className="bg-[#111115] border border-white/10 p-3 sm:p-4 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold text-racing-red uppercase tracking-wider">
                          Metric #{idx + 1}
                        </span>
                        <div className="text-[10px] font-mono text-white/40">
                          Preview: <span className="text-white font-bold">{card.stat} {card.unit}</span> • {card.label}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="text-[10px] uppercase text-white/50 mb-1 block font-mono">Value (e.g. P3, AIR 1, 55+)</label>
                          <input
                            type="text"
                            value={card.stat}
                            onChange={(e) => handleUpdateTelemetryCard(idx, "stat", e.target.value)}
                            className="w-full bg-black/60 border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-white/50 mb-1 block font-mono">Unit / Badge (e.g. OVERALL, TROPHY)</label>
                          <input
                            type="text"
                            value={card.unit}
                            onChange={(e) => handleUpdateTelemetryCard(idx, "unit", e.target.value)}
                            className="w-full bg-black/60 border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-white/50 mb-1 block font-mono">Headline / Metric Name</label>
                          <input
                            type="text"
                            value={card.label}
                            onChange={(e) => handleUpdateTelemetryCard(idx, "label", e.target.value)}
                            className="w-full bg-black/60 border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-white/50 mb-1 block font-mono">Sub-detail / Citation</label>
                        <input
                          type="text"
                          value={card.detail}
                          onChange={(e) => handleUpdateTelemetryCard(idx, "detail", e.target.value)}
                          placeholder="e.g. Formula Imperial EV at Buddh International Circuit"
                          className="w-full bg-black/60 border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
            TAB 2: FLEET VEHICLES & AUTOMATIC HOMEPAGE SPOTLIGHT SYNC
        ========================================================================= */}
        {(activeTab === "vehicles" || activeTab === "machine") && (
          <VehiclesTab
            vehicles={vehicles}
            onSaveVehicles={handleSaveVehicles}
            onUploadImage={(file) => uploadToStorage(file, "member-images", "cars")}
            showToast={showToast}
            showError={showError}
          />
        )}

        {/* =========================================================================
            TAB 3: SPONSORS & CORPORATE PARTNERS
        ========================================================================= */}
        {activeTab === "sponsors" && (
          <SponsorsTab
            sponsors={sponsors}
            onSaveSponsors={handleSaveSponsors}
            onUploadImage={(file) => uploadToStorage(file, "member-images", "sponsors")}
            showToast={showToast}
            showError={showError}
          />
        )}

        {/* =========================================================================
            TAB 3: TRACK MOMENTS & GALLERY (ADD / EDIT / REMOVE BUTTONS)
        ========================================================================= */}
        {/* =========================================================================
            TAB 3: TRACK MOMENTS & GALLERY (ADD / EDIT / REMOVE MODALS & CONFIRMATIONS)
        ========================================================================= */}
        {activeTab === "media" && (
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase font-display text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-racing-red" />
                  <span>Track Footage & Gallery ({mediaList.length})</span>
                </h3>
                <p className="text-white/50 text-xs mt-1 font-light">
                  Homepage Reel & Yearwise Archive • Photos, dynamic loop clips, and track milestones.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddMedia}
                className="shrink-0 bg-racing-red hover:bg-white hover:text-black text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(210,39,48,0.35)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Track Moment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        onClick={() => handleOpenEditMedia(item)}
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
        )}

        {/* =========================================================================
            TAB 4: ALUMNI NETWORK (ADD / EDIT / REMOVE MODALS & CONFIRMATIONS)
        ========================================================================= */}
        {activeTab === "alumni" && (
          <div className="bg-[#0b0c10] border border-white/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase font-display text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-racing-red" />
                  <span>Alumni Profiles ({alumniList.length})</span>
                </h3>
                <p className="text-white/50 text-xs mt-1 font-light">
                  Graduated engineers, mentorship domains, and current industry engineering placements.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/alumni"
                  target="_blank"
                  className="text-[11px] font-mono text-racing-red hover:underline uppercase flex items-center gap-1"
                >
                  <span>View Public Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={handleOpenAddAlumni}
                  className="bg-racing-red hover:bg-white hover:text-black text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(210,39,48,0.35)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Alumnus</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      onClick={() => handleOpenEditAlumni(alumnus)}
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
        )}

        {/* =========================================================================
            ADD / EDIT MEDIA MODAL (F09)
        ========================================================================= */}
        {showMediaModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => {
              setShowMediaModal(false);
              setEditingMedia(null);
            }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div
              className="bg-[#0e0f15] border border-white/15 w-full max-w-lg max-h-[88vh] flex flex-col relative shadow-2xl overflow-hidden rounded-none"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-racing-red" />
                  <span>{editingMedia ? "Edit Track Moment" : "Add Track Moment"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaModal(false);
                    setEditingMedia(null);
                  }}
                  className="text-white/40 hover:text-white p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMediaSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
                <div>
                  <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Title / Caption</label>
                  <input
                    type="text"
                    required
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="e.g. AETHER Track Run at Formula Imperial"
                    className="w-full bg-[#15161c] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Media Type</label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value as any)}
                      className="w-full bg-[#15161c] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    >
                      <option value="image">Photo (.jpg, .png, .webp)</option>
                      <option value="video">Short Video (.mp4, .webm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block font-mono">Year Tag</label>
                    <input
                      type="text"
                      required
                      value={mediaYear}
                      onChange={(e) => setMediaYear(e.target.value)}
                      placeholder="e.g. 2025"
                      className="w-full bg-[#15161c] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                </div>

                {/* Source Selection: Direct URL vs File Upload (D-09) */}
                <div>
                  <label className="text-xs uppercase text-white/50 mb-1.5 block font-mono">Media Source</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setMediaSourceType("upload")}
                      className={`flex-1 py-1.5 text-xs font-mono uppercase border transition-all ${
                        mediaSourceType === "upload"
                          ? "bg-racing-red text-white border-racing-red font-bold"
                          : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaSourceType("url")}
                      className={`flex-1 py-1.5 text-xs font-mono uppercase border transition-all ${
                        mediaSourceType === "url"
                          ? "bg-racing-red text-white border-racing-red font-bold"
                          : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                      }`}
                    >
                      Direct URL / CDN Link
                    </button>
                  </div>

                  {mediaSourceType === "upload" ? (
                    <div>
                      <input
                        type="file"
                        accept={mediaType === "video" ? "video/*" : "image/*"}
                        onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                      />
                      {mediaFile && (
                        <span className="text-[11px] text-emerald-400 block mt-1">Ready: {mediaFile.name}</span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={mediaDirectUrl}
                        onChange={(e) => setMediaDirectUrl(e.target.value)}
                        placeholder="e.g. /cars/aether.jpg or https://..."
                        className="w-full bg-[#15161c] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featHomeModal"
                    checked={mediaFeatured}
                    onChange={(e) => setMediaFeatured(e.target.checked)}
                    className="w-4 h-4 accent-racing-red cursor-pointer"
                  />
                  <label htmlFor="featHomeModal" className="text-xs font-mono text-white/70 cursor-pointer">
                    Feature on Homepage Reel
                  </label>
                </div>

                </div>

                <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex gap-2 bg-[#0e0f15]">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all disabled:opacity-50"
                  >
                    {uploading ? "Saving Media..." : editingMedia ? "Update Track Moment" : "Add Track Moment"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMediaModal(false);
                      setEditingMedia(null);
                    }}
                    className="bg-white/10 text-white text-xs font-mono uppercase px-4 py-2 hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            DELETE MEDIA CONFIRMATION DIALOG (D-10)
        ========================================================================= */}
        {deleteConfirmMedia && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setDeleteConfirmMedia(null)}
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
                <h3 className="text-base font-bold uppercase font-display text-white">Confirm Media Deletion</h3>
              </div>
              <p className="text-white/70 text-xs font-sans leading-relaxed mb-6">
                Are you sure you want to delete track moment: <strong className="text-white font-bold">&quot;{deleteConfirmMedia.title}&quot;</strong> ({deleteConfirmMedia.year})?
                This will immediately remove it from both the gallery and homepage reel.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmMedia(null)}
                  className="px-4 py-2 text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteMedia}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase bg-red-600 hover:bg-red-500 text-white transition-colors"
                >
                  Delete Moment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            ADD / EDIT ALUMNI MODAL (F10)
        ========================================================================= */}
        {showAlumniModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => {
              setShowAlumniModal(false);
              setEditingAlumni(null);
            }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div
              className="bg-[#0e0f15] border border-white/15 w-full max-w-xl max-h-[88vh] flex flex-col relative shadow-2xl overflow-hidden rounded-none"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-racing-red" />
                  <span>{editingAlumni ? "Edit Alumnus Profile" : "Add Alumnus Profile"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAlumniModal(false);
                    setEditingAlumni(null);
                  }}
                  className="text-white/40 hover:text-white p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAlumniSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-3.5">
                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={alumniName}
                    onChange={(e) => setAlumniName(e.target.value)}
                    placeholder="e.g. Siddhartha Senapati"
                    className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Batch</label>
                    <input
                      type="text"
                      required
                      value={alumniBatch}
                      onChange={(e) => setAlumniBatch(e.target.value)}
                      placeholder="e.g. Batch 2023"
                      className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={alumniCompany}
                      onChange={(e) => setAlumniCompany(e.target.value)}
                      placeholder="e.g. Ather Energy"
                      className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Current Industry Role</label>
                    <input
                      type="text"
                      required
                      value={alumniCurrentRole}
                      onChange={(e) => setAlumniCurrentRole(e.target.value)}
                      placeholder="e.g. Battery Systems Engineer"
                      className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Former Club Role</label>
                    <input
                      type="text"
                      required
                      value={alumniFormerRole}
                      onChange={(e) => setAlumniFormerRole(e.target.value)}
                      placeholder="e.g. Former Powertrain Lead"
                      className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Mentorship Domain</label>
                  <input
                    type="text"
                    required
                    value={alumniMentorshipDomain}
                    onChange={(e) => setAlumniMentorshipDomain(e.target.value)}
                    placeholder="e.g. Li-Ion Architecture & BMS"
                    className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={alumniLinkedin}
                    onChange={(e) => setAlumniLinkedin(e.target.value)}
                    placeholder="https://www.linkedin.com/in/..."
                    className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Bio / Impact Narrative</label>
                  <textarea
                    rows={2}
                    value={alumniBio}
                    onChange={(e) => setAlumniBio(e.target.value)}
                    placeholder="Brief career summary and club contribution..."
                    className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none leading-relaxed"
                  />
                </div>

                {/* Photo Source Selection: Upload vs URL */}
                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1.5 block font-mono">Profile Headshot Photo</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setAlumniPhotoSource("upload")}
                      className={`flex-1 py-1 text-xs font-mono uppercase border transition-all ${
                        alumniPhotoSource === "upload"
                          ? "bg-racing-red text-white border-racing-red font-bold"
                          : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlumniPhotoSource("url")}
                      className={`flex-1 py-1 text-xs font-mono uppercase border transition-all ${
                        alumniPhotoSource === "url"
                          ? "bg-racing-red text-white border-racing-red font-bold"
                          : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                      }`}
                    >
                      Direct Image URL
                    </button>
                  </div>

                  {alumniPhotoSource === "upload" ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAlumniFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                      />
                      {alumniFile && (
                        <span className="text-[11px] text-emerald-400 block mt-1">Ready: {alumniFile.name}</span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={alumniDirectUrl}
                        onChange={(e) => setAlumniDirectUrl(e.target.value)}
                        placeholder="e.g. /alumni/photo.jpg or https://..."
                        className="w-full bg-[#15161c] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>
                  )}
                </div>

                </div>

                <div className="shrink-0 p-5 sm:p-6 pt-3 border-t border-white/10 flex gap-2 bg-[#0e0f15]">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all disabled:opacity-50"
                  >
                    {uploading ? "Saving Profile..." : editingAlumni ? "Update Alumnus" : "Add Alumnus"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAlumniModal(false);
                      setEditingAlumni(null);
                    }}
                    className="bg-white/10 text-white text-xs font-mono uppercase px-4 py-2 hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            DELETE ALUMNI CONFIRMATION DIALOG (D-10)
        ========================================================================= */}
        {deleteConfirmAlumni && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setDeleteConfirmAlumni(null)}
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
                <h3 className="text-base font-bold uppercase font-display text-white">Confirm Alumni Deletion</h3>
              </div>
              <p className="text-white/70 text-xs font-sans leading-relaxed mb-6">
                Are you sure you want to delete alumni profile: <strong className="text-white font-bold">&quot;{deleteConfirmAlumni.name}&quot;</strong> ({deleteConfirmAlumni.batch})?
                This action will permanently remove the record from the database and public directory.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmAlumni(null)}
                  className="px-4 py-2 text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteAlumni}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase bg-red-600 hover:bg-red-500 text-white transition-colors"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: ACTIVE TEAM SQUAD (ROSTER & DATASHEETS)
        ========================================================================= */}
        {activeTab === "members" && (
          <div className="space-y-6">
            
            {/* Top Squad Actions Banner */}
            <div className="bg-[#0b0c10] border border-white/10 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-1 text-[10px] font-mono uppercase text-racing-red font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>ANNUAL BATCH ROLL-FORWARD & ROSTER MANAGEMENT</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
                  Active Team Squad & Datasheets
                </h2>
                <p className="text-xs font-mono text-white/50">
                  {members.length} Active Members • Track academic branch, roll number, blood group & contact
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowProgressionModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-racing-red to-red-700 hover:from-white hover:to-white text-white hover:text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(210,39,48,0.4)]"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Annual Batch Progression</span>
                </button>

                <button
                  onClick={handleExportMembersExcel}
                  className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Squad to Excel</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="lg:col-span-1">
                <div className="bg-[#0b0c10] border border-white/10 p-6 sticky top-24">
                  <h2 className="text-base font-bold uppercase mb-4 flex items-center gap-2 font-display text-white">
                    <UserPlus className="w-4 h-4 text-racing-red" />
                    <span>Add Active Team Member</span>
                  </h2>

                  <form onSubmit={handleMemberSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Full Name</label>
                      <input
                        type="text"
                        required
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="e.g. Aditya Mishra"
                        className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Role / Designation</label>
                      <input
                        type="text"
                        required
                        value={memberRole}
                        onChange={(e) => setMemberRole(e.target.value)}
                        placeholder="e.g. Battery Enclosure Lead"
                        className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Department</label>
                        <select
                          value={memberDepartment}
                          onChange={(e) => setMemberDepartment(e.target.value)}
                          className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                        >
                          {departments.map((d) => (
                            <option key={d} value={d} className="bg-black text-white">{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Year of Study</label>
                        <select
                          value={memberYearOfStudy}
                          onChange={(e) => setMemberYearOfStudy(e.target.value)}
                          className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">PR Specialization</label>
                        <select
                          value={memberPrSkills}
                          onChange={(e) => setMemberPrSkills(e.target.value)}
                          className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                        >
                          <option value="None (Technical Only)">None (Technical Only)</option>
                          <option value="Web Development & Site Maintenance">Web Development</option>
                          <option value="Graphic Designing & Poster Art">Graphic Designing</option>
                          <option value="Video Editing & Track Reels">Video Editing</option>
                          <option value="Social Media & Content Strategy">Social Media & Content</option>
                          <option value="3D CAD Rendering & Blender Animation">3D Render / Animation</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Blood Group</label>
                        <input
                          type="text"
                          value={memberBloodGroup}
                          onChange={(e) => setMemberBloodGroup(e.target.value)}
                          placeholder="O+, B+, A+"
                          className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        value={memberPhone}
                        onChange={(e) => setMemberPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                      />
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

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">LinkedIn URL</label>
                        <input
                          type="url"
                          value={memberLinkedin}
                          onChange={(e) => setMemberLinkedin(e.target.value)}
                          className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Instagram URL</label>
                        <input
                          type="url"
                          value={memberInstagram}
                          onChange={(e) => setMemberInstagram(e.target.value)}
                          className="w-full bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all disabled:opacity-50"
                    >
                      {uploading ? "Saving..." : "Add to Active Squad"}
                    </button>
                  </form>
                </div>
              </div>

              {/* List Column */}
              <div className="lg:col-span-2">
                <div className="bg-[#0b0c10] border border-white/10 p-6">
                  {/* Roster Header & Year Filter */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold uppercase font-display text-white">
                        Active Roster ({members.length})
                      </h3>
                      <p className="text-[10px] font-mono text-white/40">
                        Full squad roll • Scroll down freely to view all members
                      </p>
                    </div>

                    {/* Filter Pills & Search */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                          placeholder="Search members..."
                          className="bg-[#111115] border border-white/10 px-2.5 py-1 text-xs font-mono text-white placeholder:text-white/30 focus:border-racing-red outline-none w-36 sm:w-44"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                        {["ALL", "1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
                          <button
                            key={yr}
                            onClick={() => setMemberYearFilter(yr)}
                            className={`px-2 py-1 uppercase font-bold transition-colors ${
                              memberYearFilter === yr
                                ? "bg-racing-red text-white"
                                : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Members Grid (Unconstrained height so entire list can be scrolled smoothly to the very end) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pb-28">
                    {members
                      .filter((m) => {
                        const matchesYear =
                          memberYearFilter === "ALL" ||
                          (m.year_of_study || "").includes(memberYearFilter.replace(" Year", ""));
                        const query = memberSearchQuery.toLowerCase().trim();
                        const matchesSearch =
                          !query ||
                          (m.name || "").toLowerCase().includes(query) ||
                          (m.role || "").toLowerCase().includes(query) ||
                          (m.department || "").toLowerCase().includes(query) ||
                          (m.academic_branch || "").toLowerCase().includes(query);
                        return matchesYear && matchesSearch;
                      })
                      .map((member) => (
                        <div
                          key={member.id}
                          className="bg-black/50 border border-white/10 hover:border-white/20 p-3.5 flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-12 h-12 object-cover object-top border border-white/20 shrink-0"
                            />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5 truncate">
                                <h4 className="font-bold text-xs text-white truncate">{member.name}</h4>
                                <span className="text-[9px] font-mono bg-racing-red/20 text-racing-red px-1.5 py-0.2 shrink-0 font-bold">
                                  {member.year_of_study || "3rd Year"}
                                </span>
                              </div>
                              <p className="text-[10px] text-racing-red font-mono uppercase truncate">{member.department}</p>
                              <p className="text-[10px] text-white/50 truncate">{member.role}</p>
                              {member.pr_domain_skills && member.pr_domain_skills !== "None (Technical Only)" && (
                                <p className="text-[9px] text-amber-400 font-mono truncate">PR: {member.pr_domain_skills}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setSelectedMemberForDatasheet(member)}
                              className="px-2 py-1 bg-white/5 hover:bg-white/20 text-white/80 hover:text-white text-[10px] font-mono uppercase flex items-center gap-1 transition-colors"
                              title="View & Edit Full Member Datasheet"
                            >
                              <BookOpen className="w-3 h-3 text-racing-red" />
                              <span>Datasheet</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              title="Delete Member"
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
          </div>
        )}

        {/* =========================================================================
            DELETE MEMBER CONFIRMATION DIALOG (Soft Check Mistake Prevention)
        ========================================================================= */}
        {deleteConfirmMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setDeleteConfirmMember(null)}
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
                <h3 className="text-base font-bold uppercase font-display text-white">Confirm Member Deletion</h3>
              </div>
              <p className="text-white/70 text-xs font-sans leading-relaxed mb-6">
                Are you sure you want to remove active member <strong className="text-white font-bold">&quot;{deleteConfirmMember.name}&quot;</strong> ({deleteConfirmMember.role} • {deleteConfirmMember.department}) from the active roster?
                This action is permanent and will remove them from the squad roster and public site.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmMember(null)}
                  className="px-4 py-2 text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteMember}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase bg-red-600 hover:bg-red-500 text-white transition-colors"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: COSTS & BILLS TRACKER (WITH EXCEL EXPORT)
        ========================================================================= */}
        {activeTab === "expenses" && (
          <ExpensesTab
            expenses={expenses}
            uploading={uploading}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {/* =========================================================================
            TAB 7: RECRUITMENT APPLICATIONS & INDUCTION CHECKLIST
        ========================================================================= */}
        {activeTab === "recruitment" && (
          <RecruitmentTab
            recruits={recruits}
            siteSettings={siteSettings}
            onUpdateSettings={handleUpdateSettings}
            onUpdateStatus={handleUpdateRecruitStatus}
            onUpdateScore={handleUpdateRecruitScore}
            onDeleteApplication={handleDeleteApplication}
            showToast={showToast}
            showError={showError}
          />
        )}

        {/* =========================================================================
            TAB 8: CUSTOM CLUB DATABASES (WITH EXCEL EXPORT)
        ========================================================================= */}
        {activeTab === "custom_dbs" && (
          <CustomDbsTab
            databases={customDbs}
            onCreateDatabase={handleCreateDatabase}
            onDeleteDatabase={handleDeleteDatabase}
            onAddRecord={handleAddCustomDbRecord}
            onDeleteRecord={handleDeleteCustomDbRecord}
            onUpdateRecord={handleUpdateCustomDbRecord}
          />
        )}

        {/* =========================================================================
            ACTIVE MODALS
        ========================================================================= */}
        {selectedMemberForDatasheet && (
          <MemberDatasheetModal
            member={selectedMemberForDatasheet}
            onClose={() => setSelectedMemberForDatasheet(null)}
            onSave={handleSaveMemberDatasheet}
          />
        )}

        {showProgressionModal && (
          <BatchProgressionModal
            members={members}
            onClose={() => setShowProgressionModal(false)}
            onConfirm={handleExecuteProgression}
          />
        )}

        {showSecurityModal && (
          <AdminSecurityModal
            isOpen={showSecurityModal}
            onClose={() => setShowSecurityModal(false)}
            adminEmail={siteSettings.contact_email || "veerracersselectric.database@gmail.com"}
            showToast={showToast}
            showError={showError}
          />
        )}

      </div>
    </div>
  );
}
