"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  FolderArchive,
  Folder,
  FolderPlus,
  ChevronRight,
  CornerDownRight,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Archive,
  Box,
  Download,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Edit2,
  Plus,
  Search,
  Grid,
  List,
  X,
  HardDrive,
  Paperclip,
  Film,
  MoveRight,
  ArrowLeft,
  FolderTree
} from "lucide-react";
import { CustomDatabaseRecord } from "@/src/data/cms_defaults";
import { createClient } from "@/src/lib/supabase/client";

export interface StorageFileRecord {
  id: string;
  file_name: string;
  file_url: string;
  file_size?: string | number;
  file_type?: string;
  category?: string;
  description?: string;
  folder_id?: string;
  uploaded_at: string;
  uploaded_by?: string;
}

interface CustomDbsTabProps {
  databases: CustomDatabaseRecord[];
  onCreateDatabase: (newDb: Omit<CustomDatabaseRecord, "id" | "created_at" | "updated_at">) => Promise<void>;
  onDeleteDatabase: (id: string, name: string) => Promise<void>;
  onUpdateDatabase?: (id: string, updates: Partial<CustomDatabaseRecord>) => Promise<void>;
  onAddRecord: (dbId: string, record: Record<string, any>) => Promise<void>;
  onDeleteRecord: (dbId: string, recordId: string) => Promise<void>;
  onUpdateRecord?: (dbId: string, recordId: string, updatedRecord: Record<string, any>) => Promise<void>;
  onMoveFile?: (sourceDbId: string, targetDbId: string, fileId: string) => Promise<void>;
  onMoveFolder?: (folderId: string, newParentId: string | null) => Promise<void>;
  onUploadFile?: (file: File, folder?: string) => Promise<string>;
}

export function CustomDbsTab({
  databases,
  onCreateDatabase,
  onDeleteDatabase,
  onUpdateDatabase,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  onMoveFile,
  onMoveFolder,
  onUploadFile,
}: CustomDbsTabProps) {
  // Navigation & Hierarchy State
  const [activeFolderId, setActiveFolderId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<CustomDatabaseRecord | null>(null);
  const [movingFolder, setMovingFolder] = useState<CustomDatabaseRecord | null>(null);
  const [editingFile, setEditingFile] = useState<{ folderId: string; file: StorageFileRecord } | null>(null);
  const [movingFile, setMovingFile] = useState<{ sourceFolderId: string; file: StorageFileRecord } | null>(null);

  // New Folder Form State
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);

  // Edit Folder Form State
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderDesc, setEditFolderDesc] = useState("");

  // Target Folder for Move Folder modal
  const [targetParentFolderId, setTargetParentFolderId] = useState<string>("ROOT");

  // Target Folder for Move File modal
  const [targetMoveFolderId, setTargetMoveFolderId] = useState<string>("");

  // Upload Form State
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");
  const [targetUploadFolderId, setTargetUploadFolderId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileCategory, setFileCategory] = useState("General");
  const [fileDescription, setFileDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Edit File Form State
  const [editFileName, setEditFileName] = useState("");
  const [editFileCategory, setEditFileCategory] = useState("");
  const [editFileDesc, setEditFileDesc] = useState("");

  // Clipboard Copied Status
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Prevent background scrolling while any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      showUploadModal || showCreateFolderModal || editingFolder || movingFolder || editingFile || movingFile
    );
    if (isAnyModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [showUploadModal, showCreateFolderModal, editingFolder, movingFolder, editingFile, movingFile]);

  // Keep target upload folder valid
  useEffect(() => {
    if (activeFolderId !== "ALL") {
      setTargetUploadFolderId(activeFolderId);
    } else if (databases.length > 0 && !targetUploadFolderId) {
      setTargetUploadFolderId(databases[0].id);
    }
  }, [activeFolderId, databases, targetUploadFolderId]);

  // Active folder object (if not viewing ALL)
  const currentFolder = useMemo(() => {
    if (activeFolderId === "ALL") return null;
    return databases.find((db) => db.id === activeFolderId) || null;
  }, [databases, activeFolderId]);

  // Compute folder breadcrumb trail for branching navigation
  const breadcrumbTrail = useMemo(() => {
    if (activeFolderId === "ALL") return [];
    const trail: CustomDatabaseRecord[] = [];
    let curr = databases.find((db) => db.id === activeFolderId);
    const visited = new Set<string>();

    while (curr && !visited.has(curr.id)) {
      visited.add(curr.id);
      trail.unshift(curr);
      if (curr.parent_id) {
        curr = databases.find((db) => db.id === curr?.parent_id);
      } else {
        break;
      }
    }
    return trail;
  }, [databases, activeFolderId]);

  // Subfolders (child branches) of the current folder view
  const currentSubfolders = useMemo(() => {
    if (activeFolderId === "ALL") {
      // At root view, show folders that have no parent_id
      return databases.filter((db) => !db.parent_id);
    }
    return databases.filter((db) => db.parent_id === activeFolderId);
  }, [databases, activeFolderId]);

  // Flatten all files across all folders
  const allStoredFiles = useMemo(() => {
    const files: Array<{ folderId: string; folderName: string; file: StorageFileRecord }> = [];

    databases.forEach((db) => {
      (db.records || []).forEach((rec: any) => {
        const fileRecord: StorageFileRecord = {
          id: rec.id || `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          file_name: rec.file_name || rec.name || rec.item_name || rec.tool_name || rec.company_name || "Document",
          file_url: rec.file_url || rec.url || rec.link || "",
          file_size: rec.file_size || (rec.quantity ? `${rec.quantity} units` : "N/A"),
          file_type: rec.file_type || (rec.file_name ? rec.file_name.split(".").pop() : "") || "file",
          category: rec.category || rec.domain || rec.tier || db.db_name,
          description: rec.description || rec.condition || rec.poc_name || "",
          folder_id: db.id,
          uploaded_at: rec.uploaded_at || rec.created_at || new Date().toISOString(),
          uploaded_by: rec.uploaded_by || "Admin",
        };

        files.push({
          folderId: db.id,
          folderName: db.db_name,
          file: fileRecord,
        });
      });
    });

    return files;
  }, [databases]);

  // Filtered files according to folder, search query, and type filter
  const filteredFiles = useMemo(() => {
    return allStoredFiles.filter(({ folderId, file }) => {
      if (activeFolderId !== "ALL" && folderId !== activeFolderId) return false;

      if (selectedTypeFilter !== "ALL") {
        const ext = (file.file_name.split(".").pop() || file.file_type || "").toLowerCase();
        if (selectedTypeFilter === "PDF" && ext !== "pdf") return false;
        if (selectedTypeFilter === "EXCEL" && !["xlsx", "xls", "csv"].includes(ext)) return false;
        if (selectedTypeFilter === "DOC" && !["doc", "docx", "txt", "md"].includes(ext)) return false;
        if (selectedTypeFilter === "IMAGE" && !["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) return false;
        if (selectedTypeFilter === "CAD" && !["step", "stp", "dwg", "dxf", "stl"].includes(ext)) return false;
        if (selectedTypeFilter === "ZIP" && !["zip", "rar", "7z", "tar", "gz"].includes(ext)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = file.file_name.toLowerCase().includes(q);
        const matchesCategory = (file.category || "").toLowerCase().includes(q);
        const matchesDesc = (file.description || "").toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      return true;
    });
  }, [allStoredFiles, activeFolderId, selectedTypeFilter, searchQuery]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIconInfo = (fileName: string, rawType?: string) => {
    const ext = (fileName.split(".").pop() || rawType || "").toLowerCase();

    if (ext === "pdf") {
      return { badge: "PDF", bg: "bg-red-500/15 text-red-400 border-red-500/30", icon: FileText, color: "text-red-400" };
    }
    if (["xlsx", "xls", "csv"].includes(ext)) {
      return { badge: ext.toUpperCase(), bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: FileSpreadsheet, color: "text-emerald-400" };
    }
    if (["doc", "docx", "txt", "md"].includes(ext)) {
      return { badge: "DOC", bg: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: FileText, color: "text-blue-400" };
    }
    if (["ppt", "pptx"].includes(ext)) {
      return { badge: "PPT", bg: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: FileText, color: "text-amber-400" };
    }
    if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) {
      return { badge: "IMG", bg: "bg-purple-500/15 text-purple-400 border-purple-500/30", icon: ImageIcon, color: "text-purple-400" };
    }
    if (["step", "stp", "dwg", "dxf", "stl"].includes(ext)) {
      return { badge: "CAD", bg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30", icon: Box, color: "text-cyan-400" };
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
      return { badge: "ZIP", bg: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30", icon: Archive, color: "text-yellow-400" };
    }
    if (["mp4", "mov"].includes(ext)) {
      return { badge: "VIDEO", bg: "bg-rose-500/15 text-rose-400 border-rose-500/30", icon: Film, color: "text-rose-400" };
    }
    return { badge: (ext.substring(0, 4) || "FILE").toUpperCase(), bg: "bg-white/10 text-white/70 border-white/20", icon: Paperclip, color: "text-white/70" };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    setUploadError(null);
  };

  // Upload File Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    const targetFolder = databases.find((db) => db.id === targetUploadFolderId) || databases[0];
    if (!targetFolder) {
      setUploadError("Please select a target folder.");
      return;
    }

    if (uploadMode === "file" && !selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    if (uploadMode === "link" && !fileUrl.trim()) {
      setUploadError("Please enter a valid file URL.");
      return;
    }

    setIsUploading(true);

    try {
      let finalUrl = fileUrl.trim();
      let sizeStr = "N/A";

      if (uploadMode === "file" && selectedFile) {
        sizeStr = formatBytes(selectedFile.size);

        if (onUploadFile) {
          finalUrl = await onUploadFile(selectedFile, "storage-vault");
        } else {
          const supabase = createClient();
          const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storagePath = `storage-vault/${Date.now()}-${safeName}`;

          const { error: uploadErr } = await supabase.storage
            .from("member-images")
            .upload(storagePath, selectedFile, {
              upsert: true,
              contentType: selectedFile.type || "application/octet-stream",
            });

          if (uploadErr) {
            if (selectedFile.size < 4 * 1024 * 1024) {
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
              });
              finalUrl = base64;
            } else {
              throw new Error(uploadErr.message || "Failed to upload file.");
            }
          } else {
            const { data: pub } = supabase.storage.from("member-images").getPublicUrl(storagePath);
            finalUrl = pub.publicUrl;
          }
        }
      }

      const ext = (fileName.split(".").pop() || "").toLowerCase();

      const newRecord: StorageFileRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        file_name: fileName.trim() || selectedFile?.name || "Document",
        file_url: finalUrl,
        file_size: sizeStr,
        file_type: ext || "file",
        category: fileCategory.trim() || targetFolder.db_name,
        description: fileDescription.trim(),
        folder_id: targetFolder.id,
        uploaded_at: new Date().toISOString(),
        uploaded_by: "Admin",
      };

      await onAddRecord(targetFolder.id, newRecord);

      setShowUploadModal(false);
      setSelectedFile(null);
      setFileName("");
      setFileUrl("");
      setFileDescription("");
      setFileCategory("General");
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Create Folder / Branch Submit
  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    await onCreateDatabase({
      db_name: newFolderName.trim(),
      description: newFolderDesc.trim() || "Storage Folder",
      parent_id: newFolderParentId,
      schema_definition: [],
      records: [],
    });

    setShowCreateFolderModal(false);
    setNewFolderName("");
    setNewFolderDesc("");
    setNewFolderParentId(null);
  };

  // Edit / Rename Folder Submit
  const handleEditFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFolder || !onUpdateDatabase) return;

    await onUpdateDatabase(editingFolder.id, {
      db_name: editFolderName.trim() || editingFolder.db_name,
      description: editFolderDesc.trim(),
    });

    setEditingFolder(null);
  };

  // Move Folder (Branching Operation) Submit
  const handleMoveFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movingFolder || !onMoveFolder) return;

    const newParent = targetParentFolderId === "ROOT" ? null : targetParentFolderId;
    await onMoveFolder(movingFolder.id, newParent);
    setMovingFolder(null);
  };

  // Move File Submit
  const handleMoveFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movingFile || !onMoveFile || !targetMoveFolderId) return;

    await onMoveFile(movingFile.sourceFolderId, targetMoveFolderId, movingFile.file.id);
    setMovingFile(null);
  };

  // Edit File Submit
  const handleEditFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile || !onUpdateRecord) return;

    const updatedRecord: Partial<StorageFileRecord> = {
      file_name: editFileName.trim() || editingFile.file.file_name,
      category: editFileCategory.trim() || editingFile.file.category,
      description: editFileDesc.trim(),
    };

    await onUpdateRecord(editingFile.folderId, editingFile.file.id, updatedRecord);
    setEditingFile(null);
  };

  const handleCopyUrl = (id: string, url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP HEADER & QUICK CONTROLS */}
      <div className="bg-[#0b0c10] border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-racing-red/10 border border-racing-red/20 text-racing-red shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-display font-black uppercase text-white tracking-wide">
                Storage Vault & Branch Explorer
              </h2>
              <span className="text-[10px] font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-bold">
                {allStoredFiles.length} files • {databases.length} folders
              </span>
            </div>
            <p className="text-xs font-mono text-white/50">
              Manage team files, create nested folder branches, upload and organize documents.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setNewFolderParentId(activeFolderId !== "ALL" ? activeFolderId : null);
              setShowCreateFolderModal(true);
            }}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            title="Create a new folder or branch"
          >
            <FolderPlus className="w-3.5 h-3.5 text-racing-red" />
            <span>{activeFolderId !== "ALL" ? "New Subfolder" : "New Folder"}</span>
          </button>

          <button
            onClick={() => {
              setShowUploadModal(true);
              setUploadError(null);
            }}
            className="px-4 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* 2. BREADCRUMBS & BRANCHING PATH NAVIGATION */}
      <div className="bg-[#0b0c10] border border-white/10 p-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-mono flex-wrap">
          {/* Root / All files button */}
          <button
            onClick={() => setActiveFolderId("ALL")}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
              activeFolderId === "ALL"
                ? "bg-white/15 text-white font-bold"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-racing-red" />
            <span>All Files</span>
          </button>

          {/* Breadcrumb segments */}
          {breadcrumbTrail.map((folder, idx) => {
            const isLast = idx === breadcrumbTrail.length - 1;
            return (
              <div key={folder.id} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-white/30 shrink-0" />
                <button
                  onClick={() => setActiveFolderId(folder.id)}
                  className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                    isLast
                      ? "bg-white/15 text-white font-bold"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-racing-red" />
                  <span className="max-w-[150px] truncate">{folder.db_name}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Current Folder Management Actions */}
        {currentFolder && (
          <div className="flex items-center gap-1 shrink-0">
            {currentFolder.parent_id && (
              <button
                onClick={() => setActiveFolderId(currentFolder.parent_id || "ALL")}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
                title="Go up one branch level"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Up Level</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingFolder(currentFolder);
                setEditFolderName(currentFolder.db_name);
                setEditFolderDesc(currentFolder.description || "");
              }}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Rename folder"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            {onMoveFolder && databases.length > 1 && (
              <button
                onClick={() => {
                  setMovingFolder(currentFolder);
                  setTargetParentFolderId(currentFolder.parent_id || "ROOT");
                }}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Move or Branch Folder (Change Parent)"
              >
                <MoveRight className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={() => onDeleteDatabase(currentFolder.id, currentFolder.db_name)}
              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Delete folder and contents"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 3. SUBFOLDERS & BRANCHES EXPLORER (Display Child Branches) */}
      {currentSubfolders.length > 0 && (
        <div className="bg-[#0b0c10] border border-white/10 p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-white/50 font-bold px-1">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-racing-red" />
              <span>Subfolders & Branches ({currentSubfolders.length})</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {currentSubfolders.map((folder) => {
              const fileCount = (folder.records || []).length;
              return (
                <div
                  key={folder.id}
                  onClick={() => setActiveFolderId(folder.id)}
                  className="bg-[#121318] hover:bg-white/5 border border-white/10 hover:border-racing-red/60 p-2.5 flex items-center justify-between gap-2 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Folder className="w-4 h-4 text-racing-red shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono font-bold text-white group-hover:text-racing-red truncate" title={folder.db_name}>
                      {folder.db_name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 shrink-0">
                    {fileCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. CONTROLS BAR: Search, Filters & View Toggle */}
      <div className="bg-[#0b0c10] border border-white/10 p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Quick Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files in active view..."
            className="w-full bg-[#121318] border border-white/10 pl-8 pr-7 py-1.5 text-xs font-mono text-white placeholder-white/40 focus:border-racing-red outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto">
          {/* Format Type Filter Pills */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {[
              { id: "ALL", label: "All" },
              { id: "PDF", label: "PDF" },
              { id: "EXCEL", label: "Excel" },
              { id: "CAD", label: "CAD" },
              { id: "DOC", label: "Docs" },
              { id: "ZIP", label: "ZIP" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTypeFilter(t.id)}
                className={`px-2 py-1 uppercase transition-all ${
                  selectedTypeFilter === t.id
                    ? "bg-white/20 text-white font-bold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-white/10 bg-[#121318]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${
                viewMode === "grid" ? "bg-racing-red text-white" : "text-white/40 hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors ${
                viewMode === "list" ? "bg-racing-red text-white" : "text-white/40 hover:text-white"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. MAIN FILES DISPLAY: COMPACT GRID OR SLEEK TABLE */}
      {filteredFiles.length === 0 ? (
        <div className="bg-[#0b0c10] border border-white/10 p-8 text-center space-y-3">
          <UploadCloud className="w-8 h-8 text-white/30 mx-auto" />
          <p className="text-xs font-mono text-white/50">
            {searchQuery || selectedTypeFilter !== "ALL"
              ? "No files match active search or filters."
              : "No files stored in this branch yet."}
          </p>
          <button
            onClick={() => {
              setShowUploadModal(true);
              setUploadError(null);
            }}
            className="px-3.5 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase"
          >
            Upload File Here
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW: High-density compact cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredFiles.map(({ folderId, folderName, file }) => {
            const iconInfo = getFileIconInfo(file.file_name, file.file_type);
            const IconComponent = iconInfo.icon;
            const isCopied = copiedId === file.id;

            return (
              <div
                key={`${folderId}-${file.id}`}
                className="bg-[#0b0c10] border border-white/10 hover:border-racing-red/60 p-3 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 border shrink-0 ${iconInfo.bg}`}>
                    <IconComponent className={`w-4 h-4 ${iconInfo.color}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4
                      className="text-xs font-mono font-bold text-white group-hover:text-racing-red truncate transition-colors"
                      title={file.file_name}
                    >
                      {file.file_name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 mt-0.5 truncate">
                      <span>{file.file_size || "N/A"}</span>
                      <span>•</span>
                      <span className="truncate max-w-[110px]">{folderName}</span>
                      {file.uploaded_at && (
                        <>
                          <span>•</span>
                          <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {file.file_url && (
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      title="Open or View"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {file.file_url && (
                    <a
                      href={file.file_url}
                      download={file.file_name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {file.file_url && (
                    <button
                      onClick={() => handleCopyUrl(file.id, file.file_url)}
                      className={`p-1.5 transition-colors ${
                        isCopied ? "text-emerald-400" : "text-white/50 hover:text-white hover:bg-white/10"
                      }`}
                      title={isCopied ? "Copied!" : "Copy link"}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {onMoveFile && databases.length > 1 && (
                    <button
                      onClick={() => {
                        setMovingFile({ sourceFolderId: folderId, file });
                        setTargetMoveFolderId(
                          databases.find((d) => d.id !== folderId)?.id || ""
                        );
                      }}
                      className="p-1.5 text-white/40 hover:text-white transition-colors"
                      title="Move file to another folder/branch"
                    >
                      <MoveRight className="w-3 h-3" />
                    </button>
                  )}

                  {onUpdateRecord && (
                    <button
                      onClick={() => {
                        setEditingFile({ folderId, file });
                        setEditFileName(file.file_name);
                        setEditFileCategory(file.category || "");
                        setEditFileDesc(file.description || "");
                      }}
                      className="p-1.5 text-white/40 hover:text-white transition-colors"
                      title="Edit details"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteRecord(folderId, file.id)}
                    className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-[#0b0c10] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121318] text-white/60 uppercase border-b border-white/10 text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Type</th>
                <th className="px-3.5 py-2.5">File Name</th>
                <th className="px-3.5 py-2.5">Folder</th>
                <th className="px-3.5 py-2.5">Size</th>
                <th className="px-3.5 py-2.5">Date</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFiles.map(({ folderId, folderName, file }) => {
                const iconInfo = getFileIconInfo(file.file_name, file.file_type);
                const IconComponent = iconInfo.icon;
                const isCopied = copiedId === file.id;

                return (
                  <tr key={`${folderId}-${file.id}`} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-3.5 py-2">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${iconInfo.bg}`}>
                        {iconInfo.badge}
                      </span>
                    </td>
                    <td className="px-3.5 py-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${iconInfo.color}`} />
                        <span className="font-bold text-white truncate max-w-sm" title={file.file_name}>
                          {file.file_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2 text-white/60">{folderName}</td>
                    <td className="px-3.5 py-2 text-white/60">{file.file_size || "N/A"}</td>
                    <td className="px-3.5 py-2 text-white/40 text-[11px]">
                      {file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-3.5 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {file.file_url && (
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-white/50 hover:text-white"
                            title="Open"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {file.file_url && (
                          <button
                            onClick={() => handleCopyUrl(file.id, file.file_url)}
                            className={`p-1 ${isCopied ? "text-emerald-400" : "text-white/50 hover:text-white"}`}
                            title="Copy link"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}

                        {onMoveFile && databases.length > 1 && (
                          <button
                            onClick={() => {
                              setMovingFile({ sourceFolderId: folderId, file });
                              setTargetMoveFolderId(
                                databases.find((d) => d.id !== folderId)?.id || ""
                              );
                            }}
                            className="p-1 text-white/40 hover:text-white"
                            title="Move"
                          >
                            <MoveRight className="w-3 h-3" />
                          </button>
                        )}

                        {onUpdateRecord && (
                          <button
                            onClick={() => {
                              setEditingFile({ folderId, file });
                              setEditFileName(file.file_name);
                              setEditFileCategory(file.category || "");
                              setEditFileDesc(file.description || "");
                            }}
                            className="p-1 text-white/40 hover:text-white"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteRecord(folderId, file.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: UPLOAD FILE
      ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-lg max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-racing-red" />
                <span>Upload File to Storage</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3.5">
                {uploadError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    {uploadError}
                  </div>
                )}

                <div className="flex border border-white/10 p-0.5 bg-[#121318] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`flex-1 py-1 uppercase font-bold transition-all ${
                      uploadMode === "file" ? "bg-racing-red text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    Direct Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("link")}
                    className={`flex-1 py-1 uppercase font-bold transition-all ${
                      uploadMode === "link" ? "bg-racing-red text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    Cloud Link (Drive/Dropbox)
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Target Folder / Branch
                  </label>
                  <select
                    value={targetUploadFolderId}
                    onChange={(e) => setTargetUploadFolderId(e.target.value)}
                    required
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-racing-red"
                  >
                    {databases.map((db) => (
                      <option key={db.id} value={db.id}>
                        {db.parent_id ? `↳ ${db.db_name}` : db.db_name}
                      </option>
                    ))}
                  </select>
                </div>

                {uploadMode === "file" ? (
                  <div>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed p-5 text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-racing-red bg-racing-red/10"
                          : "border-white/20 hover:border-white/40 bg-[#121318]/50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="*/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileSelected(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />

                      <UploadCloud className="w-6 h-6 text-racing-red mx-auto mb-1.5" />

                      {selectedFile ? (
                        <div>
                          <p className="text-xs font-mono font-bold text-white truncate max-w-xs mx-auto">
                            {selectedFile.name}
                          </p>
                          <p className="text-[10px] font-mono text-emerald-400 mt-0.5">
                            {formatBytes(selectedFile.size)} • Ready to upload
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-mono text-white font-bold">
                            Drop file here or click to browse
                          </p>
                          <p className="text-[10px] font-mono text-white/40 mt-0.5">
                            PDF, Excel (.xlsx/.csv), Word, CAD (.step/.dwg), ZIP, Images (up to 30 MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                      URL Link
                    </label>
                    <input
                      type="url"
                      required
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or https://..."
                      className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    File Title
                  </label>
                  <input
                    type="text"
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. Formula_Bharat_Rulebook_2026.pdf"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Brief description or context..."
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div className="shrink-0 p-4 sm:p-5 pt-3 border-t border-white/10 flex justify-end gap-2 bg-[#0b0c10]">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-1.5 bg-white/10 text-white text-xs font-mono uppercase hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Save to Storage</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CREATE FOLDER / BRANCH
      ========================================================================= */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-sm max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-racing-red" />
                <span>Create Folder / Branch</span>
              </h3>
              <button onClick={() => setShowCreateFolderModal(false)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Folder Name <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. 2026 Season or Telemetry Logs"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Parent Branch / Location
                  </label>
                  <select
                    value={newFolderParentId || "ROOT"}
                    onChange={(e) => setNewFolderParentId(e.target.value === "ROOT" ? null : e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-racing-red"
                  >
                    <option value="ROOT">Root Level (Top Level Folder)</option>
                    {databases.map((db) => (
                      <option key={db.id} value={db.id}>
                        {db.parent_id ? `↳ ${db.db_name}` : db.db_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newFolderDesc}
                    onChange={(e) => setNewFolderDesc(e.target.value)}
                    placeholder="What files will be kept here..."
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div className="shrink-0 p-4 pt-2 border-t border-white/10 flex justify-end gap-2 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setShowCreateFolderModal(false)}
                  className="px-3 py-1.5 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: EDIT / RENAME FOLDER
      ========================================================================= */}
      {editingFolder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-sm max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-racing-red" />
                <span>Rename Folder</span>
              </h3>
              <button onClick={() => setEditingFolder(null)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditFolderSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Folder Name <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editFolderDesc}
                    onChange={(e) => setEditFolderDesc(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div className="shrink-0 p-4 pt-2 border-t border-white/10 flex justify-end gap-2 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setEditingFolder(null)}
                  className="px-3 py-1.5 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: MOVE / BRANCH FOLDER (CHANGE PARENT)
      ========================================================================= */}
      {movingFolder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-sm max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <MoveRight className="w-4 h-4 text-racing-red" />
                <span>Move Folder Branch</span>
              </h3>
              <button onClick={() => setMovingFolder(null)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMoveFolderSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 space-y-3">
                <p className="text-xs font-mono text-white/60">
                  Moving folder: <strong className="text-white">{movingFolder.db_name}</strong>
                </p>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Select New Location / Parent Branch
                  </label>
                  <select
                    value={targetParentFolderId}
                    onChange={(e) => setTargetParentFolderId(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-racing-red"
                  >
                    <option value="ROOT">Root Level (No Parent)</option>
                    {databases
                      .filter((d) => d.id !== movingFolder.id)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.parent_id ? `↳ ${d.db_name}` : d.db_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="shrink-0 p-4 pt-2 border-t border-white/10 flex justify-end gap-2 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setMovingFolder(null)}
                  className="px-3 py-1.5 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black"
                >
                  Move Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: MOVE FILE TO ANOTHER FOLDER
      ========================================================================= */}
      {movingFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-sm max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <MoveRight className="w-4 h-4 text-racing-red" />
                <span>Move File</span>
              </h3>
              <button onClick={() => setMovingFile(null)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMoveFileSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 space-y-3">
                <p className="text-xs font-mono text-white/60">
                  Moving: <strong className="text-white break-words">{movingFile.file.file_name}</strong>
                </p>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Choose Destination Folder
                  </label>
                  <select
                    value={targetMoveFolderId}
                    onChange={(e) => setTargetMoveFolderId(e.target.value)}
                    required
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-racing-red"
                  >
                    {databases.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.parent_id ? `↳ ${d.db_name}` : d.db_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="shrink-0 p-4 pt-2 border-t border-white/10 flex justify-end gap-2 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setMovingFile(null)}
                  className="px-3 py-1.5 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black"
                >
                  Move File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: EDIT FILE DETAILS
      ========================================================================= */}
      {editingFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-sm max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <Edit2 className="w-3.5 h-3.5 text-racing-red" />
                <span>Edit File</span>
              </h3>
              <button onClick={() => setEditingFile(null)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditFileSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    File Name <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editFileCategory}
                    onChange={(e) => setEditFileCategory(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={editFileDesc}
                    onChange={(e) => setEditFileDesc(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div className="shrink-0 p-4 pt-2 border-t border-white/10 flex justify-end gap-2 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="px-3 py-1.5 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
