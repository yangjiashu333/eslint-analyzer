import type {
  TypeScriptOutput,
  TypeScriptStatisticsData,
} from '../types/typescript';

/**
 * Download a file to the user's computer
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate CSV from array of objects
 */
function generateCSV(headers: string[], rows: string[][]): string {
  const escapeCsvValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvLines = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => row.map(escapeCsvValue).join(',')),
  ];

  return csvLines.join('\n');
}

/**
 * Export TypeScript diagnostics as JSON
 */
export function exportTypeScriptAsJSON(
  data: TypeScriptOutput,
  filename = 'typescript-diagnostics.json'
): void {
  const content = JSON.stringify(data, null, 2);
  downloadFile(content, filename, 'application/json');
}

/**
 * Export file summary as CSV
 * Columns: File Path, Error Count, Unique Error Codes
 */
export function exportTypeScriptFileSummaryCSV(
  stats: TypeScriptStatisticsData,
  filename = 'typescript-file-summary.csv'
): void {
  const headers = ['File Path', 'Error Count', 'Unique Error Codes'];

  const rows = stats.fileStats.map((file) => [
    file.filePath,
    file.errorCount.toString(),
    file.affectedErrorCodes.join(', '),
  ]);

  const csv = generateCSV(headers, rows);
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export error code summary as CSV
 * Columns: Error Code, Total Count, Affected Files Count
 */
export function exportTypeScriptErrorCodeSummaryCSV(
  stats: TypeScriptStatisticsData,
  filename = 'typescript-error-code-summary.csv'
): void {
  const headers = ['Error Code', 'Total Count', 'Affected Files Count'];

  const rows = stats.errorCodeStats.map((errorCode) => [
    errorCode.errorCode,
    errorCode.totalCount.toString(),
    errorCode.affectedFiles.length.toString(),
  ]);

  const csv = generateCSV(headers, rows);
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export detailed diagnostics as CSV
 * Columns: File Path, Line, Column, Error Code, Message
 */
export function exportTypeScriptDetailedCSV(
  data: TypeScriptOutput,
  filename = 'typescript-detailed.csv'
): void {
  const headers = ['File Path', 'Line', 'Column', 'Error Code', 'Message'];

  const rows = data.map((diagnostic) => [
    diagnostic.filePath,
    diagnostic.line.toString(),
    diagnostic.column.toString(),
    diagnostic.errorCode,
    diagnostic.message,
  ]);

  const csv = generateCSV(headers, rows);
  downloadFile(csv, filename, 'text/csv');
}
