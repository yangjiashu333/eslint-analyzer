import type {
  TypeScriptOutput,
  TypeScriptFilterState,
} from '../types/typescript';

/**
 * Apply filters to TypeScript diagnostics
 * Filters by error codes and search term
 */
export function applyTypeScriptFilters(
  data: TypeScriptOutput,
  filters: TypeScriptFilterState
): TypeScriptOutput {
  return data.filter((diagnostic) => {
    // Error code filter
    if (filters.errorCodes.length > 0) {
      if (!filters.errorCodes.includes(diagnostic.errorCode)) {
        return false;
      }
    }

    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchesMessage = diagnostic.message.toLowerCase().includes(term);
      const matchesFile = diagnostic.filePath.toLowerCase().includes(term);
      const matchesErrorCode = diagnostic.errorCode
        .toLowerCase()
        .includes(term);

      if (!matchesMessage && !matchesFile && !matchesErrorCode) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get all unique error codes from TypeScript diagnostics
 */
export function getAllErrorCodes(data: TypeScriptOutput): string[] {
  const errorCodes = new Set<string>();

  for (const diagnostic of data) {
    errorCodes.add(diagnostic.errorCode);
  }

  return Array.from(errorCodes).sort();
}

/**
 * Check if any filters are active
 */
export function hasActiveTypeScriptFilters(
  filters: TypeScriptFilterState
): boolean {
  return filters.errorCodes.length > 0 || filters.searchTerm.trim() !== '';
}

/**
 * Create default filter state
 */
export function createDefaultTypeScriptFilters(): TypeScriptFilterState {
  return {
    errorCodes: [],
    searchTerm: '',
  };
}
