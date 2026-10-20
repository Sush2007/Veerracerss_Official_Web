"use client";

import { useState } from "react";
import {
  DollarSign,
  Plus,
  Trash2,
  FileSpreadsheet,
  Search,
  Receipt,
  ExternalLink,
  CheckCircle2,
  Clock,
  Check,
  X,
  Tag,
  AlertCircle,
} from "lucide-react";
import { ClubExpense } from "@/src/data/cms_defaults";
import { exportTableToExcel } from "@/src/lib/exportToExcel";

interface ExpensesTabProps {
  expenses: ClubExpense[];
  uploading: boolean;
  onAddExpense: (expense: Omit<ClubExpense, "id" | "created_at">, receiptFile: File | null) => Promise<void>;
  onDeleteExpense: (id: string, title: string) => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export function ExpensesTab({
  expenses,
  uploading,
  onAddExpense,
  onDeleteExpense,
  onUpdateStatus,
}: ExpensesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Mechanical & Chassis");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState("");
  const [status, setStatus] = useState("Approved");
  const [notes, setNotes] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const categories = [
    "Mechanical & Chassis",
    "Electronics & HV Powertrain",
    "Suspension, Steering & Wheels",
    "Braking & Hydraulics",
    "Safety & Scrutiny",
    "Competition Registration & Logistics",
    "Workshop Tooling & Consumables",
    "PR, Branding & Merchandise",
  ];

  // Calculate Metrics
  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const approvedAmount = expenses
    .filter((e) => e.status === "Approved")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const pendingAmount = expenses
    .filter((e) => e.status === "Pending")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const filteredExpenses = expenses.filter((e) => {
    const matchesCat = selectedCategory === "ALL" || e.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      e.title.toLowerCase().includes(query) ||
      (e.vendor && e.vendor.toLowerCase().includes(query)) ||
      (e.paid_by && e.paid_by.toLowerCase().includes(query)) ||
      (e.notes && e.notes.toLowerCase().includes(query));

    return matchesCat && matchesSearch;
  });

  const handleExport = () => {
    exportTableToExcel(
      filteredExpenses.map((e) => ({
        "Expense Item / Title": e.title,
        "Category": e.category,
        "Amount (INR)": e.amount,
        "Vendor": e.vendor || "N/A",
        "Date": e.expense_date,
        "Paid By": e.paid_by || "N/A",
        "Approval Status": e.status,
        "Receipt URL": e.receipt_url || "No Receipt",
        "Notes": e.notes || "",
      })),
      "veerracerss-club-expenses",
      "Expenses & Bills"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    await onAddExpense(
      {
        title,
        category,
        amount: parseFloat(amount) || 0,
        vendor,
        expense_date: expenseDate,
        paid_by: paidBy,
        status,
        notes,
      },
      receiptFile
    );

    // Reset Form
    setTitle("");
    setAmount("");
    setVendor("");
    setPaidBy("");
    setNotes("");
    setReceiptFile(null);
  };

  return (
    <div className="space-y-8">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0b0c10] border border-white/10 p-5">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">
            Total Logged Expenses
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            ₹{totalAmount.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] font-mono text-white/40">{expenses.length} Total Vouchers</span>
        </div>

        <div className="bg-[#0b0c10] border border-emerald-500/30 p-5">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
            Approved & Committed
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-300">
            ₹{approvedAmount.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] font-mono text-white/40">Verified by Technical Council</span>
        </div>

        <div className="bg-[#0b0c10] border border-amber-500/30 p-5">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
            Pending Reimbursement
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-amber-300">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] font-mono text-white/40">Awaiting Settlement</span>
        </div>

        <div className="bg-[#0b0c10] border border-white/10 p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">
            Excel Export
          </span>
          <button
            onClick={handleExport}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Add Form + Expenses Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-[#0b0c10] border border-white/10 p-6 sticky top-24">
            <h2 className="text-base font-bold uppercase mb-4 flex items-center gap-2 font-display text-white">
              <Plus className="w-4 h-4 text-racing-red" />
              <span>Record New Expense / Bill</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">
                  Item Description / Title <span className="text-racing-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AISI 4130 Tubes for Roll Hoop"
                  className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">
                    Amount (₹) <span className="text-racing-red">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="42500"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Date</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Vendor / Store</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Tubes India Corp"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Paid By</label>
                  <input
                    type="text"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    placeholder="Lead / Member Name"
                    className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Reimbursed">Reimbursed</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Receipt / Invoice Scan</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Notes / Invoice No</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Material specs, PO number, or remarks..."
                  className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all disabled:opacity-50"
              >
                {uploading ? "Recording..." : "Log Bill / Expense"}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-[#0b0c10] border border-white/10 p-6">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item, vendor, or payer..."
                  className="w-full bg-[#111115] border border-white/10 pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder:text-white/30 focus:border-racing-red outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#111115] border border-white/10 px-3 py-1.5 text-xs font-mono text-white/80 focus:border-racing-red outline-none uppercase"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Expenses List */}
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12 text-white/40 font-mono text-xs uppercase tracking-widest">
                No expense vouchers found matching filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-black/50 border border-white/10 hover:border-white/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{exp.title}</span>
                        {exp.receipt_url && (
                          <button
                            onClick={() => setViewingReceipt(exp.receipt_url || null)}
                            className="text-[10px] font-mono text-racing-red hover:underline inline-flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-white/50">
                        <span className="bg-white/10 px-1.5 py-0.5 text-white/70">{exp.category}</span>
                        <span>• Date: {exp.expense_date}</span>
                        {exp.vendor && <span>• Vendor: {exp.vendor}</span>}
                        {exp.paid_by && <span>• Paid by: {exp.paid_by}</span>}
                      </div>

                      {exp.notes && (
                        <p className="text-[11px] font-sans text-white/60 font-light pt-1">{exp.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <div className="font-display font-black text-base text-white">
                          ₹{Number(exp.amount).toLocaleString("en-IN")}
                        </div>
                        <select
                          value={exp.status}
                          onChange={(e) => onUpdateStatus(exp.id, e.target.value)}
                          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border outline-none cursor-pointer ${
                            exp.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : exp.status === "Reimbursed"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <option value="Approved" className="bg-[#111] text-white">Approved</option>
                          <option value="Pending" className="bg-[#111] text-white">Pending</option>
                          <option value="Reimbursed" className="bg-[#111] text-white">Reimbursed</option>
                        </select>
                      </div>

                      <button
                        onClick={() => onDeleteExpense(exp.id, exp.title)}
                        className="p-1.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        title="Delete voucher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="max-w-2xl max-h-[90vh] bg-[#0b0c10] border border-white/20 p-4 relative">
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-xs font-mono uppercase text-white/70 mb-3">Receipt / Invoice Document</h4>
            <img src={viewingReceipt} alt="Receipt" className="max-h-[75vh] w-auto object-contain mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
