import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import type { TypeScriptErrorCodeStatistic } from '../../types/typescript';

interface TypeScriptErrorCodeTableProps {
  errorCodeStats: TypeScriptErrorCodeStatistic[];
}

export default function TypeScriptErrorCodeTable({
  errorCodeStats,
}: TypeScriptErrorCodeTableProps) {
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'count' | 'code'>('count');

  const toggleCode = (errorCode: string) => {
    setExpandedCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(errorCode)) {
        newSet.delete(errorCode);
      } else {
        newSet.add(errorCode);
      }
      return newSet;
    });
  };

  const sortedCodes = [...errorCodeStats].sort((a, b) => {
    if (sortBy === 'count') {
      return b.totalCount - a.totalCount;
    }
    return a.errorCode.localeCompare(b.errorCode);
  });

  if (errorCodeStats.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No error codes match the current filters
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
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('code')}
              >
                Error Code {sortBy === 'code' && '↓'}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('count')}
              >
                Total Count {sortBy === 'count' && '↓'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Affected Files
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {sortedCodes.map((errorCode) => {
              const isExpanded = expandedCodes.has(errorCode.errorCode);
              return (
                <>
                  <tr key={errorCode.errorCode} className="hover:bg-zinc-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCode(errorCode.errorCode)}
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
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-mono font-medium rounded">
                        {errorCode.errorCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-zinc-900">
                        {errorCode.totalCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm text-zinc-600">
                          {errorCode.affectedFiles.length} file
                          {errorCode.affectedFiles.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded details */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-zinc-50">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-zinc-900 mb-3">
                            Affected Files ({errorCode.affectedFiles.length})
                          </h4>
                          <div className="space-y-2">
                            {errorCode.affectedFiles.map((file) => (
                              <div
                                key={file.filePath}
                                className="border-l-2 border-purple-300 pl-4 py-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-mono text-zinc-900">
                                    {file.filePath}
                                  </span>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                                    {file.count} occurrence
                                    {file.count !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                {/* Optionally show first few diagnostics */}
                                <div className="mt-2 space-y-1">
                                  {file.diagnostics
                                    .slice(0, 2)
                                    .map((d, idx) => (
                                      <div
                                        key={idx}
                                        className="text-xs text-zinc-600 pl-4"
                                      >
                                        <span className="text-zinc-500 font-mono">
                                          Line {d.line}:{d.column}
                                        </span>{' '}
                                        — {d.message.split('\n')[0]}
                                      </div>
                                    ))}
                                  {file.diagnostics.length > 2 && (
                                    <div className="text-xs text-zinc-500 pl-4">
                                      + {file.diagnostics.length - 2} more
                                    </div>
                                  )}
                                </div>
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
