import { useESLint } from '../../context/ESLintContext';
import type { SeverityFilter as SeverityFilterType } from '../../types/eslint';

export default function SeverityFilter() {
  const { filters, updateFilters } = useESLint();

  const options: Array<{ value: SeverityFilterType; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'errors', label: 'Errors Only' },
    { value: 'warnings', label: 'Warnings Only' },
  ];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => updateFilters({ severity: option.value })}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              filters.severity === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
