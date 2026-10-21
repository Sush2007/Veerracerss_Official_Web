"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  Trash2,
  FileSpreadsheet,
  Search,
  Receipt,
  X,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { ClubExpense } from "@/src/data/cms_defaults";
import { exportTableToExcel } from "@/src/lib/exportToExcel";

interface ExpensesTabProps {
  expenses: ClubExpense[];
  uploading: boolean;
  onAddExpense: (expense: Omit<ClubExpense, "id" | "created_at">, receiptFile: File | null) => Promise<void>;
  onDeleteExpense: (id: string, title: string) => Promise<void>;
}

export function ExpensesTab({
  expenses,
  uploading,
  onAddExpense,
  onDeleteExpense,
}: ExpensesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  // Lock background body scroll when viewing receipt modal
  useEffect(() => {
    if (viewingReceipt) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [viewingReceipt]);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Mechanical & Chassis");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState("");
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
  const totalReceipts = expenses.filter((e) => Boolean(e.receipt_url)).length;

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
    <div className="space-y-6">
      
      {/* Clean Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0b0c10] border border-white/10 p-5">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">
            Total Logged Expenses
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            ₹{totalAmount.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] font-mono text-white/40">{expenses.length} Total Records</span>
        </div>

        <div className="bg-[#0b0c10] border border-white/10 p-5">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">
            Receipts Attached
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            {totalReceipts} / {expenses.length}
          </div>
          <span className="text-[10px] font-mono text-white/40">Verified Invoices</span>
        </div>

        <div className="bg-[#0b0c10] border border-white/10 p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">
            Spreadsheet Export
          </span>
          <button
            onClick={handleExport}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Expenses (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Add Form + Expenses Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-[#0b0c10] border border-white/10 p-5 sm:p-6 sticky top-24">
            <h2 className="text-base font-bold uppercase mb-4 flex items-center gap-2 font-display text-white">
              <Plus className="w-4 h-4 text-racing-red" />
              <span>Log Bill / Expense</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">
                  Description / Item <span className="text-racing-red">*</span>
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
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Domain / Category</label>
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
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Bill / Receipt Scan</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/60 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-mono file:cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-white/50 mb-1 block font-mono">Remarks / Invoice No</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Material specs, invoice number, or remarks..."
                  className="w-full bg-[#111115] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all disabled:opacity-50"
              >
                {uploading ? "Saving..." : "Record Expense"}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-[#0b0c10] border border-white/10 p-5 sm:p-6">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
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
              <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
                {filteredExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-black/50 border border-white/10 hover:border-white/20 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{exp.title}</span>
                        {exp.receipt_url && (
                          <button
                            onClick={() => setViewingReceipt(exp.receipt_url || null)}
                            className="text-[10px] font-mono text-racing-red hover:underline inline-flex items-center gap-1 shrink-0"
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
                        <p className="text-[11px] font-sans text-white/60 font-light pt-0.5">{exp.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="font-display font-black text-sm sm:text-base text-white">
                        ₹{Number(exp.amount).toLocaleString("en-IN")}
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] bg-[#0b0c10] border border-white/20 p-4 sm:p-6 my-auto relative flex flex-col overscroll-contain shadow-2xl">
            <div className="flex items-center justify-between mb-3 pr-8">
              <h4 className="text-xs font-mono uppercase text-white/70">Receipt / Invoice Document</h4>
              <a
                href={viewingReceipt}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-racing-red hover:underline flex items-center gap-1"
              >
                <span>Open in New Tab / Download</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {viewingReceipt.toLowerCase().includes(".pdf") || viewingReceipt.startsWith("data:application/pdf") ? (
              <iframe
                src={viewingReceipt}
                title="Receipt PDF Preview"
                className="w-full h-[75vh] rounded border border-white/10"
              />
            ) : (
              <img src={viewingReceipt} alt="Receipt" className="max-h-[75vh] w-auto object-contain mx-auto" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
