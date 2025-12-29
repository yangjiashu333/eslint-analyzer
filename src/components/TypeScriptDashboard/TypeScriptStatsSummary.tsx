import { FileText, AlertCircle, Hash, TrendingUp } from 'lucide-react';
import type { TypeScriptStatisticsData } from '../../types/typescript';

interface TypeScriptStatsSummaryProps {
  statistics: TypeScriptStatisticsData;
}

export default function TypeScriptStatsSummary({
  statistics,
}: TypeScriptStatsSummaryProps) {
  // Find the most common error code
  const mostCommonError =
    statistics.errorCodeStats.length > 0
      ? statistics.errorCodeStats[0].errorCode
      : 'None';

  const stats = [
    {
      label: 'Total Files',
      value: statistics.totalFiles,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Total Errors',
      value: statistics.totalErrors,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      label: 'Unique Error Codes',
      value: statistics.errorCodeStats.length,
      icon: Hash,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Most Common',
      value: mostCommonError,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                  {typeof stat.value === 'number'
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
              </div>
              <div className={`p-3 ${stat.bg} rounded-full`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
