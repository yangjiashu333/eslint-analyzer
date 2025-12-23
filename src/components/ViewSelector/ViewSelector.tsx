import { FileText, ListTree } from 'lucide-react';
import { useESLint } from '../../context/ESLintContext';
import type { ViewMode } from '../../types/eslint';

export default function ViewSelector() {
  const { viewMode, setViewMode } = useESLint();

  const views: Array<{ mode: ViewMode; label: string; icon: typeof FileText }> =
    [
      { mode: 'file', label: 'File View', icon: FileText },
      { mode: 'rule', label: 'Rule View', icon: ListTree },
    ];

  return (
    <div className="flex gap-2 bg-zinc-100 p-1 rounded-lg inline-flex">
      {views.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm
            transition-colors duration-200
            ${
              viewMode === mode
                ? 'bg-white text-zinc-900 shadow'
                : 'text-zinc-600 hover:text-zinc-900'
            }
          `}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
