import type {
  ESLintMetadata,
  ESLintOutput,
  StatisticsData,
} from '../types/eslint';

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
 * Export data as JSON
 */
export function exportAsJSON(
  data: ESLintOutput,
  filename = 'eslint-report.json'
): void {
  const content = JSON.stringify(data, null, 2);
  downloadFile(content, filename, 'application/json');
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
 * Export file summary as CSV
 */
export function exportFileSummaryCSV(
  data: ESLintOutput,
  filename = 'eslint-file-summary.csv'
): void {
  const headers = [
    'File Path',
    'Error Count',
    'Warning Count',
    'Fixable Errors',
    'Fixable Warnings',
    'Total Issues',
  ];

  const rows = data.map((result) => [
    result.filePath,
    result.errorCount.toString(),
    result.warningCount.toString(),
    result.fixableErrorCount.toString(),
    result.fixableWarningCount.toString(),
    (result.errorCount + result.warningCount).toString(),
  ]);

  const csv = generateCSV(headers, rows);
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export rule summary as CSV
 */
export function exportRuleSummaryCSV(
  stats: StatisticsData,
  metadata: ESLintMetadata | null,
  filename = 'eslint-rule-summary.csv'
): void {
  const headers = [
    'Rule ID',
    'Total Count',
    'Level',
    'Fixable',
    'Affected Files Count',
  ];
  if (metadata !== null) {
    headers.push('Description', 'URL');
  }
  const rows = stats.ruleStats.map((rule) => {
    const ruleMeta = metadata?.rulesMeta?.[rule.ruleId];
    const description = ruleMeta?.docs?.description ?? '-';
    const url = ruleMeta?.docs?.url ?? '-';

    const baseRow = [
      rule.ruleId,
      rule.totalCount.toString(),
      rule.level,
      rule.fixable ? 'Yes' : 'No',
      rule.affectedFiles.length.toString(),
    ];

    if (metadata !== null) {
      return [...baseRow, description, url];
    } else {
      return baseRow;
    }
  });

  const csv = generateCSV(headers, rows);
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export detailed messages as CSV
 */
export function exportDetailedCSV(
  data: ESLintOutput,
  filename = 'eslint-detailed.csv'
): void {
  const headers = [
    'File Path',
    'Line',
    'Column',
    'Severity',
    'Rule ID',
    'Message',
    'Fixable',
  ];

  const rows: string[][] = [];

  for (const result of data) {
    for (const message of result.messages) {
      rows.push([
        result.filePath,
        message.line.toString(),
        message.column.toString(),
        message.severity === 2 ? 'Error' : 'Warning',
        message.ruleId || 'unknown',
        message.message,
        message.fix ? 'Yes' : 'No',
      ]);
    }
  }

  const csv = generateCSV(headers, rows);
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export rule details with affected files as CSV
 */
export function exportRuleDetailsCSV(
  stats: StatisticsData,
  filename = 'eslint-rule-details.csv'
): void {
  const headers = ['Rule ID', 'File Path', 'Occurrences in File'];

  const rows: string[][] = [];

  for (const rule of stats.ruleStats) {
    for (const file of rule.affectedFiles) {
      rows.push([rule.ruleId, file.filePath, file.count.toString()]);
    }
  }

  const csv = generateCSV(headers, rows);
  downloadFile(csv, filename, 'text/csv');
}
