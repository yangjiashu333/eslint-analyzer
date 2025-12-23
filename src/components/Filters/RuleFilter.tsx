import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useESLint } from '../../context/ESLintContext';
import { getAllRuleIds } from '../../utils/filters';

export default function RuleFilter() {
  const { rawData, filters, updateFilters } = useESLint();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allRules = rawData ? getAllRuleIds(rawData) : [];
  const selectedCount = filters.ruleIds.length;

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

  const toggleRule = (ruleId: string) => {
    const newRuleIds = filters.ruleIds.includes(ruleId)
      ? filters.ruleIds.filter((id) => id !== ruleId)
      : [...filters.ruleIds, ruleId];
    updateFilters({ ruleIds: newRuleIds });
  };

  const clearAll = () => {
    updateFilters({ ruleIds: [] });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        <span>
          Rules {selectedCount > 0 && `(${selectedCount})`}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 max-h-80 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-zinc-200 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-900">
              Select Rules
            </span>
            {selectedCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {allRules.length === 0 ? (
              <div className="p-4 text-sm text-zinc-500 text-center">
                No rules found
              </div>
            ) : (
              <div className="p-2">
                {allRules.map((ruleId) => (
                  <label
                    key={ruleId}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-zinc-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.ruleIds.includes(ruleId)}
                      onChange={() => toggleRule(ruleId)}
                      className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-zinc-700 font-mono">
                      {ruleId}
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
