import type {
  ESLintOutput,
  StatisticsData,
  FileStatistic,
  RuleStatistic,
} from '../types/eslint';

/**
 * Calculate comprehensive statistics from ESLint output
 * Includes both file dimension and rule dimension statistics
 */
export function calculateStatistics(data: ESLintOutput): StatisticsData {
  // Initialize counters
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalFixable = 0;

  // Maps for aggregation
  const fileStatsMap = new Map<string, FileStatistic>();
  const ruleStatsMap = new Map<string, RuleStatistic>();

  // Process each file result
  for (const result of data) {
    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;
    totalFixable += result.fixableErrorCount + result.fixableWarningCount;

    // Collect unique rules for this file
    const affectedRules = new Set<string>();

    // Process each message
    for (const message of result.messages) {
      const ruleId = message.ruleId || 'unknown';
      affectedRules.add(ruleId);

      // Update rule statistics
      if (!ruleStatsMap.has(ruleId)) {
        ruleStatsMap.set(ruleId, {
          ruleId,
          totalCount: 0,
          errorCount: 0,
          warningCount: 0,
          affectedFiles: [],
        });
      }

      const ruleStat = ruleStatsMap.get(ruleId)!;
      ruleStat.totalCount++;

      if (message.severity === 2) {
        ruleStat.errorCount++;
      } else {
        ruleStat.warningCount++;
      }

      // Find or create affected file entry for this rule
      let affectedFile = ruleStat.affectedFiles.find(
        (f) => f.filePath === result.filePath
      );

      if (!affectedFile) {
        affectedFile = {
          filePath: result.filePath,
          count: 0,
          messages: [],
        };
        ruleStat.affectedFiles.push(affectedFile);
      }

      affectedFile.count++;
      affectedFile.messages.push(message);
    }

    // Create file statistic
    fileStatsMap.set(result.filePath, {
      filePath: result.filePath,
      errorCount: result.errorCount,
      warningCount: result.warningCount,
      fixableErrorCount: result.fixableErrorCount,
      fixableWarningCount: result.fixableWarningCount,
      affectedRules: Array.from(affectedRules),
      messages: result.messages,
    });
  }

  // Convert maps to arrays and sort
  const fileStats = Array.from(fileStatsMap.values()).sort(
    (a, b) => b.errorCount + b.warningCount - (a.errorCount + a.warningCount)
  );

  const ruleStats = Array.from(ruleStatsMap.values()).sort(
    (a, b) => b.totalCount - a.totalCount
  );

  return {
    totalFiles: data.length,
    totalErrors,
    totalWarnings,
    totalFixable,
    fileStats,
    ruleStats,
  };
}

/**
 * Get top N files by issue count
 */
export function getTopFiles(
  stats: StatisticsData,
  limit: number
): FileStatistic[] {
  return stats.fileStats.slice(0, limit);
}

/**
 * Get top N rules by occurrence count
 */
export function getTopRules(
  stats: StatisticsData,
  limit: number
): RuleStatistic[] {
  return stats.ruleStats.slice(0, limit);
}

/**
 * Get statistics for a specific file
 */
export function getFileStatistic(
  stats: StatisticsData,
  filePath: string
): FileStatistic | undefined {
  return stats.fileStats.find((f) => f.filePath === filePath);
}

/**
 * Get statistics for a specific rule
 */
export function getRuleStatistic(
  stats: StatisticsData,
  ruleId: string
): RuleStatistic | undefined {
  return stats.ruleStats.find((r) => r.ruleId === ruleId);
}
