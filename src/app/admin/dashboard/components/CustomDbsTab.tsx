"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  FolderArchive,
  Folder,
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
  // Navigation & Filter State
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

  // Prevent background scrolling while modal is open
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

  // Filtered files
  const filteredFiles = useMemo(() => {
    return allStoredFiles.filter(({ spaceId, file }) => {
      if (activeSpaceId !== "ALL" && spaceId !== activeSpaceId) return false;

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
  }, [allStoredFiles, activeSpaceId, selectedTypeFilter, searchQuery]);

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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    const targetSpace = databases.find((db) => db.id === targetSpaceId) || databases[0];
    if (!targetSpace) {
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
        category: fileCategory.trim() || targetSpace.db_name,
        description: fileDescription.trim(),
        uploaded_at: new Date().toISOString(),
        uploaded_by: "Admin",
      };

      await onAddRecord(targetSpace.id, newRecord);

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

  const handleCopyUrl = (id: string, url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. COMPACT UNIFIED TOP BAR */}
      <div className="bg-[#0b0c10] border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-racing-red/10 border border-racing-red/20 text-racing-red shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-display font-black uppercase text-white tracking-wide">
                Storage Vault
              </h2>
              <span className="text-[10px] font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-bold">
                {allStoredFiles.length} files
              </span>
            </div>
            <p className="text-xs font-mono text-white/50">
              PDFs, Excel sheets, CAD models, images & documents (up to 30 MB)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowCreateSpaceModal(true)}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            title="Create a new folder or category"
          >
            <Folder className="w-3.5 h-3.5 text-racing-red" />
            <span>New Folder</span>
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

      {/* 2. SLIM CONTROLS BAR: Folders, Search, Filters & View Toggle */}
      <div className="bg-[#0b0c10] border border-white/10 p-3 space-y-3">
        {/* Folder Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveSpaceId("ALL")}
            className={`shrink-0 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
              activeSpaceId === "ALL"
                ? "bg-racing-red text-white"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <FolderArchive className="w-3 h-3" />
            <span>All Files</span>
            <span className="text-[10px] opacity-75">({allStoredFiles.length})</span>
          </button>

          {databases.map((db) => {
            const count = (db.records || []).length;
            const isSelected = activeSpaceId === db.id;
            return (
              <div key={db.id} className="relative group shrink-0 flex items-center">
                <button
                  onClick={() => setActiveSpaceId(db.id)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-racing-red text-white"
                      : "bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  <Folder className="w-3 h-3" />
                  <span className="max-w-[140px] truncate">{db.db_name}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
                {databases.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDatabase(db.id, db.db_name);
                    }}
                    className="ml-0.5 p-1 text-white/30 hover:text-red-400 transition-colors"
                    title={`Delete folder "${db.db_name}"`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Search, Filter Pills & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-white/5">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by file name or notes..."
              className="w-full bg-[#121318] border border-white/10 pl-8 pr-7 py-1.5 text-xs font-mono text-white placeholder-white/40 focus:border-racing-red outline-none rounded-none"
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
            {/* Format Type Filters */}
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
                  className={`px-2 py-1 uppercase rounded-none transition-all ${
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
      </div>

      {/* 3. MAIN FILES CONTENT: COMPACT GRID OR SLEEK TABLE */}
      {filteredFiles.length === 0 ? (
        <div className="bg-[#0b0c10] border border-white/10 p-8 text-center space-y-3">
          <UploadCloud className="w-8 h-8 text-white/30 mx-auto" />
          <p className="text-xs font-mono text-white/50">
            {searchQuery || selectedTypeFilter !== "ALL"
              ? "No files match active filters."
              : "No documents stored here yet."}
          </p>
          <button
            onClick={() => {
              setShowUploadModal(true);
              setUploadError(null);
            }}
            className="px-3.5 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase"
          >
            Upload File
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* SLEEK COMPACT CARDS (Clean horizontal rows with high information density) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredFiles.map(({ spaceId, spaceName, file }) => {
            const iconInfo = getFileIconInfo(file.file_name, file.file_type);
            const IconComponent = iconInfo.icon;
            const isCopied = copiedId === file.id;

            return (
              <div
                key={`${spaceId}-${file.id}`}
                className="bg-[#0b0c10] border border-white/10 hover:border-racing-red/60 p-3 flex items-center justify-between gap-3 transition-colors group"
              >
                {/* File Icon & Info */}
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
                      <span className="truncate max-w-[100px]">{spaceName}</span>
                      {file.uploaded_at && (
                        <>
                          <span>•</span>
                          <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Icons */}
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

                  {onUpdateRecord && (
                    <button
                      onClick={() => {
                        setEditingFile({ spaceId, file });
                        setEditFileName(file.file_name);
                        setEditFileCategory(file.category || "");
                        setEditFileDesc(file.description || "");
                      }}
                      className="p-1.5 text-white/30 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteRecord(spaceId, file.id)}
                    className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST / TABLE VIEW */
        <div className="bg-[#0b0c10] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121318] text-white/60 uppercase border-b border-white/10 text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Format</th>
                <th className="px-3.5 py-2.5">Name</th>
                <th className="px-3.5 py-2.5">Folder</th>
                <th className="px-3.5 py-2.5">Size</th>
                <th className="px-3.5 py-2.5">Date</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFiles.map(({ spaceId, spaceName, file }) => {
                const iconInfo = getFileIconInfo(file.file_name, file.file_type);
                const IconComponent = iconInfo.icon;
                const isCopied = copiedId === file.id;

                return (
                  <tr key={`${spaceId}-${file.id}`} className="hover:bg-white/[0.02] transition-colors">
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
                    <td className="px-3.5 py-2 text-white/60">{spaceName}</td>
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

                        {onUpdateRecord && (
                          <button
                            onClick={() => {
                              setEditingFile({ spaceId, file });
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
                          onClick={() => onDeleteRecord(spaceId, file.id)}
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
          MODAL 1: CLEAN, UNCLUTTERED UPLOAD MODAL
      ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-lg max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-racing-red" />
                <span>Upload Document / File</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white/50 hover:text-white"
              >
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

                {/* Upload Mode Toggle */}
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

                {/* Folder Selector */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Folder / Space
                  </label>
                  <select
                    value={targetSpaceId}
                    onChange={(e) => setTargetSpaceId(e.target.value)}
                    required
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-racing-red"
                  >
                    {databases.map((db) => (
                      <option key={db.id} value={db.id}>
                        {db.db_name}
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
                            Supports PDF, Excel (.xlsx/.csv), Word, CAD (.step/.dwg), ZIP, Images (up to 30 MB)
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

                {/* File Title */}
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

                {/* Optional Description / Notes */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Brief note on what this document contains..."
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
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
          MODAL 2: CREATE FOLDER
      ========================================================================= */}
      {showCreateSpaceModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-sm max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <Folder className="w-4 h-4 text-racing-red" />
                <span>New Folder</span>
              </h3>
              <button onClick={() => setShowCreateSpaceModal(false)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSpaceSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/50 mb-1 block">
                    Folder Name <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    placeholder="e.g. Telemetry Logs"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div className="shrink-0 p-4 pt-2 border-t border-white/10 flex justify-end gap-2 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setShowCreateSpaceModal(false)}
                  className="px-3 py-1.5 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: EDIT FILE
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
