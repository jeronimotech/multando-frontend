import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export an array of objects to a CSV file and trigger a browser download.
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (data.length === 0) return;

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export a table to a PDF file and trigger a browser download.
 */
export function exportToPDF(
  title: string,
  columns: string[],
  rows: string[][],
  filename: string
): void {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.setTextColor(30, 43, 133); // brand-900
  doc.text(title, 14, 20);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // surface-500
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  // Table
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 35,
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [59, 94, 239], // brand-500
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [238, 244, 255], // brand-50
    },
    margin: { top: 35 },
  });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
