import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  ESLintOutput,
  ESLintMetadata,
  StatisticsData,
  FilterState,
  ViewMode,
} from '../types/eslint';
import { calculateStatistics } from '../utils/statistics';
import { applyFilters, createDefaultFilters } from '../utils/filters';

interface ESLintContextValue {
  // Data
  rawData: ESLintOutput | null;
  filteredData: ESLintOutput | null;
  statistics: StatisticsData | null;
  metadata: ESLintMetadata | null;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Filters
  filters: FilterState;
  updateFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;

  // Actions
  setData: (data: ESLintOutput, metadata?: ESLintMetadata) => void;
  clearData: () => void;
}

const ESLintContext = createContext<ESLintContextValue | undefined>(undefined);

export function ESLintProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<ESLintOutput | null>(null);
  const [metadata, setMetadata] = useState<ESLintMetadata | null>(null);
  const [filters, setFilters] = useState<FilterState>(createDefaultFilters());
  const [viewMode, setViewMode] = useState<ViewMode>('file');

  // Apply filters to raw data
  const filteredData = useMemo(() => {
    if (!rawData) return null;
    return applyFilters(rawData, filters);
  }, [rawData, filters]);

  // Calculate statistics from filtered data
  const statistics = useMemo(() => {
    if (!filteredData) return null;
    return calculateStatistics(filteredData, metadata);
  }, [filteredData, metadata]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(createDefaultFilters());
  };

  const setData = (data: ESLintOutput, newMetadata?: ESLintMetadata) => {
    setRawData(data);
    setMetadata(newMetadata || null);
    // Reset filters when new data is loaded
    setFilters(createDefaultFilters());
  };

  const clearData = () => {
    setRawData(null);
    setMetadata(null);
    setFilters(createDefaultFilters());
  };

  const value: ESLintContextValue = {
    rawData,
    filteredData,
    statistics,
    metadata,
    viewMode,
    setViewMode,
    filters,
    updateFilters,
    clearFilters,
    setData,
    clearData,
  };

  return (
    <ESLintContext.Provider value={value}>{children}</ESLintContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useESLint() {
  const context = useContext(ESLintContext);
  if (context === undefined) {
    throw new Error('useESLint must be used within an ESLintProvider');
  }
  return context;
}
