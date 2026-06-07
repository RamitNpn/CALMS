"use client";

import * as XLSX from "xlsx";

export function exportToExcel(
  rows: Record<string, unknown>[],
  filename: string,
  headers: string[],
) {
  const worksheetData = [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
