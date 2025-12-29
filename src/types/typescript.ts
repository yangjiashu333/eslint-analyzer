// Core TypeScript compiler output types
export interface TypeScriptDiagnostic {
  filePath: string; // Parsed from "src/App.tsx(10,5): error..."
  line: number; // Extracted line number
  column: number; // Extracted column number
  errorCode: string; // e.g., "TS2322", "TS2304"
  severity: 'error'; // TypeScript only has errors (no warnings)
  message: string; // Full error message
}

// Processed TypeScript output (array of diagnostics)
export type TypeScriptOutput = TypeScriptDiagnostic[];

// Filter state for TypeScript
export interface TypeScriptFilterState {
  errorCodes: string[]; // Filter by specific error codes
  searchTerm: string; // Search across files, messages, error codes
}

// File dimension statistics
export interface TypeScriptFileStatistic {
  filePath: string;
  errorCount: number;
  affectedErrorCodes: string[]; // Unique error codes in this file
  diagnostics: TypeScriptDiagnostic[];
}

// Error code dimension statistics
export interface TypeScriptErrorCodeStatistic {
  errorCode: string;
  totalCount: number;
  affectedFiles: Array<{
    filePath: string;
    count: number;
    diagnostics: TypeScriptDiagnostic[];
  }>;
}

// Overall statistics
export interface TypeScriptStatisticsData {
  totalFiles: number;
  totalErrors: number;
  fileStats: TypeScriptFileStatistic[];
  errorCodeStats: TypeScriptErrorCodeStatistic[];
}

// View mode type
export type TypeScriptViewMode = 'file' | 'error-code';

// Analysis mode type (for top-level toggle)
export type AnalysisMode = 'eslint' | 'typescript';
