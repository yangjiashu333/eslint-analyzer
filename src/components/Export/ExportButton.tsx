import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { useESLint } from '../../context/ESLintContext';
import {
  exportAsJSON,
  exportFileSummaryCSV,
  exportRuleSummaryCSV,
  exportDetailedCSV,
  exportRuleDetailsCSV,
} from '../../utils/export';

export default function ExportButton() {
  const { rawData, filteredData, statistics } = useESLint();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!rawData || !filteredData || !statistics) {
    return null;
  }

  const hasFilters = rawData.length !== filteredData.length;

  const exportOptions = [
    {
      label: 'JSON (Full)',
      description: 'Original ESLint output',
      onClick: () => {
        exportAsJSON(rawData, 'eslint-report-full.json');
        setIsOpen(false);
      },
    },
    ...(hasFilters
      ? [
          {
            label: 'JSON (Filtered)',
            description: 'Current filtered view',
            onClick: () => {
              exportAsJSON(filteredData, 'eslint-report-filtered.json');
              setIsOpen(false);
            },
          },
        ]
      : []),
    {
      label: 'CSV (File Summary)',
      description: 'File-level statistics',
      onClick: () => {
        exportFileSummaryCSV(filteredData);
        setIsOpen(false);
      },
    },
    {
      label: 'CSV (Rule Summary)',
      description: 'Rule-level statistics',
      onClick: () => {
        exportRuleSummaryCSV(statistics);
        setIsOpen(false);
      },
    },
    {
      label: 'CSV (Rule Details)',
      description: 'Rules with affected files',
      onClick: () => {
        exportRuleDetailsCSV(statistics);
        setIsOpen(false);
      },
    },
    {
      label: 'CSV (Detailed)',
      description: 'All messages with details',
      onClick: () => {
        exportDetailedCSV(filteredData);
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="p-2">
            {exportOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.onClick}
                className="w-full text-left px-3 py-2 hover:bg-zinc-50 rounded transition-colors"
              >
                <div className="font-medium text-sm text-zinc-900">
                  {option.label}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
