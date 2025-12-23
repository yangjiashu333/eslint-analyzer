import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { RuleStatistic } from '../../types/eslint';

interface RuleTableProps {
  ruleStats: RuleStatistic[];
}

export default function RuleTable({ ruleStats }: RuleTableProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'total' | 'errors' | 'warnings'>(
    'total'
  );

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
      case 'errors':
        return b.errorCount - a.errorCount;
      case 'warnings':
        return b.warningCount - a.warningCount;
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
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('total')}
              >
                Total {sortBy === 'total' && '↓'}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('errors')}
              >
                Errors {sortBy === 'errors' && '↓'}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('warnings')}
              >
                Warnings {sortBy === 'warnings' && '↓'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Affected Files
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {sortedRules.map((rule) => {
              const isExpanded = expandedRules.has(rule.ruleId);
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
                      <span className="text-sm font-semibold text-zinc-900">
                        {rule.totalCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {rule.errorCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {rule.warningCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {rule.affectedFiles.length}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-zinc-50">
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
