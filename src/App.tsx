import { useState } from 'react';
import { ESLintProvider, useESLint } from './context/ESLintContext';
import { TypeScriptProvider, useTypeScript } from './context/TypeScriptContext';
import FileUpload from './components/FileUpload/FileUpload';
import TypeScriptFileUpload from './components/TypeScriptFileUpload/TypeScriptFileUpload';
import Dashboard from './components/Dashboard/Dashboard';
import TypeScriptDashboard from './components/TypeScriptDashboard/TypeScriptDashboard';
import { FileJson, Code2 } from 'lucide-react';
import type { AnalysisMode } from './types/typescript';

function AppContent() {
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('eslint');
  const { rawData: eslintData, clearData: clearESLintData } = useESLint();
  const { rawData: tsData, clearData: clearTSData } = useTypeScript();

  const hasData = analysisMode === 'eslint' ? eslintData : tsData;
  const clearCurrentData =
    analysisMode === 'eslint' ? clearESLintData : clearTSData;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {analysisMode === 'eslint' ? (
                <FileJson className="w-16 h-16 text-blue-600" />
              ) : (
                <Code2 className="w-16 h-16 text-purple-600" />
              )}
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">
              {analysisMode === 'eslint'
                ? 'ESLint Analyzer'
                : 'TypeScript Type Checker Analyzer'}
            </h1>
            <p className="text-lg text-zinc-600 mb-6">
              {analysisMode === 'eslint'
                ? 'Upload an ESLint JSON report to analyze errors, warnings, and patterns'
                : 'Upload TypeScript compiler output to analyze type errors'}
            </p>

            {/* Analysis mode toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg bg-zinc-200 p-1">
                <button
                  onClick={() => setAnalysisMode('eslint')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    analysisMode === 'eslint'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4" />
                    ESLint
                  </div>
                </button>
                <button
                  onClick={() => setAnalysisMode('typescript')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    analysisMode === 'typescript'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    TypeScript
                  </div>
                </button>
              </div>
            </div>
          </div>
          {analysisMode === 'eslint' ? (
            <FileUpload />
          ) : (
            <TypeScriptFileUpload />
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-white border-b border-zinc-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {analysisMode === 'eslint' ? (
                <FileJson className="w-8 h-8 text-blue-600" />
              ) : (
                <Code2 className="w-8 h-8 text-purple-600" />
              )}
              <h1 className="text-2xl font-bold text-zinc-900">
                {analysisMode === 'eslint'
                  ? 'ESLint Analyzer'
                  : 'TypeScript Analyzer'}
              </h1>
            </div>

            {/* Analysis mode toggle in header */}
            <div className="inline-flex rounded-lg bg-zinc-100 p-0.5">
              <button
                onClick={() => setAnalysisMode('eslint')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  analysisMode === 'eslint'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                ESLint
              </button>
              <button
                onClick={() => setAnalysisMode('typescript')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  analysisMode === 'typescript'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                TypeScript
              </button>
            </div>
          </div>

          <button
            onClick={clearCurrentData}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Upload New File
          </button>
        </div>
      </header>

      {analysisMode === 'eslint' ? <Dashboard /> : <TypeScriptDashboard />}
    </div>
  );
}

export default function App() {
  return (
    <ESLintProvider>
      <TypeScriptProvider>
        <AppContent />
      </TypeScriptProvider>
    </ESLintProvider>
  );
}
