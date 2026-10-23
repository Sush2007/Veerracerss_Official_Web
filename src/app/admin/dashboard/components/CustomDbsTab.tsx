"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  FolderArchive,
  Folder,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileCode,
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
  Sparkles,
  HardDrive,
  FileCheck,
  Tag,
  Clock,
  Layers,
  Paperclip,
  Film
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
  uploaded_at: string;
  uploaded_by?: string;
}

interface CustomDbsTabProps {
  databases: CustomDatabaseRecord[];
  onCreateDatabase: (newDb: Omit<CustomDatabaseRecord, "id" | "created_at" | "updated_at">) => Promise<void>;
  onDeleteDatabase: (id: string, name: string) => Promise<void>;
  onAddRecord: (dbId: string, record: Record<string, any>) => Promise<void>;
  onDeleteRecord: (dbId: string, recordId: string) => Promise<void>;
  onUpdateRecord?: (dbId: string, recordId: string, updatedRecord: Record<string, any>) => Promise<void>;
  onUploadFile?: (file: File, folder?: string) => Promise<string>;
}

export function CustomDbsTab({
  databases,
  onCreateDatabase,
  onDeleteDatabase,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  onUploadFile,
}: CustomDbsTabProps) {
  // Navigation / Filter State
  const [activeSpaceId, setActiveSpaceId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [editingFile, setEditingFile] = useState<{ spaceId: string; file: StorageFileRecord } | null>(null);

  // New Space Form State
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceDesc, setNewSpaceDesc] = useState("");

  // Upload Form State
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");
  const [targetSpaceId, setTargetSpaceId] = useState<string>("");
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

  // Lock body scroll whenever any storage modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(showUploadModal || showCreateSpaceModal || editingFile);
    if (isAnyModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [showUploadModal, showCreateSpaceModal, editingFile]);

  // Keep targetSpaceId valid
  useEffect(() => {
    if (databases.length > 0 && !targetSpaceId) {
      setTargetSpaceId(databases[0].id);
    }
  }, [databases, targetSpaceId]);

  // Normalize all files across databases
  const allStoredFiles = useMemo(() => {
    const files: Array<{ spaceId: string; spaceName: string; file: StorageFileRecord }> = [];

    databases.forEach((db) => {
      (db.records || []).forEach((rec: any) => {
        // Adapt record to standard StorageFileRecord
        const fileRecord: StorageFileRecord = {
          id: rec.id || `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          file_name: rec.file_name || rec.name || rec.item_name || rec.tool_name || rec.company_name || "Document",
          file_url: rec.file_url || rec.url || rec.link || "",
          file_size: rec.file_size || (rec.quantity ? `${rec.quantity} units` : "N/A"),
          file_type: rec.file_type || (rec.file_name ? rec.file_name.split(".").pop() : "") || "file",
          category: rec.category || rec.domain || rec.tier || db.db_name,
          description: rec.description || rec.condition || rec.poc_name || "",
          uploaded_at: rec.uploaded_at || rec.created_at || new Date().toISOString(),
          uploaded_by: rec.uploaded_by || "Admin",
        };

        files.push({
          spaceId: db.id,
          spaceName: db.db_name,
          file: fileRecord,
        });
      });
    });

    return files;
  }, [databases]);

  // Filtered files according to space, search, and type
  const filteredFiles = useMemo(() => {
    return allStoredFiles.filter(({ spaceId, file }) => {
      // Space filter
      if (activeSpaceId !== "ALL" && spaceId !== activeSpaceId) {
        return false;
      }

      // Type filter
      if (selectedTypeFilter !== "ALL") {
        const ext = (file.file_name.split(".").pop() || file.file_type || "").toLowerCase();
        if (selectedTypeFilter === "PDF" && ext !== "pdf") return false;
        if (selectedTypeFilter === "EXCEL" && !["xlsx", "xls", "csv"].includes(ext)) return false;
        if (selectedTypeFilter === "WORD" && !["doc", "docx"].includes(ext)) return false;
        if (selectedTypeFilter === "IMAGE" && !["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext)) return false;
        if (selectedTypeFilter === "CAD" && !["step", "stp", "dwg", "dxf", "stl", "iges", "igs"].includes(ext)) return false;
        if (selectedTypeFilter === "ZIP" && !["zip", "rar", "7z", "tar", "gz"].includes(ext)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = file.file_name.toLowerCase().includes(q);
        const matchesCategory = (file.category || "").toLowerCase().includes(q);
        const matchesDesc = (file.description || "").toLowerCase().includes(q);
        const matchesType = (file.file_type || "").toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [allStoredFiles, activeSpaceId, selectedTypeFilter, searchQuery]);

  // Helper: Format byte size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper: File Type Metadata & Icon badge
  const getFileIconInfo = (fileName: string, rawType?: string) => {
    const ext = (fileName.split(".").pop() || rawType || "").toLowerCase();

    if (ext === "pdf") {
      return {
        badge: "PDF",
        badgeBg: "bg-red-500/15 text-red-400 border-red-500/30",
        icon: FileText,
        color: "text-red-400",
      };
    }
    if (["xlsx", "xls", "csv"].includes(ext)) {
      return {
        badge: ext.toUpperCase(),
        badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        icon: FileSpreadsheet,
        color: "text-emerald-400",
      };
    }
    if (["doc", "docx"].includes(ext)) {
      return {
        badge: "DOC",
        badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
        icon: FileText,
        color: "text-blue-400",
      };
    }
    if (["ppt", "pptx"].includes(ext)) {
      return {
        badge: "PPT",
        badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        icon: FileText,
        color: "text-amber-400",
      };
    }
    if (["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext)) {
      return {
        badge: "IMG",
        badgeBg: "bg-purple-500/15 text-purple-400 border-purple-500/30",
        icon: ImageIcon,
        color: "text-purple-400",
      };
    }
    if (["step", "stp", "dwg", "dxf", "stl", "iges", "igs"].includes(ext)) {
      return {
        badge: "CAD",
        badgeBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
        icon: Box,
        color: "text-cyan-400",
      };
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
      return {
        badge: "ZIP",
        badgeBg: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
        icon: Archive,
        color: "text-yellow-400",
      };
    }
    if (["mp4", "mov", "avi", "mkv"].includes(ext)) {
      return {
        badge: "VIDEO",
        badgeBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        icon: Film,
        color: "text-rose-400",
      };
    }

    return {
      badge: (ext.substring(0, 4) || "FILE").toUpperCase(),
      badgeBg: "bg-white/10 text-white/70 border-white/20",
      icon: Paperclip,
      color: "text-white/70",
    };
  };

  // Drag and Drop File Handlers
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

  // Submit Upload File
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    const targetSpace = databases.find((db) => db.id === targetSpaceId) || databases[0];
    if (!targetSpace) {
      setUploadError("Please select a target storage space first.");
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
          // Fallback Supabase upload
          const supabase = createClient();
          const cleanExt = (selectedFile.name.split(".").pop() || "bin").toLowerCase();
          const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storagePath = `storage-vault/${Date.now()}-${safeName}`;

          const { error: uploadErr } = await supabase.storage
            .from("member-images")
            .upload(storagePath, selectedFile, {
              upsert: true,
              contentType: selectedFile.type || "application/octet-stream",
            });

          if (uploadErr) {
            console.warn("Storage upload note:", uploadErr.message);
            // Fallback for smaller files: convert to base64 data URI
            if (selectedFile.size < 4 * 1024 * 1024) {
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
              });
              finalUrl = base64;
            } else {
              throw new Error(uploadErr.message || "Failed to upload file to storage.");
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
        file_name: fileName.trim() || selectedFile?.name || "Uploaded Document",
        file_url: finalUrl,
        file_size: sizeStr,
        file_type: ext || (selectedFile?.type ? selectedFile.type.split("/").pop() : "file"),
        category: fileCategory.trim() || targetSpace.db_name,
        description: fileDescription.trim(),
        uploaded_at: new Date().toISOString(),
        uploaded_by: "Admin",
      };

      await onAddRecord(targetSpace.id, newRecord);

      // Reset Form
      setShowUploadModal(false);
      setSelectedFile(null);
      setFileName("");
      setFileUrl("");
      setFileDescription("");
      setFileCategory("General");
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Create New Storage Space
  const handleCreateSpaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;

    await onCreateDatabase({
      db_name: newSpaceName.trim(),
      description: newSpaceDesc.trim() || "Club Document & File Storage Space",
      schema_definition: [],
      records: [],
    });

    setShowCreateSpaceModal(false);
    setNewSpaceName("");
    setNewSpaceDesc("");
  };

  // Submit Edit File
  const handleEditFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile || !onUpdateRecord) return;

    const updatedRecord: Partial<StorageFileRecord> = {
      file_name: editFileName.trim() || editingFile.file.file_name,
      category: editFileCategory.trim() || editingFile.file.category,
      description: editFileDesc.trim(),
    };

    await onUpdateRecord(editingFile.spaceId, editingFile.file.id, updatedRecord);
    setEditingFile(null);
  };

  // Copy URL to Clipboard
  const handleCopyUrl = (id: string, url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-[#0b0c10] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1 text-[10px] font-mono uppercase text-racing-red font-bold">
            <HardDrive className="w-3.5 h-3.5 text-racing-red" />
            <span>CLOUD STORAGE VAULT & OPERATIONS REPOSITORY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            Club File Storage Space
          </h2>
          <p className="text-xs font-mono text-white/50 max-w-2xl mt-0.5">
            Centralized storage space for VeerRacerss team documents, Formula Bharat rulebooks, CAD drawings, Excel spreadsheets, sponsorship MoUs, and testing data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCreateSpaceModal(true)}
            className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Folder className="w-4 h-4 text-racing-red" />
            <span>New Space / Folder</span>
          </button>

          <button
            onClick={() => {
              setShowUploadModal(true);
              setUploadError(null);
            }}
            className="px-4 py-2.5 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Storage Spaces / Folders Filter Bar */}
      <div className="bg-[#0b0c10] border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/5">
          <span className="text-[11px] font-mono uppercase text-white/50 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-racing-red" />
            <span>Storage Spaces ({databases.length})</span>
          </span>
          <span className="text-[11px] font-mono text-white/40">
            Total Files Stored: <strong className="text-white">{allStoredFiles.length}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSpaceId("ALL")}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeSpaceId === "ALL"
                ? "bg-white/15 text-white border-b-2 border-racing-red"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-racing-red" />
            <span>All Spaces & Files</span>
            <span className="text-[10px] bg-black/60 px-1.5 py-0.2 rounded font-normal text-white/50">
              {allStoredFiles.length}
            </span>
          </button>

          {databases.map((db) => {
            const count = (db.records || []).length;
            const isSelected = activeSpaceId === db.id;

            return (
              <div key={db.id} className="relative group flex items-center">
                <button
                  onClick={() => setActiveSpaceId(db.id)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                    isSelected
                      ? "bg-white/15 text-white border-b-2 border-racing-red"
                      : "bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-racing-red" />
                  <span className="max-w-[180px] truncate">{db.db_name}</span>
                  <span className="text-[10px] bg-black/60 px-1.5 py-0.2 rounded font-normal text-white/50">
                    {count}
                  </span>
                </button>

                {databases.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDatabase(db.id, db.db_name);
                    }}
                    className="ml-1 p-1 text-white/30 hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity"
                    title={`Delete Space "${db.db_name}"`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search, Filter Pills & View Mode Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0b0c10] border border-white/10 p-3.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files by name, type, or notes..."
            className="w-full bg-[#121318] border border-white/10 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-white/40 focus:border-racing-red outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* File Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "ALL", label: "All" },
            { id: "PDF", label: "PDFs" },
            { id: "EXCEL", label: "Excel / CSV" },
            { id: "WORD", label: "Word Docs" },
            { id: "IMAGE", label: "Images" },
            { id: "CAD", label: "CAD / 3D" },
            { id: "ZIP", label: "Archives" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedTypeFilter(type.id)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded transition-all ${
                selectedTypeFilter === type.id
                  ? "bg-racing-red text-white font-bold"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-white/10 p-1 bg-[#121318] self-end md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 transition-colors ${
              viewMode === "grid" ? "bg-racing-red text-white" : "text-white/40 hover:text-white"
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 transition-colors ${
              viewMode === "list" ? "bg-racing-red text-white" : "text-white/40 hover:text-white"
            }`}
            title="Table / List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Files Display Area */}
      {filteredFiles.length === 0 ? (
        <div className="bg-[#0b0c10] border border-white/10 p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/5 flex items-center justify-center text-white/40">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-display font-black uppercase text-white">No Files Found</h3>
            <p className="text-xs font-mono text-white/50 max-w-md mx-auto mt-1">
              {searchQuery || selectedTypeFilter !== "ALL"
                ? "No uploaded files match your active search and filter criteria."
                : "No files have been uploaded to this storage space yet. Upload any PDF, Excel spreadsheet, CAD model, or document."}
            </p>
          </div>
          <button
            onClick={() => {
              setShowUploadModal(true);
              setUploadError(null);
            }}
            className="px-4 py-2 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase transition-all"
          >
            Upload First File
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map(({ spaceId, spaceName, file }) => {
            const iconInfo = getFileIconInfo(file.file_name, file.file_type);
            const IconComponent = iconInfo.icon;
            const isCopied = copiedId === file.id;

            return (
              <div
                key={`${spaceId}-${file.id}`}
                className="bg-[#0b0c10] border border-white/10 hover:border-racing-red/60 p-4 flex flex-col justify-between transition-all group hover:shadow-lg relative"
              >
                {/* Card Top: Type Badge & Actions */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${iconInfo.badgeBg}`}
                    >
                      {iconInfo.badge}
                    </span>

                    <span className="text-[10px] font-mono text-white/40 truncate max-w-[130px]">
                      {spaceName}
                    </span>
                  </div>

                  {/* File Icon & Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 bg-[#121318] border border-white/5 text-white shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent className={`w-5 h-5 ${iconInfo.color}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-xs font-mono font-bold text-white group-hover:text-racing-red transition-colors break-words line-clamp-2"
                        title={file.file_name}
                      >
                        {file.file_name}
                      </h4>
                      <p className="text-[11px] font-mono text-white/40 mt-0.5">
                        {file.file_size || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Description / Notes if present */}
                  {file.description && (
                    <p className="text-[11px] font-sans text-white/60 font-light line-clamp-2 mb-3 bg-black/30 p-2 border border-white/5">
                      {file.description}
                    </p>
                  )}

                  {/* Category Tag */}
                  {file.category && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-mono text-white/50 mb-4 bg-white/5 px-2 py-0.5">
                      <Tag className="w-3 h-3 text-racing-red" />
                      <span className="truncate max-w-[160px]">{file.category}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Open / Preview Button */}
                    {file.file_url && (
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-racing-red hover:bg-white hover:text-black text-white text-[11px] font-mono font-bold uppercase flex items-center gap-1 transition-colors"
                        title="Open or View File"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open</span>
                      </a>
                    )}

                    {/* Direct Download */}
                    {file.file_url && (
                      <a
                        href={file.file_url}
                        download={file.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                        title="Download File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Copy Link */}
                    {file.file_url && (
                      <button
                        onClick={() => handleCopyUrl(file.id, file.file_url)}
                        className={`p-1.5 transition-colors ${
                          isCopied
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/5 hover:bg-white/15 text-white/70 hover:text-white"
                        }`}
                        title={isCopied ? "Link Copied!" : "Copy Public Link"}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Edit & Delete Controls */}
                  <div className="flex items-center gap-1">
                    {onUpdateRecord && (
                      <button
                        onClick={() => {
                          setEditingFile({ spaceId, file });
                          setEditFileName(file.file_name);
                          setEditFileCategory(file.category || "");
                          setEditFileDesc(file.description || "");
                        }}
                        className="p-1.5 text-white/40 hover:text-white transition-colors"
                        title="Edit file details"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteRecord(spaceId, file.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className="bg-[#0b0c10] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121318] text-white/70 uppercase border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-bold">Type</th>
                <th className="px-4 py-3 font-bold">File Name</th>
                <th className="px-4 py-3 font-bold">Space / Folder</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Size</th>
                <th className="px-4 py-3 font-bold">Uploaded</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFiles.map(({ spaceId, spaceName, file }) => {
                const iconInfo = getFileIconInfo(file.file_name, file.file_type);
                const IconComponent = iconInfo.icon;
                const isCopied = copiedId === file.id;

                return (
                  <tr key={`${spaceId}-${file.id}`} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${iconInfo.badgeBg}`}
                      >
                        {iconInfo.badge}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 shrink-0 ${iconInfo.color}`} />
                        <span className="font-bold text-white max-w-xs truncate" title={file.file_name}>
                          {file.file_name}
                        </span>
                      </div>
                      {file.description && (
                        <p className="text-[11px] text-white/50 font-sans truncate max-w-sm mt-0.5">
                          {file.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/60">{spaceName}</td>
                    <td className="px-4 py-3 text-white/60">{file.category || "-"}</td>
                    <td className="px-4 py-3 text-white/70">{file.file_size || "N/A"}</td>
                    <td className="px-4 py-3 text-white/50 text-[11px]">
                      {file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {file.file_url && (
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-racing-red text-white hover:bg-white hover:text-black transition-colors"
                            title="Open File"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {file.file_url && (
                          <button
                            onClick={() => handleCopyUrl(file.id, file.file_url)}
                            className={`p-1.5 transition-colors ${
                              isCopied
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-white/5 hover:bg-white/15 text-white/70 hover:text-white"
                            }`}
                            title="Copy link"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}

                        {onUpdateRecord && (
                          <button
                            onClick={() => {
                              setEditingFile({ spaceId, file });
                              setEditFileName(file.file_name);
                              setEditFileCategory(file.category || "");
                              setEditFileDesc(file.description || "");
                            }}
                            className="p-1.5 text-white/40 hover:text-white transition-colors"
                            title="Edit details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteRecord(spaceId, file.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
          MODAL 1: UPLOAD FILE (DRAG & DROP OR BROWSE)
      ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-lg max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            {/* Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-display font-black uppercase text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-racing-red" />
                <span>Upload Document / File to Storage</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUploadSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
                {uploadError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    {uploadError}
                  </div>
                )}

                {/* Upload Mode Selector */}
                <div className="flex border border-white/10 p-1 bg-[#121318] gap-1">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`flex-1 py-1.5 text-xs font-mono uppercase font-bold transition-all ${
                      uploadMode === "file" ? "bg-racing-red text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    Direct File Upload (Any Type)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("link")}
                    className={`flex-1 py-1.5 text-xs font-mono uppercase font-bold transition-all ${
                      uploadMode === "link" ? "bg-racing-red text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    External Link / Cloud URL
                  </button>
                </div>

                {/* Target Storage Space */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    Target Storage Space / Folder <span className="text-racing-red">*</span>
                  </label>
                  <select
                    value={targetSpaceId}
                    onChange={(e) => setTargetSpaceId(e.target.value)}
                    required
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-racing-red"
                  >
                    {databases.map((db) => (
                      <option key={db.id} value={db.id}>
                        {db.db_name}
                      </option>
                    ))}
                  </select>
                </div>

                {uploadMode === "file" ? (
                  /* Drag and Drop Zone */
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                      Choose File <span className="text-racing-red">*</span>
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-racing-red bg-racing-red/10"
                          : "border-white/15 hover:border-white/30 bg-[#121318]/50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileSelected(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />

                      <div className="w-10 h-10 mx-auto rounded-full bg-white/5 flex items-center justify-center text-racing-red mb-2">
                        <UploadCloud className="w-5 h-5" />
                      </div>

                      {selectedFile ? (
                        <div className="space-y-1">
                          <p className="text-xs font-mono font-bold text-white break-words">
                            {selectedFile.name}
                          </p>
                          <p className="text-[10px] font-mono text-emerald-400">
                            {formatBytes(selectedFile.size)} • Ready for upload
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-white/80">
                            Click to browse or drag & drop any file here
                          </p>
                          <p className="text-[10px] font-mono text-white/40">
                            PDF, Excel (.xlsx/.csv), Word, Images, CAD (.step/.dwg), ZIP archives
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* External URL Input */
                  <div>
                    <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                      File / Document URL <span className="text-racing-red">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or https://..."
                      className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                )}

                {/* Display Name */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    File Display Title <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. Formula_Bharat_Rulebook_2026.pdf"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                {/* Category / Tag */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    Category / Tag
                  </label>
                  <input
                    type="text"
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value)}
                    placeholder="e.g. Rulebooks, FEA Analysis, Sponsorship, Invoices"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                {/* Notes / Description */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    Description / Purpose / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Brief notes or engineering context for this document..."
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-white/10 text-white text-xs font-mono uppercase hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Save to Storage</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CREATE NEW STORAGE SPACE / FOLDER
      ========================================================================= */}
      {showCreateSpaceModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-md max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <Folder className="w-4 h-4 text-racing-red" />
                <span>Create New Storage Space</span>
              </h3>
              <button
                onClick={() => setShowCreateSpaceModal(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSpaceSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    Space Title / Folder Name <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    placeholder="e.g. Testing Telemetry Logs or Technical Regulations"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newSpaceDesc}
                    onChange={(e) => setNewSpaceDesc(e.target.value)}
                    placeholder="Brief description of what files are stored in this space..."
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none resize-none"
                  />
                </div>
              </div>

              <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setShowCreateSpaceModal(false)}
                  className="px-4 py-2 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black transition-all"
                >
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: EDIT FILE DETAILS
      ========================================================================= */}
      {editingFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-md max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-racing-red" />
                <span>Edit File Details</span>
              </h3>
              <button onClick={() => setEditingFile(null)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditFileSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    File Name <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    Category / Tag
                  </label>
                  <input
                    type="text"
                    value={editFileCategory}
                    onChange={(e) => setEditFileCategory(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    Description / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editFileDesc}
                    onChange={(e) => setEditFileDesc(e.target.value)}
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none resize-none"
                  />
                </div>
              </div>

              <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="px-4 py-2 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
