import { FileText, AlertCircle, AlertTriangle, Wrench } from 'lucide-react';
import type { StatisticsData } from '../../types/eslint';

interface StatsSummaryProps {
  statistics: StatisticsData;
}

export default function StatsSummary({ statistics }: StatsSummaryProps) {
  const stats = [
    {
      label: 'Total Files',
      value: statistics.totalFiles,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Errors',
      value: statistics.totalErrors,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      label: 'Warnings',
      value: statistics.totalWarnings,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      label: 'Fixable',
      value: statistics.totalFixable,
      icon: Wrench,
      color: 'text-green-600',
      bg: 'bg-green-100',
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
                  {stat.value.toLocaleString()}
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
