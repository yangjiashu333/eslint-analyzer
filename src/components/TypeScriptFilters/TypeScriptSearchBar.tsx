import { Search, X } from 'lucide-react';
import { useTypeScript } from '../../context/TypeScriptContext';

export default function TypeScriptSearchBar() {
  const { filters, updateFilters } = useTypeScript();

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => updateFilters({ searchTerm: e.target.value })}
          placeholder="Search files, messages, error codes..."
          className="w-full pl-10 pr-10 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {filters.searchTerm && (
          <button
            onClick={() => updateFilters({ searchTerm: '' })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
