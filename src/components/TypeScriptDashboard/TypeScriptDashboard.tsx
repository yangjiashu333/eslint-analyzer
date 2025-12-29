import { useTypeScript } from '../../context/TypeScriptContext';
import TypeScriptStatsSummary from './TypeScriptStatsSummary';
import TypeScriptViewSelector from '../TypeScriptViewSelector/TypeScriptViewSelector';
import TypeScriptFileTable from '../TypeScriptFileView/TypeScriptFileTable';
import TypeScriptErrorCodeTable from '../TypeScriptErrorCodeView/TypeScriptErrorCodeTable';
import TypeScriptFilterPanel from '../TypeScriptFilters/TypeScriptFilterPanel';
import TypeScriptExportButton from '../TypeScriptExport/TypeScriptExportButton';

export default function TypeScriptDashboard() {
  const { statistics, viewMode } = useTypeScript();

  if (!statistics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Statistics Summary */}
        <TypeScriptStatsSummary statistics={statistics} />

        {/* Filters */}
        <TypeScriptFilterPanel />

        {/* View Selector and Export */}
        <div className="mb-6 flex items-center justify-between">
          <TypeScriptViewSelector />
          <TypeScriptExportButton />
        </div>

        {/* View-specific Content */}
        {viewMode === 'file' ? (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Files ({statistics.fileStats.length})
            </h2>
            <TypeScriptFileTable fileStats={statistics.fileStats} />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Error Codes ({statistics.errorCodeStats.length})
            </h2>
            <TypeScriptErrorCodeTable
              errorCodeStats={statistics.errorCodeStats}
            />
          </div>
        )}
      </div>
    </div>
  );
}
