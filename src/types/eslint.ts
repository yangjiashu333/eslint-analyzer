// Core ESLint JSON output types
export interface ESLintFix {
  range: [number, number];
  text: string;
}

export interface ESLintSuggestion {
  desc: string;
  messageId?: string;
  fix: ESLintFix;
  data?: Record<string, unknown>;
}

export interface ESLintMessage {
  ruleId: string | null;
  severity: 1 | 2; // 1 = warning, 2 = error
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  nodeType?: string;
  messageId?: string;
  fix?: ESLintFix;
  suggestions?: ESLintSuggestion[];
  fatal?: boolean;
}

export interface ESLintResult {
  filePath: string;
  messages: ESLintMessage[];
  suppressedMessages: ESLintMessage[];
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  fatalErrorCount?: number;
  source?: string;
  output?: string;
  usedDeprecatedRules?: Array<{
    ruleId: string;
    replacedBy: string[];
  }>;
}

export type ESLintOutput = ESLintResult[];

// Application-specific types for filtering
export type SeverityFilter = 'all' | 'errors' | 'warnings';

export interface FilterState {
  severity: SeverityFilter;
  ruleIds: string[];
  searchTerm: string;
}

// File dimension statistics (按文件维度)
export interface FileStatistic {
  filePath: string;
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  affectedRules: string[]; // Unique rule IDs affecting this file
  messages: ESLintMessage[];
}

// Rule dimension statistics (按规则维度)
export interface RuleStatistic {
  ruleId: string;
  totalCount: number;
  errorCount: number; // How many are severity 2
  warningCount: number; // How many are severity 1
  affectedFiles: Array<{
    filePath: string;
    count: number; // Occurrences in this file
    messages: ESLintMessage[];
  }>;
}

// Overall statistics data
export interface StatisticsData {
  totalFiles: number;
  totalErrors: number;
  totalWarnings: number;
  totalFixable: number;
  fileStats: FileStatistic[];
  ruleStats: RuleStatistic[];
}

// View mode type
export type ViewMode = 'file' | 'rule';
