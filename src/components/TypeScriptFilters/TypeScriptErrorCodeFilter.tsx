import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTypeScript } from '../../context/TypeScriptContext';
import { getAllErrorCodes } from '../../utils/typescriptFilters';

export default function TypeScriptErrorCodeFilter() {
  const { rawData, filters, updateFilters } = useTypeScript();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allErrorCodes = rawData ? getAllErrorCodes(rawData) : [];
  const selectedCount = filters.errorCodes.length;

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

  const toggleErrorCode = (errorCode: string) => {
    const newErrorCodes = filters.errorCodes.includes(errorCode)
      ? filters.errorCodes.filter((code) => code !== errorCode)
      : [...filters.errorCodes, errorCode];
    updateFilters({ errorCodes: newErrorCodes });
  };

  const clearAll = () => {
    updateFilters({ errorCodes: [] });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        <span>Error Codes {selectedCount > 0 && `(${selectedCount})`}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 max-h-80 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-zinc-200 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-900">
              Select Error Codes
            </span>
            {selectedCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {allErrorCodes.length === 0 ? (
              <div className="p-4 text-sm text-zinc-500 text-center">
                No error codes found
              </div>
            ) : (
              <div className="p-2">
                {allErrorCodes.map((errorCode) => (
                  <label
                    key={errorCode}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-zinc-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.errorCodes.includes(errorCode)}
                      onChange={() => toggleErrorCode(errorCode)}
                      className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-zinc-900 font-mono">
                      {errorCode}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
