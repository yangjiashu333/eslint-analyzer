import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { RuleStatistic, ESLintMetadata } from '../../types/eslint';

interface RuleTableProps {
  ruleStats: RuleStatistic[];
  metadata: ESLintMetadata | null;
}

export default function RuleTable({ ruleStats, metadata }: RuleTableProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'total' | 'level' | 'fixable'>('total');

  // Helper function to get rule metadata
  const getRuleMeta = (ruleId: string) => {
    return metadata?.rulesMeta?.[ruleId];
  };

  const toggleRule = (ruleId: string) => {
    setExpandedRules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const sortedRules = [...ruleStats].sort((a, b) => {
    switch (sortBy) {
      case 'level':
        // Sort errors before warnings
        if (a.level === b.level) return b.totalCount - a.totalCount;
        return a.level === 'error' ? -1 : 1;
      case 'fixable':
        // Sort fixable before non-fixable
        if (a.fixable === b.fixable) return b.totalCount - a.totalCount;
        return a.fixable ? -1 : 1;
      default:
        return b.totalCount - a.totalCount;
    }
  });

  if (ruleStats.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No rules match the current filters
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">
                {/* Expand column */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Rule ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Description
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('total')}
              >
                Total {sortBy === 'total' && '↓'}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('level')}
              >
                Level {sortBy === 'level' && '↓'}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('fixable')}
              >
                Fixable {sortBy === 'fixable' && '↓'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Affected Files
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {sortedRules.map((rule) => {
              const isExpanded = expandedRules.has(rule.ruleId);
              const ruleMeta = getRuleMeta(rule.ruleId);
              const description = ruleMeta?.docs?.description;
              const url = ruleMeta?.docs?.url;

              return (
                <>
                  <tr key={rule.ruleId} className="hover:bg-zinc-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRule(rule.ruleId)}
                        className="text-zinc-400 hover:text-zinc-600"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-blue-600">
                        {rule.ruleId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {description && url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                        >
                          {description}
                        </a>
                      ) : description ? (
                        <span className="text-sm text-zinc-700">
                          {description}
                        </span>
                      ) : (
                        <span className="text-sm text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-zinc-900">
                        {rule.totalCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rule.level === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {rule.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rule.fixable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {rule.fixable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {rule.affectedFiles.length}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-zinc-50">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-zinc-900 mb-3">
                            Affected Files:
                          </h4>
                          <div className="grid gap-2">
                            {rule.affectedFiles.map((file) => (
                              <div
                                key={file.filePath}
                                className="flex items-start justify-between gap-4 p-3 bg-white rounded border border-zinc-200"
                              >
                                <span className="text-sm text-zinc-700 break-all flex-1">
                                  {file.filePath}
                                </span>
                                <span className="text-sm font-medium text-zinc-900 shrink-0 whitespace-nowrap">
                                  {file.count}{' '}
                                  {file.count === 1
                                    ? 'occurrence'
                                    : 'occurrences'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
