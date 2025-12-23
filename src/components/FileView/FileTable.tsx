import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import type { FileStatistic } from '../../types/eslint';

interface FileTableProps {
  fileStats: FileStatistic[];
}

export default function FileTable({ fileStats }: FileTableProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'errors' | 'warnings' | 'total'>(
    'total'
  );

  const toggleFile = (filePath: string) => {
    setExpandedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filePath)) {
        newSet.delete(filePath);
      } else {
        newSet.add(filePath);
      }
      return newSet;
    });
  };

  const copyFilePath = (filePath: string) => {
    navigator.clipboard.writeText(filePath);
  };

  const sortedFiles = [...fileStats].sort((a, b) => {
    switch (sortBy) {
      case 'errors':
        return b.errorCount - a.errorCount;
      case 'warnings':
        return b.warningCount - a.warningCount;
      default:
        return b.errorCount + b.warningCount - (a.errorCount + a.warningCount);
    }
  });

  if (fileStats.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No files match the current filters
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
                File Path
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
                Fixable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Rules
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {sortedFiles.map((file) => {
              const isExpanded = expandedFiles.has(file.filePath);
              return (
                <>
                  <tr key={file.filePath} className="hover:bg-zinc-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFile(file.filePath)}
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
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-zinc-900 break-all max-w-2xl">
                          {file.filePath}
                        </span>
                        <button
                          onClick={() => copyFilePath(file.filePath)}
                          className="text-zinc-400 hover:text-zinc-600 shrink-0 mt-0.5"
                          title="Copy path"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {file.errorCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {file.warningCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {file.fixableErrorCount + file.fixableWarningCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {file.affectedRules.length}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-zinc-50">
                        <div className="space-y-2">
                          {file.messages.map((msg, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-white rounded border border-zinc-200"
                            >
                              {msg.severity === 2 ? (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-zinc-500">
                                    {msg.line}:{msg.column}
                                  </span>
                                  {msg.ruleId && (
                                    <span className="text-xs font-medium text-blue-600">
                                      {msg.ruleId}
                                    </span>
                                  )}
                                  {msg.fix && (
                                    <span className="text-xs text-green-600">
                                      fixable
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-zinc-700">
                                  {msg.message}
                                </p>
                              </div>
                            </div>
                          ))}
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
