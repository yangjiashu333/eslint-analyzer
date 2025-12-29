import { useTypeScript } from '../../context/TypeScriptContext';
import { hasActiveTypeScriptFilters } from '../../utils/typescriptFilters';
import TypeScriptErrorCodeFilter from './TypeScriptErrorCodeFilter';
import TypeScriptSearchBar from './TypeScriptSearchBar';

export default function TypeScriptFilterPanel() {
  const { filters, clearFilters } = useTypeScript();
  const hasFilters = hasActiveTypeScriptFilters(filters);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-700">Filter:</span>
          <TypeScriptErrorCodeFilter />
        </div>

        <TypeScriptSearchBar />

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
          {filters.errorCodes.map((errorCode) => (
            <span
              key={errorCode}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 font-mono"
            >
              {errorCode}
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
