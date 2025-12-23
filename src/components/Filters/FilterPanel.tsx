import { useESLint } from '../../context/ESLintContext';
import { hasActiveFilters } from '../../utils/filters';
import SeverityFilter from './SeverityFilter';
import RuleFilter from './RuleFilter';
import SearchBar from './SearchBar';

export default function FilterPanel() {
  const { filters, clearFilters } = useESLint();
  const hasFilters = hasActiveFilters(filters);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-700">Filter:</span>
          <SeverityFilter />
        </div>

        <RuleFilter />

        <SearchBar />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.severity !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {filters.severity === 'errors' ? 'Errors Only' : 'Warnings Only'}
            </span>
          )}
          {filters.ruleIds.map((ruleId) => (
            <span
              key={ruleId}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              {ruleId}
            </span>
          ))}
          {filters.searchTerm && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Search: "{filters.searchTerm}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}
