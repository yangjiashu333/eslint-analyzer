import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  TypeScriptOutput,
  TypeScriptStatisticsData,
  TypeScriptFilterState,
  TypeScriptViewMode,
} from '../types/typescript';
import { calculateTypeScriptStatistics } from '../utils/typescriptStatistics';
import {
  applyTypeScriptFilters,
  createDefaultTypeScriptFilters,
} from '../utils/typescriptFilters';

interface TypeScriptContextValue {
  // Data
  rawData: TypeScriptOutput | null;
  filteredData: TypeScriptOutput | null;
  statistics: TypeScriptStatisticsData | null;

  // View mode
  viewMode: TypeScriptViewMode;
  setViewMode: (mode: TypeScriptViewMode) => void;

  // Filters
  filters: TypeScriptFilterState;
  updateFilters: (filters: Partial<TypeScriptFilterState>) => void;
  clearFilters: () => void;

  // Actions
  setData: (data: TypeScriptOutput) => void;
  clearData: () => void;
}

const TypeScriptContext = createContext<TypeScriptContextValue | undefined>(
  undefined
);

export function TypeScriptProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<TypeScriptOutput | null>(null);
  const [filters, setFilters] = useState<TypeScriptFilterState>(
    createDefaultTypeScriptFilters()
  );
  const [viewMode, setViewMode] = useState<TypeScriptViewMode>('file');

  // Apply filters to raw data
  const filteredData = useMemo(() => {
    if (!rawData) return null;
    return applyTypeScriptFilters(rawData, filters);
  }, [rawData, filters]);

  // Calculate statistics from filtered data
  const statistics = useMemo(() => {
    if (!filteredData) return null;
    return calculateTypeScriptStatistics(filteredData);
  }, [filteredData]);

  const updateFilters = (newFilters: Partial<TypeScriptFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(createDefaultTypeScriptFilters());
  };

  const setData = (data: TypeScriptOutput) => {
    setRawData(data);
    // Reset filters when new data is loaded
    setFilters(createDefaultTypeScriptFilters());
  };

  const clearData = () => {
    setRawData(null);
    setFilters(createDefaultTypeScriptFilters());
  };

  const value: TypeScriptContextValue = {
    rawData,
    filteredData,
    statistics,
    viewMode,
    setViewMode,
    filters,
    updateFilters,
    clearFilters,
    setData,
    clearData,
  };

  return (
    <TypeScriptContext.Provider value={value}>
      {children}
    </TypeScriptContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTypeScript() {
  const context = useContext(TypeScriptContext);
  if (context === undefined) {
    throw new Error('useTypeScript must be used within a TypeScriptProvider');
  }
  return context;
}
