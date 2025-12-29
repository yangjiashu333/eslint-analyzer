import { FileText, Hash } from 'lucide-react';
import { useTypeScript } from '../../context/TypeScriptContext';
import type { TypeScriptViewMode } from '../../types/typescript';

export default function TypeScriptViewSelector() {
  const { viewMode, setViewMode } = useTypeScript();

  const views: Array<{
    mode: TypeScriptViewMode;
    label: string;
    icon: typeof FileText;
  }> = [
    { mode: 'file', label: 'File View', icon: FileText },
    { mode: 'error-code', label: 'Error Code View', icon: Hash },
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
