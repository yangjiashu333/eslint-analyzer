import type { ESLintOutput, FilterState } from '../types/eslint';

/**
 * Apply filters to ESLint output data
 * Filters by severity, rule IDs, and search term
 */
export function applyFilters(
  data: ESLintOutput,
  filters: FilterState
): ESLintOutput {
  return data
    .map((result) => {
      // Filter messages based on criteria
      const filteredMessages = result.messages.filter((msg) => {
        // Severity filter
        if (filters.severity === 'errors' && msg.severity !== 2) {
          return false;
        }
        if (filters.severity === 'warnings' && msg.severity !== 1) {
          return false;
        }

        // Rule filter
        if (filters.ruleIds.length > 0) {
          const ruleId = msg.ruleId || 'unknown';
          if (!filters.ruleIds.includes(ruleId)) {
            return false;
          }
        }

        // Search term filter
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          const matchesMessage = msg.message.toLowerCase().includes(term);
          const matchesFile = result.filePath.toLowerCase().includes(term);
          const matchesRule = (msg.ruleId || '').toLowerCase().includes(term);

          if (!matchesMessage && !matchesFile && !matchesRule) {
            return false;
          }
        }

        return true;
      });

      // Return modified result with filtered messages and updated counts
      return {
        ...result,
        messages: filteredMessages,
        errorCount: filteredMessages.filter((m) => m.severity === 2).length,
        warningCount: filteredMessages.filter((m) => m.severity === 1).length,
        fixableErrorCount: filteredMessages.filter(
          (m) => m.severity === 2 && m.fix
        ).length,
        fixableWarningCount: filteredMessages.filter(
          (m) => m.severity === 1 && m.fix
        ).length,
      };
    })
    .filter((result) => result.messages.length > 0); // Remove files with no matches
}

/**
 * Get all unique rule IDs from ESLint output
 */
export function getAllRuleIds(data: ESLintOutput): string[] {
  const ruleIds = new Set<string>();

  for (const result of data) {
    for (const message of result.messages) {
      ruleIds.add(message.ruleId || 'unknown');
    }
  }

  return Array.from(ruleIds).sort();
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.severity !== 'all' ||
    filters.ruleIds.length > 0 ||
    filters.searchTerm.trim() !== ''
  );
}

/**
 * Create default filter state
 */
export function createDefaultFilters(): FilterState {
  return {
    severity: 'all',
    ruleIds: [],
    searchTerm: '',
  };
}
