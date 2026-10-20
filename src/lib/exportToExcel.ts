import * as XLSX from "xlsx";

/**
 * Cleanly format an array of objects and download as a formatted .xlsx Excel file.
 */
export function exportTableToExcel(
  data: Record<string, any>[],
  filename: string = "veerracerss-club-data",
  sheetName: string = "Datasheet"
) {
  if (!data || data.length === 0) {
    alert("No records to export.");
    return;
  }

  // Create worksheet from JSON
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths
  const maxProps = Object.keys(data[0]);
  const colWidths = maxProps.map((key) => {
    const maxLen = Math.max(
      key.length,
      ...data.map((row) => (row[key] !== undefined && row[key] !== null ? String(row[key]).length : 0))
    );
    return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
  });
  worksheet["!cols"] = colWidths;

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));

  // Generate file name with timestamp
  const dateStr = new Date().toISOString().split("T")[0];
  const finalFilename = `${filename}-${dateStr}.xlsx`;

  // Write and trigger browser download
  XLSX.writeFile(workbook, finalFilename);
}

/**
 * Export multiple tables into a single comprehensive multi-tab Excel workbook.
 */
export function exportMultiSheetExcel(
  sheets: { sheetName: string; data: Record<string, any>[] }[],
  filename: string = "veerracerss-master-backup"
) {
  if (!sheets || sheets.length === 0) {
    alert("No sheets provided for export.");
    return;
  }

  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ sheetName, data }) => {
    if (data && data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const keys = Object.keys(data[0]);
      const colWidths = keys.map((key) => {
        const maxLen = Math.max(
          key.length,
          ...data.map((row) => (row[key] !== undefined && row[key] !== null ? String(row[key]).length : 0))
        );
        return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
      });
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));
    }
  });

  const dateStr = new Date().toISOString().split("T")[0];
  const finalFilename = `${filename}-${dateStr}.xlsx`;

  XLSX.writeFile(workbook, finalFilename);
}
