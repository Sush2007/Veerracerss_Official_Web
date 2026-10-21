"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Plus,
  Trash2,
  FileSpreadsheet,
  Edit2,
  Table,
  Check,
  X,
  Layers,
  Sparkles,
} from "lucide-react";
import { CustomDatabaseRecord, CustomDatabaseColumn } from "@/src/data/cms_defaults";
import { exportTableToExcel } from "@/src/lib/exportToExcel";

interface CustomDbsTabProps {
  databases: CustomDatabaseRecord[];
  onCreateDatabase: (newDb: Omit<CustomDatabaseRecord, "id" | "created_at" | "updated_at">) => Promise<void>;
  onDeleteDatabase: (id: string, name: string) => Promise<void>;
  onAddRecord: (dbId: string, record: Record<string, any>) => Promise<void>;
  onDeleteRecord: (dbId: string, recordId: string) => Promise<void>;
  onUpdateRecord?: (dbId: string, recordId: string, updatedRecord: Record<string, any>) => Promise<void>;
}

export function CustomDbsTab({
  databases,
  onCreateDatabase,
  onDeleteDatabase,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
}: CustomDbsTabProps) {
  const [activeDbId, setActiveDbId] = useState<string>(databases[0]?.id || "");
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, any> | null>(null);
  const [editRecordData, setEditRecordData] = useState<Record<string, any>>({});

  // New DB Form State
  const [dbName, setDbName] = useState("");
  const [dbDescription, setDbDescription] = useState("");
  const [columns, setColumns] = useState<CustomDatabaseColumn[]>([
    { key: "item_name", label: "Item Name", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "quantity", label: "Quantity", type: "number" },
  ]);
  const [newColLabel, setNewColLabel] = useState("");
  const [newColType, setNewColType] = useState<"text" | "number" | "date">("text");

  // New Record Form State
  const [recordData, setRecordData] = useState<Record<string, any>>({});

  // Lock body scroll whenever any custom database modal is open
  useEffect(() => {
    const isAnyOpen = Boolean(showCreateDbModal || showAddRecordModal || editingRecord);
    if (isAnyOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [showCreateDbModal, showAddRecordModal, editingRecord]);

  const activeDb = databases.find((db) => db.id === activeDbId) || databases[0];

  const handleAddColumn = () => {
    if (!newColLabel.trim()) return;
    const key = newColLabel.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
    setColumns([...columns, { key, label: newColLabel.trim(), type: newColType }]);
    setNewColLabel("");
  };

  const handleRemoveColumn = (index: number) => {
    if (columns.length <= 1) return alert("Database must have at least one column.");
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleCreateDbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbName.trim() || columns.length === 0) return;

    await onCreateDatabase({
      db_name: dbName.trim(),
      description: dbDescription.trim(),
      schema_definition: columns,
      records: [],
    });

    setShowCreateDbModal(false);
    setDbName("");
    setDbDescription("");
  };

  const handleAddRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDb) return;

    const newRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...recordData,
    };

    await onAddRecord(activeDb.id, newRecord);
    setShowAddRecordModal(false);
    setRecordData({});
  };

  const handleOpenEditRecord = (row: Record<string, any>) => {
    setEditingRecord(row);
    setEditRecordData({ ...row });
  };

  const handleEditRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDb || !editingRecord) return;

    if (onUpdateRecord) {
      await onUpdateRecord(activeDb.id, editingRecord.id, editRecordData);
    }
    setEditingRecord(null);
    setEditRecordData({});
  };

  const handleExportActiveDb = () => {
    if (!activeDb || activeDb.records.length === 0) {
      alert("No records to export in this database.");
      return;
    }

    const exportRows = activeDb.records.map((row) => {
      const cleanRow: Record<string, any> = {};
      activeDb.schema_definition.forEach((col) => {
        cleanRow[col.label] = row[col.key] !== undefined ? row[col.key] : "";
      });
      return cleanRow;
    });

    const safeName = activeDb.db_name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    exportTableToExcel(exportRows, `veerracerss-${safeName}`, activeDb.db_name);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#0b0c10] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1 text-[10px] font-mono uppercase text-racing-red font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>DYNAMIC CLUB REGISTRY & OPERATIONS DATABASE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white">
            Custom Club Databases
          </h2>
          <p className="text-xs font-mono text-white/50">
            Create custom data sheets for tools, equipment, testing runs, and partners with full Excel export.
          </p>
        </div>

        <button
          onClick={() => setShowCreateDbModal(true)}
          className="bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Database</span>
        </button>
      </div>

      {/* Database Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {databases.map((db) => (
          <button
            key={db.id}
            onClick={() => setActiveDbId(db.id)}
            className={`px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeDb?.id === db.id
                ? "bg-white/15 text-white border-b-2 border-racing-red"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Table className="w-3.5 h-3.5 text-racing-red" />
            <span>{db.db_name}</span>
            <span className="text-[10px] bg-black/50 px-1.5 py-0.2 rounded font-normal text-white/50">
              {db.records?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Active Database View */}
      {activeDb ? (
        <div className="bg-[#0b0c10] border border-white/10 p-6 space-y-5">
          {/* Active DB Info & Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-display font-black uppercase text-white">{activeDb.db_name}</h3>
              {activeDb.description && (
                <p className="text-xs font-sans text-white/60 font-light mt-0.5">{activeDb.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setRecordData({});
                  setShowAddRecordModal(true);
                }}
                className="px-3.5 py-2 bg-racing-red hover:bg-racing-red/90 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>

              <button
                onClick={handleExportActiveDb}
                className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export to Excel</span>
              </button>

              <button
                onClick={() => onDeleteDatabase(activeDb.id, activeDb.db_name)}
                className="p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 transition-colors"
                title="Delete this database"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Records Table */}
          {activeDb.records?.length === 0 ? (
            <div className="text-center py-12 text-white/40 font-mono text-xs uppercase tracking-widest">
              No entries logged in this database yet. Click "Add Record" to start logging data.
            </div>
          ) : (
            <div className="overflow-x-auto border border-white/10">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#121318] text-white/70 uppercase border-b border-white/10">
                  <tr>
                    {activeDb.schema_definition.map((col) => (
                      <th key={col.key} className="px-4 py-3 font-bold">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeDb.records.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                      {activeDb.schema_definition.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-white">
                          {row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : "-"}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditRecord(row)}
                            className="p-1 text-white/60 hover:text-white transition-colors"
                            title="Edit entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(activeDb.id, row.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0b0c10] border border-white/10 p-8">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">
            No custom databases created yet.
          </p>
          <button
            onClick={() => setShowCreateDbModal(true)}
            className="px-4 py-2 bg-racing-red text-white text-xs font-mono uppercase font-bold"
          >
            Create Your First Database
          </button>
        </div>
      )}

      {/* Modal: Create New Database */}
      {showCreateDbModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-xl max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-display font-black uppercase text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-racing-red" />
                <span>Define New Custom Database</span>
              </h3>
              <button onClick={() => setShowCreateDbModal(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDbSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                    Database Title <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                    placeholder="e.g. Battery Cell Batches or Tool Inventory"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">Description</label>
                  <input
                    type="text"
                    value={dbDescription}
                    onChange={(e) => setDbDescription(e.target.value)}
                    placeholder="Brief purpose of this database..."
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                {/* Define Columns */}
                <div className="border border-white/10 p-3.5 bg-black/30 space-y-3">
                  <span className="text-[11px] font-mono uppercase text-white/70 font-bold block">
                    Table Columns ({columns.length})
                  </span>

                  <div className="space-y-2">
                    {columns.map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#121318] p-2 border border-white/5 text-xs font-mono">
                        <span>{col.label} <span className="text-white/40">({col.type})</span></span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColumn(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newColLabel}
                      onChange={(e) => setNewColLabel(e.target.value)}
                      placeholder="New Column Name"
                      className="flex-1 bg-[#121318] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                    />
                    <select
                      value={newColType}
                      onChange={(e) => setNewColType(e.target.value as any)}
                      className="bg-[#121318] border border-white/10 px-2 py-1.5 text-xs font-mono text-white outline-none"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase"
                    >
                      Add Column
                    </button>
                  </div>
                </div>
              </div>

              <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setShowCreateDbModal(false)}
                  className="px-4 py-2 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black transition-all"
                >
                  Create Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Record to Active Database */}
      {showAddRecordModal && activeDb && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-lg max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white">
                Add Entry: {activeDb.db_name}
              </h3>
              <button onClick={() => setShowAddRecordModal(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecordSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-3.5">
                {activeDb.schema_definition.map((col) => (
                  <div key={col.key}>
                    <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                      {col.label}
                    </label>
                    <input
                      type={col.type === "number" ? "number" : col.type === "date" ? "date" : "text"}
                      required
                      value={recordData[col.key] || ""}
                      onChange={(e) =>
                        setRecordData({
                          ...recordData,
                          [col.key]: col.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value,
                        })
                      }
                      className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-4 py-2 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black transition-all"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Record in Active Database */}
      {editingRecord && activeDb && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="bg-[#0b0c10] border border-white/20 w-full max-w-lg max-h-[90vh] flex flex-col my-auto shadow-2xl relative overscroll-contain">
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-display font-black uppercase text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-racing-red" />
                <span>Edit Entry: {activeDb.db_name}</span>
              </h3>
              <button
                onClick={() => {
                  setEditingRecord(null);
                  setEditRecordData({});
                }}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditRecordSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-3.5">
                {activeDb.schema_definition.map((col) => (
                  <div key={col.key}>
                    <label className="text-[11px] font-mono uppercase text-white/50 mb-1 block">
                      {col.label}
                    </label>
                    <input
                      type={col.type === "number" ? "number" : col.type === "date" ? "date" : "text"}
                      value={editRecordData[col.key] !== undefined && editRecordData[col.key] !== null ? editRecordData[col.key] : ""}
                      onChange={(e) =>
                        setEditRecordData({
                          ...editRecordData,
                          [col.key]: col.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value,
                        })
                      }
                      className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="shrink-0 p-5 sm:p-6 pt-4 border-t border-white/10 flex justify-end gap-3 bg-[#0b0c10]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRecord(null);
                    setEditRecordData({});
                  }}
                  className="px-4 py-2 bg-white/10 text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-racing-red text-white text-xs font-mono font-bold uppercase hover:bg-white hover:text-black transition-all"
                >
                  Update Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
