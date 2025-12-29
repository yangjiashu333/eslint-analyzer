import { useState, useRef, useEffect } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { useTypeScript } from '../../context/TypeScriptContext';
import {
  exportTypeScriptAsJSON,
  exportTypeScriptFileSummaryCSV,
  exportTypeScriptErrorCodeSummaryCSV,
  exportTypeScriptDetailedCSV,
} from '../../utils/typescriptExport';

export default function TypeScriptExportButton() {
  const { filteredData, statistics } = useTypeScript();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!filteredData || !statistics) {
    return null;
  }

  const exportOptions = [
    {
      label: 'Export as JSON',
      icon: FileJson,
      onClick: () => exportTypeScriptAsJSON(filteredData),
    },
    {
      label: 'Export File Summary (CSV)',
      icon: FileText,
      onClick: () => exportTypeScriptFileSummaryCSV(statistics),
    },
    {
      label: 'Export Error Code Summary (CSV)',
      icon: FileText,
      onClick: () => exportTypeScriptErrorCodeSummaryCSV(statistics),
    },
    {
      label: 'Export Detailed Report (CSV)',
      icon: FileText,
      onClick: () => exportTypeScriptDetailedCSV(filteredData),
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-zinc-200 py-2 z-10">
          {exportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-zinc-50 transition-colors flex items-center gap-3"
              >
                <Icon className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-700">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
