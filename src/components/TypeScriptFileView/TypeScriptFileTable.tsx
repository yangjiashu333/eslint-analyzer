import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, AlertCircle } from 'lucide-react';
import type { TypeScriptFileStatistic } from '../../types/typescript';

interface TypeScriptFileTableProps {
  fileStats: TypeScriptFileStatistic[];
}

export default function TypeScriptFileTable({
  fileStats,
}: TypeScriptFileTableProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'errors' | 'path'>('errors');

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
    if (sortBy === 'errors') {
      return b.errorCount - a.errorCount;
    }
    return a.filePath.localeCompare(b.filePath);
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
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('path')}
              >
                File Path {sortBy === 'path' && '↓'}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-700"
                onClick={() => setSortBy('errors')}
              >
                Errors {sortBy === 'errors' && '↓'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Error Codes
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-zinc-900">
                          {file.filePath}
                        </span>
                        <button
                          onClick={() => copyFilePath(file.filePath)}
                          className="text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy file path"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        <AlertCircle className="w-3 h-3" />
                        {file.errorCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {file.affectedErrorCodes.slice(0, 3).map((code) => (
                          <span
                            key={code}
                            className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-mono rounded"
                          >
                            {code}
                          </span>
                        ))}
                        {file.affectedErrorCodes.length > 3 && (
                          <span className="px-2 py-0.5 text-zinc-500 text-xs">
                            +{file.affectedErrorCodes.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded details */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-zinc-50">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-zinc-900 mb-3">
                            Diagnostics ({file.diagnostics.length})
                          </h4>
                          <div className="space-y-3">
                            {file.diagnostics.map((diagnostic, idx) => (
                              <div
                                key={idx}
                                className="border-l-2 border-red-300 pl-4 py-2"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-xs font-mono text-zinc-500">
                                    {diagnostic.line}:{diagnostic.column}
                                  </span>
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-mono rounded">
                                    {diagnostic.errorCode}
                                  </span>
                                  <p className="text-sm text-zinc-700 flex-1 whitespace-pre-wrap">
                                    {diagnostic.message}
                                  </p>
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
