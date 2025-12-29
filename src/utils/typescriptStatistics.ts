import type {
  TypeScriptOutput,
  TypeScriptStatisticsData,
  TypeScriptFileStatistic,
  TypeScriptErrorCodeStatistic,
} from '../types/typescript';

/**
 * Calculate comprehensive statistics from TypeScript diagnostics
 * Includes both file dimension and error code dimension statistics
 * @param data - TypeScript diagnostics array
 */
export function calculateTypeScriptStatistics(
  data: TypeScriptOutput
): TypeScriptStatisticsData {
  // Initialize counters
  let totalErrors = 0;

  // Maps for aggregation
  const fileStatsMap = new Map<string, TypeScriptFileStatistic>();
  const errorCodeStatsMap = new Map<string, TypeScriptErrorCodeStatistic>();

  // Process each diagnostic
  for (const diagnostic of data) {
    totalErrors++;

    // Update or create file statistic
    if (!fileStatsMap.has(diagnostic.filePath)) {
      fileStatsMap.set(diagnostic.filePath, {
        filePath: diagnostic.filePath,
        errorCount: 0,
        affectedErrorCodes: [],
        diagnostics: [],
      });
    }

    const fileStat = fileStatsMap.get(diagnostic.filePath)!;
    fileStat.errorCount++;
    fileStat.diagnostics.push(diagnostic);

    // Track unique error codes for this file
    if (!fileStat.affectedErrorCodes.includes(diagnostic.errorCode)) {
      fileStat.affectedErrorCodes.push(diagnostic.errorCode);
    }

    // Update or create error code statistic
    if (!errorCodeStatsMap.has(diagnostic.errorCode)) {
      errorCodeStatsMap.set(diagnostic.errorCode, {
        errorCode: diagnostic.errorCode,
        totalCount: 0,
        affectedFiles: [],
      });
    }

    const errorCodeStat = errorCodeStatsMap.get(diagnostic.errorCode)!;
    errorCodeStat.totalCount++;

    // Find or create affected file entry for this error code
    let affectedFile = errorCodeStat.affectedFiles.find(
      (f) => f.filePath === diagnostic.filePath
    );

    if (!affectedFile) {
      affectedFile = {
        filePath: diagnostic.filePath,
        count: 0,
        diagnostics: [],
      };
      errorCodeStat.affectedFiles.push(affectedFile);
    }

    affectedFile.count++;
    affectedFile.diagnostics.push(diagnostic);
  }

  // Convert maps to arrays and sort
  const fileStats = Array.from(fileStatsMap.values()).sort(
    (a, b) => b.errorCount - a.errorCount
  );

  const errorCodeStats = Array.from(errorCodeStatsMap.values()).sort(
    (a, b) => b.totalCount - a.totalCount
  );

  // Sort affected error codes within each file
  fileStats.forEach((fileStat) => {
    fileStat.affectedErrorCodes.sort();
  });

  // Sort affected files within each error code by count (descending)
  errorCodeStats.forEach((errorCodeStat) => {
    errorCodeStat.affectedFiles.sort((a, b) => b.count - a.count);
  });

  return {
    totalFiles: fileStatsMap.size,
    totalErrors,
    fileStats,
    errorCodeStats,
  };
}

/**
 * Get top N files by error count
 */
export function getTopTypeScriptFiles(
  stats: TypeScriptStatisticsData,
  limit: number
): TypeScriptFileStatistic[] {
  return stats.fileStats.slice(0, limit);
}

/**
 * Get top N error codes by occurrence count
 */
export function getTopTypeScriptErrorCodes(
  stats: TypeScriptStatisticsData,
  limit: number
): TypeScriptErrorCodeStatistic[] {
  return stats.errorCodeStats.slice(0, limit);
}

/**
 * Get statistics for a specific file
 */
export function getTypeScriptFileStatistic(
  stats: TypeScriptStatisticsData,
  filePath: string
): TypeScriptFileStatistic | undefined {
  return stats.fileStats.find((f) => f.filePath === filePath);
}

/**
 * Get statistics for a specific error code
 */
export function getTypeScriptErrorCodeStatistic(
  stats: TypeScriptStatisticsData,
  errorCode: string
): TypeScriptErrorCodeStatistic | undefined {
  return stats.errorCodeStats.find((e) => e.errorCode === errorCode);
}
