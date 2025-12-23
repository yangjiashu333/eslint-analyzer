import { Search, X } from 'lucide-react';
import { useESLint } from '../../context/ESLintContext';

export default function SearchBar() {
  const { filters, updateFilters } = useESLint();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchTerm: e.target.value });
  };

  const handleClear = () => {
    updateFilters({ searchTerm: '' });
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-zinc-400" />
      </div>
      <input
        type="text"
        value={filters.searchTerm}
        onChange={handleChange}
        placeholder="Search files, messages, or rules..."
        className="block w-full pl-10 pr-10 py-2 border border-zinc-300 rounded-lg text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {filters.searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
