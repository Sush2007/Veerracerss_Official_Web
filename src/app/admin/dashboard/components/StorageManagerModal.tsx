"use client";

import { useState, useEffect } from "react";
import {
  HardDrive,
  Trash2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Search,
  X,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Folder,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import {
  MemberRecord,
  AlumniRecord,
  FeaturedMachine,
  MediaItem,
  ClubExpense,
  SiteSettings,
} from "@/src/data/cms_defaults";

interface StorageFileItem {
  bucket: string;
  folder: string;
  name: string;
  path: string;
  size: number;
  updatedAt?: string;
  publicUrl: string;
  inUse: boolean;
  usedBy?: string[];
}

interface StorageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberRecord[];
  alumniList: AlumniRecord[];
  machine: FeaturedMachine;
  mediaList: MediaItem[];
  expenses: ClubExpense[];
  siteSettings: SiteSettings;
  showToast: (msg: string) => void;
  showError: (msg: string) => void;
}

export function StorageManagerModal({
  isOpen,
  onClose,
  members,
  alumniList,
  machine,
  mediaList,
  expenses,
  siteSettings,
  showToast,
  showError,
}: StorageManagerModalProps) {
  const [files, setFiles] = useState<StorageFileItem[]>([]);
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState<"all" | "unused" | "in_use">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [cleaningBatch, setCleaningBatch] = useState(false);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      scanStorage();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Aggregate all active database asset URLs
  const collectActiveUrls = (): Map<string, string[]> => {
    const map = new Map<string, string[]>();

    const recordUrl = (url: string | undefined | null, label: string) => {
      if (!url) return;
      const clean = url.trim().toLowerCase();
      const existing = map.get(clean) || [];
      existing.push(label);
      map.set(clean, existing);

      // Also index by filename only in case of relative vs absolute public URLs
      const filename = clean.split("/").pop();
      if (filename && filename.length > 3) {
        const existingByName = map.get(filename) || [];
        existingByName.push(label);
        map.set(filename, existingByName);
      }
    };

    // Members
    members.forEach((m) => recordUrl(m.image_url, `Active Squad: ${m.name}`));

    // Alumni
    alumniList.forEach((a) => recordUrl(a.image_url, `Alumni Directory: ${a.name}`));

    // Machine
    recordUrl(machine.cad_image_url, "Car CAD Spotlight Image");
    recordUrl(machine.track_image_url, "Car Track Performance Photo");
    recordUrl(machine.cad_model_url, "Car 3D GLB CAD Model");

    // Media
    mediaList.forEach((m) => {
      recordUrl(m.media_url, `Track Moments: ${m.title}`);
      recordUrl(m.thumbnail_url, `Track Moments Thumb: ${m.title}`);
    });

    // Expenses
    expenses.forEach((e) => {
      if (e.receipt_url) recordUrl(e.receipt_url, `Expense Voucher: ${e.title}`);
    });

    // Site Settings About
    recordUrl(siteSettings.about_image_url, "Homepage Who We Are Photo");

    return map;
  };

  const scanStorage = async () => {
    setScanning(true);
    const supabase = createClient();
    const activeMap = collectActiveUrls();
    const discovered: StorageFileItem[] = [];

    const scanFolder = async (bucket: string, folder: string) => {
      try {
        const { data, error } = await supabase.storage.from(bucket).list(folder, {
          limit: 200,
          sortBy: { column: "created_at", order: "desc" },
        });

        if (error || !data) return;

        for (const item of data) {
          if (!item.name || item.name === ".emptyFolderPlaceholder") continue;

          // Check if item is a subfolder
          if (!item.metadata) {
            // Recurse subfolder
            const sub = folder ? `${folder}/${item.name}` : item.name;
            await scanFolder(bucket, sub);
            continue;
          }

          const filePath = folder ? `${folder}/${item.name}` : item.name;
          const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(filePath);
          const pubUrl = pubData.publicUrl;

          // Check if URL or filename is referenced in database
          const cleanUrl = pubUrl.toLowerCase();
          const cleanName = item.name.toLowerCase();

          let inUse = false;
          let usedBy: string[] = [];

          if (activeMap.has(cleanUrl)) {
            inUse = true;
            usedBy = activeMap.get(cleanUrl) || [];
          } else if (activeMap.has(cleanName)) {
            inUse = true;
            usedBy = activeMap.get(cleanName) || [];
          }

          discovered.push({
            bucket,
            folder,
            name: item.name,
            path: filePath,
            size: item.metadata?.size || 0,
            updatedAt: (item.updated_at || item.created_at) ?? undefined,
            publicUrl: pubUrl,
            inUse,
            usedBy,
          });
        }
      } catch (err) {
        console.warn(`Could not scan bucket ${bucket}/${folder}:`, err);
      }
    };

    try {
      // Scan member-images bucket folders
      await scanFolder("member-images", "domain-members");
      await scanFolder("member-images", "alumni");
      await scanFolder("member-images", "cars");
      await scanFolder("member-images", "about");
      await scanFolder("member-images", "bills-receipts");
      await scanFolder("member-images", "");

      // Scan expenses-receipts bucket
      await scanFolder("expenses-receipts", "");
    } catch (err: any) {
      console.warn("Storage scan error:", err);
    } finally {
      setFiles(discovered);
      setScanning(false);
    }
  };

  const handleDeleteSingleFile = async (file: StorageFileItem) => {
    if (!confirm(`Permanently delete "${file.name}" from ${file.bucket}/${file.folder}?`)) return;
    setDeletingPath(file.path);
    try {
      const supabase = createClient();
      const { error } = await supabase.storage.from(file.bucket).remove([file.path]);
      if (error) throw error;

      setFiles((prev) => prev.filter((f) => f.path !== file.path));
      showToast(`Deleted ${file.name} from storage.`);
    } catch (err: any) {
      showError(err.message || "Failed to delete file from bucket.");
    } finally {
      setDeletingPath(null);
    }
  };

  const handleCleanAllUnused = async () => {
    const unusedFiles = files.filter((f) => !f.inUse);
    if (unusedFiles.length === 0) return;

    setCleaningBatch(true);
    try {
      const supabase = createClient();

      // Group by bucket
      const bucketGroups = new Map<string, string[]>();
      unusedFiles.forEach((f) => {
        const list = bucketGroups.get(f.bucket) || [];
        list.push(f.path);
        bucketGroups.set(f.bucket, list);
      });

      let removedCount = 0;
      for (const [bucket, paths] of bucketGroups.entries()) {
        const { error } = await supabase.storage.from(bucket).remove(paths);
        if (!error) {
          removedCount += paths.length;
        }
      }

      setFiles((prev) => prev.filter((f) => f.inUse));
      setShowBatchConfirm(false);
      showToast(`Cleaned up ${removedCount} unused files from storage!`);
    } catch (err: any) {
      showError(err.message || "Failed to complete batch cleanup.");
    } finally {
      setCleaningBatch(false);
    }
  };

  if (!isOpen) return null;

  const unusedCount = files.filter((f) => !f.inUse).length;
  const inUseCount = files.filter((f) => f.inUse).length;
  const totalUnusedBytes = files
    .filter((f) => !f.inUse)
    .reduce((acc, f) => acc + (f.size || 0), 0);

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredFiles = files.filter((f) => {
    if (filter === "unused" && f.inUse) return false;
    if (filter === "in_use" && !f.inUse) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.folder.toLowerCase().includes(q) ||
        f.bucket.toLowerCase().includes(q) ||
        (f.usedBy && f.usedBy.some((u) => u.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0b0c10] border border-white/15 w-full max-w-4xl max-h-[92vh] overflow-y-auto overscroll-contain my-auto p-5 sm:p-8 shadow-2xl relative flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-racing-red/10 border border-racing-red/30 flex items-center justify-center text-racing-red">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl uppercase text-white tracking-wide">
                Storage Bucket File Cleaner
              </h2>
              <p className="text-[11px] font-mono text-white/50">
                Detect and safely purge orphaned images, old test uploads, and unreferenced files from Supabase buckets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scanStorage}
              disabled={scanning}
              className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono uppercase flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Rescan Storage"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${scanning ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Rescan</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-black/40 border border-white/10 p-3">
            <span className="text-[10px] font-mono uppercase text-white/40 block">Total Scanned</span>
            <span className="text-lg font-mono font-bold text-white">{files.length}</span>
          </div>
          <div className="bg-black/40 border border-emerald-500/20 p-3">
            <span className="text-[10px] font-mono uppercase text-emerald-400 block">In Active Use</span>
            <span className="text-lg font-mono font-bold text-emerald-400">{inUseCount}</span>
          </div>
          <div className="bg-black/40 border border-amber-500/30 p-3">
            <span className="text-[10px] font-mono uppercase text-amber-400 block">Unused / Orphans</span>
            <span className="text-lg font-mono font-bold text-amber-400">{unusedCount}</span>
          </div>
          <div className="bg-black/40 border border-red-500/20 p-3">
            <span className="text-[10px] font-mono uppercase text-red-400 block">Purgeable Space</span>
            <span className="text-lg font-mono font-bold text-red-400">{formatSize(totalUnusedBytes)}</span>
          </div>
        </div>

        {/* Filter Toolbar & Purge Action */}
        <div className="bg-[#111115] border border-white/10 p-3 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file name or folder..."
                className="w-full bg-black/50 border border-white/10 pl-8 pr-3 py-1.5 text-xs font-mono text-white outline-none focus:border-racing-red"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1.5 text-xs font-mono uppercase transition-colors ${
                  filter === "all" ? "bg-white text-black font-bold" : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                All ({files.length})
              </button>
              <button
                onClick={() => setFilter("unused")}
                className={`px-2.5 py-1.5 text-xs font-mono uppercase transition-colors ${
                  filter === "unused" ? "bg-amber-500 text-black font-bold" : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                Unused ({unusedCount})
              </button>
              <button
                onClick={() => setFilter("in_use")}
                className={`px-2.5 py-1.5 text-xs font-mono uppercase transition-colors ${
                  filter === "in_use" ? "bg-emerald-500 text-black font-bold" : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                In Use ({inUseCount})
              </button>
            </div>
          </div>

          {unusedCount > 0 && (
            <button
              onClick={() => setShowBatchConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-lg"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clean All Unused ({unusedCount})</span>
            </button>
          )}
        </div>

        {/* Files List */}
        <div className="flex-1 overflow-y-auto max-h-[50vh] space-y-2 pr-1">
          {scanning ? (
            <div className="text-center py-12 text-white/50 font-mono text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-racing-red" />
              Scanning Supabase storage buckets...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 text-white/40 font-mono text-xs">
              {files.length === 0
                ? "No storage buckets or files found. Ensure bucket 'member-images' is set up."
                : "No files match the selected filter."}
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.path}
                className="bg-black/40 border border-white/10 hover:border-white/20 p-3 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 bg-black/70 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
                    {file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
                      <img
                        src={file.publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <FileText className="w-5 h-5 text-white/40" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white font-bold truncate max-w-[220px] sm:max-w-md">
                        {file.name}
                      </span>
                      {file.inUse ? (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>IN USE</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>UNUSED</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-white/40 flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Folder className="w-3 h-3 text-white/30" />
                        {file.bucket}/{file.folder || "root"}
                      </span>
                      <span>•</span>
                      <span>{formatSize(file.size)}</span>
                      {file.inUse && file.usedBy && file.usedBy.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400/70 truncate max-w-[180px]">
                            Used in: {file.usedBy[0]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-colors"
                    title="View file"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleDeleteSingleFile(file)}
                    disabled={deletingPath === file.path}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    title="Delete file permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-white/40 gap-2">
          <span>
            ℹ Files marked <strong className="text-emerald-400">IN USE</strong> are currently linked to active members, car specs, track media, or receipts.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase"
          >
            Close
          </button>
        </div>

        {/* Batch Confirmation Dialog */}
        {showBatchConfirm && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#120d0e] border border-red-500/40 w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold uppercase font-display text-white">
                  Confirm Storage Purge
                </h3>
              </div>
              <p className="text-white/70 text-xs font-sans leading-relaxed mb-4">
                Are you sure you want to permanently delete <strong className="text-white font-bold">{unusedCount} unreferenced files</strong> ({formatSize(totalUnusedBytes)}) from your Supabase buckets?
              </p>
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] font-mono mb-5">
                Files linked to active members, car models, or valid receipts will NOT be touched. Only orphaned assets will be removed.
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  disabled={cleaningBatch}
                  onClick={() => setShowBatchConfirm(false)}
                  className="px-4 py-2 text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={cleaningBatch}
                  onClick={handleCleanAllUnused}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {cleaningBatch ? (
                    <span>Purging Files...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Purge ({unusedCount})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
