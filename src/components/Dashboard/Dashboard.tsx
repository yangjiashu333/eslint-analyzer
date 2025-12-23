import { useESLint } from '../../context/ESLintContext';
import StatsSummary from './StatsSummary';
import ViewSelector from '../ViewSelector/ViewSelector';
import FileTable from '../FileView/FileTable';
import RuleTable from '../RuleView/RuleTable';
import FilterPanel from '../Filters/FilterPanel';
import ExportButton from '../Export/ExportButton';

export default function Dashboard() {
  const { statistics, viewMode } = useESLint();

  if (!statistics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Statistics Summary */}
        <StatsSummary statistics={statistics} />

        {/* Filters */}
        <FilterPanel />

        {/* View Selector and Export */}
        <div className="mb-6 flex items-center justify-between">
          <ViewSelector />
          <ExportButton />
        </div>

        {/* View-specific Content */}
        {viewMode === 'file' ? (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Files ({statistics.fileStats.length})
            </h2>
            <FileTable fileStats={statistics.fileStats} />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Rules ({statistics.ruleStats.length})
            </h2>
            <RuleTable ruleStats={statistics.ruleStats} />
          </div>
        )}
      </div>
    </div>
  );
}
